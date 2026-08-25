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

    // Snapshot: one tinted surface, no nested bordered cards. Tiles lead with
    // the price because a number never truncates the way "Switzerland" did.
    snapshot: {
      borderRadius: 18,
      padding: theme.m.s(14),
      gap: theme.m.s(12),
      backgroundColor: theme.name === "light" ? "#F2FAF8" : "rgba(45, 212, 191, 0.07)",
      borderWidth: 1,
      borderColor: theme.name === "light" ? "rgba(15,118,110,0.13)" : "rgba(45,212,191,0.15)"
    },
    metricGrid: { flexDirection: "row", gap: theme.m.s(10) },
    metricTile: { flex: 1, minWidth: 0, gap: theme.m.s(3) },
    metricLabel: {
      color: theme.colors.muted,
      fontWeight: "700",
      fontSize: theme.m.f(10),
      textTransform: "uppercase",
      letterSpacing: 0.6,
      // Reserve two lines so a label that wraps ("Most expensive", and longer
      // translations) cannot push its price below the neighbouring tiles.
      lineHeight: theme.m.f(13),
      minHeight: theme.m.f(26)
    },
    metricPrice: { color: theme.colors.text, fontWeight: "800", fontSize: theme.m.f(19) },
    metricPriceGood: { color: theme.name === "light" ? "#0F766E" : "#2DD4BF" },
    metricPriceBad: { color: theme.name === "light" ? "#B45309" : "#FBBF24" },
    metricCountry: { color: theme.colors.subText, fontWeight: "600", fontSize: theme.m.f(11) },

    // The reader's own standing, folded in so it is not a separate banner.
    yourRankRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: theme.m.s(10),
      paddingTop: theme.m.s(11),
      borderTopWidth: 1,
      borderTopColor: theme.name === "light" ? "rgba(15,118,110,0.13)" : "rgba(45,212,191,0.15)"
    },
    yourRankCountry: { flex: 1, minWidth: 0, color: theme.colors.text, fontWeight: "700", fontSize: theme.m.f(13) },
    yourRankPill: {
      flexDirection: "row",
      alignItems: "baseline",
      gap: theme.m.s(4),
      paddingVertical: theme.m.s(4),
      paddingHorizontal: theme.m.s(10),
      borderRadius: 999,
      backgroundColor: theme.colors.linkBg
    },
    yourRankNum: { color: theme.colors.linkText, fontWeight: "800", fontSize: theme.m.f(14) },
    yourRankTotal: { color: theme.colors.muted, fontWeight: "700", fontSize: theme.m.f(11) },
    yourRankNone: { color: theme.colors.muted, fontWeight: "700", fontSize: theme.m.f(12), flexShrink: 1 },




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
