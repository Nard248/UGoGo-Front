import React from "react";
import { IMessage } from "../ChatPage";
import "./../ChatPage.scss";

interface Props {
  message: IMessage;
}

const isEmojiOnly = (text: string) => {
  return /^[\p{Emoji}\s]+$/u.test(text);
};

export const MessageBubble: React.FC<Props> = ({ message }) => {
  const cls = message.fromMe ? "message-bubble from-me" : "message-bubble from-others";

  const emojiOnly = message.type === "text" && message.text
    ? isEmojiOnly(message.text)
    : false;

  return (
    <div className={`message-wrapper ${message.fromMe ? "align-right" : "align-left"}`}>
      <div className={cls}>
        {message.type === "text" && (
          <div className={`message-text ${emojiOnly ? "emoji-only" : ""}`}>
            {message.text}
          </div>
        )}

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
