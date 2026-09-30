import React, { useMemo } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Theme } from "../../theme/theme";
import type { TDict } from "../../i18n";
import AnimatedPressable from "../ui/AnimatedPressable";
import Dialog, { makeDialogStyles } from "../ui/Dialog";

export default function RewardUnlockModal(props: {
  theme: Theme;
  t: TDict;
  open: boolean;
  minutes: number;
  loadingAd: boolean;
  onClose: () => void;
  onWatch: () => void;
  onContinue: () => void;
}) {
  const { theme, t } = props;
  const s = useMemo(() => makeDialogStyles(theme), [theme]);
  const benefits: Array<[React.ComponentProps<typeof Ionicons>["name"], string]> = [
    ["compass-outline", t.unlockStations],
    ["git-compare-outline", t.unlockCompare],
    ["podium-outline", t.unlockRankings],
  ];

  return (
    <Dialog theme={theme} open={props.open} title={t.unlockTitle(props.minutes)} icon="gift-outline" closeLabel={t.close} onClose={props.onClose}>
      <View style={s.body}>
        {benefits.map(([icon, text]) => (
          <View key={icon} style={s.line}>
            <View style={s.bullet} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              <Ionicons name={icon} size={16} color={theme.colors.linkText} />
            </View>
            <Text style={s.text}>{text}</Text>
          </View>
        ))}
      </View>

      <View style={s.actions}>
        <AnimatedPressable
          onPress={props.onWatch}
          disabled={props.loadingAd}
          contentStyle={[s.primaryBtn, props.loadingAd ? { opacity: 0.55 } : null]}
          reduceMotion={theme.motion.reduced}
          accessibilityLabel={t.watchVideo}
          accessibilityState={{ disabled: props.loadingAd, busy: props.loadingAd }}
        >
          {props.loadingAd ? <ActivityIndicator color={theme.colors.primaryText} /> : <Ionicons name="play-circle-outline" size={19} color={theme.colors.primaryText} />}
          <Text style={s.primaryText}>{t.watchVideo}</Text>
        </AnimatedPressable>

        <AnimatedPressable onPress={props.onContinue} contentStyle={s.secondaryBtn} reduceMotion={theme.motion.reduced} accessibilityLabel={t.continueWithout}>
          <Ionicons name="arrow-forward-outline" size={19} color={theme.colors.text} />
          <Text style={s.secondaryText}>{t.continueWithout}</Text>
        </AnimatedPressable>
      </View>
    </Dialog>
  );
}
