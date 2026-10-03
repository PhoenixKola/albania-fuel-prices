import { StyleSheet } from "react-native";

import type { Theme } from "../../theme/theme";
import type { HomePalette } from "./homePalette";

export function makeFuelJourneyStyles(theme: Theme, p: HomePalette) {
  const compact = theme.m.isSmall || (!theme.m.isTablet && theme.m.height < 700) || theme.m.isLandscape;
  const largeText = theme.m.isLargeText;
  const stageHeight = theme.m.isTablet
    ? theme.m.isXLText ? 208 : largeText ? 188 : 174
    : theme.m.isXLText ? 190 : largeText ? 166 : compact ? 112 : 142;

  return StyleSheet.create({
    shell: {
      height: stageHeight,
      marginBottom: compact ? -5 : -7,
      overflow: "hidden",
      borderRadius: compact ? 18 : 22,
      borderWidth: 1,
      borderColor: p.journeySurfaceBorder,
      backgroundColor: p.journeySurface,
    },
    header: {
      position: "absolute",
      zIndex: 4,
      top: compact ? 10 : 13,
      left: compact ? 12 : 16,
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
    },
    headerDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: p.journeyAmber,
    },
    kicker: {
      color: p.inkSoft,
      fontSize: theme.m.f(9),
      fontWeight: "900",
      letterSpacing: 1.35,
      textTransform: "uppercase",
    },
    drawing: {
      ...StyleSheet.absoluteFillObject,
    },
    channelReveal: {
      position: "absolute",
      left: "7%",
      top: compact ? 43 : 54,
      width: "46%",
      height: 3,
      borderRadius: 2,
      backgroundColor: p.accent,
      transformOrigin: "left center",
    },
    pulse: {
      position: "absolute",
      zIndex: 3,
      left: "7%",
      top: compact ? 37 : 48,
      width: 14,
      height: 14,
      marginLeft: -7,
      borderRadius: 7,
      borderWidth: 3,
      borderColor: p.journeySurface,
      backgroundColor: p.journeyAmber,
      shadowColor: p.journeyAmber,
      shadowOpacity: theme.name === "dark" ? 0.34 : 0.16,
      shadowRadius: 7,
      elevation: 3,
    },
    markerEntry: {
      position: "absolute",
      zIndex: 5,
      right: compact ? 11 : theme.m.isTablet ? 24 : 16,
      bottom: compact ? 10 : 14,
      maxWidth: theme.m.isXLText ? "72%" : largeText ? "62%" : theme.m.isTablet ? 280 : "53%",
    },
    marker: {
      minWidth: compact ? 132 : 156,
      minHeight: compact ? 56 : 68,
      paddingHorizontal: compact ? 10 : 13,
      paddingVertical: compact ? 8 : 10,
      borderRadius: compact ? 14 : 17,
      borderWidth: 1,
      borderColor: p.journeySurfaceBorder,
      backgroundColor: p.deck,
      shadowColor: "#000000",
      shadowOpacity: theme.name === "light" ? 0.1 : 0.22,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 5 },
      elevation: 4,
    },
    markerTop: {
      flexDirection: largeText ? "column" : "row",
      alignItems: largeText ? "flex-start" : "center",
      gap: largeText ? 2 : 7,
    },
    flag: {
      fontSize: compact ? 18 : 21,
      color: p.ink,
    },
    markerLabel: {
      color: p.accent,
      fontSize: theme.m.f(8),
      fontWeight: "900",
      letterSpacing: 1,
      textTransform: "uppercase",
    },
    marketName: {
      flexShrink: 1,
      color: p.ink,
      fontSize: theme.m.f(compact ? 13 : 15),
      fontWeight: "900",
      letterSpacing: -0.2,
    },
    markerBottom: {
      marginTop: compact ? 3 : 5,
      flexDirection: largeText ? "column" : "row",
      alignItems: largeText ? "flex-start" : "baseline",
      justifyContent: "space-between",
      gap: largeText ? 1 : 10,
    },
    fuel: {
      flexShrink: 1,
      color: p.inkSoft,
      fontSize: theme.m.f(10),
      fontWeight: "800",
    },
    price: {
      flexShrink: 1,
      color: p.ink,
      fontSize: theme.m.f(compact ? 13 : 15),
      fontWeight: "900",
      fontVariant: ["tabular-nums"],
      textAlign: largeText ? "left" : "right",
    },
    handoff: {
      position: "absolute",
      zIndex: 2,
      right: compact ? 42 : theme.m.isTablet ? 80 : 54,
      bottom: -1,
      width: 2,
      height: compact ? 13 : 18,
      backgroundColor: p.accent,
    },
    handoffCap: {
      position: "absolute",
      left: -3,
      top: -3,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: p.accent,
    },
  });
}
