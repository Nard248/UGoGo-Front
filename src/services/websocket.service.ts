import { DirectMessage, WebSocketMessage } from '../types/chat.types';
import { getCurrentUserId, getJWTToken } from '../utils/auth';

interface WebSocketConnection {
  ws: WebSocket | null;
  userId: string;
  thread_id?: string; // Add this line
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
  private connectionPromises: Map<string, Promise<void>> = new Map();
  private isConnecting: Map<string, boolean> = new Map();
  private reconnectDelay = 1000;
  private maxReconnectDelay = 30000;
  private maxReconnectAttempts = 10;
  private heartbeatInterval = 30000;
  private heartbeatTimers: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {
    // Add global error handler for unhandled WebSocket errors
    if (typeof window !== 'undefined') {
      window.addEventListener('unhandledrejection', (event) => {
        // Check if it's a WebSocket-related error
        if (event.reason && (event.reason.target instanceof WebSocket || 
            event.reason.message?.includes('WebSocket'))) {
          console.warn('Handled WebSocket rejection:', event.reason);
          event.preventDefault(); // Prevent the error from bubbling up
        }
      });
    }
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  private getWebSocketUrl(otherUserId: string, token?: string): string {
    // Use Azure backend with secure WebSocket (wss://)
    const baseUrl = process.env.REACT_APP_WS_URL || 'wss://ugogo-backend.blackflower-e8d746fa.eastus.azurecontainerapps.io';
    
    // Backend expects: wss://domain/ws/chat/dm/user/<other_user_id>/?token=<jwt_token>
    // Use query parameter authentication method as recommended by backend
    let url = `${baseUrl}/ws/chat/dm/user/${otherUserId}/`;
    
    if (token) {
      url += `?token=${encodeURIComponent(token)}`;
    }
    
    return url;
  }

  public async connect(otherUserId: string): Promise<void> {
    // Prevent multiple simultaneous connections
    if (this.isConnecting.get(otherUserId)) {
      console.log('🔄 Connection already in progress for user:', otherUserId);
      const existingPromise = this.connectionPromises.get(otherUserId);
      if (existingPromise) {
        await existingPromise;
      }
      return;
    }

    const existingConnection = this.connections.get(otherUserId);
    
    if (existingConnection?.ws?.readyState === WebSocket.OPEN) {
      console.log('✅ Already connected to user:', otherUserId);
      return;
    }

    // Close any existing connection that's not open
    if (existingConnection?.ws) {
      console.log('🔄 Closing existing non-open connection');
      existingConnection.ws.close();
      existingConnection.ws = null;
    }

    this.isConnecting.set(otherUserId, true);
    
    const connectionPromise = new Promise<void>((resolve, reject) => {
      const connection: WebSocketConnection = existingConnection || {
        ws: null,
        userId: otherUserId,
        thread_id: '',
        reconnectAttempts: 0,
        messageQueue: [],
        listeners: new Set(),
        statusListeners: new Set(),
        typingListeners: new Set()
      };

      try {
        const token = getJWTToken();
        
        if (!token) {
          console.error('❌ No JWT token found');
          this.notifyStatusListeners(connection, 'error');
          this.isConnecting.set(otherUserId, false);
          reject(new Error('No JWT token'));
          return;
        }
        
        const wsUrl = this.getWebSocketUrl(otherUserId, token);
        console.log('🔌 Creating WebSocket connection');
        console.log('   Backend:', wsUrl.replace(/token=[^&]+/, 'token=***'));
        console.log('   User ID:', otherUserId);
        console.log('   Protocol:', wsUrl.startsWith('wss://') ? 'Secure (WSS)' : 'Insecure (WS)');
        
        let ws: WebSocket;
        try {
          ws = new WebSocket(wsUrl);
        } catch (wsError) {
          console.error('Failed to create WebSocket instance:', wsError);
          this.isConnecting.set(otherUserId, false);
          resolve(); // Resolve to prevent unhandled rejection
          return;
        }
        
        connection.ws = ws;
        
        // Store connection immediately
        this.connections.set(otherUserId, connection);

        ws.onopen = () => {
          console.log(`✅ WebSocket connected successfully!`);
          console.log(`   Connected to user: ${otherUserId}`);
          console.log(`   Backend: Azure (${wsUrl.split('/ws/')[0]})`);
          this.notifyStatusListeners(connection, 'connected');
          
          // Process any queued messages
          while (connection.messageQueue.length > 0) {
            const queuedMsg = connection.messageQueue.shift();
            if (queuedMsg) {
              const msg = { content: queuedMsg.content };
              console.log('📤 Sending queued message:', msg);
              ws.send(JSON.stringify(msg));
            }
          }
          
          connection.reconnectAttempts = 0;
          this.isConnecting.set(otherUserId, false);
          resolve();
        };

        ws.onerror = (error) => {
          console.error(`❌ WebSocket error for user ${otherUserId}:`, error);
          this.notifyStatusListeners(connection, 'error');
          this.isConnecting.set(otherUserId, false);
          // Don't reject here - let onclose handle it
          // This prevents unhandled promise rejections
        };

        ws.onclose = (event) => {
          console.log(`🔌 WebSocket closed for user ${otherUserId}:`, event.code, event.reason);
          this.notifyStatusListeners(connection, 'disconnected');
          this.isConnecting.set(otherUserId, false);
          
          // Check if connection was ever established
          const wasConnected = connection.ws?.readyState === WebSocket.OPEN;
          
          // Only reconnect if it wasn't a normal closure
          if (event.code !== 1000 && event.code !== 1001) {
            if (connection.reconnectAttempts < this.maxReconnectAttempts) {
              const delay = Math.min(this.reconnectDelay * Math.pow(2, connection.reconnectAttempts), this.maxReconnectDelay);
              console.log(`🔄 Reconnecting in ${delay}ms...`);
              setTimeout(() => {
                connection.reconnectAttempts++;
                this.connect(otherUserId).catch(err => {
                  console.error('Reconnection failed:', err);
                });
              }, delay);
            } else {
              // Max reconnection attempts reached
              console.error('Max reconnection attempts reached');
              resolve(); // Resolve instead of reject to prevent unhandled errors
            }
          } else {
            // Normal closure
            resolve();
          }
        };

        ws.onmessage = (event) => {
          console.log('📨 WebSocket message received:', event.data);
          try {
            const payload = JSON.parse(event.data);
            
            // Handle regular message
            if (payload.content) {
              const message: DirectMessage = {
                id: payload.id || `ws-${Date.now()}`,
                thread: payload.thread || '',
                sender: '',
                sender_id: payload.sender_id,
                content: payload.content,
                created_at: payload.created_at || new Date().toISOString(),
                is_read: false,
                edited: false,
                deleted: false
              };
              
              this.notifyListeners(connection, message);
            }
          } catch (error) {
            console.error('Error parsing message:', error);
          }
        };

      } catch (error) {
        console.error('Failed to create WebSocket:', error);
        this.isConnecting.set(otherUserId, false);
        // Resolve instead of reject to prevent unhandled promise rejection
        resolve();
      }
    });

    this.connectionPromises.set(otherUserId, connectionPromise);
    await connectionPromise;
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

  public async sendMessage(otherUserId: string, content: string): Promise<void> {
    console.log('📤 sendMessage called:', { otherUserId, content });
    
    // Ensure connection exists and is stable
    await this.connect(otherUserId);
    
    const connection = this.connections.get(otherUserId);
    
    if (!connection) {
      throw new Error('Failed to establish connection');
    }

    const message = { content: content.trim() };
    
    if (connection.ws?.readyState === WebSocket.OPEN) {
      try {
        console.log('✅ Sending message immediately:', message);
        connection.ws.send(JSON.stringify(message));
      } catch (error) {
        console.error('❌ Send failed:', error);
        throw error;
      }
    } else {
      console.log('⏳ Connection not ready, queuing message');
      connection.messageQueue.push({
        content: content.trim(),
        timestamp: new Date().toISOString(),
        type: 'message'
      });
      
      // Try to reconnect
      await this.connect(otherUserId);
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
        thread_id: '',
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
        thread_id: '',
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
        thread_id: '',
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