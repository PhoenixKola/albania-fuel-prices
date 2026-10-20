import { AccessibilityInfo, useColorScheme, useWindowDimensions } from "react-native";
import { useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_THEME_KEY } from "../constants/storage";
import { composeTheme, type ThemeName } from "../theme/theme";
import { useAsyncStorageState } from "./useAsyncStorageState";

export type ThemePreference = ThemeName;

export function useTheme() {
  const systemScheme = useColorScheme();
  const defaultTheme: ThemeName = systemScheme === "dark" ? "dark" : "light";

  const { value: themePreference, setValue: setThemePreference, hydrated } = useAsyncStorageState<ThemePreference>(
    STORAGE_THEME_KEY,
    defaultTheme,
    { deserialize: (raw) => (raw === "dark" || raw === "light" ? raw : defaultTheme) }
  );

  // Older installs may have stored "system". Freeze that choice to the
  // currently visible light/dark theme so it no longer follows OS changes.
  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_THEME_KEY).then((raw) => {
      if (!cancelled && raw === "system") return AsyncStorage.setItem(STORAGE_THEME_KEY, themePreference);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [hydrated, themePreference]);

  const themeName: ThemeName = themePreference;

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
