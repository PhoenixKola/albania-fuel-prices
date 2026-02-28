import React, { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import type { Theme } from "../../theme/theme";
import type { FuelType, LatestEurope } from "../../types/fuel";
import { formatPriceEur } from "../../utils/format";
import { getFuelPrice, fuelLabel } from "../../utils/fuel";
import SegmentedControl from "../ui/SegmentedControl";
import { makeRankingStyles } from "./RankingCard.styles";
import { CurrencyMode, formatFuelPrice } from "../../utils/priceDisplay";

export default function RankingCard(props: {
  theme: Theme;
  t: any;
  data: LatestEurope | null;
  fuelType: FuelType;
  setFuelType: (v: FuelType | ((p: FuelType) => FuelType)) => void;
  currentCountry: string;
  onOpenCountry: (c: string) => void;
  currencyMode: CurrencyMode;
  fxRates: Record<string, number> | null
}) {
  const s = useMemo(() => makeRankingStyles(props.theme), [props.theme]);

  const fuelItems = useMemo(
    () => [
      { value: "diesel" as const, label: props.t.diesel },
      { value: "gasoline95" as const, label: props.t.gasoline95 },
      { value: "lpg" as const, label: props.t.lpg },
    ],
    [props.t]
  );

  const sorted = useMemo(() => {
    if (!props.data) return [];
    return props.data.countries
      .map((c) => ({ country: c.country, price: getFuelPrice(c, props.fuelType) }))
      .filter((x) => x.price != null)
      .sort((a, b) => (a.price! < b.price! ? -1 : 1));
  }, [props.data, props.fuelType]);

  const top = useMemo(() => sorted.slice(0, 10), [sorted]);

  const currentRank = useMemo(() => {
    const idx = sorted.findIndex((x) => x.country === props.currentCountry);
    return idx >= 0 ? idx + 1 : null;
  }, [sorted, props.currentCountry]);

  const fuelName = fuelLabel(props.fuelType, props.t);

  return (
    <View style={s.card}>
      <Text style={s.title}>{props.t.rankingsTitle}</Text>
      <Text style={s.subtitle}>{props.t.rankingsSubtitle(fuelName)}</Text>

      <SegmentedControl theme={props.theme} value={props.fuelType} items={fuelItems} onChange={props.setFuelType} />

      {currentRank != null ? (
        <Text style={s.note}>{props.t.yourRank(currentRank)}</Text>
      ) : (
        <Text style={s.note}>{props.t.rankUnavailable}</Text>
      )}

      <View>
        {top.map((r, i) => {
          const active = r.country === props.currentCountry;
          return (
            <Pressable
              key={r.country}
              onPress={() => props.onOpenCountry(r.country)}
              style={[s.row, active ? s.rowActive : null, i === top.length - 1 ? { borderBottomWidth: 0 } : null]}
            >
              <View style={s.left}>
                <Text style={s.rank}>{i + 1}</Text>
                <Text style={s.country}>{r.country}</Text>
              </View>
              <Text style={s.price}>{formatFuelPrice(r.country, r.price, props.currencyMode, props.fxRates)}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}