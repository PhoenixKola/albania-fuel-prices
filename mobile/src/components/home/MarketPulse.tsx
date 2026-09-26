import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

import type { Theme } from "../../theme/theme";
import type { TDict } from "../../i18n";
import { getFlagForCountry } from "../../utils/countryFlag";
import { homePalette, type HomePalette } from "./homePalette";

type Props = {
  theme: Theme;
  t: TDict;
  fuelName: string;
  country: string;
  series: { points: Array<{ v: number; date: string }>; min: number; max: number; days: number } | null;
  weekText: string | null;
  europe: { rows: Array<{ country: string; price: number }>; total: number; average: number | null };
  current: number | null;
  rank: number | null;
  format: (eur: number | null) => string;
};

const SPARK_H = 64;

/** Price now → movement → position, as one continuous section instead of stacked cards. */
export default function MarketPulse(props: Props) {
  const { theme, t } = props;
  const p = useMemo(() => homePalette(theme), [theme]);
  const s = useMemo(() => makeStyles(theme, p), [theme, p]);

  const rangeText = props.series ? t.movementRange(props.format(props.series.min), props.format(props.series.max)) : null;
  const movementSummary = props.series ? [props.weekText, rangeText].filter(Boolean).join(" · ") : t.movementMissing;

  const rows = props.europe.rows;
  const low = rows[0]?.price ?? null;
  const high = rows[rows.length - 1]?.price ?? null;
  const positionSummary = [
    props.rank && props.europe.total ? t.ordinalCheapest(props.rank, props.europe.total) : t.outsideEuropeRank,
    props.europe.average != null ? t.europeAverageIs(props.format(props.europe.average)) : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <View style={s.section}>
      <Text style={s.kicker} accessibilityRole="header" maxFontSizeMultiplier={1.4}>
        {t.marketPulse} · {props.fuelName}
      </Text>

      <View style={s.block} accessible accessibilityLabel={`${t.movement(props.series?.days ?? 30)}. ${movementSummary}`}>
        <Text style={s.blockTitle} maxFontSizeMultiplier={1.4}>{t.movement(props.series?.days ?? 30)}</Text>
        {props.series ? <Sparkline points={props.series.points} min={props.series.min} max={props.series.max} p={p} /> : null}
        <Text style={s.summary} maxFontSizeMultiplier={1.4}>{movementSummary}</Text>
      </View>

      {rows.length > 1 && low != null && high != null ? (
        <View style={[s.block, s.blockDivided]} accessible accessibilityLabel={`${t.positionInEurope}. ${positionSummary}`}>
          <Text style={s.blockTitle} maxFontSizeMultiplier={1.4}>{t.positionInEurope}</Text>
          <PositionStrip
            rows={rows}
            low={low}
            high={high}
            average={props.europe.average}
            current={props.rank ? props.current : null}
            flag={getFlagForCountry(props.country)}
            p={p}
          />
          <View style={s.ends}>
            <Text style={s.endText} maxFontSizeMultiplier={1.3}>{t.cheapestShort} {props.format(low)}</Text>
            <Text style={s.endText} maxFontSizeMultiplier={1.3}>{t.dearestShort} {props.format(high)}</Text>
          </View>
          <Text style={s.summary} maxFontSizeMultiplier={1.4}>{positionSummary}</Text>
        </View>
      ) : null}
    </View>
  );
}

function Sparkline({ points, min, max, p }: { points: Array<{ v: number }>; min: number; max: number; p: HomePalette }) {
  const [width, setWidth] = useState(0);

  const paths = useMemo(() => {
    if (width <= 0) return null;
    const pad = 9;
    const span = max - min || 1;
    const step = (width - pad * 2) / Math.max(1, points.length - 1);
    const xy = points.map((pt, i) => [pad + i * step, pad + (1 - (pt.v - min) / span) * (SPARK_H - pad * 2)] as const);
    const line = xy.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
    const area = `${line} L${xy[xy.length - 1][0].toFixed(1)},${SPARK_H} L${xy[0][0].toFixed(1)},${SPARK_H} Z`;
    return { line, area, end: xy[xy.length - 1] };
  }, [width, points, min, max]);

  return (
    <View style={{ height: SPARK_H, marginVertical: 8 }} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {paths ? (
        <Svg width={width} height={SPARK_H}>
          <Path d={paths.area} fill={p.sparkFill} />
          <Path d={paths.line} stroke={p.spark} strokeWidth={2.25} fill="none" strokeLinejoin="round" strokeLinecap="round" />
          <Circle cx={paths.end[0]} cy={paths.end[1]} r={4.5} fill={p.deck} stroke={p.spark} strokeWidth={2.5} />
        </Svg>
      ) : null}
    </View>
  );
}

/** Europe as a route line: one stop per market, positioned by price. */
function PositionStrip(props: {
  rows: Array<{ country: string; price: number }>;
  low: number;
  high: number;
  average: number | null;
  current: number | null;
  flag: string;
  p: HomePalette;
}) {
  const { p } = props;
  const span = props.high - props.low || 1;
  const pct = (v: number) => `${((v - props.low) / span) * 100}%` as const;

  return (
    <View style={strip.wrap}>
      <View style={strip.markerRow}>
        {props.current != null ? (
          <View style={[strip.markerLabel, { left: pct(props.current) }]}>
            <Text style={strip.flag}>{props.flag || "•"}</Text>
          </View>
        ) : null}
      </View>
      <View style={strip.trackRow}>
        <View style={[strip.track, { backgroundColor: p.rule }]} />
        {props.rows.map((r) => (
          <View key={r.country} style={[strip.stop, { left: pct(r.price), backgroundColor: p.lane }]} />
        ))}
        {props.average != null ? <View style={[strip.avg, { left: pct(props.average), backgroundColor: p.inkSoft }]} /> : null}
        {props.current != null ? (
          <View style={[strip.dot, { left: pct(props.current), borderColor: p.accent, backgroundColor: p.deck }]} />
        ) : null}
      </View>
    </View>
  );
}

const strip = StyleSheet.create({
  wrap: { marginTop: 4, marginBottom: 6, marginHorizontal: 8 },
  markerRow: { height: 22 },
  markerLabel: { position: "absolute", width: 30, marginLeft: -15, alignItems: "center" },
  flag: { fontSize: 15, color: "#8A94A3" },
  trackRow: { height: 18, justifyContent: "center" },
  track: { height: 4, borderRadius: 2 },
  stop: { position: "absolute", width: 2, height: 10, marginLeft: -1, borderRadius: 1 },
  avg: { position: "absolute", width: 2, height: 18, marginLeft: -1, borderRadius: 1 },
  dot: { position: "absolute", width: 16, height: 16, marginLeft: -8, borderRadius: 8, borderWidth: 3 },
});

const makeStyles = (theme: Theme, p: HomePalette) =>
  StyleSheet.create({
    section: {
      borderRadius: 22,
      backgroundColor: p.deck,
      borderWidth: 1,
      borderColor: p.chipBorder,
      paddingHorizontal: 16,
      paddingTop: 14,
      paddingBottom: 6,
    },
    kicker: {
      color: p.inkSoft,
      fontSize: theme.m.f(11),
      fontWeight: "900",
      letterSpacing: 1.4,
      textTransform: "uppercase",
    },
    block: { paddingVertical: 12 },
    blockDivided: { borderTopWidth: 1, borderTopColor: p.rule },
    blockTitle: { color: p.ink, fontSize: theme.m.f(15), fontWeight: "900" },
    summary: { color: p.inkSoft, fontSize: theme.m.f(13), fontWeight: "700", lineHeight: theme.m.f(19) },
    ends: { flexDirection: "row", justifyContent: "space-between", gap: 12, marginBottom: 6 },
    endText: { color: p.inkFaint, fontSize: theme.m.f(11), fontWeight: "800", fontVariant: ["tabular-nums"] },
  });
