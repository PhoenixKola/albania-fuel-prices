import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Theme } from "../../theme/theme";
import { makeTopBarStyles } from "./Topbar.styles";

export default function TopBar(props: {
  theme: Theme;
  title: string;
  subtitle: string;
}) {
  const { theme } = props;
  const s = useMemo(() => makeTopBarStyles(theme), [theme]);

  return (
    <View style={s.header}>
      <View style={s.row}>
        <View style={s.brand}>
          <View style={s.brandIcon}>
            <Ionicons name="flame-outline" size={18} color={theme.colors.primary} />
          </View>

          <View style={s.titleWrap}>
            <Text style={s.h1}>
              {props.title}
            </Text>
            <Text style={s.sub} numberOfLines={2}>
              {props.subtitle}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}