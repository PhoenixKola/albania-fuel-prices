import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Theme } from "../../theme/theme";
import { makeSegmentedStyles } from "./SegmentedControl.styles";
import AnimatedPressable from "./AnimatedPressable";

/**
 * Segmented row at normal sizes. From 1.6× text the options become a
 * vertical radio list, so long labels ("Benzinë 95") never squeeze into a
 * third of a narrow screen.
 */
export default function SegmentedControl<T extends string>(props: {
  theme: Theme;
  value: T;
  items: { value: T; label: string; icon?: any }[];
  onChange: (v: T) => void;
  accessibilityLabel?: string;
}) {
  const s = useMemo(() => makeSegmentedStyles(props.theme), [props.theme]);
  const stacked = props.theme.m.isXLText;

  return (
    <View style={s.wrap} accessibilityRole={stacked ? "radiogroup" : "tablist"} accessibilityLabel={props.accessibilityLabel}>
      {props.items.map((it) => {
        const active = it.value === props.value;
        return (
          <AnimatedPressable
            key={it.value}
            onPress={() => props.onChange(it.value)}
            style={stacked ? undefined : { flex: 1 }}
            contentStyle={[s.item, active ? s.itemActive : null]}
            scaleIn={0.985}
            accessibilityRole={stacked ? "radio" : "tab"}
            accessibilityLabel={it.label}
            accessibilityState={stacked ? { checked: active } : { selected: active }}
            reduceMotion={props.theme.motion.reduced}
          >
            {stacked ? (
              <Ionicons name={active ? "radio-button-on" : "radio-button-off"} size={22} color={active ? props.theme.colors.primary : props.theme.colors.muted} />
            ) : it.icon ? (
              <Ionicons name={it.icon} size={16} color={active ? props.theme.colors.text : props.theme.colors.muted} style={{ marginRight: 8 }} />
            ) : null}
            <Text style={[s.text, active ? s.textActive : null]}>{it.label}</Text>
          </AnimatedPressable>
        );
      })}
    </View>
  );
}
