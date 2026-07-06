import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

import type { Theme } from "../../theme/theme";
import type { FuelType } from "../../types/fuel";
import type { Trends } from "../../hooks/useTrends";
import { getTrendSeries } from "../../hooks/useTrends";
import { fuelLabel } from "../../utils/fuel";
import type { TDict } from "../../i18n";

type Props = {
  theme: Theme;
  t: TDict;
  trends: Trends | null;
  countries: string[];
  fuelType: FuelType;
};

const COLORS = ["#0F766E", "#38BDF8", "#F59E0B", "#A78BFA", "#FB7185"];
const MAX_POINTS = 15;
const W = 320;
const H = 104;

export default function CompareTrendCard({ theme, t, trends, countries, fuelType }: Props) {
  const s = useMemo(() => makeStyles(theme), [theme]);

  const model = useMemo(() => {
    if (!trends || countries.length < 2) return null;

    const rows = countries
      .map((country, idx) => {
        const series = getTrendSeries(trends, country, fuelType)
          ?.filter((v): v is number => typeof v === "number" && Number.isFinite(v))
          .slice(-MAX_POINTS);
        if (!series || series.length < 2) return null;
        return { country, series, color: COLORS[idx % COLORS.length] };
      })
      .filter((row): row is { country: string; series: number[]; color: string } => !!row);

    if (rows.length < 2) return null;

    const all = rows.flatMap((row) => row.series);
    const min = Math.min(...all);
    const max = Math.max(...all);
    const span = max - min || 1;

    return {
      min,
      max,
      rows: rows.map((row) => ({
        ...row,
        points: row.series.map((value, i) => ({
          x: (i / Math.max(1, row.series.length - 1)) * W,
          y: H - (0.1 + 0.85 * ((value - min) / span)) * H,
        })),
        last: row.series[row.series.length - 1],
      })),
    };
  }, [trends, countries, fuelType]);

  if (!model) return null;

  return (
    <View style={s.card}>
      <View style={s.headerRow}>
        <View>
          <Text style={s.kicker}>{fuelLabel(fuelType, t)}</Text>
          <Text style={s.title}>30-day comparison</Text>
        </View>
        <Text style={s.range}>
          {model.min.toFixed(3)}-{model.max.toFixed(3)}
        </Text>
      </View>

      <View style={s.chart}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
          {model.rows.map((row) => {
            const line = row.points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
            const last = row.points[row.points.length - 1];
            return (
              <React.Fragment key={row.country}>
                <Path d={line} fill="none" stroke={row.color} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
                {last ? <Circle cx={last.x} cy={last.y} r={3.4} fill={row.color} /> : null}
              </React.Fragment>
            );
          })}
        </Svg>
      </View>

      <View style={s.legend}>
        {model.rows.map((row) => (
          <View key={row.country} style={s.legendItem}>
            <View style={[s.swatch, { backgroundColor: row.color }]} />
            <Text style={s.legendText} numberOfLines={1}>{row.country}</Text>
            <Text style={s.legendPrice}>{row.last.toFixed(3)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const makeStyles = (theme: Theme) => {
  const light = theme.name === "light";

  return StyleSheet.create({
    card: {
      borderRadius: 18,
      padding: 14,
      gap: 12,
      backgroundColor: light ? "#F3FBF9" : "rgba(45, 212, 191, 0.08)",
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    headerRow: { flexDirection: "row", justifyContent: "space-between", gap: 12, alignItems: "center" },
    kicker: { color: theme.colors.muted, fontSize: 11, fontWeight: "700", textTransform: "uppercase" },
    title: { marginTop: 3, color: theme.colors.text, fontSize: 16, fontWeight: "800" },
    range: { color: theme.colors.muted, fontSize: 12, fontWeight: "800" },
    chart: {
      height: 104,
      borderRadius: 15,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: "hidden",
      position: "relative",
    },
    legend: { gap: 8 },
    legendItem: { flexDirection: "row", alignItems: "center", gap: 8 },
    swatch: { width: 10, height: 10, borderRadius: 999 },
    legendText: { flex: 1, color: theme.colors.text, fontSize: 12, fontWeight: "700" },
    legendPrice: { color: theme.colors.muted, fontSize: 12, fontWeight: "800" },
  });
};
