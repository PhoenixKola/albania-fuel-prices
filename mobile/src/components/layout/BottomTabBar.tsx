import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "../../context/AppContext";
import { ADS_ENABLED } from "../../constants/ads";
import AdBar from "../ads/AdBar";
import { makeBottomTabBarStyles } from "./BottomTabBar.styles";

type IconName = React.ComponentProps<typeof Ionicons>["name"];
type TabRoute = BottomTabBarProps["state"]["routes"][number];

const TAB_ICONS: Record<string, { active: IconName; inactive: IconName }> = {
  Home: { active: "home", inactive: "home-outline" },
  Stations: { active: "navigate", inactive: "navigate-outline" },
  Compare: { active: "git-compare", inactive: "git-compare-outline" },
  Settings: { active: "settings", inactive: "settings-outline" },
};

export default function BottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { theme, t, adUnitId } = useApp();
  const s = useMemo(() => makeBottomTabBarStyles(theme), [theme]);
  const insets = useSafeAreaInsets();
  const showAdBar = ADS_ENABLED;

  const tabLabels: Record<string, string> = {
    Home: t.homeTitle,
    Stations: t.stationsTitle,
    Compare: t.compareTitle,
    Settings: t.settingsTitle,
  };

  return (
    <View style={s.container}>
      {showAdBar ? <AdBar theme={theme} unitId={adUnitId} /> : null}
      <View style={[s.tabRow, { paddingBottom: Math.max(insets.bottom, 6) }]}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const icons = TAB_ICONS[route.name] ?? { active: "ellipse", inactive: "ellipse-outline" };
          const iconName = focused ? icons.active : icons.inactive;
          const label = tabLabels[route.name] ?? route.name;
          const color = focused ? theme.colors.primary : theme.colors.muted;

          return (
            <TabBarButton
              key={route.key}
              route={route}
              focused={focused}
              iconName={iconName}
              label={label}
              color={color}
              navigation={navigation}
              styles={s}
            />
          );
        })}
      </View>
    </View>
  );
}

function TabBarButton(props: {
  route: TabRoute;
  focused: boolean;
  iconName: IconName;
  label: string;
  color: string;
  navigation: BottomTabBarProps["navigation"];
  styles: ReturnType<typeof makeBottomTabBarStyles>;
}) {
  const progress = useRef(new Animated.Value(props.focused ? 1 : 0)).current;
  const s = props.styles;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: props.focused ? 1 : 0,
      duration: 230,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    }).start();
  }, [props.focused, progress]);

  const activeScale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.86, 1]
  });
  const iconLift = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -2]
  });
  const iconScale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08]
  });
  const labelLift = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -1]
  });

  return (
    <Pressable
      style={s.tab}
      onPress={() => {
        const event = props.navigation.emit({
          type: "tabPress",
          target: props.route.key,
          canPreventDefault: true
        });
        if (!props.focused && !event.defaultPrevented) {
          props.navigation.navigate(props.route.name);
        }
      }}
      accessibilityRole="button"
      accessibilityState={props.focused ? { selected: true } : {}}
      accessibilityLabel={props.label}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          s.tabActiveFill,
          {
            opacity: progress,
            transform: [{ scale: activeScale }]
          }
        ]}
      />

      <Animated.View
        style={[
          s.iconBubble,
          {
            transform: [{ translateY: iconLift }, { scale: iconScale }]
          }
        ]}
      >
        <Animated.View pointerEvents="none" style={[s.iconBubbleFill, { opacity: progress }]} />
        <Ionicons name={props.iconName} size={21} color={props.color} />
      </Animated.View>

      <Animated.Text
        style={[
          s.tabLabel,
          props.focused ? s.tabLabelActive : null,
          {
            color: props.color,
            opacity: progress.interpolate({ inputRange: [0, 1], outputRange: [0.74, 1] }),
            transform: [{ translateY: labelLift }]
          }
        ]}
        numberOfLines={1}
      >
        {props.label}
      </Animated.Text>
    </Pressable>
  );
}
