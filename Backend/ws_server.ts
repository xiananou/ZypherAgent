// ws_server.ts
const sockets = new Set<WebSocket>();

export function startWSServer(runTask: (task: string) => void) {
  try {
    Deno.serve({ port: 8788 }, (req) => {
      // ✅ 检查是否是 WebSocket 升级请求
      if (req.headers.get("upgrade") !== "websocket") {
        return new Response("Expected WebSocket upgrade request", { status: 400 });
      }

      // ✅ 必须用 upgradeWebSocket
      const { socket, response } = Deno.upgradeWebSocket(req);

      socket.onopen = () => {
        console.log("✅ WebSocket client connected");
        sockets.add(socket);
        // 发送欢迎消息
        socket.send(JSON.stringify({ type: "connected", message: "Server ready" }));
      };

      socket.onclose = () => {
        console.log("❌ WebSocket client disconnected");
        sockets.delete(socket);
      };

      socket.onerror = (error) => {
        console.error("❌ WebSocket error:", error);
        sockets.delete(socket);
      };

      socket.onmessage = (msg) => {
        try {
          const task = msg.data.toString();
          console.log("📩 Received task:", task);
          runTask(task);
        } catch (error) {
          console.error("❌ Error processing message:", error);
          const errorMessage = error instanceof Error ? error.message : String(error);
          socket.send(JSON.stringify({ type: "error", error: errorMessage }));
        }
      };

      return response; // ✅ 必须返回，否则会立即断开连接！
    });

    console.log("✅ WebSocket server running at ws://localhost:8788");
  } catch (error) {
    console.error("❌ Failed to start WebSocket server:", error);
    throw error;
  }
}

export function broadcast(msg: string) {
  for (const s of sockets) {
    try {
      if (s.readyState === WebSocket.OPEN) {
        s.send(msg);
      }
    } catch (error) {
      console.error("❌ Error broadcasting to socket:", error);
    }
  }
}