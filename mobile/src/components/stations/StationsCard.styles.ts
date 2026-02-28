import { StyleSheet } from "react-native";
import type { Theme } from "../../theme/theme";

export const makeStationsStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: 12,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    title: {
      fontSize: 16,
      fontWeight: "900",
      color: theme.colors.text,
    },
    btn: {
      paddingVertical: 7,
      paddingHorizontal: 10,
      borderRadius: 12,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    btnText: {
      fontSize: 13,
      fontWeight: "800",
      color: theme.colors.text,
    },
    notice: {
      borderRadius: 14,
      padding: 12,
      backgroundColor: theme.colors.tile,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: 10,
    },
    noticeText: {
      color: theme.colors.subText,
      fontWeight: "700",
    },
    primaryBtn: {
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 14,
      backgroundColor: theme.colors.primary,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
    },
    primaryBtnText: {
      color: theme.colors.primaryText,
      fontWeight: "900",
    },
    errorText: {
      color: theme.colors.danger,
      fontWeight: "800",
    },
    muted: {
      color: theme.colors.muted,
      fontWeight: "700",
      fontSize: 12,
      padding: 16,
    },
    list: {
      borderRadius: 14,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.tile,
    },
    row: {
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
    },
    rowTitle: {
      color: theme.colors.text,
      fontWeight: "900",
    },
    rowSub: {
      marginTop: 2,
      color: theme.colors.muted,
      fontWeight: "700",
      fontSize: 12,
    },
    right: {
      alignItems: "flex-end",
      gap: 2,
    },
    km: {
      color: theme.colors.text,
      fontWeight: "900",
    },
    openHint: {
      color: theme.colors.linkText,
      fontWeight: "900",
      fontSize: 12,
    },
    radiusRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
    },
    radiusLabel: {
        color: theme.colors.muted,
        fontWeight: "800",
        fontSize: 12,
    },
    radiusPills: {
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
    },
    radiusPill: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 999,
        backgroundColor: theme.colors.pillBg,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    radiusPillActive: {
        backgroundColor: theme.colors.tile,
    },
    radiusPillText: {
        fontSize: 12,
        fontWeight: "900",
        color: theme.colors.muted,
    },
    radiusPillTextActive: {
        color: theme.colors.text,
    },
    countRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
    },
    actionsRow: {
      flexDirection: "row",
      gap: 10,
      justifyContent: "flex-end",
    },
  });