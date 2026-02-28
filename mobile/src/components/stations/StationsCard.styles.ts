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

    headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },

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

    radiusRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
    radiusLabel: { color: theme.colors.muted, fontWeight: "900", fontSize: 12 },
    radiusPills: { flexDirection: "row", gap: 8, alignItems: "center", flexWrap: "wrap" },

    radiusPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 999,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    radiusPillActive: { backgroundColor: theme.colors.tile },
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

    cacheRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    cacheText: { color: theme.colors.muted, fontWeight: "800", fontSize: 12 },

    countRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    mutedText: { color: theme.colors.muted, fontWeight: "800", fontSize: 12 },

    list: {
      borderRadius: 16,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.tile
    },

    emptyText: { color: theme.colors.muted, fontWeight: "800", fontSize: 12, padding: 14 },

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

    rowLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
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

    right: { alignItems: "flex-end", gap: 6 },
    km: { color: theme.colors.text, fontWeight: "900" },

    openRow: { flexDirection: "row", alignItems: "center", gap: 6 },
    openHint: { color: theme.colors.linkText, fontWeight: "900", fontSize: 12 },

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
    btnText: { fontSize: 12, fontWeight: "900", color: theme.colors.text }
  });