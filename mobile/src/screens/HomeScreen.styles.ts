import { StyleSheet } from "react-native";
import type { Theme } from "../theme/theme";

export const makeHomeStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.bg
    },
    content: {
      padding: 16,
      gap: 12
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