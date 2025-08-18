import { useEffect, useRef, useCallback, useState } from 'react';
import WebSocketService, { ConnectionStatus } from '../services/websocket.service';
import { DirectMessage } from '../types/chat.types';

interface UseWebSocketOptions {
  otherUserId: string;
  onMessage?: (message: DirectMessage) => void;
  onStatusChange?: (status: ConnectionStatus) => void;
  onTyping?: (userId: string, isTyping: boolean) => void;
  autoConnect?: boolean;
}

interface UseWebSocketReturn {
  connectionStatus: ConnectionStatus;
  sendMessage: (content: string) => void;
  sendTyping: (isTyping: boolean) => void;
  connect: () => void;
  disconnect: () => void;
  isConnected: boolean;
  isConnecting: boolean;
}

export const useWebSocket = ({
  otherUserId,
  onMessage,
  onStatusChange,
  onTyping,
  autoConnect = true
}: UseWebSocketOptions): UseWebSocketReturn => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const unsubscribersRef = useRef<(() => void)[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const handleStatusChange = useCallback((status: ConnectionStatus) => {
    setConnectionStatus(status);
    onStatusChange?.(status);
  }, [onStatusChange]);

  const connect = useCallback(() => {
    if (!otherUserId) return;
    
    WebSocketService.connect(otherUserId);
  }, [otherUserId]);

  const disconnect = useCallback(() => {
    if (!otherUserId) return;
    
    WebSocketService.disconnect(otherUserId);
    setConnectionStatus('disconnected');
  }, [otherUserId]);

  const sendMessage = useCallback((content: string) => {
    if (!otherUserId || !content.trim()) return;
    
    WebSocketService.sendMessage(otherUserId, content);
  }, [otherUserId]);

  const sendTyping = useCallback((isTyping: boolean) => {
    if (!otherUserId) return;
    
    WebSocketService.sendTypingIndicator(otherUserId, isTyping);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        WebSocketService.sendTypingIndicator(otherUserId, false);
      }, 5000);
    }
  }, [otherUserId]);

  useEffect(() => {
    if (!otherUserId) return;

    unsubscribersRef.current.forEach(unsub => unsub());
    unsubscribersRef.current = [];

    if (onMessage) {
      const unsubMessage = WebSocketService.addMessageListener(otherUserId, onMessage);
      unsubscribersRef.current.push(unsubMessage);
    }

    const unsubStatus = WebSocketService.addStatusListener(otherUserId, handleStatusChange);
    unsubscribersRef.current.push(unsubStatus);

    if (onTyping) {
      const unsubTyping = WebSocketService.addTypingListener(otherUserId, onTyping);
      unsubscribersRef.current.push(unsubTyping);
    }

    if (autoConnect) {
      connect();
    }

    const currentStatus = WebSocketService.getConnectionStatus(otherUserId);
    setConnectionStatus(currentStatus);

    return () => {
      unsubscribersRef.current.forEach(unsub => unsub());
      unsubscribersRef.current = [];
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [otherUserId, onMessage, onTyping, handleStatusChange, autoConnect, connect]);

  return {
    connectionStatus,
    sendMessage,
    sendTyping,
    connect,
    disconnect,
    isConnected: connectionStatus === 'connected',
    isConnecting: connectionStatus === 'connecting'
  };
};