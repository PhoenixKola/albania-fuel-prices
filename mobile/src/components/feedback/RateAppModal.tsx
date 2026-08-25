import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Theme } from "../../theme/theme";
import type { TDict } from "../../i18n";
import AnimatedPressable from "../ui/AnimatedPressable";

export default function RateAppModal(props: {
  theme: Theme;
  t: TDict;
  open: boolean;
  onClose: () => void;
  onRate: () => void;
  onLater: () => void;
}) {
  const theme = props.theme;

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
        padding: theme.m.s(18)
      },
      card: {
        width: "100%" as const,
        maxWidth: 420,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.card ?? theme.colors.tile,
        padding: theme.m.s(14),
        gap: theme.m.s(12)
      },
      titleRow: { flexDirection: "row" as const, alignItems: "center" as const, justifyContent: "space-between" as const },
      titleLeft: { flexDirection: "row" as const, alignItems: "center" as const, gap: theme.m.s(10) },
      title: { fontSize: theme.m.f(16), fontWeight: "900" as const, color: theme.colors.text },
      closeBtn: { paddingVertical: theme.m.s(8), paddingHorizontal: theme.m.s(10), borderRadius: 12 },
      body: { gap: theme.m.s(10) },
      text: { color: theme.colors.muted, fontSize: theme.m.f(13), fontWeight: "700" as const },
      actions: { gap: theme.m.s(10), marginTop: theme.m.s(2) },
      primaryBtn: {
        borderRadius: 14,
        paddingVertical: theme.m.s(12),
        paddingHorizontal: theme.m.s(12),
        flexDirection: "row" as const,
        alignItems: "center" as const,
        justifyContent: "center" as const,
        gap: theme.m.s(10),
        backgroundColor: theme.colors.primary
      },
      primaryText: { color: theme.colors.primaryText, fontSize: theme.m.f(14), fontWeight: "900" as const },
      secondaryBtn: {
        borderRadius: 14,
        paddingVertical: theme.m.s(12),
        paddingHorizontal: theme.m.s(12),
        flexDirection: "row" as const,
        alignItems: "center" as const,
        justifyContent: "center" as const,
        gap: theme.m.s(10),
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: "transparent"
      },
      secondaryText: { color: theme.colors.text, fontSize: theme.m.f(14), fontWeight: "900" as const }
    }),
    [theme]
  );

  if (!props.open) return null;

  return (
    <View style={s.overlay}>
      <View style={s.card}>
        <View style={s.titleRow}>
          <View style={s.titleLeft}>
            <Ionicons name="star-outline" size={18} color={theme.colors.linkText} />
            <Text style={s.title}>{props.t.rateTitle}</Text>
          </View>

          <AnimatedPressable onPress={props.onClose} contentStyle={s.closeBtn} scaleIn={0.98}>
            <Ionicons name="close" size={18} color={theme.colors.muted} />
          </AnimatedPressable>
        </View>

        <View style={s.body}>
          <Text style={s.text}>{props.t.rateBody}</Text>
        </View>

        <View style={s.actions}>
          <AnimatedPressable onPress={props.onRate} contentStyle={s.primaryBtn} scaleIn={0.98}>
            <Ionicons name="star" size={18} color={theme.colors.primaryText} />
            <Text style={s.primaryText}>{props.t.rateNow}</Text>
          </AnimatedPressable>

          <AnimatedPressable onPress={props.onLater} contentStyle={s.secondaryBtn} scaleIn={0.98}>
            <Ionicons name="time-outline" size={18} color={theme.colors.text} />
            <Text style={s.secondaryText}>{props.t.rateLater}</Text>
          </AnimatedPressable>
        </View>
      </View>
    </View>
  );
}