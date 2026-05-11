import React, { useState } from "react";
import axios from "axios";
import "../styles/Chatbot.css";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = { sender: "user", text: message };
    setChat((prev) => [...prev, userMsg]);

    try {
      const token =
        sessionStorage.getItem("token") ||
        localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/chat",
        { message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const botMsg = { sender: "bot", text: res.data.reply };

      setChat((prev) => [...prev, botMsg]);
    } catch (err) {
      setChat((prev) => [
        ...prev,
        { sender: "bot", text: "Server error" },
      ]);
    }

    setMessage("");
  };

  return (
    <>
      {/* FLOATING BUTTON */}
      <div className="chat-icon" onClick={() => setOpen(!open)}>
        🤖
      </div>

      {/* CHAT BOX */}
      {open && (
        <div className="chatbox">
          <div className="chat-header">
            QuickBite Assistant
            <span onClick={() => setOpen(false)}>✖</span>
          </div>

          <div className="chat-body">
            {chat.map((c, i) => (
              <div
                key={i}
                className={`msg ${c.sender}`}
              >
                {c.text}
              </div>
            ))}
          </div>

          <div className="chat-footer">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask something..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;