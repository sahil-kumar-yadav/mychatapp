// src/lib/axios.js
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "https://vigilant-barnacle-9v5jw46p6qxcjvx-5001.app.github.dev/api"
      : "/api",
  withCredentials: true,
});
