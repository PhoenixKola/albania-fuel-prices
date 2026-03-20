import { StyleSheet } from "react-native";
import type { Theme } from "../../theme/theme";

export const makeStationsStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 18,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: 12
    },

    headerRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 },
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

    headerRight: { alignItems: "flex-end", gap: 10, flexDirection: "row" },
    headerPills: { flexDirection: "row", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" },

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
    pillText: { color: theme.colors.muted, fontWeight: "900", fontSize: 12, maxWidth: 120 },

    pillBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 999,
      backgroundColor: theme.colors.tile,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    pillBtnText: { color: theme.colors.text, fontWeight: "900", fontSize: 12 },

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

    radiusRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
    radiusLabel: { color: theme.colors.muted, fontWeight: "900", fontSize: 12, flexShrink: 0, paddingTop: 2 },

    radiusPills: {
      flexDirection: "row",
      gap: 8,
      alignItems: "center",
      flexWrap: "wrap",
      flex: 1,
      flexShrink: 1,
      justifyContent: "flex-end"
    },

    radiusPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 999,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexShrink: 0
    },

    radiusPillActive: { backgroundColor: theme.colors.tile },
    radiusPillLocked: { opacity: 0.6 },

    radiusPillText: { fontSize: 12, fontWeight: "900", color: theme.colors.muted },
    radiusPillTextActive: { color: theme.colors.text },

    notice: {
      borderRadius: 16,
      padding: 12,
      backgroundColor: theme.colors.tile,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: 10
    },
    noticeTop: { flexDirection: "row", alignItems: "center", gap: 10 },
    noticeText: { color: theme.colors.subText, fontWeight: "800", flex: 1 },

    primaryBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 16,
      backgroundColor: theme.colors.primary,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    primaryBtnText: { color: theme.colors.primaryText, fontWeight: "900" },

    errorText: { color: theme.colors.danger, fontWeight: "900" },

    countRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    mutedText: { color: theme.colors.muted, fontWeight: "800", fontSize: 12 },

    emptyCard: {
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
    emptyText: { color: theme.colors.muted, fontWeight: "800", fontSize: 12, flex: 1 },

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

    rowLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1, minWidth: 0 },

    rowIcon: {
      width: 38,
      height: 38,
      borderRadius: 16,
      backgroundColor: theme.colors.linkBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center"
    },

    rowTitle: { color: theme.colors.text, fontWeight: "900" },
    rowSub: { marginTop: 2, color: theme.colors.muted, fontWeight: "800", fontSize: 12 },

    rowRight: { flexDirection: "row", alignItems: "center", gap: 10 },

    kmPill: {
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

    kmPillNear: {
      backgroundColor: theme.colors.linkBg
    },

    kmText: { color: theme.colors.muted, fontWeight: "900", fontSize: 12 },

    starBtn: {
      width: 38,
      height: 38,
      borderRadius: 14,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center"
    },

    actionsRow: { flexDirection: "row", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" },

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
    btnText: { fontSize: 12, fontWeight: "900", color: theme.colors.text },

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

    modalOptions: { gap: 10 },

    modalOption: {
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

    modalOptionText: { color: theme.colors.text, fontWeight: "900" },

    rememberRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 16,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border
    },

    rememberText: { color: theme.colors.text, fontWeight: "900" },

    open24Badge: {
      marginTop: 6,
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 999
    },
    open24BadgeText: {
      fontSize: 12,
    },
  });