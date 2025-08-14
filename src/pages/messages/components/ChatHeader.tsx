import React from "react";
import { IUser } from "../ChatPage";

interface Props {
  user: IUser;
}

export const ChatHeader: React.FC<Props> = ({ user }) => {
  return (
    <header className="chat-header">
      <div className="chat-profile">
        <div className="avatar" />
        <div className="info">
          <h4>{user.name}</h4>
          {/* <div className="sub">
            <span>⭐ 5 (435)</span>
          </div> */}
        </div>
      </div>

      {/* <div className="header-actions">
<button aria-label="star" title="star" className="menu-dot">
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 17.3l6.18 3.9-1.64-7.03L21.5 9.7l-7.19-.62L12 2 9.69 9.08 2.5 9.7l5 4.47L5.86 21.2 12 17.3z"
      fill="none"
      stroke="#f7b05b"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
</button>

        <button aria-label="search" title="search" className="menu-dot">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M10 18a8 8 0 1 1 5.293-14.293A8 8 0 0 1 10 18zM21 21l-4.35-4.35" stroke="#333" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        </button>

        <button aria-label="options" title="options" className="menu-dot">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="5" r="1.6" fill="#333" />
            <circle cx="12" cy="12" r="1.6" fill="#333" />
            <circle cx="12" cy="19" r="1.6" fill="#333" />
          </svg>
        </button>
      </div> */}
    </header>
  );
};
