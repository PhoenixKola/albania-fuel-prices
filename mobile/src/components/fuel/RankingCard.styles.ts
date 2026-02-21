import { StyleSheet } from "react-native";
import type { Theme } from "../../theme/theme";

export const makeRankingStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: 12,
    },
    title: {
      fontSize: 16,
      fontWeight: "900",
      color: theme.colors.text,
    },
    subtitle: {
      color: theme.colors.muted,
      lineHeight: 18,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    rowActive: {
      backgroundColor: theme.colors.tile,
      borderRadius: 12,
      paddingHorizontal: 10,
    },
    left: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      flex: 1,
    },
    rank: {
      width: 26,
      textAlign: "center",
      fontWeight: "900",
      color: theme.colors.muted,
    },
    country: {
      fontWeight: "900",
      color: theme.colors.text,
      flex: 1,
    },
    price: {
      fontWeight: "900",
      color: theme.colors.text,
    },
    note: {
      color: theme.colors.muted,
      fontSize: 12,
    },
  });