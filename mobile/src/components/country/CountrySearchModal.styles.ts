import { StyleSheet } from "react-native";
import type { Theme } from "../../theme/theme";

export const makeCountryModalStyles = (theme: Theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: theme.colors.overlay,
      justifyContent: "flex-end",
    },
    sheet: {
      backgroundColor: theme.colors.bg,
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
      padding: theme.m.s(16),
      paddingBottom: theme.m.s(110),
      borderTopWidth: 1,
      borderColor: theme.colors.border,
      maxHeight: "85%",
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: theme.m.s(12),
      marginBottom: theme.m.s(10),
    },
    title: {
      fontSize: theme.m.f(16),
      fontWeight: "800",
      color: theme.colors.text,
    },
    closeBtn: {
      paddingVertical: theme.m.s(8),
      paddingHorizontal: theme.m.s(12),
      borderRadius: 12,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    closeText: {
      fontSize: theme.m.f(13),
      fontWeight: "800",
      color: theme.colors.text,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 14,
      paddingHorizontal: theme.m.s(12),
      paddingVertical: theme.m.s(10),
      color: theme.colors.text,
      backgroundColor: theme.colors.card,
      marginBottom: theme.m.s(10),
      fontWeight: "600",
    },
    list: {
      borderRadius: 14,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.card,
    },
    row: {
      paddingVertical: theme.m.s(12),
      paddingHorizontal: theme.m.s(12),
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: theme.m.s(10),
    },
    rowText: {
      color: theme.colors.text,
      fontWeight: "700",
      flex: 1,
    },
    right: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.m.s(10),
    },
    starBtn: {
      paddingVertical: theme.m.s(4),
      paddingHorizontal: theme.m.s(6),
      borderRadius: 10,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    starText: {
      fontSize: theme.m.f(14),
      fontWeight: "900",
    },
    starOn: {
      color: theme.colors.text,
    },
    starOff: {
      color: theme.colors.muted,
    },
    badge: {
      paddingVertical: theme.m.s(4),
      paddingHorizontal: theme.m.s(10),
      borderRadius: 999,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    badgeText: {
      color: theme.colors.muted,
      fontWeight: "800",
      fontSize: theme.m.f(12),
    },
  });