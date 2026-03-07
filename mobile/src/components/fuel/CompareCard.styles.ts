import { StyleSheet } from "react-native";
import type { Theme } from "../../theme/theme";

export const makeCompareStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 18,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: 12
    },

    headerRow: { flexDirection: "column", alignItems: "flex-start", justifyContent: "space-between", gap: 12 },
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

    headerActions: { alignItems: "flex-end", gap: 10 },

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
    pillText: { color: theme.colors.muted, fontWeight: "900", fontSize: 12 },

    iconBtn: {
      width: 44,
      height: 44,
      borderRadius: 16,
      backgroundColor: theme.colors.pillBg,
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
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    btnDisabled: { opacity: 0.5 },
    btnText: { color: theme.colors.text, fontWeight: "900", fontSize: 12 },

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
    noticeText: { color: theme.colors.muted, fontWeight: "800", fontSize: 12, flex: 1 },

    rows: { gap: 10 },

    rowCard: {
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 16,
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

    rankText: { color: theme.colors.text, fontWeight: "900", fontSize: 12 },

    country: { color: theme.colors.text, fontWeight: "900", fontSize: 14 },

    subRow: { marginTop: 3, flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
    sub: { color: theme.colors.muted, fontWeight: "800", fontSize: 12 },

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
    diffText: { color: theme.colors.muted, fontWeight: "900", fontSize: 11 },

    rowRight: { flexDirection: "row", alignItems: "center", gap: 10 },

    priceStack: { alignItems: "flex-end", gap: 6, minWidth: 88 },
    price: { color: theme.colors.text, fontWeight: "900", fontSize: 14 },

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
    bestText: { color: theme.colors.text, fontWeight: "900", fontSize: 11 },

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
    modalTitle: { color: theme.colors.text, fontWeight: "900", fontSize: 16 },
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

    modalLabel: { color: theme.colors.muted, fontWeight: "900", fontSize: 12 },

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
      fontWeight: "800"
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

    modalPrimaryText: { color: theme.colors.primaryText, fontWeight: "900" },

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

    modalEmptyText: { color: theme.colors.muted, fontWeight: "800", fontSize: 12, flex: 1 },

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

    setName: { color: theme.colors.text, fontWeight: "900" },
    setSub: { marginTop: 4, color: theme.colors.muted, fontWeight: "800", fontSize: 12 },

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

    modalGhostText: { color: theme.colors.text, fontWeight: "900" }
  });