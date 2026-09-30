import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "../../context/AppContext";
import { ADS_ENABLED } from "../../constants/ads";
import AdBar from "../ads/AdBar";
import { makeBottomTabBarStyles, tabLabelLayout } from "./BottomTabBar.styles";

type IconName = React.ComponentProps<typeof Ionicons>["name"];
type TabRoute = BottomTabBarProps["state"]["routes"][number];

const TAB_ICONS: Record<string, { active: IconName; inactive: IconName }> = {
  Home: { active: "home", inactive: "home-outline" },
  Stations: { active: "navigate", inactive: "navigate-outline" },
  Compare: { active: "git-compare", inactive: "git-compare-outline" },
  Rankings: { active: "podium", inactive: "podium-outline" },
  Settings: { active: "settings", inactive: "settings-outline" },
};

export default function BottomTabBar({ state, navigation }: BottomTabBarProps) {
  const { theme, t, adUnitId } = useApp();
  const insets = useSafeAreaInsets();
  const showAdBar = ADS_ENABLED && !theme.m.isTablet;

  const tabLabels: Record<string, string> = {
    Home: t.tabHomeShort,
    Stations: t.stationsTitle,
    Compare: t.compareTitle,
    Rankings: t.rankingsTitle,
    Settings: t.settingsTitle,
  };
  // Screen readers always get the full name, whatever the bar can show.
  const a11yLabels: Record<string, string> = { ...tabLabels, Home: t.homeTitle };

  const layout = tabLabelLayout(theme, state.routes.map((r) => tabLabels[r.name] ?? r.name), state.index);
  const s = useMemo(() => makeBottomTabBarStyles(theme, layout.railWidth), [theme, layout.railWidth]);

  return (
    <View style={s.container}>
      {showAdBar ? <AdBar theme={theme} unitId={adUnitId} /> : null}
      {showAdBar ? <View style={s.adBuffer} pointerEvents="none" /> : null}
      <View style={[s.tabRow, { paddingBottom: Math.max(insets.bottom, 6) }]} accessibilityRole="tablist">
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const icons = TAB_ICONS[route.name] ?? { active: "ellipse", inactive: "ellipse-outline" };
          return (
            <TabBarButton
              key={route.key}
              route={route}
              focused={focused}
              iconName={focused ? icons.active : icons.inactive}
              label={tabLabels[route.name] ?? route.name}
              a11yLabel={a11yLabels[route.name] ?? route.name}
              showLabel={!layout.activeOnly || focused}
              labelScale={layout.labelScale}
              grow={layout.activeOnly && focused ? layout.activeGrow : undefined}
              color={focused ? theme.colors.primary : theme.colors.muted}
              navigation={navigation}
              styles={s}
              reducedMotion={theme.motion.reduced}
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
  a11yLabel: string;
  showLabel: boolean;
  labelScale: number;
  grow?: number;
  color: string;
  navigation: BottomTabBarProps["navigation"];
  styles: ReturnType<typeof makeBottomTabBarStyles>;
  reducedMotion: boolean;
}) {
  const progress = useRef(new Animated.Value(props.focused ? 1 : 0)).current;
  const s = props.styles;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: props.focused ? 1 : 0,
      duration: props.reducedMotion ? 0 : 230,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [props.focused, props.reducedMotion, progress]);

  const activeScale = progress.interpolate({ inputRange: [0, 1], outputRange: [0.86, 1] });
  const iconLift = progress.interpolate({ inputRange: [0, 1], outputRange: [0, -2] });
  const iconScale = progress.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });
  const labelLift = progress.interpolate({ inputRange: [0, 1], outputRange: [0, -1] });

  return (
    <Pressable
      style={[s.tab, props.grow != null ? { flexGrow: props.grow } : null]}
      onPress={() => {
        const event = props.navigation.emit({ type: "tabPress", target: props.route.key, canPreventDefault: true });
        if (!props.focused && !event.defaultPrevented) props.navigation.navigate(props.route.name);
      }}
      onLongPress={() => props.navigation.emit({ type: "tabLongPress", target: props.route.key })}
      accessibilityRole="tab"
      accessibilityState={{ selected: props.focused }}
      accessibilityLabel={props.a11yLabel}
    >
      <Animated.View pointerEvents="none" style={[s.tabActiveFill, { opacity: progress, transform: [{ scale: activeScale }] }]} />

      <Animated.View style={[s.iconBubble, { transform: [{ translateY: iconLift }, { scale: iconScale }] }]}>
        <Animated.View pointerEvents="none" style={[s.iconBubbleFill, { opacity: progress }]} />
        <Ionicons name={props.iconName} size={22} color={props.color} />
      </Animated.View>

      {props.showLabel ? (
        <Animated.Text
          style={[
            s.tabLabel,
            props.focused ? s.tabLabelActive : null,
            { color: props.color, opacity: progress.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }), transform: [{ translateY: labelLift }] },
          ]}
          numberOfLines={1}
          // Navigation chrome: capped so five tabs stay usable; each tab still exposes its full label to screen readers.
          maxFontSizeMultiplier={props.labelScale}
          importantForAccessibility="no"
        >
          {props.label}
        </Animated.Text>
      ) : null}
    </Pressable>
  );
}
