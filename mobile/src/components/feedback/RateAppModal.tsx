import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Theme } from "../../theme/theme";
import AnimatedPressable from "../ui/AnimatedPressable";

export default function RateAppModal(props: {
  theme: Theme;
  t: any;
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
        padding: 18
      },
      card: {
        width: "100%" as const,
        maxWidth: 420,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.card ?? theme.colors.tile,
        padding: 14,
        gap: 12
      },
      titleRow: { flexDirection: "row" as const, alignItems: "center" as const, justifyContent: "space-between" as const },
      titleLeft: { flexDirection: "row" as const, alignItems: "center" as const, gap: 10 },
      title: { fontSize: 16, fontWeight: "900" as const, color: theme.colors.text },
      closeBtn: { paddingVertical: 8, paddingHorizontal: 10, borderRadius: 12 },
      body: { gap: 10 },
      text: { color: theme.colors.muted, fontSize: 13, fontWeight: "700" as const },
      actions: { gap: 10, marginTop: 2 },
      primaryBtn: {
        borderRadius: 14,
        paddingVertical: 12,
        paddingHorizontal: 12,
        flexDirection: "row" as const,
        alignItems: "center" as const,
        justifyContent: "center" as const,
        gap: 10,
        backgroundColor: theme.colors.primary
      },
      primaryText: { color: theme.colors.primaryText, fontSize: 14, fontWeight: "900" as const },
      secondaryBtn: {
        borderRadius: 14,
        paddingVertical: 12,
        paddingHorizontal: 12,
        flexDirection: "row" as const,
        alignItems: "center" as const,
        justifyContent: "center" as const,
        gap: 10,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: "transparent"
      },
      secondaryText: { color: theme.colors.text, fontSize: 14, fontWeight: "900" as const }
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