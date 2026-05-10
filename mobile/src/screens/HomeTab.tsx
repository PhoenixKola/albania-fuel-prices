import React, { useMemo, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useApp } from "../context/AppContext";
import { makeHomeStyles } from "./HomeScreen.styles";

import QuickSwitchCard from "../components/layout/QuickSwitchCard";
import FuelCard from "../components/fuel/FuelCard";
import ErrorCard from "../components/feedback/ErrorCard";
import CountrySearchModal from "../components/country/CountrySearchModal";
import FeedbackCurrencyBar from "../components/layout/FeedbackCurrencyBar";
import AnimatedPressable from "../components/ui/AnimatedPressable";

import type { FuelType } from "../types/fuel";
import { convertEur, getCurrencyForCountry } from "../utils/currency";
import { fuelLabel, getFuelPrice } from "../utils/fuel";
import { formatMoney, hasRate } from "../utils/money";
import { getFlagForCountry } from "../utils/countryFlag";

type IconName = React.ComponentProps<typeof Ionicons>["name"];
type Sentiment = "good" | "bad" | "neutral";

const fuelIcons: Record<FuelType, IconName> = {
  gasoline95: "car-sport-outline",
  diesel: "trail-sign-outline",
  lpg: "flame-outline"
};

function homeCopy(lang: "en" | "sq") {
  if (lang === "sq") {
    return {
      snapshot: "Pamje e shpejte",
      updated: "Perditesuar",
      favorites: "Te preferuarat",
      live: "Live",
      cached: "Cache",
      loading: "Po ngarkohet",
      rank: "Renditja",
      europeAvg: "Mesatarja EU",
      trend: "Ndryshimi",
      noData: "Pa te dhena",
      noPrevious: "Pa krahasim",
      belowAvg: "Nen mesatare",
      aboveAvg: "Mbi mesatare",
      nearAvg: "Afer mesatares",
      cheaper: "Me lire se me pare",
      higher: "Me shtrenjte se me pare",
      stable: "I qendrueshem",
      outOf: (total: number) => `nga ${total}`
    };
  }

  return {
    snapshot: "Fuel snapshot",
    updated: "Updated",
    favorites: "Favorites",
    live: "Live",
    cached: "Cached",
    loading: "Loading",
    rank: "Rank",
    europeAvg: "Europe avg",
    trend: "Trend",
    noData: "No data",
    noPrevious: "No previous data",
    belowAvg: "Below average",
    aboveAvg: "Above average",
    nearAvg: "Near average",
    cheaper: "Cheaper than before",
    higher: "Higher than before",
    stable: "Holding steady",
    outOf: (total: number) => `of ${total}`
  };
}

export default function HomeTab() {
  const ctx = useApp();
  const s = useMemo(() => makeHomeStyles(ctx.theme), [ctx.theme]);

  const [countryModalOpen, setCountryModalOpen] = useState(false);

  const copy = useMemo(() => homeCopy(ctx.lang), [ctx.lang]);
  const flag = useMemo(() => getFlagForCountry(ctx.country), [ctx.country]);
  const currency = useMemo(() => getCurrencyForCountry(ctx.country), [ctx.country]);
  const isLightTheme = ctx.theme.name === "light";
  const heroIconColor = isLightTheme ? ctx.theme.colors.linkText : "#FFFFFF";
  const heroActionIconColor = isLightTheme ? ctx.theme.colors.primaryText : "#FFFFFF";
  const inactiveFuelIconColor = isLightTheme ? ctx.theme.colors.muted : "rgba(255,255,255,0.78)";
  const activeFuelIconColor = isLightTheme ? ctx.theme.colors.primaryText : "#111827";

  const fuelOptions = useMemo(
    () => [
      { key: "diesel" as FuelType, label: ctx.t.diesel, icon: fuelIcons.diesel },
      { key: "gasoline95" as FuelType, label: ctx.t.gasoline95, icon: fuelIcons.gasoline95 },
      { key: "lpg" as FuelType, label: ctx.t.lpg, icon: fuelIcons.lpg }
    ],
    [ctx.t]
  );

  const hero = useMemo(() => {
    const selectedEur = getFuelPrice(ctx.selected, ctx.fuelType);
    const displayCurrency = ctx.effectiveCurrencyMode === "local" ? currency : "EUR";
    const displayValue =
      ctx.effectiveCurrencyMode === "local" ? convertEur(selectedEur, currency, ctx.fxRates) : selectedEur;

    const allPrices =
      ctx.data?.countries
        ?.map((country) => getFuelPrice(country, ctx.fuelType))
        .filter((price): price is number => typeof price === "number" && Number.isFinite(price)) ?? [];

    const total = allPrices.length;
    const averageEur = total ? allPrices.reduce((sum, price) => sum + price, 0) / total : null;
    const rank =
      selectedEur != null && Number.isFinite(selectedEur) && total
        ? allPrices.filter((price) => price < selectedEur).length + 1
        : null;

    const avgDiff = selectedEur != null && averageEur != null ? selectedEur - averageEur : null;
    const avgDisplay =
      ctx.effectiveCurrencyMode === "local"
        ? convertEur(averageEur, currency, ctx.fxRates)
        : averageEur;

    const previousEur = getFuelPrice(ctx.prevSelected, ctx.fuelType);
    const deltaEur = selectedEur != null && previousEur != null ? selectedEur - previousEur : null;
    const deltaDisplay =
      ctx.effectiveCurrencyMode === "local"
        ? convertEur(Math.abs(deltaEur ?? 0), currency, ctx.fxRates)
        : Math.abs(deltaEur ?? 0);

    const deltaText =
      deltaEur == null || Math.abs(deltaEur) < 0.0001
        ? null
        : `${deltaEur > 0 ? "+" : "-"}${formatMoney(deltaDisplay, displayCurrency)}`;

    const avgCaption =
      avgDiff == null || Math.abs(avgDiff) < 0.0001
        ? copy.nearAvg
        : avgDiff < 0
          ? copy.belowAvg
          : copy.aboveAvg;

    const trendCaption =
      deltaEur == null
        ? copy.noPrevious
        : Math.abs(deltaEur) < 0.0001
          ? copy.stable
          : deltaEur < 0
            ? copy.cheaper
            : copy.higher;
    const rankTone: Sentiment =
      rank && total ? (rank <= Math.ceil(total / 3) ? "good" : rank > Math.ceil((total * 2) / 3) ? "bad" : "neutral") : "neutral";
    const averageTone: Sentiment = avgDiff == null || Math.abs(avgDiff) < 0.0001 ? "neutral" : avgDiff < 0 ? "good" : "bad";
    const trendTone: Sentiment = deltaEur == null || Math.abs(deltaEur) < 0.0001 ? "neutral" : deltaEur < 0 ? "good" : "bad";

    return {
      fuelName: fuelLabel(ctx.fuelType, ctx.t),
      price: formatMoney(displayValue, displayCurrency),
      secondaryPrice:
        ctx.effectiveCurrencyMode === "local" && currency !== "EUR" && hasRate(currency, ctx.fxRates)
          ? formatMoney(selectedEur, "EUR")
          : null,
      rankValue: rank ? `#${rank}` : "--",
      rankCaption: total ? copy.outOf(total) : copy.noData,
      rankTone,
      averageValue: formatMoney(avgDisplay, displayCurrency),
      averageCaption: avgCaption,
      averageTone,
      trendValue: deltaText ?? "--",
      trendCaption: trendCaption,
      trendTone
    };
  }, [
    copy,
    ctx.data,
    ctx.effectiveCurrencyMode,
    ctx.fuelType,
    ctx.fxRates,
    ctx.prevSelected,
    ctx.selected,
    ctx.t,
    currency
  ]);

  const statusLabel = ctx.loading ? copy.loading : ctx.isFromCache ? copy.cached : copy.live;
  const statusIcon: IconName = ctx.loading ? "time-outline" : ctx.isFromCache ? "cloud-offline-outline" : "pulse-outline";
  const updatedLabel = ctx.data?.as_of ?? null;

  return (
    <View style={s.screen}>
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={ctx.refreshing} onRefresh={ctx.refreshAll} />}
      >
        <View style={s.hero}>
          <View style={s.heroBandTop} />
          <View style={s.heroBandBottom} />

          <View style={s.heroTopRow}>
            <View style={s.heroBrandRow}>
              <View style={s.heroIcon}>
                <Ionicons name="flame-outline" size={20} color={heroIconColor} />
              </View>

              <View style={s.heroTitleWrap}>
                <Text style={s.heroEyebrow} numberOfLines={1}>
                  {copy.snapshot}
                </Text>
                <Text style={s.heroTitle} numberOfLines={2}>
                  {ctx.t.title}
                </Text>
              </View>
            </View>

            <View style={s.heroStatus}>
              <Ionicons name={statusIcon} size={14} color={heroIconColor} />
              <Text style={s.heroStatusText} numberOfLines={1}>
                {statusLabel}
              </Text>
            </View>
          </View>

          <View style={s.heroMainRow}>
            <View style={s.heroPriceBlock}>
              <View style={s.countryLine}>
                {flag ? <Text style={s.countryFlag}>{flag}</Text> : null}
                <Text style={s.heroCountry} numberOfLines={1}>
                  {ctx.country}
                </Text>
              </View>

              <Text style={s.heroFuel} numberOfLines={1}>
                {hero.fuelName}
              </Text>
              <Text style={s.heroPrice} adjustsFontSizeToFit numberOfLines={1}>
                {hero.price}
              </Text>
              <View style={s.heroMetaRow}>
                <Text style={s.heroSubline} numberOfLines={1}>
                  {hero.secondaryPrice ?? (ctx.data ? ctx.t.subtitleAsOf(ctx.data.as_of) : ctx.t.subtitleLoading)}
                </Text>
                {updatedLabel ? (
                  <View style={s.freshBadge}>
                    <Ionicons name="calendar-clear-outline" size={12} color={heroIconColor} />
                    <Text style={s.freshBadgeText} numberOfLines={1}>
                      {copy.updated} {updatedLabel}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>

            <AnimatedPressable
              onPress={() => setCountryModalOpen(true)}
              contentStyle={s.heroSearchBtn}
              scaleIn={0.96}
              hitSlop={8}
            >
              <Ionicons name="search" size={22} color={heroActionIconColor} />
            </AnimatedPressable>
          </View>

          {ctx.favorites.length ? (
            <View style={s.heroFavoritesBlock}>
              <Text style={s.heroFavoritesLabel} numberOfLines={1}>
                {copy.favorites}
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.heroFavoritesRow}>
                {ctx.favorites.slice(0, 8).map((country) => {
                  const active = country === ctx.country;
                  return (
                    <AnimatedPressable
                      key={country}
                      onPress={() => ctx.setCountryTracked(country)}
                      contentStyle={[s.heroFavoritePill, active ? s.heroFavoritePillActive : null]}
                      scaleIn={0.97}
                    >
                      <Text style={[s.heroFavoriteText, active ? s.heroFavoriteTextActive : null]} numberOfLines={1}>
                        {getFlagForCountry(country) ? `${getFlagForCountry(country)} ` : ""}
                        {country}
                      </Text>
                    </AnimatedPressable>
                  );
                })}
              </ScrollView>
            </View>
          ) : null}

          <View style={s.fuelSelector}>
            {fuelOptions.map((option) => {
              const active = option.key === ctx.fuelType;
              return (
                <AnimatedPressable
                  key={option.key}
                  onPress={() => ctx.setFuelType(option.key)}
                  contentStyle={[s.fuelChip, active ? s.fuelChipActive : null]}
                  scaleIn={0.97}
                >
                  <Ionicons name={option.icon} size={16} color={active ? activeFuelIconColor : inactiveFuelIconColor} />
                  <Text style={[s.fuelChipText, active ? s.fuelChipTextActive : null]} numberOfLines={1}>
                    {option.label}
                  </Text>
                </AnimatedPressable>
              );
            })}
          </View>
        </View>

        <FeedbackCurrencyBar
          theme={ctx.theme}
          t={ctx.t}
          onFeedbackPress={ctx.openFeedback}
          onUnlockPress={() => ctx.openRewardModal()}
          unlockDisabled={!ctx.canAskReward || ctx.reward.unlocked}
          rewardUnlocked={ctx.reward.unlocked}
          headerBtnStyle={s.headerBtn}
          headerBtnTextStyle={s.headerBtnText}
        />

        <View style={s.insightGrid}>
          <InsightTile
            icon="trophy-outline"
            label={copy.rank}
            value={hero.rankValue}
            caption={hero.rankCaption}
            tone="blue"
            sentiment={hero.rankTone}
          />
          <InsightTile
            icon="analytics-outline"
            label={copy.europeAvg}
            value={hero.averageValue}
            caption={hero.averageCaption}
            tone="green"
            sentiment={hero.averageTone}
          />
          <InsightTile
            icon="trending-up-outline"
            label={copy.trend}
            value={hero.trendValue}
            caption={hero.trendCaption}
            tone="amber"
            sentiment={hero.trendTone}
          />
        </View>

        <QuickSwitchCard
          theme={ctx.theme}
          t={ctx.t}
          favorites={ctx.favorites}
          currentCountry={ctx.country}
          onEdit={() => setCountryModalOpen(true)}
          onSelect={(c: any) => ctx.setCountryTracked(c)}
        />

        {ctx.error ? (
          <ErrorCard theme={ctx.theme} title={ctx.t.couldntLoad} message={ctx.error} cta={ctx.t.tryAgain} onPress={ctx.refreshAll} />
        ) : null}

        <FuelCard
          theme={ctx.theme}
          t={ctx.t}
          data={ctx.data}
          selected={ctx.selected}
          prevSelected={ctx.prevSelected}
          loading={ctx.loading}
          country={ctx.country}
          fuelType={ctx.fuelType}
          currencyMode={ctx.effectiveCurrencyMode}
          setCurrencyMode={ctx.setCurrencyMode}
          fxRates={ctx.fxRates}
          isFromCache={ctx.isFromCache}
          cacheSavedAtUtc={ctx.cacheSavedAtUtc}
          refreshing={ctx.refreshing}
          onRefresh={ctx.refreshAll}
          onOpenCountrySearch={() => setCountryModalOpen(true)}
        />
      </ScrollView>

      <CountrySearchModal
        theme={ctx.theme}
        open={countryModalOpen}
        title={ctx.t.changeCountry}
        placeholder={ctx.t.searchPlaceholder}
        closeLabel={ctx.t.close}
        selectedLabel={ctx.t.selected}
        countries={ctx.countries}
        value={ctx.country}
        favorites={ctx.favorites}
        onToggleFavorite={ctx.toggleFavorite}
        onClose={() => setCountryModalOpen(false)}
        onSelect={(c) => {
          ctx.setCountryTracked(c);
          setCountryModalOpen(false);
        }}
      />
    </View>
  );

  function InsightTile(props: {
    icon: IconName;
    label: string;
    value: string;
    caption: string;
    tone: "blue" | "green" | "amber";
    sentiment: Sentiment;
  }) {
    const sentimentStyle =
      props.sentiment === "good" ? s.insightValueGood : props.sentiment === "bad" ? s.insightValueBad : null;

    return (
      <View style={s.insightCard}>
        <View style={[s.insightIcon, s[`insightIcon_${props.tone}`]]}>
          <Ionicons name={props.icon} size={17} color={ctx.theme.colors.text} />
        </View>

        <Text style={s.insightLabel} numberOfLines={1}>
          {props.label}
        </Text>
        <Text style={[s.insightValue, sentimentStyle]} adjustsFontSizeToFit numberOfLines={1}>
          {props.value}
        </Text>
        <Text style={s.insightCaption} numberOfLines={2}>
          {props.caption}
        </Text>
      </View>
    );
  }
}
