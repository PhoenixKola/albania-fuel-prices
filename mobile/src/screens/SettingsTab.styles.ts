import { StyleSheet } from "react-native";
import type { Theme } from "../theme/theme";

export const makeSettingsStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      padding: 16,
      gap: 16,
    },
    section: {
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: "hidden",
    },
    sectionTitle: {
      color: theme.colors.muted,
      fontWeight: "800",
      fontSize: 11,
      textTransform: "uppercase",
      letterSpacing: 0.8,
      paddingHorizontal: 16,
      paddingTop: 14,
      paddingBottom: 6,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    rowBorder: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    rowLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      flex: 1,
    },
    rowIconWrap: {
      width: 34,
      height: 34,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    rowLabel: {
      color: theme.colors.text,
      fontWeight: "700",
      fontSize: 15,
    },
    rowSubLabel: {
      color: theme.colors.muted,
      fontWeight: "600",
      fontSize: 12,
      marginTop: 2,
    },
    rowValue: {
      color: theme.colors.muted,
      fontWeight: "700",
      fontSize: 14,
    },
    pill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 10,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    pillActive: {
      backgroundColor: theme.colors.primary,
    },
    pillText: {
      color: theme.colors.text,
      fontWeight: "800",
      fontSize: 12,
    },
    pillTextActive: {
      color: theme.colors.primaryText,
    },
    toggleRow: {
      flexDirection: "row",
      gap: 8,
    },
    footer: {
      alignItems: "center",
      paddingVertical: 20,
      gap: 4,
    },
    footerText: {
      color: theme.colors.muted,
      fontWeight: "700",
      fontSize: 12,
    },
    footerVersion: {
      color: theme.colors.muted,
      fontWeight: "600",
      fontSize: 11,
    },
  });
