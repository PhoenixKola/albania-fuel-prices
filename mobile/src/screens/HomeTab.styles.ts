import { StyleSheet } from "react-native";
import type { Theme } from "../theme/theme";
import { homePalette, isCompactHome } from "../components/home/homePalette";

/** Tablets get the deck beside the market context instead of a stretched phone column. */
export function isTwoColumnHome(theme: Theme) {
  const sideRail = 112;
  return theme.m.isTablet && theme.m.width - sideRail >= 760;
}

export const makeHomeStyles = (theme: Theme) => {
  const p = homePalette(theme);
  const compact = isCompactHome(theme);
  const twoColumn = isTwoColumnHome(theme);
  const gap = compact ? 10 : theme.m.s(14);

  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: p.paper },
    content: {
      width: "100%",
      maxWidth: twoColumn ? 1040 : theme.m.maxContentWidth,
      alignSelf: "center",
      paddingHorizontal: theme.m.gutter,
      paddingTop: compact ? 6 : theme.m.s(10),
      paddingBottom: theme.m.s(24),
      gap,
    },
    topBar: {
      minHeight: compact ? 36 : 40,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
    },
    brand: { flexShrink: 1, flexDirection: "row", alignItems: "center", gap: 8 },
    brandMark: {
      width: 26,
      height: 26,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: p.module,
    },
    brandText: { flexShrink: 1, color: p.ink, fontSize: theme.m.f(16), fontWeight: "900", letterSpacing: -0.3 },
    rewardChip: {
      flexShrink: 1,
      minHeight: 36,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 12,
      borderRadius: 999,
      backgroundColor: p.accentSoft,
      borderWidth: 1,
      borderColor: p.chipBorder,
    },
    rewardText: { flexShrink: 1, color: p.accent, fontSize: theme.m.f(12), fontWeight: "900" },
    columns: { flexDirection: "row", alignItems: "flex-start", gap: theme.m.s(18) },
    columnSlot: { flex: 1, minWidth: 0 },
    column: { gap },
    sourceNote: { gap: 2, paddingHorizontal: 4, paddingTop: 2 },
    sourceText: { color: p.inkFaint, fontSize: theme.m.f(11), fontWeight: "700" },
  });
};
