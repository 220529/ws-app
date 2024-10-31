// server.js
const express = require("express");
const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = 7080;

// 提供静态文件
app.use(express.static(__dirname));

// 启动 HTTP 服务器
const server = app.listen(port, () => {
  console.log(`HTTP server is running on http://localhost:${port}`);
});

// 创建 WebSocket 服务器
const wss = new WebSocket.Server({ server });

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
