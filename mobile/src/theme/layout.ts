import type { ViewStyle } from "react-native";
import type { Theme } from "./theme";

/**
 * Shared scroll-content container.
 *
 * Padding scales with the window, and the column is capped and centred so
 * tablets and unfolded devices show a readable column instead of rows
 * stretched edge to edge.
 */
export function contentContainer(theme: Theme, gap = 12): ViewStyle {
  return {
    padding: theme.m.gutter,
    gap: theme.m.s(gap),
    width: "100%",
    maxWidth: theme.m.maxContentWidth,
    alignSelf: "center",
  };
}
