import React, { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Theme } from "../../theme/theme";
import AnimatedPressable from "../ui/AnimatedPressable";
import { makeQuickSwitchStyles } from "./QuickSwitchCard.styles";

export default function QuickSwitchCard(props: {
  theme: Theme;
  t: any;
  favorites: string[];
  currentCountry: string;
  onEdit: () => void;
  onSelect: (country: string) => void;
}) {
  const s = useMemo(() => makeQuickSwitchStyles(props.theme), [props.theme]);
  const hasFavs = props.favorites.length > 0;

  return (
    <View style={s.card}>
      <View style={s.header}>
        <View style={s.headerLeft}>
          <View style={s.iconWrap}>
            <Ionicons
              name={hasFavs ? "flash-outline" : "star-outline"}
              size={18}
              color={props.theme.colors.linkText}
            />
          </View>

          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={s.title} numberOfLines={1}>
              {props.t.quickSwitch}
            </Text>
            <Text style={s.sub} numberOfLines={2}>
              {hasFavs ? props.t.tapToSwitch ?? "" : props.t.quickSwitchEmpty ?? ""}
            </Text>
          </View>
        </View>

        <AnimatedPressable
          onPress={props.onEdit}
          contentStyle={hasFavs ? s.editBtn : s.primaryBtn}
          scaleIn={0.98}
        >
          <Ionicons
            name={hasFavs ? "create-outline" : "add"}
            size={16}
            color={hasFavs ? props.theme.colors.text : props.theme.colors.primaryText}
          />
          <Text style={hasFavs ? s.editBtnText : s.primaryBtnText}>{props.t.edit}</Text>
        </AnimatedPressable>
      </View>

      {hasFavs ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.row}>
          {props.favorites.map((c) => {
            const active = c === props.currentCountry;
            return (
              <AnimatedPressable
                key={c}
                onPress={() => props.onSelect(c)}
                contentStyle={[s.pill, active ? s.pillActive : null]}
                scaleIn={0.97}
              >
                <Ionicons
                  name={active ? "checkmark-circle" : "star-outline"}
                  size={16}
                  color={active ? props.theme.colors.text : props.theme.colors.muted}
                  style={{ marginRight: 8 }}
                />
                <Text style={[s.pillText, active ? s.pillTextActive : null]} numberOfLines={1}>
                  {c}
                </Text>
              </AnimatedPressable>
            );
          })}
        </ScrollView>
      ) : null}
    </View>
  );
}