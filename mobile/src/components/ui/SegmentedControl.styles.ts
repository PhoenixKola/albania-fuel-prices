import { StyleSheet } from "react-native";
import type { Theme } from "../../theme/theme";

export const makeSegmentedStyles = (theme: Theme) =>
  StyleSheet.create({
    wrap: {
      flexDirection: "row",
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.card,
      borderRadius: 14,
      overflow: "hidden",
    },
    item: {
      flex: 1,
      paddingVertical: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    itemActive: {
      backgroundColor: theme.colors.tile,
    },
    text: {
      fontWeight: "800",
      color: theme.colors.muted,
      fontSize: 13,
    },
    textActive: {
      color: theme.colors.text,
    },
  });