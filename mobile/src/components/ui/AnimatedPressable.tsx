import React, { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Animated, Easing, Pressable, type AccessibilityRole, type AccessibilityState } from "react-native";
import { hapticLight } from "../../utils/haptics";

export default function AnimatedPressable({
  onPress,
  children,
  style,
  contentStyle,
  disabled,
  scaleIn = 0.98,
  hitSlop,
  haptic = true,
  reduceMotion = false,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = "button",
  accessibilityState,
  testID
}: {
  onPress?: () => void;
  children: React.ReactNode;
  style?: any;
  contentStyle?: any;
  disabled?: boolean;
  scaleIn?: number;
  hitSlop?: any;
  haptic?: boolean;
  reduceMotion?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
  accessibilityState?: AccessibilityState;
  testID?: string;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const [systemReduceMotion, setSystemReduceMotion] = useState(false);
  const shouldReduceMotion = reduceMotion || systemReduceMotion;

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setSystemReduceMotion).catch(() => {});
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", setSystemReduceMotion);
    return () => subscription.remove();
  }, []);

  const pressIn = () => {
    if (disabled) return;
    if (haptic) hapticLight();
    Animated.timing(scale, { toValue: scaleIn, duration: shouldReduceMotion ? 0 : 90, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  };

  const pressOut = () => {
    Animated.timing(scale, { toValue: 1, duration: shouldReduceMotion ? 0 : 120, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        hitSlop={hitSlop}
        onPressIn={pressIn}
        onPressOut={pressOut}
        style={contentStyle}
        accessibilityRole={accessibilityRole}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ ...accessibilityState, disabled: disabled || accessibilityState?.disabled }}
        testID={testID}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
