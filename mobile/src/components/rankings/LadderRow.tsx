import React, { memo } from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { TDict } from "../../i18n";
import type { RankRow } from "../../hooks/useRankingsModel";
import AnimatedPressable from "../ui/AnimatedPressable";
import type { RankingStyles, RankingsPalette } from "./rankings.styles";

const FLAT = 0.0005;

type Props = {
  row: RankRow;
  total: number;
  mine: boolean;
  favorite: boolean;
  top: boolean;
  endTag: string | null;
  s: RankingStyles;
  p: RankingsPalette;
  t: TDict;
  reduceMotion: boolean;
  fmt: (eur: number | null) => string;
  fmtSigned: (eur: number) => string;
  onPress: (row: RankRow) => void;
};

function LadderRow({ row, total, mine, favorite, top, endTag, s, p, t, reduceMotion, fmt, fmtSigned, onPress }: Props) {
  const price = fmt(row.eur);
  const week =
    row.weekEur == null
      ? null
      : Math.abs(row.weekEur) < FLAT
        ? { text: t.weekFlat, icon: "remove" as const, color: p.inkSoft }
        : row.weekEur > 0
          ? { text: t.weekChange(fmtSigned(row.weekEur)), icon: "trending-up" as const, color: p.rise }
          : { text: t.weekChange(fmtSigned(row.weekEur)), icon: "trending-down" as const, color: p.good };

  const label = [
    t.rankRowA11y(row.rank, total, row.country, price),
    endTag,
    mine ? t.yourMarket : null,
    favorite ? t.favorites : null,
    week?.text ?? null,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <AnimatedPressable
      onPress={() => onPress(row)}
      contentStyle={[s.row, mine ? s.rowMine : null]}
      scaleIn={0.99}
      reduceMotion={reduceMotion}
      accessibilityLabel={label}
      accessibilityState={{ selected: mine }}
    >
      <View style={[s.rank, top ? s.rankTop : null]}>
        <Text style={s.rankText}>{row.rank}</Text>
      </View>
      <View style={s.rowMain}>
        <View style={s.rowHead}>
          <Text style={s.rowCountry}>{`${row.flag} ${row.country}`.trim()}</Text>
          <Text style={s.rowPrice}>{price}</Text>
        </View>
        {endTag || mine || favorite || week ? (
          <View style={s.rowMeta}>
            {endTag ? (
              <View style={s.tag}>
                <Ionicons name="ribbon-outline" size={14} color={p.accent} />
                <Text style={s.tagText}>{endTag}</Text>
              </View>
            ) : null}
            {mine ? (
              <View style={s.tag}>
                <Ionicons name="location" size={14} color={p.accent} />
                <Text style={s.tagText}>{t.yourMarket}</Text>
              </View>
            ) : null}
            {favorite && !mine ? <Ionicons name="star" size={14} color={p.accent} /> : null}
            {week ? (
              <View style={s.tag}>
                <Ionicons name={week.icon} size={14} color={week.color} />
                <Text style={[s.metaText, { color: week.color }]}>{week.text}</Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </View>
      <Ionicons name="ellipsis-horizontal" size={18} color={p.inkSoft} />
    </AnimatedPressable>
  );
}

export default memo(LadderRow);

export function AverageRung({ s, label }: { s: RankingStyles; label: string }) {
  return (
    <View style={s.average} accessible accessibilityLabel={label}>
      <View style={s.averageLine} />
      <Text style={s.averageText}>{label}</Text>
      <View style={s.averageLine} />
    </View>
  );
}
