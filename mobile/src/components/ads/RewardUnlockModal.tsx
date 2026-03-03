import React, { useMemo } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Theme } from "../../theme/theme";
import AnimatedPressable from "../ui/AnimatedPressable";

export default function RewardUnlockModal(props: {
  theme: Theme;
  t: any;
  open: boolean;
  minutes: number;
  loadingAd: boolean;
  onClose: () => void;
  onWatch: () => void;
  onContinue: () => void;
}) {
  const t = props.theme;

  const s = useMemo(
    () => ({
      overlay: {
        position: "absolute" as const,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.55)",
        justifyContent: "center" as const,
        alignItems: "center" as const,
        padding: 18
      },
      card: {
        width: "100%" as const,
        maxWidth: 420,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: t.colors.border,
        backgroundColor: t.colors.card ?? t.colors.tile,
        padding: 14,
        gap: 12
      },
      titleRow: { flexDirection: "row" as const, alignItems: "center" as const, justifyContent: "space-between" as const },
      titleLeft: { flexDirection: "row" as const, alignItems: "center" as const, gap: 10 },
      title: { fontSize: 16, fontWeight: "900" as const, color: t.colors.text },
      closeBtn: {
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 12
      },
      body: { gap: 10 },
      line: { flexDirection: "row" as const, alignItems: "center" as const, gap: 10 },
      bullet: {
        width: 28,
        height: 28,
        borderRadius: 10,
        backgroundColor: t.colors.tile,
        borderWidth: 1,
        borderColor: t.colors.border,
        alignItems: "center" as const,
        justifyContent: "center" as const
      },
      text: { color: t.colors.muted, fontSize: 13, fontWeight: "700" as const, flex: 1 },
      actions: { gap: 10 },
      primaryBtn: {
        borderRadius: 14,
        paddingVertical: 12,
        paddingHorizontal: 12,
        flexDirection: "row" as const,
        alignItems: "center" as const,
        justifyContent: "center" as const,
        gap: 10,
        backgroundColor: t.colors.primary
      },
      primaryText: { color: t.colors.primaryText, fontSize: 14, fontWeight: "900" as const },
      secondaryBtn: {
        borderRadius: 14,
        paddingVertical: 12,
        paddingHorizontal: 12,
        flexDirection: "row" as const,
        alignItems: "center" as const,
        justifyContent: "center" as const,
        gap: 10,
        borderWidth: 1,
        borderColor: t.colors.border,
        backgroundColor: "transparent"
      },
      secondaryText: { color: t.colors.text, fontSize: 14, fontWeight: "900" as const }
    }),
    [t]
  );

  if (!props.open) return null;

  return (
    <View style={s.overlay}>
      <View style={s.card}>
        <View style={s.titleRow}>
          <View style={s.titleLeft}>
            <Ionicons name="gift-outline" size={18} color={t.colors.linkText} />
            <Text style={s.title}>{props.t.unlockTitle(props.minutes)}</Text>
          </View>

          <AnimatedPressable onPress={props.onClose} contentStyle={s.closeBtn} scaleIn={0.98}>
            <Ionicons name="close" size={18} color={t.colors.muted} />
          </AnimatedPressable>
        </View>

        <View style={s.body}>
          <View style={s.line}>
            <View style={s.bullet}>
              <Ionicons name="compass-outline" size={16} color={t.colors.linkText} />
            </View>
            <Text style={s.text}>{props.t.unlockStations}</Text>
          </View>

          <View style={s.line}>
            <View style={s.bullet}>
              <Ionicons name="git-compare-outline" size={16} color={t.colors.linkText} />
            </View>
            <Text style={s.text}>{props.t.unlockCompare}</Text>
          </View>
        </View>

        <View style={s.actions}>
          <AnimatedPressable onPress={props.onWatch} contentStyle={s.primaryBtn} scaleIn={0.98}>
            {props.loadingAd ? <ActivityIndicator color={t.colors.primaryText} /> : <Ionicons name="play-circle-outline" size={18} color={t.colors.primaryText} />}
            <Text style={s.primaryText}>{props.t.watchVideo}</Text>
          </AnimatedPressable>

          <AnimatedPressable onPress={props.onContinue} contentStyle={s.secondaryBtn} scaleIn={0.98}>
            <Ionicons name="arrow-forward-outline" size={18} color={t.colors.text} />
            <Text style={s.secondaryText}>{props.t.continueWithout}</Text>
          </AnimatedPressable>
        </View>
      </View>
    </View>
  );
}