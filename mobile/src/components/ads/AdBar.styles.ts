import { Platform, StyleSheet } from "react-native";
import type { Theme } from "../../theme/theme";

export const makeAdBarStyles = (theme: Theme) =>
  StyleSheet.create({
    wrap: {
      alignSelf: "stretch",
      marginHorizontal: theme.m.s(16),
      marginTop: theme.m.s(8),
      marginBottom: theme.m.s(6),
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.bg,
      borderWidth: 1,
      borderColor: theme.name === "light" ? "rgba(15,23,42,0.05)" : "rgba(255,255,255,0.08)",
      borderRadius: 14,
      overflow: "hidden",
      paddingBottom: Platform.OS === "android" ? 3 : 0,
    },
  });
