import React, { useMemo, useRef } from "react";
import { Animated, Easing, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Theme } from "../../theme/theme";
import { makeErrorCardStyles } from "./ErrorCard.styles";

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

export default function ErrorCard(props: {
  theme: Theme;
  title: string;
  message: string;
  cta: string;
  onPress: () => void;
}) {
  const s = useMemo(() => makeErrorCardStyles(props.theme), [props.theme]);

  return (
    <View style={s.card}>
      <View style={s.head}>
        <View style={s.icon}>
          <Ionicons name="warning-outline" size={18} color={props.theme.colors.danger} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>{props.title}</Text>
          <Text style={s.msg}>{props.message}</Text>
        </View>
      </View>

      <AnimatedPressable onPress={props.onPress} contentStyle={s.btn}>
        <Ionicons name="refresh" size={16} color={props.theme.colors.primaryText} style={{ marginRight: 8 }} />
        <Text style={s.btnText}>{props.cta}</Text>
      </AnimatedPressable>
    </View>
  );
}