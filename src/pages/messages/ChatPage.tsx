import React, { useState } from "react";
import "./ChatPage.scss";
import { ChatSidebar } from "./components/ChatSidebar";
import { ChatHeader } from "./components/ChatHeader";
import { MessageBubble } from "./components/MessageBubble";
import { ChatInput } from "./components/ChatInput";

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

const mockUsers: IUser[] = new Array(6).fill(null).map((_, i) => ({
  id: `u-${i}`,
  name: "John Doe",
  avatar: "JD",
  lastMessage: "Hey! Did you finish the Hi-FI wireframes for flora app design?",
  time: "05:30 PM",
  starred: i === 0 ? true : false,
}));

const mockMessages: IMessage[] = [
  {
    id: "m-1",
    fromMe: false,
    text: "Oh, hello! All perfectly.\nI will check it and get back to you soon",
    time: "04:45 PM",
    type: "text",
  },
  {
    id: "m-2",
    fromMe: true,
    text: "Oh, hello! All perfectly.\nI will check it and get back to you soon",
    time: "04:45 PM",
    type: "text",
  },
  {
    id: "m-3",
    fromMe: false,
    type: "audio",
    audioDuration: "01:24",
    time: "04:45 PM",
  },
  {
    id: "m-4",
    fromMe: false,
    text: "Oh, hello! All perfectly.\nI will check it and get back to you soon",
    time: "04:45 PM",
    type: "text",
  },
];

const ChatPage: React.FC = () => {
  const [users] = useState<IUser[]>(mockUsers);
  const [activeUser] = useState<IUser>(mockUsers[0]);
  const [messages, setMessages] = useState<IMessage[]>(mockMessages);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const newMsg: IMessage = {
      id: `m-${Date.now()}`,
      fromMe: true,
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "text",
    };
    setMessages((s) => [...s, newMsg]);
  };

  return (
    <div className="ugogo-chat-page">
      <div className="ugogo-chat-inner">
        <ChatSidebar users={users} />
        <div className="chat-main">
          <ChatHeader user={activeUser} />
          <div className="chat-body" id="chat-body">
            <div className="chat-body-inner">
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
            </div>
          </div>

          <div className="chat-footer">
            <ChatInput onSend={handleSend} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
