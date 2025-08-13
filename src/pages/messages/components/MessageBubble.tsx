import React from "react";
import { IMessage } from "../ChatPage";
import "./../ChatPage.scss";

interface Props {
  message: IMessage;
}

export const MessageBubble: React.FC<Props> = ({ message }) => {
  const cls = message.fromMe ? "message-bubble from-me" : "message-bubble from-others";

  return (
    <div className={`message-wrapper ${message.fromMe ? "align-right" : "align-left"}`}>
      <div className={cls}>
        {message.type === "text" && <div className="text">{message.text}</div>}

        {message.type === "audio" && (
          <div className="audio">
            <div className="play" role="button" aria-label="play">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M8 5v14l11-7z" fill="#333" />
              </svg>
            </div>
            <div className="wave" aria-hidden />
            <div className="duration">{message.audioDuration}</div>
          </div>
        )}
      </div>
      <span className="message-time">{message.time}</span>
    </div>
  );
};
