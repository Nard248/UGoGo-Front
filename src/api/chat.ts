import axios from 'axios';
import { DirectThread, DirectMessage } from '../types/chat.types';

// Create a separate axios instance for chat endpoints (local development)
const chatApi = axios.create({
  baseURL: 'http://localhost:8000', // Match WebSocket URL for consistency
});

// Add the same interceptors as the main api for consistency
chatApi.interceptors.request.use(
  (request: any) => {
    // Support both jwt_token and access token storage keys
    const accessToken = localStorage.getItem("jwt_token") || localStorage.getItem("access");

    return {
      ...request,
      headers: {
        ...(accessToken !== null && { Authorization: `Bearer ${accessToken}` }),
        ...request.headers,
      },
    };
  },
  (error) => {
    return Promise.reject(error);
  }
);

chatApi.interceptors.response.use(
  (response: any) => response,
  async (error: any) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh");
        if (!refreshToken) {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          window.location.href = "/login";
          return Promise.reject(error);
        }

        const { data } = await chatApi.post("/users/token/refresh/", {
          refresh: refreshToken,
        });

        localStorage.setItem("access", data.access);
        if (data.refresh) {
          localStorage.setItem("refresh", data.refresh);
        }

        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return chatApi(originalRequest);
      } catch (err) {
        console.error("Refresh token failed", err);

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export const chatAPI = {
  // Get user's direct message threads
  getMyThreads: () => 
    chatApi.get<DirectThread[]>('/api/chat/dm/threads/'),
  
  // Create or get thread with another user
  ensureThread: (otherUserId: number) => 
    chatApi.post<DirectThread>('/api/chat/dm/ensure-thread/', { other_user_id: otherUserId }),
  
  // Get messages in a specific thread
  getThreadMessages: (threadId: string, limit = 50, offset = 0) => 
    chatApi.get<DirectMessage[]>(`/api/chat/dm/threads/${threadId}/messages/`, {
      params: { limit, offset }
    }),
  
  // Get available offers for starting chats
  getAvailableOffers: () => {
    const { api } = require('./api');
    return api.get('/offers/get_all_offers/');
  },

  // Search offers by destination
  searchOffers: (query: string) => {
    const { api } = require('./api');
    return api.get('/offers/search_offer/', { 
      params: { 
        destination_airport: query,
        origin_airport: query 
      } 
    });
  },
  
  // Mark message as read
  markMessageAsRead: (messageId: string) =>
    chatApi.patch(`/api/chat/message/${messageId}/read/`),
  
  // Delete message
  deleteMessage: (messageId: string) =>
    chatApi.delete(`/api/chat/message/${messageId}/`),
  
  // Edit message
  editMessage: (messageId: string, content: string) =>
    chatApi.patch(`/api/chat/message/${messageId}/`, { content }),
  
  // Upload file attachment
  uploadAttachment: (threadId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('thread_id', threadId);
    
    return chatApi.post('/api/chat/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
};