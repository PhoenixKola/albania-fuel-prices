import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import type { Theme } from "../../theme/theme";
import { homePalette } from "../home/homePalette";

/** Compact tab title in the Home type scale. The title wraps instead of truncating at large text. */
export default function ScreenTitle(props: { theme: Theme; title: string; action?: React.ReactNode }) {
  const s = useMemo(() => makeStyles(props.theme), [props.theme]);
  return (
    <View style={s.row}>
      <Text style={s.title} accessibilityRole="header">{props.title}</Text>
      {props.action}
    </View>
  );
}

const makeStyles = (theme: Theme) => {
  const p = homePalette(theme);
  return StyleSheet.create({
    row: { minHeight: 48, flexDirection: "row", alignItems: "center", gap: 12 },
    title: { flex: 1, color: p.ink, fontSize: theme.m.f(26), lineHeight: theme.m.f(32), fontWeight: "900", letterSpacing: -0.4 },
  });
};
