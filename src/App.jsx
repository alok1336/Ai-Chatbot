import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setStarted(true);

    const userMessage = { text: input, sender: "user" };
    const newMessages = [...messages, userMessage];

    setMessages([...newMessages, { text: "typing", sender: "bot" }]);
    setInput("");

    try {
      const res = await fetch("https://ai-chatbot-7wgs.onrender.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      setMessages([
        ...newMessages,
        { text: data.reply, sender: "bot" },
      ]);
    } catch (error) {
      console.error(error);
      setMessages([
        ...newMessages,
        { text: "Something went wrong ❌", sender: "bot" },
      ]);
    }
  };

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="app">
      {!started ? (
        <div className="landing">
          <h1>AI Assistant</h1>
          <p>Ask anything. Get instant answers.</p>

          <div className="input-box">
            <input
              value={input}
              placeholder="Ask something..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      ) : (
        <div className="chat">
          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index} className={`msg ${msg.sender}`}>
                {msg.text === "typing" ? (
                  <div className="typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                ) : (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                )}
              </div>
            ))}
            <div ref={bottomRef}></div>
          </div>

          <div className="input-box chat-input">
            <input
              value={input}
              placeholder="Type your message..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;