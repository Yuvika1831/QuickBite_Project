import React, { useState } from "react";
import axios from "axios";
import "../styles/Chatbot.css";

const ChatbotButton = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = { sender: "user", text: message };
    setChat((prev) => [...prev, userMsg]);

    setLoading(true);

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

      const botMsg = {
        sender: "bot",
        text: res.data.reply,
      };

      setChat((prev) => [...prev, botMsg]);
    } catch (err) {
      setChat((prev) => [
        ...prev,
        { sender: "bot", text: "Server error 😢" },
      ]);
    }

    setLoading(false);
    setMessage("");
  };

  return (
    <>
      {/* FLOAT BUTTON */}
      <div
        className="chatbot-float-btn"
        onClick={() => setOpen(!open)}
      >
        🤖
      </div>

      {/* CHAT WINDOW */}
      {open && (
        <div className="chatbot-box">
          <div className="chatbot-header">
            QuickBite Assistant
            <span onClick={() => setOpen(false)}>✖</span>
          </div>

          <div className="chatbot-body">
            {chat.map((c, i) => (
              <div
                key={i}
                className={`chat-msg ${c.sender}`}
              >
                {c.text}
              </div>
            ))}

            {loading && (
              <div className="chat-msg bot">
                typing...
              </div>
            )}
          </div>

          <div className="chatbot-footer">
            <input
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              placeholder="Ask something..."
            />

            <button onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotButton;
