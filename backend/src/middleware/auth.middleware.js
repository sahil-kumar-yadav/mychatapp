import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  const token = req.cookies?.jwt;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No token provided" });
  }

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("protectRoute error:", err.message);

    const status = err.name === "JsonWebTokenError" || err.name === "TokenExpiredError" ? 401 : 500;
    const message =
      err.name === "TokenExpiredError"
        ? "Token expired"
        : err.name === "JsonWebTokenError"
          ? "Invalid token"
          : "Internal server error";

    res.status(status).json({ message });
  }
};
