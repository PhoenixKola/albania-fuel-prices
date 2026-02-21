import { StyleSheet } from "react-native";
import type { Theme } from "../../theme/theme";

export const makeCityEstimateStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: 12,
    },
    title: {
      fontSize: 16,
      fontWeight: "900",
      color: theme.colors.text,
    },
    label: {
      fontSize: 12,
      fontWeight: "900",
      color: theme.colors.muted,
    },
    pickerWrap: {
      borderRadius: 14,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.tile,
    },
    rowBetween: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
    },
    biasRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      flexWrap: "wrap",
    },
    pill: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 12,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
    },
    pillText: {
      fontWeight: "900",
      color: theme.colors.text,
    },
    hint: {
      color: theme.colors.muted,
      lineHeight: 18,
    },
    estimateBox: {
      borderRadius: 14,
      padding: 12,
      backgroundColor: theme.colors.tile,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: 6,
    },
    estimateValue: {
      fontSize: 20,
      fontWeight: "900",
      color: theme.colors.text,
    },
    note: {
      fontSize: 12,
      color: theme.colors.muted,
    },
  });