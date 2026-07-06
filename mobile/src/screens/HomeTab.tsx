import React, { useMemo, useState } from "react";
import { Modal, RefreshControl, ScrollView, Share, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";

import { useApp } from "../context/AppContext";
import { makeHomeStyles } from "./HomeTab.styles";

import CountrySearchModal from "../components/country/CountrySearchModal";
import FavoritesQuickSheet from "../components/country/FavoritesQuickSheet";
import ErrorCard from "../components/feedback/ErrorCard";
import AnimatedPressable from "../components/ui/AnimatedPressable";
import TrendCard from "../components/fuel/TrendCard";

import type { FuelType } from "../types/fuel";
import { convertEur, getCurrencyForCountry } from "../utils/currency";
import { fuelLabel, getFuelPrice } from "../utils/fuel";
import { formatMoney } from "../utils/money";
import { getFlagForCountry } from "../utils/countryFlag";
import { isEuropeanCountry } from "../utils/regions";
import { getWeeklyDeltaEur } from "../hooks/useTrends";
import { PLAY_STORE_URL } from "../constants/urls";

type IconName = React.ComponentProps<typeof Ionicons>["name"];
type ShortcutRoute = "Stations" | "Compare" | "Rankings" | "Settings";
type Tone = "teal" | "blue" | "violet" | "amber";

const fuelIcons: Record<FuelType, IconName> = {
  gasoline95: "car-sport-outline",
  diesel: "trail-sign-outline",
  lpg: "flame-outline"
};

export default function HomeTab() {
  const ctx = useApp();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const s = useMemo(() => makeHomeStyles(ctx.theme), [ctx.theme]);
  const [quickSheetOpen, setQuickSheetOpen] = useState(false);
  const [countryModalOpen, setCountryModalOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertDirection, setAlertDirection] = useState<"below" | "above">("below");
  const [alertTarget, setAlertTarget] = useState("");

  const isLightTheme = ctx.theme.name === "light";
  const topIconColor = isLightTheme ? "#172033" : "#FFFFFF";
  const searchIconColor = isLightTheme ? "rgba(15,23,42,0.58)" : "rgba(255,255,255,0.72)";
  const accentColor = isLightTheme ? "#0F766E" : "#8DEDE1";
  const actionIconColor = isLightTheme ? "#172033" : "#FFFFFF";
  const fuelInactiveColor = isLightTheme ? "rgba(15,23,42,0.56)" : "rgba(255,255,255,0.72)";
  const fuelActiveColor = isLightTheme ? "#FFFFFF" : "#07111F";
  const refreshTint = isLightTheme ? "#0F766E" : "#8DEDE1";
  const heroGradient = (
    isLightTheme
      ? ["#FFFFFF", "#F0FAF7", "#E7F4F0", "#F7F3EC"]
      : ["#134E4A", "#0E3538", "#0A1F2B", "#07111F"]
  ) as [string, string, string, string];

  const flag = useMemo(() => getFlagForCountry(ctx.country), [ctx.country]);
  const currency = useMemo(() => getCurrencyForCountry(ctx.country), [ctx.country]);
  const currentEurPrice = getFuelPrice(ctx.selected, ctx.fuelType);
  const currentAlert = ctx.priceAlerts.getRule(ctx.country, ctx.fuelType);

  const fuelOptions = useMemo(
    () => [
      { key: "diesel" as FuelType, label: ctx.t.diesel, icon: fuelIcons.diesel },
      { key: "gasoline95" as FuelType, label: ctx.t.gasoline95, icon: fuelIcons.gasoline95 },
      { key: "lpg" as FuelType, label: ctx.t.lpg, icon: fuelIcons.lpg }
    ],
    [ctx.t]
  );

  const dashboard = useMemo(() => {
    const selectedEur = getFuelPrice(ctx.selected, ctx.fuelType);
    const displayCurrency = ctx.effectiveCurrencyMode === "local" ? currency : "EUR";
    const displayValue =
      ctx.effectiveCurrencyMode === "local" ? convertEur(selectedEur, currency, ctx.fxRates) : selectedEur;

    // Europe-only stats: the dataset also carries global reference markets
    // (US, Australia, …) that must not skew the "Europe average" or rank.
    const pricedCountries =
      ctx.data?.countries
        ?.filter((country) => isEuropeanCountry(country.country))
        .map((country) => ({ country: country.country, price: getFuelPrice(country, ctx.fuelType) }))
        .filter((item): item is { country: string; price: number } => typeof item.price === "number" && Number.isFinite(item.price))
        .sort((a, b) => a.price - b.price) ?? [];

    const total = pricedCountries.length;
    const averageEur = total ? pricedCountries.reduce((sum, item) => sum + item.price, 0) / total : null;
    const avgDisplay =
      ctx.effectiveCurrencyMode === "local" ? convertEur(averageEur, currency, ctx.fxRates) : averageEur;
    const rank =
      selectedEur != null && Number.isFinite(selectedEur) && total && isEuropeanCountry(ctx.country)
        ? pricedCountries.filter((item) => item.price < selectedEur).length + 1
        : null;
    const averageDiffEur = selectedEur != null && averageEur != null ? selectedEur - averageEur : null;

    // Prefer the real 7-day change from trend history; fall back to the
    // delta vs the previously cached fetch when trends are unavailable.
    const weeklyDeltaEur = getWeeklyDeltaEur(ctx.trends, ctx.country, ctx.fuelType);
    const previousEur = getFuelPrice(ctx.prevSelected, ctx.fuelType);
    const fallbackDeltaEur = selectedEur != null && previousEur != null ? selectedEur - previousEur : null;
    const deltaEur = weeklyDeltaEur ?? fallbackDeltaEur;
    const deltaDisplay =
      ctx.effectiveCurrencyMode === "local"
        ? convertEur(Math.abs(deltaEur ?? 0), currency, ctx.fxRates)
        : Math.abs(deltaEur ?? 0);

    const averageCaption =
      averageDiffEur == null || Math.abs(averageDiffEur) < 0.0001
        ? ctx.t.homeNearAverage
        : averageDiffEur < 0
          ? ctx.t.homeBelowAverage
          : ctx.t.homeAboveAverage;

    const trendCaption =
      deltaEur == null
        ? ctx.t.homeNoPrevious
        : Math.abs(deltaEur) < 0.0001
          ? ctx.t.homeStableTrend
          : weeklyDeltaEur != null
            ? ctx.t.trendVsLastWeek
            : deltaEur < 0
              ? ctx.t.homeCheaperTrend
              : ctx.t.homeHigherTrend;

    const averageTone: "good" | "bad" | "neutral" =
      averageDiffEur == null || Math.abs(averageDiffEur) < 0.0001 ? "neutral" : averageDiffEur < 0 ? "good" : "bad";
    const trendTone: "good" | "bad" | "neutral" =
      deltaEur == null || Math.abs(deltaEur) < 0.0001 ? "neutral" : deltaEur < 0 ? "good" : "bad";

    return {
      fuelName: fuelLabel(ctx.fuelType, ctx.t),
      displayCurrency,
      price: selectedEur == null ? ctx.t.homeNoPrice : `${formatMoney(displayValue, displayCurrency)}/L`,
      account: `${ctx.country} · ${fuelLabel(ctx.fuelType, ctx.t)}`,
      rank: rank ? `#${rank}` : "--",
      rankBadge: rank ? ctx.t.homeRankBadge(rank) : ctx.t.rankUnavailable,
      rankCaption: total ? ctx.t.homeOutOf(total) : ctx.t.rankUnavailable,
      average: `${formatMoney(avgDisplay, displayCurrency)}/L`,
      averageCaption,
      averageTone,
      trend:
        deltaEur == null || Math.abs(deltaEur) < 0.0001
          ? "--"
          : `${deltaEur > 0 ? "+" : "-"}${formatMoney(deltaDisplay, displayCurrency)}`,
      trendCaption,
      trendTone
    };
  }, [
    ctx.data,
    ctx.effectiveCurrencyMode,
    ctx.fuelType,
    ctx.fxRates,
    ctx.prevSelected,
    ctx.selected,
    ctx.t,
    ctx.country,
    ctx.trends,
    currency
  ]);

  const updatedLabel = ctx.data ? ctx.t.subtitleAsOf(ctx.data.as_of) : ctx.t.subtitleLoading;
  const statusLabel = ctx.loading ? ctx.t.fetching : ctx.isFromCache ? ctx.t.showingCached : ctx.t.homeUpdatedToday;
  const sourceLabel = ctx.data?.source ? ctx.t.homeSourceVerified : ctx.t.homeNoPrice;

  const shareCurrentPrice = async () => {
    const lines = [
      "Fuel Today | Karburanti Sot",
      `${dashboard.fuelName} in ${ctx.country}: ${dashboard.price}`,
      ctx.data?.as_of ? ctx.t.subtitleAsOf(ctx.data.as_of) : "",
      "",
      `Open app: ${PLAY_STORE_URL}`,
    ];
    try {
      await Share.share({ message: lines.filter(Boolean).join("\n") });
    } catch {}
  };

  const actions: Array<{ label: string; icon: IconName; route: ShortcutRoute; tone: Tone; params?: object }> = [
    { label: ctx.t.stationsTitle, icon: "navigate-outline", route: "Stations", tone: "teal" },
    { label: ctx.t.compareTitle, icon: "git-compare-outline", route: "Compare", tone: "blue" },
    { label: ctx.t.rankingsTitle, icon: "podium-outline", route: "Rankings", tone: "violet" },
    { label: ctx.t.homeMore, icon: "ellipsis-horizontal", route: "Settings", tone: "amber" }
  ];

  return (
    <View style={s.screen}>
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={ctx.refreshing} onRefresh={ctx.refreshAll} tintColor={refreshTint} />}
      >
        <View style={s.topChrome}>
          <AnimatedPressable
            onPress={() => setQuickSheetOpen(true)}
            contentStyle={s.avatarButton}
            scaleIn={0.96}
            hitSlop={8}
          >
            <Text style={s.avatarFlag}>{flag || "•"}</Text>
          </AnimatedPressable>

          <AnimatedPressable
            onPress={() => setCountryModalOpen(true)}
            style={s.searchWrapper}
            contentStyle={s.searchPill}
            scaleIn={0.98}
          >
            <Ionicons name="search" size={17} color={searchIconColor} />
            <Text style={s.searchText} numberOfLines={1}>
              {ctx.t.homeSearchCountries}
            </Text>
          </AnimatedPressable>

          <View style={s.topIconCluster}>
            <AnimatedPressable onPress={ctx.openFeedback} contentStyle={s.topCircle} scaleIn={0.96}>
              <Ionicons name="chatbubble-ellipses-outline" size={18} color={topIconColor} />
            </AnimatedPressable>
            <AnimatedPressable onPress={shareCurrentPrice} contentStyle={s.topCircle} scaleIn={0.96}>
              <Ionicons name="share-social-outline" size={18} color={topIconColor} />
            </AnimatedPressable>
            <AnimatedPressable
              onPress={() => {
                if (currentEurPrice == null) return;
                setAlertDirection(currentAlert?.direction ?? "below");
                setAlertTarget((currentAlert?.targetEur ?? currentEurPrice).toFixed(3));
                setAlertOpen(true);
              }}
              contentStyle={[s.topCircle, currentAlert ? s.topCircleAccent : null]}
              scaleIn={0.96}
            >
              <Ionicons name={currentAlert ? "notifications" : "notifications-outline"} size={18} color={currentAlert ? accentColor : topIconColor} />
            </AnimatedPressable>
            <AnimatedPressable
              onPress={() => ctx.openRewardModal()}
              disabled={!ctx.canAskReward || ctx.reward.unlocked}
              contentStyle={[
                s.topCircle,
                ctx.canAskReward && !ctx.reward.unlocked ? s.topCircleAccent : null,
                ctx.reward.unlocked ? s.topCircleSuccess : null
              ]}
              scaleIn={0.96}
            >
              <Ionicons
                name={ctx.reward.unlocked ? "checkmark-circle-outline" : "trophy-outline"}
                size={19}
                color={ctx.canAskReward || ctx.reward.unlocked ? accentColor : topIconColor}
              />
            </AnimatedPressable>
          </View>
        </View>

        <LinearGradient colors={heroGradient} style={s.hero}>
          <View style={s.heroStatusRow}>
            <View style={s.livePill}>
              <Ionicons name={ctx.isFromCache ? "cloud-offline-outline" : "pulse-outline"} size={13} color={accentColor} />
              <Text style={s.livePillText} numberOfLines={1}>
                {statusLabel}
              </Text>
            </View>
            <Text style={s.heroUpdated} numberOfLines={1}>
              {updatedLabel}
            </Text>
          </View>

          <View style={s.heroCenter}>
            <Text style={s.heroPrice} adjustsFontSizeToFit numberOfLines={1}>
              {dashboard.price}
            </Text>
            <View style={s.accountPill}>
              <Text style={s.accountPillText} numberOfLines={1}>
                {dashboard.account}
              </Text>
            </View>
            <Text style={s.rankBadgeText} numberOfLines={1}>
              {dashboard.rankBadge}
            </Text>
          </View>

          <View style={s.fuelSelector}>
            {fuelOptions.map((option) => {
              const active = option.key === ctx.fuelType;
              return (
                <AnimatedPressable
                  key={option.key}
                  onPress={() => ctx.setFuelType(option.key)}
                  style={s.fuelChipItem}
                  contentStyle={[s.fuelChip, active ? s.fuelChipActive : null]}
                  scaleIn={0.97}
                >
                  <Ionicons name={option.icon} size={15} color={active ? fuelActiveColor : fuelInactiveColor} />
                  <Text style={[s.fuelChipText, active ? s.fuelChipTextActive : null]} numberOfLines={1}>
                    {option.label}
                  </Text>
                </AnimatedPressable>
              );
            })}
          </View>
        </LinearGradient>

        <View style={s.actionSplitRow}>
          <View style={s.actionGroup}>
            {actions.slice(0, 2).map((action) => (
              <ActionButton
                key={`${action.route}-${action.label}`}
                icon={action.icon}
                label={action.label}
                tone={action.tone}
                onPress={() => navigation.navigate(action.route, action.params)}
              />
            ))}
          </View>
          <View style={s.actionGroup}>
            {actions.slice(2).map((action) => (
              <ActionButton
                key={`${action.route}-${action.label}`}
                icon={action.icon}
                label={action.label}
                tone={action.tone}
                onPress={() => navigation.navigate(action.route, action.params)}
              />
            ))}
          </View>
        </View>

        <TrendCard theme={ctx.theme} t={ctx.t} trends={ctx.trends} country={ctx.country} fuelType={ctx.fuelType} />

        <View style={s.marketCard}>
          <View style={s.marketHeader}>
            <View>
              <Text style={s.marketKicker}>{dashboard.fuelName}</Text>
              <Text style={s.marketTitle}>{ctx.t.homeFuelPulse}</Text>
            </View>
            <View style={s.sourcePill}>
              <Ionicons name="shield-checkmark-outline" size={13} color={accentColor} />
              <Text style={s.sourcePillText} numberOfLines={1}>
                {sourceLabel}
              </Text>
            </View>
          </View>

          <PulseRow label={ctx.country} value={dashboard.price} detail={ctx.t.homeSelectedPrice} tone="neutral" />
          <PulseRow label={ctx.t.homeEuropeAverage} value={dashboard.average} detail={dashboard.averageCaption} tone={dashboard.averageTone} />
          <PulseRow label={ctx.t.rankingsTitle} value={dashboard.rank} detail={dashboard.rankCaption} tone="neutral" />
          <PulseRow label={ctx.t.homeTrend} value={dashboard.trend} detail={dashboard.trendCaption} tone={dashboard.trendTone} />
        </View>

        {ctx.error ? (
          <ErrorCard theme={ctx.theme} title={ctx.t.couldntLoad} message={ctx.error} cta={ctx.t.tryAgain} onPress={ctx.refreshAll} />
        ) : null}
      </ScrollView>

      <FavoritesQuickSheet
        theme={ctx.theme}
        open={quickSheetOpen}
        currentCountry={ctx.country}
        favorites={ctx.favorites}
        closeLabel={ctx.t.close}
        onSelect={(c) => {
          ctx.setCountryTracked(c);
          setQuickSheetOpen(false);
        }}
        onOpenFull={() => {
          setQuickSheetOpen(false);
          setCountryModalOpen(true);
        }}
        onClose={() => setQuickSheetOpen(false)}
      />

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

      <Modal visible={alertOpen} transparent animationType="fade" onRequestClose={() => setAlertOpen(false)}>
        <View style={s.modalBackdrop}>
          <View style={s.alertModal}>
            <View style={s.alertModalHeader}>
              <View>
                <Text style={s.alertModalTitle}>Price alert</Text>
                <Text style={s.alertModalSub}>{ctx.country} | {fuelLabel(ctx.fuelType, ctx.t)}</Text>
              </View>
              <AnimatedPressable onPress={() => setAlertOpen(false)} contentStyle={s.alertCloseBtn} scaleIn={0.98}>
                <Ionicons name="close" size={18} color={ctx.theme.colors.text} />
              </AnimatedPressable>
            </View>

            <View style={s.alertSegment}>
              {(["below", "above"] as const).map((direction) => (
                <AnimatedPressable
                  key={direction}
                  onPress={() => setAlertDirection(direction)}
                  style={s.alertSegmentItem}
                  contentStyle={[s.alertSegmentBtn, alertDirection === direction ? s.alertSegmentBtnActive : null]}
                  scaleIn={0.98}
                >
                  <Text style={[s.alertSegmentText, alertDirection === direction ? s.alertSegmentTextActive : null]}>
                    {direction === "below" ? "Below" : "Above"}
                  </Text>
                </AnimatedPressable>
              ))}
            </View>

            <TextInput
              value={alertTarget}
              onChangeText={setAlertTarget}
              keyboardType="decimal-pad"
              placeholder="1.650"
              placeholderTextColor={ctx.theme.colors.muted}
              style={s.alertInput}
            />

            <View style={s.alertActions}>
              {currentAlert ? (
                <AnimatedPressable
                  onPress={() => {
                    ctx.priceAlerts.removeRule(currentAlert.id);
                    setAlertOpen(false);
                  }}
                  contentStyle={s.alertGhostBtn}
                  scaleIn={0.98}
                >
                  <Text style={s.alertGhostText}>Remove</Text>
                </AnimatedPressable>
              ) : null}
              <AnimatedPressable
                onPress={() => {
                  const target = Number(alertTarget.replace(",", "."));
                  if (!Number.isFinite(target) || target <= 0) return;
                  ctx.priceAlerts.upsertRule(ctx.country, ctx.fuelType, alertDirection, target);
                  setAlertOpen(false);
                }}
                contentStyle={s.alertPrimaryBtn}
                scaleIn={0.98}
              >
                <Ionicons name="notifications-outline" size={17} color={ctx.theme.colors.primaryText} />
                <Text style={s.alertPrimaryText}>Save alert</Text>
              </AnimatedPressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );

  function ActionButton(props: { icon: IconName; label: string; tone: Tone; onPress: () => void }) {
    const toneStyle = {
      teal: s.tone_teal,
      blue: s.tone_blue,
      violet: s.tone_violet,
      amber: s.tone_amber
    }[props.tone];

    return (
      <AnimatedPressable onPress={props.onPress} style={s.actionItem} contentStyle={s.actionPressable} scaleIn={0.96}>
        <View style={[s.actionCircle, toneStyle]}>
          <Ionicons name={props.icon} size={20} color={actionIconColor} />
        </View>
        <Text style={s.actionLabel} numberOfLines={1}>
          {props.label}
        </Text>
      </AnimatedPressable>
    );
  }

  function PulseRow(props: { label: string; value: string; detail: string; tone: "good" | "bad" | "neutral" }) {
    const toneStyle = props.tone === "good" ? s.pulseValueGood : props.tone === "bad" ? s.pulseValueBad : null;

    return (
      <View style={s.pulseRow}>
        <View style={s.pulseTextWrap}>
          <Text style={s.pulseLabel} numberOfLines={1}>
            {props.label}
          </Text>
          <Text style={s.pulseDetail} numberOfLines={1}>
            {props.detail}
          </Text>
        </View>
        <Text style={[s.pulseValue, toneStyle]} numberOfLines={1}>
          {props.value}
        </Text>
      </View>
    );
  }

}
