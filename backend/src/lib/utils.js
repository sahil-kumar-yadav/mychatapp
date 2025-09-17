import jwt from "jsonwebtoken";

const ONE_WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

export const generateToken = (userId, res) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: ONE_WEEK_IN_MS,
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: "strict", // CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV === "development",
    // secure: process.env.NODE_ENV === "production",
  });

  return token;
};
