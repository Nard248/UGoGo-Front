import { api } from './api';
import { DirectThread, DirectMessage } from '../types/chat.types';

export const chatAPI = {
  // Get user's direct message threads
  getMyThreads: () =>
    api.get<DirectThread[]>('/api/chat/dm/threads/'),

  // Create or get thread with another user
  ensureThread: (otherUserId: number) =>
    api.post<DirectThread>('/api/chat/dm/ensure-thread/', { other_user_id: otherUserId }),

  // Get messages in a specific thread
  getThreadMessages: (threadId: string, limit = 50, offset = 0) =>
    api.get<DirectMessage[]>(`/api/chat/dm/threads/${threadId}/messages/`, {
      params: { limit, offset }
    }),

  // Get available offers for starting chats
  getAvailableOffers: () =>
    api.get('/offers/get_all_offers/'),

  // Search offers by destination
  searchOffers: (query: string) =>
    api.get('/offers/search_offer/', {
      params: {
        destination_airport: query,
        origin_airport: query
      }
    }),

  // Mark message as read
  markMessageAsRead: (messageId: string) =>
    api.patch(`/api/chat/message/${messageId}/read/`),

  // Delete message
  deleteMessage: (messageId: string) =>
    api.delete(`/api/chat/message/${messageId}/`),

  // Edit message
  editMessage: (messageId: string, content: string) =>
    api.patch(`/api/chat/message/${messageId}/`, { content }),

  // Upload file attachment
  uploadAttachment: (threadId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('thread_id', threadId);

    return api.post('/api/chat/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
};
