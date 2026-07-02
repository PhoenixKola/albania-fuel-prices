import { useColorScheme } from "react-native";
import { STORAGE_THEME_KEY } from "../constants/storage";
import { themes, type ThemeName } from "../theme/theme";
import { useAsyncStorageState } from "./useAsyncStorageState";

export type ThemePreference = ThemeName | "system";

export function useTheme() {
  const systemScheme = useColorScheme();

  const { value: themePreference, setValue: setThemePreference } = useAsyncStorageState<ThemePreference>(
    STORAGE_THEME_KEY,
    "system",
    { deserialize: (raw) => (raw === "dark" || raw === "light" || raw === "system" ? raw : "system") }
  );

  const themeName: ThemeName =
    themePreference === "system" ? (systemScheme === "dark" ? "dark" : "light") : themePreference;

  const toggleTheme = () => setThemePreference(themeName === "light" ? "dark" : "light");

  return { themeName, themePreference, setThemePreference, theme: themes[themeName], toggleTheme };
}
