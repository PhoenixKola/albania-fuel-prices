import React, { useLayoutEffect, useRef, useState } from "react";
import { Animated, Easing, Text, View, type TextStyle } from "react-native";

type Props = {
  text: string;
  /** Print the last digit raised and smaller, like a forecourt price sign. */
  raised: boolean;
  size: number;
  color: string;
  unit?: string;
  unitColor?: string;
  reduceMotion: boolean;
  maxFontSizeMultiplier?: number;
};

/**
 * A price that rolls like an odometer when it changes: only the characters
 * that differ slide up into place, so switching Diesel → Petrol reads as the
 * board changing rather than the whole number blinking.
 */
export default function PriceNumeral({ text, raised, size, color, unit, unitColor, reduceMotion, maxFontSizeMultiplier = 1.2 }: Props) {
  const roll = useRef(new Animated.Value(1)).current;
  const prevText = useRef(text);
  const [changed, setChanged] = useState<boolean[]>([]);

  useLayoutEffect(() => {
    const prev = prevText.current;
    prevText.current = text;
    if (prev === text || reduceMotion) {
      setChanged([]);
      roll.setValue(1);
      return;
    }
    // Align from the right so "€2.409" → "€12.409" still rolls the right digits.
    const offset = text.length - prev.length;
    setChanged(Array.from(text, (ch, i) => prev[i - offset] !== ch));
    roll.setValue(0);
    Animated.timing(roll, { toValue: 1, duration: 260, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [text, reduceMotion, roll]);

  const main = raised ? text.slice(0, -1) : text;
  const last = raised ? text.slice(-1) : "";
  const count = text.length;

  const base: TextStyle = {
    color,
    fontSize: size,
    lineHeight: Math.round(size * 1.08),
    fontWeight: "900",
    letterSpacing: -size * 0.035,
    fontVariant: ["tabular-nums"],
    includeFontPadding: false,
  };
  const small: TextStyle = {
    ...base,
    fontSize: Math.round(size * 0.52),
    lineHeight: Math.round(size * 0.6),
    letterSpacing: 0,
    marginTop: Math.round(size * 0.1),
    marginLeft: 1,
  };

  const renderChar = (ch: string, index: number, style: TextStyle) => {
    if (!changed[index]) {
      return (
        <Text key={index} style={style} maxFontSizeMultiplier={maxFontSizeMultiplier}>
          {ch}
        </Text>
      );
    }
    // Stagger left-to-right across the changed characters.
    const start = Math.min(0.5, (index / Math.max(1, count)) * 0.45);
    const translateY = roll.interpolate({ inputRange: [0, start, Math.min(1, start + 0.5), 1], outputRange: [size * 0.28, size * 0.28, 0, 0] });
    const opacity = roll.interpolate({ inputRange: [0, start, Math.min(1, start + 0.4), 1], outputRange: [0, 0, 1, 1] });
    return (
      <Animated.Text key={index} style={[style, { opacity, transform: [{ translateY }] }]} maxFontSizeMultiplier={maxFontSizeMultiplier}>
        {ch}
      </Animated.Text>
    );
  };

  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", overflow: "hidden" }} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
      {Array.from(main).map((ch, i) => renderChar(ch, i, base))}
      {raised ? renderChar(last, count - 1, small) : null}
      {unit ? (
        <Text
          style={{ color: unitColor ?? color, fontSize: Math.round(size * 0.3), fontWeight: "800", marginLeft: Math.round(size * 0.1), alignSelf: "flex-end", marginBottom: Math.round(size * 0.14) }}
          maxFontSizeMultiplier={maxFontSizeMultiplier}
        >
          {unit}
        </Text>
      ) : null}
    </View>
  );
}
