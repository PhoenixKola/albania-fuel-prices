import React, { useMemo, useRef } from "react";
import { Animated, Easing, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Theme } from "../../theme/theme";
import { makeTopBarStyles } from "./Topbar.styles";

function AnimatedPressable({
  onPress,
  children,
  style,
  contentStyle,
  scaleIn = 0.97
}: {
  onPress?: () => void;
  children: React.ReactNode;
  style?: any;
  contentStyle?: any;
  scaleIn?: number;
}) {
  const PressableAny = require("react-native").Pressable;
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.timing(scale, { toValue: scaleIn, duration: 90, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  };

  const pressOut = () => {
    Animated.timing(scale, { toValue: 1, duration: 120, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <PressableAny onPress={onPress} onPressIn={pressIn} onPressOut={pressOut} style={contentStyle}>
        {children}
      </PressableAny>
    </Animated.View>
  );
}

export default function TopBar(props: {
  theme: Theme;
  title: string;
  subtitle: string;
  langPillLabel: string;
  onToggleLang: () => void;
  // themePillLabel: string;
  onToggleTheme: () => void;
}) {
  const { theme } = props;
  const s = useMemo(() => makeTopBarStyles(theme), [theme]);

  const isDark = theme.name === "dark";

  return (
    <View style={s.header}>
      <View style={s.row}>
        <View style={s.brand}>
          <View style={s.brandIcon}>
            <Ionicons name="flame-outline" size={18} color={theme.colors.primary} />
          </View>

          <View style={s.titleWrap}>
            <Text style={s.h1}>{props.title}</Text>
            <Text style={s.sub}>{props.subtitle}</Text>
          </View>
        </View>

        <View style={s.actions}>
          <AnimatedPressable onPress={props.onToggleTheme} contentStyle={s.pill} scaleIn={0.98}>
            <Ionicons name={isDark ? "sunny-outline" : "moon-outline"} size={16} color={theme.colors.text} />
            {/* <Text style={s.pillText}>{props.themePillLabel}</Text> */}
          </AnimatedPressable>

          <AnimatedPressable onPress={props.onToggleLang} contentStyle={s.pill} scaleIn={0.98}>
            <Ionicons name="globe-outline" size={16} color={theme.colors.text} />
            <Text style={s.pillText}>{props.langPillLabel}</Text>
          </AnimatedPressable>
        </View>
      </View>
    </View>
  );
}