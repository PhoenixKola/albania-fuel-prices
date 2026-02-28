import { StyleSheet } from "react-native";
import type { Theme } from "../../theme/theme";

export const makeCompareStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: 12,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 10,
    },
    title: {
      fontSize: 16,
      fontWeight: "900",
      color: theme.colors.text,
    },
    subtitle: {
      marginTop: 4,
      color: theme.colors.muted,
      fontWeight: "700",
      fontSize: 12,
    },
    hint: {
      color: theme.colors.muted,
      fontWeight: "700",
      fontSize: 12,
    },
    btn: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 12,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    btnDisabled: {
      opacity: 0.5,
    },
    btnText: {
      color: theme.colors.text,
      fontWeight: "900",
      fontSize: 12,
    },
    list: {
      borderRadius: 14,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.tile,
    },
    row: {
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
    },
    left: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      flex: 1,
    },
    rankBubble: {
      width: 28,
      height: 28,
      borderRadius: 999,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    rankText: {
      color: theme.colors.text,
      fontWeight: "900",
      fontSize: 12,
    },
    country: {
      color: theme.colors.text,
      fontWeight: "900",
      fontSize: 14,
    },
    sub: {
      marginTop: 2,
      color: theme.colors.muted,
      fontWeight: "700",
      fontSize: 12,
    },
    right: {
      alignItems: "flex-end",
      gap: 6,
    },
    price: {
      color: theme.colors.text,
      fontWeight: "900",
      fontSize: 14,
    },
    removeBtn: {
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 12,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    removeText: {
      color: theme.colors.muted,
      fontWeight: "900",
      fontSize: 12,
    },
  });