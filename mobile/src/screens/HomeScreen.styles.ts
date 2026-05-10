import { StyleSheet } from "react-native";
import type { Theme } from "../theme/theme";

export const makeHomeStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.bg
    },
    content: {
      padding: 14,
      paddingBottom: 24,
      gap: 12
    },

    hero: {
      position: "relative",
      overflow: "hidden",
      borderRadius: 22,
      padding: 18,
      backgroundColor: theme.name === "light" ? theme.colors.card : "#111827",
      borderWidth: 1,
      borderColor: theme.name === "light" ? "rgba(15,23,42,0.08)" : "rgba(255,255,255,0.12)",
      gap: 18,
      shadowColor: "#000",
      shadowOpacity: theme.name === "dark" ? 0.28 : 0.10,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 16 },
      elevation: 5
    },

    heroBandTop: {
      position: "absolute",
      top: 20,
      right: -42,
      width: 190,
      height: 54,
      borderRadius: 18,
      backgroundColor: theme.name === "light" ? "rgba(37,99,235,0.12)" : "rgba(59,130,246,0.34)",
      transform: [{ rotate: "-18deg" }]
    },

    heroBandBottom: {
      position: "absolute",
      bottom: 22,
      left: -44,
      width: 178,
      height: 46,
      borderRadius: 18,
      backgroundColor: theme.name === "light" ? "rgba(34,197,94,0.10)" : "rgba(34,197,94,0.22)",
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
      width: 42,
      height: 42,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.name === "light" ? theme.colors.linkBg : "rgba(255,255,255,0.14)",
      borderWidth: 1,
      borderColor: theme.name === "light" ? theme.colors.border : "rgba(255,255,255,0.18)"
    },

    heroTitleWrap: {
      flex: 1,
      minWidth: 0
    },

    heroEyebrow: {
      color: theme.name === "light" ? theme.colors.muted : "rgba(255,255,255,0.62)",
      fontSize: 11,
      fontWeight: "900",
      textTransform: "uppercase"
    },

    heroTitle: {
      marginTop: 3,
      color: theme.name === "light" ? theme.colors.text : "#FFFFFF",
      fontSize: 18,
      lineHeight: 22,
      fontWeight: "900"
    },

    heroStatus: {
      maxWidth: 108,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 999,
      backgroundColor: theme.name === "light" ? theme.colors.linkBg : "rgba(255,255,255,0.12)",
      borderWidth: 1,
      borderColor: theme.name === "light" ? theme.colors.border : "rgba(255,255,255,0.16)"
    },

    heroStatusText: {
      color: theme.name === "light" ? theme.colors.linkText : "#FFFFFF",
      fontSize: 11,
      fontWeight: "900"
    },

    heroMainRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: 16
    },

    heroPriceBlock: {
      flex: 1,
      minWidth: 0
    },

    countryLine: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8
    },

    countryFlag: {
      fontSize: 23
    },

    heroCountry: {
      flex: 1,
      color: theme.name === "light" ? theme.colors.text : "#FFFFFF",
      fontSize: 21,
      fontWeight: "900"
    },

    heroFuel: {
      marginTop: 12,
      color: theme.name === "light" ? theme.colors.muted : "rgba(255,255,255,0.68)",
      fontSize: 13,
      fontWeight: "900"
    },

    heroPrice: {
      marginTop: 3,
      color: theme.name === "light" ? theme.colors.text : "#FFFFFF",
      fontSize: 42,
      lineHeight: 48,
      fontWeight: "900"
    },

    heroSubline: {
      flex: 1,
      color: theme.name === "light" ? theme.colors.subText : "rgba(255,255,255,0.70)",
      fontSize: 12,
      fontWeight: "800"
    },

    heroMetaRow: {
      marginTop: 4,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      flexWrap: "wrap"
    },

    freshBadge: {
      maxWidth: 168,
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingVertical: 5,
      paddingHorizontal: 8,
      borderRadius: 999,
      backgroundColor: theme.name === "light" ? theme.colors.linkBg : "rgba(255,255,255,0.10)",
      borderWidth: 1,
      borderColor: theme.name === "light" ? theme.colors.border : "rgba(255,255,255,0.14)"
    },

    freshBadgeText: {
      flexShrink: 1,
      color: theme.name === "light" ? theme.colors.linkText : "#FFFFFF",
      fontSize: 10,
      fontWeight: "900"
    },

    heroSearchBtn: {
      width: 54,
      height: 54,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.name === "light" ? theme.colors.primary : "rgba(255,255,255,0.14)",
      borderWidth: 1,
      borderColor: theme.name === "light" ? theme.colors.primary : "rgba(255,255,255,0.20)"
    },

    fuelSelector: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8
    },

    heroFavoritesBlock: {
      gap: 8
    },

    heroFavoritesLabel: {
      color: theme.name === "light" ? theme.colors.muted : "rgba(255,255,255,0.60)",
      fontSize: 11,
      fontWeight: "900",
      textTransform: "uppercase"
    },

    heroFavoritesRow: {
      gap: 8,
      paddingRight: 6
    },

    heroFavoritePill: {
      minHeight: 36,
      justifyContent: "center",
      paddingVertical: 8,
      paddingHorizontal: 11,
      borderRadius: 999,
      backgroundColor: theme.name === "light" ? theme.colors.pillBg : "rgba(255,255,255,0.10)",
      borderWidth: 1,
      borderColor: theme.name === "light" ? theme.colors.border : "rgba(255,255,255,0.14)"
    },

    heroFavoritePillActive: {
      backgroundColor: theme.name === "light" ? theme.colors.primary : "#FFFFFF",
      borderColor: theme.name === "light" ? theme.colors.primary : "#FFFFFF"
    },

    heroFavoriteText: {
      maxWidth: 150,
      color: theme.name === "light" ? theme.colors.text : "rgba(255,255,255,0.82)",
      fontSize: 12,
      fontWeight: "900"
    },

    heroFavoriteTextActive: {
      color: theme.name === "light" ? theme.colors.primaryText : "#111827"
    },

    fuelChip: {
      flex: 1,
      minHeight: 44,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 7,
      paddingVertical: 10,
      paddingHorizontal: 8,
      borderRadius: 16,
      backgroundColor: theme.name === "light" ? theme.colors.pillBg : "rgba(255,255,255,0.10)",
      borderWidth: 1,
      borderColor: theme.name === "light" ? theme.colors.border : "rgba(255,255,255,0.14)"
    },

    fuelChipActive: {
      backgroundColor: theme.name === "light" ? theme.colors.primary : "#FFFFFF",
      borderColor: theme.name === "light" ? theme.colors.primary : "#FFFFFF"
    },

    fuelChipText: {
      flexShrink: 1,
      color: theme.name === "light" ? theme.colors.muted : "rgba(255,255,255,0.78)",
      fontSize: 11,
      fontWeight: "900",
      textAlign: "center"
    },

    fuelChipTextActive: {
      color: theme.name === "light" ? theme.colors.primaryText : "#111827"
    },

    insightGrid: {
      flexDirection: "row",
      gap: 10
    },

    insightCard: {
      flex: 1,
      minHeight: 132,
      backgroundColor: theme.colors.card,
      borderRadius: 18,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: "#000",
      shadowOpacity: theme.name === "dark" ? 0.18 : 0.07,
      shadowRadius: 16,
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
      backgroundColor: "rgba(59,130,246,0.14)"
    },

    insightIcon_green: {
      backgroundColor: "rgba(34,197,94,0.13)"
    },

    insightIcon_amber: {
      backgroundColor: "rgba(245,158,11,0.16)"
    },

    insightLabel: {
      marginTop: 12,
      color: theme.colors.muted,
      fontSize: 11,
      fontWeight: "900",
      textTransform: "uppercase"
    },

    insightValue: {
      marginTop: 5,
      color: theme.colors.text,
      fontSize: 20,
      lineHeight: 24,
      fontWeight: "900"
    },

    insightValueGood: {
      color: "#16A34A"
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

    quickCard: {
      backgroundColor: theme.colors.card,
      borderRadius: 18,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: 12
    },

    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12
    },
    cardHeaderLeft: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 12
    },
    headerIcon: {
      width: 40,
      height: 40,
      borderRadius: 16,
      backgroundColor: theme.colors.linkBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center"
    },
    cardTitle: {
      color: theme.colors.text,
      fontWeight: "900",
      fontSize: 14
    },
    cardSub: {
      marginTop: 4,
      color: theme.colors.muted,
      fontWeight: "800",
      fontSize: 12
    },

    headerBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 16,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    headerBtnText: {
      color: theme.colors.text,
      fontWeight: "900",
      fontSize: 12
    },

    headerBtnPrimary: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 16,
      backgroundColor: theme.colors.primary
    },
    headerBtnPrimaryText: {
      color: theme.colors.primaryText,
      fontWeight: "900",
      fontSize: 12
    },

    quickRow: {
      gap: 8,
      paddingRight: 6
    },

    quickPill: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 999,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    quickPillActive: {
      backgroundColor: theme.colors.tile
    },
    quickPillText: {
      color: theme.colors.muted,
      fontWeight: "900",
      fontSize: 12
    },
    quickPillTextActive: {
      color: theme.colors.text
    }
  });
