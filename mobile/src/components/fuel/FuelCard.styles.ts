import { StyleSheet, type ViewStyle, type TextStyle } from "react-native";
import type { Theme } from "../../theme/theme";

type Tone = "cool" | "neutral" | "warm";

type FuelCardStyles = {
  card: ViewStyle;

  flex1: ViewStyle;

  headerRow: ViewStyle;
  headerLeft: ViewStyle;
  headerIcon: ViewStyle;

  title: TextStyle;

  badgeRow: ViewStyle;
  badge: ViewStyle;
  badgeText: TextStyle;
  loadingPill: ViewStyle;
  loadingText: TextStyle;

  headerActions: ViewStyle;
  iconBtn: ViewStyle;

  countryRow: ViewStyle;
  countryTitleRow: ViewStyle;
  countryName: TextStyle;
  subText: TextStyle;
  metaRow: ViewStyle;
  flag: TextStyle;
  statusStrip: ViewStyle;

  modeChip: ViewStyle;
  modeChipText: TextStyle;

  changeBtn: ViewStyle;
  changeBtnText: TextStyle;

  label: TextStyle;

  grid: ViewStyle;

  divider: ViewStyle;

  sourceRow: ViewStyle;
  sourceText: TextStyle;

  linkBtn: ViewStyle;
  linkBtnText: TextStyle;

  mutedSmall: TextStyle;

  titleRow: ViewStyle;

  tile: ViewStyle;
  tileTopRow: ViewStyle;
  tileLeft: ViewStyle;

  tileIcon: ViewStyle;
  tileLabel: TextStyle;
  tileValue: TextStyle;

  deltaPill: ViewStyle;
  deltaText: TextStyle;

  minusBubble: ViewStyle;
  minusText: TextStyle;
};

export const makeFuelCardStyles = (theme: Theme) => {
  const toneBg: Record<Tone, string> = {
    cool: "rgba(59, 130, 246, 0.14)",
    neutral: "rgba(34, 197, 94, 0.12)",
    warm: "rgba(245, 158, 11, 0.14)"
  };

  const toneBorder: Record<Tone, string> = {
    cool: "rgba(59, 130, 246, 0.28)",
    neutral: "rgba(34, 197, 94, 0.24)",
    warm: "rgba(245, 158, 11, 0.28)"
  };

  const styles = StyleSheet.create<FuelCardStyles>({
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 22,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: 12,
      shadowColor: "#000",
      shadowOpacity: theme.name === "dark" ? 0.14 : 0.05,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 8 },
      elevation: 2
    },

    flex1: { flex: 1 },

    headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
    headerLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },

    headerIcon: {
      width: 40,
      height: 40,
      borderRadius: 15,
      backgroundColor: theme.colors.linkBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center"
    },

    title: { fontSize: 16, fontWeight: "900", color: theme.colors.text },

    metaRow: {
      marginTop: 4,
      flexDirection: "row",
      alignItems: "center",
      gap: 6
    },

    flag: {
      fontSize: 16
    },

    badgeRow: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "nowrap" },

    badge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 999,
      backgroundColor: theme.colors.linkBg,
      borderWidth: 1,
      borderColor: theme.colors.border
    },

    badgeText: { fontWeight: "900", color: theme.colors.linkText, fontSize: 12 },

    loadingPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 999,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border
    },

    loadingText: { fontWeight: "900", color: theme.colors.muted, fontSize: 12 },

    headerActions: { flexDirection: "row", alignItems: "center", gap: 8 },

    iconBtn: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center"
    },

    countryRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },

    countryTitleRow: { flexDirection: "row", alignItems: "center", gap: 10, flexWrap: "wrap" },

    countryName: { fontSize: 18, fontWeight: "900", color: theme.colors.text },

    modeChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 999,
      backgroundColor: theme.colors.tile,
      borderWidth: 1,
      borderColor: theme.colors.border
    },

    modeChipText: { fontSize: 12, fontWeight: "900", color: theme.colors.text, maxWidth: 80 },

    subText: { flex: 1, color: theme.colors.muted, fontWeight: "800", fontSize: 12 },

    statusStrip: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10
    },

    changeBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 15,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border
    },

    changeBtnText: { fontSize: 12, fontWeight: "900", color: theme.colors.text },

    label: { color: theme.colors.muted, fontWeight: "900", fontSize: 12 },

    grid: { gap: 10 },

    divider: { height: 1, backgroundColor: theme.colors.border },

    sourceRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },

    sourceText: { marginTop: 6, fontSize: 14, fontWeight: "800", color: theme.colors.text },

    linkBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 16,
      backgroundColor: theme.colors.linkBg,
      borderWidth: 1,
      borderColor: theme.colors.border
    },

    linkBtnText: { fontSize: 12, fontWeight: "900", color: theme.colors.linkText },

    mutedSmall: { fontSize: 12, color: theme.colors.muted, fontWeight: "700" },

    titleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },

    tile: {
      borderRadius: 18,
      padding: 12,
      backgroundColor: theme.name === "light" ? "rgba(239,246,244,0.86)" : theme.colors.tile,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: 10
    },

    tileTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },

    tileLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },

    tileIcon: {
      width: 34,
      height: 34,
      borderRadius: 14,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center"
    },

    tileLabel: { fontSize: 13, color: theme.colors.muted, fontWeight: "900" },

    tileValue: { fontSize: 20, fontWeight: "900", color: theme.colors.text },

    deltaPill: {
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 999,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: "row",
      alignItems: "center",
      gap: 6
    },

    deltaText: { fontSize: 12, color: theme.colors.muted, fontWeight: "900" },

    minusBubble: {
      width: 18,
      height: 18,
      borderRadius: 999,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center"
    },

    minusText: {
      fontSize: 12,
      fontWeight: "900",
      color: theme.colors.text,
      marginTop: -1
    }
  });

  return {
    styles,
    toneBg,
    toneBorder,
    colors: {
      up: "#22c55e"
    }
  };
};
