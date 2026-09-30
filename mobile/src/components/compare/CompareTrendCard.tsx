import React, { memo, useMemo, useState } from "react";
import { Text, View } from "react-native";
import Svg, { Circle, Line, Path, Polygon, Rect } from "react-native-svg";

import type { TDict } from "../../i18n";
import type { FuelType } from "../../types/fuel";
import type { Trends } from "../../hooks/useTrends";
import { getTrendSeries } from "../../hooks/useTrends";
import { formatShortDate } from "../../hooks/useHomeMarket";
import AnimatedPressable from "../ui/AnimatedPressable";
import type { CompareStyles, ComparePalette } from "./compare.styles";

type Marker = "circle" | "square" | "triangle" | "diamond" | "ring";
// Shape + dash pattern tell series apart without relying on hue.
const MARKERS: Marker[] = ["circle", "square", "triangle", "diamond", "ring"];
const DASHES: (string | undefined)[] = [undefined, "7 5", undefined, "2 4", "10 4 2 4"];
const H = 150;
const PAD = 12;
const FLAT = 0.0005;

type Props = {
  s: CompareStyles;
  p: ComparePalette;
  t: TDict;
  trends: Trends | null;
  countries: string[];
  fuelType: FuelType;
  reduceMotion: boolean;
  fmt: (eur: number | null) => string;
  fmtSigned: (eur: number) => string;
};

function CompareTrendCard({ s, p, t, trends, countries, fuelType, reduceMotion, fmt, fmtSigned }: Props) {
  const [period, setPeriod] = useState<7 | 30>(30);
  const [width, setWidth] = useState(0);

  const model = useMemo(() => {
    if (!trends?.dates?.length) return null;
    const end = trends.dates.length;
    const start = Math.max(0, end - period);
    const dates = trends.dates.slice(start, end);

    const rows = countries
      .map((country, i) => {
        const raw = getTrendSeries(trends, country, fuelType)?.slice(start, end) ?? [];
        const points = raw
          .map((v, idx) => (typeof v === "number" && Number.isFinite(v) ? { idx, v } : null))
          .filter((pt): pt is { idx: number; v: number } => !!pt);
        if (points.length < 2) return null;
        return { country, i, points, last: points[points.length - 1].v };
      })
      .filter((r): r is NonNullable<typeof r> => !!r);
    if (rows.length < 2) return null;

    // Compare movement over the window every series actually covers, so gaps don't skew "rose the most".
    const commonStart = Math.max(...rows.map((r) => r.points[0].idx));
    const commonEnd = Math.min(...rows.map((r) => r.points[r.points.length - 1].idx));
    const withDelta = rows.map((r) => {
      if (commonEnd <= commonStart) return { ...r, delta: null as number | null };
      const a = r.points.find((pt) => pt.idx >= commonStart);
      const b = [...r.points].reverse().find((pt) => pt.idx <= commonEnd);
      return { ...r, delta: a && b ? b.v - a.v : null };
    });

    const moved = withDelta.filter((r): r is typeof r & { delta: number } => r.delta != null);
    let summary: string | null = null;
    if (moved.length >= 2) {
      const strongest = moved.reduce((best, r) => (Math.abs(r.delta) > Math.abs(best.delta) ? r : best), moved[0]);
      summary = Math.abs(strongest.delta) < FLAT ? t.trendHeldSteady : strongest.delta > 0 ? t.trendMovedUp(strongest.country) : t.trendMovedDown(strongest.country);
    }

    const all = rows.flatMap((r) => r.points.map((pt) => pt.v));
    return {
      rows: withDelta,
      dates,
      min: Math.min(...all),
      max: Math.max(...all),
      days: commonEnd > commonStart ? commonEnd - commonStart : dates.length - 1,
      summary,
    };
  }, [trends, countries, fuelType, period, t]);

  const paths = useMemo(() => {
    if (!model || width <= 0) return null;
    const span = model.max - model.min || 1;
    const n = Math.max(1, model.dates.length - 1);
    const x = (idx: number) => PAD + (idx / n) * (width - PAD * 2);
    const y = (v: number) => PAD + (1 - (v - model.min) / span) * (H - PAD * 2);
    const every = Math.max(1, Math.round(model.dates.length / 6));
    return model.rows.map((r) => {
      const xy = r.points.map((pt) => ({ idx: pt.idx, x: x(pt.idx), y: y(pt.v) }));
      const d = xy.map((pt, i) => `${i ? "L" : "M"}${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(" ");
      const marks = xy.filter((pt, i) => i === xy.length - 1 || pt.idx % every === 0);
      return { ...r, d, marks };
    });
  }, [model, width]);

  if (countries.length < 2) return null;

  const title = t.trendComparison;
  if (!model) {
    return (
      <View style={s.trendCard}>
        <Text style={s.trendTitle} accessibilityRole="header">{title}</Text>
        <Text style={s.trendRange}>{t.trendNoData}</Text>
      </View>
    );
  }

  const color = (i: number) => p.series[i % p.series.length];

  return (
    <View style={s.trendCard}>
      <View style={s.trendHeader}>
        <Text style={s.trendTitle} accessibilityRole="header">{title}</Text>
        <View style={s.period} accessibilityRole="tablist">
          {([7, 30] as const).map((value) => {
            const active = period === value;
            return (
              <AnimatedPressable
                key={value}
                onPress={() => setPeriod(value)}
                style={s.periodItem}
                contentStyle={[s.periodButton, active ? s.periodActive : null]}
                reduceMotion={reduceMotion}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                accessibilityLabel={t.trendPeriodA11y(value)}
              >
                <Text style={[s.periodText, active ? s.periodTextActive : null]}>{value === 7 ? t.sevenDays : t.thirtyDays}</Text>
              </AnimatedPressable>
            );
          })}
        </View>
      </View>

      {model.summary ? <Text style={s.trendSummary}>{model.summary}</Text> : null}
      <Text style={s.trendRange}>{t.movementRange(fmt(model.min), fmt(model.max))}</Text>

      <View
        style={s.chart}
        onLayout={(e) => setWidth(Math.round(e.nativeEvent.layout.width))}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        {paths ? (
          <Svg width={width} height={H}>
            {[0.25, 0.5, 0.75].map((r) => (
              <Line key={r} x1={0} x2={width} y1={H * r} y2={H * r} stroke={p.rule} strokeWidth={1} />
            ))}
            {paths.map((r) => (
              <Path
                key={r.country}
                d={r.d}
                fill="none"
                stroke={color(r.i)}
                strokeWidth={2.5}
                strokeDasharray={DASHES[r.i % DASHES.length]}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            {paths.flatMap((r) => r.marks.map((m) => <MarkerShape key={`${r.country}-${m.idx}`} kind={MARKERS[r.i % MARKERS.length]} x={m.x} y={m.y} color={color(r.i)} hole={p.deck} />))}
          </Svg>
        ) : null}
      </View>
      <View style={s.axis} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <Text style={s.axisText}>{formatShortDate(model.dates[0], t)}</Text>
        <Text style={s.axisText}>{formatShortDate(model.dates[model.dates.length - 1], t)}</Text>
      </View>

      <View style={s.legend}>
        {model.rows.map((r) => {
          const change = r.delta == null ? null : t.trendChangeOver(Math.abs(r.delta) < FLAT ? fmt(0) : fmtSigned(r.delta), model.days);
          return (
            <View key={r.country} style={s.legendRow} accessible accessibilityLabel={[r.country, fmt(r.last), change].filter(Boolean).join(", ")}>
              <Svg width={30} height={16}>
                <Line x1={1} x2={29} y1={8} y2={8} stroke={color(r.i)} strokeWidth={2.5} strokeDasharray={DASHES[r.i % DASHES.length]} />
                <MarkerShape kind={MARKERS[r.i % MARKERS.length]} x={15} y={8} color={color(r.i)} hole={p.deck} />
              </Svg>
              <Text style={s.legendName}>{r.country}</Text>
              <Text style={s.legendValue}>{[fmt(r.last), change].filter(Boolean).join(" · ")}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function MarkerShape({ kind, x, y, color, hole }: { kind: Marker; x: number; y: number; color: string; hole: string }) {
  const r = 4.5;
  switch (kind) {
    case "square":
      return <Rect x={x - r} y={y - r} width={r * 2} height={r * 2} fill={color} />;
    case "triangle":
      return <Polygon points={`${x},${y - r - 1} ${x + r + 1},${y + r} ${x - r - 1},${y + r}`} fill={color} />;
    case "diamond":
      return <Polygon points={`${x},${y - r - 1} ${x + r + 1},${y} ${x},${y + r + 1} ${x - r - 1},${y}`} fill={color} />;
    case "ring":
      return <Circle cx={x} cy={y} r={r} fill={hole} stroke={color} strokeWidth={2.5} />;
    default:
      return <Circle cx={x} cy={y} r={r} fill={color} />;
  }
}

export default memo(CompareTrendCard);
