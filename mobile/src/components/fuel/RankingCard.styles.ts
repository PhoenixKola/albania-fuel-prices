import { StyleSheet } from "react-native";
import type { Theme } from "../../theme/theme";

export const makeRankingStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 20,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: 14
    },

    hero: {
      borderRadius: 18,
      padding: 14,
      gap: 14,
      backgroundColor: theme.name === "light" ? "#F2FAF8" : "rgba(45, 212, 191, 0.08)",
      borderWidth: 1,
      borderColor: theme.name === "light" ? "rgba(15,118,110,0.14)" : "rgba(45,212,191,0.16)"
    },
    heroTop: { flexDirection: "row", alignItems: "center", gap: 12 },
    heroLabel: {
      color: theme.colors.muted,
      fontSize: 11,
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: 0.7
    },
    heroTitle: { marginTop: 2, color: theme.colors.text, fontWeight: "800", fontSize: 20 },
    heroSub: { marginTop: 3, color: theme.colors.muted, fontWeight: "700", fontSize: 12 },
    metricGrid: { flexDirection: "row", gap: 8 },
    metricTile: {
      flex: 1,
      minHeight: 82,
      borderRadius: 15,
      padding: 10,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      justifyContent: "space-between"
    },
    metricLabel: { color: theme.colors.muted, fontWeight: "700", fontSize: 10 },
    metricValue: { color: theme.colors.text, fontWeight: "800", fontSize: 13 },
    metricSub: { color: theme.colors.muted, fontWeight: "700", fontSize: 11 },

    headerRow: { flexDirection: "column", alignItems: "flex-start", justifyContent: "space-between", gap: 12 },
    headerLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
    headerIcon: {
      width: 40,
      height: 40,
      borderRadius: 16,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center"
    },

    title: { fontSize: 16, fontWeight: "800", color: theme.colors.text },
    subtitle: { marginTop: 4, color: theme.colors.muted, fontWeight: "700", fontSize: 12 },

    headerPills: { alignItems: "flex-end", gap: 8, flexDirection: "row" },
    pill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 999,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    pillText: { color: theme.colors.muted, fontWeight: "800", fontSize: 12, maxWidth: 120 },

    infoBanner: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 16,
      backgroundColor: theme.colors.tile,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    infoText: { color: theme.colors.muted, fontWeight: "700", fontSize: 12, flex: 1 },

    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginTop: 2
    },

    sectionHeaderRow: { gap: 4 },
    sectionTitleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
    sectionTitle: { fontSize: 14, fontWeight: "800", color: theme.colors.text },
    sectionSub: { color: theme.colors.muted, fontWeight: "700", fontSize: 12 },

    lockPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 999,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    lockText: { color: theme.colors.muted, fontWeight: "800", fontSize: 12 },

    unlockPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 999,
      backgroundColor: theme.colors.linkBg,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    unlockText: { color: theme.colors.text, fontWeight: "800", fontSize: 12 },

    rows: { gap: 10 },

    rowCard: {
      paddingVertical: 13,
      paddingHorizontal: 12,
      borderRadius: 18,
      backgroundColor: theme.colors.tile,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12
    },

    rowActive: {
      borderColor: theme.colors.linkText,
      backgroundColor: theme.colors.card
    },

    left: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1, minWidth: 0 },

    rankBubble: {
      width: 38,
      height: 38,
      borderRadius: 999,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center",
      gap: 2
    },

    rankGold: { backgroundColor: "rgba(245, 158, 11, 0.18)" },
    rankSilver: { backgroundColor: "rgba(148, 163, 184, 0.18)" },
    rankBronze: { backgroundColor: "rgba(34, 197, 94, 0.14)" },

    rankBubbleActive: { backgroundColor: theme.colors.linkBg },

    rankText: { color: theme.colors.text, fontWeight: "800", fontSize: 12 },
    rankTextActive: { color: theme.colors.linkText },

    country: { color: theme.colors.text, fontWeight: "800", fontSize: 14 },
    countryActive: { color: theme.colors.text },

    youPill: {
      marginTop: 6,
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 999,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    youPillText: { color: theme.colors.muted, fontWeight: "800", fontSize: 11 },

    right: { flexDirection: "row", alignItems: "center", gap: 10 },
    priceStack: { alignItems: "flex-end", gap: 6, minWidth: 92 },
    price: { color: theme.colors.text, fontWeight: "800", fontSize: 14 },
    priceActive: { color: theme.colors.text },

    deltaPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingVertical: 4,
      paddingHorizontal: 7,
      borderRadius: 999,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    deltaUp: { backgroundColor: theme.name === "light" ? "rgba(239,68,68,0.08)" : "rgba(248,113,113,0.12)" },
    deltaDown: { backgroundColor: theme.name === "light" ? "rgba(16,185,129,0.10)" : "rgba(45,212,191,0.12)" },
    deltaText: { color: theme.colors.muted, fontWeight: "800", fontSize: 10 },

    lockedCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 16,
      backgroundColor: theme.colors.tile,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    lockedTitle: { color: theme.colors.text, fontWeight: "800", fontSize: 13 },
    lockedSub: { marginTop: 4, color: theme.colors.muted, fontWeight: "700", fontSize: 12 }
  });
