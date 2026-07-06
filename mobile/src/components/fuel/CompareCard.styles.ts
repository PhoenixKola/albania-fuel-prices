import { StyleSheet } from "react-native";
import type { Theme } from "../../theme/theme";

export const makeCompareStyles = (theme: Theme) =>
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
      backgroundColor: theme.name === "light" ? "#F3FBF9" : "rgba(45, 212, 191, 0.08)",
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
      minHeight: 64,
      borderRadius: 15,
      padding: 10,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      justifyContent: "space-between"
    },
    metricLabel: { color: theme.colors.muted, fontWeight: "700", fontSize: 11 },
    metricValue: { color: theme.colors.text, fontWeight: "800", fontSize: 15 },

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

    headerActions: { alignItems: "flex-end", gap: 10 },

    actionRow: { flexDirection: "row", gap: 10 },
    pills: { flexDirection: "row", gap: 8, justifyContent: "flex-end" },
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
    pillText: { color: theme.colors.muted, fontWeight: "800", fontSize: 12 },

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
      gap: 8,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 16,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    btnDisabled: { opacity: 0.5 },
    btnText: { color: theme.colors.text, fontWeight: "800", fontSize: 12 },

    btnPrimary: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 11,
      paddingHorizontal: 12,
      borderRadius: 16,
      backgroundColor: theme.colors.primary,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    btnPrimaryText: { color: theme.colors.primaryText, fontWeight: "800", fontSize: 12 },

    notice: {
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
    noticeText: { color: theme.colors.muted, fontWeight: "700", fontSize: 12, flex: 1 },

    emptyState: {
      alignItems: "center",
      gap: 10,
      paddingVertical: 20,
      paddingHorizontal: 14,
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
    emptyTitle: { color: theme.colors.text, fontWeight: "800", fontSize: 15, textAlign: "center" },
    emptyText: { color: theme.colors.muted, fontWeight: "700", fontSize: 12, textAlign: "center" },
    emptyCta: {
      marginTop: 4,
      minHeight: 42,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingHorizontal: 14,
      borderRadius: 15,
      backgroundColor: theme.colors.primary
    },
    emptyCtaText: { color: theme.colors.primaryText, fontWeight: "800", fontSize: 13 },

    rows: { gap: 10 },

    rowCard: {
      paddingVertical: 12,
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

    rowBest: {
      borderColor: theme.colors.linkText
    },

    rowLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1, minWidth: 0 },

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

    rank1: { backgroundColor: "rgba(245, 158, 11, 0.18)" },
    rank2: { backgroundColor: "rgba(148, 163, 184, 0.18)" },
    rank3: { backgroundColor: "rgba(34, 197, 94, 0.14)" },

    rankText: { color: theme.colors.text, fontWeight: "800", fontSize: 12 },

    country: { color: theme.colors.text, fontWeight: "800", fontSize: 14 },

    subRow: { marginTop: 3, flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
    sub: { color: theme.colors.muted, fontWeight: "700", fontSize: 12 },

    diffPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 999,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    diffText: { color: theme.colors.muted, fontWeight: "800", fontSize: 11 },

    rowRight: { flexDirection: "row", alignItems: "center", gap: 10 },

    priceStack: { alignItems: "flex-end", gap: 6, minWidth: 88 },
    price: { color: theme.colors.text, fontWeight: "800", fontSize: 14 },

    bestPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 999,
      backgroundColor: theme.colors.linkBg,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    bestText: { color: theme.colors.text, fontWeight: "800", fontSize: 11 },

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
      padding: 16
    },

    modalCard: {
      width: "100%",
      maxWidth: 520,
      borderRadius: 18,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 14,
      gap: 12
    },

    modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
    modalTitle: { color: theme.colors.text, fontWeight: "800", fontSize: 16 },
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

    modalSection: { gap: 10 },

    modalLabel: { color: theme.colors.muted, fontWeight: "800", fontSize: 12 },

    modalRow: { flexDirection: "row", gap: 10, alignItems: "center" },

    modalInput: {
      flex: 1,
      minHeight: 44,
      borderRadius: 14,
      backgroundColor: theme.colors.tile,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: 12,
      color: theme.colors.text,
      fontWeight: "700"
    },

    modalPrimaryBtn: {
      height: 44,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 12,
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
      gap: 10,
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 16,
      backgroundColor: theme.colors.tile,
      borderWidth: 1,
      borderColor: theme.colors.border
    },

    modalEmptyText: { color: theme.colors.muted, fontWeight: "700", fontSize: 12, flex: 1 },

    setRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 16,
      backgroundColor: theme.colors.tile,
      borderWidth: 1,
      borderColor: theme.colors.border
    },

    setName: { color: theme.colors.text, fontWeight: "800" },
    setSub: { marginTop: 4, color: theme.colors.muted, fontWeight: "700", fontSize: 12 },

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
      height: 44,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 12,
      borderRadius: 14,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border
    },

    modalGhostText: { color: theme.colors.text, fontWeight: "800" }
  });
