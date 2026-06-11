import React, { useMemo, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";

import { useApp } from "../context/AppContext";
import { makeHomeStyles } from "./HomeScreen.styles";

import FuelCard from "../components/fuel/FuelCard";
import ErrorCard from "../components/feedback/ErrorCard";
import CountrySearchModal from "../components/country/CountrySearchModal";
import AnimatedPressable from "../components/ui/AnimatedPressable";

import type { FuelType } from "../types/fuel";
import { convertEur, getCurrencyForCountry } from "../utils/currency";
import { fuelLabel, getFuelPrice } from "../utils/fuel";
import { formatMoney, hasRate } from "../utils/money";
import { getFlagForCountry } from "../utils/countryFlag";

type IconName = React.ComponentProps<typeof Ionicons>["name"];
type Sentiment = "good" | "bad" | "neutral";
type ShortcutRoute = "Stations" | "Compare" | "Settings";

const fuelIcons: Record<FuelType, IconName> = {
  gasoline95: "car-sport-outline",
  diesel: "trail-sign-outline",
  lpg: "flame-outline"
};

function homeCopy(lang: "en" | "sq") {
  if (lang === "sq") {
    return {
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
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const s = useMemo(() => makeHomeStyles(ctx.theme), [ctx.theme]);

  const [countryModalOpen, setCountryModalOpen] = useState(false);

  const copy = useMemo(() => homeCopy(ctx.lang), [ctx.lang]);
  const flag = useMemo(() => getFlagForCountry(ctx.country), [ctx.country]);
  const currency = useMemo(() => getCurrencyForCountry(ctx.country), [ctx.country]);
  const isLightTheme = ctx.theme.name === "light";
  const lightHero = isLightTheme;
  const heroIconColor = lightHero ? ctx.theme.colors.linkText : "#FFFFFF";
  const heroActionIconColor = lightHero ? ctx.theme.colors.primaryText : "#FFFFFF";
  const activeFuelIconColor = lightHero ? ctx.theme.colors.primaryText : "#052E2B";
  const inactiveFuelIconColor = lightHero ? ctx.theme.colors.muted : "rgba(255,255,255,0.74)";

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
  const sourceLabel = ctx.data?.source ? ctx.t.homeVerified : copy.noData;

  const shortcuts: Array<{
    route: ShortcutRoute;
    icon: IconName;
    title: string;
    subtitle: string;
    tone: "blue" | "green" | "amber";
  }> = [
    {
      route: "Stations",
      icon: "navigate-outline",
      title: ctx.t.stationsTitle,
      subtitle: ctx.t.homeNearbySubtitle,
      tone: "blue"
    },
    {
      route: "Compare",
      icon: "git-compare-outline",
      title: ctx.t.compareTitle,
      subtitle: ctx.t.homeCompareSubtitle,
      tone: "green"
    },
    {
      route: "Compare",
      icon: "podium-outline",
      title: ctx.t.rankingsTitle,
      subtitle: ctx.t.homeRankingsSubtitle,
      tone: "amber"
    }
  ];

  return (
    <View style={s.screen}>
      <View pointerEvents="none" style={s.bgGlowPrimary} />
      <View pointerEvents="none" style={s.bgGlowSecondary} />

      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={ctx.refreshing} onRefresh={ctx.refreshAll} tintColor={ctx.theme.colors.primary} />}
      >
        <View style={s.topBar}>
          <View style={s.topTitleWrap}>
            <Text style={s.topEyebrow} numberOfLines={1}>
              {ctx.t.homeDashboard}
            </Text>
            <Text style={s.topTitle} numberOfLines={1}>
              {ctx.t.title}
            </Text>
            <Text style={s.topUpdated} numberOfLines={1}>
              {updatedLabel ? `${ctx.t.lastUpdated}: ${updatedLabel}` : ctx.t.subtitleLoading}
            </Text>
          </View>

          <View style={s.topActions}>
            <View style={s.statusPill}>
              <Ionicons name={statusIcon} size={13} color={ctx.theme.colors.linkText} />
              <Text style={s.statusPillText} numberOfLines={1}>
                {statusLabel}
              </Text>
            </View>

            <AnimatedPressable
              onPress={ctx.openFeedback}
              contentStyle={s.topIconBtn}
              scaleIn={0.96}
            >
              <Ionicons name="mail-outline" size={18} color={ctx.theme.colors.text} />
            </AnimatedPressable>

            <AnimatedPressable
              onPress={() => ctx.openRewardModal()}
              contentStyle={[s.topIconBtn, ctx.canAskReward && !ctx.reward.unlocked ? s.topIconBtnAccent : null]}
              scaleIn={0.96}
              disabled={!ctx.canAskReward || ctx.reward.unlocked}
            >
              <Ionicons
                name={ctx.reward.unlocked ? "checkmark-circle" : "gift-outline"}
                size={18}
                color={ctx.reward.unlocked ? ctx.theme.colors.primary : ctx.theme.colors.text}
              />
            </AnimatedPressable>
          </View>
        </View>

        <View style={s.hero}>
          <View pointerEvents="none" style={s.heroAura} />
          <View pointerEvents="none" style={s.heroBandTop} />
          <View pointerEvents="none" style={s.heroBandBottom} />

          <View style={s.heroTopRow}>
            <View style={s.heroBrandRow}>
              <View style={s.heroIcon}>
                <Ionicons name="speedometer-outline" size={20} color={heroIconColor} />
              </View>

              <View style={s.heroTitleWrap}>
                <Text style={s.heroEyebrow} numberOfLines={1}>
                  {ctx.t.homeLivePrice}
                </Text>
                <View style={s.countryLine}>
                  {flag ? <Text style={s.countryFlag}>{flag}</Text> : null}
                  <Text style={s.heroCountry} numberOfLines={1}>
                    {ctx.country}
                  </Text>
                </View>
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

          <View style={s.heroPriceBlock}>
            <Text style={s.heroFuel} numberOfLines={1}>
              {hero.fuelName}
            </Text>
            <Text style={s.heroPrice} adjustsFontSizeToFit numberOfLines={1}>
              {hero.price}
            </Text>
            <Text style={s.heroSubline} numberOfLines={1}>
              {hero.secondaryPrice ?? (ctx.data ? ctx.t.subtitleAsOf(ctx.data.as_of) : ctx.t.subtitleLoading)}
            </Text>
          </View>

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

          <View style={s.favoriteRailWrap}>
            {ctx.favorites.length ? (
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
            ) : (
              <AnimatedPressable onPress={() => setCountryModalOpen(true)} contentStyle={s.emptyFavoriteCta} scaleIn={0.98}>
                <Ionicons name="star-outline" size={16} color={heroIconColor} />
                <Text style={s.emptyFavoriteText} numberOfLines={1}>
                  {ctx.t.homeAddFavorites}
                </Text>
              </AnimatedPressable>
            )}
          </View>
        </View>

        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>{ctx.t.homeInsights}</Text>
          <Text style={s.sectionSub} numberOfLines={1}>
            {ctx.t.homeMarketMoves}
          </Text>
        </View>

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
          <InsightTile
            icon={ctx.isFromCache ? "cloud-offline-outline" : "shield-checkmark-outline"}
            label={ctx.isFromCache ? ctx.t.homeFreshness : ctx.t.homeConfidence}
            value={ctx.isFromCache ? statusLabel : sourceLabel}
            caption={updatedLabel ?? ctx.t.showingCached}
            tone="blue"
            sentiment={ctx.isFromCache ? "neutral" : "good"}
          />
        </View>

        <View style={s.shortcutGrid}>
          {shortcuts.map((item) => (
            <ShortcutCard
              key={`${item.title}-${item.icon}`}
              icon={item.icon}
              title={item.title}
              subtitle={item.subtitle}
              tone={item.tone}
              onPress={() => navigation.navigate(item.route)}
            />
          ))}
        </View>

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

  function ShortcutCard(props: {
    icon: IconName;
    title: string;
    subtitle: string;
    tone: "blue" | "green" | "amber";
    onPress: () => void;
  }) {
    return (
      <AnimatedPressable onPress={props.onPress} contentStyle={s.shortcutCard} scaleIn={0.97}>
        <View style={[s.shortcutIcon, s[`insightIcon_${props.tone}`]]}>
          <Ionicons name={props.icon} size={19} color={ctx.theme.colors.text} />
        </View>
        <View style={s.shortcutTextWrap}>
          <Text style={s.shortcutTitle} numberOfLines={1}>
            {props.title}
          </Text>
          <Text style={s.shortcutSub} numberOfLines={2}>
            {props.subtitle}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={17} color={ctx.theme.colors.muted} />
      </AnimatedPressable>
    );
  }
}
