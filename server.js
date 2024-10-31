const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");

// 端口号
const port = 7100;

// 创建 WebSocket 服务器
const wss = new WebSocket.Server({ port }, () => {
  console.log(`WebSocket server is running on ws://localhost:${port}`);
});

wss.on("connection", (ws) => {
  const clientId = uuidv4();
  console.log(`Client connected: ${clientId}`);
  ws.clientId = clientId;

  ws.on("message", (message) => {
    if (Buffer.isBuffer(message)) {
      message = message.toString("utf8");
    }
    console.log(`Received from ${clientId}:`, message);

    // 广播消息
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN && client !== ws) {
        client.send(`From ${clientId}: ${message}`);
      }
    });
  });

  ws.on("close", () => {
    console.log(`Client disconnected: ${clientId}`);
  });
});
