import { StyleSheet } from "react-native";
import type { Theme } from "../../theme/theme";

export const makeFuelCardStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 18,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: 12
    },

    headerRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 },
    headerLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
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
    title: { fontSize: 16, fontWeight: "900", color: theme.colors.text },

    badgeRow: { marginTop: 6, flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
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
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 999,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border
    },

    headerActions: { flexDirection: "row", alignItems: "center", gap: 10 },

    iconBtn: {
      width: 44,
      height: 44,
      borderRadius: 16,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center"
    },
    iconBtnDisabled: { opacity: 0.6 },

    countryRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
    countryName: { fontSize: 18, fontWeight: "900", color: theme.colors.text },
    subText: { marginTop: 6, color: theme.colors.muted, fontWeight: "800", fontSize: 12 },

    ghostBtn: {
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
    ghostBtnText: { fontSize: 12, fontWeight: "900", color: theme.colors.text },

    label: { color: theme.colors.muted, fontWeight: "900", fontSize: 12 },

    currencyRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
    currencyPills: { flexDirection: "row", gap: 8, alignItems: "center", flexWrap: "wrap" },

    pill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 999,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    pillActive: { backgroundColor: theme.colors.tile },
    pillDisabled: { opacity: 0.5 },
    pillText: { fontSize: 12, fontWeight: "900", color: theme.colors.muted },
    pillTextActive: { color: theme.colors.text },
    pillTextDisabled: { color: theme.colors.muted },

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

    mutedSmall: { fontSize: 12, color: theme.colors.muted, fontWeight: "700" }
  });