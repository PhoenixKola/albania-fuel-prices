import { useColorScheme } from "react-native";
import { STORAGE_THEME_KEY } from "../constants/storage";
import { themes, type ThemeName } from "../theme/theme";
import { useAsyncStorageState } from "./useAsyncStorageState";

export type ThemePreference = ThemeName;

export function useTheme() {
  const systemScheme = useColorScheme();
  const defaultTheme: ThemeName = systemScheme === "dark" ? "dark" : "light";

  const { value: themePreference, setValue: setThemePreference } = useAsyncStorageState<ThemePreference>(
    STORAGE_THEME_KEY,
    defaultTheme,
    { deserialize: (raw) => (raw === "dark" || raw === "light" ? raw : defaultTheme) }
  );

  const themeName: ThemeName = themePreference;

  const toggleTheme = () => setThemePreference(themeName === "light" ? "dark" : "light");

  return { themeName, themePreference, setThemePreference, theme: themes[themeName], toggleTheme };
}
