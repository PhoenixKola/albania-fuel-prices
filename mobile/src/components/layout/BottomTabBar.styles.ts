import { StyleSheet } from "react-native";
import type { Theme } from "../../theme/theme";

export const makeBottomTabBarStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.bg,
      paddingHorizontal: 14,
      paddingTop: 8
    },
    tabRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 6,
      paddingTop: 8,
      paddingHorizontal: 8,
      borderRadius: 28,
      backgroundColor: theme.name === "light" ? "rgba(255,252,247,0.94)" : "rgba(13,27,47,0.96)",
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: "#000",
      shadowOpacity: theme.name === "dark" ? 0.28 : 0.12,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 8
    },
    tab: {
      flex: 1,
      minHeight: 54,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 5,
      borderRadius: 22,
      gap: 2,
      position: "relative",
      overflow: "hidden"
    },
    tabActive: {
      backgroundColor: theme.colors.linkBg
    },
    tabActiveFill: {
      position: "absolute",
      top: 3,
      left: 3,
      right: 3,
      bottom: 3,
      borderRadius: 20,
      backgroundColor: theme.colors.linkBg
    },
    iconBubble: {
      width: 30,
      height: 26,
      borderRadius: 13,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden"
    },
    iconBubbleActive: {
      backgroundColor: theme.name === "light" ? "rgba(15,118,110,0.12)" : "rgba(45,212,191,0.12)"
    },
    iconBubbleFill: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 13,
      backgroundColor: theme.name === "light" ? "rgba(15,118,110,0.12)" : "rgba(45,212,191,0.12)"
    },
    tabLabel: {
      fontSize: 10,
      lineHeight: 13,
      fontWeight: "800"
    },
    tabLabelActive: {
      fontWeight: "900"
    },
    indicator: {
      width: 0,
      height: 0
    }
  });
