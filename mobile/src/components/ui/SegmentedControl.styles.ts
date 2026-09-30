import { StyleSheet } from "react-native";
import type { Theme } from "../../theme/theme";

export const makeSegmentedStyles = (theme: Theme) => {
  const stacked = theme.m.isXLText;
  return StyleSheet.create({
    wrap: {
      flexDirection: stacked ? "column" : "row",
      gap: stacked ? 4 : 0,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.card,
      borderRadius: 18,
      overflow: "hidden",
      padding: theme.m.s(2),
    },

    item: {
      flex: stacked ? undefined : 1,
      minHeight: stacked ? 52 : 48,
      paddingVertical: theme.m.s(10),
      paddingHorizontal: theme.m.s(stacked ? 14 : theme.m.isLargeText ? 6 : 12),
      alignItems: "center",
      justifyContent: stacked ? "flex-start" : "center",
      flexDirection: "row",
      gap: stacked ? 12 : 0,
      borderRadius: 14,
    },

    itemActive: {
      backgroundColor: theme.colors.accentSoft,
      borderWidth: 1,
      borderColor: theme.name === "light" ? "rgba(15,118,110,0.18)" : "rgba(45,212,191,0.22)",
    },

    text: {
      flexShrink: 1,
      fontWeight: "900",
      color: theme.colors.muted,
      fontSize: theme.m.f(13),
      textAlign: stacked ? "left" : "center",
    },

    textActive: {
      color: theme.colors.text,
    },
  });
};
