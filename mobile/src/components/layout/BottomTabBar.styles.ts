import { StyleSheet } from "react-native";
import type { Theme } from "../../theme/theme";

/** Visual ceiling for tab labels (navigation chrome); full names stay available to screen readers. */
export const LABEL_MAX_SCALE = 1.8;

const MIN_TAB = 48;
/** Average bold glyph width as a share of font size for the tab labels' Latin text. */
const GLYPH = 0.58;

const labelSize = (theme: Theme) => theme.m.f(theme.m.isTablet ? 11 : 10);

/**
 * Decides whether all labels fit side by side at the current text size.
 * When they don't, only the active tab shows its label and takes the spare
 * width; inactive tabs stay icon-only but keep a ≥48dp target. The active
 * label's ceiling is lowered only as far as needed to fit (never below 1.0×).
 */
export function tabLabelLayout(theme: Theme, labels: string[], focusedIndex: number) {
  const size = labelSize(theme);
  const n = labels.length;
  const scale = Math.min(theme.m.fontScale, LABEL_MAX_SCALE);
  const widthFor = (chars: number, sc: number) => Math.ceil(chars * size * sc * GLYPH) + 8;
  const longest = Math.max(...labels.map((l) => l.length));

  if (theme.m.isTablet) {
    return { activeOnly: false, activeGrow: undefined, labelScale: LABEL_MAX_SCALE, railWidth: Math.min(180, Math.max(112, widthFor(longest, scale) + 24)) };
  }

  const rowWidth = theme.m.width - theme.m.s(10) * 2 - theme.m.s(6) * 2 - theme.m.s(4) * (n - 1) - 2;
  if (widthFor(longest, scale) <= rowWidth / n) {
    return { activeOnly: false, activeGrow: undefined, labelScale: LABEL_MAX_SCALE, railWidth: 112 };
  }

  const activeChars = labels[focusedIndex]?.length ?? longest;
  const maxActive = rowWidth - MIN_TAB * (n - 1);
  const labelScale = Math.max(1, Math.min(scale, (maxActive - 9) / (activeChars * size * GLYPH)));
  const inactive = Math.max(MIN_TAB, (rowWidth - widthFor(activeChars, labelScale)) / (n - 1));
  return { activeOnly: true, activeGrow: Math.max(1, (rowWidth - inactive * (n - 1)) / inactive), labelScale, railWidth: 112 };
}

export const makeBottomTabBarStyles = (theme: Theme, railWidth: number) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.bg,
      paddingHorizontal: theme.m.isTablet ? theme.m.s(8) : theme.m.s(10),
      paddingVertical: theme.m.isTablet ? theme.m.s(12) : 0,
      paddingTop: theme.m.s(8),
      width: theme.m.isTablet ? railWidth : undefined,
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
      alignItems: theme.m.isTablet ? "stretch" : "center",
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
      flexBasis: theme.m.isTablet ? "auto" : 0,
      flexGrow: theme.m.isTablet ? 0 : 1,
      minWidth: MIN_TAB,
      minHeight: theme.m.isTablet ? 64 : 56,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.m.s(5),
      paddingHorizontal: 2,
      borderRadius: 22,
      gap: theme.m.s(2),
      position: "relative",
      overflow: "hidden",
    },
    tabActiveFill: {
      position: "absolute",
      top: 3,
      left: 3,
      right: 3,
      bottom: 3,
      borderRadius: 20,
      backgroundColor: theme.colors.linkBg,
    },
    iconBubble: {
      width: 30,
      minHeight: theme.m.s(25),
      borderRadius: 13,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
    },
    iconBubbleFill: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 13,
      backgroundColor: theme.name === "light" ? "rgba(15,118,110,0.12)" : "rgba(45,212,191,0.12)",
    },
    tabLabel: {
      fontSize: labelSize(theme),
      lineHeight: Math.round(labelSize(theme) * 1.3),
      fontWeight: "800",
      textAlign: "center",
    },
    tabLabelActive: {
      fontWeight: "900",
    },
  });
