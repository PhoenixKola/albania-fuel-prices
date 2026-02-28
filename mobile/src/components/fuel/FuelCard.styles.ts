import { StyleSheet } from "react-native";
import type { Theme } from "../../theme/theme";

export const makeFuelCardStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: 12,
    },
    rowBetween: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
    },
    title: {
      fontSize: 16,
      fontWeight: "800",
      color: theme.colors.text,
    },
    countryName: {
      fontSize: 18,
      fontWeight: "900",
      color: theme.colors.text,
    },
    btnGhost: {
      paddingVertical: 7,
      paddingHorizontal: 10,
      borderRadius: 12,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    btnGhostText: {
      fontSize: 13,
      fontWeight: "800",
      color: theme.colors.text,
    },

    currencyRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
    },
    currencyLabel: {
      color: theme.colors.muted,
      fontWeight: "800",
      fontSize: 12,
    },
    currencyPills: {
      flexDirection: "row",
      gap: 8,
      alignItems: "center",
    },
    currencyPill: {
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 999,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    currencyPillActive: {
      backgroundColor: theme.colors.tile,
    },
    currencyPillDisabled: {
      opacity: 0.5,
    },
    currencyPillText: {
      fontSize: 12,
      fontWeight: "900",
      color: theme.colors.muted,
    },
    currencyPillTextActive: {
      color: theme.colors.text,
    },
    currencyPillTextDisabled: {
      color: theme.colors.muted,
    },

    grid: {
      gap: 10,
    },
    tile: {
      borderRadius: 14,
      padding: 12,
      backgroundColor: theme.colors.tile,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    tileLabel: {
      fontSize: 13,
      color: theme.colors.muted,
      fontWeight: "700",
    },
    tileValue: {
      marginTop: 6,
      fontSize: 18,
      fontWeight: "900",
      color: theme.colors.text,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
    },
    metaLabel: {
      fontSize: 12,
      fontWeight: "900",
      color: theme.colors.muted,
      marginBottom: 6,
    },
    metaText: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text,
      flex: 1,
      paddingRight: 10,
    },
    linkBtn: {
      paddingVertical: 7,
      paddingHorizontal: 10,
      borderRadius: 12,
      backgroundColor: theme.colors.linkBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    linkBtnText: {
      fontSize: 13,
      fontWeight: "900",
      color: theme.colors.linkText,
    },
    mutedSmall: {
      fontSize: 12,
      color: theme.colors.muted,
    },
    tileDelta: {
      marginTop: 6,
      fontSize: 12,
      color: theme.colors.muted,
      fontWeight: "800",
    },
  });