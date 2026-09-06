import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Line, Path } from "react-native-svg";

import type { Theme } from "../../theme/theme";
import type { FuelType } from "../../types/fuel";
import type { Trends } from "../../hooks/useTrends";
import { getTrendSeries } from "../../hooks/useTrends";
import type { TDict } from "../../i18n";
import AnimatedPressable from "../ui/AnimatedPressable";

const COLORS = ["#0F766E", "#0284C7", "#D97706", "#7C3AED", "#E11D48"];
const W = 320;
const H = 112;

export default function CompareTrendCard(props: { theme: Theme; t: TDict; trends: Trends | null; countries: string[]; fuelType: FuelType }) {
  const s = useMemo(() => makeStyles(props.theme), [props.theme]);
  const [period, setPeriod] = useState<7 | 30>(30);

  const model = useMemo(() => {
    if (!props.trends || props.countries.length < 2) return null;
    const end = props.trends.dates.length;
    const start = Math.max(0, end - period);
    const dates = props.trends.dates.slice(start, end);
    const rows = props.countries.map((country, index) => {
      const raw = getTrendSeries(props.trends, country, props.fuelType)?.slice(start, end) ?? [];
      const points = raw.map((value, pointIndex) => typeof value === "number" ? { value, index: pointIndex } : null).filter((point): point is { value: number; index: number } => !!point);
      if (points.length < 2) return null;
      return { country, color: COLORS[index % COLORS.length], values: points };
    }).filter((row): row is NonNullable<typeof row> => !!row);
    if (rows.length < 2) return null;
    const all = rows.flatMap((row) => row.values.map((point) => point.value));
    const min = Math.min(...all);
    const max = Math.max(...all);
    const span = max - min || 1;
    const plotted = rows.map((row) => ({
      ...row,
      points: row.values.map((point) => ({ x: (point.index / Math.max(1, dates.length - 1)) * W, y: H - (0.12 + 0.76 * ((point.value - min) / span)) * H, value: point.value })),
      first: row.values[0].value,
      last: row.values[row.values.length - 1].value,
    }));
    const movements = plotted.map((row) => ({ country: row.country, delta: row.last - row.first }));
    const strongest = movements.reduce((best, row) => Math.abs(row.delta) > Math.abs(best.delta) ? row : best, movements[0]);
    const summary = Math.abs(strongest.delta) < 0.001 ? props.t.trendHeldSteady : strongest.delta > 0 ? props.t.trendMovedUp(strongest.country) : props.t.trendMovedDown(strongest.country);
    return { min, max, rows: plotted, dates, summary };
  }, [props.trends, props.countries, props.fuelType, props.t, period]);

  if (!model) return null;

  return (
    <View style={s.card} accessible accessibilityLabel={`${props.t.trendComparison}. ${model.summary}`}>
      <View style={s.header}>
        <View style={s.titleCopy}><Text style={s.kicker}>{props.t.trendComparison}</Text><Text style={s.title}>{model.summary}</Text></View>
        <View style={s.periodControl} accessibilityRole="tablist">
          {([7, 30] as const).map((value) => {
            const active = period === value;
            return <AnimatedPressable key={value} onPress={() => setPeriod(value)} contentStyle={[s.periodButton, active ? s.periodActive : null]} accessibilityRole="tab" accessibilityState={{ selected: active }} accessibilityLabel={value === 7 ? props.t.sevenDays : props.t.thirtyDays}><Text style={[s.periodText, active ? s.periodTextActive : null]}>{value === 7 ? "7D" : "30D"}</Text></AnimatedPressable>;
          })}
        </View>
      </View>

      <View style={s.chart} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
          {[0.25, 0.5, 0.75].map((ratio) => <Line key={ratio} x1="0" x2={W} y1={H * ratio} y2={H * ratio} stroke={props.theme.colors.border} strokeWidth="1" />)}
          {model.rows.map((row) => {
            const line = row.points.map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
            const last = row.points[row.points.length - 1];
            return <React.Fragment key={row.country}><Path d={line} fill="none" stroke={row.color} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" /><Circle cx={last.x} cy={last.y} r={3.7} fill={row.color} /></React.Fragment>;
          })}
        </Svg>
      </View>
      <View style={s.axis}><Text style={s.axisText}>{model.dates[0]}</Text><Text style={s.axisText}>{model.dates[model.dates.length - 1]}</Text></View>
      <View style={s.legend}>
        {model.rows.map((row) => <View key={row.country} style={s.legendRow} accessible accessibilityLabel={`${row.country}, ${row.last.toFixed(3)} EUR`}><View style={[s.swatch, { backgroundColor: row.color }]} /><Text style={s.legendCountry} numberOfLines={1}>{row.country}</Text><Text style={s.legendPrice}>€{row.last.toFixed(3)}</Text></View>)}
      </View>
    </View>
  );
}

const makeStyles = (theme: Theme) => StyleSheet.create({
  card: { padding: 15, borderRadius: 24, gap: 12, backgroundColor: theme.colors.surfaceRaised, borderWidth: 1, borderColor: theme.colors.border },
  header: { flexDirection: theme.m.isLargeText ? "column" : "row", alignItems: theme.m.isLargeText ? "stretch" : "center", justifyContent: "space-between", gap: 10 },
  titleCopy: { flex: 1, minWidth: 0 },
  kicker: { color: theme.colors.primary, fontSize: theme.m.f(10), fontWeight: "900", textTransform: "uppercase", letterSpacing: 0.8 },
  title: { marginTop: 4, color: theme.colors.text, fontSize: theme.m.f(14), lineHeight: theme.m.f(19), fontWeight: "900" },
  periodControl: { flexDirection: "row", padding: 3, borderRadius: 14, backgroundColor: theme.colors.surfaceMuted },
  periodButton: { minWidth: 48, minHeight: 42, alignItems: "center", justifyContent: "center", borderRadius: 11 },
  periodActive: { backgroundColor: theme.colors.surfaceRaised },
  periodText: { color: theme.colors.muted, fontSize: theme.m.f(11), fontWeight: "900" },
  periodTextActive: { color: theme.colors.primary },
  chart: { height: 112, overflow: "hidden", borderRadius: 16, backgroundColor: theme.colors.surfaceMuted },
  axis: { marginTop: -7, flexDirection: "row", justifyContent: "space-between" },
  axisText: { color: theme.colors.muted, fontSize: theme.m.f(9), fontWeight: "700" },
  legend: { gap: 7 },
  legendRow: { minHeight: 28, flexDirection: "row", alignItems: "center", gap: 8 },
  swatch: { width: 10, height: 10, borderRadius: 5 },
  legendCountry: { flex: 1, color: theme.colors.subText, fontSize: theme.m.f(11), fontWeight: "800" },
  legendPrice: { color: theme.colors.text, fontSize: theme.m.f(11), fontWeight: "900" },
});
