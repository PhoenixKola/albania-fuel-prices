import { StyleSheet } from "react-native";
import type { Theme } from "../../theme/theme";

export const makeStationsStyles = (theme: Theme) =>
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
      backgroundColor: theme.name === "light" ? "#F1FAF7" : "rgba(45, 212, 191, 0.08)",
      borderWidth: 1,
      borderColor: theme.name === "light" ? "rgba(15,118,110,0.14)" : "rgba(45,212,191,0.16)"
    },
    heroTop: { flexDirection: "row", alignItems: "center", gap: 12 },
    heroIcon: {
      width: 42,
      height: 42,
      borderRadius: 15,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center"
    },
    heroLabel: {
      color: theme.colors.muted,
      fontSize: 11,
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: 0.7
    },
    heroTitle: { marginTop: 2, color: theme.colors.text, fontWeight: "800", fontSize: 18 },
    refreshBtn: {
      width: 42,
      height: 42,
      borderRadius: 15,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center"
    },
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

    title: { fontSize: 16, fontWeight: "800", color: theme.colors.text },
    subtitle: { marginTop: 4, color: theme.colors.muted, fontWeight: "700", fontSize: 12 },

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
    pillText: { color: theme.colors.muted, fontWeight: "700", fontSize: 12, maxWidth: 120 },

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
    pillBtnText: { color: theme.colors.text, fontWeight: "800", fontSize: 12 },

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
    radiusLabel: { color: theme.colors.muted, fontWeight: "800", fontSize: 12, flexShrink: 0, paddingTop: 10 },

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
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexShrink: 0
    },

    radiusPillActive: {
      backgroundColor: theme.colors.linkBg,
      borderColor: theme.name === "light" ? "rgba(15,118,110,0.22)" : "rgba(45,212,191,0.24)"
    },
    radiusPillLocked: { opacity: 0.6 },

    radiusPillText: { fontSize: 12, fontWeight: "800", color: theme.colors.muted },
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
    noticeText: { color: theme.colors.subText, fontWeight: "700", flex: 1 },

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
    primaryBtnText: { color: theme.colors.primaryText, fontWeight: "800" },

    errorText: { color: theme.colors.danger, fontWeight: "800" },

    countRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    mutedText: { color: theme.colors.muted, fontWeight: "700", fontSize: 12 },
    cacheText: { color: theme.colors.linkText, fontWeight: "800", fontSize: 11 },

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
    emptyText: { color: theme.colors.muted, fontWeight: "700", fontSize: 12, textAlign: "center", flexShrink: 1 },

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
      width: 54,
      height: 54,
      borderRadius: 18,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center"
    },
    emptyTitle: { color: theme.colors.text, fontWeight: "800", fontSize: 15, textAlign: "center" },
    secondaryBtn: {
      marginTop: 4,
      minHeight: 42,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingHorizontal: 14,
      borderRadius: 15,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    secondaryBtnText: { color: theme.colors.text, fontWeight: "800", fontSize: 13 },

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

    rowLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1, minWidth: 0 },

    rowIcon: {
      width: 40,
      height: 40,
      borderRadius: 15,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center"
    },

    rowTitle: { color: theme.colors.text, fontWeight: "800" },
    rowSub: { marginTop: 2, color: theme.colors.muted, fontWeight: "700", fontSize: 12 },

    rowRight: { flexDirection: "row", alignItems: "center", gap: 10 },

    kmPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 999,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border
    },

    kmPillNear: {
      backgroundColor: theme.colors.linkBg
    },

    kmText: { color: theme.colors.muted, fontWeight: "800", fontSize: 12 },

    starBtn: {
      width: 38,
      height: 38,
      borderRadius: 14,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center"
    },

    mapCue: {
      width: 34,
      height: 34,
      borderRadius: 13,
      backgroundColor: theme.colors.linkBg,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.colors.border
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
    btnText: { fontSize: 12, fontWeight: "800", color: theme.colors.text },

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

    modalOptionText: { color: theme.colors.text, fontWeight: "800" },

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

    rememberText: { color: theme.colors.text, fontWeight: "800" },

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
      color: theme.colors.muted,
    },
  });
