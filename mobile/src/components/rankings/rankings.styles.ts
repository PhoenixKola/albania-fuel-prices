import { StyleSheet } from "react-native";
import type { Theme } from "../../theme/theme";
import { homePalette } from "../home/homePalette";

export function rankingsPalette(theme: Theme) {
  const p = homePalette(theme);
  return { ...p, rise: theme.name === "light" ? "#B42318" : "#FDA4AF" };
}

export type RankingsPalette = ReturnType<typeof rankingsPalette>;

export const makeRankingStyles = (theme: Theme) => {
  const p = rankingsPalette(theme);
  const large = theme.m.isLargeText;
  const xl = theme.m.isXLText;
  const f = theme.m.f;

  return StyleSheet.create({
    statusRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", columnGap: 8, rowGap: 2 },
    dot: { width: 8, height: 8, borderRadius: 4 },
    statusText: { flexShrink: 1, color: p.inkSoft, fontSize: f(13), lineHeight: f(19), fontWeight: "700" },
    retry: { minHeight: 44, justifyContent: "center", paddingHorizontal: 4 },
    retryText: { color: p.accent, fontSize: f(13), fontWeight: "900", textDecorationLine: "underline" },

    // Scope + order
    viewRow: { flexDirection: xl ? "column" : "row", flexWrap: "wrap", alignItems: xl ? "stretch" : "center", gap: 8 },
    scopeGroup: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    chip: {
      minHeight: 48,
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 999,
      backgroundColor: p.chip,
      borderWidth: 1,
      borderColor: p.chipBorder,
    },
    chipActive: { backgroundColor: p.accentSoft, borderColor: p.accent },
    chipText: { flexShrink: 1, color: p.ink, fontSize: f(15), fontWeight: "800" },
    chipTextActive: { color: p.accent },
    orderButton: {
      marginLeft: xl ? 0 : "auto",
      minHeight: 48,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 7,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: p.chipBorder,
      backgroundColor: p.deck,
    },
    orderText: { flexShrink: 1, color: p.ink, fontSize: f(15), fontWeight: "800" },
    lockNote: { color: p.inkSoft, fontSize: f(13), lineHeight: f(19), fontWeight: "600" },

    // Position panel
    deck: {
      borderRadius: 24,
      backgroundColor: p.deck,
      borderWidth: theme.name === "light" ? 1.5 : 1,
      borderColor: p.deckBorder,
      padding: 8,
      gap: 8,
      shadowColor: "#102033",
      shadowOpacity: p.shadow,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 8 },
      elevation: theme.name === "light" ? 2 : 0,
    },
    module: {
      borderRadius: 18,
      backgroundColor: p.module,
      paddingHorizontal: theme.m.s(18),
      paddingTop: theme.m.s(14),
      paddingBottom: theme.m.s(16),
      gap: 8,
      borderLeftWidth: theme.name === "dark" ? 3 : 0,
      borderLeftColor: p.accent,
    },
    kicker: { color: p.moduleSoft, fontSize: f(12), fontWeight: "900", letterSpacing: 1.6, textTransform: "uppercase" },
    country: { color: p.moduleText, fontSize: f(22), lineHeight: f(28), fontWeight: "900" },
    rankLine: { flexDirection: "row", alignItems: "flex-end", flexWrap: "wrap", columnGap: 8 },
    rankValue: { color: p.moduleText, fontSize: f(46), lineHeight: f(50), fontWeight: "900", letterSpacing: -1.2, fontVariant: ["tabular-nums"], includeFontPadding: false },
    rankCaption: { color: p.moduleSoft, fontSize: f(16), lineHeight: f(24), fontWeight: "800" },
    modulePrice: { color: p.moduleText, fontSize: f(17), fontWeight: "800", fontVariant: ["tabular-nums"] },
    moduleBody: { color: p.moduleSoft, fontSize: f(14), lineHeight: f(20), fontWeight: "700" },
    strip: { marginTop: 6, marginHorizontal: 8 },
    stripTrack: { height: 18, justifyContent: "center" },
    stripBase: { height: 4, borderRadius: 2, backgroundColor: p.moduleRule },
    stripStop: { position: "absolute", width: 2, height: 10, marginLeft: -1, borderRadius: 1, backgroundColor: p.moduleSoft, opacity: 0.55 },
    stripDot: { position: "absolute", width: 18, height: 18, marginLeft: -9, borderRadius: 9, borderWidth: 3, borderColor: p.moduleGood, backgroundColor: p.module },
    stripEnds: { marginTop: 4, flexDirection: large ? "column" : "row", justifyContent: "space-between", columnGap: 12, rowGap: 2 },
    stripEnd: { color: p.moduleSoft, fontSize: f(12), lineHeight: f(17), fontWeight: "800", fontVariant: ["tabular-nums"] },
    deckActions: { flexDirection: xl ? "column" : "row", gap: 8 },
    secondaryButton: {
      flexGrow: 1,
      minHeight: 52,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 16,
      backgroundColor: p.chip,
      borderWidth: 1,
      borderColor: p.chipBorder,
    },
    secondaryText: { flexShrink: 1, color: p.ink, fontSize: f(16), lineHeight: f(21), fontWeight: "800", textAlign: "center" },
    primaryButton: {
      flexGrow: 1,
      minHeight: 52,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 16,
      backgroundColor: p.accent,
    },
    primaryText: { flexShrink: 1, color: p.onAccent, fontSize: f(16), lineHeight: f(21), fontWeight: "900", textAlign: "center" },

    // Ladder
    ladderHeader: {
      marginTop: 4,
      paddingBottom: 8,
      flexDirection: xl ? "column" : "row",
      alignItems: xl ? "flex-start" : "flex-end",
      justifyContent: "space-between",
      columnGap: 12,
      rowGap: 2,
    },
    ladderTitle: { color: p.inkSoft, fontSize: f(12), fontWeight: "900", letterSpacing: 1.4, textTransform: "uppercase" },
    ladderCount: { color: p.inkSoft, fontSize: f(13), fontWeight: "700" },
    row: {
      minHeight: 64,
      flexDirection: "row",
      alignItems: large ? "flex-start" : "center",
      gap: 12,
      paddingVertical: theme.m.s(12),
      paddingHorizontal: 10,
      borderTopWidth: 1,
      borderTopColor: p.rule,
    },
    rowMine: { backgroundColor: p.accentSoft, borderRadius: 14, borderTopColor: "transparent", borderLeftWidth: 3, borderLeftColor: p.accent },
    rank: {
      minWidth: 40,
      minHeight: 40,
      paddingHorizontal: 6,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: p.pressed,
    },
    rankTop: { backgroundColor: "transparent", borderWidth: 1.5, borderColor: p.accent },
    rankText: { color: p.ink, fontSize: f(15), fontWeight: "900", fontVariant: ["tabular-nums"] },
    rowMain: { flex: 1, minWidth: 0, gap: 3 },
    rowHead: { flexDirection: large ? "column" : "row", alignItems: large ? "flex-start" : "center", justifyContent: "space-between", columnGap: 10, rowGap: 2 },
    rowCountry: { flexShrink: 1, color: p.ink, fontSize: f(16), lineHeight: f(22), fontWeight: "800" },
    rowPrice: { color: p.ink, fontSize: f(16), lineHeight: f(22), fontWeight: "900", fontVariant: ["tabular-nums"] },
    rowMeta: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", columnGap: 12, rowGap: 2 },
    tag: { flexDirection: "row", alignItems: "center", gap: 4 },
    tagText: { color: p.accent, fontSize: f(13), fontWeight: "800" },
    metaText: { color: p.inkSoft, fontSize: f(13), lineHeight: f(19), fontWeight: "700" },
    average: { minHeight: 44, flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8, paddingHorizontal: 10, borderTopWidth: 1, borderTopColor: p.rule },
    averageLine: { flex: 1, height: 1.5, borderRadius: 1, backgroundColor: p.lane },
    averageText: { flexShrink: 1, color: p.inkSoft, fontSize: f(13), fontWeight: "800", fontVariant: ["tabular-nums"] },

    // States
    state: { padding: theme.m.s(20), gap: 12, borderRadius: 22, backgroundColor: p.deck, borderWidth: 1, borderColor: p.chipBorder },
    stateIcon: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: p.accentSoft },
    stateTitle: { color: p.ink, fontSize: f(20), lineHeight: f(26), fontWeight: "900" },
    stateBody: { color: p.inkSoft, fontSize: f(15), lineHeight: f(22), fontWeight: "600" },
    skeletonModule: { minHeight: 190, justifyContent: "flex-end", gap: 12 },
    skeletonBar: { height: 16, borderRadius: 8, backgroundColor: p.moduleRule },

    // Action sheet
    sheetBody: { gap: 10, paddingBottom: 6 },
    sheetSub: { marginTop: -6, color: p.inkSoft, fontSize: f(14), lineHeight: f(20), fontWeight: "700" },
    option: {
      minHeight: 64,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: p.chipBorder,
    },
    optionIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: p.pressed },
    optionCopy: { flex: 1, minWidth: 0 },
    optionTitle: { color: p.ink, fontSize: f(16), lineHeight: f(22), fontWeight: "800" },
    optionDetail: { marginTop: 2, color: p.inkSoft, fontSize: f(13), lineHeight: f(19), fontWeight: "600" },
    disabled: { opacity: 0.5 },
  });
};

export type RankingStyles = ReturnType<typeof makeRankingStyles>;
