import { StyleSheet } from "react-native";
import type { Theme } from "../theme/theme";

export const makeHomeStyles = (theme: Theme) => {
  const light = theme.name === "light";

  const text = light ? "#102033" : "#FFFFFF";
  const softText = light ? "rgba(16,32,51,0.68)" : "rgba(255,255,255,0.68)";
  const faintText = light ? "rgba(16,32,51,0.52)" : "rgba(255,255,255,0.52)";
  const chromeBg = light ? "rgba(255,252,247,0.86)" : "rgba(255,255,255,0.10)";
  const chromeBorder = light ? "rgba(16,32,51,0.10)" : "rgba(255,255,255,0.14)";
  const cardBg = light ? "rgba(255,252,247,0.94)" : theme.colors.card;
  const cardBorder = light ? "rgba(16,32,51,0.10)" : "rgba(255,255,255,0.12)";
  const accent = light ? "#0F766E" : "#8DEDE1";
  const actionBorder = light ? "rgba(16,32,51,0.09)" : "rgba(255,255,255,0.14)";

  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.bg
    },
    content: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 28,
      gap: 18
    },
    topChrome: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8
    },
    avatarButton: {
      width: 46,
      height: 46,
      borderRadius: 23,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: chromeBg,
      borderWidth: 1,
      borderColor: chromeBorder
    },
    avatarFlag: {
      color: text,
      fontSize: 22,
      fontWeight: "900"
    },
    searchPill: {
      flex: 1,
      minHeight: 46,
      flexDirection: "row",
      alignItems: "center",
      gap: 9,
      paddingHorizontal: 15,
      borderRadius: 999,
      backgroundColor: chromeBg,
      borderWidth: 1,
      borderColor: chromeBorder
    },
    searchWrapper: {
      flex: 1,
      minWidth: 0
    },
    searchText: {
      flex: 1,
      color: light ? "rgba(16,32,51,0.72)" : "rgba(255,255,255,0.80)",
      fontSize: 14,
      fontWeight: "800"
    },
    topIconCluster: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6
    },
    topCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: chromeBg,
      borderWidth: 1,
      borderColor: chromeBorder
    },
    topCircleAccent: {
      backgroundColor: light ? "rgba(14, 116, 144, 0.10)" : "rgba(45, 212, 191, 0.12)",
      borderColor: light ? "rgba(14, 116, 144, 0.18)" : "rgba(45, 212, 191, 0.22)"
    },
    topCircleSuccess: {
      backgroundColor: light ? "rgba(14, 116, 144, 0.10)" : "rgba(45, 212, 191, 0.12)",
      borderColor: light ? "rgba(14, 116, 144, 0.18)" : "rgba(45, 212, 191, 0.22)"
    },

    hero: {
      minHeight: 308,
      overflow: "hidden",
      borderRadius: 32,
      padding: 18,
      borderWidth: 1,
      borderColor: light ? "rgba(16,32,51,0.10)" : "rgba(255,255,255,0.16)",
      shadowColor: light ? "#8AA0B8" : "#000",
      shadowOpacity: light ? 0.22 : 0.42,
      shadowRadius: light ? 24 : 30,
      shadowOffset: { width: 0, height: 18 },
      elevation: 8
    },
    heroStatusRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12
    },
    livePill: {
      maxWidth: "48%",
      minHeight: 32,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 11,
      borderRadius: 999,
      backgroundColor: light ? "rgba(14, 116, 144, 0.09)" : "rgba(5, 8, 22, 0.34)",
      borderWidth: 1,
      borderColor: light ? "rgba(14, 116, 144, 0.16)" : "rgba(141, 237, 225, 0.22)"
    },
    livePillText: {
      flexShrink: 1,
      color: accent,
      fontSize: 11,
      fontWeight: "900"
    },
    heroUpdated: {
      flexShrink: 1,
      color: softText,
      fontSize: 11,
      fontWeight: "800",
      textAlign: "right"
    },
    heroCenter: {
      flex: 1,
      minHeight: 182,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 14
    },
    heroPrice: {
      width: "100%",
      color: text,
      fontSize: 56,
      lineHeight: 64,
      fontWeight: "900",
      textAlign: "center"
    },
    accountPill: {
      marginTop: 12,
      maxWidth: "86%",
      minHeight: 36,
      justifyContent: "center",
      paddingHorizontal: 14,
      borderRadius: 999,
      backgroundColor: light ? "rgba(16,32,51,0.06)" : "rgba(255,255,255,0.14)",
      borderWidth: 1,
      borderColor: light ? "rgba(16,32,51,0.09)" : "rgba(255,255,255,0.18)"
    },
    accountPillText: {
      color: light ? "rgba(16,32,51,0.88)" : "rgba(255,255,255,0.94)",
      fontSize: 13,
      fontWeight: "900"
    },
    rankBadgeText: {
      marginTop: 10,
      maxWidth: "90%",
      color: softText,
      fontSize: 12,
      fontWeight: "800",
      textAlign: "center"
    },
    fuelSelector: {
      flexDirection: "row",
      alignItems: "stretch",
      gap: 7,
      padding: 5,
      borderRadius: 22,
      backgroundColor: light ? "rgba(16,32,51,0.05)" : "rgba(5, 8, 22, 0.38)",
      borderWidth: 1,
      borderColor: light ? "rgba(16,32,51,0.08)" : "rgba(255,255,255,0.12)"
    },
    fuelChipItem: {
      flex: 1,
      minWidth: 0
    },
    fuelChip: {
      flex: 1,
      minHeight: 42,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingHorizontal: 7,
      borderRadius: 17
    },
    fuelChipActive: {
      backgroundColor: light ? "#102033" : "#FFFFFF"
    },
    fuelChipText: {
      flexShrink: 1,
      color: light ? "rgba(16,32,51,0.62)" : "rgba(255,255,255,0.76)",
      fontSize: 11,
      fontWeight: "900",
      textAlign: "center"
    },
    fuelChipTextActive: {
      color: light ? "#FFFFFF" : "#07111F"
    },

    actionSplitRow: {
      flexDirection: "row",
      gap: 12
    },
    actionGroup: {
      flex: 1,
      flexDirection: "row",
      gap: 8,
      paddingHorizontal: 8,
      paddingVertical: 10,
      borderRadius: 26,
      backgroundColor: light ? "rgba(255,252,247,0.82)" : "rgba(255,255,255,0.06)",
      borderWidth: 1,
      borderColor: light ? "rgba(16,32,51,0.08)" : "rgba(255,255,255,0.09)"
    },
    actionItem: {
      flex: 1
    },
    actionPressable: {
      alignItems: "center",
      gap: 8
    },
    actionCircle: {
      width: 52,
      height: 52,
      borderRadius: 26,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: actionBorder
    },
    actionLabel: {
      color: light ? "rgba(16,32,51,0.70)" : "rgba(255,255,255,0.78)",
      fontSize: 10,
      fontWeight: "900",
      textAlign: "center"
    },
    tone_teal: {
      backgroundColor: light ? "rgba(45, 212, 191, 0.18)" : "rgba(45, 212, 191, 0.18)"
    },
    tone_blue: {
      backgroundColor: light ? "rgba(14, 165, 233, 0.16)" : "rgba(14, 165, 233, 0.18)"
    },
    tone_violet: {
      backgroundColor: light ? "rgba(139, 92, 246, 0.16)" : "rgba(139, 92, 246, 0.22)"
    },
    tone_amber: {
      backgroundColor: light ? "rgba(245, 158, 11, 0.16)" : "rgba(245, 158, 11, 0.18)"
    },

    marketCard: {
      borderRadius: 26,
      padding: 17,
      backgroundColor: cardBg,
      borderWidth: 1,
      borderColor: cardBorder,
      shadowColor: light ? "#9AA7B7" : "#000",
      shadowOpacity: light ? 0.14 : 0.24,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 12 },
      elevation: 3
    },
    marketHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 12,
      marginBottom: 12
    },
    marketKicker: {
      color: accent,
      fontSize: 11,
      fontWeight: "900",
      textTransform: "uppercase"
    },
    marketTitle: {
      marginTop: 4,
      color: text,
      fontSize: 19,
      lineHeight: 23,
      fontWeight: "900"
    },
    sourcePill: {
      maxWidth: 120,
      minHeight: 30,
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingHorizontal: 9,
      borderRadius: 999,
      backgroundColor: light ? "rgba(14, 116, 144, 0.09)" : "rgba(45, 212, 191, 0.10)",
      borderWidth: 1,
      borderColor: light ? "rgba(14, 116, 144, 0.15)" : "rgba(45, 212, 191, 0.18)"
    },
    sourcePillText: {
      flexShrink: 1,
      color: accent,
      fontSize: 10,
      fontWeight: "900"
    },
    pulseRow: {
      minHeight: 56,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      borderTopWidth: 1,
      borderTopColor: light ? "rgba(16,32,51,0.08)" : "rgba(255,255,255,0.08)"
    },
    pulseTextWrap: {
      flex: 1,
      minWidth: 0
    },
    pulseLabel: {
      color: light ? "rgba(16,32,51,0.92)" : "rgba(255,255,255,0.94)",
      fontSize: 13,
      fontWeight: "900"
    },
    pulseDetail: {
      marginTop: 3,
      color: faintText,
      fontSize: 11,
      fontWeight: "800"
    },
    pulseValue: {
      maxWidth: 138,
      color: text,
      fontSize: 15,
      fontWeight: "900",
      textAlign: "right"
    },
    pulseValueGood: {
      color: light ? "#0F766E" : "#2DD4BF"
    },
    pulseValueBad: {
      color: light ? "#B45309" : "#FBBF24"
    },

    modalBackdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.55)",
      alignItems: "center",
      justifyContent: "center",
      padding: 18
    },
    alertModal: {
      width: "100%",
      maxWidth: 520,
      borderRadius: 22,
      padding: 16,
      gap: 14,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    alertModalHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 12
    },
    alertModalTitle: {
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: "800"
    },
    alertModalSub: {
      marginTop: 4,
      color: theme.colors.muted,
      fontSize: 12,
      fontWeight: "700"
    },
    alertCloseBtn: {
      width: 40,
      height: 40,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    alertSegment: {
      flexDirection: "row",
      gap: 8,
      padding: 3,
      borderRadius: 16,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    alertSegmentItem: { flex: 1 },
    alertSegmentBtn: {
      minHeight: 42,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 13
    },
    alertSegmentBtnActive: {
      backgroundColor: theme.colors.primary
    },
    alertSegmentText: {
      color: theme.colors.muted,
      fontSize: 13,
      fontWeight: "800"
    },
    alertSegmentTextActive: {
      color: theme.colors.primaryText
    },
    alertInput: {
      minHeight: 50,
      borderRadius: 16,
      paddingHorizontal: 14,
      color: theme.colors.text,
      backgroundColor: theme.colors.tile,
      borderWidth: 1,
      borderColor: theme.colors.border,
      fontSize: 18,
      fontWeight: "800"
    },
    alertActions: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 10
    },
    alertGhostBtn: {
      minHeight: 44,
      justifyContent: "center",
      paddingHorizontal: 14,
      borderRadius: 15,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    alertGhostText: {
      color: theme.colors.text,
      fontSize: 13,
      fontWeight: "800"
    },
    alertPrimaryBtn: {
      minHeight: 44,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingHorizontal: 14,
      borderRadius: 15,
      backgroundColor: theme.colors.primary
    },
    alertPrimaryText: {
      color: theme.colors.primaryText,
      fontSize: 13,
      fontWeight: "800"
    }
  });
};
