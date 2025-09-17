"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/useThemeStore";

export default function ThemeProvider({ children }) {
  const { theme } = useThemeStore();

  useEffect(() => {
    if (typeof window !== "undefined" && theme) {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);

  return children;
}