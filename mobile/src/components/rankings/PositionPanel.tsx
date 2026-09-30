import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { TDict } from "../../i18n";
import type { RankRow, RankScope } from "../../hooks/useRankingsModel";
import AnimatedPressable from "../ui/AnimatedPressable";
import type { RankingStyles, RankingsPalette } from "./rankings.styles";

type Props = {
  s: RankingStyles;
  p: RankingsPalette;
  t: TDict;
  reduceMotion: boolean;
  scope: RankScope;
  fuelName: string;
  country: string;
  flag: string;
  selected: RankRow | null;
  hasPrice: boolean;
  inScope: boolean;
  rows: RankRow[];
  total: number;
  average: number | null;
  fmt: (eur: number | null) => string;
  canJump: boolean;
  onJump: () => void;
  onAddFavorite: () => void;
};

/** The user's market anchored to the ladder: honest rank for the chosen scope, or why there is none. */
export default function PositionPanel(props: Props) {
  const { s, p, t, selected, rows } = props;
  const kicker = `${t.yourMarket} · ${props.fuelName}`;
  const name = `${props.flag} ${props.country}`.trim();
  const cheapest = rows[0] ?? null;
  const dearest = rows.length ? rows[rows.length - 1] : null;
  const scopeCaption = props.scope === "europe" ? t.rankOfEurope(props.total) : t.rankOfFavorites(props.total);

  let body: React.ReactNode;
  let label: string;
  let action: React.ReactNode = null;

  if (!props.hasPrice) {
    label = t.notRanked(props.fuelName);
    body = <Text style={s.moduleBody}>{label}</Text>;
  } else if (!props.inScope || !selected) {
    label = props.scope === "favorites" ? t.notInFavorites : t.outsideEuropeRank;
    body = <Text style={s.moduleBody}>{label}</Text>;
    if (props.scope === "favorites") {
      action = (
        <AnimatedPressable onPress={props.onAddFavorite} contentStyle={s.secondaryButton} reduceMotion={props.reduceMotion} accessibilityLabel={t.addToFavorites}>
          <Ionicons name="star-outline" size={19} color={p.ink} />
          <Text style={s.secondaryText}>{t.addToFavorites}</Text>
        </AnimatedPressable>
      );
    }
  } else {
    const price = props.fmt(selected.eur);
    const versus =
      cheapest && selected.eur - cheapest.eur >= 0.0005 ? t.vsCheapest(props.fmt(selected.eur - cheapest.eur), cheapest.country) : t.cheapestInScope;
    const avg = props.scope === "europe" && props.average != null ? t.europeAverageIs(props.fmt(props.average)) : null;
    const span = cheapest && dearest ? dearest.eur - cheapest.eur : 0;
    const pct = (eur: number) => `${span > 0 && cheapest ? ((eur - cheapest.eur) / span) * 100 : 0}%` as const;

    label = [`#${selected.rank} ${scopeCaption}`, `${price} ${t.perLitre}`, versus, avg, props.scope === "favorites" ? t.favoritesRankNote : null]
      .filter(Boolean)
      .join(". ");
    body = (
      <>
        <View style={s.rankLine}>
          {/* Display numeral: already ~3× body size, so a 1.5× ceiling keeps it on screen at 200% text. */}
          <Text style={s.rankValue} maxFontSizeMultiplier={1.5}>#{selected.rank}</Text>
          <Text style={s.rankCaption}>{scopeCaption}</Text>
        </View>
        <Text style={s.modulePrice}>{price}/L</Text>
        <Text style={s.moduleBody}>{versus}</Text>
        {avg ? <Text style={s.moduleBody}>{avg}</Text> : null}
        {props.scope === "favorites" ? <Text style={s.moduleBody}>{t.favoritesRankNote}</Text> : null}
        {cheapest && dearest && rows.length > 1 ? (
          <View style={s.strip} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <View style={s.stripTrack}>
              <View style={s.stripBase} />
              {rows.map((r) => (
                <View key={r.country} style={[s.stripStop, { left: pct(r.eur) }]} />
              ))}
              <View style={[s.stripDot, { left: pct(selected.eur) }]} />
            </View>
            <View style={s.stripEnds}>
              <Text style={s.stripEnd}>{`${t.cheapestShort} ${props.fmt(cheapest.eur)}`}</Text>
              <Text style={s.stripEnd}>{`${t.dearestShort} ${props.fmt(dearest.eur)}`}</Text>
            </View>
          </View>
        ) : null}
      </>
    );
    if (props.canJump) {
      action = (
        <AnimatedPressable onPress={props.onJump} contentStyle={s.secondaryButton} reduceMotion={props.reduceMotion} accessibilityLabel={t.jumpToPosition}>
          <Ionicons name="locate-outline" size={19} color={p.ink} />
          <Text style={s.secondaryText}>{t.jumpToPosition}</Text>
        </AnimatedPressable>
      );
    }
  }

  return (
    <View style={s.deck}>
      <View style={s.module} accessible accessibilityLabel={`${kicker}. ${props.country}. ${label}`}>
        <Text style={s.kicker}>{kicker}</Text>
        <Text style={s.country}>{name}</Text>
        {body}
      </View>
      {action ? <View style={s.deckActions}>{action}</View> : null}
    </View>
  );
}
