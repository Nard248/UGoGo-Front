import React, { useState } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import "./../ChatPage.scss";

import emojiIcon from "../../../assets/icons/emoji.svg";
import likeIcon from "../../../assets/icons/mdi_like.svg";

interface Props {
  onSend: (text: string) => void;
  onTyping?: () => void;
}

export const ChatInput: React.FC<Props> = ({ onSend, onTyping }) => {
  const [value, setValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!value.trim()) return;
    onSend(value);
    setValue("");
    setShowEmojiPicker(false); // close picker after send
    setTimeout(() => {
      const el = document.getElementById("chat-body");
      if (el) el.scrollTop = el.scrollHeight;
    }, 50);
  };

  const sendLike = () => {
    onSend("👍");
    setTimeout(() => {
      const el = document.getElementById("chat-body");
      if (el) el.scrollTop = el.scrollHeight;
    }, 50);
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    // Insert emoji into the input instead of sending
    setValue((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="chat-input-container">
      <form
        className="chat-input-form"
        onSubmit={submit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
      >
        {/* Emoji Button */}
        <button
          type="button"
          aria-label="emoji"
          className="circle-btn"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
        >
          <img src={emojiIcon} alt="emoji" />
        </button>

        {/* Input with Send Button inside */}
        <div className="input-wrapper">
          <input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              onTyping?.();
            }}
            placeholder="Type your message here ..."
          />

          <button
            type="submit"
            aria-label="send"
            className="send-btn custom-send-btn"
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M3 12h14M13 5l7 7-7 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Like Button */}
        <button
          type="button"
          aria-label="like"
          className="circle-btn"
          onClick={sendLike}
        >
          <img src={likeIcon} alt="like" />
        </button>
      </form>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="emoji-picker-popup">
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}
    </div>
  );
};
