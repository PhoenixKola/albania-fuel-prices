import { StyleSheet } from "react-native";
import type { Theme } from "../../theme/theme";

export const makeBottomTabBarStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.bg,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    tabRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      paddingTop: 8,
      paddingBottom: 6,
    },
    tab: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 4,
      gap: 3,
    },
    tabLabel: {
      fontSize: 10,
      fontWeight: "700",
    },
    tabLabelActive: {
      fontWeight: "800",
    },
    indicator: {
      position: "absolute",
      top: 0,
      width: 24,
      height: 3,
      borderRadius: 2,
      alignSelf: "center",
    },
  });
