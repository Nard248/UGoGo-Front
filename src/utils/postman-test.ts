/**
 * Test WebSocket connection exactly like the working Postman example
 */

import { getJWTToken, getCurrentUserId } from './auth';

export const testPostmanWebSocket = async () => {
  console.group('📮 Postman WebSocket Test - Exact Match');
  
  const token = getJWTToken();
  const currentUserId = getCurrentUserId();
  
  console.log('🔐 Auth Details:', {
    hasToken: !!token,
    tokenPreview: token ? token.substring(0, 30) + '...' : 'none',
    currentUserId
  });
  
  // Exact Postman URL format
  const wsUrl = 'ws://localhost:8000/ws/chat/dm/user/116/';
  
  console.log('🎯 Testing exact Postman URL:', wsUrl);
  console.log('📝 Will send exact Postman message: {"content": "hello from postman"}');
  
  try {
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('✅ WebSocket connected successfully! (Like Postman)');
      
      // Send exact same message as Postman
      const message = { content: "hello from frontend (copying postman)" };
      
      console.log('📤 Sending message:', message);
      ws.send(JSON.stringify(message));
      
      // Keep connection open for a bit to see response
      setTimeout(() => {
        console.log('🔌 Closing connection after test');
        ws.close();
      }, 5000);
    };
    
    ws.onmessage = (event) => {
      console.log('📨 Received message:', event.data);
      try {
        const parsed = JSON.parse(event.data);
        console.log('📨 Parsed message:', parsed);
      } catch (e) {
        console.log('📨 Raw text message:', event.data);
      }
    };
    
    ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
    };
    
    ws.onclose = (event) => {
      console.log('🔌 WebSocket closed:', {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean
      });
      
      if (event.code === 1006) {
        console.error('💡 Code 1006 suggests authentication or server issue');
        console.error('💡 Since Postman works with Bearer token, backend expects Authorization header');
        console.error('💡 Browser WebSocket cannot send Authorization header - need backend support for token param');
      }
    };
    
  } catch (error) {
    console.error('❌ Failed to create WebSocket:', error);
  }
  
  console.groupEnd();
};

// Test different WebSocket authentication methods
export const testWebSocketAuthMethods = async () => {
  console.group('🔐 Testing WebSocket Authentication Methods');
  
  const token = getJWTToken();
  if (!token) {
    console.error('❌ No token found');
    return;
  }
  
  console.log('🔍 WebSocket Authentication Analysis:');
  console.log('   Postman: Uses Authorization: Bearer header ✅');
  console.log('   Browser: Cannot send custom headers ❌');
  console.log('   Standard Solutions:');
  console.log('   1. Subprotocol authentication (Bearer.token)');
  console.log('   2. Query parameter (?token=...)');
  console.log('   3. Post-connection auth message');
  
  const baseUrl = 'ws://localhost:8000/ws/chat/dm/user/116/';
  
  // Method 1: Subprotocol authentication (STANDARD)
  console.log('\n🧪 Method 1: Subprotocol Authentication');
  try {
    const ws1 = new WebSocket(baseUrl, [`Bearer.${token}`]);
    console.log('✅ Subprotocol WebSocket created');
    
    const result1 = await testConnection(ws1, 'subprotocol');
    console.log(`Result: ${result1}`);
  } catch (error) {
    console.error('❌ Subprotocol method failed:', error);
  }
  
  // Method 2: Query parameter
  console.log('\n🧪 Method 2: Query Parameter');
  try {
    const ws2 = new WebSocket(`${baseUrl}?token=${token}`);
    const result2 = await testConnection(ws2, 'query param');
    console.log(`Result: ${result2}`);
  } catch (error) {
    console.error('❌ Query param method failed:', error);
  }
  
  // Method 3: Post-connection auth
  console.log('\n🧪 Method 3: Post-Connection Auth');
  try {
    const ws3 = new WebSocket(baseUrl);
    const result3 = await testConnectionWithAuth(ws3, token);
    console.log(`Result: ${result3}`);
  } catch (error) {
    console.error('❌ Post-connection auth failed:', error);
  }
  
  console.groupEnd();
};

const testConnection = (ws: WebSocket, method: string): Promise<string> => {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      ws.close();
      resolve('timeout');
    }, 3000);
    
    ws.onopen = () => {
      clearTimeout(timeout);
      console.log(`✅ ${method} - Connected!`);
      
      // Send test message
      ws.send(JSON.stringify({ content: `Test from ${method}` }));
      
      setTimeout(() => {
        ws.close();
        resolve('success');
      }, 1000);
    };
    
    ws.onerror = () => {
      clearTimeout(timeout);
      resolve('error');
    };
    
    ws.onclose = (event) => {
      clearTimeout(timeout);
      console.log(`🔌 ${method} - Closed: ${event.code} - ${event.reason}`);
      resolve(`closed-${event.code}`);
    };
    
    ws.onmessage = (event) => {
      console.log(`📨 ${method} - Received:`, event.data);
    };
  });
};

const testConnectionWithAuth = (ws: WebSocket, token: string): Promise<string> => {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      ws.close();
      resolve('timeout');
    }, 3000);
    
    ws.onopen = () => {
      console.log('✅ Post-auth - Connected, sending auth...');
      // Send authentication message first
      ws.send(JSON.stringify({ 
        type: 'auth', 
        token: token 
      }));
      
      // Then send test message
      setTimeout(() => {
        ws.send(JSON.stringify({ content: 'Test after auth' }));
      }, 500);
      
      setTimeout(() => {
        clearTimeout(timeout);
        ws.close();
        resolve('success');
      }, 2000);
    };
    
    ws.onerror = () => {
      clearTimeout(timeout);
      resolve('error');
    };
    
    ws.onclose = (event) => {
      clearTimeout(timeout);
      resolve(`closed-${event.code}`);
    };
    
    ws.onmessage = (event) => {
      console.log('📨 Post-auth - Received:', event.data);
    };
  });
};

// Make available globally
(window as any).testPostmanWebSocket = testPostmanWebSocket;
(window as any).testWebSocketAuthMethods = testWebSocketAuthMethods;

console.log('📮 Postman tests available:');
console.log('  testPostmanWebSocket() - Test exact Postman format');
console.log('  testWebSocketAuthMethods() - Test all auth methods');