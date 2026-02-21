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
  });