import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { Theme } from "../../theme/theme";
import type { TDict } from "../../i18n";
import type { PriceAlertRule } from "../../hooks/usePriceAlerts";
import BottomSheet from "../ui/BottomSheet";
import AnimatedPressable from "../ui/AnimatedPressable";
import { hapticSelect, hapticSuccess } from "../../utils/haptics";

type Direction = "below" | "above";

type Props = {
  theme: Theme;
  t: TDict;
  open: boolean;
  subtitle: string;
  currentEur: number | null;
  rule: PriceAlertRule | null;
  onSave: (direction: Direction, targetEur: number) => void;
  onRemove: () => void;
  onClose: () => void;
};

export default function PriceAlertSheet({ theme, t, open, subtitle, currentEur, rule, onSave, onRemove, onClose }: Props) {
  const s = useMemo(() => makeStyles(theme), [theme]);
  const [direction, setDirection] = useState<Direction>("below");
  const [target, setTarget] = useState("");
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    if (!open) return;
    setDirection(rule?.direction ?? "below");
    setTarget((rule?.targetEur ?? currentEur ?? 0).toFixed(3));
    setInvalid(false);
  }, [open, rule, currentEur]);

  const save = () => {
    const value = Number(target.replace(",", "."));
    if (!Number.isFinite(value) || value <= 0) {
      setInvalid(true);
      return;
    }
    hapticSuccess();
    onSave(direction, value);
  };

  const footer = (
    <View style={s.actions}>
      {rule ? (
        <AnimatedPressable onPress={onRemove} style={s.actionItem} contentStyle={s.ghost} reduceMotion={theme.motion.reduced} accessibilityLabel={t.remove}>
          <Text style={s.ghostText} numberOfLines={1}>{t.remove}</Text>
        </AnimatedPressable>
      ) : null}
      <AnimatedPressable onPress={save} style={s.actionItem} contentStyle={s.primary} reduceMotion={theme.motion.reduced} accessibilityLabel={t.saveAlert}>
        <Ionicons name="notifications" size={17} color={onPrimary(theme)} />
        <Text style={s.primaryText} numberOfLines={1}>{t.saveAlert}</Text>
      </AnimatedPressable>
    </View>
  );

  return (
    <BottomSheet theme={theme} open={open} title={t.priceAlert} closeLabel={t.close} onClose={onClose} footer={footer} scroll={false} avoidKeyboard>
      <View style={s.body}>
        <Text style={s.subtitle}>{subtitle}</Text>

        <View style={s.segment} accessibilityRole="tablist">
          {(["below", "above"] as const).map((d) => {
            const active = d === direction;
            return (
              <AnimatedPressable
                key={d}
                onPress={() => {
                  hapticSelect();
                  setDirection(d);
                }}
                haptic={false}
                style={s.segmentItem}
                contentStyle={[s.segmentButton, active ? s.segmentActive : null]}
                reduceMotion={theme.motion.reduced}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                accessibilityLabel={d === "below" ? t.alertBelow : t.alertAbove}
              >
                <Ionicons name={d === "below" ? "arrow-down" : "arrow-up"} size={15} color={active ? onPrimary(theme) : theme.colors.muted} />
                <Text style={[s.segmentText, active ? s.segmentTextActive : null]}>{d === "below" ? t.alertBelow : t.alertAbove}</Text>
              </AnimatedPressable>
            );
          })}
        </View>

        <Text style={s.rule}>{direction === "below" ? t.alertRuleBelow : t.alertRuleAbove}</Text>

        <View>
          <Text style={s.inputLabel} nativeID="alertTargetLabel">{t.alertTargetLabel}</Text>
          <View style={[s.inputWrap, invalid ? s.inputInvalid : null]}>
            <Text style={s.currencyMark}>€</Text>
            <TextInput
              value={target}
              onChangeText={(v) => {
                setTarget(v);
                if (invalid) setInvalid(false);
              }}
              keyboardType="decimal-pad"
              returnKeyType="done"
              onSubmitEditing={save}
              selectTextOnFocus
              style={s.input}
              accessibilityLabel={t.alertTargetLabel}
              accessibilityLabelledBy="alertTargetLabel"
            />
            <Text style={s.unit}>/L</Text>
          </View>
          <Text style={[s.helper, invalid ? s.helperInvalid : null]}>
            {invalid ? t.alertInvalid : currentEur != null ? t.alertNow(`€${currentEur.toFixed(3)}/L`) : ""}
          </Text>
        </View>
      </View>
    </BottomSheet>
  );
}

/** White on the dark theme's light teal fails contrast, so dark mode uses ink. */
const onPrimary = (theme: Theme) => (theme.name === "dark" ? "#06201D" : theme.colors.primaryText);

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    body: { gap: theme.m.s(14), paddingBottom: theme.m.s(8) },
    subtitle: { color: theme.colors.muted, fontSize: theme.m.f(13), fontWeight: "700", marginTop: -8 },
    segment: {
      flexDirection: "row",
      gap: 6,
      padding: 4,
      borderRadius: 16,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    segmentItem: { flex: 1 },
    segmentButton: { minHeight: 44, flexDirection: "row", gap: 6, alignItems: "center", justifyContent: "center", borderRadius: 12 },
    segmentActive: { backgroundColor: theme.colors.primary },
    segmentText: { color: theme.colors.muted, fontSize: theme.m.f(14), fontWeight: "800" },
    segmentTextActive: { color: onPrimary(theme) },
    rule: { color: theme.colors.text, fontSize: theme.m.f(15), fontWeight: "700" },
    inputLabel: { color: theme.colors.muted, fontSize: theme.m.f(12), fontWeight: "800", marginBottom: 6 },
    inputWrap: {
      minHeight: 56,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 16,
      borderRadius: 16,
      backgroundColor: theme.colors.tile,
      borderWidth: 1.5,
      borderColor: theme.colors.border,
    },
    inputInvalid: { borderColor: theme.colors.danger },
    currencyMark: { color: theme.colors.muted, fontSize: theme.m.f(20), fontWeight: "800" },
    input: { flex: 1, color: theme.colors.text, fontSize: theme.m.f(24), fontWeight: "900", fontVariant: ["tabular-nums"], paddingVertical: 8 },
    unit: { color: theme.colors.muted, fontSize: theme.m.f(15), fontWeight: "800" },
    helper: { minHeight: 18, marginTop: 6, color: theme.colors.muted, fontSize: theme.m.f(12), fontWeight: "700" },
    helperInvalid: { color: theme.colors.danger },
    actions: { flexDirection: "row", gap: 10 },
    actionItem: { flex: 1 },
    ghost: {
      minHeight: 50,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 16,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    ghostText: { color: theme.colors.text, fontSize: theme.m.f(14), fontWeight: "800" },
    primary: { minHeight: 50, flexDirection: "row", gap: 8, alignItems: "center", justifyContent: "center", borderRadius: 16, backgroundColor: theme.colors.primary },
    primaryText: { color: onPrimary(theme), fontSize: theme.m.f(14), fontWeight: "900" },
  });
