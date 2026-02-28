import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { Theme } from "../../theme/theme";
import type { FuelType, LatestEurope } from "../../types/fuel";
import { getFuelPrice, fuelLabel } from "../../utils/fuel";
import SegmentedControl from "../ui/SegmentedControl";
import AnimatedPressable from "../ui/AnimatedPressable";
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
  fxRates: Record<string, number> | null;
}) {
  const s = useMemo(() => makeRankingStyles(props.theme), [props.theme]);

  const fuelItems = useMemo(
    () => [
      { value: "diesel" as const, label: props.t.diesel },
      { value: "gasoline95" as const, label: props.t.gasoline95 },
      { value: "lpg" as const, label: props.t.lpg }
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
      <View style={s.headerRow}>
        <View style={s.headerLeft}>
          <View style={s.headerIcon}>
            <Ionicons name="podium-outline" size={18} color={props.theme.colors.linkText} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.title}>{props.t.rankingsTitle}</Text>
            <Text style={s.subtitle}>{props.t.rankingsSubtitle(fuelName)}</Text>
          </View>
        </View>
      </View>

      <SegmentedControl theme={props.theme} value={props.fuelType} items={fuelItems} onChange={props.setFuelType} />

      <Text style={s.note}>
        {currentRank != null ? props.t.yourRank(currentRank) : props.t.rankUnavailable}
      </Text>

      <View style={s.list}>
        {top.map((r, i) => {
          const active = r.country === props.currentCountry;
          return (
            <AnimatedPressable
              key={r.country}
              onPress={() => props.onOpenCountry(r.country)}
              contentStyle={[s.row, active ? s.rowActive : null, i === top.length - 1 ? { borderBottomWidth: 0 } : null]}
              scaleIn={0.99}
            >
              <View style={s.left}>
                <View style={[s.rankBubble, active ? s.rankBubbleActive : null]}>
                  <Text style={[s.rankText, active ? s.rankTextActive : null]}>{i + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[s.country, active ? s.countryActive : null]}>{r.country}</Text>
                </View>
              </View>

              <View style={s.right}>
                <Text style={[s.price, active ? s.priceActive : null]}>
                  {formatFuelPrice(r.country, r.price, props.currencyMode, props.fxRates)}
                </Text>
                <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.35)" />
              </View>
            </AnimatedPressable>
          );
        })}
      </View>
    </View>
  );
}