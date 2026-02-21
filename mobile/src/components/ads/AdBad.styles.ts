import { Platform, StyleSheet } from "react-native";
import type { Theme } from "../../theme/theme";

export const makeAdBarStyles = (theme: Theme) =>
  StyleSheet.create({
    wrap: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.bg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 16,
      overflow: "hidden",
      paddingBottom: Platform.OS === "android" ? 6 : 0,
    },
  });