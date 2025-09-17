import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Use CLIENT_URL from environment variables for CORS origin
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL.replace(/\/$/, ""), // Remove trailing slash if any
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// used to store online users
const userSocketMap = {}; // {userId: socketId}

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  // socket.handshake.query.userId is deprecated in latest socket.io
  // Use socket.handshake.auth.userId if you can change client side accordingly
  const userId = socket.handshake.query.userId || socket.handshake.auth?.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    if (userId) {
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
