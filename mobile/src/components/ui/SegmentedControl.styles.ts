import { StyleSheet } from "react-native";
import type { Theme } from "../../theme/theme";

export const makeSegmentedStyles = (theme: Theme) =>
  StyleSheet.create({
    wrap: {
      flexDirection: "row",
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.card,
      borderRadius: 18,
      overflow: "hidden",
      padding: theme.m.s(2)
    },

    item: {
      flex: 1,
      minHeight: 48,
      paddingVertical: theme.m.s(10),
      paddingHorizontal: theme.m.s(theme.m.isLargeText ? 5 : 12),
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      borderRadius: 14
    },

    itemActive: {
      backgroundColor: theme.colors.accentSoft,
      borderWidth: 1,
      borderColor: theme.name === "light" ? "rgba(15,118,110,0.18)" : "rgba(45,212,191,0.22)"
    },

    text: {
      fontWeight: "900",
      color: theme.colors.muted,
      fontSize: theme.m.f(13),
      textAlign: "center"
    },

    textActive: {
      color: theme.colors.text
    }
  });
