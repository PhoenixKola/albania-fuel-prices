import React, { useEffect, useMemo, useState } from "react";
import { Text, TextInput, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import type { Theme } from "../../theme/theme";
import type { TDict } from "../../i18n";
import type { FuelType, LatestEurope } from "../../types/fuel";
import type { Trends } from "../../hooks/useTrends";
import { getWeeklyDeltaEur } from "../../hooks/useTrends";
import { getFuelPrice, fuelLabel } from "../../utils/fuel";
import { getCurrencyForCountry, convertEur } from "../../utils/currency";
import { formatMoney, hasRate } from "../../utils/money";
import { getFlagForCountry } from "../../utils/countryFlag";
import { isEuropeanCountry } from "../../utils/regions";
import AnimatedPressable from "../ui/AnimatedPressable";
import BottomSheet from "../ui/BottomSheet";
import CompareTrendCard from "./CompareTrendCard";
import { makeCompareStyles } from "./CompareCard.styles";

type CurrencyMode = "eur" | "local";
type CompareSet = { id: string; name: string; countries: string[]; savedAtUtc: string };
const STORAGE_COMPARE_SETS_KEY = "compare_saved_sets_v1";

function parseSets(raw: string | null): CompareSet[] {
  if (!raw) return [];
  try {
    const value = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    return value.filter((set) => set?.id && set?.name && Array.isArray(set?.countries));
  } catch {
    return [];
  }
}

export default function CompareCard(props: {
  theme: Theme;
  t: TDict;
  data: LatestEurope | null;
  trends: Trends | null;
  fuelType: FuelType;
  compareCountries: string[];
  onRemove: (country: string) => void;
  onAddPress: () => void;
  currencyMode: CurrencyMode;
  fxRates: Record<string, number> | null;
  maxCompare: number;
  onApplySet?: (countries: string[]) => void;
  onUnlockPress?: () => void;
}) {
  const s = useMemo(() => makeCompareStyles(props.theme), [props.theme]);
  const [setsOpen, setSetsOpen] = useState(false);
  const [sets, setSets] = useState<CompareSet[]>([]);
  const [newSetName, setNewSetName] = useState("");

  useEffect(() => {
    if (!setsOpen) return;
    AsyncStorage.getItem(STORAGE_COMPARE_SETS_KEY).then((raw) => setSets(parseSets(raw))).catch(() => {});
  }, [setsOpen]);

  const ranked = useMemo(() => {
    if (!props.data) return [];
    return props.data.countries
      .filter((country) => isEuropeanCountry(country.country))
      .map((country) => ({ country: country.country, price: getFuelPrice(country, props.fuelType) }))
      .filter((row): row is { country: string; price: number } => typeof row.price === "number")
      .sort((a, b) => a.price - b.price);
  }, [props.data, props.fuelType]);
  const rankMap = useMemo(() => new Map(ranked.map((row, index) => [row.country, index + 1])), [ranked]);

  const rows = useMemo(() => {
    const byName = new Map(props.data?.countries.map((country) => [country.country, country]) ?? []);
    return props.compareCountries.map((country) => {
      const eur = getFuelPrice(byName.get(country) ?? null, props.fuelType);
      const currency = getCurrencyForCountry(country);
      const local = hasRate(currency, props.fxRates) ? convertEur(eur, currency, props.fxRates) : null;
      const primary = props.currencyMode === "local" && local != null ? formatMoney(local, currency) : formatMoney(eur, "EUR");
      const secondary = props.currencyMode === "local" && local != null ? formatMoney(eur, "EUR") : local != null ? formatMoney(local, currency) : null;
      return { country, eur, primary, secondary, rank: rankMap.get(country) ?? null, delta: getWeeklyDeltaEur(props.trends, country, props.fuelType) };
    });
  }, [props.compareCountries, props.data, props.fuelType, props.currencyMode, props.fxRates, props.trends, rankMap]);

  const priced = rows.filter((row): row is typeof row & { eur: number } => typeof row.eur === "number");
  const cheapest = priced.length ? priced.reduce((best, row) => row.eur < best.eur ? row : best, priced[0]) : null;
  const highest = priced.length ? Math.max(...priced.map((row) => row.eur)) : null;
  const spread = cheapest && highest != null ? highest - cheapest.eur : null;
  const canAdd = props.compareCountries.length < props.maxCompare;
  const atFreeLimit = props.maxCompare === 3 && props.compareCountries.length >= 3;
  const canSave = props.compareCountries.length >= 2 && !!newSetName.trim();

  const persistSets = async (next: CompareSet[]) => {
    setSets(next);
    await AsyncStorage.setItem(STORAGE_COMPARE_SETS_KEY, JSON.stringify(next));
  };
  const saveCurrent = async () => {
    if (!canSave) return;
    const next = [{ id: `${Date.now()}`, name: newSetName.trim(), countries: props.compareCountries.slice(0, props.maxCompare), savedAtUtc: new Date().toISOString() }, ...sets].slice(0, 30);
    await persistSets(next);
    setNewSetName("");
  };

  return (
    <View style={s.wrap}>
      <View style={s.hero} accessible accessibilityLabel={`${props.t.compareOverview}. ${cheapest ? `${props.t.bestValue}: ${cheapest.country}` : props.t.compareEmpty}`}>
        <View style={s.heroTop}>
          <View style={s.heroCopy}>
            <Text style={s.kicker}>{props.t.compareOverview}</Text>
            <Text style={s.heroTitle} numberOfLines={2}>{cheapest?.country ?? props.t.compareTitle}</Text>
            <Text style={s.heroSubtitle}>{cheapest ? `${props.t.bestValue} · ${fuelLabel(props.fuelType, props.t)}${props.data?.as_of ? ` · ${props.t.lastUpdated} ${props.data.as_of}` : ""}` : props.t.compareHint}</Text>
          </View>
          <View style={s.heroIcon}><Ionicons name="speedometer-outline" size={31} color={props.theme.colors.primary} /></View>
        </View>
        <View style={s.metrics}>
          <Metric label={props.t.selectedCountries} value={`${props.compareCountries.length}/${props.maxCompare}`} />
          <Metric label={props.t.spread} value={spread != null ? formatMoney(spread, "EUR") : "—"} />
          <Metric label={props.t.currency} value={props.currencyMode === "local" ? props.t.currencyLocal : "EUR"} />
        </View>
      </View>

      <View style={s.actionRow}>
        <AnimatedPressable onPress={() => setSetsOpen(true)} contentStyle={s.secondaryButton} accessibilityLabel={props.t.savedSets} reduceMotion={props.theme.motion.reduced}>
          <Ionicons name="bookmark-outline" size={18} color={props.theme.colors.text} /><Text style={s.secondaryButtonText}>{props.t.savedSets}</Text>
        </AnimatedPressable>
        <AnimatedPressable onPress={atFreeLimit ? props.onUnlockPress : props.onAddPress} disabled={!canAdd && !atFreeLimit} contentStyle={[s.primaryButton, !canAdd && !atFreeLimit ? s.disabled : null]} accessibilityLabel={atFreeLimit ? props.t.unlockCompare : props.t.addCountry} accessibilityState={{ disabled: !canAdd && !atFreeLimit }} reduceMotion={props.theme.motion.reduced}>
          <Ionicons name={atFreeLimit ? "lock-closed-outline" : "add"} size={19} color={props.theme.colors.primaryText} /><Text style={s.primaryButtonText}>{atFreeLimit ? props.t.unlockCompare : props.t.addCountry}</Text>
        </AnimatedPressable>
      </View>

      <View style={s.limitNote}>
        <Ionicons name={canAdd ? "information-circle-outline" : "lock-closed-outline"} size={17} color={props.theme.colors.muted} />
        <Text style={s.limitText}>{atFreeLimit ? props.t.unlockCompare : canAdd ? props.t.compareLimitHint(props.maxCompare) : props.t.maxCompareReachedN(props.maxCompare)}</Text>
      </View>

      {props.compareCountries.length ? (
        <View>
          <Text style={s.sectionTitle}>{props.t.selectedCountries}</Text>
          <View style={s.chips}>
            {props.compareCountries.map((country) => (
              <AnimatedPressable key={country} onPress={() => props.onRemove(country)} contentStyle={s.countryChip} accessibilityLabel={`${props.t.remove} ${country}`}>
                <Text style={s.chipFlag}>{getFlagForCountry(country)}</Text><Text style={s.chipText} numberOfLines={1}>{country}</Text><Ionicons name="close" size={15} color={props.theme.colors.muted} />
              </AnimatedPressable>
            ))}
          </View>
        </View>
      ) : (
        <View style={s.empty}>
          <View style={s.emptyIcon}><Ionicons name="git-compare-outline" size={28} color={props.theme.colors.primary} /></View>
          <Text style={s.emptyTitle}>{props.t.compareEmpty}</Text><Text style={s.emptyText}>{props.t.compareHint}</Text>
          <AnimatedPressable onPress={props.onAddPress} contentStyle={s.emptyButton} accessibilityLabel={props.t.addCountry}>
            <Ionicons name="add" size={19} color={props.theme.colors.primaryText} /><Text style={s.primaryButtonText}>{props.t.addCountry}</Text>
          </AnimatedPressable>
        </View>
      )}

      {rows.length ? (
        <View style={s.rows}>
          {rows.map((row) => {
            const difference = cheapest && row.eur != null ? Math.max(0, row.eur - cheapest.eur) : null;
            const fill = spread && difference != null ? Math.max(4, (difference / spread) * 100) : 4;
            const isBest = difference != null && difference < 0.001;
            return (
              <View key={row.country} style={[s.row, isBest ? s.bestRow : null]} accessible accessibilityLabel={`${row.country}, ${row.primary}, ${isBest ? props.t.bestValue : `${props.t.differenceFromBest} ${formatMoney(difference, "EUR")}`}`}>
                <View style={s.rowTop}>
                  <View style={[s.rank, isBest ? s.bestRank : null]}><Text style={s.rankText}>{row.rank ? `#${row.rank}` : "—"}</Text></View>
                  <View style={s.rowCopy}><Text style={s.country} numberOfLines={1}>{getFlagForCountry(row.country)} {row.country}</Text><Text style={s.secondary}>{row.secondary ?? props.t.fxUnavailable}</Text></View>
                  <View style={s.priceCopy}><Text style={s.price}>{row.primary}</Text>{isBest ? <Text style={s.bestText}>{props.t.bestValue}</Text> : difference != null ? <Text style={s.diffText}>+{formatMoney(difference, "EUR")}</Text> : null}</View>
                </View>
                <View style={s.track}><View style={[s.trackFill, { width: `${fill}%` }]} /></View>
                <View style={s.deltaRow}><Text style={s.deltaLabel}>{props.t.trendVsLastWeek}</Text><Text style={[s.delta, row.delta != null && row.delta > 0 ? s.deltaUp : row.delta != null && row.delta < 0 ? s.deltaDown : null]}>{row.delta == null ? "—" : `${row.delta > 0 ? "+" : ""}${formatMoney(row.delta, "EUR")}`}</Text></View>
              </View>
            );
          })}
        </View>
      ) : null}

      <CompareTrendCard theme={props.theme} t={props.t} trends={props.trends} countries={props.compareCountries} fuelType={props.fuelType} />

      <BottomSheet theme={props.theme} open={setsOpen} title={props.t.compareSetsTitle} closeLabel={props.t.close} onClose={() => setSetsOpen(false)}>
        <View style={s.sheetContent}>
          <Text style={s.sheetLabel}>{props.t.saveCurrentSet}</Text>
          <TextInput value={newSetName} onChangeText={setNewSetName} placeholder={props.t.setNamePlaceholder} placeholderTextColor={props.theme.colors.muted} style={s.input} accessibilityLabel={props.t.setNamePlaceholder} />
          {props.compareCountries.length < 2 ? <Text style={s.validation}>{props.t.saveTwoCountries}</Text> : null}
          <AnimatedPressable onPress={saveCurrent} disabled={!canSave} contentStyle={[s.saveButton, !canSave ? s.disabled : null]} accessibilityLabel={props.t.save} accessibilityState={{ disabled: !canSave }}>
            <Ionicons name="save-outline" size={18} color={props.theme.colors.primaryText} /><Text style={s.primaryButtonText}>{props.t.save}</Text>
          </AnimatedPressable>
          <View style={s.sheetDivider} />
          <Text style={s.sheetLabel}>{props.t.savedSets}</Text>
          {sets.length ? sets.map((set) => (
            <View key={set.id} style={s.setRow}>
              <View style={s.setCopy}><Text style={s.setName} numberOfLines={1}>{set.name}</Text><Text style={s.setCountries} numberOfLines={2}>{set.countries.join(" · ")}</Text></View>
              <AnimatedPressable onPress={() => { props.onApplySet?.(set.countries.slice(0, props.maxCompare)); setSetsOpen(false); }} contentStyle={s.setAction} accessibilityLabel={`${props.t.open} ${set.name}`}><Ionicons name="play" size={17} color={props.theme.colors.primary} /></AnimatedPressable>
              <AnimatedPressable onPress={() => persistSets(sets.filter((item) => item.id !== set.id))} contentStyle={s.setAction} accessibilityLabel={`${props.t.remove} ${set.name}`}><Ionicons name="trash-outline" size={17} color={props.theme.colors.danger} /></AnimatedPressable>
            </View>
          )) : <Text style={s.emptySets}>{props.t.noSavedSets}</Text>}
        </View>
      </BottomSheet>
    </View>
  );

  function Metric({ label, value }: { label: string; value: string }) {
    return <View style={s.metric}><Text style={s.metricValue} numberOfLines={1} adjustsFontSizeToFit>{value}</Text><Text style={s.metricLabel} numberOfLines={2}>{label}</Text></View>;
  }
}
