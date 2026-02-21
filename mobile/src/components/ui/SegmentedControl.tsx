import React, { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import type { Theme } from "../../theme/theme";
import { makeSegmentedStyles } from "./SegmentedControl.styles";

export default function SegmentedControl<T extends string>(props: {
  theme: Theme;
  value: T;
  items: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  const s = useMemo(() => makeSegmentedStyles(props.theme), [props.theme]);

  return (
    <View style={s.wrap}>
      {props.items.map((it) => {
        const active = it.value === props.value;
        return (
          <Pressable
            key={it.value}
            onPress={() => props.onChange(it.value)}
            style={[s.item, active ? s.itemActive : null]}
          >
            <Text style={[s.text, active ? s.textActive : null]}>{it.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}