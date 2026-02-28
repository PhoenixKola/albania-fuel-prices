import { StyleSheet } from "react-native";
import type { Theme } from "../../theme/theme";

export const makeRankingStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 18,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: 12
    },

    headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
    headerLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
    headerIcon: {
      width: 40,
      height: 40,
      borderRadius: 16,
      backgroundColor: theme.colors.linkBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center"
    },

    title: { fontSize: 16, fontWeight: "900", color: theme.colors.text },
    subtitle: { marginTop: 4, color: theme.colors.muted, fontWeight: "800", fontSize: 12 },

    note: { color: theme.colors.muted, fontWeight: "800", fontSize: 12 },

    list: {
      borderRadius: 16,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.tile
    },

    row: {
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12
    },
    rowActive: {
      backgroundColor: theme.colors.card
    },

    left: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },

    rankBubble: {
      width: 30,
      height: 30,
      borderRadius: 999,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center"
    },
    rankBubbleActive: {
      backgroundColor: theme.colors.linkBg
    },
    rankText: { color: theme.colors.text, fontWeight: "900", fontSize: 12 },
    rankTextActive: { color: theme.colors.linkText },

    country: { color: theme.colors.text, fontWeight: "900", fontSize: 14 },
    countryActive: { color: theme.colors.text },

    right: { flexDirection: "row", alignItems: "center", gap: 10 },
    price: { color: theme.colors.text, fontWeight: "900", fontSize: 14 },
    priceActive: { color: theme.colors.text }
  });