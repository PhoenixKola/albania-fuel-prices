import { StyleSheet } from "react-native";
import type { Theme } from "../../theme/theme";

export const makeRankingStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 20,
      padding: theme.m.s(16),
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: theme.m.s(14)
    },

    hero: {
      borderRadius: 18,
      padding: theme.m.s(14),
      gap: theme.m.s(14),
      backgroundColor: theme.name === "light" ? "#F2FAF8" : "rgba(45, 212, 191, 0.08)",
      borderWidth: 1,
      borderColor: theme.name === "light" ? "rgba(15,118,110,0.14)" : "rgba(45,212,191,0.16)"
    },
    heroTop: { flexDirection: "row", alignItems: "center", gap: theme.m.s(12) },
    heroLabel: {
      color: theme.colors.muted,
      fontSize: theme.m.f(11),
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: 0.7
    },
    heroTitle: { marginTop: theme.m.s(2), color: theme.colors.text, fontWeight: "800", fontSize: theme.m.f(20) },
    heroSub: { marginTop: theme.m.s(3), color: theme.colors.muted, fontWeight: "700", fontSize: theme.m.f(12) },
    metricGrid: { flexDirection: "row", gap: theme.m.s(8) },
    metricTile: {
      flex: 1,
      minHeight: 82,
      borderRadius: 15,
      padding: theme.m.s(10),
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      justifyContent: "space-between"
    },
    metricLabel: { color: theme.colors.muted, fontWeight: "700", fontSize: theme.m.f(10) },
    metricValue: { color: theme.colors.text, fontWeight: "800", fontSize: theme.m.f(13) },
    metricSub: { color: theme.colors.muted, fontWeight: "700", fontSize: theme.m.f(11) },

    headerRow: { flexDirection: "column", alignItems: "flex-start", justifyContent: "space-between", gap: theme.m.s(12) },
    headerLeft: { flexDirection: "row", alignItems: "center", gap: theme.m.s(12), flex: 1 },
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

    title: { fontSize: theme.m.f(16), fontWeight: "800", color: theme.colors.text },
    subtitle: { marginTop: theme.m.s(4), color: theme.colors.muted, fontWeight: "700", fontSize: theme.m.f(12) },

    headerPills: { alignItems: "flex-end", gap: theme.m.s(8), flexDirection: "row" },
    pill: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.m.s(6),
      paddingVertical: theme.m.s(6),
      paddingHorizontal: theme.m.s(10),
      borderRadius: 999,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    pillText: { color: theme.colors.muted, fontWeight: "800", fontSize: theme.m.f(12), maxWidth: 120 },

    infoBanner: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.m.s(10),
      paddingVertical: theme.m.s(10),
      paddingHorizontal: theme.m.s(12),
      borderRadius: 16,
      backgroundColor: theme.colors.tile,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    infoText: { color: theme.colors.muted, fontWeight: "700", fontSize: theme.m.f(12), flex: 1 },

    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginTop: theme.m.s(2)
    },

    sectionHeaderRow: { gap: theme.m.s(4) },
    sectionTitleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.m.s(10) },
    sectionTitle: { fontSize: theme.m.f(14), fontWeight: "800", color: theme.colors.text },
    sectionSub: { color: theme.colors.muted, fontWeight: "700", fontSize: theme.m.f(12) },

    lockPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.m.s(6),
      paddingVertical: theme.m.s(6),
      paddingHorizontal: theme.m.s(10),
      borderRadius: 999,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    lockText: { color: theme.colors.muted, fontWeight: "800", fontSize: theme.m.f(12) },

    unlockPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.m.s(6),
      paddingVertical: theme.m.s(6),
      paddingHorizontal: theme.m.s(10),
      borderRadius: 999,
      backgroundColor: theme.colors.linkBg,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    unlockText: { color: theme.colors.text, fontWeight: "800", fontSize: theme.m.f(12) },

    rows: { gap: theme.m.s(10) },

    rowCard: {
      paddingVertical: theme.m.s(13),
      paddingHorizontal: theme.m.s(12),
      borderRadius: 18,
      backgroundColor: theme.colors.tile,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: theme.m.s(12)
    },

    rowActive: {
      borderColor: theme.colors.linkText,
      backgroundColor: theme.colors.card
    },

    left: { flexDirection: "row", alignItems: "center", gap: theme.m.s(10), flex: 1, minWidth: 0 },

    rankBubble: {
      width: 38,
      height: 38,
      borderRadius: 999,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center",
      gap: theme.m.s(2)
    },

    rankGold: { backgroundColor: "rgba(245, 158, 11, 0.18)" },
    rankSilver: { backgroundColor: "rgba(148, 163, 184, 0.18)" },
    rankBronze: { backgroundColor: "rgba(34, 197, 94, 0.14)" },

    rankBubbleActive: { backgroundColor: theme.colors.linkBg },

    rankText: { color: theme.colors.text, fontWeight: "800", fontSize: theme.m.f(12) },
    rankTextActive: { color: theme.colors.linkText },

    country: { color: theme.colors.text, fontWeight: "800", fontSize: theme.m.f(14) },
    countryActive: { color: theme.colors.text },

    youPill: {
      marginTop: theme.m.s(6),
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: theme.m.s(6),
      paddingVertical: theme.m.s(4),
      paddingHorizontal: theme.m.s(8),
      borderRadius: 999,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    youPillText: { color: theme.colors.muted, fontWeight: "800", fontSize: theme.m.f(11) },

    right: { flexDirection: "row", alignItems: "center", gap: theme.m.s(10) },
    priceStack: { alignItems: "flex-end", gap: theme.m.s(6), minWidth: 92 },
    price: { color: theme.colors.text, fontWeight: "800", fontSize: theme.m.f(14) },
    priceActive: { color: theme.colors.text },

    deltaPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.m.s(4),
      paddingVertical: theme.m.s(4),
      paddingHorizontal: theme.m.s(7),
      borderRadius: 999,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    deltaUp: { backgroundColor: theme.name === "light" ? "rgba(239,68,68,0.08)" : "rgba(248,113,113,0.12)" },
    deltaDown: { backgroundColor: theme.name === "light" ? "rgba(16,185,129,0.10)" : "rgba(45,212,191,0.12)" },
    deltaText: { color: theme.colors.muted, fontWeight: "800", fontSize: theme.m.f(10) },

    lockedCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.m.s(12),
      paddingVertical: theme.m.s(12),
      paddingHorizontal: theme.m.s(12),
      borderRadius: 16,
      backgroundColor: theme.colors.tile,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    lockedTitle: { color: theme.colors.text, fontWeight: "800", fontSize: theme.m.f(13) },
    lockedSub: { marginTop: theme.m.s(4), color: theme.colors.muted, fontWeight: "700", fontSize: theme.m.f(12) }
  });
