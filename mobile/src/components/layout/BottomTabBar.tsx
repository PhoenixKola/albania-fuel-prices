import React, { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "../../context/AppContext";
import AdBar from "../ads/AdBar";
import { makeBottomTabBarStyles } from "./BottomTabBar.styles";

const TAB_ICONS: Record<string, { active: any; inactive: any }> = {
  Home: { active: "home", inactive: "home-outline" },
  Stations: { active: "navigate", inactive: "navigate-outline" },
  Compare: { active: "git-compare", inactive: "git-compare-outline" },
  Settings: { active: "settings", inactive: "settings-outline" },
};

export default function BottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { theme, t, adUnitId } = useApp();
  const s = useMemo(() => makeBottomTabBarStyles(theme), [theme]);
  const insets = useSafeAreaInsets();

  const tabLabels: Record<string, string> = {
    Home: (t as any).homeTitle ?? "Home",
    Stations: (t as any).stationsTitle ?? "Stations",
    Compare: (t as any).compareTitle ?? "Compare",
    Settings: (t as any).settingsTitle ?? "Settings",
  };

  return (
    <View style={s.container}>
      <AdBar theme={theme} unitId={adUnitId} />
      <View style={[s.tabRow, { paddingBottom: Math.max(insets.bottom, 6) }]}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const icons = TAB_ICONS[route.name] ?? { active: "ellipse", inactive: "ellipse-outline" };
          const iconName = focused ? icons.active : icons.inactive;
          const label = tabLabels[route.name] ?? route.name;
          const color = focused ? theme.colors.primary : theme.colors.muted;

          return (
            <Pressable
              key={route.key}
              style={s.tab}
              onPress={() => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={label}
            >
              {focused ? <View style={[s.indicator, { backgroundColor: theme.colors.primary }]} /> : null}
              <Ionicons name={iconName} size={22} color={color} />
              <Text
                style={[s.tabLabel, { color }, focused ? s.tabLabelActive : null]}
                numberOfLines={1}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
