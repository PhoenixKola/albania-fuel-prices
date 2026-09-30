import { StyleSheet } from "react-native";
import type { Theme } from "../../theme/theme";
import { homePalette } from "../home/homePalette";

/**
 * Stations shares Home's road-atlas vocabulary: paper background, a deck with
 * an inverted ink module for the one thing that matters most, lane-rule lists.
 */
export function stationsPalette(theme: Theme) {
  const p = homePalette(theme);
  const light = theme.name === "light";
  return {
    ...p,
    // Theme danger (#D14343) is under 4.5:1 on paper; these clear AA on each surface.
    closed: light ? "#B42318" : "#FDA4AF",
    moduleOpen: p.moduleGood,
    moduleClosed: p.moduleBad,
  };
}

export type StationsPalette = ReturnType<typeof stationsPalette>;

export const makeStationStyles = (theme: Theme) => {
  const p = stationsPalette(theme);
  const xl = theme.m.isXLText;
  const large = theme.m.isLargeText;
  const f = theme.m.f;
  // Search needs ~180dp to stay useful; below that it gets its own line.
  const stackControls = xl || (large && theme.m.width < 380);

  return StyleSheet.create({
    // Status line
    statusRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", columnGap: 8, rowGap: 2 },
    dot: { width: 8, height: 8, borderRadius: 4 },
    statusText: { flexShrink: 1, color: p.inkSoft, fontSize: f(13), lineHeight: f(19), fontWeight: "700" },
    retry: { minHeight: 44, justifyContent: "center", paddingHorizontal: 4 },
    retryText: { color: p.accent, fontSize: f(13), fontWeight: "900", textDecorationLine: "underline" },

    // Next stop
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
      gap: 4,
      borderLeftWidth: theme.name === "dark" ? 3 : 0,
      borderLeftColor: p.accent,
    },
    kicker: { color: p.moduleSoft, fontSize: f(12), fontWeight: "900", letterSpacing: 1.6, textTransform: "uppercase" },
    nextName: { marginTop: 4, color: p.moduleText, fontSize: f(22), lineHeight: f(28), fontWeight: "900", letterSpacing: -0.3 },
    nextBrand: { color: p.moduleSoft, fontSize: f(14), lineHeight: f(20), fontWeight: "700" },
    distanceRow: { marginTop: 8, flexDirection: "row", alignItems: "flex-end", flexWrap: "wrap", columnGap: 6 },
    distanceValue: {
      color: p.moduleText,
      fontSize: f(46),
      lineHeight: f(50),
      fontWeight: "900",
      letterSpacing: -1.2,
      fontVariant: ["tabular-nums"],
      includeFontPadding: false,
    },
    distanceUnit: { color: p.moduleText, fontSize: f(19), lineHeight: f(26), fontWeight: "800" },
    distanceCaption: { color: p.moduleSoft, fontSize: f(12), lineHeight: f(17), fontWeight: "700" },
    hoursRow: { marginTop: 10, flexDirection: "row", alignItems: "center", gap: 8 },
    hoursText: { flexShrink: 1, fontSize: f(15), lineHeight: f(21), fontWeight: "800" },
    hoursNote: { color: p.moduleSoft, fontSize: f(12), lineHeight: f(17), fontWeight: "600" },
    nextActions: { flexDirection: xl ? "column" : "row", gap: 8 },
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
    secondaryButton: {
      minWidth: 52,
      minHeight: 52,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingHorizontal: xl ? 18 : 14,
      paddingVertical: 10,
      borderRadius: 16,
      backgroundColor: p.chip,
      borderWidth: 1,
      borderColor: p.chipBorder,
    },
    secondaryText: { flexShrink: 1, color: p.ink, fontSize: f(16), lineHeight: f(21), fontWeight: "800", textAlign: "center" },

    // Search + filters
    controls: { flexDirection: stackControls ? "column" : "row", gap: 8 },
    search: {
      flexGrow: 1,
      flexShrink: 1,
      minHeight: 50,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingLeft: 14,
      borderRadius: 16,
      backgroundColor: p.deck,
      borderWidth: 1,
      borderColor: p.chipBorder,
    },
    searchInput: { flex: 1, minWidth: 0, color: p.ink, fontSize: f(16), fontWeight: "700", paddingVertical: 10 },
    clearSearch: { width: 48, height: 48, alignItems: "center", justifyContent: "center" },
    filterButton: {
      minHeight: 50,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 16,
      backgroundColor: p.deck,
      borderWidth: 1,
      borderColor: p.chipBorder,
    },
    filterButtonActive: { backgroundColor: p.accentSoft, borderColor: p.accent },
    filterText: { flexShrink: 1, color: p.ink, fontSize: f(15), fontWeight: "800" },
    badge: { minWidth: 22, minHeight: 22, paddingHorizontal: 6, borderRadius: 11, alignItems: "center", justifyContent: "center", backgroundColor: p.accent },
    badgeText: { color: p.onAccent, fontSize: f(12), fontWeight: "900" },
    activeFilters: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    activeChip: {
      minHeight: 48,
      maxWidth: "100%",
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingLeft: 14,
      paddingRight: 10,
      paddingVertical: 8,
      borderRadius: 999,
      backgroundColor: p.accentSoft,
      borderWidth: 1,
      borderColor: p.accent,
    },
    activeChipText: { flexShrink: 1, color: p.accent, fontSize: f(14), fontWeight: "800" },

    // Feed
    feedHeader: {
      marginTop: 6,
      paddingBottom: 6,
      flexDirection: xl ? "column" : "row",
      alignItems: xl ? "flex-start" : "flex-end",
      justifyContent: "space-between",
      columnGap: 12,
      rowGap: 2,
      borderBottomWidth: 1,
      borderBottomColor: p.rule,
    },
    feedKicker: { color: p.inkSoft, fontSize: f(12), fontWeight: "900", letterSpacing: 1.4, textTransform: "uppercase" },
    feedCount: { color: p.inkSoft, fontSize: f(13), fontWeight: "700" },
    row: { paddingVertical: theme.m.s(14), gap: 10 },
    rowTop: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
    rowInfo: { flex: 1, minWidth: 0, gap: 3 },
    rowName: { color: p.ink, fontSize: f(17), lineHeight: f(23), fontWeight: "800" },
    rowBrand: { color: p.inkSoft, fontSize: f(14), lineHeight: f(20), fontWeight: "600" },
    rowStar: { width: 48, height: 48, marginTop: -10, marginRight: -8, alignItems: "center", justifyContent: "center", borderRadius: 14 },
    rowBottom: {
      flexDirection: xl ? "column" : "row",
      flexWrap: "wrap",
      alignItems: xl ? "stretch" : "center",
      columnGap: 12,
      rowGap: 8,
    },
    meta: {
      flexGrow: 1,
      flexShrink: 1,
      flexDirection: large ? "column" : "row",
      flexWrap: "wrap",
      alignItems: large ? "flex-start" : "center",
      columnGap: 14,
      rowGap: 4,
    },
    metaItem: { flexDirection: "row", alignItems: "center", gap: 6, maxWidth: "100%" },
    metaDistance: { color: p.ink, fontSize: f(14), lineHeight: f(20), fontWeight: "800", fontVariant: ["tabular-nums"] },
    metaHours: { flexShrink: 1, fontSize: f(14), lineHeight: f(20), fontWeight: "700" },
    rowDirections: {
      marginLeft: xl ? 0 : "auto",
      minHeight: 48,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 14,
      backgroundColor: p.accentSoft,
      borderWidth: 1,
      borderColor: theme.name === "light" ? "rgba(15,118,110,0.22)" : "rgba(45,212,191,0.24)",
    },
    rowDirectionsText: { flexShrink: 1, color: p.accent, fontSize: f(15), fontWeight: "900", textAlign: "center" },
    separator: { height: 1, backgroundColor: p.rule },

    // Designed states
    state: {
      padding: theme.m.s(20),
      gap: 12,
      borderRadius: 22,
      backgroundColor: p.deck,
      borderWidth: 1,
      borderColor: p.chipBorder,
    },
    stateIcon: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: p.accentSoft },
    stateTitle: { color: p.ink, fontSize: f(20), lineHeight: f(26), fontWeight: "900" },
    stateBody: { color: p.inkSoft, fontSize: f(15), lineHeight: f(22), fontWeight: "600" },
    stateActions: { marginTop: 4, flexDirection: large ? "column" : "row", flexWrap: "wrap", gap: 10 },
    inlineState: { paddingVertical: theme.m.s(18), gap: 10, alignItems: "flex-start" },

    // Skeleton (static, no shimmer loop)
    skeletonModule: { minHeight: 176, justifyContent: "flex-end", gap: 10 },
    skeletonBar: { height: 16, borderRadius: 8, backgroundColor: p.moduleRule },
    skeletonRow: { paddingVertical: theme.m.s(16), gap: 10 },
    skeletonRowBar: { height: 14, borderRadius: 7, backgroundColor: p.rule },

    // Footer
    note: { marginTop: theme.m.s(18), flexDirection: "row", alignItems: "flex-start", gap: 8 },
    noteText: { flex: 1, color: p.inkSoft, fontSize: f(12), lineHeight: f(18), fontWeight: "600" },

    // Filters sheet
    sheetBody: { gap: 10, paddingBottom: 6 },
    sheetLabel: { marginTop: 4, color: p.inkSoft, fontSize: f(12), fontWeight: "900", letterSpacing: 1.2, textTransform: "uppercase" },
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
    optionActive: { backgroundColor: p.accentSoft, borderColor: p.accent },
    optionIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: p.pressed },
    optionCopy: { flex: 1, minWidth: 0 },
    optionTitle: { color: p.ink, fontSize: f(16), lineHeight: f(22), fontWeight: "800" },
    optionDetail: { marginTop: 2, color: p.inkSoft, fontSize: f(13), lineHeight: f(19), fontWeight: "600" },
    sheetFooter: { flexDirection: large ? "column-reverse" : "row", gap: 10 },
    sheetFooterItem: { flexGrow: 1, flexBasis: large ? "auto" : 0 },
  });
};

export type StationStyles = ReturnType<typeof makeStationStyles>;
