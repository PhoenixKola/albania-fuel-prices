import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { Theme } from "../../theme/theme";
import type { FuelType, LatestEurope } from "../../types/fuel";
import { getFuelPrice, fuelLabel } from "../../utils/fuel";
import { getCurrencyForCountry, convertEur } from "../../utils/currency";
import { formatMoney, hasRate } from "../../utils/money";
import AnimatedPressable from "../ui/AnimatedPressable";
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
  maxCompare: number;
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
  const canAddMore = props.compareCountries.length < props.maxCompare;

  const rows = useMemo(() => {
    const fallback = props.compareCountries.map((name) => ({
      name,
      rank: null as number | null,
      eur: null as number | null,
      right: "—",
      sub: null as string | null,
      diffEurText: null as string | null
    }));

    if (!props.data) return fallback;

    const byName = new Map(props.data.countries.map((c) => [c.country, c]));

    const computed = props.compareCountries.map((name) => {
      const c = byName.get(name) ?? null;
      const eur = getFuelPrice(c, props.fuelType);
      const rank = rankByCountry.get(name) ?? null;

      const currency = getCurrencyForCountry(name);
      const eurText = formatMoney(eur, "EUR");

      const localOk = hasRate(currency, props.fxRates);
      const localText = localOk ? formatMoney(convertEur(eur, currency, props.fxRates), currency) : null;

      const right = props.currencyMode === "local" && localText ? localText : eurText;
      const sub = props.currencyMode === "local" && localText ? eurText : localText ? localText : null;

      return { name, rank, eur: eur ?? null, right, sub };
    });

    const eurVals = computed.map((x) => x.eur).filter((x): x is number => typeof x === "number" && Number.isFinite(x));
    const minEur = eurVals.length ? Math.min(...eurVals) : null;

    return computed.map((r) => {
      if (minEur == null || r.eur == null) return { ...r, diffEurText: null };

      const diff = r.eur - minEur;
      if (!Number.isFinite(diff) || diff <= 0.0001) return { ...r, diffEurText: null };

      return { ...r, diffEurText: `+${formatMoney(diff, "EUR")}` };
    });
  }, [props.data, props.compareCountries, props.fuelType, rankByCountry, props.currencyMode, props.fxRates]);

  const minEurInSelection = useMemo(() => {
    const eurVals = rows.map((x) => x.eur).filter((x): x is number => typeof x === "number" && Number.isFinite(x));
    return eurVals.length ? Math.min(...eurVals) : null;
  }, [rows]);

  const modeLabel =
    props.currencyMode === "eur"
      ? (props.t.currencyEUR ?? "EUR")
      : (props.t.currencyLocal ?? "Local");

  return (
    <View style={s.card}>
      <View style={s.headerRow}>
        <View style={s.headerLeft}>
          <View style={s.headerIcon}>
            <Ionicons name="git-compare-outline" size={18} color={props.theme.colors.linkText} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={s.title}>{props.t.compareTitle}</Text>
            <Text style={s.subtitle} numberOfLines={2}>
              {props.t.compareSubtitle(fuelName)}
            </Text>
          </View>
        </View>

        <View style={s.headerActions}>
          <View style={s.pills}>
            <View style={s.pill}>
              <Ionicons name="layers-outline" size={14} color={props.theme.colors.muted} />
              <Text style={s.pillText}>
                {props.compareCountries.length}/{props.maxCompare}
              </Text>
            </View>

            <View style={s.pill}>
              <Ionicons name={props.currencyMode === "eur" ? "logo-euro" : "cash-outline"} size={14} color={props.theme.colors.muted} />
              <Text style={s.pillText}>{modeLabel}</Text>
            </View>
          </View>

          <AnimatedPressable
            onPress={props.onAddPress}
            disabled={!canAddMore}
            contentStyle={[s.btn, !canAddMore ? s.btnDisabled : null]}
            scaleIn={0.98}
          >
            <Ionicons name="add" size={18} color={props.theme.colors.text} />
            <Text style={s.btnText}>{props.t.addCountry}</Text>
          </AnimatedPressable>
        </View>
      </View>

      {props.compareCountries.length < 2 ? (
        <View style={s.notice}>
          <Ionicons name="information-circle-outline" size={16} color={props.theme.colors.muted} />
          <Text style={s.noticeText}>{props.t.compareHint}</Text>
        </View>
      ) : null}

      {!canAddMore ? (
        <View style={s.notice}>
          <Ionicons name="lock-closed-outline" size={16} color={props.theme.colors.muted} />
          <Text style={s.noticeText}>{props.t.maxCompareReachedN(props.maxCompare)}</Text>
        </View>
      ) : null}

      <View style={s.rows}>
        {rows.map((r) => {
          const isBest =
            minEurInSelection != null &&
            r.eur != null &&
            Math.abs(r.eur - minEurInSelection) < 0.0001;

          const medalIcon =
            r.rank === 1 ? "trophy-outline" : r.rank === 2 ? "medal-outline" : r.rank === 3 ? "ribbon-outline" : null;

          return (
            <View key={r.name} style={[s.rowCard, isBest ? s.rowBest : null]}>
              <View style={s.rowLeft}>
                <View style={[s.rankBubble, r.rank === 1 ? s.rank1 : null, r.rank === 2 ? s.rank2 : null, r.rank === 3 ? s.rank3 : null]}>
                  {medalIcon ? (
                    <Ionicons name={medalIcon as any} size={14} color={props.theme.colors.text} />
                  ) : null}
                  <Text style={s.rankText}>{r.rank ?? "—"}</Text>
                </View>

                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={s.country} numberOfLines={1}>
                    {r.name}
                  </Text>

                  <View style={s.subRow}>
                    {r.sub ? <Text style={s.sub} numberOfLines={1}>{r.sub}</Text> : null}
                    {r.diffEurText ? (
                      <View style={s.diffPill}>
                        <Ionicons name="arrow-up" size={12} color={props.theme.colors.muted} />
                        <Text style={s.diffText} numberOfLines={1}>
                          {r.diffEurText}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={s.rowRight}>
                <View style={s.priceStack}>
                  <Text style={s.price}>{r.right}</Text>

                  {isBest ? (
                    <View style={s.bestPill}>
                      <Ionicons name="sparkles-outline" size={12} color={props.theme.colors.text} />
                      <Text style={s.bestText}>{props.t.best ?? "Best"}</Text>
                    </View>
                  ) : null}
                </View>

                <AnimatedPressable
                  onPress={() => props.onRemove(r.name)}
                  contentStyle={s.removeIconBtn}
                  scaleIn={0.98}
                >
                  <Ionicons name="trash-outline" size={16} color={props.theme.colors.muted} />
                </AnimatedPressable>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}