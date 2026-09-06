import React, { useEffect, useMemo, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useApp } from "../context/AppContext";
import type { FuelType } from "../types/fuel";
import PremiumHeader from "../components/ui/PremiumHeader";
import SegmentedControl from "../components/ui/SegmentedControl";
import AnimatedPressable from "../components/ui/AnimatedPressable";
import CountrySearchModal from "../components/country/CountrySearchModal";
import { getFuelPrice } from "../utils/fuel";
import { isEuropeanCountry } from "../utils/regions";
import { formatFuelPrice } from "../utils/priceDisplay";
import { formatMoney } from "../utils/money";
import { getFlagForCountry } from "../utils/countryFlag";
import { getWeeklyDeltaEur } from "../hooks/useTrends";
import { makeRankingsTabStyles } from "./RankingsTab.styles";

type Scope = "europe" | "favorites";
type Mode = "cheapest" | "expensive";
type RankRow = { country: string; price: number; rank: number };

export default function RankingsTab() {
  const ctx = useApp();
  const s = useMemo(() => makeRankingsTabStyles(ctx.theme), [ctx.theme]);
  const [scope, setScope] = useState<Scope>("europe");
  const [mode, setMode] = useState<Mode>("cheapest");
  const [favoritesOpen, setFavoritesOpen] = useState(false);

  const fuelItems = useMemo(() => [
    { value: "diesel" as FuelType, label: ctx.t.diesel },
    { value: "gasoline95" as FuelType, label: ctx.t.gasoline95 },
    { value: "lpg" as FuelType, label: ctx.t.lpg },
  ], [ctx.t]);
  const scopeItems = useMemo(() => [
    { value: "europe" as Scope, label: ctx.t.scopeEurope },
    { value: "favorites" as Scope, label: ctx.t.favorites },
  ], [ctx.t]);

  const europe = useMemo(() => {
    return (ctx.data?.countries ?? [])
      .filter((country) => isEuropeanCountry(country.country))
      .map((country) => ({ country: country.country, price: getFuelPrice(country, ctx.fuelType) }))
      .filter((row): row is { country: string; price: number } => typeof row.price === "number")
      .sort((a, b) => a.price - b.price)
      .map((row, index) => ({ ...row, rank: index + 1 }));
  }, [ctx.data, ctx.fuelType]);

  const favoritesSet = useMemo(() => new Set(ctx.favorites), [ctx.favorites]);
  const scoped = useMemo(
    () => (scope === "europe" ? europe : europe.filter((row) => favoritesSet.has(row.country))).map((row, index) => ({ ...row, rank: index + 1 })),
    [scope, europe, favoritesSet]
  );
  const displayed = useMemo(() => mode === "cheapest" ? scoped.slice(0, 10) : [...scoped].reverse().slice(0, 10), [mode, scoped]);
  const selected = scoped.find((row) => row.country === ctx.country) ?? null;
  const selectedShown = !!selected && displayed.some((row) => row.country === selected.country);
  const average = scoped.length ? scoped.reduce((sum, row) => sum + row.price, 0) / scoped.length : null;
  const cheapest = scoped[0] ?? null;
  const expensive = scoped[scoped.length - 1] ?? null;

  useEffect(() => {
    if (!ctx.reward.unlocked && mode === "expensive") setMode("cheapest");
  }, [ctx.reward.unlocked, mode]);

  const selectCountry = (country: string) => {
    ctx.setCountryTracked(country);
    ctx.showToast(ctx.t.toastCountrySelected(country));
  };

  const topThree = displayed.slice(0, 3);
  const insufficientFavorites = scope === "favorites" && ctx.favorites.length < 2;
  const header = (
    <View style={s.headerContent}>
      <PremiumHeader theme={ctx.theme} eyebrow={ctx.t.leaderboard} title={ctx.t.rankingsTitle} subtitle={ctx.t.rankingsSubtitle(ctx.t[ctx.fuelType] ?? ctx.fuelType)} icon="podium-outline" />
      <View style={s.snapshot}>
        <View style={s.snapshotTop}>
          <View style={s.snapshotCopy}><Text style={s.snapshotKicker}>{mode === "cheapest" ? ctx.t.cheapestMode : ctx.t.expensiveMode}</Text><Text style={s.snapshotTitle}>{displayed[0] ? `${getFlagForCountry(displayed[0].country)} ${displayed[0].country}` : "—"}</Text></View>
          <View style={s.snapshotPrice}><Text style={s.snapshotPriceText}>{displayed[0] ? formatFuelPrice(displayed[0].country, displayed[0].price, ctx.effectiveCurrencyMode, ctx.fxRates) : "—"}</Text><Text style={s.snapshotPriceSub}>{ctx.t[ctx.fuelType]}</Text></View>
        </View>
        <View style={s.metrics}>
          <Metric label={ctx.t.rankingsCheapTitle} value={cheapest ? formatMoney(cheapest.price, "EUR") : "—"} tone="good" />
          <Metric label={ctx.t.homeEuropeAverage} value={average != null ? formatMoney(average, "EUR") : "—"} />
          <Metric label={ctx.t.rankingsExpensiveTitle} value={expensive ? formatMoney(expensive.price, "EUR") : "—"} tone="warning" />
        </View>
        <View style={s.yourPosition}>
          <View style={s.yourCopy}><Text style={s.yourLabel}>{ctx.t.yourPosition}</Text><Text style={s.yourCountry} numberOfLines={1}>{getFlagForCountry(ctx.country)} {ctx.country}</Text></View>
          <View style={s.rankPill}><Text style={s.rankPillText}>{selected ? `#${selected.rank}` : "—"}</Text><Text style={s.rankPillSub}>/ {scoped.length}</Text></View>
        </View>
      </View>

      <SegmentedControl theme={ctx.theme} value={ctx.fuelType} items={fuelItems} onChange={ctx.setFuelType} />
      <SegmentedControl theme={ctx.theme} value={scope} items={scopeItems} onChange={setScope} />

      {scope === "favorites" && ctx.favorites.length < 2 ? (
        <View style={s.favoriteState}>
          <View style={s.favoriteIcon}><Ionicons name="star-outline" size={24} color={ctx.theme.colors.primary} /></View>
          <View style={s.favoriteCopy}><Text style={s.favoriteTitle}>{ctx.t.rankingsFavoritesTitle}</Text><Text style={s.favoriteText}>{ctx.t.addFavoritesToUseFavoritesRanking}</Text></View>
          <AnimatedPressable onPress={() => setFavoritesOpen(true)} contentStyle={s.manageButton} accessibilityLabel={ctx.t.manageFavorites}><Ionicons name="add" size={20} color={ctx.theme.colors.primary} /></AnimatedPressable>
        </View>
      ) : null}

      <View style={s.modeRow}>
        {(["cheapest", "expensive"] as const).map((value) => {
          const locked = value === "expensive" && !ctx.reward.unlocked;
          const active = mode === value;
          return (
            <AnimatedPressable
              key={value}
              onPress={() => { if (locked) { ctx.openRewardModal(() => setMode("expensive")); return; } setMode(value); }}
              style={s.modeItem}
              contentStyle={[s.modeButton, active ? s.modeActive : null]}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={value === "cheapest" ? ctx.t.cheapestMode : `${ctx.t.expensiveMode}${locked ? `, ${ctx.t.locked}` : ""}`}
            >
              <Ionicons name={locked ? "lock-closed-outline" : value === "cheapest" ? "trending-down-outline" : "trending-up-outline"} size={17} color={active ? ctx.theme.colors.primary : ctx.theme.colors.muted} />
              <Text style={[s.modeText, active ? s.modeTextActive : null]} numberOfLines={1}>{value === "cheapest" ? ctx.t.cheapestMode : ctx.t.expensiveMode}</Text>
            </AnimatedPressable>
          );
        })}
      </View>

      {!insufficientFavorites && topThree.length ? (
        <View>
          <Text style={s.sectionTitle}>{mode === "cheapest" ? ctx.t.rankingsCheapTitle : ctx.t.rankingsExpensiveTitle}</Text>
          <View style={s.podium}>
            {topThree.map((row, index) => <PodiumItem key={row.country} row={row} position={index + 1} />)}
          </View>
        </View>
      ) : null}

      {!insufficientFavorites && displayed.length > 3 ? <Text style={s.sectionTitle}>{ctx.t.leaderboard}</Text> : null}
    </View>
  );

  return (
    <View style={s.screen}>
      <FlatList
        data={insufficientFavorites ? [] : displayed.slice(3)}
        keyExtractor={(row) => `${mode}-${row.country}`}
        renderItem={({ item }) => <RankingRow row={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 9 }} />}
        ListHeaderComponent={header}
        ListEmptyComponent={scope === "favorites" ? null : <View style={s.empty}><Text style={s.emptyText}>{ctx.t.rankUnavailable}</Text></View>}
        ListFooterComponent={!selectedShown && selected ? <View style={s.pinned}><Text style={s.pinnedLabel}>{ctx.t.yourPosition}</Text><RankingRow row={selected} /></View> : <View style={s.footerSpace} />}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={ctx.refreshing} onRefresh={ctx.refreshAll} tintColor={ctx.theme.colors.primary} />}
      />
      <CountrySearchModal theme={ctx.theme} open={favoritesOpen} title={ctx.t.manageFavorites} placeholder={ctx.t.searchPlaceholder} closeLabel={ctx.t.close} selectedLabel={ctx.t.selected} countries={ctx.countries} value={ctx.country} favorites={ctx.favorites} onToggleFavorite={ctx.toggleFavorite} onClose={() => setFavoritesOpen(false)} onSelect={(country) => { ctx.toggleFavorite(country); }} />
    </View>
  );

  function Metric({ label, value, tone }: { label: string; value: string; tone?: "good" | "warning" }) {
    return <View style={s.metric}><Text style={[s.metricValue, tone === "good" ? s.good : tone === "warning" ? s.warning : null]} numberOfLines={1} adjustsFontSizeToFit>{value}</Text><Text style={s.metricLabel} numberOfLines={2}>{label}</Text></View>;
  }

  function PodiumItem({ row, position }: { row: RankRow; position: number }) {
    return <AnimatedPressable onPress={() => selectCountry(row.country)} style={s.podiumItem} contentStyle={[s.podiumCard, position === 1 ? s.podiumFirst : null]} accessibilityLabel={`${position}. ${row.country}, ${formatMoney(row.price, "EUR")}`}>
      <View style={[s.medal, position === 1 ? s.medalGold : position === 2 ? s.medalSilver : s.medalBronze]}><Text style={s.medalText}>{position}</Text></View>
      <Text style={s.podiumFlag}>{getFlagForCountry(row.country)}</Text><Text style={s.podiumCountry} numberOfLines={1}>{row.country}</Text><Text style={s.podiumPrice}>{formatMoney(row.price, "EUR")}</Text>
    </AnimatedPressable>;
  }

  function RankingRow({ row }: { row: RankRow }) {
    const active = row.country === ctx.country;
    const delta = getWeeklyDeltaEur(ctx.trends, row.country, ctx.fuelType);
    const favorite = favoritesSet.has(row.country);
    return <AnimatedPressable onPress={() => selectCountry(row.country)} contentStyle={[s.row, active ? s.rowActive : null]} accessibilityLabel={`${row.rank}. ${row.country}, ${formatFuelPrice(row.country, row.price, ctx.effectiveCurrencyMode, ctx.fxRates)}${delta != null ? `, ${delta > 0 ? "+" : ""}${formatMoney(delta, "EUR")} ${ctx.t.trendVsLastWeek}` : ""}`} accessibilityState={{ selected: active }}>
      <View style={[s.rowRank, row.rank <= 3 ? s.rowRankTop : null]}><Text style={s.rowRankText}>{row.rank}</Text></View>
      <View style={s.rowCopy}><Text style={s.rowCountry} numberOfLines={1}>{getFlagForCountry(row.country)} {row.country}</Text><View style={s.badges}>{active ? <Text style={s.badge}>{ctx.t.you}</Text> : null}{favorite && !active ? <Text style={s.badge}>{ctx.t.favorites}</Text> : null}</View></View>
      <View style={s.rowPrice}><Text style={s.rowPriceText}>{formatFuelPrice(row.country, row.price, ctx.effectiveCurrencyMode, ctx.fxRates)}</Text>{delta != null ? <Text style={[s.rowDelta, delta > 0 ? s.deltaUp : delta < 0 ? s.deltaDown : null]}>{delta > 0 ? "+" : ""}{formatMoney(delta, "EUR")}</Text> : null}</View>
      <Ionicons name="chevron-forward" size={17} color={ctx.theme.colors.muted} />
    </AnimatedPressable>;
  }
}
