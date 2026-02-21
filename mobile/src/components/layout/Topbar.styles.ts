import { StyleSheet } from "react-native";
import type { Theme } from "../../theme/theme";

export const makeTopBarStyles = (theme: Theme) =>
  StyleSheet.create({
    header: {
      gap: 10,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
    },
    titleWrap: {
      flex: 1,
    },
    h1: {
      fontSize: 26,
      fontWeight: "800",
      letterSpacing: 0.2,
      color: theme.colors.text,
    },
    sub: {
      marginTop: 4,
      fontSize: 14,
      color: theme.colors.subText,
    },
    actions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    pill: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 999,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      minWidth: 44,
      alignItems: "center",
    },
    pillText: {
      fontSize: 13,
      fontWeight: "800",
      color: theme.colors.text,
    },
  });