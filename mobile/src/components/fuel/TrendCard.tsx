import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { Theme } from "../../theme/theme";
import type { TDict } from "../../i18n";
import type { FuelType } from "../../types/fuel";
import type { Trends } from "../../hooks/useTrends";
import { getTrendSeries, getWeeklyDeltaEur } from "../../hooks/useTrends";
import { fuelLabel } from "../../utils/fuel";

const MAX_BARS = 15;

type Props = {
  theme: Theme;
  t: TDict;
  trends: Trends | null;
  country: string;
  fuelType: FuelType;
};

/**
 * 30-day price trend as a mini bar chart. Built from plain Views so it needs
 * no native chart/SVG dependency and stays OTA-update safe.
 */
export default function TrendCard({ theme, t, trends, country, fuelType }: Props) {
  const s = useMemo(() => makeStyles(theme), [theme]);

  const model = useMemo(() => {
    const series = getTrendSeries(trends, country, fuelType);
    if (!series || !trends) return null;

    const points = series
      .map((v, i) => ({ v, date: trends.dates[i] }))
      .filter((p): p is { v: number; date: string } => typeof p.v === "number" && Number.isFinite(p.v));
    if (points.length < 2) return null;

    const sampled = points.slice(-MAX_BARS);
    const min = Math.min(...sampled.map((p) => p.v));
    const max = Math.max(...sampled.map((p) => p.v));
    const span = max - min || max * 0.02 || 1;

    return {
      bars: sampled.map((p) => ({
        date: p.date,
        // 0.25..1 so even the cheapest day stays visible
        h: 0.25 + 0.75 * ((p.v - min) / span),
      })),
      min,
      max,
      last: sampled[sampled.length - 1].v,
      lastDate: sampled[sampled.length - 1].date,
    };
  }, [trends, country, fuelType]);

  if (!model) return null;

  const weeklyDelta = getWeeklyDeltaEur(trends, country, fuelType);
  const flat = weeklyDelta == null || Math.abs(weeklyDelta) < 0.0005;
  const down = !flat && (weeklyDelta as number) < 0;

  const deltaText = flat
    ? t.trendStableWeek
    : `${down ? "−" : "+"}${Math.abs(weeklyDelta as number).toFixed(3)} EUR/L ${t.trendVsLastWeek}`;
  const deltaColor = flat ? theme.colors.muted : down ? (theme.name === "light" ? "#0F766E" : "#2DD4BF") : theme.name === "light" ? "#B45309" : "#FBBF24";

  return (
    <View style={s.card}>
      <View style={s.headerRow}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={s.kicker}>{fuelLabel(fuelType, t)}</Text>
          <Text style={s.title}>{t.trendCardTitle}</Text>
        </View>
        <View style={s.deltaPill}>
          <Ionicons
            name={flat ? "remove-outline" : down ? "trending-down-outline" : "trending-up-outline"}
            size={14}
            color={deltaColor}
          />
          <Text style={[s.deltaText, { color: deltaColor }]} numberOfLines={1}>
            {deltaText}
          </Text>
        </View>
      </View>

      <View style={s.chartRow}>
        {model.bars.map((bar, i) => {
          const isLast = i === model.bars.length - 1;
          return (
            <View key={`${bar.date}-${i}`} style={s.barSlot}>
              <View
                style={[
                  s.bar,
                  { height: `${Math.round(bar.h * 100)}%` },
                  isLast ? s.barActive : null,
                ]}
              />
            </View>
          );
        })}
      </View>

      <View style={s.footerRow}>
        <Text style={s.footerText}>
          {t.trendLow}: {model.min.toFixed(3)}
        </Text>
        <Text style={[s.footerText, s.footerCurrent]}>
          {model.last.toFixed(3)} EUR/L
        </Text>
        <Text style={s.footerText}>
          {t.trendHigh}: {model.max.toFixed(3)}
        </Text>
      </View>
    </View>
  );
}

const makeStyles = (theme: Theme) => {
  const light = theme.name === "light";

  return StyleSheet.create({
    card: {
      borderRadius: 26,
      padding: 17,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: light ? "#9AA7B7" : "#000",
      shadowOpacity: light ? 0.14 : 0.24,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 12 },
      elevation: 3,
      gap: 14
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 12
    },
    kicker: {
      color: light ? "#0F766E" : "#8DEDE1",
      fontSize: 11,
      fontWeight: "800",
      textTransform: "uppercase"
    },
    title: {
      marginTop: 4,
      color: theme.colors.text,
      fontSize: 17,
      lineHeight: 21,
      fontWeight: "800"
    },
    deltaPill: {
      maxWidth: "55%",
      minHeight: 30,
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingHorizontal: 10,
      borderRadius: 999,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    deltaText: {
      flexShrink: 1,
      fontSize: 11,
      fontWeight: "700"
    },
    chartRow: {
      height: 84,
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 4
    },
    barSlot: {
      flex: 1,
      height: "100%",
      justifyContent: "flex-end"
    },
    bar: {
      borderRadius: 4,
      backgroundColor: light ? "rgba(15, 118, 110, 0.28)" : "rgba(45, 212, 191, 0.30)"
    },
    barActive: {
      backgroundColor: light ? "#0F766E" : "#2DD4BF"
    },
    footerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10
    },
    footerText: {
      color: theme.colors.muted,
      fontSize: 11,
      fontWeight: "700"
    },
    footerCurrent: {
      color: theme.colors.text,
      fontSize: 13,
      fontWeight: "800"
    }
  });
};
