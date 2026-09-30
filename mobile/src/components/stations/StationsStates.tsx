import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AnimatedPressable from "../ui/AnimatedPressable";
import type { StationStyles, StationsPalette } from "./stations.styles";

type IconName = React.ComponentProps<typeof Ionicons>["name"];
type Action = { label: string; onPress: () => void; icon?: IconName; loading?: boolean };

export function StationsState(props: {
  s: StationStyles;
  p: StationsPalette;
  reduceMotion: boolean;
  icon: IconName;
  title: string;
  body?: string;
  primary?: Action;
  secondary?: Action;
}) {
  const { s, p } = props;
  return (
    <View style={s.state}>
      <View style={s.stateIcon} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <Ionicons name={props.icon} size={26} color={p.accent} />
      </View>
      <Text style={s.stateTitle} accessibilityRole="header">{props.title}</Text>
      {props.body ? <Text style={s.stateBody}>{props.body}</Text> : null}
      {props.primary || props.secondary ? (
        <View style={s.stateActions}>
          {props.primary ? (
            <AnimatedPressable
              onPress={props.primary.onPress}
              disabled={props.primary.loading}
              contentStyle={s.primaryButton}
              reduceMotion={props.reduceMotion}
              accessibilityLabel={props.primary.label}
              accessibilityState={{ busy: !!props.primary.loading }}
            >
              {props.primary.loading ? (
                <ActivityIndicator color={p.onAccent} />
              ) : props.primary.icon ? (
                <Ionicons name={props.primary.icon} size={19} color={p.onAccent} />
              ) : null}
              <Text style={s.primaryText}>{props.primary.label}</Text>
            </AnimatedPressable>
          ) : null}
          {props.secondary ? (
            <AnimatedPressable
              onPress={props.secondary.onPress}
              contentStyle={s.secondaryButton}
              reduceMotion={props.reduceMotion}
              accessibilityLabel={props.secondary.label}
            >
              {props.secondary.icon ? <Ionicons name={props.secondary.icon} size={19} color={p.ink} /> : null}
              <Text style={s.secondaryText}>{props.secondary.label}</Text>
            </AnimatedPressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

/** Static placeholder shaped like the loaded screen, announced once as a single status. */
export function StationsSkeleton({ s, label }: { s: StationStyles; label: string }) {
  return (
    <View accessible accessibilityRole="progressbar" accessibilityLabel={label} style={{ gap: 14 }}>
      <View style={s.deck}>
        <View style={[s.module, s.skeletonModule]}>
          <View style={[s.skeletonBar, { width: "38%" }]} />
          <View style={[s.skeletonBar, { width: "72%", height: 22 }]} />
          <View style={[s.skeletonBar, { width: "30%", height: 40 }]} />
        </View>
        <View style={[s.skeletonRowBar, { height: 52, borderRadius: 16 }]} />
      </View>
      {[80, 62, 72].map((w) => (
        <View key={w} style={s.skeletonRow}>
          <View style={[s.skeletonRowBar, { width: `${w}%` as const }]} />
          <View style={[s.skeletonRowBar, { width: `${Math.round(w * 0.55)}%` as const }]} />
        </View>
      ))}
      <Text style={s.statusText}>{label}</Text>
    </View>
  );
}
