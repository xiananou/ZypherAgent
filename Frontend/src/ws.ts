export function connectWS(onMessage: (msg: string) => void) {
  const socket = new WebSocket("ws://127.0.0.1:8788");

  socket.onopen = () => {
    console.log("✅ Connected to WebSocket server");
  };

  socket.onmessage = (e) => {
    console.log("📩 Received:", e.data);
    onMessage(e.data);
  };

  socket.onerror = (error) => {
    console.error("❌ WebSocket error:", error);
  };

  socket.onclose = (event) => {
    console.log("❌ WebSocket closed:", event.code, event.reason);
    
    // 可选：自动重连
    if (event.code !== 1000) { // 1000 是正常关闭
      console.log("🔄 Attempting to reconnect in 3 seconds...");
      setTimeout(() => {
        console.log("🔄 Reconnecting...");
        connectWS(onMessage);
      }, 3000);
    }
  };

  return socket;
}