import { StyleSheet } from "react-native";
import type { Theme } from "../theme/theme";
import { homePalette } from "../components/home/homePalette";

/** Tablets and unfolded foldables show the comparison beside the trend instead of one stretched column. */
export function isTwoPaneCompare(theme: Theme) {
  const sideRail = 112;
  return theme.m.isTablet && theme.m.width - sideRail >= 760;
}

export const makeCompareTabStyles = (theme: Theme) => {
  const p = homePalette(theme);
  const gap = theme.m.s(14);
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: p.paper },
    content: {
      width: "100%",
      maxWidth: theme.m.maxContentWidth,
      alignSelf: "center",
      paddingHorizontal: theme.m.gutter,
      paddingTop: theme.m.s(10),
      paddingBottom: theme.m.s(28),
      gap,
    },
    wideContent: {
      width: "100%",
      maxWidth: 1120,
      alignSelf: "center",
      paddingHorizontal: theme.m.gutter,
      paddingTop: theme.m.s(14),
      paddingBottom: theme.m.s(28),
      gap,
    },
    panes: { flexDirection: "row", alignItems: "flex-start", gap: theme.m.s(24) },
    pane: { flex: 1, minWidth: 0, gap },
  });
};
