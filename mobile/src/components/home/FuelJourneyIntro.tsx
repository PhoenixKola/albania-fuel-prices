import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, Text, View } from "react-native";
import Svg, { Circle, Line, Path, Polygon } from "react-native-svg";

import type { TDict } from "../../i18n";
import type { Theme } from "../../theme/theme";
import type { FuelType } from "../../types/fuel";
import { homePalette } from "./homePalette";
import { makeFuelJourneyStyles } from "./FuelJourneyIntro.styles";

let journeyPlayedThisSession = false;

type Props = {
  theme: Theme;
  t: TDict;
  country: string;
  flag: string;
  fuelType: FuelType;
  fuelName: string;
  priceText: string;
  loading: boolean;
};

export default function FuelJourneyIntro(props: Props) {
  const { theme, t } = props;
  const p = useMemo(() => homePalette(theme), [theme]);
  const s = useMemo(() => makeFuelJourneyStyles(theme, p), [theme, p]);
  const entry = useRef(new Animated.Value(1)).current;
  const selection = useRef(new Animated.Value(1)).current;
  const firstSelection = useRef(true);

  useEffect(() => {
    const canPlay = !journeyPlayedThisSession && !theme.motion.reduced && !theme.m.isLargeText;
    journeyPlayedThisSession = true;
    if (!canPlay) {
      entry.setValue(1);
      return;
    }
    entry.setValue(0);
    Animated.timing(entry, {
      toValue: 1,
      duration: 1120,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [entry, theme.m.isLargeText, theme.motion.reduced]);

  useEffect(() => {
    if (firstSelection.current) {
      firstSelection.current = false;
      return;
    }
    if (theme.motion.reduced) {
      selection.setValue(1);
      return;
    }
    selection.stopAnimation();
    selection.setValue(0);
    Animated.timing(selection, {
      toValue: 1,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [props.country, props.fuelType, selection, theme.motion.reduced]);

  const travel = Math.max(120, Math.min(theme.m.maxContentWidth, theme.m.width - theme.m.gutter * 2) * 0.43);
  const roadOpacity = entry.interpolate({ inputRange: [0, 0.26, 0.62], outputRange: [0, 0, 1], extrapolate: "clamp" });
  const markerOpacity = entry.interpolate({ inputRange: [0, 0.62, 0.86], outputRange: [0, 0, 1], extrapolate: "clamp" });
  const markerY = entry.interpolate({ inputRange: [0.62, 1], outputRange: [9, 0], extrapolate: "clamp" });
  const pulseOpacity = entry.interpolate({ inputRange: [0, 0.12, 0.72, 0.9], outputRange: [0, 1, 1, 0], extrapolate: "clamp" });
  const pulseX = entry.interpolate({ inputRange: [0.08, 0.72], outputRange: [0, travel], extrapolate: "clamp" });
  const channelScale = entry.interpolate({ inputRange: [0.08, 0.56], outputRange: [0.02, 1], extrapolate: "clamp" });
  const selectionOpacity = selection.interpolate({ inputRange: [0, 0.55, 1], outputRange: [0, 0.35, 1] });
  const selectionX = selection.interpolate({ inputRange: [0, 1], outputRange: [8, 0] });

  return (
    <View style={s.shell} accessible={false} importantForAccessibility="no-hide-descendants">
      <View style={s.header}>
        <View style={s.headerDot} />
        <Text style={s.kicker}>{t.journeyLiveRoute}</Text>
      </View>

      <Animated.View style={[s.drawing, { opacity: roadOpacity }]}>
        <Svg width="100%" height="100%" viewBox="0 0 1000 180" preserveAspectRatio="none">
          <Path d="M70 79 C210 75 292 93 414 101" fill="none" stroke={p.accent} strokeWidth="8" strokeLinecap="round" opacity={0.42} />
          <Polygon points="380,88 838,47 934,167 401,118" fill={p.journeyRoad} />
          <Path d="M405 103 C560 98 704 83 866 70" fill="none" stroke={p.journeyLane} strokeWidth="4" strokeDasharray="25 28" strokeLinecap="round" />
          <Line x1="394" y1="91" x2="838" y2="50" stroke={p.accent} strokeWidth="3" opacity={0.72} />
          <Line x1="406" y1="117" x2="927" y2="164" stroke={p.accent} strokeWidth="3" opacity={0.5} />
          <Circle cx="70" cy="79" r="8" fill={p.journeyAmber} stroke={p.journeySurface} strokeWidth="5" />
        </Svg>
      </Animated.View>

      <Animated.View style={[s.channelReveal, { transform: [{ scaleX: channelScale }] }]} />
      <Animated.View style={[s.pulse, { opacity: pulseOpacity, transform: [{ translateX: pulseX }] }]} />

      <Animated.View style={[s.markerEntry, { opacity: markerOpacity, transform: [{ translateY: markerY }] }]}>
        <Animated.View style={[s.marker, { opacity: selectionOpacity, transform: [{ translateX: selectionX }] }]}>
          <View style={s.markerTop}>
            <Text style={s.flag} maxFontSizeMultiplier={1.3}>{props.flag || "•"}</Text>
            <View style={{ flexShrink: 1 }}>
              <Text style={s.markerLabel}>{t.journeyYourMarket}</Text>
              <Text style={s.marketName} numberOfLines={theme.m.isLargeText ? undefined : 1}>{props.country}</Text>
            </View>
          </View>
          <View style={s.markerBottom}>
            <Text style={s.fuel}>{props.fuelName}</Text>
            <Text style={s.price} numberOfLines={theme.m.isLargeText ? undefined : 1}>
              {props.loading ? t.loading : props.priceText}
            </Text>
          </View>
        </Animated.View>
      </Animated.View>

      <Animated.View style={[s.handoff, { opacity: markerOpacity }]}>
        <View style={s.handoffCap} />
      </Animated.View>
    </View>
  );
}
