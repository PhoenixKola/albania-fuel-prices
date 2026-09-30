import React, { memo } from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { TDict } from "../../i18n";
import type { CompareLane } from "../../hooks/useCompareModel";
import AnimatedPressable from "../ui/AnimatedPressable";
import type { CompareStyles, ComparePalette } from "./compare.styles";

const FLAT = 0.0005;

type Props = {
  lane: CompareLane;
  order: number | null;
  s: CompareStyles;
  p: ComparePalette;
  t: TDict;
  fuelName: string;
  europeTotal: number;
  reduceMotion: boolean;
  fmt: (eur: number | null) => string;
  fmtSigned: (eur: number) => string;
  onRemove: (country: string) => void;
};

function MarketLane({ lane, order, s, p, t, fuelName, europeTotal, reduceMotion, fmt, fmtSigned, onRemove }: Props) {
  const priced = lane.eur != null;
  const gapLabel = !priced ? null : lane.isCheapest ? t.cheapestShort : lane.gapEur != null && lane.gapEur >= FLAT ? `+${fmt(lane.gapEur)}` : null;
  const rankText = lane.europeRank ? t.europeRank(lane.europeRank, europeTotal) : t.outsideEuropeRank;
  const week =
    lane.weekEur == null
      ? { text: t.noWeekData, icon: "remove" as const, color: p.inkSoft }
      : Math.abs(lane.weekEur) < FLAT
        ? { text: t.weekFlat, icon: "remove" as const, color: p.inkSoft }
        : lane.weekEur > 0
          ? { text: t.weekChange(fmtSigned(lane.weekEur)), icon: "trending-up" as const, color: p.rise }
          : { text: t.weekChange(fmtSigned(lane.weekEur)), icon: "trending-down" as const, color: p.good };

  const a11y = priced
    ? [
        `${order ?? ""}. ${lane.country}`,
        `${lane.primary} ${t.perLitre}`,
        lane.secondary ? t.secondaryPriceA11y(lane.secondary) : lane.secondaryMissing ? t.fxUnavailable : null,
        lane.isCheapest ? t.cheapestShort : lane.gapEur != null && lane.gapEur >= FLAT ? t.moreThanCheapest(fmt(lane.gapEur)) : null,
        rankText,
        week.text,
      ]
        .filter(Boolean)
        .join(", ")
    : `${lane.country}, ${t.fuelNotReported(fuelName)}`;

  return (
    <View style={s.lane}>
      <View style={s.laneTop}>
        <View style={[s.position, lane.isCheapest ? s.positionCheapest : null]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <Text style={s.positionText}>{order ?? "–"}</Text>
        </View>

        <View style={s.laneMain} accessible accessibilityLabel={a11y}>
          <View style={s.laneHead}>
            <Text style={s.laneName}>{`${lane.flag} ${lane.country}`.trim()}</Text>
            {priced ? (
              <View style={s.lanePrices}>
                <Text style={s.lanePrice}>{lane.primary}</Text>
                {lane.secondary ? <Text style={s.laneSecondary}>{lane.secondary}</Text> : null}
                {lane.secondaryMissing ? <Text style={s.laneSecondary}>{t.fxUnavailable}</Text> : null}
              </View>
            ) : null}
          </View>

          {priced && lane.position != null ? (
            <View style={s.trackRow}>
              <View style={s.track}>
                <View style={s.trackBase} />
                <View style={[s.trackFill, { width: `${lane.position * 100}%` as const }]} />
                <View style={[s.trackDot, { left: `${lane.position * 100}%` as const, borderColor: lane.isCheapest ? p.good : p.ink }]} />
              </View>
              {gapLabel ? (
                <View style={s.gapTag}>
                  {lane.isCheapest ? <Ionicons name="ribbon-outline" size={15} color={p.good} /> : null}
                  <Text style={[s.gapText, lane.isCheapest ? s.gapTextCheapest : null]}>{gapLabel}</Text>
                </View>
              ) : null}
            </View>
          ) : null}

          <View style={s.laneMeta}>
            {priced ? (
              <>
                <View style={s.metaItem}>
                  <Ionicons name="podium-outline" size={14} color={p.inkSoft} />
                  <Text style={s.metaText}>{rankText}</Text>
                </View>
                <View style={s.metaItem}>
                  <Ionicons name={week.icon} size={15} color={week.color} />
                  <Text style={[s.metaText, lane.weekEur != null && Math.abs(lane.weekEur) >= FLAT ? { color: week.color } : null]}>{week.text}</Text>
                </View>
              </>
            ) : (
              <View style={s.metaItem}>
                <Ionicons name="help-circle-outline" size={15} color={p.inkSoft} />
                <Text style={s.metaText}>{t.fuelNotReported(fuelName)}</Text>
              </View>
            )}
          </View>
        </View>

        <AnimatedPressable
          onPress={() => onRemove(lane.country)}
          contentStyle={s.removeButton}
          scaleIn={0.9}
          reduceMotion={reduceMotion}
          accessibilityLabel={t.removeMarketA11y(lane.country)}
        >
          <Ionicons name="close" size={22} color={p.inkSoft} />
        </AnimatedPressable>
      </View>
    </View>
  );
}

export default memo(MarketLane);
