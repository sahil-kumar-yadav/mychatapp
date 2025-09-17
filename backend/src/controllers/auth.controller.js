import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

// ============ SIGNUP ============
export const signup = async (req, res) => {
  const { fullName = "", email = "", password = "" } = req.body;

  if (!fullName.trim() || !email.trim() || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
    });

    generateToken(newUser._id, res);

    return res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });

  } catch (error) {
    console.error("Signup error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ============ LOGIN ============
export const login = async (req, res) => {
  const { email = "", password = "" } = req.body;

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });

  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ============ LOGOUT ============
export const logout = (_req, res) => {
  try {
    res.clearCookie("jwt");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ============ UPDATE PROFILE ============
export const updateProfile = async (req, res) => {
  const { profilePic } = req.body;
  const userId = req.user._id;

  if (!profilePic) {
    return res.status(400).json({ message: "Profile pic is required" });
  }

  try {
    const uploadResult = await cloudinary.uploader.upload(profilePic, {
      folder: "profile_pics",
      resource_type: "image",
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResult.secure_url },
      { new: true }
    );

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update profile error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ============ CHECK AUTH ============
export const checkAuth = (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    console.error("Check auth error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
