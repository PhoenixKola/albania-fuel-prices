import { useColorScheme, useWindowDimensions } from "react-native";
import { useMemo } from "react";
import { STORAGE_THEME_KEY } from "../constants/storage";
import { composeTheme, type ThemeName } from "../theme/theme";
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

  // Width/height are part of the theme so every style factory re-runs when the
  // window changes — rotation, split screen, foldables, tablets.
  const { width, height } = useWindowDimensions();
  const theme = useMemo(() => composeTheme(themeName, width, height), [themeName, width, height]);

  return { themeName, themePreference, setThemePreference, theme, toggleTheme };
}
