import React, { useState } from "react";
import "./../ChatPage.scss";

import emojiIcon from "../../../assets/icons/emoji.svg";
import sendIcon from "../../../assets/icons/adddd.svg";
import micIcon from "../../../assets/icons/mic-rounded.svg";
import likeIcon from "../../../assets/icons/mdi_like.svg";

interface Props {
  onSend: (text: string) => void;
}

export const ChatInput: React.FC<Props> = ({ onSend }) => {
  const [value, setValue] = useState("");

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!value.trim()) return;
    onSend(value);
    setValue("");
    setTimeout(() => {
      const el = document.getElementById("chat-body");
      if (el) el.scrollTop = el.scrollHeight;
    }, 50);
  };

  return (
    <form className="chat-input-form" onSubmit={submit}>
      {/* Emoji Button */}
      <button type="button" aria-label="emoji" className="circle-btn">
        <img src={emojiIcon} alt="emoji" />
      </button>

      {/* Input with Send Button inside */}
      <div className="input-wrapper">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type your message here ..."
        />
        <button type="submit" aria-label="send" className="send-btn">
          <img src={sendIcon} alt="send" />
        </button>
      </div>

      {/* Mic & Like Buttons */}
      <button type="button" aria-label="mic" className="circle-btn">
        <img src={micIcon} alt="mic" />
      </button>
      <button type="button" aria-label="like" className="circle-btn">
        <img src={likeIcon} alt="like" />
      </button>
    </form>
  );
};
