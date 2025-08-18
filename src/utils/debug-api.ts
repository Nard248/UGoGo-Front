/**
 * Debug utilities for testing chat API endpoints
 */

import { chatAPI } from '../api/chat';
import { getCurrentUserId } from './auth';

export const debugChatAPI = async () => {
  console.group('🔍 Debug Chat API');
  
  const userId = getCurrentUserId();
  const token = localStorage.getItem('access');
  
  console.log('Current User ID:', userId);
  console.log('Token exists:', !!token);
  
  try {
    // Test 1: Get threads
    console.log('\n📋 Testing getMyThreads...');
    const threadsResponse = await chatAPI.getMyThreads();
    console.log('Threads Response:', threadsResponse);
    console.log('Threads Data:', threadsResponse.data);
    console.log('Threads Count:', threadsResponse.data?.length || 0);
    
    if (threadsResponse.data?.length > 0) {
      const firstThread = threadsResponse.data[0];
      console.log('First Thread Structure:', firstThread);
      console.log('First Thread Fields:', Object.keys(firstThread));
      
      // Test 2: Get messages for first thread
      console.log('\n📨 Testing getThreadMessages for first thread...');
      try {
        const messagesResponse = await chatAPI.getThreadMessages(firstThread.id);
        console.log('Messages Response:', messagesResponse);
        console.log('Messages Data:', messagesResponse.data);
        console.log('Messages Count:', messagesResponse.data?.length || 0);
        
        if (messagesResponse.data?.length > 0) {
          console.log('First Message Structure:', messagesResponse.data[0]);
          console.log('First Message Fields:', Object.keys(messagesResponse.data[0]));
        }
      } catch (msgError) {
        console.error('Failed to get messages:', msgError);
      }
    }
    
    // Test 3: Test ensure thread with a known user
    console.log('\n🔗 Testing ensureThread...');
    try {
      const otherUserId = 15; // Test with user 15
      const ensureResponse = await chatAPI.ensureThread(otherUserId);
      console.log('Ensure Thread Response:', ensureResponse);
      console.log('Ensure Thread Data:', ensureResponse.data);
    } catch (ensureError) {
      console.error('Failed to ensure thread:', ensureError);
    }
    
  } catch (error: any) {
    console.error('API Test Failed:', error);
    console.error('Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
  }
  
  console.groupEnd();
};

export const testDirectAPICall = async () => {
  console.group('🔍 Direct API Test');
  
  const token = localStorage.getItem('access');
  const baseURL = 'http://127.0.0.1:8000';
  
  try {
    // Direct fetch to threads endpoint
    const response = await fetch(`${baseURL}/api/chat/dm/threads/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response Status:', response.status);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('Response Data:', data);
      console.log('Data Type:', typeof data);
      console.log('Is Array:', Array.isArray(data));
    } else {
      const errorText = await response.text();
      console.error('Error Response:', errorText);
    }
  } catch (error) {
    console.error('Direct API call failed:', error);
  }
  
  console.groupEnd();
};

// Make functions available globally
(window as any).debugChatAPI = debugChatAPI;
(window as any).testDirectAPICall = testDirectAPICall;