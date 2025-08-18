import React, { useEffect, useState, useRef, useCallback } from "react";
import "./ChatPage.scss";
import { ChatSidebar } from "./components/ChatSidebar";
import { ChatHeader } from "./components/ChatHeader";
import { MessageBubble } from "./components/MessageBubble";
import { ChatInput } from "./components/ChatInput";
import { useChat } from "../../stores/ChatContext";
import { useWebSocket } from "../../hooks/useWebSocket";
import { DirectMessage, DirectThread, User } from "../../types/chat.types";
import { getCurrentUserId } from "../../utils/auth";

export interface IMessage {
  id: string;
  fromMe: boolean;
  text?: string;
  time: string;
  audioDuration?: string;
  type?: "text" | "audio";
}

export interface IUser {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  time?: string;
  starred?: boolean;
}


const ChatPage: React.FC = () => {
  const { state, loadThreads, selectThread, sendMessage, markAsRead, ensureThread, loadMoreMessages, clearError } = useChat();
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingOlderMessages, setIsLoadingOlderMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const currentUserId = getCurrentUserId();
  const previousScrollHeight = useRef<number>(0);

  // Calculate other user ID for WebSocket connection
  const getOtherUserId = () => {
    if (!state.activeThread) return '';
    const otherUserId = state.activeThread.user1 === currentUserId ? state.activeThread.user2 : state.activeThread.user1;
    return otherUserId.toString();
  };

  const { connectionStatus, sendTyping } = useWebSocket({
    otherUserId: getOtherUserId(),
    onMessage: (message: DirectMessage) => {
      // Message handling is done in ChatContext, just scroll to bottom
      scrollToBottom();
    },
    onTyping: (userId: string, typing: boolean) => {
      if (userId === getOtherUserId()) {
        setIsTyping(typing);
      }
    },
    autoConnect: !!state.activeThread
  });

  useEffect(() => {
    // Load threads when component mounts
    console.log('🚀 ChatPage mounted - Loading threads...'); // Debug log
    console.log('🚀 Current user ID:', currentUserId);
    console.log('🚀 Is authenticated:', !!localStorage.getItem('access'));
    loadThreads();
  }, []); // Remove loadThreads dependency to prevent re-renders

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleScroll = useCallback(async () => {
    if (!chatBodyRef.current || !state.activeThread) return;
    
    const { scrollTop, scrollHeight } = chatBodyRef.current;
    
    // If user scrolled to top (with some threshold) and we have more messages to load
    const isAtTop = scrollTop < 100;
    const pagination = state.messagesPagination[state.activeThread.id];
    
    if (isAtTop && pagination?.hasMore && !pagination.isLoadingMore && !isLoadingOlderMessages) {
      setIsLoadingOlderMessages(true);
      previousScrollHeight.current = scrollHeight;
      
      try {
        await loadMoreMessages(state.activeThread.id);
      } finally {
        setIsLoadingOlderMessages(false);
      }
    }
  }, [state.activeThread, state.messagesPagination, isLoadingOlderMessages, loadMoreMessages]);

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const convertToIMessage = (msg: DirectMessage): IMessage => {
    // First check if we have sender_id (preferred)
    let isFromMe = false;
    
    if (msg.sender_id !== undefined && msg.sender_id !== null) {
      // Use sender_id if available (this is the most reliable)
      isFromMe = msg.sender_id === currentUserId;
    } else if (msg.sender) {
      // Fallback: use sender email to determine if it's from current user
      const currentUserEmail = localStorage.getItem('email') || localStorage.getItem('user_email');
      isFromMe = msg.sender === currentUserEmail;
    }
    
    // Only log if there's an issue with sender identification
    if (msg.sender_id === undefined && !msg.sender) {
      console.warn('⚠️ Message missing sender info:', msg.id);
    }
    
    return {
      id: msg.id,
      fromMe: isFromMe,
      text: msg.content,
      time: formatMessageTime(msg.created_at),
      type: 'text'
    };
  };

  // Convert messages to display format
  const messages = state.activeThread 
    ? (Array.isArray(state.messages[state.activeThread.id]) ? state.messages[state.activeThread.id] : []).map(convertToIMessage)
    : [];

  useEffect(() => {
    if (state.activeThread) {
      scrollToBottom();
      markAsRead(state.activeThread.id);
    }
  }, [state.activeThread, markAsRead]);

  useEffect(() => {
    // Only auto-scroll to bottom when switching threads or if user is near bottom
    if (!chatBodyRef.current) {
      scrollToBottom();
      return;
    }
    
    const chatBody = chatBodyRef.current;
    const { scrollTop, scrollHeight, clientHeight } = chatBody;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
    
    // Always scroll to bottom when switching threads or if user is near bottom
    if (isNearBottom) {
      scrollToBottom();
    }
  }, [state.messages, state.activeThread?.id]);

  // Add scroll event listener
  useEffect(() => {
    const chatBody = chatBodyRef.current;
    if (!chatBody) return;

    chatBody.addEventListener('scroll', handleScroll);
    return () => {
      chatBody.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // Maintain scroll position when older messages are loaded
  useEffect(() => {
    if (!chatBodyRef.current) return;
    
    const chatBody = chatBodyRef.current;
    const currentScrollHeight = chatBody.scrollHeight;
    
    // If we just finished loading older messages, maintain scroll position
    if (previousScrollHeight.current > 0 && currentScrollHeight > previousScrollHeight.current) {
      const heightDifference = currentScrollHeight - previousScrollHeight.current;
      chatBody.scrollTop += heightDifference;
      previousScrollHeight.current = 0; // Reset after adjusting
    }
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim() || !state.activeThread) return;
    sendMessage(text);
    scrollToBottom();
  };

  const handleTyping = useCallback(() => {
    sendTyping(true);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      sendTyping(false);
    }, 2000);
  }, [sendTyping]);

  const handleStartNewChat = useCallback(async (user: User) => {
    try {
      console.log('Starting new chat with user:', user);
      const thread = await ensureThread(user.id);
      console.log('Created/found thread:', thread);
      
      // Wait a moment for the thread to be properly added to state
      setTimeout(() => {
        selectThread(thread);
      }, 100);
    } catch (error) {
      console.error('Failed to start new chat:', error);
    }
  }, [ensureThread, selectThread]);

  const convertToIUser = (thread: DirectThread): IUser => {
    // Get the other user ID (not the current user)
    const otherUserId = thread.user1 === currentUserId ? thread.user2 : thread.user1;
    
    // Create display name - try different sources
    let displayName = '';
    
    // First try participant info from backend
    if (thread.participant?.full_name) {
      displayName = thread.participant.full_name;
      if (thread.participant.email) {
        displayName += ` (${thread.participant.email})`;
      }
    } else if (thread.participant?.username) {
      displayName = thread.participant.username;
      if (thread.participant.email) {
        displayName += ` (${thread.participant.email})`;
      }
    } else if (thread.participant?.email) {
      displayName = thread.participant.email;
    } else {
      // Fallback: Use user ID
      displayName = `User ${otherUserId}`;
    }
    
    // Get last message info
    const lastMessage = thread.last_message?.content || 'Start a conversation';
    const lastMessageTime = thread.last_message_at || thread.created_at;
    
    const iUser = {
      id: thread.id,
      name: displayName,
      avatar: thread.participant?.avatar,
      lastMessage: lastMessage,
      time: lastMessageTime ? formatMessageTime(lastMessageTime) : undefined,
      starred: false
    };
    
    return iUser;
  };

  // Convert threads to users with error handling
  const users = Array.isArray(state.threads) ? state.threads.map((thread) => {
    try {
      return convertToIUser(thread);
    } catch (error) {
      console.error('❌ Error converting thread to user:', error, thread);
      // Return a fallback user so the UI doesn't break
      return {
        id: thread.id,
        name: `Thread ${thread.id}`,
        lastMessage: 'Error loading thread',
        time: undefined,
        starred: false
      };
    }
  }) : [];

  // Debug logging (only log on significant changes)
  // Removed to prevent console spam

  // Add error boundary for debugging
  if (!state) {
    console.error('Chat state is undefined');
    return <div className="ugogo-chat-page">Loading chat...</div>;
  }

  // Don't block entire chat for message loading errors
  // Only show error if threads failed to load
  if (state.error && state.threads.length === 0) {
    return (
      <div className="ugogo-chat-page">
        <div className="chat-error">
          <p>Error loading chat: {state.error}</p>
          <button onClick={() => {
            clearError();
            loadThreads();
          }}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="ugogo-chat-page">
      {/* Show error banner if there's an error but threads are loaded */}
      {state.error && state.threads.length > 0 && (
        <div className="error-banner">
          <span>{state.error}</span>
          <button onClick={clearError} className="close-error">×</button>
        </div>
      )}
      <div className="ugogo-chat-inner">
        <ChatSidebar 
          users={users}
          onSelectUser={(userId) => {
            const thread = state.threads.find(t => t.id === userId);
            if (thread) {
              selectThread(thread);
            }
          }}
          activeUserId={state.activeThread?.id}
          onStartNewChat={handleStartNewChat}
        />
        <div className="chat-main">
          {state.activeThread ? (
            <>
              <ChatHeader 
                user={convertToIUser(state.activeThread)}
                connectionStatus={connectionStatus}
                isTyping={isTyping}
              />
              <div className="chat-body" id="chat-body" ref={chatBodyRef}>
                <div className="chat-body-inner">
                  {/* Loading indicator for older messages */}
                  {isLoadingOlderMessages && (
                    <div className="loading-older-messages">
                      <span>Loading older messages...</span>
                    </div>
                  )}
                  
                  {state.isLoadingMessages ? (
                    <div className="loading-messages">
                      <span>Loading messages...</span>
                    </div>
                  ) : state.error && messages.length === 0 ? (
                    <div className="no-messages">
                      <p>Failed to load messages</p>
                      <button onClick={() => {
                        clearError();
                        if (state.activeThread) {
                          selectThread(state.activeThread);
                        }
                      }} className="retry-btn">
                        Retry
                      </button>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="no-messages">
                      <p>No messages yet. Start a conversation!</p>
                    </div>
                  ) : (
                    messages.map((m) => (
                      <MessageBubble key={m.id} message={m} />
                    ))
                  )}
                  {isTyping && (
                    <div className="typing-indicator">
                      <span>{state.activeThread.participant?.full_name || `User ${getOtherUserId()}`} is typing...</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              <div className="chat-footer">
                <ChatInput 
                  onSend={handleSend}
                  onTyping={handleTyping}
                />
              </div>
            </>
          ) : (
            <div className="no-chat-selected">
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
