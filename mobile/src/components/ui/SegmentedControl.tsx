import React, { useMemo, useRef } from "react";
import { Animated, Easing, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Theme } from "../../theme/theme";
import { makeSegmentedStyles } from "./SegmentedControl.styles";

function AnimatedPressable({
  onPress,
  children,
  style,
  contentStyle,
  scaleIn = 0.98
}: {
  onPress: () => void;
  children: React.ReactNode;
  style?: any;
  contentStyle?: any;
  scaleIn?: number;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.timing(scale, { toValue: scaleIn, duration: 90, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  };

  const pressOut = () => {
    Animated.timing(scale, { toValue: 1, duration: 120, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut} style={contentStyle}>
        {children}
      </Pressable>
    </Animated.View>
  );
}

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
          >
            {it.icon ? (
              <Ionicons
                name={it.icon}
                size={16}
                color={active ? props.theme.colors.text : props.theme.colors.muted}
                style={{ marginRight: 8 }}
              />
            ) : null}
            <Text style={[s.text, active ? s.textActive : null]} numberOfLines={1}>
              {it.label}
            </Text>
          </AnimatedPressable>
        );
      })}
    </View>
  );
}