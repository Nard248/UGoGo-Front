/**
 * WebSocket diagnostics to troubleshoot connection issues
 */

import { getCurrentUserId, getJWTToken } from './auth';

export const diagnoseWebSocketIssues = async () => {
  console.group('🩺 WebSocket Diagnostics');
  
  // 1. Check authentication
  const token = getJWTToken();
  const userId = getCurrentUserId();
  
  console.log('📋 Authentication Status:', {
    hasToken: !!token,
    tokenLength: token?.length,
    userId,
    tokenPreview: token ? `${token.substring(0, 20)}...` : 'none'
  });
  
  // 2. Test HTTP endpoint first
  console.log('🌐 Testing HTTP endpoint availability...');
  const httpUrls = ['http://localhost:8000', 'http://127.0.0.1:8000'];
  
  let httpWorking = false;
  for (const baseUrl of httpUrls) {
    try {
      console.log(`🧪 Testing HTTP: ${baseUrl}`);
      const response = await fetch(`${baseUrl}/api/chat/dm/threads/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log(`✅ HTTP endpoint response (${baseUrl}):`, response.status, response.statusText);
      httpWorking = true;
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ HTTP endpoint error:', errorText);
      }
      break;
    } catch (error) {
      console.error(`❌ HTTP endpoint failed (${baseUrl}):`, error);
    }
  }
  
  if (!httpWorking) {
    console.log('💡 Make sure your Django backend is running with uvicorn');
    return;
  }
  
  // 3. Test WebSocket endpoint
  console.log('🔌 Testing WebSocket endpoint...');
  
  const testUrls = [
    // Postman working format - exact match
    'ws://localhost:8000/ws/chat/dm/user/116/',
    // With token query param (browser fallback)
    `ws://localhost:8000/ws/chat/dm/user/116/?token=${token}`,
    // Test with user 15 (your original)
    'ws://localhost:8000/ws/chat/dm/user/15/',
    `ws://localhost:8000/ws/chat/dm/user/15/?token=${token}`,
    // Fallback to 127.0.0.1
    'ws://127.0.0.1:8000/ws/chat/dm/user/15/',
    `ws://127.0.0.1:8000/ws/chat/dm/user/15/?token=${token}`
  ];
  
  for (const url of testUrls) {
    console.log(`\n🧪 Testing URL: ${url.substring(0, 80)}...`);
    
    try {
      const ws = new WebSocket(url);
      
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          ws.close();
          console.log('⏰ Connection timeout');
          resolve(null);
        }, 5000);
        
        ws.onopen = () => {
          clearTimeout(timeout);
          console.log('✅ WebSocket connected successfully!');
          ws.close();
          resolve(null);
        };
        
        ws.onerror = (error) => {
          clearTimeout(timeout);
          console.error('❌ WebSocket error:', error);
          resolve(null);
        };
        
        ws.onclose = (event) => {
          clearTimeout(timeout);
          console.log('🔌 WebSocket closed:', {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean
          });
          resolve(null);
        };
      });
      
    } catch (error) {
      console.error('❌ WebSocket creation failed:', error);
    }
    
    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.groupEnd();
};

// Add to global scope for easy testing
(window as any).diagnoseWebSocket = diagnoseWebSocketIssues;

console.log('🩺 WebSocket diagnostics available: diagnoseWebSocket()');