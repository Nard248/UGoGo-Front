// Test Azure WebSocket Connection
// Copy and paste this into your browser console to test the WebSocket connection

console.log('🧪 Testing Azure WebSocket Connection...');

// Get authentication token
const token = localStorage.getItem('jwt_token') || localStorage.getItem('access');
if (!token) {
  console.error('❌ No authentication token found. Please login first.');
} else {
  console.log('✅ Authentication token found');
  
  // Test WebSocket connection to Azure backend
  const testAzureWebSocket = (otherUserId = '116') => {
    const wsUrl = `wss://ugogo-backend.blackflower-e8d746fa.eastus.azurecontainerapps.io/ws/chat/dm/user/${otherUserId}/?token=${token}`;
    
    console.log('🔌 Connecting to Azure WebSocket...');
    console.log('   URL:', wsUrl.replace(/token=.*/, 'token=***'));
    
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('✅ Successfully connected to Azure WebSocket!');
      console.log('📤 Sending test message...');
      
      // Send a test message
      setTimeout(() => {
        const testMessage = {
          content: 'Test message from Azure WebSocket connection'
        };
        ws.send(JSON.stringify(testMessage));
        console.log('✅ Test message sent:', testMessage);
      }, 1000);
    };
    
    ws.onmessage = (event) => {
      console.log('📨 Message received from Azure:', event.data);
      try {
        const data = JSON.parse(event.data);
        console.log('   Parsed data:', data);
      } catch (e) {
        console.log('   Raw data:', event.data);
      }
    };
    
    ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      console.error('   This usually means:');
      console.error('   1. Backend WebSocket server is not running');
      console.error('   2. Authentication token is invalid');
      console.error('   3. Network/firewall blocking WebSocket connections');
    };
    
    ws.onclose = (event) => {
      console.log('🔌 WebSocket closed');
      console.log('   Code:', event.code);
      console.log('   Reason:', event.reason || 'No reason provided');
      
      if (event.code === 1006) {
        console.error('❌ Abnormal closure - Backend may not be accepting WebSocket connections');
      } else if (event.code === 1000) {
        console.log('✅ Normal closure');
      }
    };
    
    return ws;
  };
  
  // Run the test
  window.azureWsTest = testAzureWebSocket('116'); // Replace with actual user ID to test with
  
  console.log('💡 WebSocket instance saved to window.azureWsTest');
  console.log('   To close: window.azureWsTest.close()');
  console.log('   To send message: window.azureWsTest.send(JSON.stringify({content: "Hello"}))');
}