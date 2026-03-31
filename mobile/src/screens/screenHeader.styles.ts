import { StyleSheet } from "react-native";
import type { Theme } from "../theme/theme";

export const makeScreenHeaderStyles = (theme: Theme) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingBottom: 4,
    },
    iconWrap: {
      width: 40,
      height: 40,
      borderRadius: 14,
      backgroundColor: theme.colors.linkBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      color: theme.colors.text,
      fontWeight: "900",
      fontSize: 16,
    },
    subtitle: {
      color: theme.colors.muted,
      fontWeight: "700",
      fontSize: 12,
      marginTop: 2,
    },
  });
