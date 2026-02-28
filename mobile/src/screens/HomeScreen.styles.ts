import { StyleSheet } from "react-native";
import type { Theme } from "../theme/theme";

export const makeHomeStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.bg,
    },
    content: {
      padding: 16,
      gap: 12,
    },
    spacerBottom: {
      height: 8,
    },

    quickCard: {
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: 10,
    },
    quickHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
    },
    quickTitle: {
      color: theme.colors.text,
      fontWeight: "900",
      fontSize: 14,
    },
    quickBtn: {
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 12,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    quickBtnText: {
      color: theme.colors.text,
      fontWeight: "900",
      fontSize: 12,
    },
    quickRow: {
      gap: 8,
      paddingRight: 6,
    },
    quickPill: {
      paddingVertical: 7,
      paddingHorizontal: 12,
      borderRadius: 999,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    quickPillActive: {
      backgroundColor: theme.colors.tile,
    },
    quickPillText: {
      color: theme.colors.muted,
      fontWeight: "900",
      fontSize: 12,
    },
    quickPillTextActive: {
      color: theme.colors.text,
    },

    sectionToggle: {
      flexDirection: "row",
      gap: 8,
    },
    sectionPill: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 14,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
    },
    sectionPillActive: {
      backgroundColor: theme.colors.tile,
    },
    sectionPillText: {
      color: theme.colors.muted,
      fontWeight: "900",
      fontSize: 13,
    },
    sectionPillTextActive: {
      color: theme.colors.text,
    },
  });