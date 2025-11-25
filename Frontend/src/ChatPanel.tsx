import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Connect to WebSocket server
    const ws = new WebSocket("ws://127.0.0.1:8788");

    ws.onopen = () => {
      // WebSocket connected
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Display assistant message
        if (data.type === "message" && data.message?.role === "assistant") {
          let text = "";
          const content = data.message.content;
          
          if (Array.isArray(content)) {
            text = content
              .filter((item: any) => item.type === "text")
              .map((item: any) => item.text)
              .join("");
          } else if (typeof content === "string") {
            text = content;
          }

          if (text) {
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content: text,
                timestamp: new Date(),
              },
            ]);
          }
        }
      } catch (e) {}
    };

    ws.onclose = () => {
      // WebSocket disconnected
      setIsConnected(false);
    };

    socketRef.current = ws;
    return () => ws.close();
  }, []);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function send() {
    if (!input.trim() || !socketRef.current) return;

    // Add user message to UI
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: input,
        timestamp: new Date(),
      },
    ]);

    // Send user input to WebSocket server
    if (socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(input);
    }

    setInput("");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#0a0a0a", color: "#e8e8e8" }}>
      <div style={{ padding: "20px 24px", background: "#111", borderBottom: "1px solid #222" }}>
        <div style={{ fontSize: 16, fontWeight: 600 }}>🤖 Agent AI</div>
        <div style={{ fontSize: 11, color: isConnected ? "#4ade80" : "#f87171", marginTop: 4 }}>
          {isConnected ? "Online" : "Offline"}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: "center", color: "#444", marginTop: 100 }}>
            <div style={{ fontSize: 48 }}>💭</div>
            <div style={{ marginTop: 16 }}>Start a conversation</div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, color: "#666", marginBottom: 6 }}>
                {msg.role === "user" ? "YOU" : "AGENT AI"}
              </div>
              <div style={{ padding: "12px 16px", background: msg.role === "user" ? "#1a1f3a" : "#151515", borderRadius: 12 }}>
                {msg.content}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: "16px 24px", borderTop: "1px solid #222" }}>
        <div style={{ display: "flex", gap: 12 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && send()}
            placeholder="Type a message..."
            style={{ flex: 1, padding: "12px 16px", background: "#151515", color: "#e8e8e8", border: "1px solid #222", borderRadius: 8, outline: "none" }}
          />
          <button onClick={send} style={{ padding: "12px 24px", background: "#667eea", color: "white", border: "none", borderRadius: 8, cursor: "pointer" }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
