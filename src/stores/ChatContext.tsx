import React, { createContext, useContext, useReducer, useCallback, useEffect, ReactNode } from 'react';
import { ChatState, DirectThread, DirectMessage } from '../types/chat.types';
import { chatAPI } from '../api/chat';
import WebSocketService, { ConnectionStatus } from '../services/websocket.service';
import { useNotification } from '../components/notification/NotificationProvider';
import { getCurrentUserId } from '../utils/auth';

type ChatAction =
  | { type: 'SET_THREADS'; payload: DirectThread[] }
  | { type: 'ADD_OR_UPDATE_THREAD'; payload: DirectThread }
  | { type: 'SET_ACTIVE_THREAD'; payload: DirectThread | null }
  | { type: 'SET_MESSAGES'; payload: { threadId: string; messages: DirectMessage[] } }
  | { type: 'PREPEND_MESSAGES'; payload: { threadId: string; messages: DirectMessage[] } }
  | { type: 'ADD_MESSAGE'; payload: { threadId: string; message: DirectMessage } }
  | { type: 'UPDATE_MESSAGE'; payload: { threadId: string; messageId: string; updates: Partial<DirectMessage> } }
  | { type: 'SET_CONNECTION_STATUS'; payload: { userId: string; status: ConnectionStatus } }
  | { type: 'SET_TYPING'; payload: { userId: string; isTyping: boolean } }
  | { type: 'SET_UNREAD_COUNT'; payload: { threadId: string; count: number } }
  | { type: 'SET_LOADING_THREADS'; payload: boolean }
  | { type: 'SET_LOADING_MESSAGES'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_THREAD_LAST_MESSAGE'; payload: { threadId: string; message: DirectMessage } }
  | { type: 'INCREMENT_UNREAD'; payload: { threadId: string } }
  | { type: 'SET_PAGINATION'; payload: { threadId: string; hasMore: boolean; offset: number } }
  | { type: 'SET_LOADING_MORE'; payload: { threadId: string; isLoading: boolean } }
  | { type: 'CLEAR_ALL_STATE' };

const initialState: ChatState = {
  threads: [],
  activeThread: null,
  messages: {},
  messagesPagination: {},
  connectionStatus: {},
  typingUsers: {},
  unreadCounts: {},
  isLoadingThreads: false,
  isLoadingMessages: false,
  error: null
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_THREADS':
      // Ensure payload is always an array
      const threads = Array.isArray(action.payload) ? action.payload : [];
      console.log('SET_THREADS reducer called with:', threads.length, 'threads');
      return { ...state, threads, isLoadingThreads: false };
    
    case 'ADD_OR_UPDATE_THREAD':
      const newThread = action.payload;
      const existingIndex = state.threads.findIndex(t => t.id === newThread.id);
      let updatedThreads;
      
      if (existingIndex >= 0) {
        // Update existing thread
        updatedThreads = [...state.threads];
        updatedThreads[existingIndex] = newThread;
      } else {
        // Add new thread at the beginning
        updatedThreads = [newThread, ...state.threads];
      }
      
      console.log('ADD_OR_UPDATE_THREAD:', newThread.id, 'total threads:', updatedThreads.length);
      return { ...state, threads: updatedThreads };
    
    case 'SET_ACTIVE_THREAD':
      return { ...state, activeThread: action.payload };
    
    case 'SET_MESSAGES':
      // Ensure action.payload.messages is always an array
      const messagesPayload = Array.isArray(action.payload.messages) ? action.payload.messages : [];
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.threadId]: messagesPayload
        },
        messagesPagination: {
          ...state.messagesPagination,
          [action.payload.threadId]: {
            hasMore: messagesPayload.length >= 20, // Default limit
            offset: messagesPayload.length,
            isLoadingMore: false
          }
        },
        isLoadingMessages: false
      };
    
    case 'PREPEND_MESSAGES':
      // Add older messages to the beginning of the array
      const existingMessages = state.messages[action.payload.threadId] || [];
      const newMessages = Array.isArray(action.payload.messages) ? action.payload.messages : [];
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.threadId]: [...newMessages, ...existingMessages]
        },
        messagesPagination: {
          ...state.messagesPagination,
          [action.payload.threadId]: {
            ...state.messagesPagination[action.payload.threadId],
            hasMore: newMessages.length >= 20, // If we got a full page, there might be more
            offset: (state.messagesPagination[action.payload.threadId]?.offset || 0) + newMessages.length,
            isLoadingMore: false
          }
        }
      };
    
    case 'ADD_MESSAGE':
      const currentMessages = state.messages[action.payload.threadId] || [];
      console.log('ADD_MESSAGE - currentMessages type:', typeof currentMessages, 'isArray:', Array.isArray(currentMessages), 'value:', currentMessages);
      // Ensure currentMessages is always an array
      const messagesArray = Array.isArray(currentMessages) ? currentMessages : [];
      const messageExists = messagesArray.some(m => m.id === action.payload.message.id);
      
      if (messageExists) {
        return state;
      }
      
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.threadId]: [...messagesArray, action.payload.message]
        }
      };
    
    case 'UPDATE_MESSAGE':
      const messages = state.messages[action.payload.threadId] || [];
      // Ensure messages is always an array
      const updateMessagesArray = Array.isArray(messages) ? messages : [];
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.threadId]: updateMessagesArray.map(msg =>
            msg.id === action.payload.messageId
              ? { ...msg, ...action.payload.updates }
              : msg
          )
        }
      };
    
    case 'SET_CONNECTION_STATUS':
      return {
        ...state,
        connectionStatus: {
          ...state.connectionStatus,
          [action.payload.userId]: action.payload.status
        }
      };
    
    case 'SET_TYPING':
      return {
        ...state,
        typingUsers: {
          ...state.typingUsers,
          [action.payload.userId]: action.payload.isTyping
        }
      };
    
    case 'SET_UNREAD_COUNT':
      return {
        ...state,
        unreadCounts: {
          ...state.unreadCounts,
          [action.payload.threadId]: action.payload.count
        }
      };
    
    case 'INCREMENT_UNREAD':
      return {
        ...state,
        unreadCounts: {
          ...state.unreadCounts,
          [action.payload.threadId]: (state.unreadCounts[action.payload.threadId] || 0) + 1
        }
      };
    
    case 'UPDATE_THREAD_LAST_MESSAGE':
      console.log('UPDATE_THREAD_LAST_MESSAGE for thread:', action.payload.threadId);
      return {
        ...state,
        threads: state.threads.map(thread =>
          thread.id === action.payload.threadId
            ? { ...thread, last_message: action.payload.message, last_message_at: new Date().toISOString() }
            : thread
        ).sort((a, b) => {
          const aTime = new Date(a.last_message_at || a.created_at).getTime();
          const bTime = new Date(b.last_message_at || b.created_at).getTime();
          return bTime - aTime;
        })
      };
    
    case 'SET_LOADING_THREADS':
      return { ...state, isLoadingThreads: action.payload };
    
    case 'SET_LOADING_MESSAGES':
      return { ...state, isLoadingMessages: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_PAGINATION':
      return {
        ...state,
        messagesPagination: {
          ...state.messagesPagination,
          [action.payload.threadId]: {
            hasMore: action.payload.hasMore,
            offset: action.payload.offset,
            isLoadingMore: false
          }
        }
      };
    
    case 'SET_LOADING_MORE':
      return {
        ...state,
        messagesPagination: {
          ...state.messagesPagination,
          [action.payload.threadId]: {
            ...state.messagesPagination[action.payload.threadId],
            isLoadingMore: action.payload.isLoading
          }
        }
      };

    case 'CLEAR_ALL_STATE':
      // Reset to initial state - called on logout to prevent old user's data from showing
      return initialState;

    default:
      return state;
  }
}

interface ChatContextType {
  state: ChatState;
  loadThreads: () => Promise<void>;
  selectThread: (thread: DirectThread) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  markAsRead: (threadId: string) => Promise<void>;
  setTyping: (isTyping: boolean) => void;
  ensureThread: (otherUserId: number) => Promise<DirectThread>;
  loadMoreMessages: (threadId: string) => Promise<void>;
  clearError: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { showError } = useNotification();
  const typingTimeoutRef = React.useRef<NodeJS.Timeout>();

  const loadThreads = useCallback(async () => {
    // Prevent multiple simultaneous loads
    if (state.isLoadingThreads) {
      console.log('Already loading threads, skipping...');
      return;
    }

    dispatch({ type: 'SET_LOADING_THREADS', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      console.log('🔄 Fetching threads from API...'); // Debug log
      console.log('🔑 Current user ID:', getCurrentUserId());
      console.log('🔑 Access token exists:', !!localStorage.getItem('access'));
      
      const response = await chatAPI.getMyThreads();
      console.log('📡 Raw API response:', response); // Debug log
      console.log('📡 Response status:', response.status);
      console.log('📡 Response data type:', typeof response.data);
      console.log('📡 Response data content:', response.data);
      
      // Handle paginated response - threads are in response.data.results
      const responseData = response.data as any;
      const threads = Array.isArray(responseData.results) ? responseData.results : 
                     Array.isArray(response.data) ? response.data : [];
      
      console.log('================== THREADS LOADED ==================');
      console.log('📋 Total threads:', threads.length);
      threads.forEach((thread: any, index: number) => {
        console.log(`Thread ${index + 1}:`, {
          id: thread.id,
          user1: thread.user1,
          user2: thread.user2,
          created_at: thread.created_at,
          last_message_at: thread.last_message_at,
          last_message: thread.last_message?.content?.substring(0, 30) + '...' || 'No messages',
          participant: thread.participant
        });
      });
      console.log('===================================================');
      
      if (threads.length === 0) {
        console.warn('⚠️ No threads found - user may not have any conversations yet');
      }
      
      dispatch({ type: 'SET_THREADS', payload: threads });
    } catch (error: any) {
      console.error('Error loading threads:', error); // Debug log
      const errorMessage = error.response?.data?.message || 'Failed to load conversations';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      showError(errorMessage);
      // Ensure threads is still an empty array on error
      dispatch({ type: 'SET_THREADS', payload: [] });
    } finally {
      dispatch({ type: 'SET_LOADING_THREADS', payload: false });
    }
  }, [showError, state.isLoadingThreads]);

  const selectThread = useCallback(async (thread: DirectThread) => {
    console.log('🔄 Selecting thread:', thread);
    dispatch({ type: 'SET_ACTIVE_THREAD', payload: thread });
    dispatch({ type: 'SET_LOADING_MESSAGES', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    // Get currentUserId at the beginning of the function
    const currentUserId = getCurrentUserId();
    const currentUserEmail = localStorage.getItem('email') || localStorage.getItem('user_email');

    try {
      console.log('📨 Fetching messages for thread:', thread.id);
      const response = await chatAPI.getThreadMessages(thread.id);
      console.log('📨 Thread messages response:', response);
      console.log('📨 Messages data:', response.data);
      
      // Handle paginated response for messages too
      const messagesData = response.data as any;
      let messages = Array.isArray(messagesData.results) ? messagesData.results : 
                      Array.isArray(response.data) ? response.data : [];
      console.log('📨 Messages count:', messages.length);
      
      // Log the raw chat history for debugging
      console.log('================== CHAT HISTORY START ==================');
      console.log('Thread ID:', thread.id);
      console.log('Current User ID:', currentUserId);
      console.log('Current User Email:', currentUserEmail);
      console.log('Other User ID:', thread.user1 === currentUserId ? thread.user2 : thread.user1);
      console.log('Total Messages:', messages.length);
      console.log('-----------------------------------------------------------');
      
      // Log each message in detail
      messages.forEach((msg: any, index: number) => {
        console.log(`Message ${index + 1}:`, {
          id: msg.id,
          sender: msg.sender,
          sender_id: msg.sender_id,
          content: msg.content,
          created_at: msg.created_at,
          is_read: msg.is_read,
          thread: msg.thread
        });
      });
      
      console.log('-----------------------------------------------------------');
      console.log('Raw messages array:', JSON.stringify(messages, null, 2));
      console.log('================== CHAT HISTORY END ==================');
      
      // Enrich messages with sender_id if missing
      messages = messages.map((msg: DirectMessage) => {
        if (!msg.sender_id && msg.sender) {
          // Determine sender_id based on email
          const senderId = msg.sender === currentUserEmail ? currentUserId : 
                          (thread.user1 === currentUserId ? thread.user2 : thread.user1);
          return { ...msg, sender_id: senderId };
        }
        return msg;
      });
      
      // Reverse messages so newest are at the bottom (like WhatsApp/Telegram)
      messages = messages.reverse();
      
      dispatch({ type: 'SET_MESSAGES', payload: { threadId: thread.id, messages: messages } });
      
      dispatch({ type: 'SET_UNREAD_COUNT', payload: { threadId: thread.id, count: 0 } });
      
      // Calculate the other user ID from the thread
      const otherUserId = (thread.user1 === currentUserId ? thread.user2 : thread.user1).toString();
      
      // Try to connect to WebSocket, but don't fail if it's not available
      try {
        await WebSocketService.connect(otherUserId);
        console.log('✅ WebSocket connection established for thread:', thread.id);
      } catch (error) {
        console.warn('⚠️ WebSocket connection failed, continuing without real-time features:', error);
        // Continue without WebSocket - messages will still work via API
      }
      
      WebSocketService.addMessageListener(otherUserId, (message: DirectMessage) => {
        console.log('================== WEBSOCKET MESSAGE ==================');
        console.log('📨 Received WebSocket message:', {
          id: message.id,
          sender: message.sender,
          sender_id: message.sender_id,
          content: message.content,
          created_at: message.created_at,
          thread: message.thread
        });
        console.log('======================================================');
        
        // Determine sender_id from sender email if not provided
        let senderId = message.sender_id;
        
        if (!senderId && message.sender) {
          // If sender email matches current user's email, it's from us
          senderId = message.sender === currentUserEmail ? currentUserId : parseInt(otherUserId);
        }
        
        // Enrich message with sender_id
        const enrichedMessage: DirectMessage = {
          ...message,
          sender_id: senderId,
          is_read: message.is_read !== undefined ? message.is_read : false
        };
        
        console.log('📨 Enriched message:', enrichedMessage);
        
        // Check if message already exists to prevent duplicates
        const existingMessages = state.messages[thread.id] || [];
        const messageExists = existingMessages.some(m => m.id === message.id);
        
        if (!messageExists) {
          dispatch({ type: 'ADD_MESSAGE', payload: { threadId: thread.id, message: enrichedMessage } });
          dispatch({ type: 'UPDATE_THREAD_LAST_MESSAGE', payload: { threadId: thread.id, message: enrichedMessage } });
        }
        
        // Handle unread count for messages from other users
        if (senderId !== currentUserId) {
          if (state.activeThread?.id !== thread.id) {
            dispatch({ type: 'INCREMENT_UNREAD', payload: { threadId: thread.id } });
          }
        }
      });

      WebSocketService.addStatusListener(otherUserId, (status: ConnectionStatus) => {
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: { userId: otherUserId, status } });
      });

      WebSocketService.addTypingListener(otherUserId, (userId: string, isTyping: boolean) => {
        dispatch({ type: 'SET_TYPING', payload: { userId, isTyping } });
      });
    } catch (error: any) {
      console.error('Error in selectThread:', error);
      console.error('Error response:', error.response);
      
      // More specific error messages
      let errorMessage = 'Failed to load messages';
      if (error.response?.status === 404) {
        errorMessage = 'Thread not found';
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied to this conversation';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      showError(errorMessage);
      
      // Still show the thread even if messages fail to load
      // WebSocket might still work
    } finally {
      dispatch({ type: 'SET_LOADING_MESSAGES', payload: false });
    }
  }, [state.activeThread, showError]);

  const sendMessage = useCallback(async (content: string) => {
    console.log('🚀 sendMessage called:', { content, threadId: state.activeThread?.id });
    
    if (!state.activeThread || !content.trim()) {
      return;
    }

    const currentUserId = getCurrentUserId();
    const otherUserId = (state.activeThread.user1 === currentUserId ? 
                        state.activeThread.user2 : state.activeThread.user1).toString();
    
    try {
      console.log('📤 Sending message to user:', otherUserId);
      
      // Make sure connection is established before sending
      try {
        await WebSocketService.connect(otherUserId);
      } catch (connectError) {
        console.error('Failed to establish WebSocket connection:', connectError);
        // Continue anyway - the message might still be sent if connection exists
      }
      
      // Now send the message
      await WebSocketService.sendMessage(otherUserId, content.trim());
      
      console.log('✅ Message sent successfully');
      
      // Refresh messages after successful send to ensure we see our sent message
      setTimeout(async () => {
        try {
          console.log('🔄 Refreshing messages after send...');
          const response = await chatAPI.getThreadMessages(state.activeThread!.id);
          const messagesData = response.data as any;
          let messages = Array.isArray(messagesData.results) ? messagesData.results : 
                          Array.isArray(response.data) ? response.data : [];
          
          console.log('================== REFRESHED MESSAGES ==================');
          console.log('Messages after send:', messages.length);
          messages.forEach((msg: any, index: number) => {
            console.log(`Message ${index + 1}:`, {
              id: msg.id,
              sender: msg.sender,
              content: msg.content.substring(0, 50) + (msg.content.length > 50 ? '...' : ''),
              created_at: msg.created_at
            });
          });
          console.log('========================================================');
          
          // Enrich messages with sender_id if missing
          const currentUserEmail = localStorage.getItem('email') || localStorage.getItem('user_email');
          const currentUserId = getCurrentUserId();
          const thread = state.activeThread!;
          
          messages = messages.map((msg: DirectMessage) => {
            if (!msg.sender_id && msg.sender) {
              // Determine sender_id based on email
              const senderId = msg.sender === currentUserEmail ? currentUserId : 
                              (thread.user1 === currentUserId ? thread.user2 : thread.user1);
              return { ...msg, sender_id: senderId };
            }
            return msg;
          });
          
          // Reverse messages so newest are at the bottom
          messages = messages.reverse();
          
          dispatch({ type: 'SET_MESSAGES', payload: { threadId: state.activeThread!.id, messages: messages } });
        } catch (refreshError) {
          console.error('❌ Failed to refresh messages:', refreshError);
        }
      }, 500); // Small delay to ensure backend has processed the message
      
    } catch (error: any) {
      console.error('❌ Failed to send message:', error);
      showError('Failed to send message. Please try again.');
    }
  }, [state.activeThread, showError]);

  const markAsRead = useCallback(async (threadId: string) => {
    try {
      dispatch({ type: 'SET_UNREAD_COUNT', payload: { threadId, count: 0 } });
      
      const messages = state.messages[threadId] || [];
      // Ensure messages is always an array
      const messagesArray = Array.isArray(messages) ? messages : [];
      messagesArray.forEach(msg => {
        if (!msg.is_read && msg.sender_id !== getCurrentUserId()) {
          dispatch({
            type: 'UPDATE_MESSAGE',
            payload: {
              threadId,
              messageId: msg.id,
              updates: { is_read: true }
            }
          });
        }
      });
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  }, [state.messages, state.threads]);

  const setTyping = useCallback((isTyping: boolean) => {
    if (!state.activeThread) return;

    // Calculate the other user ID from the active thread
    const currentUserId = getCurrentUserId();
    const otherUserId = (state.activeThread.user1 === currentUserId ? state.activeThread.user2 : state.activeThread.user1).toString();
    WebSocketService.sendTypingIndicator(otherUserId, isTyping);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        WebSocketService.sendTypingIndicator(otherUserId, false);
      }, 5000);
    }
  }, [state.activeThread]);

  const ensureThread = useCallback(async (otherUserId: number): Promise<DirectThread> => {
    try {
      console.log('Ensuring thread with user:', otherUserId);
      const response = await chatAPI.ensureThread(otherUserId);
      const thread = response.data;
      console.log('Ensured thread response:', thread);
      
      // Always add/update the thread in state immediately
      dispatch({ type: 'ADD_OR_UPDATE_THREAD', payload: thread });
      
      // Reload threads to get the full data including participant info
      setTimeout(() => loadThreads(), 300);
      
      return thread;
    } catch (error: any) {
      console.error('Error ensuring thread:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create conversation';
      showError(errorMessage);
      throw error;
    }
  }, [showError, loadThreads]);

  const loadMoreMessages = useCallback(async (threadId: string) => {
    const pagination = state.messagesPagination[threadId];
    
    // Don't load if already loading or no more messages
    if (!pagination || pagination.isLoadingMore || !pagination.hasMore) {
      return;
    }
    
    dispatch({ type: 'SET_LOADING_MORE', payload: { threadId, isLoading: true } });
    
    try {
      console.log('🔄 Loading more messages for thread:', threadId, 'offset:', pagination.offset);
      
      const response = await chatAPI.getThreadMessages(threadId, 20, pagination.offset);
      const messagesData = response.data as any;
      let olderMessages = Array.isArray(messagesData.results) ? messagesData.results : 
                         Array.isArray(response.data) ? response.data : [];
      
      console.log('📨 Loaded', olderMessages.length, 'older messages');
      
      if (olderMessages.length > 0) {
        // Enrich messages with sender_id if missing
        const currentUserEmail = localStorage.getItem('email') || localStorage.getItem('user_email');
        const currentUserId = getCurrentUserId();
        const thread = state.threads.find(t => t.id === threadId);
        
        if (thread) {
          olderMessages = olderMessages.map((msg: DirectMessage) => {
            if (!msg.sender_id && msg.sender) {
              const senderId = msg.sender === currentUserEmail ? currentUserId : 
                              (thread.user1 === currentUserId ? thread.user2 : thread.user1);
              return { ...msg, sender_id: senderId };
            }
            return msg;
          });
          
          // Reverse older messages to maintain chronological order when prepending
          olderMessages = olderMessages.reverse();
        }
        
        dispatch({ type: 'PREPEND_MESSAGES', payload: { threadId, messages: olderMessages } });
      } else {
        // No more messages to load
        dispatch({ type: 'SET_PAGINATION', payload: { threadId, hasMore: false, offset: pagination.offset } });
      }
      
    } catch (error: any) {
      console.error('❌ Failed to load more messages:', error);
      // Don't show error notification for pagination failures
    } finally {
      dispatch({ type: 'SET_LOADING_MORE', payload: { threadId, isLoading: false } });
    }
  }, [state.messagesPagination, state.threads]);

  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      WebSocketService.disconnectAll();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Listen for logout event to clear all chat state
  useEffect(() => {
    const handleLogout = () => {
      console.log('🚪 User logged out - clearing chat state');
      WebSocketService.disconnectAll();
      dispatch({ type: 'CLEAR_ALL_STATE' });
    };

    window.addEventListener('userLoggedOut', handleLogout);
    return () => {
      window.removeEventListener('userLoggedOut', handleLogout);
    };
  }, []);

  const value: ChatContextType = {
    state,
    loadThreads,
    selectThread,
    sendMessage,
    markAsRead,
    setTyping,
    ensureThread,
    loadMoreMessages,
    clearError
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};