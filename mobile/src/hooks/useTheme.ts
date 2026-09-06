import { AccessibilityInfo, useColorScheme, useWindowDimensions } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { STORAGE_THEME_KEY } from "../constants/storage";
import { composeTheme, type ThemeName } from "../theme/theme";
import { useAsyncStorageState } from "./useAsyncStorageState";

export type ThemePreference = ThemeName | "system";

export function useTheme() {
  const systemScheme = useColorScheme();
  const defaultTheme: ThemeName = systemScheme === "dark" ? "dark" : "light";

  const { value: themePreference, setValue: setThemePreference } = useAsyncStorageState<ThemePreference>(
    STORAGE_THEME_KEY,
    "system",
    { deserialize: (raw) => (raw === "dark" || raw === "light" || raw === "system" ? raw : "system") }
  );

  const themeName: ThemeName = themePreference === "system" ? defaultTheme : themePreference;

  const toggleTheme = () => setThemePreference(themeName === "light" ? "dark" : "light");

  // Width/height are part of the theme so every style factory re-runs when the
  // window changes — rotation, split screen, foldables, tablets.
  const { width, height, fontScale } = useWindowDimensions();
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReducedMotion).catch(() => {});
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", setReducedMotion);
    return () => subscription.remove();
  }, []);

  const theme = useMemo(
    () => composeTheme(themeName, width, height, fontScale, reducedMotion),
    [themeName, width, height, fontScale, reducedMotion]
  );

  return { themeName, themePreference, setThemePreference, theme, toggleTheme };
}
