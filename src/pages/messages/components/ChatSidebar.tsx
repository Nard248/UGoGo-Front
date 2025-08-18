import React, { useState } from "react";
import { IUser } from "../ChatPage";
import { User } from "../../../types/chat.types";
import { UserSelectorModal } from "./UserSelectorModal";
import "./../ChatPage.scss";

import inboxIcon from "../../../assets/icons/inbox.svg";
import searchIcon from "../../../assets/icons/chat-search.svg";
import plusIcon from "../../../assets/icons/plus.svg";

interface Props {
  users: IUser[];
  onSelectUser?: (userId: string) => void;
  activeUserId?: string;
  onStartNewChat?: (user: User) => void;
}

export const ChatSidebar: React.FC<Props> = ({ users, onSelectUser, activeUserId, onStartNewChat }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStartNewChat = (user: User) => {
    onStartNewChat?.(user);
  };
  return (
    <aside className="chat-sidebar">
      <div className="sidebar-header">
        <div className="title-with-icon">
          <h4>All Messages</h4>
          <img src={inboxIcon} alt="inbox" className="header-icon" />
        </div>
        <button 
          className="start-new-chat-btn"
          onClick={() => setIsModalOpen(true)}
          title="Start new chat"
        >
          <img src={plusIcon} alt="start new chat" />
        </button>
      </div>

      <div className="search">
        <img src={searchIcon} alt="search" className="search-icon" />
        <input placeholder="Search or start a new chat" />
      </div>

      <div className="users" role="list">
        {users.map((u) => (
          <div
            key={u.id}
            className={`user-item ${u.id === activeUserId ? "active" : ""}`}
            role="listitem"
            onClick={() => onSelectUser?.(u.id)}
            style={{ cursor: 'pointer' }}
          >
            <div className="avatar" />
            <div className="user-info">
              <h5>{u.name}</h5>
              <p>{u.lastMessage}</p>
              <div className="meta">
                  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#9aa0a6"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="clock-icon"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
                <span>Today</span>
                <span> | </span>
                <span>{u.time}</span>
              </div>
            </div>
            {/* <div className="star" title="star">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 17.3l6.18 3.9-1.64-7.03L21.5 9.7l-7.19-.62L12 2 9.69 9.08 2.5 9.7l5 4.47L5.86 21.2 12 17.3z"
                  fill="none"
                  stroke="#f7b05b"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
            </div> */}
          </div>
        ))}
      </div>
      
      <UserSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectUser={handleStartNewChat}
      />
    </aside>
  );
};
