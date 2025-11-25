// BrowserView.tsx - with data extraction display
import { useState, useEffect, useRef } from "react";


export default function BrowserView() {
  const [url, setUrl] = useState("https://en.wikipedia.org");
  const [inputUrl, setInputUrl] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [showExtraction, setShowExtraction] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8788");

    ws.onopen = () => {
      console.log("✅ Connected to Agent");
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Receive navigation command
        if (data.type === "browser_navigate") {
          console.log("🧭 Navigate to:", data.url);
          setUrl(data.url);
          setExtractedData(null); // Clear previous extraction
          setShowExtraction(false);
        }
        
        // Receive extraction result
        if (data.type === "extraction_result") {
          console.log("📊 Received extracted data:", data.data);
          setExtractedData(data.data);
          setShowExtraction(true);
        }
      } catch (e) {
        console.error("Failed to parse message:", e);
      }
    };

    ws.onclose = () => {
      console.log("❌ Disconnected from Agent");
      setIsConnected(false);
    };

    socketRef.current = ws;
    return () => ws.close();
  }, []);

  function navigate() {
    if (inputUrl.trim()) {
      let target = inputUrl.trim();
      if (!target.startsWith("http")) {
        target = "https://" + target;
      }
      setUrl(target);
      setExtractedData(null);
      setShowExtraction(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#1a1a1a",
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          padding: "12px 16px",
          background: "#2a2a2a",
          borderBottom: "1px solid #3a3a3a",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: isConnected ? "#4CAF50" : "#f44336",
              animation: isConnected ? "pulse 2s ease-in-out infinite" : "none",
            }}
          />
          <span style={{ fontSize: 12, color: isConnected ? "#4CAF50" : "#f44336" }}>
            {isConnected ? "🤖 Agent Connected" : "⚠️ Not Connected"}
          </span>
          
          {extractedData && (
            <button
              onClick={() => setShowExtraction(!showExtraction)}
              style={{
                marginLeft: "auto",
                padding: "6px 12px",
                background: showExtraction ? "#FF9800" : "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 11,
              }}
            >
              {showExtraction ? "📄 Show Webpage" : "📊 View Extracted Data"}
            </button>
          )}
        </div>


        {/* Current URL */}
        <div
          style={{
            marginTop: 8,
            fontSize: 11,
            color: "#888",
          }}
        >
          📍 {url}
        </div>
      </div>

      {/* Content area */}
      <div style={{ flex: 1, background: "#fff", position: "relative" }}>
        {/* Webpage iframe */}
        <iframe
          ref={iframeRef}
          key={url}
          src={url}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            display: showExtraction ? "none" : "block",
          }}
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        />

        {/* Extracted data display */}
        {showExtraction && extractedData && (
          <div
            style={{
              width: "100%",
              height: "100%",
              padding: 20,
              overflow: "auto",
              background: "#0a0a0a",
              color: "#e0e0e0",
            }}
          >
            <h2 style={{ marginBottom: 20, color: "#4CAF50" }}>
              📊 Extracted Data
            </h2>

            {/* Title */}
            {extractedData.title && (
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ color: "#FF9800", fontSize: 14, marginBottom: 8 }}>
                  📌 Title
                </h3>
                <div style={{ fontSize: 13, color: "#e0e0e0" }}>
                  {extractedData.title}
                </div>
              </div>
            )}

            {/* All headings */}
            {extractedData.allHeadings && extractedData.allHeadings.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ color: "#FF9800", fontSize: 14, marginBottom: 8 }}>
                  📑 All Headings
                </h3>
                <ul style={{ fontSize: 12, paddingLeft: 20 }}>
                  {extractedData.allHeadings.map((h: string, i: number) => (
                    <li key={i} style={{ marginBottom: 4 }}>{h}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Links */}
            {extractedData.links && extractedData.links.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ color: "#FF9800", fontSize: 14, marginBottom: 8 }}>
                  🔗 Links
                </h3>
                <ul style={{ fontSize: 12, paddingLeft: 20 }}>
                  {extractedData.links.slice(0, 10).map((link: any, i: number) => (
                    <li key={i} style={{ marginBottom: 4 }}>
                      {link.text} → <span style={{ color: "#2196F3" }}>{link.href}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Images */}
            {extractedData.images && extractedData.images.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ color: "#FF9800", fontSize: 14, marginBottom: 8 }}>
                  🖼️ Images
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
                  {extractedData.images.slice(0, 6).map((img: any, i: number) => (
                    <div key={i} style={{ fontSize: 11 }}>
                      <div style={{ color: "#888" }}>{img.alt || "No description"}</div>
                      <div style={{ color: "#2196F3", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {img.src}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Paragraphs */}
            {extractedData.paragraphs && extractedData.paragraphs.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ color: "#FF9800", fontSize: 14, marginBottom: 8 }}>
                  📝 Paragraphs
                </h3>
                {extractedData.paragraphs.slice(0, 5).map((p: string, i: number) => (
                  <p key={i} style={{ fontSize: 12, marginBottom: 12, lineHeight: 1.6 }}>
                    {p}
                  </p>
                ))}
              </div>
            )}

            {/* Lists */}
            {extractedData.lists && extractedData.lists.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ color: "#FF9800", fontSize: 14, marginBottom: 8 }}>
                  📋 Lists
                </h3>
                {extractedData.lists.map((list: string[], i: number) => (
                  <ul key={i} style={{ fontSize: 12, paddingLeft: 20, marginBottom: 12 }}>
                    {list.map((item: string, j: number) => (
                      <li key={j} style={{ marginBottom: 4 }}>{item}</li>
                    ))}
                  </ul>
                ))}
              </div>
            )}

            {/* AI Analysis */}
            {extractedData.aiAnalysis && (
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ color: "#FF9800", fontSize: 14, marginBottom: 8 }}>
                  🤖 AI Analysis
                </h3>
                <pre style={{ 
                  fontSize: 12, 
                  whiteSpace: "pre-wrap", 
                  background: "#1a1a1a", 
                  padding: 12, 
                  borderRadius: 6,
                  lineHeight: 1.6
                }}>
                  {extractedData.aiAnalysis}
                </pre>
              </div>
            )}

            {/* Metadata */}
            <div style={{ marginTop: 30, paddingTop: 20, borderTop: "1px solid #333", fontSize: 11, color: "#666" }}>
              <div>URL: {extractedData.url}</div>
              <div>Extracted at: {new Date(extractedData.timestamp).toLocaleString()}</div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
