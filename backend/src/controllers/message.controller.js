import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

// ------------------------------
// Get users excluding logged-in user
// ------------------------------
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const users = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(users);
  } catch (err) {
    console.error("getUsersForSidebar error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ------------------------------
// Get messages between two users
// ------------------------------
export const getMessages = async (req, res) => {
  try {
    const myId = req.user._id;
    const userToChatId = req.params.id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
      isDeleted: false, // ✅ Ignore soft-deleted messages
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    console.error("getMessages error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ------------------------------
// Send a message (with optional image upload)
// ------------------------------
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.id;
    const { text = "", image } = req.body;

    // ✅ Validation: prevent very long messages
    if (text.trim().length > 1000) {
      return res.status(400).json({ error: "Message text is too long (max 1000 characters)." });
    }

    // ✅ Upload image if provided
    const imageUrl = image
      ? (await cloudinary.uploader.upload(image)).secure_url
      : undefined;

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text: text.trim(),
      image: imageUrl,
      status: "sent", // ✅ Optional: explicitly set initial status
    });

    // ✅ Emit socket event if receiver is online
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (err) {
    console.error("sendMessage error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
