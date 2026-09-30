import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { TDict } from "../../i18n";
import type { CompareLane } from "../../hooks/useCompareModel";
import type { CompareStyles, ComparePalette } from "./compare.styles";

const TANK_LITRES = 50;

/** Answers the question first: who is cheapest, who is dearest, and what the gap costs. */
export default function VerdictCard(props: {
  s: CompareStyles;
  p: ComparePalette;
  t: TDict;
  fuelName: string;
  selectedCount: number;
  cheapest: CompareLane | null;
  dearest: CompareLane | null;
  spreadEur: number | null;
  pricedCount: number;
  fmt: (eur: number | null) => string;
}) {
  const { s, p, t, cheapest, dearest, spreadEur, fmt } = props;
  const kicker = t.compareKicker(props.fuelName, props.selectedCount);

  let body: React.ReactNode;
  let label: string;

  if (props.pricedCount === 0) {
    label = t.fuelNotReported(props.fuelName);
    body = <Text style={s.headline}>{label}</Text>;
  } else if (props.pricedCount === 1 && cheapest) {
    label = `${cheapest.country}, ${cheapest.primary} ${t.perLitre}. ${t.addOneMore}`;
    body = (
      <>
        <Text style={s.headline}>{`${cheapest.flag} ${cheapest.country}`.trim()}</Text>
        <Text style={s.endPrice}>{cheapest.primary}/L</Text>
        <Text style={s.moduleBody}>{t.addOneMore}</Text>
      </>
    );
  } else if (cheapest && dearest && spreadEur != null && spreadEur < 0.0005) {
    label = `${t.samePriceEverywhere}, ${cheapest.primary} ${t.perLitre}`;
    body = (
      <>
        <Text style={s.headline}>{t.samePriceEverywhere}</Text>
        <Text style={s.endPrice}>{cheapest.primary}/L</Text>
      </>
    );
  } else if (cheapest && dearest && spreadEur != null) {
    const gap = fmt(spreadEur);
    const tank = t.tankEstimate(fmt(spreadEur * TANK_LITRES));
    label = `${t.cheapestIn(cheapest.country)}, ${cheapest.primary}. ${t.costsMore(dearest.country, gap)}. ${tank}`;
    body = (
      <>
        <View style={s.ends}>
          <End s={s} p={p} icon="arrow-down" label={t.cheapestShort} lane={cheapest} />
          <End s={s} p={p} icon="arrow-up" label={t.dearestShort} lane={dearest} />
        </View>
        <View style={s.moduleRule} />
        <Text style={s.spreadLabel}>{t.spread}</Text>
        <View style={s.spreadRow}>
          {/* Display numeral: already ~3× body size, so a 1.5× ceiling keeps it on screen at 200% text. */}
          <Text style={s.spreadValue} maxFontSizeMultiplier={1.5}>{gap}</Text>
          <Text style={s.spreadUnit}>/L</Text>
        </View>
        <Text style={s.moduleBody}>{tank}</Text>
      </>
    );
  } else {
    return null;
  }

  return (
    <View style={s.deck}>
      <View style={s.module} accessible accessibilityLabel={`${kicker}. ${label}`}>
        <Text style={s.kicker}>{kicker}</Text>
        {body}
      </View>
    </View>
  );
}

function End({ s, p, icon, label, lane }: { s: CompareStyles; p: ComparePalette; icon: "arrow-down" | "arrow-up"; label: string; lane: CompareLane }) {
  return (
    <View style={s.end}>
      <View style={s.endLabel}>
        <Ionicons name={icon} size={14} color={icon === "arrow-down" ? p.moduleGood : p.moduleBad} />
        <Text style={s.endLabelText}>{label}</Text>
      </View>
      <Text style={s.endCountry}>{`${lane.flag} ${lane.country}`.trim()}</Text>
      <Text style={s.endPrice}>{lane.primary}/L</Text>
    </View>
  );
}
