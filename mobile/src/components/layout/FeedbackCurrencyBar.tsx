import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { Theme } from "../../theme/theme";

export default function FeedbackCurrencyBar(props: {
  theme: Theme;
  t: any;

  onFeedbackPress: () => void;

  headerBtnStyle: any;
  headerBtnTextStyle: any;
}) {
  const { theme } = props;

  return (
    <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
      <View style={props.headerBtnStyle}>
        <Ionicons name="mail-outline" size={16} color={theme.colors.text} />
        <Text style={props.headerBtnTextStyle} onPress={props.onFeedbackPress}>
          {props.t.feedback}
        </Text>
      </View>
    </View>
  );
}