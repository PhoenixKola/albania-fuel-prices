import React, { useRef, useSyncExternalStore } from "react";
import { AccessibilityInfo, Animated, Easing, Pressable, type AccessibilityRole, type AccessibilityState } from "react-native";
import { hapticLight } from "../../utils/haptics";

// One app-wide reduce-motion subscription shared by every pressable, instead
// of one listener per instance (long lists mount hundreds of these).
let systemReduceMotion = false;
const listeners = new Set<() => void>();
let subscribed = false;

function subscribeReduceMotion(listener: () => void) {
  listeners.add(listener);
  if (!subscribed) {
    subscribed = true;
    const set = (value: boolean) => {
      if (value === systemReduceMotion) return;
      systemReduceMotion = value;
      listeners.forEach((l) => l());
    };
    AccessibilityInfo.isReduceMotionEnabled().then(set).catch(() => {});
    AccessibilityInfo.addEventListener("reduceMotionChanged", set);
  }
  return () => {
    listeners.delete(listener);
  };
}

const getReduceMotion = () => systemReduceMotion;

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
  const shouldReduceMotion = useSyncExternalStore(subscribeReduceMotion, getReduceMotion) || reduceMotion;

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
