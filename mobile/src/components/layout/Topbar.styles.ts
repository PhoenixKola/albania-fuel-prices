import { StyleSheet } from "react-native";
import type { Theme } from "../../theme/theme";

export const makeTopBarStyles = (theme: Theme) =>
  StyleSheet.create({
    header: {
      paddingTop: 6,
      paddingBottom: 4
    },

    row: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 12
    },

    brand: {
      flex: 1,
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
      minWidth: 0
    },

    brandIcon: {
      width: 38,
      height: 38,
      borderRadius: 14,
      backgroundColor: theme.colors.linkBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 2
    },

    titleWrap: {
      flex: 1,
      minWidth: 0
    },

    h1: {
      fontSize: 22,
      fontWeight: "900",
      letterSpacing: -0.2,
      color: theme.colors.text,
      lineHeight: 26
    },

    sub: {
      marginTop: 4,
      fontSize: 13,
      fontWeight: "800",
      color: theme.colors.subText,
      lineHeight: 18
    },

    rewardStatus: {
      marginTop: 2,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      borderRadius: 999,
      paddingHorizontal: 10,
      height: 32,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexShrink: 0
    },

    rewardStatusText: {
      color: theme.colors.text,
      fontWeight: "900",
      fontSize: 11
    },

    actions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginTop: 2,
      flexShrink: 0
    },

    iconBtn: {
      width: 42,
      height: 42,
      borderRadius: 14,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center"
    },

    langBtn: {
      height: 42,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 12,
      borderRadius: 14,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      justifyContent: "center"
    },

    langText: {
      fontSize: 12,
      fontWeight: "900",
      color: theme.colors.text
    }
  });