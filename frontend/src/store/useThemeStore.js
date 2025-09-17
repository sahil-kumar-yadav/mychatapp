import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: "coffee", // default theme

  setTheme: (theme) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("chat-theme", theme);
    }
    set({ theme });
  },

  loadThemeFromStorage: () => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("chat-theme");
      if (storedTheme) {
        set({ theme: storedTheme });
      }
    }
  },
}));
