import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef, useMemo, ReactNode } from 'react';
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
    case 'SET_THREADS': {
      const threads = Array.isArray(action.payload) ? action.payload : [];
      return { ...state, threads, isLoadingThreads: false };
    }

    case 'ADD_OR_UPDATE_THREAD': {
      const newThread = action.payload;
      const existingIndex = state.threads.findIndex(t => t.id === newThread.id);
      let updatedThreads;

      if (existingIndex >= 0) {
        updatedThreads = [...state.threads];
        updatedThreads[existingIndex] = newThread;
      } else {
        updatedThreads = [newThread, ...state.threads];
      }

      return { ...state, threads: updatedThreads };
    }

    case 'SET_ACTIVE_THREAD':
      return { ...state, activeThread: action.payload };

    case 'SET_MESSAGES': {
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
            hasMore: messagesPayload.length >= 20,
            offset: messagesPayload.length,
            isLoadingMore: false
          }
        },
        isLoadingMessages: false
      };
    }

    case 'PREPEND_MESSAGES': {
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
            hasMore: newMessages.length >= 20,
            offset: (state.messagesPagination[action.payload.threadId]?.offset || 0) + newMessages.length,
            isLoadingMore: false
          }
        }
      };
    }

    case 'ADD_MESSAGE': {
      const currentMessages = state.messages[action.payload.threadId] || [];
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
    }

    case 'UPDATE_MESSAGE': {
      const messages = state.messages[action.payload.threadId] || [];
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
    }

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

// Helper to enrich messages with sender_id
function enrichMessages(messages: DirectMessage[], currentUserId: number, currentUserEmail: string | null, thread: DirectThread): DirectMessage[] {
  return messages.map((msg) => {
    if (!msg.sender_id && msg.sender) {
      const senderId = msg.sender === currentUserEmail ? currentUserId :
        (thread.user1 === currentUserId ? thread.user2 : thread.user1);
      return { ...msg, sender_id: senderId };
    }
    return msg;
  });
}

// Helper to parse paginated API response
function parseMessages(responseData: any): DirectMessage[] {
  if (Array.isArray(responseData.results)) return responseData.results;
  if (Array.isArray(responseData)) return responseData;
  return [];
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { showError } = useNotification();
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const isLoadingThreadsRef = useRef(false);

  const loadThreads = useCallback(async () => {
    if (isLoadingThreadsRef.current) return;
    isLoadingThreadsRef.current = true;

    dispatch({ type: 'SET_LOADING_THREADS', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await chatAPI.getMyThreads();
      const responseData = response.data as any;
      const threads = Array.isArray(responseData.results) ? responseData.results :
        Array.isArray(response.data) ? response.data : [];

      dispatch({ type: 'SET_THREADS', payload: threads });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to load conversations';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      showError(errorMessage);
      dispatch({ type: 'SET_THREADS', payload: [] });
    } finally {
      isLoadingThreadsRef.current = false;
      dispatch({ type: 'SET_LOADING_THREADS', payload: false });
    }
  }, [showError]);

  const selectThread = useCallback(async (thread: DirectThread) => {
    dispatch({ type: 'SET_ACTIVE_THREAD', payload: thread });
    dispatch({ type: 'SET_LOADING_MESSAGES', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    const currentUserId = getCurrentUserId();
    const currentUserEmail = localStorage.getItem('email') || localStorage.getItem('user_email');

    try {
      const response = await chatAPI.getThreadMessages(thread.id);
      let messages = parseMessages(response.data);

      messages = enrichMessages(messages, currentUserId, currentUserEmail, thread);
      messages = messages.reverse();

      dispatch({ type: 'SET_MESSAGES', payload: { threadId: thread.id, messages } });
      dispatch({ type: 'SET_UNREAD_COUNT', payload: { threadId: thread.id, count: 0 } });

      const otherUserId = (thread.user1 === currentUserId ? thread.user2 : thread.user1).toString();

      try {
        await WebSocketService.connect(otherUserId);
      } catch {
        // Continue without WebSocket
      }

      WebSocketService.addMessageListener(otherUserId, (message: DirectMessage) => {
        let senderId = message.sender_id;
        if (!senderId && message.sender) {
          senderId = message.sender === currentUserEmail ? currentUserId : parseInt(otherUserId);
        }

        const enrichedMessage: DirectMessage = {
          ...message,
          sender_id: senderId,
          is_read: message.is_read !== undefined ? message.is_read : false
        };

        dispatch({ type: 'ADD_MESSAGE', payload: { threadId: thread.id, message: enrichedMessage } });
        dispatch({ type: 'UPDATE_THREAD_LAST_MESSAGE', payload: { threadId: thread.id, message: enrichedMessage } });

        if (senderId !== currentUserId) {
          dispatch({ type: 'INCREMENT_UNREAD', payload: { threadId: thread.id } });
        }
      });

      WebSocketService.addStatusListener(otherUserId, (status: ConnectionStatus) => {
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: { userId: otherUserId, status } });
      });

      WebSocketService.addTypingListener(otherUserId, (userId: string, isTyping: boolean) => {
        dispatch({ type: 'SET_TYPING', payload: { userId, isTyping } });
      });
    } catch (error: any) {
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
    } finally {
      dispatch({ type: 'SET_LOADING_MESSAGES', payload: false });
    }
  }, [showError]);

  const sendMessage = useCallback(async (content: string) => {
    if (!state.activeThread || !content.trim()) return;

    const currentUserId = getCurrentUserId();
    const otherUserId = (state.activeThread.user1 === currentUserId ?
      state.activeThread.user2 : state.activeThread.user1).toString();

    try {
      try {
        await WebSocketService.connect(otherUserId);
      } catch {
        // Continue - message might still be sent if connection exists
      }

      await WebSocketService.sendMessage(otherUserId, content.trim());
      // Message will arrive via WebSocket listener - no need for HTTP refresh
    } catch (error: any) {
      showError('Failed to send message. Please try again.');
    }
  }, [state.activeThread, showError]);

  const markAsRead = useCallback(async (threadId: string) => {
    try {
      dispatch({ type: 'SET_UNREAD_COUNT', payload: { threadId, count: 0 } });

      const messages = state.messages[threadId] || [];
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
  }, [state.messages]);

  const setTyping = useCallback((isTyping: boolean) => {
    if (!state.activeThread) return;

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
      const response = await chatAPI.ensureThread(otherUserId);
      const thread = response.data;

      dispatch({ type: 'ADD_OR_UPDATE_THREAD', payload: thread });
      setTimeout(() => loadThreads(), 300);

      return thread;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create conversation';
      showError(errorMessage);
      throw error;
    }
  }, [showError, loadThreads]);

  const loadMoreMessages = useCallback(async (threadId: string) => {
    const pagination = state.messagesPagination[threadId];
    if (!pagination || pagination.isLoadingMore || !pagination.hasMore) return;

    dispatch({ type: 'SET_LOADING_MORE', payload: { threadId, isLoading: true } });

    try {
      const response = await chatAPI.getThreadMessages(threadId, 20, pagination.offset);
      let olderMessages = parseMessages(response.data);

      if (olderMessages.length > 0) {
        const currentUserEmail = localStorage.getItem('email') || localStorage.getItem('user_email');
        const currentUserId = getCurrentUserId();
        const thread = state.threads.find(t => t.id === threadId);

        if (thread) {
          olderMessages = enrichMessages(olderMessages, currentUserId, currentUserEmail, thread);
          olderMessages = olderMessages.reverse();
        }

        dispatch({ type: 'PREPEND_MESSAGES', payload: { threadId, messages: olderMessages } });
      } else {
        dispatch({ type: 'SET_PAGINATION', payload: { threadId, hasMore: false, offset: pagination.offset } });
      }
    } catch {
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
      WebSocketService.disconnectAll();
      dispatch({ type: 'CLEAR_ALL_STATE' });
    };

    window.addEventListener('userLoggedOut', handleLogout);
    return () => {
      window.removeEventListener('userLoggedOut', handleLogout);
    };
  }, []);

  const value = useMemo<ChatContextType>(() => ({
    state,
    loadThreads,
    selectThread,
    sendMessage,
    markAsRead,
    setTyping,
    ensureThread,
    loadMoreMessages,
    clearError
  }), [state, loadThreads, selectThread, sendMessage, markAsRead, setTyping, ensureThread, loadMoreMessages, clearError]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
