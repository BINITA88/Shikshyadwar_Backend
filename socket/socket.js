const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    // origin: process.env.FRONT_END_URL,
    origin: ["http://localhost:5173", "http://10.0.2.2:9000"],
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {}; // this map stores socket id corresponding to the user id; userId -> socketId

const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});
// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");

// const app = express();
// app.use(cors()); // ✅ Allow CORS globally
// app.use(express.json()); // ✅ Parse JSON bodies

// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "*", // ✅ Allow all origins for testing
//     methods: ["GET", "POST"],
//   },
// });

// // ✅ Store user connections
// const userSocketMap = {}; 

// const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

// // ✅ Handle WebSocket connections
// io.on("connection", (socket) => {
//   console.log(`✅ New connection: ${socket.id}`);

//   const userId = socket.handshake.query.userId;
//   if (userId) {
//     userSocketMap[userId] = socket.id;
//   }

//   io.emit("getOnlineUsers", Object.keys(userSocketMap));

//   socket.on("sendMessage", (data) => {
//     console.log("📩 Message received:", data);

//     const receiverSocketId = getReceiverSocketId(data.receiverId);
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("newMessage", data);
//     }
//   });

  
// });

// // ✅ Ensure WebSocket is listening correctly
// server.listen(9000, "0.0.0.0", () => {
//   console.log("🚀 WebSocket server running on port 9000");
// });
