import React, { useState, useEffect, useRef } from "react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    
    {
      from: "bot",
      text: "Hi there! I’m 🚗 Mercfueler — your AI assistant for Mercedes fuel and performance. How can I help today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);
  

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { from: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    // Simulate AI "thinking"
    setTimeout(() => {
      setIsTyping(false);
      const botResponse =
        "Interesting question! 💡 Try smoother acceleration — it often improves MPG by up to 5%.";
      setMessages([...newMessages, { from: "bot", text: botResponse }]);
    }, 1500);
  };

  return (
    <div>
    {/* Floating Button */}
{!open && (
  <button
    onClick={() => setOpen(true)}
    className="fixed bottom-20 right-8 z-[9999] bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2 font-semibold transition-all duration-300 hover:scale-105"
    style={{
      boxShadow:
        "0 0 25px rgba(0, 200, 255, 0.6), 0 0 60px rgba(0, 200, 255, 0.3)",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow =
        "0 0 40px rgba(0, 240, 255, 0.9), 0 0 100px rgba(0, 220, 255, 0.5)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow =
        "0 0 25px rgba(0, 200, 255, 0.6), 0 0 60px rgba(0, 200, 255, 0.3)";
    }}
  >
    ✨ <span>Chat with AI</span>
  </button>
)}

    {/* Chat Window */}
    {open && (
    <div
    className="fixed bottom-16 right-8 z-[9999] w-[400px] bg-gray-900 text-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-blue-400"
    style={{
      boxShadow:
        "0 0 40px rgba(0, 220, 255, 0.4), 0 0 90px rgba(0, 220, 255, 0.3)",
    }}
  >

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-4 flex justify-between items-center">
            <h3 className="font-bold text-lg tracking-wide">🦾 Mercfueler</h3>
            <button
              onClick={() => setOpen(false)}
              className="text-white hover:text-gray-200 transition"
            >
              ✖
            </button>
          </div>

          {/* Messages */}
<div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[420px]">
  {messages.map((msg, i) => (
    <div
      key={i}
      className={`p-3 rounded-lg max-w-[85%] ${
        msg.from === "bot"
          ? "bg-blue-500/20 text-blue-100 self-start shadow-md"
          : "bg-gray-700 text-gray-100 self-end ml-auto shadow-md"
      }`}
      style={{
        border:
          msg.from === "bot"
            ? "1px solid rgba(0,200,255,0.4)"
            : "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {msg.text}
    </div>
  ))}

  {/* Typing indicator */}
  {isTyping && (
    <div className="flex items-center gap-2 text-blue-300 text-sm italic">
      <div className="flex space-x-1">
        <span className="dot bg-blue-300 w-2 h-2 rounded-full animate-bounce" />
        <span className="dot bg-blue-300 w-2 h-2 rounded-full animate-bounce delay-150" />
        <span className="dot bg-blue-300 w-2 h-2 rounded-full animate-bounce delay-300" />
      </div>
      🤔 Thinking...
    </div>
  )}

  {/* 👇 put the scroll anchor INSIDE this div */}
  <div ref={messagesEndRef} />
</div>



          {/* Input */}
          <div className="flex p-3 border-t border-gray-800 bg-gray-850">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-1 p-2 bg-gray-800 text-white rounded-lg outline-none"
            />
            <button
              onClick={handleSend}
              className="ml-2 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 px-3 rounded-lg transition-all"
              style={{
                boxShadow:
                  "0 0 15px rgba(0,200,255,0.5), 0 0 35px rgba(0,200,255,0.3)",
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
