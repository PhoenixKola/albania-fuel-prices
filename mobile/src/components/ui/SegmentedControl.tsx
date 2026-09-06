import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Theme } from "../../theme/theme";
import { makeSegmentedStyles } from "./SegmentedControl.styles";
import AnimatedPressable from "./AnimatedPressable";

export default function SegmentedControl<T extends string>(props: {
  theme: Theme;
  value: T;
  items: { value: T; label: string; icon?: any }[];
  onChange: (v: T) => void;
}) {
  const s = useMemo(() => makeSegmentedStyles(props.theme), [props.theme]);

  return (
    <View style={s.wrap}>
      {props.items.map((it) => {
        const active = it.value === props.value;
        return (
          <AnimatedPressable
            key={it.value}
            onPress={() => props.onChange(it.value)}
            style={{ flex: 1 }}
            contentStyle={[s.item, active ? s.itemActive : null]}
            scaleIn={0.985}
            accessibilityRole="tab"
            accessibilityLabel={it.label}
            accessibilityState={{ selected: active }}
            reduceMotion={props.theme.motion.reduced}
          >
            {it.icon ? (
              <Ionicons
                name={it.icon}
                size={16}
                color={active ? props.theme.colors.text : props.theme.colors.muted}
                style={{ marginRight: 8 }}
              />
            ) : null}
            <Text style={[s.text, active ? s.textActive : null]}>
              {it.label}
            </Text>
          </AnimatedPressable>
        );
      })}
    </View>
  );
}
