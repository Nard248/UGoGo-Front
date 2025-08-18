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
  | { type: 'ADD_MESSAGE'; payload: { threadId: string; message: DirectMessage } }
  | { type: 'UPDATE_MESSAGE'; payload: { threadId: string; messageId: string; updates: Partial<DirectMessage> } }
  | { type: 'SET_CONNECTION_STATUS'; payload: { userId: string; status: ConnectionStatus } }
  | { type: 'SET_TYPING'; payload: { userId: string; isTyping: boolean } }
  | { type: 'SET_UNREAD_COUNT'; payload: { threadId: string; count: number } }
  | { type: 'SET_LOADING_THREADS'; payload: boolean }
  | { type: 'SET_LOADING_MESSAGES'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_THREAD_LAST_MESSAGE'; payload: { threadId: string; message: DirectMessage } }
  | { type: 'INCREMENT_UNREAD'; payload: { threadId: string } };

const initialState: ChatState = {
  threads: [],
  activeThread: null,
  messages: {},
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
        isLoadingMessages: false
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
      console.log('📋 Processed threads count:', threads.length);
      console.log('📋 Processed threads:', threads);
      
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

    try {
      console.log('📨 Fetching messages for thread:', thread.id);
      const response = await chatAPI.getThreadMessages(thread.id);
      console.log('📨 Thread messages response:', response);
      console.log('📨 Messages data:', response.data);
      
      // Handle paginated response for messages too
      const messagesData = response.data as any;
      const messages = Array.isArray(messagesData.results) ? messagesData.results : 
                      Array.isArray(response.data) ? response.data : [];
      console.log('📨 Messages count:', messages.length);
      
      dispatch({ type: 'SET_MESSAGES', payload: { threadId: thread.id, messages: messages } });
      
      dispatch({ type: 'SET_UNREAD_COUNT', payload: { threadId: thread.id, count: 0 } });
      
      // Calculate the other user ID from the thread
      const currentUserId = getCurrentUserId();
      const otherUserId = (thread.user1 === currentUserId ? thread.user2 : thread.user1).toString();
      
      // Try to connect to WebSocket, but don't fail if it's not available
      try {
        WebSocketService.connect(otherUserId);
      } catch (error) {
        console.warn('WebSocket connection failed, continuing without real-time features:', error);
      }
      
      WebSocketService.addMessageListener(otherUserId, (message: DirectMessage) => {
        dispatch({ type: 'ADD_MESSAGE', payload: { threadId: thread.id, message } });
        dispatch({ type: 'UPDATE_THREAD_LAST_MESSAGE', payload: { threadId: thread.id, message } });
        
        if (message.sender_id !== getCurrentUserId()) {
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
      const errorMessage = error.response?.data?.message || 'Failed to load messages';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      showError(errorMessage);
    } finally {
      dispatch({ type: 'SET_LOADING_MESSAGES', payload: false });
    }
  }, [state.activeThread, showError]);

  const sendMessage = useCallback(async (content: string) => {
    console.log('🚀 ChatContext.sendMessage called with:', { content, activeThread: state.activeThread?.id });
    
    if (!state.activeThread || !content.trim()) {
      console.warn('❌ Cannot send message: no active thread or empty content', {
        hasActiveThread: !!state.activeThread,
        contentLength: content.length,
        trimmedLength: content.trim().length
      });
      return;
    }

    const currentUserId = getCurrentUserId();
    const currentUserName = localStorage.getItem('username') || 'current_user';
    
    console.log('💬 Sending message with details:', {
      content: content.trim(),
      threadId: state.activeThread.id,
      currentUserId,
      currentUserName,
      activeThread: state.activeThread
    });
    
    const tempMessage: DirectMessage = {
      id: `temp-${Date.now()}`,
      thread: state.activeThread.id,
      sender: currentUserName,
      sender_id: currentUserId,
      content: content.trim(),
      created_at: new Date().toISOString(),
      is_read: false
    };

    console.log('💬 Created temp message:', tempMessage);
    dispatch({ type: 'ADD_MESSAGE', payload: { threadId: state.activeThread.id, message: tempMessage } });
    dispatch({ type: 'UPDATE_THREAD_LAST_MESSAGE', payload: { threadId: state.activeThread.id, message: tempMessage } });

    try {
      // Calculate the other user ID from the active thread
      const otherUserId = (state.activeThread.user1 === currentUserId ? state.activeThread.user2 : state.activeThread.user1).toString();
      console.log('🔌 Calculated other user ID:', otherUserId, 'from thread users:', {
        user1: state.activeThread.user1,
        user2: state.activeThread.user2,
        currentUserId
      });
      
      console.log('🔌 About to call WebSocketService.sendMessage...');
      WebSocketService.sendMessage(otherUserId, content.trim());
      console.log('🔌 WebSocketService.sendMessage call completed');
      
      // Only reload threads if this is a new thread not in the current list
      const activeThread = state.activeThread;
      if (activeThread) {
        const threadExists = state.threads.some(t => t.id === activeThread.id);
        console.log('🔄 Thread exists check:', { threadExists, threadId: activeThread.id, totalThreads: state.threads.length });
        if (!threadExists) {
          console.log('🔄 New thread detected, reloading threads...');
          setTimeout(() => loadThreads(), 500);
        }
      }
    } catch (error: any) {
      console.error('❌ Error in sendMessage:', error);
      dispatch({
        type: 'UPDATE_MESSAGE',
        payload: {
          threadId: state.activeThread.id,
          messageId: tempMessage.id,
          updates: { deleted: true }
        }
      });
      
      const errorMessage = error.message || 'Failed to send message';
      console.error('❌ Showing error to user:', errorMessage);
      showError(errorMessage);
    }
  }, [state.activeThread, showError, state.threads, loadThreads]);

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

  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  useEffect(() => {
    return () => {
      WebSocketService.disconnectAll();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
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
    clearError
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};