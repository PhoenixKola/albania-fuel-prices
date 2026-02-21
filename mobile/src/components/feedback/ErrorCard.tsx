import React, { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import type { Theme } from "../../theme/theme";
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
      <Text style={s.title}>{props.title}</Text>
      <Text style={s.msg}>{props.message}</Text>
      <Pressable onPress={props.onPress} style={s.btn}>
        <Text style={s.btnText}>{props.cta}</Text>
      </Pressable>
    </View>
  );
}