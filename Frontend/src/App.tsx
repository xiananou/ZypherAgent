// App.tsx
import BrowserView from "./BrowserView.tsx";
import ChatPanel from "./ChatPanel.tsx";

export default function App() {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
      }}
    >
      {/* 左边：浏览器 - 50% */}
      <div style={{ flex: 1, borderRight: "1px solid #333" }}>
        <BrowserView />
      </div>

      {/* 右边：聊天 - 50% */}
      <div style={{ flex: 1 }}>
        <ChatPanel />
      </div>
    </div>
  );
}