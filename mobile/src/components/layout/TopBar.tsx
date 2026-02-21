import React, { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import type { Theme } from "../../theme/theme";
import { makeTopBarStyles } from "./Topbar.styles";

export default function TopBar(props: {
  theme: Theme;
  title: string;
  subtitle: string;
  langPillLabel: string;
  onToggleLang: () => void;
  themePillLabel: string;
  onToggleTheme: () => void;
}) {
  const { theme } = props;
  const s = useMemo(() => makeTopBarStyles(theme), [theme]);

  return (
    <View style={s.header}>
      <View style={s.row}>
        <View style={s.titleWrap}>
          <Text style={s.h1}>{props.title}</Text>
          <Text style={s.sub}>{props.subtitle}</Text>
        </View>

        <View style={s.actions}>
          <Pressable onPress={props.onToggleTheme} style={s.pill}>
            <Text style={s.pillText}>{props.themePillLabel}</Text>
          </Pressable>

          <Pressable onPress={props.onToggleLang} style={s.pill}>
            <Text style={s.pillText}>{props.langPillLabel}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}