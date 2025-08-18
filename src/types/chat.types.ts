export interface DirectThread {
  id: string;
  user1: number;
  user2: number;
  created_at: string;
  last_message_at: string | null;
  // Additional computed fields for frontend
  participant?: User;
  last_message?: DirectMessage;
  unread_count?: number;
}

export interface User {
  id: number;
  username?: string;
  full_name?: string;
  email?: string;
  avatar?: string;
  is_online?: boolean;
  last_seen?: string;
}

export interface DirectMessage {
  id: string;
  thread: string;
  sender: string; // username from backend
  sender_id?: number; // computed field
  content: string;
  created_at: string;
  is_read?: boolean;
  edited?: boolean;
  deleted?: boolean;
  reply_to?: string;
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  id: string;
  type: 'image' | 'file' | 'voice';
  url: string;
  name?: string;
  size?: number;
  duration?: number;
  thumbnail?: string;
}

export interface WebSocketMessage {
  content: string;
  timestamp?: string;
  type?: 'message' | 'typing' | 'auth' | 'ping';
}

export interface ChatState {
  threads: DirectThread[];
  activeThread: DirectThread | null;
  messages: Record<string, DirectMessage[]>;
  connectionStatus: Record<string, 'connecting' | 'connected' | 'disconnected' | 'error'>;
  typingUsers: Record<string, boolean>;
  unreadCounts: Record<string, number>;
  isLoadingThreads: boolean;
  isLoadingMessages: boolean;
  error: string | null;
}

export interface SendMessagePayload {
  threadId: string;
  content: string;
  tempId?: string;
}

export interface TypingIndicatorPayload {
  threadId: string;
  userId: string;
  isTyping: boolean;
}

export interface OfferForChat {
  id: number;
  courier_id: number;
  status: string;
  price: string;
  available_weight: string;
  available_space: string;
  user_flight: {
    id: number;
    flight: {
      id: number;
      publisher: string;
      publisher_display: string;
      from_airport: {
        id: number;
        airport_code: string;
        airport_name: string;
        city: {
          id: number;
          city_code: string;
          city_name: string;
          country: {
            id: number;
            country_code: string;
            country_name: string;
          };
        };
      };
      to_airport: {
        id: number;
        airport_code: string;
        airport_name: string;
        city: {
          id: number;
          city_code: string;
          city_name: string;
          country: {
            id: number;
            country_code: string;
            country_name: string;
          };
        };
      };
      departure_datetime: string;
      arrival_datetime: string;
    };
    user: {
      id: number;
      email: string;
      full_name: string;
      is_active: boolean;
      is_staff: boolean;
      date_joined: string;
      is_email_verified: boolean;
      passport_verification_status: string;
      is_passport_uploaded: boolean;
      balance: string;
    };
    publish_datetime: string;
  };
}