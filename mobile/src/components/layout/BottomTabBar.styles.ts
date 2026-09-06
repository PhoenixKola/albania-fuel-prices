import { StyleSheet } from "react-native";
import type { Theme } from "../../theme/theme";

export const makeBottomTabBarStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.bg,
      paddingHorizontal: theme.m.isTablet ? theme.m.s(8) : theme.m.s(10),
      paddingVertical: theme.m.isTablet ? theme.m.s(12) : 0,
      paddingTop: theme.m.s(8),
      width: theme.m.isTablet ? 112 : undefined,
      minHeight: theme.m.isTablet ? "100%" : undefined,
      borderRightWidth: theme.m.isTablet ? 1 : 0,
      borderRightColor: theme.colors.border,
    },
    adBuffer: {
      height: theme.m.s(10),
      marginHorizontal: theme.m.s(16),
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    tabRow: {
      flexDirection: theme.m.isTablet ? "column" : "row",
      alignItems: "center",
      justifyContent: theme.m.isTablet ? "flex-start" : "space-between",
      gap: theme.m.s(4),
      paddingTop: theme.m.s(8),
      paddingHorizontal: theme.m.s(6),
      borderRadius: theme.m.isTablet ? 24 : 28,
      backgroundColor: theme.name === "light" ? "rgba(255,252,247,0.94)" : "rgba(13,27,47,0.96)",
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: "#000",
      shadowOpacity: theme.name === "dark" ? 0.28 : 0.12,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: theme.m.isTablet ? 0 : 8,
      flex: theme.m.isTablet ? 1 : undefined,
    },
    tab: {
      flex: theme.m.isTablet ? 0 : 1,
      width: theme.m.isTablet ? "100%" : undefined,
      minHeight: theme.m.isTablet ? 64 : 56,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.m.s(5),
      borderRadius: 22,
      gap: theme.m.s(2),
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
      width: 28,
      minHeight: theme.m.s(25),
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
      fontSize: theme.m.f(theme.m.isTablet ? 10 : 9),
      lineHeight: 12,
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
