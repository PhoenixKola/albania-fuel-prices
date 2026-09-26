import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { Theme } from "../../theme/theme";
import type { TDict } from "../../i18n";
import type { FuelType } from "../../types/fuel";
import type { Freshness, Tone } from "../../hooks/useHomeMarket";
import { FUEL_ORDER } from "../../hooks/useHomeMarket";
import { fuelLabel } from "../../utils/fuel";
import { hapticSelect } from "../../utils/haptics";
import AnimatedPressable from "../ui/AnimatedPressable";
import PriceNumeral from "./PriceNumeral";
import { homePalette, isCompactHome, type HomePalette } from "./homePalette";

type Props = {
  theme: Theme;
  t: TDict;
  country: string;
  flag: string;
  isFavorite: boolean;
  fuelType: FuelType;
  prices: Record<FuelType, number | null>;
  /** Formatted price in the display currency. */
  format: (eur: number | null) => string;
  /** EUR prints the third decimal raised; local currencies don't carry it. */
  raisedDigit: boolean;
  diff: { text: string; tone: Tone } | null;
  week: { text: string; tone: Tone } | null;
  note: string | null;
  freshness: Freshness;
  refreshFailed: boolean;
  onRetry: () => void;
  onOpenCountry: () => void;
  onToggleFavorite: () => void;
  onSelectFuel: (fuel: FuelType) => void;
};

export default function FuelDeck(props: Props) {
  const { theme, t } = props;
  const p = useMemo(() => homePalette(theme), [theme]);
  const compact = isCompactHome(theme);
  const s = useMemo(() => makeStyles(theme, p, compact), [theme, p, compact]);
  const reduce = theme.motion.reduced;

  // Country switch: the board fades back in so the change registers.
  const fade = useRef(new Animated.Value(1)).current;
  const firstCountry = useRef(true);
  useEffect(() => {
    if (firstCountry.current) {
      firstCountry.current = false;
      return;
    }
    if (reduce) return;
    fade.setValue(0.25);
    Animated.timing(fade, { toValue: 1, duration: 220, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  }, [props.country, reduce, fade]);

  const selectedName = fuelLabel(props.fuelType, t);
  const current = props.prices[props.fuelType];
  const currentText = current == null ? "—" : props.format(current);
  const others = FUEL_ORDER.filter((f) => f !== props.fuelType);

  const toneColor = (tone: Tone) => (tone === "good" ? p.moduleGood : tone === "bad" ? p.moduleBad : p.moduleSoft);
  const toneIcon = (tone: Tone, kind: "diff" | "week") =>
    tone === "neutral" ? "remove" : kind === "diff" ? (tone === "bad" ? "caret-up" : "caret-down") : tone === "bad" ? "trending-up" : "trending-down";

  const moduleLabel = [
    `${selectedName}, ${props.country}`,
    current == null ? t.notReported : `${currentText} ${t.perLitre}`,
    props.diff?.text,
    props.week?.text,
  ]
    .filter(Boolean)
    .join(". ");

  const numeralSize = theme.m.isTablet ? 78 : compact ? 50 : theme.m.f(64);

  return (
    <Animated.View style={[s.deck, { opacity: fade }]}>
      <View style={s.header}>
        <Pressable
          onPress={props.onOpenCountry}
          style={({ pressed }) => [s.countryButton, pressed ? { backgroundColor: p.pressed } : null]}
          accessibilityRole="button"
          accessibilityLabel={t.changeCountryA11y(props.country)}
          hitSlop={4}
        >
          <Text style={s.flag} maxFontSizeMultiplier={1.2}>{props.flag || "•"}</Text>
          <Text style={s.countryName} numberOfLines={1} maxFontSizeMultiplier={1.3}>
            {props.country}
          </Text>
          <Ionicons name="chevron-down" size={16} color={p.inkSoft} />
        </Pressable>
        <AnimatedPressable
          onPress={props.onToggleFavorite}
          contentStyle={s.star}
          scaleIn={0.9}
          reduceMotion={reduce}
          accessibilityLabel={props.isFavorite ? t.unsaveMarketA11y(props.country) : t.saveMarketA11y(props.country)}
          accessibilityState={{ selected: props.isFavorite }}
        >
          <Ionicons name={props.isFavorite ? "star" : "star-outline"} size={20} color={props.isFavorite ? p.accent : p.inkSoft} />
        </AnimatedPressable>
      </View>

      <View style={s.module} accessible accessibilityLabel={moduleLabel}>
        <Text style={s.moduleFuel} numberOfLines={1} maxFontSizeMultiplier={1.3}>
          {selectedName}
        </Text>
        {current == null ? (
          // Same height as the numeral so switching to an unreported fuel doesn't move the board.
          <View style={{ height: Math.round(numeralSize * 1.08), justifyContent: "center" }}>
            <Text style={s.missing} maxFontSizeMultiplier={1.3}>{t.notReported}</Text>
          </View>
        ) : (
          <PriceNumeral
            text={currentText}
            raised={props.raisedDigit}
            size={numeralSize}
            color={p.moduleText}
            unit="/L"
            unitColor={p.moduleSoft}
            reduceMotion={reduce}
          />
        )}
        <View style={s.signals}>
          {props.diff ? (
            <View style={s.signalRow}>
              <Ionicons name={toneIcon(props.diff.tone, "diff")} size={14} color={toneColor(props.diff.tone)} />
              <Text style={[s.signalText, { color: toneColor(props.diff.tone) }]} maxFontSizeMultiplier={1.4}>
                {props.diff.text}
              </Text>
            </View>
          ) : null}
          {props.week ? (
            <View style={s.signalRow}>
              <Ionicons name={toneIcon(props.week.tone, "week")} size={14} color={p.moduleSoft} />
              <Text style={s.signalText} maxFontSizeMultiplier={1.4}>
                {props.week.text}
              </Text>
            </View>
          ) : null}
          {props.note ? (
            <Text style={[s.signalText, s.signalNote]} maxFontSizeMultiplier={1.4}>{props.note}</Text>
          ) : null}
        </View>
      </View>

      {others.map((fuel, index) => {
        const price = props.prices[fuel];
        const name = fuelLabel(fuel, t);
        const text = price == null ? t.notReported : props.format(price);
        return (
          <View key={fuel}>
            {index > 0 ? <LaneMarking color={p.lane} /> : <View style={s.moduleGap} />}
            <Pressable
              onPress={() => {
                hapticSelect();
                props.onSelectFuel(fuel);
              }}
              style={({ pressed }) => [s.row, pressed ? { backgroundColor: p.pressed } : null]}
              accessibilityRole="button"
              accessibilityState={{ selected: false }}
              accessibilityLabel={`${name}, ${price == null ? t.notReported : `${text} ${t.perLitre}`}`}
            >
              <Text style={s.rowFuel} numberOfLines={1} maxFontSizeMultiplier={1.4}>
                {name}
              </Text>
              {price == null ? (
                <Text style={s.rowMissing} maxFontSizeMultiplier={1.4}>{text}</Text>
              ) : (
                <PriceNumeral text={text} raised={props.raisedDigit} size={compact ? 20 : theme.m.f(23)} color={p.ink} reduceMotion={reduce} maxFontSizeMultiplier={1.4} />
              )}
            </Pressable>
          </View>
        );
      })}

      <FreshnessStamp t={t} p={p} s={s} freshness={props.freshness} refreshFailed={props.refreshFailed} onRetry={props.onRetry} />
    </Animated.View>
  );
}

function FreshnessStamp(props: {
  t: TDict;
  p: HomePalette;
  s: ReturnType<typeof makeStyles>;
  freshness: Freshness;
  refreshFailed: boolean;
  onRetry: () => void;
}) {
  const { t, p, s, freshness: f } = props;
  let dot = p.inkFaint;
  let label = t.loadingPrices;
  if (f.kind === "fresh") {
    dot = f.stale ? p.warn : p.accent;
    label = `${t.pricesOf(f.asOf)} · ${f.stale ? t.freshStale : t.freshSynced}`;
  } else if (f.kind === "offline") {
    dot = f.checking ? p.inkFaint : p.warn;
    label = `${t.pricesOf(f.asOf)} · ${f.checking ? t.freshChecking : f.savedAt ? t.offlineCopy(f.savedAt) : t.showingCached}`;
  }

  return (
    <View style={s.stamp}>
      <View style={s.stampLine}>
        <View style={[s.dot, { backgroundColor: dot }]} />
        <Text style={s.stampText} maxFontSizeMultiplier={1.4}>{label}</Text>
      </View>
      {props.refreshFailed ? (
        <View style={s.stampLine}>
          <Ionicons name="cloud-offline-outline" size={13} color={p.warn} />
          <Text style={s.stampText} maxFontSizeMultiplier={1.4}>{t.refreshFailed}</Text>
          <Pressable onPress={props.onRetry} accessibilityRole="button" accessibilityLabel={t.tryAgain} hitSlop={10}>
            <Text style={s.retry} maxFontSizeMultiplier={1.4}>{t.tryAgain}</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

/** Dashed lane marking. Built from Views: single-side dashed borders render unreliably on Android. */
function LaneMarking({ color }: { color: string }) {
  return (
    <View style={laneStyles.wrap} pointerEvents="none">
      {Array.from({ length: 36 }, (_, i) => (
        <View key={i} style={[laneStyles.dash, { backgroundColor: color }]} />
      ))}
    </View>
  );
}

const laneStyles = StyleSheet.create({
  wrap: { flexDirection: "row", overflow: "hidden", gap: 6, height: 1.5, marginHorizontal: 14 },
  dash: { width: 12, height: 1.5, borderRadius: 1 },
});

/** Static placeholder while the very first dataset loads. No shimmer loop. */
export function FuelDeckSkeleton({ theme, label }: { theme: Theme; label: string }) {
  const p = homePalette(theme);
  const s = makeStyles(theme, p, isCompactHome(theme));
  return (
    <View style={s.deck} accessible accessibilityLabel={label}>
      <View style={s.header}>
        <View style={[s.skeletonBar, { width: 140, backgroundColor: p.rule }]} />
      </View>
      <View style={[s.module, { minHeight: 150, justifyContent: "center" }]}>
        <View style={[s.skeletonBar, { width: "60%", height: 44, backgroundColor: p.moduleRule }]} />
      </View>
      <View style={s.stamp}>
        <Text style={s.stampText}>{label}</Text>
      </View>
    </View>
  );
}

const makeStyles = (theme: Theme, p: HomePalette, compact: boolean) =>
  StyleSheet.create({
    deck: {
      borderRadius: 24,
      backgroundColor: p.deck,
      borderWidth: theme.name === "light" ? 1.5 : 1,
      borderColor: p.deckBorder,
      padding: compact ? 6 : 8,
      shadowColor: "#102033",
      shadowOpacity: p.shadow,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 8 },
      elevation: theme.name === "light" ? 2 : 0,
    },
    header: {
      minHeight: compact ? 44 : 50,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingLeft: 4,
      gap: 8,
    },
    countryButton: {
      flexShrink: 1,
      minHeight: 44,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 8,
      borderRadius: 14,
    },
    flag: { fontSize: compact ? 20 : 22, color: p.ink },
    moduleGap: { height: 4 },
    countryName: {
      flexShrink: 1,
      color: p.ink,
      fontSize: theme.m.f(compact ? 16 : 18),
      fontWeight: "900",
      letterSpacing: -0.2,
    },
    star: { width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: 14 },
    module: {
      borderRadius: 18,
      backgroundColor: p.module,
      paddingHorizontal: compact ? 14 : 18,
      paddingTop: compact ? 10 : 14,
      paddingBottom: compact ? 12 : 16,
      borderLeftWidth: theme.name === "dark" ? 3 : 0,
      borderLeftColor: p.accent,
    },
    moduleFuel: {
      color: p.moduleSoft,
      fontSize: theme.m.f(12),
      fontWeight: "900",
      letterSpacing: 1.6,
      textTransform: "uppercase",
      marginBottom: compact ? 2 : 4,
    },
    // Two lines reserved so a fuel without a weekly figure doesn't shrink the board.
    signals: { marginTop: compact ? 6 : 8, gap: 4, minHeight: theme.m.f(19) * 2 + 4 },
    signalRow: { flexDirection: "row", alignItems: "center", gap: 6 },
    signalText: { flexShrink: 1, color: p.moduleSoft, fontSize: theme.m.f(13), lineHeight: theme.m.f(19), fontWeight: "700" },
    missing: { color: p.moduleSoft, fontSize: theme.m.f(compact ? 22 : 26), fontWeight: "900", letterSpacing: -0.3 },
    signalNote: { fontSize: theme.m.f(12), fontWeight: "600" },
    row: {
      minHeight: compact ? 46 : 52,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      paddingHorizontal: 14,
      borderRadius: 12,
    },
    rowFuel: {
      flexShrink: 1,
      color: p.inkSoft,
      fontSize: theme.m.f(12),
      fontWeight: "900",
      letterSpacing: 1.4,
      textTransform: "uppercase",
    },
    rowMissing: { color: p.inkFaint, fontSize: theme.m.f(13), fontWeight: "700" },
    stamp: {
      gap: 4,
      paddingHorizontal: 14,
      paddingTop: 8,
      paddingBottom: compact ? 6 : 8,
      borderTopWidth: 1,
      borderTopColor: p.rule,
      marginTop: 2,
    },
    stampLine: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
    dot: { width: 7, height: 7, borderRadius: 4 },
    stampText: { flexShrink: 1, color: p.inkSoft, fontSize: theme.m.f(12), fontWeight: "700" },
    retry: { color: p.accent, fontSize: theme.m.f(12), fontWeight: "900", textDecorationLine: "underline" },
    skeletonBar: { height: 18, borderRadius: 8 },
  });
