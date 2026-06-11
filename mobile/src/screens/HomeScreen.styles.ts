import { StyleSheet } from "react-native";
import type { Theme } from "../theme/theme";

const isLight = (theme: Theme) => theme.name === "light";

export const makeHomeStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.bg
    },
    bgGlowPrimary: {
      position: "absolute",
      top: -96,
      right: -88,
      width: 240,
      height: 240,
      borderRadius: 120,
      backgroundColor: isLight(theme) ? "rgba(20, 184, 166, 0.18)" : "rgba(45, 212, 191, 0.17)"
    },
    bgGlowSecondary: {
      position: "absolute",
      top: 220,
      left: -120,
      width: 250,
      height: 250,
      borderRadius: 125,
      backgroundColor: isLight(theme) ? "rgba(245, 158, 11, 0.11)" : "rgba(14, 165, 233, 0.10)"
    },
    content: {
      padding: 16,
      paddingBottom: 28,
      gap: 14
    },

    topBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12
    },
    topTitleWrap: {
      flex: 1,
      minWidth: 0
    },
    topEyebrow: {
      color: theme.colors.linkText,
      fontSize: 11,
      fontWeight: "900",
      textTransform: "uppercase",
      letterSpacing: 0
    },
    topTitle: {
      marginTop: 4,
      color: theme.colors.text,
      fontSize: 21,
      lineHeight: 25,
      fontWeight: "900"
    },
    topUpdated: {
      marginTop: 3,
      color: theme.colors.muted,
      fontSize: 12,
      fontWeight: "800"
    },
    topActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8
    },
    statusPill: {
      maxWidth: 92,
      minHeight: 38,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 10,
      borderRadius: 999,
      backgroundColor: theme.colors.linkBg,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    statusPillText: {
      flexShrink: 1,
      color: theme.colors.linkText,
      fontSize: 11,
      fontWeight: "900"
    },
    topIconBtn: {
      width: 38,
      height: 38,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isLight(theme) ? "rgba(255,255,255,0.72)" : "rgba(255,255,255,0.08)",
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    topIconBtnAccent: {
      backgroundColor: theme.colors.linkBg,
      borderColor: isLight(theme) ? "rgba(15,118,110,0.24)" : "rgba(45,212,191,0.26)"
    },

    hero: {
      position: "relative",
      overflow: "hidden",
      borderRadius: 28,
      padding: 18,
      backgroundColor: isLight(theme) ? "rgba(255,252,247,0.94)" : "#0A1628",
      borderWidth: 1,
      borderColor: isLight(theme) ? "rgba(16,32,51,0.10)" : "rgba(255,255,255,0.13)",
      gap: 18,
      shadowColor: "#000",
      shadowOpacity: isLight(theme) ? 0.10 : 0.32,
      shadowRadius: 26,
      shadowOffset: { width: 0, height: 18 },
      elevation: 6
    },
    heroAura: {
      position: "absolute",
      top: -94,
      right: -96,
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor: isLight(theme) ? "rgba(20, 184, 166, 0.16)" : "rgba(45, 212, 191, 0.20)"
    },
    heroBandTop: {
      position: "absolute",
      top: 34,
      right: -64,
      width: 210,
      height: 58,
      borderRadius: 22,
      backgroundColor: isLight(theme) ? "rgba(14, 116, 144, 0.09)" : "rgba(255,255,255,0.10)",
      transform: [{ rotate: "-18deg" }]
    },
    heroBandBottom: {
      position: "absolute",
      bottom: 26,
      left: -58,
      width: 190,
      height: 52,
      borderRadius: 22,
      backgroundColor: isLight(theme) ? "rgba(245,158,11,0.12)" : "rgba(14,165,233,0.15)",
      transform: [{ rotate: "-18deg" }]
    },
    heroTopRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12
    },
    heroBrandRow: {
      flex: 1,
      minWidth: 0,
      flexDirection: "row",
      alignItems: "center",
      gap: 12
    },
    heroIcon: {
      width: 44,
      height: 44,
      borderRadius: 17,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isLight(theme) ? theme.colors.linkBg : "rgba(255,255,255,0.13)",
      borderWidth: 1,
      borderColor: isLight(theme) ? theme.colors.border : "rgba(255,255,255,0.18)"
    },
    heroTitleWrap: {
      flex: 1,
      minWidth: 0
    },
    heroEyebrow: {
      color: isLight(theme) ? theme.colors.linkText : "rgba(255,255,255,0.66)",
      fontSize: 11,
      fontWeight: "900",
      textTransform: "uppercase",
      letterSpacing: 0
    },
    countryLine: {
      marginTop: 4,
      flexDirection: "row",
      alignItems: "center",
      gap: 8
    },
    countryFlag: {
      fontSize: 23
    },
    heroCountry: {
      flex: 1,
      color: isLight(theme) ? theme.colors.text : "#FFFFFF",
      fontSize: 22,
      lineHeight: 27,
      fontWeight: "900"
    },
    heroSearchBtn: {
      width: 52,
      height: 52,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isLight(theme) ? theme.colors.primary : "rgba(255,255,255,0.13)",
      borderWidth: 1,
      borderColor: isLight(theme) ? "rgba(255,255,255,0.20)" : "rgba(255,255,255,0.18)"
    },
    heroPriceBlock: {
      minWidth: 0
    },
    heroFuel: {
      color: isLight(theme) ? theme.colors.muted : "rgba(255,255,255,0.68)",
      fontSize: 13,
      fontWeight: "900"
    },
    heroPrice: {
      marginTop: 3,
      color: isLight(theme) ? theme.colors.text : "#FFFFFF",
      fontSize: 48,
      lineHeight: 56,
      fontWeight: "900"
    },
    heroSubline: {
      color: isLight(theme) ? theme.colors.subText : "rgba(255,255,255,0.74)",
      fontSize: 13,
      fontWeight: "800"
    },
    fuelSelector: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      padding: 5,
      borderRadius: 20,
      backgroundColor: isLight(theme) ? "rgba(16,32,51,0.05)" : "rgba(255,255,255,0.10)",
      borderWidth: 1,
      borderColor: isLight(theme) ? theme.colors.border : "rgba(255,255,255,0.12)"
    },
    fuelChip: {
      flex: 1,
      minHeight: 42,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingVertical: 9,
      paddingHorizontal: 7,
      borderRadius: 15
    },
    fuelChipActive: {
      backgroundColor: isLight(theme) ? theme.colors.primary : "#FFFFFF"
    },
    fuelChipText: {
      flexShrink: 1,
      color: isLight(theme) ? theme.colors.muted : "rgba(255,255,255,0.78)",
      fontSize: 11,
      fontWeight: "900",
      textAlign: "center"
    },
    fuelChipTextActive: {
      color: isLight(theme) ? theme.colors.primaryText : "#052E2B"
    },
    favoriteRailWrap: {
      minHeight: 38,
      justifyContent: "center"
    },
    heroFavoritesRow: {
      gap: 8,
      paddingRight: 6
    },
    heroFavoritePill: {
      minHeight: 36,
      justifyContent: "center",
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 999,
      backgroundColor: isLight(theme) ? theme.colors.pillBg : "rgba(255,255,255,0.10)",
      borderWidth: 1,
      borderColor: isLight(theme) ? theme.colors.border : "rgba(255,255,255,0.14)"
    },
    heroFavoritePillActive: {
      backgroundColor: isLight(theme) ? theme.colors.primary : "#FFFFFF",
      borderColor: isLight(theme) ? theme.colors.primary : "#FFFFFF"
    },
    heroFavoriteText: {
      maxWidth: 150,
      color: isLight(theme) ? theme.colors.text : "rgba(255,255,255,0.84)",
      fontSize: 12,
      fontWeight: "900"
    },
    heroFavoriteTextActive: {
      color: isLight(theme) ? theme.colors.primaryText : "#052E2B"
    },
    emptyFavoriteCta: {
      alignSelf: "flex-start",
      minHeight: 38,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 999,
      backgroundColor: isLight(theme) ? theme.colors.pillBg : "rgba(255,255,255,0.10)",
      borderWidth: 1,
      borderColor: isLight(theme) ? theme.colors.border : "rgba(255,255,255,0.14)"
    },
    emptyFavoriteText: {
      color: isLight(theme) ? theme.colors.text : "#FFFFFF",
      fontSize: 12,
      fontWeight: "900"
    },

    sectionHeader: {
      marginTop: 2,
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: 12
    },
    sectionTitle: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: "900"
    },
    sectionSub: {
      flexShrink: 1,
      color: theme.colors.muted,
      fontSize: 12,
      fontWeight: "800",
      textAlign: "right"
    },
    insightGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10
    },
    insightCard: {
      flexGrow: 1,
      flexBasis: "47%",
      minHeight: 122,
      backgroundColor: theme.colors.card,
      borderRadius: 20,
      padding: 13,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: "#000",
      shadowOpacity: theme.name === "dark" ? 0.16 : 0.06,
      shadowRadius: 15,
      shadowOffset: { width: 0, height: 10 },
      elevation: 2
    },
    insightIcon: {
      width: 34,
      height: 34,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    insightIcon_blue: {
      backgroundColor: isLight(theme) ? "rgba(14, 116, 144, 0.12)" : "rgba(14, 165, 233, 0.15)"
    },
    insightIcon_green: {
      backgroundColor: isLight(theme) ? "rgba(15, 118, 110, 0.13)" : "rgba(45, 212, 191, 0.14)"
    },
    insightIcon_amber: {
      backgroundColor: isLight(theme) ? "rgba(245, 158, 11, 0.15)" : "rgba(245, 158, 11, 0.14)"
    },
    insightLabel: {
      marginTop: 11,
      color: theme.colors.muted,
      fontSize: 11,
      fontWeight: "900",
      textTransform: "uppercase",
      letterSpacing: 0
    },
    insightValue: {
      marginTop: 5,
      color: theme.colors.text,
      fontSize: 20,
      lineHeight: 24,
      fontWeight: "900"
    },
    insightValueGood: {
      color: isLight(theme) ? "#0F766E" : "#2DD4BF"
    },
    insightValueBad: {
      color: theme.colors.danger
    },
    insightCaption: {
      marginTop: 5,
      color: theme.colors.subText,
      fontSize: 11,
      lineHeight: 15,
      fontWeight: "800"
    },

    shortcutGrid: {
      gap: 10
    },
    shortcutCard: {
      minHeight: 72,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 13,
      borderRadius: 20,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: "#000",
      shadowOpacity: theme.name === "dark" ? 0.14 : 0.05,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 8 },
      elevation: 1
    },
    shortcutIcon: {
      width: 40,
      height: 40,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    shortcutTextWrap: {
      flex: 1,
      minWidth: 0
    },
    shortcutTitle: {
      color: theme.colors.text,
      fontSize: 14,
      fontWeight: "900"
    },
    shortcutSub: {
      marginTop: 3,
      color: theme.colors.muted,
      fontSize: 12,
      lineHeight: 16,
      fontWeight: "800"
    }
  });
