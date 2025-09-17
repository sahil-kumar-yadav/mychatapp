import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// --- Middleware ---
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// --- Serve frontend in production ---
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// --- Start Server ---
server.listen(PORT, async () => {
  console.log(`✅ Server is running on port ${PORT}`);
  await connectDB();
});
