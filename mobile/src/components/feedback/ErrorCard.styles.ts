import { StyleSheet } from "react-native";
import type { Theme } from "../../theme/theme";

export const makeErrorCardStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    title: {
      fontSize: 16,
      fontWeight: "800",
      marginBottom: 6,
      color: theme.colors.danger,
    },
    msg: {
      color: theme.colors.subText,
      lineHeight: 18,
    },
    btn: {
      marginTop: 12,
      backgroundColor: theme.colors.primary,
      paddingVertical: 10,
      borderRadius: 12,
      alignItems: "center",
    },
    btnText: {
      color: theme.colors.primaryText,
      fontWeight: "800",
    },
  });