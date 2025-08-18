/**
 * Debug utilities for testing chat authentication
 */

import { getCurrentUserId } from './auth';

export const debugAuth = async () => {
  console.group('🔍 Auth Debug Info');
  
  const userId = getCurrentUserId();
  const token = localStorage.getItem('access');
  const userDetails = localStorage.getItem('userDetails');
  
  console.log('Current User ID:', userId);
  console.log('Access Token:', token ? `${token.substring(0, 20)}...` : 'None');
  console.log('User Details:', userDetails ? JSON.parse(userDetails) : 'None');
  
  // Test if user exists in backend
  if (token) {
    try {
      const response = await fetch('http://127.0.0.1:8000/users/me/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        console.log('✅ Backend user data:', userData);
        console.log('Backend user ID:', userData.id);
        
        if (userData.id !== userId) {
          console.warn('⚠️ User ID mismatch!', {
            localStorage: userId,
            backend: userData.id
          });
        }
      } else {
        console.error('❌ Failed to fetch user data:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('❌ Error fetching user data:', error);
    }
  }
  
  // Try to decode JWT
  if (token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      console.log('JWT Payload:', payload);
    } catch (error) {
      console.error('Failed to decode JWT:', error);
    }
  }
  
  console.groupEnd();
  return { userId, token, userDetails };
};

export const testWebSocketConnection = async (otherUserId: string) => {
  await debugAuth();
  
  const userId = getCurrentUserId();
  
  if (!userId || userId === 0) {
    console.error('❌ Cannot test WebSocket: User ID not found');
    return;
  }
  
  const wsUrl = `ws://127.0.0.1:8000/ws/chat/dm/user/${otherUserId}/?user_id=${userId}`;
  console.log('🔗 Testing WebSocket URL:', wsUrl);
  
  const ws = new WebSocket(wsUrl);
  
  ws.onopen = () => {
    console.log('✅ WebSocket connected successfully');
    
    // Test sending a message
    const testMessage = {
      content: `Test message from user ${userId} at ${new Date().toISOString()}`
    };
    
    console.log('📤 Sending test message:', testMessage);
    ws.send(JSON.stringify(testMessage));
  };
  
  ws.onmessage = (event) => {
    console.log('📨 Received message:', event.data);
    try {
      const parsed = JSON.parse(event.data);
      console.log('📨 Parsed message:', parsed);
    } catch {
      console.log('📨 Raw message:', event.data);
    }
  };
  
  ws.onclose = (event) => {
    console.log('❌ WebSocket closed:', event.code, event.reason);
    
    switch(event.code) {
      case 4400:
        console.error('Bad request - check user/thread IDs');
        break;
      case 4403:
        console.error('Authentication failed');
        break;
      case 1000:
        console.log('Normal closure');
        break;
      default:
        console.error('Unknown close code:', event.code);
    }
  };
  
  ws.onerror = (error) => {
    console.error('🚨 WebSocket error:', error);
  };
  
  // Auto-close after 10 seconds
  setTimeout(() => {
    if (ws.readyState === WebSocket.OPEN) {
      console.log('🔒 Closing test WebSocket');
      ws.close(1000, 'Test completed');
    }
  }, 10000);
  
  return ws;
};

// Make these functions available globally for testing
(window as any).debugAuth = debugAuth;
(window as any).testWebSocketConnection = testWebSocketConnection;

// For easier console usage, also provide sync version
(window as any).testWS = (otherUserId: string) => testWebSocketConnection(otherUserId);