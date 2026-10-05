import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Pressable, RefreshControl, ScrollView, Share, Text, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";

import { useApp } from "../context/AppContext";
import { isTwoColumnHome, makeHomeStyles } from "./HomeTab.styles";
import { formatShortDate, toneOf, useHomeMarket } from "../hooks/useHomeMarket";

import CountrySearchModal from "../components/country/CountrySearchModal";
import FavoritesQuickSheet from "../components/country/FavoritesQuickSheet";
import ErrorCard from "../components/feedback/ErrorCard";
import AnimatedPressable from "../components/ui/AnimatedPressable";
import FuelDeck from "../components/home/FuelDeck";
import HomeActions, { type HomeAction } from "../components/home/HomeActions";
import SavedMarketsRail from "../components/home/SavedMarketsRail";
import MarketPulse from "../components/home/MarketPulse";
import PriceAlertSheet from "../components/home/PriceAlertSheet";
import { homePalette } from "../components/home/homePalette";

import { ADS_ENABLED } from "../constants/ads";
import { PLAY_STORE_URL } from "../constants/urls";
import { fuelLabel } from "../utils/fuel";
import { getFlagForCountry } from "../utils/countryFlag";

const FLAT = 0.0005;
let homeOpeningPlayedThisSession = false;

export default function HomeTab() {
  const ctx = useApp();
  const { t, theme } = ctx;
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const s = useMemo(() => makeHomeStyles(theme), [theme]);
  const p = useMemo(() => homePalette(theme), [theme]);
  const market = useHomeMarket();

  const [quickSheetOpen, setQuickSheetOpen] = useState(false);
  const [countryModalOpen, setCountryModalOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [introRun, setIntroRun] = useState(() => {
    const play = !homeOpeningPlayedThisSession;
    homeOpeningPlayedThisSession = true;
    return play ? 1 : 0;
  });
  const opening = useRef(new Animated.Value(introRun > 0 && !theme.motion.reduced && !theme.m.isLargeText ? 0 : 1)).current;

  useEffect(() => {
    opening.stopAnimation();
    if (introRun === 0 || theme.motion.reduced || theme.m.isLargeText) {
      opening.setValue(1);
      return;
    }
    Animated.timing(opening, {
      toValue: 1,
      duration: 1760,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [introRun, opening, theme.m.isLargeText, theme.motion.reduced]);

  const fuelName = fuelLabel(ctx.fuelType, t);
  const flag = useMemo(() => getFlagForCountry(ctx.country), [ctx.country]);
  const isFavorite = ctx.favorites.includes(ctx.country);
  const alertRule = ctx.priceAlerts.getRule(ctx.country, ctx.fuelType) ?? null;
  const { signal, current } = market;

  const diff = useMemo(() => {
    if (signal.diffEur == null) return null;
    if (Math.abs(signal.diffEur) < FLAT) return { text: t.atEuropeAverage, tone: "neutral" as const };
    const amount = market.fmt(Math.abs(signal.diffEur));
    return signal.diffEur > 0
      ? { text: t.aboveEuropeBy(amount), tone: "bad" as const }
      : { text: t.belowEuropeBy(amount), tone: "good" as const };
  }, [signal.diffEur, market, t]);

  const week = useMemo(() => {
    if (signal.deltaEur == null) return null;
    if (Math.abs(signal.deltaEur) < FLAT) return { text: t.weekFlat, tone: "neutral" as const };
    return { text: t.weekChange(market.fmtSigned(signal.deltaEur)), tone: toneOf(signal.deltaEur) };
  }, [signal.deltaEur, market, t]);

  const sharePrice = useCallback(async () => {
    if (current == null || !ctx.data) return;
    const message = [
      "Karburanti Sot",
      t.shareMessage(fuelName, ctx.country, `${market.fmt(current)}/L`, formatShortDate(ctx.data.as_of, t)),
      "",
      PLAY_STORE_URL,
    ].join("\n");
    try {
      await Share.share({ message });
    } catch {}
  }, [current, ctx.data, ctx.country, fuelName, market, t]);

  const compareThis = useCallback(() => {
    if (!ctx.compareCountries.includes(ctx.country)) {
      if (ctx.compareCountries.length >= ctx.maxCompare) ctx.showToast(t.compareLimitHint(ctx.maxCompare));
      else ctx.addCompare(ctx.country);
    }
    navigation.navigate("Compare");
  }, [ctx, navigation, t]);

  const actions: HomeAction[] = [
    {
      key: "alert",
      icon: alertRule ? "notifications" : "notifications-outline",
      label: alertRule
        ? (alertRule.direction === "below" ? t.alertBelowShort : t.alertAboveShort)(`€${alertRule.targetEur.toFixed(3)}`)
        : t.alertAction,
      a11yLabel: alertRule
        ? `${t.priceAlert}: ${(alertRule.direction === "below" ? t.alertBelowShort : t.alertAboveShort)(`€${alertRule.targetEur.toFixed(3)}`)}`
        : t.priceAlert,
      active: !!alertRule,
      disabled: current == null,
      onPress: () => setAlertOpen(true),
    },
    { key: "share", icon: "share-outline", label: t.shareAction, a11yLabel: t.shareAction, disabled: current == null, onPress: sharePrice },
    { key: "compare", icon: "git-compare-outline", label: t.compareAction, a11yLabel: t.compareMarketA11y(ctx.country), onPress: compareThis },
  ];

  const rewardChip = !ADS_ENABLED ? null : ctx.reward.unlocked ? (
    <View style={s.rewardChip} accessible accessibilityLabel={t.extrasActive(ctx.reward.minutesLeft)}>
      <Ionicons name="checkmark-circle" size={15} color={p.accent} />
      <Text style={s.rewardText} numberOfLines={theme.m.isLargeText ? undefined : 1}>{t.extrasActive(ctx.reward.minutesLeft)}</Text>
    </View>
  ) : ctx.canAskReward ? (
    <AnimatedPressable onPress={() => ctx.openRewardModal()} contentStyle={s.rewardChip} reduceMotion={theme.motion.reduced} accessibilityLabel={t.unlockExtras}>
      <Ionicons name="gift-outline" size={15} color={p.accent} />
      <Text style={s.rewardText} numberOfLines={theme.m.isLargeText ? undefined : 1}>{t.unlockExtras}</Text>
    </AnimatedPressable>
  ) : null;

  const deck = ctx.data || ctx.loading ? (
    <FuelDeck
      theme={theme}
      t={t}
      country={ctx.country}
      flag={flag}
      isFavorite={isFavorite}
      fuelType={ctx.fuelType}
      prices={market.prices}
      format={market.fmt}
      raisedDigit={market.mode === "eur"}
      diff={diff}
      week={week}
      note={market.localRequestedButMissing ? t.localRateUnavailable : null}
      freshness={market.freshness}
      refreshFailed={market.refreshFailed}
      refreshing={ctx.refreshing}
      introRun={introRun}
      onRetry={ctx.refreshAll}
      onOpenCountry={() => setQuickSheetOpen(true)}
      onToggleFavorite={() => ctx.toggleFavorite(ctx.country)}
      onSelectFuel={ctx.setFuelType}
    />
  ) : (
    <ErrorCard theme={theme} title={t.couldntLoad} message={t.dataUnavailable} cta={t.tryAgain} onPress={ctx.refreshAll} />
  );

  const primary = (
    <View style={s.column}>
      {deck}
      {ctx.data ? (
        <Animated.View style={{
          opacity: opening.interpolate({ inputRange: [0, 0.68, 0.84], outputRange: [0, 0, 1], extrapolate: "clamp" }),
          transform: [{ translateX: opening.interpolate({ inputRange: [0.68, 0.86], outputRange: [-10, 0], extrapolate: "clamp" }) }],
        }}>
          <HomeActions theme={theme} actions={actions} />
        </Animated.View>
      ) : null}
    </View>
  );

  const secondary = ctx.data ? (
    <View style={s.column}>
      <Animated.View style={{
        opacity: opening.interpolate({ inputRange: [0, 0.74, 0.88], outputRange: [0, 0, 1], extrapolate: "clamp" }),
        transform: [{ translateX: opening.interpolate({ inputRange: [0.74, 0.9], outputRange: [14, 0], extrapolate: "clamp" }) }],
      }}>
        <SavedMarketsRail
          theme={theme}
          t={t}
          markets={market.saved}
          current={ctx.country}
          format={market.fmt}
          onSelect={ctx.setCountryTracked}
          onAdd={() => setCountryModalOpen(true)}
        />
      </Animated.View>
      <Animated.View style={{
        opacity: opening.interpolate({ inputRange: [0, 0.82, 0.96], outputRange: [0, 0, 1], extrapolate: "clamp" }),
        transform: [{ scale: opening.interpolate({ inputRange: [0.82, 0.98], outputRange: [0.985, 1], extrapolate: "clamp" }) }],
      }}>
        <MarketPulse
          theme={theme}
          t={t}
          fuelName={fuelName}
          country={ctx.country}
          series={market.series}
          weekText={week?.text ?? null}
          europe={market.europe}
          current={current}
          rank={signal.rank}
          format={market.fmt}
        />
      </Animated.View>
      <Animated.View style={[s.sourceNote, {
        opacity: opening.interpolate({ inputRange: [0, 0.91, 1], outputRange: [0, 0, 1], extrapolate: "clamp" }),
      }]}>
        <Text style={s.sourceText}>{t.sourceIs(ctx.data.source)}</Text>
        {ctx.cacheSavedAtUtc ? (
          <Text style={s.sourceText}>{t.lastSyncAt(formatShortDate(ctx.cacheSavedAtUtc, t, true))}</Text>
        ) : null}
      </Animated.View>
    </View>
  ) : null;

  return (
    <View style={s.screen}>
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={ctx.refreshing} onRefresh={ctx.refreshAll} tintColor={p.accent} colors={[p.accent]} />}
      >
        <Animated.View style={[s.topBar, {
          opacity: opening.interpolate({ inputRange: [0, 0.18, 0.32], outputRange: [0, 0, 1], extrapolate: "clamp" }),
          transform: [
            { translateX: opening.interpolate({ inputRange: [0.1, 0.34], outputRange: [-8, 0], extrapolate: "clamp" }) },
            { scale: opening.interpolate({ inputRange: [0, 0.32], outputRange: [0.985, 1], extrapolate: "clamp" }) },
          ],
        }]}>
          <View style={s.brand} accessible accessibilityRole="header" accessibilityLabel="Karburanti Sot">
            <View style={s.brandMark}>
              <MaterialCommunityIcons name="gas-station" size={16} color={p.moduleText} />
            </View>
            {/* Wordmark, not content: the header already exposes the full name to screen readers. */}
            <Text style={s.brandText} numberOfLines={1} maxFontSizeMultiplier={1.3}>Karburanti Sot</Text>
          </View>
          {rewardChip}
        </Animated.View>

        {__DEV__ ? (
          <Pressable
            onPress={() => setIntroRun((run) => Math.max(1, run + 1))}
            accessibilityRole="button"
            accessibilityLabel="Replay Home Intro"
            style={({ pressed }) => [s.devReplay, pressed ? s.devReplayPressed : null]}
          >
            <Ionicons name="play-back" size={13} color={p.accent} />
            <Text style={s.devReplayText}>Replay Home Intro</Text>
          </Pressable>
        ) : null}

        {isTwoColumnHome(theme) ? (
          <View style={s.columns}>
            <View style={s.columnSlot}>{primary}</View>
            <View style={s.columnSlot}>{secondary}</View>
          </View>
        ) : (
          <>
            {primary}
            {secondary}
          </>
        )}
      </ScrollView>

      <FavoritesQuickSheet
        theme={theme}
        t={t}
        open={quickSheetOpen}
        currentCountry={ctx.country}
        favorites={ctx.favorites}
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
        theme={theme}
        open={countryModalOpen}
        title={t.changeCountry}
        placeholder={t.searchPlaceholder}
        closeLabel={t.close}
        selectedLabel={t.selected}
        saveLabel={t.saveMarketA11y}
        unsaveLabel={t.unsaveMarketA11y}
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

      <PriceAlertSheet
        theme={theme}
        t={t}
        open={alertOpen}
        subtitle={`${ctx.country} · ${fuelName}`}
        currentEur={current}
        rule={alertRule}
        onSave={async (direction, target) => {
          const saved = await ctx.priceAlerts.upsertRule(ctx.country, ctx.fuelType, direction, target);
          if (saved) setAlertOpen(false);
          else ctx.showToast(t.alertPermissionDenied, 3200);
          return saved;
        }}
        onRemove={() => {
          if (alertRule) ctx.priceAlerts.removeRule(alertRule.id);
          setAlertOpen(false);
        }}
        onClose={() => setAlertOpen(false)}
      />
    </View>
  );
}
