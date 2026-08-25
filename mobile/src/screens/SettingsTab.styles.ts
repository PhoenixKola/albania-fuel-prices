import { StyleSheet } from "react-native";
import type { Theme } from "../theme/theme";

export const makeSettingsStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      padding: theme.m.s(16),
      gap: theme.m.s(16),
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
      fontSize: theme.m.f(11),
      textTransform: "uppercase",
      letterSpacing: 0.8,
      paddingHorizontal: theme.m.s(16),
      paddingTop: theme.m.s(14),
      paddingBottom: theme.m.s(6),
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: theme.m.s(16),
      paddingVertical: theme.m.s(14),
    },
    rowBorder: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    rowLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.m.s(12),
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
      fontSize: theme.m.f(15),
    },
    rowSubLabel: {
      color: theme.colors.muted,
      fontWeight: "600",
      fontSize: theme.m.f(12),
      marginTop: theme.m.s(2),
    },
    rowValue: {
      color: theme.colors.muted,
      fontWeight: "700",
      fontSize: theme.m.f(14),
    },
    pill: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.m.s(6),
      paddingVertical: theme.m.s(6),
      paddingHorizontal: theme.m.s(12),
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
      fontSize: theme.m.f(12),
    },
    pillTextActive: {
      color: theme.colors.primaryText,
    },
    toggleRow: {
      flexDirection: "row",
      gap: theme.m.s(8),
    },
    footer: {
      alignItems: "center",
      paddingVertical: theme.m.s(20),
      gap: theme.m.s(4),
    },
    footerText: {
      color: theme.colors.muted,
      fontWeight: "700",
      fontSize: theme.m.f(12),
    },
    footerVersion: {
      color: theme.colors.muted,
      fontWeight: "600",
      fontSize: theme.m.f(11),
    },
  });
