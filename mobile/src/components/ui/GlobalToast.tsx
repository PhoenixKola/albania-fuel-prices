import React, { useEffect, useRef, useState } from "react";
import { Animated, Text, View } from "react-native";

import type { Theme } from "../../theme/theme";

type Props = {
  theme: Theme;
  message: string | null;
};

export default function GlobalToast({ theme, message }: Props) {
  const [visibleMessage, setVisibleMessage] = useState<string | null>(null);
  const fade = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    if (!message) {
      Animated.parallel([
        Animated.timing(fade, { toValue: 0, duration: 140, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 10, duration: 140, useNativeDriver: true }),
      ]).start(() => setVisibleMessage(null));
      return;
    }

    setVisibleMessage(message);
    fade.setValue(0);
    translateY.setValue(10);
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 160, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 160, useNativeDriver: true }),
    ]).start();
  }, [fade, message, translateY]);

  if (!visibleMessage) return null;

  return (
    <View pointerEvents="none" style={{ position: "absolute", left: 14, right: 14, bottom: 22, zIndex: 999 }}>
      <Animated.View
        style={{
          opacity: fade,
          transform: [{ translateY }],
          backgroundColor: theme.colors.primary,
          borderRadius: 14,
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderWidth: 1,
          borderColor: theme.colors.border,
        }}
      >
        <Text style={{ color: theme.colors.primaryText, fontWeight: "800", fontSize: 13 }}>{visibleMessage}</Text>
      </Animated.View>
    </View>
  );
}
