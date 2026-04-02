import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { Theme } from "../../theme/theme";

export default function FeedbackCurrencyBar(props: {
  theme: Theme;
  t: any;

  onFeedbackPress: () => void;
  onUnlockPress: () => void;
  unlockDisabled: boolean;
  rewardUnlocked: boolean;

  headerBtnStyle: any;
  headerBtnTextStyle: any;
}) {
  const { theme } = props;
  const unlockLabel = props.rewardUnlocked
    ? props.t.rewardsEnabled
    : props.unlockDisabled
      ? props.t.unlockLater
      : props.t.unlockRewards;

  return (
    <View style={{ flexDirection: "row", gap: 10, alignItems: "center", justifyContent: "space-between" }}>
      <Pressable onPress={props.onFeedbackPress} style={props.headerBtnStyle}>
        <Ionicons name="mail-outline" size={16} color={theme.colors.text} />
        <Text style={props.headerBtnTextStyle}>
          {props.t.feedback}
        </Text>
      </Pressable>

      <Pressable
        onPress={props.onUnlockPress}
        disabled={props.unlockDisabled}
        style={[props.headerBtnStyle, props.unlockDisabled ? { opacity: 0.55 } : null]}
      >
        <Ionicons
          name={props.rewardUnlocked ? "checkmark-circle" : "gift-outline"}
          size={16}
          color={props.rewardUnlocked ? theme.colors.primary : theme.colors.text}
        />
        <Text style={props.headerBtnTextStyle} numberOfLines={1}>
          {unlockLabel}
        </Text>
      </Pressable>
    </View>
  );
}