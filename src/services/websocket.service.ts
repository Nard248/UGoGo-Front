import { DirectMessage, WebSocketMessage } from '../types/chat.types';
import { getCurrentUserId, getJWTToken } from '../utils/auth';

interface WebSocketConnection {
  ws: WebSocket | null;
  userId: string;
  reconnectAttempts: number;
  messageQueue: WebSocketMessage[];
  listeners: Set<(message: DirectMessage) => void>;
  statusListeners: Set<(status: ConnectionStatus) => void>;
  typingListeners: Set<(userId: string, isTyping: boolean) => void>;
}

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

class WebSocketService {
  private static instance: WebSocketService;
  private connections: Map<string, WebSocketConnection> = new Map();
  private reconnectDelay = 1000;
  private maxReconnectDelay = 30000;
  private maxReconnectAttempts = 10;
  private heartbeatInterval = 30000;
  private heartbeatTimers: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  private getWebSocketUrl(otherUserId: string, token?: string): string {
    // Use clean WebSocket URL format matching backend requirements
    const baseUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:8000';
    
    // Backend expects: ws://localhost:8000/ws/chat/dm/user/<other_user_id>/?token=<jwt_token>
    // Use query parameter authentication method as recommended by backend
    let url = `${baseUrl}/ws/chat/dm/user/${otherUserId}/`;
    
    if (token) {
      url += `?token=${encodeURIComponent(token)}`;
    }
    
    return url;
  }

  public connect(otherUserId: string): void {
    const existingConnection = this.connections.get(otherUserId);
    
    if (existingConnection?.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    const connection: WebSocketConnection = existingConnection || {
      ws: null,
      userId: otherUserId,
      reconnectAttempts: 0,
      messageQueue: [],
      listeners: new Set(),
      statusListeners: new Set(),
      typingListeners: new Set()
    };

    try {
      const token = getJWTToken();
      const currentUserId = getCurrentUserId();
      
      console.log('🔐 WebSocket authentication details:', {
        hasToken: !!token,
        tokenLength: token?.length || 0,
        currentUserId,
        otherUserId,
        tokenStorageKey: localStorage.getItem('jwt_token') ? 'jwt_token' : 'access'
      });
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Use query parameter authentication method as recommended by backend
      const wsUrl = this.getWebSocketUrl(otherUserId, token);
      console.log('🔗 WebSocket URL:', wsUrl.replace(/token=[^&]+/, 'token=***')); // Hide token in logs
      
      console.log('🔐 Using query parameter authentication...');
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log(`WebSocket connected to user ${otherUserId}`);
        connection.reconnectAttempts = 0;
        this.notifyStatusListeners(connection, 'connected');
        
        this.flushMessageQueue(connection);
        this.setupHeartbeat(otherUserId);
        
        // No need to send auth message - authentication is handled via URL query parameter
      };

      ws.onmessage = (event) => {
        try {
          let payload = event.data;
          try {
            payload = JSON.parse(event.data);
          } catch {}

          // Handle typing indicators
          if (payload.type === 'typing') {
            this.notifyTypingListeners(connection, payload.sender_id, payload.is_typing);
            return;
          }

          // Handle regular messages
          const content = typeof payload === 'string' ? payload : payload?.content ?? '';
          const sender_id = payload?.sender_id;

          if (content) {
            const message: DirectMessage = {
              id: payload.id || `ws-${Date.now()}`,
              thread: payload.thread || `thread-${otherUserId}`,
              sender: payload.sender || sender_id?.toString() || 'unknown',
              sender_id: sender_id,
              content: content,
              created_at: payload.created_at || new Date().toISOString(),
              is_read: payload.is_read || false,
              edited: payload.edited || false,
              deleted: payload.deleted || false
            };
            
            console.log('WebSocket received message:', message);
            this.notifyListeners(connection, message);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error(`❌ WebSocket error for user ${otherUserId}:`, error);
        console.error('🔍 WebSocket error details:', {
          url: ws.url,
          readyState: ws.readyState,
          protocol: ws.protocol
        });
        this.notifyStatusListeners(connection, 'error');
      };

      ws.onclose = (event) => {
        console.log(`🔌 WebSocket closed for user ${otherUserId}`, {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
          url: ws.url
        });
        
        // Common WebSocket close codes:
        // 1000 = Normal closure
        // 1001 = Going away
        // 1006 = Abnormal closure (often "Insufficient resources")
        // 4401 = Unauthorized
        // 4403 = Forbidden
        
        if (event.code === 1006) {
          console.error('💡 WebSocket 1006 error suggests:');
          console.error('   - Backend WebSocket server not running');
          console.error('   - Wrong WebSocket URL');
          console.error('   - Network connectivity issues');
          console.error('   - CORS/authentication issues');
        }
        
        this.clearHeartbeat(otherUserId);
        this.notifyStatusListeners(connection, 'disconnected');
        
        if (event.code !== 1000 && event.code !== 1001) {
          this.scheduleReconnect(otherUserId);
        }
      };

      connection.ws = ws;
      this.connections.set(otherUserId, connection);

    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this.notifyStatusListeners(connection, 'error');
    }
  }

  private setupHeartbeat(userId: string): void {
    this.clearHeartbeat(userId);
    
    const timer = setInterval(() => {
      const connection = this.connections.get(userId);
      if (connection?.ws?.readyState === WebSocket.OPEN) {
        connection.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, this.heartbeatInterval);

    this.heartbeatTimers.set(userId, timer);
  }

  private clearHeartbeat(userId: string): void {
    const timer = this.heartbeatTimers.get(userId);
    if (timer) {
      clearInterval(timer);
      this.heartbeatTimers.delete(userId);
    }
  }

  private scheduleReconnect(userId: string): void {
    const connection = this.connections.get(userId);
    if (!connection) return;

    if (connection.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error(`Max reconnection attempts reached for user ${userId}`);
      this.notifyStatusListeners(connection, 'error');
      return;
    }

    connection.reconnectAttempts++;
    const delay = Math.min(
      this.reconnectDelay * Math.pow(2, connection.reconnectAttempts - 1),
      this.maxReconnectDelay
    );

    console.log(`Reconnecting to user ${userId} in ${delay}ms (attempt ${connection.reconnectAttempts})`);
    this.notifyStatusListeners(connection, 'connecting');

    setTimeout(() => {
      this.connect(userId);
    }, delay);
  }

  private flushMessageQueue(connection: WebSocketConnection): void {
    if (connection.ws?.readyState === WebSocket.OPEN) {
      while (connection.messageQueue.length > 0) {
        const message = connection.messageQueue.shift();
        if (message) {
          connection.ws.send(JSON.stringify(message));
        }
      }
    }
  }

  public sendMessage(otherUserId: string, content: string): void {
    const connection = this.connections.get(otherUserId);
    
    console.log('🚀 sendMessage called:', {
      otherUserId,
      content: content.trim(),
      connectionExists: !!connection,
      wsReadyState: connection?.ws?.readyState,
      WebSocketStates: {
        CONNECTING: WebSocket.CONNECTING,
        OPEN: WebSocket.OPEN,
        CLOSING: WebSocket.CLOSING,
        CLOSED: WebSocket.CLOSED
      }
    });
    
    if (!connection) {
      console.log('❌ No connection found, creating one and retrying...');
      this.connect(otherUserId);
      setTimeout(() => this.sendMessage(otherUserId, content), 1000);
      return;
    }

    // Simple message format matching Next.js example
    const message = {
      content: content.trim()
    };

    console.log('📤 Preparing to send WebSocket message:', message);
    console.log('🔌 WebSocket connection status:', {
      readyState: connection.ws?.readyState,
      url: connection.ws?.url,
      isOpen: connection.ws?.readyState === WebSocket.OPEN
    });

    if (connection.ws?.readyState === WebSocket.OPEN) {
      try {
        const messageStr = JSON.stringify(message);
        console.log('✅ Sending message via WebSocket:', messageStr);
        connection.ws.send(messageStr);
        console.log('✅ Message sent successfully via WebSocket');
      } catch (error) {
        console.error('❌ Failed to send message via WebSocket:', error);
        const queueMessage: WebSocketMessage = {
          content,
          timestamp: new Date().toISOString(),
          type: 'message'
        };
        connection.messageQueue.push(queueMessage);
        console.log('📥 Message queued due to send error');
      }
    } else {
      console.log('⏳ WebSocket not ready, queuing message. State:', connection.ws?.readyState);
      const queueMessage: WebSocketMessage = {
        content,
        timestamp: new Date().toISOString(),
        type: 'message'
      };
      connection.messageQueue.push(queueMessage);
      console.log('📥 Message added to queue');
      if (connection.ws?.readyState !== WebSocket.CONNECTING) {
        console.log('🔄 WebSocket not connecting, attempting to connect...');
        this.connect(otherUserId);
      }
    }
  }

  public sendTypingIndicator(otherUserId: string, isTyping: boolean): void {
    const connection = this.connections.get(otherUserId);
    
    if (connection?.ws?.readyState === WebSocket.OPEN) {
      connection.ws.send(JSON.stringify({
        type: 'typing',
        is_typing: isTyping
      }));
    }
  }

  public disconnect(userId: string): void {
    const connection = this.connections.get(userId);
    
    if (connection) {
      this.clearHeartbeat(userId);
      
      if (connection.ws) {
        connection.ws.close(1000, 'User disconnected');
        connection.ws = null;
      }
      
      this.connections.delete(userId);
    }
  }

  public disconnectAll(): void {
    this.connections.forEach((_, userId) => {
      this.disconnect(userId);
    });
  }

  public addMessageListener(userId: string, callback: (message: DirectMessage) => void): () => void {
    let connection = this.connections.get(userId);
    
    if (!connection) {
      connection = {
        ws: null,
        userId,
        reconnectAttempts: 0,
        messageQueue: [],
        listeners: new Set(),
        statusListeners: new Set(),
        typingListeners: new Set()
      };
      this.connections.set(userId, connection);
    }

    connection.listeners.add(callback);

    return () => {
      connection?.listeners.delete(callback);
    };
  }

  public addStatusListener(userId: string, callback: (status: ConnectionStatus) => void): () => void {
    let connection = this.connections.get(userId);
    
    if (!connection) {
      connection = {
        ws: null,
        userId,
        reconnectAttempts: 0,
        messageQueue: [],
        listeners: new Set(),
        statusListeners: new Set(),
        typingListeners: new Set()
      };
      this.connections.set(userId, connection);
    }

    connection.statusListeners.add(callback);

    return () => {
      connection?.statusListeners.delete(callback);
    };
  }

  public addTypingListener(userId: string, callback: (userId: string, isTyping: boolean) => void): () => void {
    let connection = this.connections.get(userId);
    
    if (!connection) {
      connection = {
        ws: null,
        userId,
        reconnectAttempts: 0,
        messageQueue: [],
        listeners: new Set(),
        statusListeners: new Set(),
        typingListeners: new Set()
      };
      this.connections.set(userId, connection);
    }

    connection.typingListeners.add(callback);

    return () => {
      connection?.typingListeners.delete(callback);
    };
  }

  private notifyListeners(connection: WebSocketConnection, message: DirectMessage): void {
    connection.listeners.forEach(callback => {
      try {
        callback(message);
      } catch (error) {
        console.error('Error in message listener:', error);
      }
    });
  }

  private notifyStatusListeners(connection: WebSocketConnection, status: ConnectionStatus): void {
    connection.statusListeners.forEach(callback => {
      try {
        callback(status);
      } catch (error) {
        console.error('Error in status listener:', error);
      }
    });
  }

  private notifyTypingListeners(connection: WebSocketConnection, userId: string, isTyping: boolean): void {
    connection.typingListeners.forEach(callback => {
      try {
        callback(userId, isTyping);
      } catch (error) {
        console.error('Error in typing listener:', error);
      }
    });
  }

  public getConnectionStatus(userId: string): ConnectionStatus {
    const connection = this.connections.get(userId);
    
    if (!connection || !connection.ws) {
      return 'disconnected';
    }

    switch (connection.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
      case WebSocket.CLOSED:
        return 'disconnected';
      default:
        return 'disconnected';
    }
  }
}

export default WebSocketService.getInstance();