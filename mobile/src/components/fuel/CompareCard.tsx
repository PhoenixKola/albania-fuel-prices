import React, { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import type { Theme } from "../../theme/theme";
import type { FuelType, LatestEurope } from "../../types/fuel";
import { getFuelPrice, fuelLabel } from "../../utils/fuel";
import { getCurrencyForCountry, convertEur } from "../../utils/currency";
import { formatMoney, hasRate } from "../../utils/money";
import { makeCompareStyles } from "./CompareCard.styles";

type CurrencyMode = "eur" | "local";

export default function CompareCard(props: {
  theme: Theme;
  t: any;
  data: LatestEurope | null;
  fuelType: FuelType;
  compareCountries: string[];
  onRemove: (c: string) => void;
  onAddPress: () => void;
  currencyMode: CurrencyMode;
  fxRates: Record<string, number> | null;
}) {
  const s = useMemo(() => makeCompareStyles(props.theme), [props.theme]);

  const sorted = useMemo(() => {
    if (!props.data) return [];
    return props.data.countries
      .map((c) => ({ country: c.country, price: getFuelPrice(c, props.fuelType) }))
      .filter((x) => x.price != null)
      .sort((a, b) => (a.price! < b.price! ? -1 : 1));
  }, [props.data, props.fuelType]);

  const rankByCountry = useMemo(() => {
    const m = new Map<string, number>();
    sorted.forEach((x, i) => m.set(x.country, i + 1));
    return m;
  }, [sorted]);

  const fuelName = fuelLabel(props.fuelType, props.t);

  const rows = useMemo(() => {
    if (!props.data) return [];
    const byName = new Map(props.data.countries.map((c) => [c.country, c]));
    return props.compareCountries.map((name) => {
      const c = byName.get(name) ?? null;
      const eur = getFuelPrice(c, props.fuelType);
      const rank = rankByCountry.get(name) ?? null;

      const currency = getCurrencyForCountry(name);
      const eurText = formatMoney(eur, "EUR");
      const localOk = hasRate(currency, props.fxRates);
      const localText = localOk ? formatMoney(convertEur(eur, currency, props.fxRates), currency) : null;

      const right =
        props.currencyMode === "local" && localText ? localText : eurText;

      const sub =
        props.currencyMode === "local" && localText ? eurText : localText ? localText : null;

      return { name, rank, right, sub };
    });
  }, [props.data, props.compareCountries, props.fuelType, rankByCountry, props.currencyMode, props.fxRates]);

  const canAddMore = props.compareCountries.length < 3;

  return (
    <View style={s.card}>
      <View style={s.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>{props.t.compareTitle}</Text>
          <Text style={s.subtitle}>{props.t.compareSubtitle(fuelName)}</Text>
        </View>

        <Pressable onPress={props.onAddPress} style={[s.btn, !canAddMore ? s.btnDisabled : null]} disabled={!canAddMore}>
          <Text style={s.btnText}>{props.t.addCountry}</Text>
        </Pressable>
      </View>

      {props.compareCountries.length < 2 ? <Text style={s.hint}>{props.t.compareHint}</Text> : null}
      {!canAddMore ? <Text style={s.hint}>{props.t.maxCompareReached}</Text> : null}

      <View style={s.list}>
        {rows.map((r, i) => (
          <View key={r.name} style={[s.row, i === rows.length - 1 ? { borderBottomWidth: 0 } : null]}>
            <View style={s.left}>
              <View style={s.rankBubble}>
                <Text style={s.rankText}>{r.rank ?? "—"}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.country}>{r.name}</Text>
                {r.sub ? <Text style={s.sub}>{r.sub}</Text> : null}
              </View>
            </View>

            <View style={s.right}>
              <Text style={s.price}>{r.right}</Text>
              <Pressable onPress={() => props.onRemove(r.name)} style={s.removeBtn}>
                <Text style={s.removeText}>{props.t.remove}</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}