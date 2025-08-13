// import React, { useState, useEffect } from "react";
// import "./Messages.scss";

// // Define a type for a message in the chat
// interface Message {
//   id: number;
//   text: string;
//   timestamp: string;
//   type: "sent" | "received" | "audio";
// }

// // Define a type for a chat in the sidebar
// interface Chat {
//   id: number;
//   name: string;
//   lastMessage: string;
//   timestamp: string;
//   isStarred: boolean;
//   avatarUrl: string;
// }

// const Messages: React.FC = () => {
//   // Mock data for the sidebar chats
//   const [chats, setChats] = useState<Chat[]>([
//     {
//       id: 1,
//       name: "Jennifer Markus",
//       lastMessage: "Hey! Did you finish the Hi-Fi wireframes for flora app design?",
//       timestamp: "Today | 05:30 PM",
//       isStarred: true,
//       avatarUrl: "https://placehold.co/40x40/f0f0f0/333333?text=JM",
//     },
//     {
//       id: 2,
//       name: "Jennifer Markus",
//       lastMessage: "Hey! Did you finish the Hi-Fi wireframes for flora app design?",
//       timestamp: "Today | 05:30 PM",
//       isStarred: true,
//       avatarUrl: "https://placehold.co/40x40/f0f0f0/333333?text=JM",
//     },
//     {
//       id: 3,
//       name: "Jennifer Markus",
//       lastMessage: "Hey! Did you finish the Hi-Fi wireframes for flora app design?",
//       timestamp: "Today | 05:30 PM",
//       isStarred: true,
//       avatarUrl: "https://placehold.co/40x40/f0f0f0/333333?text=JM",
//     },
//     {
//       id: 4,
//       name: "Jennifer Markus",
//       lastMessage: "Hey! Did you finish the Hi-Fi wireframes for flora app design?",
//       timestamp: "Today | 05:30 PM",
//       isStarred: true,
//       avatarUrl: "https://placehold.co/40x40/f0f0f0/333333?text=JM",
//     },
//     {
//       id: 5,
//       name: "Jennifer Markus",
//       lastMessage: "Hey! Did you finish the Hi-Fi wireframes for flora app design?",
//       timestamp: "Today | 05:30 PM",
//       isStarred: true,
//       avatarUrl: "https://placehold.co/40x40/f0f0f0/333333?text=JM",
//     },
//   ]);

//   // Mock data for the messages in a selected chat
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: 1,
//       text: "Oh, hello! All perfectly. I will check it and get back to you soon",
//       timestamp: "04:45 PM",
//       type: "received",
//     },
//     {
//       id: 2,
//       text: "Oh, hello! All perfectly. I will check it and get back to you soon",
//       timestamp: "04:45 PM",
//       type: "sent",
//     },
//     {
//       id: 3,
//       text: "Oh, hello! All perfectly. I will check it and get back to you soon",
//       timestamp: "04:45 PM",
//       type: "received",
//     },
//     {
//       id: 4,
//       text: "audio",
//       timestamp: "04:45 PM",
//       type: "audio",
//     },
//     {
//       id: 5,
//       text: "Oh, hello! All perfectly. I will check it and get back to you soon",
//       timestamp: "04:45 PM",
//       type: "received",
//     },
//   ]);

//   const [currentChatId, setCurrentChatId] = useState<number>(1);
//   const [inputMessage, setInputMessage] = useState<string>("");

//   const handleSendMessage = () => {
//     if (inputMessage.trim()) {
//       const newMessage: Message = {
//         id: messages.length + 1,
//         text: inputMessage,
//         timestamp: new Date().toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         }),
//         type: "sent",
//       };
//       setMessages([...messages, newMessage]);
//       setInputMessage("");
//     }
//   };

//   return (
//     <div className="messages-container">
//       <div className="sidebar">
//         <div className="sidebar-header">
//           <span className="sidebar-title">All Messages</span>
//           <div className="sidebar-header-actions">
//             <button className="sidebar-dropdown-button">
//               <i className="fas fa-chevron-down"></i>
//             </button>
//             <button className="sidebar-menu-button">
//               <i className="fas fa-ellipsis-v"></i>
//             </button>
//           </div>
//         </div>
//         <div className="sidebar-search">
//           <i className="fas fa-search search-icon"></i>
//           <input type="text" placeholder="Search or start a new chat" />
//         </div>
//         <ul className="chat-list">
//           {chats.map((chat) => (
//             <li
//               key={chat.id}
//               className={`chat-item ${chat.id === currentChatId ? "active" : ""}`}
//               onClick={() => setCurrentChatId(chat.id)}
//             >
//               <img src={chat.avatarUrl} alt={chat.name} className="avatar" />
//               <div className="chat-content">
//                 <div className="chat-details">
//                   <span className="chat-name">{chat.name}</span>
//                   {chat.isStarred && (
//                     <i className="fas fa-star star-icon"></i>
//                   )}
//                 </div>
//                 <p className="last-message">{chat.lastMessage}</p>
//                 <span className="timestamp">{chat.timestamp}</span>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>

//       <div className="main-chat">
//         <div className="chat-header">
//           <div className="user-info">
//             <img src="https://placehold.co/40x40/f0f0f0/333333?text=JD" alt="John Doe" className="avatar" />
//             <div>
//               <span className="user-name">John Doe</span>
//               <div className="user-rating">
//                 <i className="fas fa-star filled"></i>
//                 <span className="rating-score">5</span>
//                 <span className="rating-count">(435)</span>
//               </div>
//             </div>
//           </div>
//           <div className="chat-actions">
//             <div className="icon-wrapper">
//                 <i className="far fa-star action-icon"></i>
//             </div>
//             <div className="icon-wrapper">
//                 <i className="fas fa-search action-icon"></i>
//             </div>
//             <div className="icon-wrapper">
//                 <i className="fas fa-ellipsis-v action-icon"></i>
//             </div>
//           </div>
//         </div>

//         <div className="message-list">
//           {messages.map((message) => (
//             <div key={message.id} className={`message-group ${message.type}`}>
//               <div className="message-bubble">
//                 {message.type === "audio" ? (
//                   <div className="audio-message">
//                     <i className="fas fa-play play-icon"></i>
//                     <div className="waveform">
//                       <div className="bar"></div>
//                       <div className="bar"></div>
//                       <div className="bar"></div>
//                       <div className="bar"></div>
//                       <div className="bar"></div>
//                       <div className="bar"></div>
//                       <div className="bar"></div>
//                       <div className="bar"></div>
//                       <div className="bar"></div>
//                       <div className="bar"></div>
//                     </div>
//                     <span className="audio-duration">01:24</span>
//                   </div>
//                 ) : (
//                   <p>{message.text}</p>
//                 )}
//               </div>
//               <span className="message-timestamp">{message.timestamp}</span>
//             </div>
//           ))}
//         </div>

//         <div className="chat-input-area">
//           <i className="far fa-laugh-beam emoji-icon"></i>
//           <input
//             type="text"
//             placeholder="Type your message here..."
//             value={inputMessage}
//             onChange={(e) => setInputMessage(e.target.value)}
//             onKeyDown={(e) => {
//               if (e.key === "Enter") {
//                 handleSendMessage();
//               }
//             }}
//           />
//           <button className="send-button" onClick={handleSendMessage}>
//             <i className="fas fa-paper-plane"></i>
//           </button>
//           <div className="input-actions">
//             <i className="fas fa-plus"></i>
//             <i className="fas fa-microphone"></i>
//             <i className="fas fa-thumbs-up"></i>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Messages;
import React, { useState } from "react";
import "./ChatPage.scss";
import { ChatSidebar } from "./components/ChatSidebar";
import { ChatHeader } from "./components/ChatHeader";
import { MessageBubble } from "./components/MessageBubble";
import { ChatInput } from "./components/ChatInput";
import { Sidenav } from "../../layouts/Sidenav";

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
      <Sidenav />
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
