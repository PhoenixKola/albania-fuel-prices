import { StyleSheet } from "react-native";
import type { Theme } from "../../theme/theme";

export const makeTopBarStyles = (theme: Theme) =>
  StyleSheet.create({
    header: {
      gap: 12
    },

    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12
    },

    brand: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 12
    },

    brandIcon: {
      width: 40,
      height: 40,
      borderRadius: 16,
      backgroundColor: theme.colors.linkBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center"
    },

    titleWrap: {
      flex: 1
    },

    h1: {
      fontSize: 24,
      fontWeight: "900",
      letterSpacing: -0.2,
      color: theme.colors.text
    },

    sub: {
      marginTop: 6,
      fontSize: 13,
      fontWeight: "800",
      color: theme.colors.subText
    },

    actions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10
    },

    pill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 999,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      minWidth: 44,
      justifyContent: "center"
    },

    pillText: {
      fontSize: 12,
      fontWeight: "900",
      color: theme.colors.text
    }
  });