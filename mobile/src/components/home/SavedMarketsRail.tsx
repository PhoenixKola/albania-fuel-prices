import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { Theme } from "../../theme/theme";
import type { TDict } from "../../i18n";
import { toneOf } from "../../hooks/useHomeMarket";
import { getFlagForCountry } from "../../utils/countryFlag";
import AnimatedPressable from "../ui/AnimatedPressable";
import { homePalette, type HomePalette } from "./homePalette";

type Market = { country: string; price: number | null; deltaEur: number | null };

type Props = {
  theme: Theme;
  t: TDict;
  markets: Market[];
  current: string;
  format: (eur: number | null) => string;
  onSelect: (country: string) => void;
  onAdd: () => void;
};

export default function SavedMarketsRail({ theme, t, markets, current, format, onSelect, onAdd }: Props) {
  const p = useMemo(() => homePalette(theme), [theme]);
  const s = useMemo(() => makeStyles(theme, p), [theme, p]);

  if (!markets.length) {
    return (
      <AnimatedPressable onPress={onAdd} contentStyle={s.empty} reduceMotion={theme.motion.reduced} accessibilityLabel={`${t.savedMarketsEmpty}. ${t.addMarket}`}>
        <Ionicons name="star-outline" size={18} color={p.accent} />
        <Text style={s.emptyText} maxFontSizeMultiplier={1.4}>{t.savedMarketsEmpty}</Text>
        <Ionicons name="add" size={20} color={p.inkSoft} />
      </AnimatedPressable>
    );
  }

  return (
    <View>
      <Text style={s.kicker} accessibilityRole="header" maxFontSizeMultiplier={1.4}>{t.savedMarkets}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.bleed} contentContainerStyle={s.rail}>
        {markets.map((m) => {
          const active = m.country === current;
          const tone = toneOf(m.deltaEur);
          const arrow = tone === "neutral" ? "remove" : tone === "good" ? "arrow-down" : "arrow-up";
          const arrowColor = tone === "good" ? p.good : tone === "bad" ? p.bad : p.inkFaint;
          return (
            <AnimatedPressable
              key={m.country}
              onPress={() => onSelect(m.country)}
              contentStyle={[s.chip, active ? s.chipActive : null]}
              scaleIn={0.96}
              reduceMotion={theme.motion.reduced}
              accessibilityLabel={`${m.country}, ${m.price == null ? t.notReported : format(m.price)}`}
              accessibilityState={{ selected: active }}
            >
              <View style={s.chipTop}>
                <Text style={s.chipFlag}>{getFlagForCountry(m.country) || "•"}</Text>
                <Text style={s.chipName} numberOfLines={1} maxFontSizeMultiplier={1.3}>{m.country}</Text>
              </View>
              <View style={s.chipBottom}>
                <Text style={s.chipPrice} numberOfLines={1} maxFontSizeMultiplier={1.3}>
                  {m.price == null ? "—" : format(m.price)}
                </Text>
                {m.price == null ? null : <Ionicons name={arrow} size={13} color={arrowColor} />}
              </View>
            </AnimatedPressable>
          );
        })}
        <AnimatedPressable onPress={onAdd} contentStyle={s.add} scaleIn={0.94} reduceMotion={theme.motion.reduced} accessibilityLabel={t.addMarket}>
          <Ionicons name="add" size={22} color={p.inkSoft} />
        </AnimatedPressable>
      </ScrollView>
    </View>
  );
}

const makeStyles = (theme: Theme, p: HomePalette) =>
  StyleSheet.create({
    kicker: {
      color: p.inkSoft,
      fontSize: theme.m.f(11),
      fontWeight: "900",
      letterSpacing: 1.4,
      textTransform: "uppercase",
      marginBottom: 8,
      marginLeft: 2,
    },
    // The rail runs to the screen edges so a partly visible chip signals it scrolls.
    bleed: { marginHorizontal: -theme.m.gutter },
    rail: { gap: 8, paddingHorizontal: theme.m.gutter },
    chip: {
      minWidth: 112,
      maxWidth: 164,
      minHeight: 60,
      justifyContent: "center",
      gap: 4,
      paddingHorizontal: 12,
      paddingVertical: 9,
      borderRadius: 16,
      backgroundColor: p.chip,
      borderWidth: 1,
      borderColor: p.chipBorder,
    },
    chipActive: { borderColor: p.accent, borderWidth: 1.5, backgroundColor: p.accentSoft },
    chipTop: { flexDirection: "row", alignItems: "center", gap: 6 },
    chipFlag: { fontSize: 15, color: p.inkSoft },
    chipName: { flexShrink: 1, color: p.inkSoft, fontSize: theme.m.f(12), fontWeight: "800" },
    chipBottom: { flexDirection: "row", alignItems: "center", gap: 5 },
    chipPrice: { color: p.ink, fontSize: theme.m.f(16), fontWeight: "900", fontVariant: ["tabular-nums"] },
    add: {
      width: 52,
      minHeight: 60,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 16,
      borderWidth: 1,
      borderStyle: "dashed",
      borderColor: p.lane,
    },
    empty: {
      minHeight: 52,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingHorizontal: 14,
      borderRadius: 16,
      borderWidth: 1,
      borderStyle: "dashed",
      borderColor: p.lane,
    },
    emptyText: { flex: 1, color: p.inkSoft, fontSize: theme.m.f(14), fontWeight: "700" },
  });
