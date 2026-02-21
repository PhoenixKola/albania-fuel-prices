import { STORAGE_THEME_KEY } from "../constants/storage";
import { themes, type ThemeName } from "../theme/theme";
import { useAsyncStorageState } from "./useAsyncStorageState";

export function useTheme() {
  const { value: themeName, setValue: setThemeName } = useAsyncStorageState<ThemeName>(
    STORAGE_THEME_KEY,
    "light",
    { deserialize: (raw) => (raw === "dark" ? "dark" : "light") }
  );

  const toggleTheme = () => setThemeName((p) => (p === "light" ? "dark" : "light"));

  return { themeName, theme: themes[themeName], toggleTheme };
}