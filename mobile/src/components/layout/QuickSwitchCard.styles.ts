import { StyleSheet } from "react-native";
import type { Theme } from "../../theme/theme";

export const makeQuickSwitchStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 20,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: 12,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 3
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12
    },

    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      flex: 1,
      minWidth: 0
    },

    iconWrap: {
      width: 40,
      height: 40,
      borderRadius: 16,
      backgroundColor: theme.colors.linkBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center"
    },

    title: {
      fontSize: 16,
      fontWeight: "900",
      color: theme.colors.text,
      letterSpacing: -0.2
    },

    sub: {
      marginTop: 4,
      fontSize: 12,
      fontWeight: "800",
      color: theme.colors.subText,
      lineHeight: 16
    },

    editBtn: {
      height: 42,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 12,
      borderRadius: 16,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border
    },

    editBtnText: {
      fontSize: 12,
      fontWeight: "900",
      color: theme.colors.text
    },

    primaryBtn: {
      height: 42,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 12,
      borderRadius: 16,
      backgroundColor: theme.colors.primary,
      borderWidth: 1,
      borderColor: theme.colors.border
    },

    primaryBtnText: {
      fontSize: 12,
      fontWeight: "900",
      color: theme.colors.primaryText
    },

    row: {
      paddingTop: 2,
      paddingBottom: 2,
      gap: 10
    },

    pill: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 999,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border
    },

    pillActive: {
      backgroundColor: theme.colors.tile
    },

    pillText: {
      fontSize: 12,
      fontWeight: "900",
      color: theme.colors.muted,
      maxWidth: 160
    },

    pillTextActive: {
      color: theme.colors.text
    }
  });