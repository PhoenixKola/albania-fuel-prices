import { StyleSheet } from "react-native";
import type { Theme } from "../../theme/theme";

export const makeCompareStyles = (theme: Theme) =>
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
      backgroundColor: theme.name === "light" ? "#F3FBF9" : "rgba(45, 212, 191, 0.08)",
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
      minHeight: 64,
      borderRadius: 15,
      padding: theme.m.s(10),
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      justifyContent: "space-between"
    },
    metricLabel: { color: theme.colors.muted, fontWeight: "700", fontSize: theme.m.f(11) },
    metricValue: { color: theme.colors.text, fontWeight: "800", fontSize: theme.m.f(15) },

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

    headerActions: { alignItems: "flex-end", gap: theme.m.s(10) },

    actionRow: { flexDirection: "row", gap: theme.m.s(10) },
    pills: { flexDirection: "row", gap: theme.m.s(8), justifyContent: "flex-end" },
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
    pillText: { color: theme.colors.muted, fontWeight: "800", fontSize: theme.m.f(12) },

    iconBtn: {
      width: 44,
      height: 44,
      borderRadius: 16,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center"
    },

    btn: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.m.s(8),
      paddingVertical: theme.m.s(10),
      paddingHorizontal: theme.m.s(12),
      borderRadius: 16,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    btnDisabled: { opacity: 0.5 },
    btnText: { color: theme.colors.text, fontWeight: "800", fontSize: theme.m.f(12) },

    btnPrimary: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.m.s(8),
      paddingVertical: theme.m.s(11),
      paddingHorizontal: theme.m.s(12),
      borderRadius: 16,
      backgroundColor: theme.colors.primary,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    btnPrimaryText: { color: theme.colors.primaryText, fontWeight: "800", fontSize: theme.m.f(12) },

    notice: {
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
    noticeText: { color: theme.colors.muted, fontWeight: "700", fontSize: theme.m.f(12), flex: 1 },

    emptyState: {
      alignItems: "center",
      gap: theme.m.s(10),
      paddingVertical: theme.m.s(20),
      paddingHorizontal: theme.m.s(14),
      borderRadius: 18,
      backgroundColor: theme.colors.tile,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    emptyIcon: {
      width: 52,
      height: 52,
      borderRadius: 18,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center"
    },
    emptyTitle: { color: theme.colors.text, fontWeight: "800", fontSize: theme.m.f(15), textAlign: "center" },
    emptyText: { color: theme.colors.muted, fontWeight: "700", fontSize: theme.m.f(12), textAlign: "center" },
    emptyCta: {
      marginTop: theme.m.s(4),
      minHeight: 42,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.m.s(8),
      paddingHorizontal: theme.m.s(14),
      borderRadius: 15,
      backgroundColor: theme.colors.primary
    },
    emptyCtaText: { color: theme.colors.primaryText, fontWeight: "800", fontSize: theme.m.f(13) },

    rows: { gap: theme.m.s(10) },

    rowCard: {
      paddingVertical: theme.m.s(12),
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

    rowBest: {
      borderColor: theme.colors.linkText
    },

    rowLeft: { flexDirection: "row", alignItems: "center", gap: theme.m.s(10), flex: 1, minWidth: 0 },

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

    rank1: { backgroundColor: "rgba(245, 158, 11, 0.18)" },
    rank2: { backgroundColor: "rgba(148, 163, 184, 0.18)" },
    rank3: { backgroundColor: "rgba(34, 197, 94, 0.14)" },

    rankText: { color: theme.colors.text, fontWeight: "800", fontSize: theme.m.f(12) },

    country: { color: theme.colors.text, fontWeight: "800", fontSize: theme.m.f(14) },

    subRow: { marginTop: theme.m.s(3), flexDirection: "row", alignItems: "center", gap: theme.m.s(8), flexWrap: "wrap" },
    sub: { color: theme.colors.muted, fontWeight: "700", fontSize: theme.m.f(12) },

    diffPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.m.s(4),
      paddingVertical: theme.m.s(4),
      paddingHorizontal: theme.m.s(8),
      borderRadius: 999,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    diffText: { color: theme.colors.muted, fontWeight: "800", fontSize: theme.m.f(11) },

    rowRight: { flexDirection: "row", alignItems: "center", gap: theme.m.s(10) },

    priceStack: { alignItems: "flex-end", gap: theme.m.s(6), minWidth: 88 },
    price: { color: theme.colors.text, fontWeight: "800", fontSize: theme.m.f(14) },

    bestPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.m.s(6),
      paddingVertical: theme.m.s(4),
      paddingHorizontal: theme.m.s(8),
      borderRadius: 999,
      backgroundColor: theme.colors.linkBg,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    bestText: { color: theme.colors.text, fontWeight: "800", fontSize: theme.m.f(11) },

    removeIconBtn: {
      width: 38,
      height: 38,
      borderRadius: 14,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center"
    },

    modalBackdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.55)",
      alignItems: "center",
      justifyContent: "center",
      padding: theme.m.s(16)
    },

    modalCard: {
      width: "100%",
      maxWidth: 520,
      borderRadius: 18,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.m.s(14),
      gap: theme.m.s(12)
    },

    modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.m.s(10) },
    modalTitle: { color: theme.colors.text, fontWeight: "800", fontSize: theme.m.f(16) },
    modalCloseBtn: {
      width: 40,
      height: 40,
      borderRadius: 14,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center"
    },

    modalSection: { gap: theme.m.s(10) },

    modalLabel: { color: theme.colors.muted, fontWeight: "800", fontSize: theme.m.f(12) },

    modalRow: { flexDirection: "row", gap: theme.m.s(10), alignItems: "center" },

    modalInput: {
      flex: 1,
      minHeight: 44,
      borderRadius: 14,
      backgroundColor: theme.colors.tile,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: theme.m.s(12),
      color: theme.colors.text,
      fontWeight: "700"
    },

    modalPrimaryBtn: {
      minHeight: theme.m.s(44),
      flexDirection: "row",
      alignItems: "center",
      gap: theme.m.s(8),
      paddingHorizontal: theme.m.s(12),
      borderRadius: 14,
      backgroundColor: theme.colors.primary,
      borderWidth: 1,
      borderColor: theme.colors.border,
      justifyContent: "center"
    },

    modalPrimaryText: { color: theme.colors.primaryText, fontWeight: "800" },

    modalEmpty: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.m.s(10),
      paddingVertical: theme.m.s(12),
      paddingHorizontal: theme.m.s(12),
      borderRadius: 16,
      backgroundColor: theme.colors.tile,
      borderWidth: 1,
      borderColor: theme.colors.border
    },

    modalEmptyText: { color: theme.colors.muted, fontWeight: "700", fontSize: theme.m.f(12), flex: 1 },

    setRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.m.s(10),
      paddingVertical: theme.m.s(12),
      paddingHorizontal: theme.m.s(12),
      borderRadius: 16,
      backgroundColor: theme.colors.tile,
      borderWidth: 1,
      borderColor: theme.colors.border
    },

    setName: { color: theme.colors.text, fontWeight: "800" },
    setSub: { marginTop: theme.m.s(4), color: theme.colors.muted, fontWeight: "700", fontSize: theme.m.f(12) },

    setBtn: {
      width: 40,
      height: 40,
      borderRadius: 14,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center"
    },

    modalFooter: { flexDirection: "row", justifyContent: "flex-end" },

    modalGhostBtn: {
      minHeight: theme.m.s(44),
      flexDirection: "row",
      alignItems: "center",
      gap: theme.m.s(8),
      paddingHorizontal: theme.m.s(12),
      borderRadius: 14,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border
    },

    modalGhostText: { color: theme.colors.text, fontWeight: "800" }
  });
