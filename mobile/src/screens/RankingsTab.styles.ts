import { StyleSheet } from "react-native";
import type { Theme } from "../theme/theme";
import { homePalette } from "../components/home/homePalette";

/** Tablets and unfolded foldables keep "your market" beside the ladder instead of above it. */
export function isTwoPaneRankings(theme: Theme) {
  const sideRail = 112;
  return theme.m.isTablet && theme.m.width - sideRail >= 760;
}

export const makeRankingsTabStyles = (theme: Theme) => {
  const p = homePalette(theme);
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: p.paper },
    listContent: {
      width: "100%",
      maxWidth: theme.m.maxContentWidth,
      alignSelf: "center",
      paddingHorizontal: theme.m.gutter,
      paddingTop: theme.m.s(10),
      paddingBottom: theme.m.s(28),
    },
    header: { gap: theme.m.s(14), paddingBottom: 4 },
    panes: {
      flex: 1,
      width: "100%",
      maxWidth: 1120,
      alignSelf: "center",
      flexDirection: "row",
      gap: theme.m.s(24),
      paddingHorizontal: theme.m.gutter,
    },
    sidePane: { width: 420, flexGrow: 0, flexShrink: 0 },
    sideContent: { paddingTop: theme.m.s(14), paddingBottom: theme.m.s(28), gap: theme.m.s(14) },
    feedPane: { flex: 1 },
    feedContent: { paddingTop: theme.m.s(14), paddingBottom: theme.m.s(28) },
  });
};
