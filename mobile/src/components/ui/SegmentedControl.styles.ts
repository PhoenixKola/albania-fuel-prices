import { StyleSheet } from "react-native";
import type { Theme } from "../../theme/theme";

export const makeSegmentedStyles = (theme: Theme) =>
  StyleSheet.create({
    wrap: {
      flexDirection: "row",
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      overflow: "hidden",
      padding: theme.m.s(2)
    },

    item: {
      flex: 1,
      paddingVertical: theme.m.s(12),
      paddingHorizontal: theme.m.s(12),
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      borderRadius: 14
    },

    itemActive: {
      backgroundColor: theme.colors.tile
    },

    text: {
      fontWeight: "900",
      color: theme.colors.muted,
      fontSize: theme.m.f(13)
    },

    textActive: {
      color: theme.colors.text
    }
  });