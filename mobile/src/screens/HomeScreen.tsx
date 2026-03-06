import React, { useEffect, useMemo, useRef, useState } from "react";
import { Linking, RefreshControl, ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import mobileAds, { TestIds } from "react-native-google-mobile-ads";

import { DATA_URL, PLAY_STORE_URL } from "../constants/urls";
import {
  STORAGE_COMPARE_KEY,
  STORAGE_COUNTRY_KEY,
  STORAGE_CURRENCY_KEY,
  STORAGE_FAVORITES_KEY,
  STORAGE_FUELTYPE_KEY,
  STORAGE_LANG_KEY,
  STORAGE_STATIONS_RADIUS_KEY
} from "../constants/storage";
import { i18n, type Lang } from "../i18n";
import type { FuelType } from "../types/fuel";
import { useAsyncStorageState } from "../hooks/useAsyncStorageState";
import { useFuelData } from "../hooks/useFuelData";
import { useTheme } from "../hooks/useTheme";
import { useFxRates } from "../hooks/useFxRates";

import TopBar from "../components/layout/TopBar";
import FuelCard from "../components/fuel/FuelCard";
import RankingCard from "../components/fuel/RankingCard";
import CompareCard from "../components/fuel/CompareCard";
import ErrorCard from "../components/feedback/ErrorCard";
import CountrySearchModal from "../components/country/CountrySearchModal";
import StationsCard from "../components/stations/StationsCard";
import { useUserLocation } from "../hooks/useUserLocation";
import { useNearbyStations } from "../hooks/useNearbyStations";
import AdBar from "../components/ads/AdBar";
import SegmentedControl from "../components/ui/SegmentedControl";
import { useReturnInterstitial } from "../hooks/useReturnInterstitial";
import RewardUnlockModal from "../components/ads/RewardUnlockModal";
import { useRewardUnlock } from "../hooks/useRewardUnlock";
import RateAppModal from "../components/feedback/RateAppModal";
import { useRatePrompt } from "../hooks/useRatePrompt";

import QuickSwitchCard from "../components/layout/QuickSwitchCard";

import { makeHomeStyles } from "./HomeScreen.styles";

import { getCurrencyForCountry } from "../utils/currency";
import { hasRate } from "../utils/money";
import FeedbackCurrencyBar from "../components/layout/FeedbackCurrencyBar";

type CurrencyMode = "eur" | "local";
type HomeTab = "stations" | "compare" | "rankings";

function parseStringArray(raw: string) {
  try {
    const j = JSON.parse(raw);
    if (!Array.isArray(j)) return [];
    return j.filter((x) => typeof x === "string");
  } catch {
    return [];
  }
}

export default function HomeScreen() {
  const { theme, themeName, toggleTheme } = useTheme();
  const s = useMemo(() => makeHomeStyles(theme), [theme]);

  const { value: lang, setValue: setLang } = useAsyncStorageState<Lang>(STORAGE_LANG_KEY, "en", {
    deserialize: (raw) => (raw === "sq" ? "sq" : "en")
  });

  const { value: radiusM, setValue: setRadiusM } = useAsyncStorageState<number>(STORAGE_STATIONS_RADIUS_KEY, 5000, {
    deserialize: (raw) => {
      const n = Number(raw);
      return n === 2000 || n === 5000 || n === 10000 ? n : 5000;
    },
    serialize: (v) => String(v)
  });

  const { value: country, setValue: setCountry } = useAsyncStorageState<string>(STORAGE_COUNTRY_KEY, "Albania");

  const { value: fuelType, setValue: setFuelType } = useAsyncStorageState<FuelType>(STORAGE_FUELTYPE_KEY, "diesel", {
    deserialize: (raw) => (raw === "gasoline95" || raw === "lpg" || raw === "diesel" ? raw : "diesel")
  });

  const { value: favorites, setValue: setFavorites } = useAsyncStorageState<string[]>(
    STORAGE_FAVORITES_KEY,
    [],
    { serialize: (v) => JSON.stringify(v), deserialize: parseStringArray }
  );

  const { value: compareCountries, setValue: setCompareCountries } = useAsyncStorageState<string[]>(
    STORAGE_COMPARE_KEY,
    [],
    { serialize: (v) => JSON.stringify(v), deserialize: parseStringArray }
  );

  const { value: currencyMode, setValue: setCurrencyMode } = useAsyncStorageState<CurrencyMode>(
    STORAGE_CURRENCY_KEY,
    "eur",
    { deserialize: (raw) => (raw === "local" ? "local" : "eur") }
  );

  const loc = useUserLocation();
  const nearby = useNearbyStations({ center: loc.coords, radiusM });

  const t = i18n[lang];

  const { data, prevSelected, cacheSavedAtUtc, isFromCache, error, loading, refreshing, countries, selected, refresh } =
    useFuelData({ url: DATA_URL, country, setCountry });

  const fx = useFxRates();

  const [countryModalOpen, setCountryModalOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [tab, setTab] = useState<HomeTab>("stations");

  useEffect(() => {
    mobileAds().initialize();
  }, []);

  useEffect(() => {
    if (!data?.countries?.length) return;
    const exists = new Set(data.countries.map((c) => c.country));
    setFavorites((p) => p.filter((x) => exists.has(x)));
    setCompareCountries((p) => p.filter((x) => exists.has(x)));
  }, [data?.countries?.length, setFavorites, setCompareCountries]);

  const toggleLang = () => setLang((p) => (p === "en" ? "sq" : "en"));

  const adUnitId = __DEV__ ? TestIds.BANNER : "ca-app-pub-2653462201538649/5444199958";
  const interstitialUnitId = __DEV__ ? TestIds.INTERSTITIAL : "ca-app-pub-2653462201538649/5721527391";

  const { markMapsOpened } = useReturnInterstitial({
    unitId: interstitialUnitId,
    cooldownMs: 2 * 60 * 1000,
    maxPerSession: 3,
    minBackgroundMs: 1200
  });

  const rewardedUnitId = __DEV__ ? TestIds.REWARDED : "ca-app-pub-2653462201538649/2269367545";
  const reward = useRewardUnlock({ unitId: rewardedUnitId, durationMinutes: 30 });

  const maxCompare = reward.unlocked ? 5 : 3;

  const toggleFavorite = (c: string) => {
    setFavorites((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [c, ...prev]));
  };

  const addCompare = (c: string) => {
    setCompareCountries((prev) => {
      if (prev.includes(c)) return prev;
      if (prev.length >= maxCompare) return prev;
      return [...prev, c];
    });
  };

  const removeCompare = (c: string) => {
    setCompareCountries((prev) => prev.filter((x) => x !== c));
  };

  const [rewardModalOpen, setRewardModalOpen] = useState(false);
  const pendingActionRef = useRef<null | (() => void)>(null);

  const STORAGE_REWARD_PROMPT_COOLDOWN_UNTIL_KEY = "reward_prompt_cooldown_until_utc_ms";

  const { value: rewardPromptCooldownUntil, setValue: setRewardPromptCooldownUntil } = useAsyncStorageState<number>(
    STORAGE_REWARD_PROMPT_COOLDOWN_UNTIL_KEY,
    0,
    {
      deserialize: (raw) => {
        const n = Number(raw);
        return Number.isFinite(n) ? n : 0;
      },
      serialize: (v) => String(v)
    }
  );

  const nowMs = Date.now();
  const canAskReward = !reward.unlocked && nowMs >= rewardPromptCooldownUntil;

  const suppressRewardPromptFor30Min = () => {
    setRewardPromptCooldownUntil(Date.now() + 30 * 60 * 1000);
  };

  const openRewardModal = (after?: () => void) => {
    pendingActionRef.current = after ?? null;
    setRewardModalOpen(true);
  };

  const closeRewardModal = (suppress: boolean) => {
    if (suppress) suppressRewardPromptFor30Min();
    setRewardModalOpen(false);
    pendingActionRef.current = null;
  };

  const onRewardContinue = () => {
    const act = pendingActionRef.current;
    closeRewardModal(true);
    act?.();
  };

  const onRewardWatch = async () => {
    await reward.showRewardedAndUnlock();
    const act = pendingActionRef.current;
    closeRewardModal(false);
    act?.();
  };

  const refreshAll = () => {
    nearby.refresh?.();
    refresh();
  };

  const stationsLabel = ((t as any).stationsTitle ?? "Stations") as string;
  const compareLabel = ((t as any).compareTitle ?? "Compare") as string;
  const rankingsLabel = ((t as any).rankingsTitle ?? "Ranking") as string;

  const compareCountriesUI = compareCountries.length ? compareCountries : ["Albania", "Italy", "Greece"];

  const rate = useRatePrompt({ threshold: 4, cooldownDays: 7 });
  const [rateOpen, setRateOpen] = useState(false);

  useEffect(() => {
    if (!rateOpen && rate.canShow) setRateOpen(true);
  }, [rate.canShow, rateOpen]);

  const setCountryTracked = (c: string) => {
    setCountry(c);
    rate.track("country_change");
  };

  const onOpenExternalMapTracked = () => {
    markMapsOpened();
    rate.track("open_map");
  };

  const openFeedback = async () => {
    const subject = encodeURIComponent("Fuel app feedback");
    const body = encodeURIComponent("Hi! I have feedback:\n\n");
    const mailto = `mailto:fenixkola@gmail.com?subject=${subject}&body=${body}`;
    const ok = await Linking.canOpenURL(mailto);
    if (ok) await Linking.openURL(mailto);
  };

  const openStoreReview = async () => {
    rate.markRated();
    setRateOpen(false);
    const url = PLAY_STORE_URL;
    const ok = await Linking.canOpenURL(url);
    if (ok) await Linking.openURL(url);
  };

  const currency = useMemo(() => getCurrencyForCountry(country), [country]);
  const canLocal = useMemo(() => currency !== "EUR" && hasRate(currency, fx.rates), [currency, fx.rates]);
  const effectiveCurrencyMode: CurrencyMode = currencyMode === "local" && canLocal ? "local" : "eur";

  return (
    <SafeAreaView style={s.screen} edges={["top", "left", "right", "bottom"]}>
      <StatusBar barStyle={themeName === "dark" ? "light-content" : "dark-content"} backgroundColor={theme.colors.bg} />

      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshAll} />}
      >
        <TopBar
          theme={theme}
          title={t.title}
          subtitle={data ? t.subtitleAsOf(data.as_of) : t.subtitleLoading}
          langPillLabel={lang === "en" ? t.langSQ : t.langEN}
          onToggleLang={toggleLang}
          onToggleTheme={toggleTheme}
        />

        <FeedbackCurrencyBar
          theme={theme}
          t={t}
          onFeedbackPress={openFeedback}
          currencyLocalCode={currency}
          canLocal={canLocal}
          currencyMode={effectiveCurrencyMode}
          onSetCurrencyMode={(m) => setCurrencyMode(m)}
          headerBtnStyle={s.headerBtn}
          headerBtnTextStyle={s.headerBtnText}
        />

        <QuickSwitchCard
          theme={theme}
          t={t}
          favorites={favorites}
          currentCountry={country}
          onEdit={() => setCountryModalOpen(true)}
          onSelect={(c: any) => setCountryTracked(c)}
        />

        {error ? (
          <ErrorCard theme={theme} title={t.couldntLoad} message={error} cta={t.tryAgain} onPress={refreshAll} />
        ) : null}

        <FuelCard
          theme={theme}
          t={t}
          data={data}
          selected={selected}
          prevSelected={prevSelected}
          loading={loading}
          country={country}
          fuelType={fuelType}
          currencyMode={effectiveCurrencyMode}
          setCurrencyMode={setCurrencyMode}
          fxRates={fx.rates}
          isFromCache={isFromCache}
          cacheSavedAtUtc={cacheSavedAtUtc}
          refreshing={refreshing}
          onRefresh={refreshAll}
          onOpenCountrySearch={() => setCountryModalOpen(true)}
        />

        <SegmentedControl
          theme={theme}
          value={tab}
          onChange={(v) => setTab(v as HomeTab)}
          items={[
            { value: "stations", label: stationsLabel, icon: "navigate-outline" },
            { value: "compare", label: compareLabel, icon: "git-compare-outline" },
            { value: "rankings", label: rankingsLabel, icon: "podium-outline" }
          ]}
        />

        {tab === "stations" ? (
          <StationsCard
            theme={theme}
            t={t}
            permission={loc.permission}
            locating={loc.loading}
            onRequestLocation={loc.request}
            stations={nearby.stations}
            totalCount={nearby.totalCount}
            loading={nearby.loading}
            error={nearby.error}
            onRefresh={nearby.refresh}
            fromCache={nearby.fromCache}
            radiusM={radiusM}
            setRadiusM={setRadiusM}
            onOpenExternalMap={onOpenExternalMapTracked}
            rewardUnlocked={reward.unlocked}
            onShowAllPress={(proceed) => {
              proceed();
            }}
            onRadiusPress={() => {
              rate.track("stations_use");
              if (!canAskReward) return;
              openRewardModal();
            }}
          />
        ) : null}

        {tab === "compare" ? (
          <CompareCard
            theme={theme}
            t={t}
            data={data}
            fuelType={fuelType}
            compareCountries={compareCountriesUI}
            onRemove={removeCompare}
            onAddPress={() => {
              if (compareCountries.length >= maxCompare) return;
              setCompareModalOpen(true);
            }}
            currencyMode={effectiveCurrencyMode}
            fxRates={fx.rates}
            maxCompare={maxCompare}
          />
        ) : null}

        {tab === "rankings" ? (
          <RankingCard
            theme={theme}
            t={t}
            data={data}
            fuelType={fuelType}
            setFuelType={setFuelType}
            currentCountry={country}
            onOpenCountry={(c) => setCountryTracked(c)}
            currencyMode={effectiveCurrencyMode}
            fxRates={fx.rates}
            rewardUnlocked={reward.unlocked}
          />
        ) : null}

        <CountrySearchModal
          theme={theme}
          open={countryModalOpen}
          title={t.changeCountry}
          placeholder={t.searchPlaceholder}
          closeLabel={t.close}
          selectedLabel={t.selected}
          countries={countries}
          value={country}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onClose={() => setCountryModalOpen(false)}
          onSelect={(c) => {
            setCountryTracked(c);
            setCountryModalOpen(false);
          }}
        />

        <CountrySearchModal
          theme={theme}
          open={compareModalOpen}
          title={t.addCountry}
          placeholder={t.searchPlaceholder}
          closeLabel={t.close}
          selectedLabel={t.selected}
          countries={countries}
          value={""}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onClose={() => setCompareModalOpen(false)}
          onSelect={(c) => {
            addCompare(c);
            setCompareModalOpen(false);
          }}
        />
      </ScrollView>

      <RewardUnlockModal
        theme={theme}
        t={t}
        open={rewardModalOpen}
        minutes={30}
        loadingAd={!reward.loaded}
        onClose={() => closeRewardModal(true)}
        onWatch={onRewardWatch}
        onContinue={onRewardContinue}
      />

      <RateAppModal
        theme={theme}
        t={t}
        open={rateOpen}
        onClose={() => {
          setRateOpen(false);
          rate.snooze();
        }}
        onRate={openStoreReview}
        onLater={() => {
          setRateOpen(false);
          rate.snooze();
        }}
      />

      <View>
        <AdBar theme={theme} unitId={adUnitId} />
      </View>
    </SafeAreaView>
  );
}