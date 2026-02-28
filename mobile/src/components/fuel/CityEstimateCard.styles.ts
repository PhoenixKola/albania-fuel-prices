import { StyleSheet } from "react-native";
import type { Theme } from "../../theme/theme";

export const makeCityEstimateStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 18,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: 12
    },

    headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
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
    subtitle: { marginTop: 4, color: theme.colors.muted, fontWeight: "800", fontSize: 12 },

    label: { fontSize: 12, fontWeight: "900", color: theme.colors.muted },

    fieldHeader: { flexDirection: "row", alignItems: "center" },

    pickerWrap: {
      borderRadius: 16,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.tile
    },

    biasHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
    hint: { color: theme.colors.muted, lineHeight: 18, fontWeight: "700" },

    biasRow: { flexDirection: "row", alignItems: "center", gap: 10, flexWrap: "wrap" },

    pill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 14,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    pillText: { fontWeight: "900", color: theme.colors.text },

    ghostBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 14,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    ghostBtnText: { color: theme.colors.text, fontWeight: "900", fontSize: 12 },

    estimateBox: {
      borderRadius: 16,
      padding: 14,
      backgroundColor: theme.colors.tile,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: 8
    },
    estimateTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
    estimateValue: { fontSize: 22, fontWeight: "900", color: theme.colors.text },
    note: { fontSize: 12, color: theme.colors.muted, fontWeight: "700" },

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
    badgeText: { fontWeight: "900", color: theme.colors.linkText, fontSize: 12 }
  });