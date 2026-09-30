import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Theme } from "../../theme/theme";
import AnimatedPressable from "../ui/AnimatedPressable";
import { makeErrorCardStyles } from "./ErrorCard.styles";

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
        <View style={s.icon} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <Ionicons name="warning-outline" size={18} color={props.theme.colors.danger} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.title} accessibilityRole="header">{props.title}</Text>
          <Text style={s.msg}>{props.message}</Text>
        </View>
      </View>

      <AnimatedPressable onPress={props.onPress} contentStyle={s.btn} reduceMotion={props.theme.motion.reduced} accessibilityLabel={props.cta}>
        <Ionicons name="refresh" size={16} color={props.theme.colors.primaryText} style={{ marginRight: 8 }} />
        <Text style={s.btnText}>{props.cta}</Text>
      </AnimatedPressable>
    </View>
  );
}
