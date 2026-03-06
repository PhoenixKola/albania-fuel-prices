import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { Theme } from "../../theme/theme";
import AnimatedPressable from "../ui/AnimatedPressable";

type CurrencyMode = "eur" | "local";

export default function FeedbackCurrencyBar(props: {
  theme: Theme;
  t: any;

  onFeedbackPress: () => void;

  currencyLocalCode: string;
  canLocal: boolean;
  currencyMode: CurrencyMode;
  onSetCurrencyMode: (m: CurrencyMode) => void;

  headerBtnStyle: any;
  headerBtnTextStyle: any;
}) {
  const { theme } = props;

  const setModeSafe = (m: CurrencyMode) => {
    if (m === "local" && !props.canLocal) return;
    props.onSetCurrencyMode(m);
  };

  const eurActive = props.currencyMode === "eur";
  const localActive = props.currencyMode === "local";

  const eurBtnStyle = useMemo(
    () => [
      props.headerBtnStyle,
      { paddingHorizontal: 12, flexDirection: "row", gap: 8, alignItems: "center" },
      eurActive ? { backgroundColor: theme.colors.tile } : null
    ],
    [props.headerBtnStyle, eurActive, theme.colors.tile]
  );

  const localBtnStyle = useMemo(
    () => [
      props.headerBtnStyle,
      { paddingHorizontal: 12, flexDirection: "row", gap: 8, alignItems: "center", opacity: props.canLocal ? 1 : 0.5 },
      localActive ? { backgroundColor: theme.colors.tile } : null
    ],
    [props.headerBtnStyle, localActive, props.canLocal, theme.colors.tile]
  );

  const eurTextStyle = useMemo(
    () => [
      props.headerBtnTextStyle,
      { marginLeft: 0 },
      eurActive ? { color: theme.colors.text } : { color: theme.colors.muted }
    ],
    [props.headerBtnTextStyle, eurActive, theme.colors.text, theme.colors.muted]
  );

  const localTextStyle = useMemo(
    () => [
      props.headerBtnTextStyle,
      { marginLeft: 0 },
      localActive ? { color: theme.colors.text } : { color: theme.colors.muted }
    ],
    [props.headerBtnTextStyle, localActive, theme.colors.text, theme.colors.muted]
  );

  return (
    <View style={{ flexDirection: "row", gap: 10, alignItems: "center", justifyContent: "space-between" }}>
      <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
        <View style={props.headerBtnStyle}>
          <Ionicons name="mail-outline" size={16} color={theme.colors.text} />
          <Text style={props.headerBtnTextStyle} onPress={props.onFeedbackPress}>
            {props.t.feedback}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
        <AnimatedPressable onPress={() => setModeSafe("eur")} contentStyle={eurBtnStyle} scaleIn={0.98}>
          <Ionicons name="logo-euro" size={14} color={eurActive ? theme.colors.text : theme.colors.muted} />
          <Text style={eurTextStyle}>EUR</Text>
        </AnimatedPressable>

        <AnimatedPressable
          onPress={() => setModeSafe("local")}
          disabled={!props.canLocal}
          contentStyle={localBtnStyle}
          scaleIn={0.98}
        >
          <Ionicons name="cash-outline" size={14} color={localActive ? theme.colors.text : theme.colors.muted} />
          <Text style={localTextStyle} numberOfLines={1}>
            {props.currencyLocalCode}
          </Text>
        </AnimatedPressable>
      </View>
    </View>
  );
}