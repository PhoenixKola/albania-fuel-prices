import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { Theme } from "../../theme/theme";
import AnimatedPressable from "../ui/AnimatedPressable";
import { homePalette, isCompactHome, type HomePalette } from "./homePalette";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

export type HomeAction = {
  key: string;
  icon: IconName;
  label: string;
  a11yLabel: string;
  active?: boolean;
  disabled?: boolean;
  onPress: () => void;
};

/** Actions about the selected price — never a copy of the tab bar. */
export default function HomeActions({ theme, actions }: { theme: Theme; actions: HomeAction[] }) {
  const p = useMemo(() => homePalette(theme), [theme]);
  const s = useMemo(() => makeStyles(theme, p), [theme, p]);
  const stacked = theme.m.isLargeText;
  // Narrow phones: icon above label so Albanian labels ("Shpërndaj") never truncate.
  const tall = !stacked && theme.m.width < 380;

  return (
    <View style={[s.row, stacked ? s.stacked : null]}>
      {actions.map((a) => (
        <AnimatedPressable
          key={a.key}
          onPress={a.onPress}
          disabled={a.disabled}
          style={stacked ? null : s.item}
          contentStyle={[s.button, tall ? s.buttonTall : null, a.active ? s.buttonActive : null, a.disabled ? s.disabled : null]}
          reduceMotion={theme.motion.reduced}
          accessibilityLabel={a.a11yLabel}
          accessibilityState={a.active ? { selected: true } : undefined}
        >
          <Ionicons name={a.icon} size={18} color={a.active ? p.accent : p.ink} />
          <Text style={[s.label, tall ? s.labelTall : null, a.active ? s.labelActive : null]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85} maxFontSizeMultiplier={1.5}>
            {a.label}
          </Text>
        </AnimatedPressable>
      ))}
    </View>
  );
}

const makeStyles = (theme: Theme, p: HomePalette) =>
  StyleSheet.create({
    row: { flexDirection: "row", gap: isCompactHome(theme) ? 8 : 10 },
    stacked: { flexDirection: "column" },
    item: { flex: 1, minWidth: 0 },
    button: {
      minHeight: 48,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 7,
      paddingHorizontal: 10,
      borderRadius: 16,
      backgroundColor: p.chip,
      borderWidth: 1,
      borderColor: p.chipBorder,
    },
    buttonTall: { flexDirection: "column", gap: 3, minHeight: 56, paddingHorizontal: 4, paddingVertical: 7 },
    labelTall: { fontSize: theme.m.f(12) },
    buttonActive: { backgroundColor: p.accentSoft, borderColor: p.accent },
    disabled: { opacity: 0.45 },
    label: { flexShrink: 1, color: p.ink, fontSize: theme.m.f(13), fontWeight: "800" },
    labelActive: { color: p.accent },
  });
