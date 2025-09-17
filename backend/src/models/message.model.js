import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // 🔍 Adds an index for better query performance
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // 🔍 Adds an index for better query performance
    },
    text: {
      type: String,
      trim: true,
      maxlength: 1000, // 🔐 Optional: prevents very long texts
    },
    image: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },

  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
    versionKey: false, // 🧹 Removes __v field (optional)
  }
);

// 🔧 Compound index for efficient chat retrieval
messageSchema.index({ senderId: 1, receiverId: 1, createdAt: 1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;
