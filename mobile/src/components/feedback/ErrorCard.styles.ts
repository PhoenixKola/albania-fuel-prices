import { StyleSheet } from "react-native";
import type { Theme } from "../../theme/theme";

export const makeErrorCardStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 18,
      padding: theme.m.s(14),
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: theme.m.s(12)
    },

    head: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: theme.m.s(12)
    },

    icon: {
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
      fontSize: theme.m.f(15),
      fontWeight: "900",
      color: theme.colors.danger
    },

    msg: {
      marginTop: theme.m.s(6),
      color: theme.colors.subText,
      lineHeight: 18,
      fontWeight: "700"
    },

    btn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.m.s(12),
      borderRadius: 16
    },

    btnText: {
      color: theme.colors.primaryText,
      fontWeight: "900"
    }
  });