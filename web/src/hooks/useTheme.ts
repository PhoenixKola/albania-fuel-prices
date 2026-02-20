import { useCallback, useEffect } from "react";
import type { Theme } from "../models/theme";
import { STORAGE_THEME_KEY } from "../config/constants";
import { useLocalStorageState } from "./useLocalStorageState";

function preferredTheme(): Theme {
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useTheme() {
  const [theme, setTheme] = useLocalStorageState<Theme>(STORAGE_THEME_KEY, preferredTheme(), {
    deserialize: (raw) => (raw === "dark" ? "dark" : "light"),
    serialize: (v) => v,
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return { theme, setTheme, toggleTheme };
}