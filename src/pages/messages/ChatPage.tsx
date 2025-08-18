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
  const { state, loadThreads, selectThread, sendMessage, markAsRead, ensureThread } = useChat();
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const currentUserId = getCurrentUserId();

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
  }, [loadThreads]);

  useEffect(() => {
    if (state.activeThread) {
      scrollToBottom();
      markAsRead(state.activeThread.id);
    }
  }, [state.activeThread, markAsRead]);

  useEffect(() => {
    scrollToBottom();
  }, [state.messages, state.activeThread?.id]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

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

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const convertToIMessage = (msg: DirectMessage): IMessage => {
    // Convert sender username to sender_id if needed
    if (!msg.sender_id && msg.sender) {
      // For now, we'll need to determine if this message is from current user
      // This is a temporary solution until we have proper user mapping
      const currentUserName = localStorage.getItem('username'); // Assuming we store username
      msg.sender_id = msg.sender === currentUserName ? currentUserId : 0; // Fallback
    }
    
    return {
      id: msg.id,
      fromMe: msg.sender_id === currentUserId,
      text: msg.content,
      time: formatMessageTime(msg.created_at),
      type: 'text'
    };
  };

  const convertToIUser = (thread: DirectThread): IUser => {
    console.log('🔄 Converting thread to IUser:', thread);
    
    // Get the other user ID (not the current user)
    const otherUserId = thread.user1 === currentUserId ? thread.user2 : thread.user1;
    console.log('🔄 Other user ID:', otherUserId, 'Current user ID:', currentUserId);
    
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
    
    console.log('🔄 Display name:', displayName);
    
    // Get last message info
    const lastMessage = thread.last_message?.content || 'Start a conversation';
    const lastMessageTime = thread.last_message_at || thread.created_at;
    
    console.log('🔄 Last message:', lastMessage);
    console.log('🔄 Last message time:', lastMessageTime);
    
    const iUser = {
      id: thread.id,
      name: displayName,
      avatar: thread.participant?.avatar,
      lastMessage: lastMessage,
      time: lastMessageTime ? formatMessageTime(lastMessageTime) : undefined,
      starred: false
    };
    
    console.log('✅ Converted IUser:', iUser);
    return iUser;
  };

  const messages = state.activeThread 
    ? (Array.isArray(state.messages[state.activeThread.id]) ? state.messages[state.activeThread.id] : []).map(convertToIMessage)
    : [];

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

  // Debug logging
  console.log('🎨 ChatPage render - threads count:', state.threads?.length, 'active thread:', state.activeThread?.id);
  console.log('🎨 ChatPage render - users for sidebar:', users.length);
  console.log('🎨 ChatPage render - state.threads:', state.threads);
  console.log('🎨 ChatPage render - converted users:', users);

  // Add error boundary for debugging
  if (!state) {
    console.error('Chat state is undefined');
    return <div className="ugogo-chat-page">Loading chat...</div>;
  }

  if (state.error) {
    return (
      <div className="ugogo-chat-page">
        <div className="chat-error">
          <p>Error loading chat: {state.error}</p>
          <button onClick={() => loadThreads()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="ugogo-chat-page">
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
                  {state.isLoadingMessages ? (
                    <div className="loading-messages">
                      <span>Loading messages...</span>
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
