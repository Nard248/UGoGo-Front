/**
 * WebSocket testing utilities for debugging message sending
 */

import WebSocketService from '../services/websocket.service';
import { getCurrentUserId, getJWTToken } from './auth';

export const testWebSocketConnection = async (otherUserId: string) => {
  console.group('🧪 Testing WebSocket Connection');
  
  const currentUserId = getCurrentUserId();
  const token = getJWTToken();
  
  console.log('Test Parameters:', {
    currentUserId,
    otherUserId,
    hasToken: !!token
  });
  
  try {
    // Test connection
    console.log('🔌 Attempting to connect to WebSocket...');
    WebSocketService.connect(otherUserId);
    
    // Wait a moment for connection
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check connection status
    const status = WebSocketService.getConnectionStatus(otherUserId);
    console.log('📊 Connection Status:', status);
    
    if (status === 'connected') {
      console.log('✅ WebSocket connected successfully');
      
      // Test sending a message
      console.log('📤 Testing message send...');
      const testMessage = `Test message from user ${currentUserId} at ${new Date().toISOString()}`;
      WebSocketService.sendMessage(otherUserId, testMessage);
      
      console.log('✅ Test message sent');
    } else {
      console.error('❌ WebSocket not connected. Status:', status);
    }
    
  } catch (error) {
    console.error('❌ WebSocket test failed:', error);
  }
  
  console.groupEnd();
};

export const testDirectWebSocketConnection = async (otherUserId: string) => {
  console.group('🧪 Direct WebSocket Test - Following Backend Specification');
  
  const currentUserId = getCurrentUserId();
  const token = getJWTToken();
  const baseUrl = 'ws://localhost:8000'; // Match Postman working example
  
  // Follow backend specification: ws://domain/ws/chat/dm/user/<other_user_id>/
  // With token query parameter fallback since browser WebSocket doesn't support headers
  const wsUrl = token 
    ? `${baseUrl}/ws/chat/dm/user/${otherUserId}/?token=${token}`
    : `${baseUrl}/ws/chat/dm/user/${otherUserId}/`;
  
  console.log('Direct WebSocket URL (spec compliant):', wsUrl);
  console.log('Auth token present:', !!token);
  console.log('Token storage key:', localStorage.getItem('jwt_token') ? 'jwt_token' : 'access');
  console.log('Current user ID:', currentUserId);
  
  try {
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('✅ Direct WebSocket connected');
      
      // Send test message following backend specification format: {content: "message"}
      const testMessage = {
        content: `Direct test message from user ${currentUserId} at ${new Date().toISOString()}`
      };
      
      console.log('📤 Sending direct test message (spec format):', testMessage);
      ws.send(JSON.stringify(testMessage));
    };
    
    ws.onmessage = (event) => {
      console.log('📨 Received message:', event.data);
      try {
        const parsed = JSON.parse(event.data);
        console.log('📨 Parsed message:', parsed);
      } catch (e) {
        console.log('📨 Raw message:', event.data);
      }
    };
    
    ws.onerror = (error) => {
      console.error('❌ Direct WebSocket error:', error);
    };
    
    ws.onclose = (event) => {
      console.log('🔌 Direct WebSocket closed:', event.code, event.reason);
    };
    
    // Keep connection open for testing
    setTimeout(() => {
      if (ws.readyState === WebSocket.OPEN) {
        console.log('🔌 Closing direct WebSocket after test');
        ws.close();
      }
    }, 10000);
    
  } catch (error) {
    console.error('❌ Direct WebSocket test failed:', error);
  }
  
  console.groupEnd();
};

// Console helpers
export const addWebSocketTestsToConsole = () => {
  (window as any).testWebSocket = testWebSocketConnection;
  (window as any).testDirectWebSocket = testDirectWebSocketConnection;
  
  console.log('🧪 WebSocket test functions added to console:');
  console.log('- testWebSocket(otherUserId) - Test via WebSocketService');
  console.log('- testDirectWebSocket(otherUserId) - Test direct WebSocket connection');
  console.log('Example: testWebSocket("15")');
};

// Auto-add to console in development
if (process.env.NODE_ENV === 'development') {
  addWebSocketTestsToConsole();
}