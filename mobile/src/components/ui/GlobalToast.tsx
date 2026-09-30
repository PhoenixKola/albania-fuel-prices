import React, { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Animated, Text, View } from "react-native";

import type { Theme } from "../../theme/theme";

type Props = {
  theme: Theme;
  message: string | null;
};

export default function GlobalToast({ theme, message }: Props) {
  const [visibleMessage, setVisibleMessage] = useState<string | null>(null);
  const fade = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;
  const duration = theme.motion.reduced ? 0 : 160;

  useEffect(() => {
    if (!message) {
      Animated.parallel([
        Animated.timing(fade, { toValue: 0, duration, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: theme.motion.reduced ? 0 : 10, duration, useNativeDriver: true }),
      ]).start(() => setVisibleMessage(null));
      return;
    }

    setVisibleMessage(message);
    // Toasts are visual only; screen-reader users get the same confirmation spoken.
    AccessibilityInfo.announceForAccessibility(message);
    fade.setValue(0);
    translateY.setValue(theme.motion.reduced ? 0 : 10);
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration, useNativeDriver: true }),
    ]).start();
  }, [fade, message, translateY, duration, theme.motion.reduced]);

  if (!visibleMessage) return null;

  return (
    <View pointerEvents="none" style={{ position: "absolute", left: 14, right: 14, bottom: 22, zIndex: 999, alignItems: "center" }} importantForAccessibility="no-hide-descendants">
      <Animated.View
        style={{
          maxWidth: 520,
          opacity: fade,
          transform: [{ translateY }],
          backgroundColor: theme.colors.primary,
          borderRadius: 14,
          paddingHorizontal: theme.m.s(14),
          paddingVertical: theme.m.s(10),
          borderWidth: 1,
          borderColor: theme.colors.border,
        }}
      >
        <Text style={{ color: theme.colors.primaryText, fontWeight: "800", fontSize: theme.m.f(14), lineHeight: theme.m.f(20), textAlign: "center" }}>{visibleMessage}</Text>
      </Animated.View>
    </View>
  );
}
