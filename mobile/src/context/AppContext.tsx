import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Linking } from "react-native";
import mobileAds, { TestIds } from "react-native-google-mobile-ads";
import { useReturnInterstitial } from "../hooks/useReturnInterstitial";
import { useRewardUnlock } from "../hooks/useRewardUnlock";

import { DATA_URL, PLAY_STORE_URL } from "../constants/urls";
import {
  STORAGE_COMPARE_KEY,
  STORAGE_COUNTRY_KEY,
  STORAGE_CURRENCY_KEY,
  STORAGE_FAVORITES_KEY,
  STORAGE_FUELTYPE_KEY,
  STORAGE_LANG_KEY,
  STORAGE_STATIONS_RADIUS_KEY,
} from "../constants/storage";
import { i18n, type Lang, type TDict } from "../i18n";
import type { FuelType, LatestEurope, CountryPrices } from "../types/fuel";
import { useAsyncStorageState } from "../hooks/useAsyncStorageState";
import { useFuelData } from "../hooks/useFuelData";
import { useTheme } from "../hooks/useTheme";
import { useFxRates } from "../hooks/useFxRates";
import { useUserLocation } from "../hooks/useUserLocation";
import { useNearbyStations } from "../hooks/useNearbyStations";
import { useRatePrompt } from "../hooks/useRatePrompt";
import { getCurrencyForCountry } from "../utils/currency";
import { hasRate } from "../utils/money";

export type CurrencyMode = "eur" | "local";

function parseStringArray(raw: string) {
  try {
    const j = JSON.parse(raw);
    if (!Array.isArray(j)) return [];
    return j.filter((x) => typeof x === "string");
  } catch {
    return [];
  }
}

type RewardPlaceholder = {
  unlocked: boolean;
  loaded: boolean;
  minutesLeft: number;
  showRewardedAndUnlock: () => Promise<boolean>;
  refreshStored: () => Promise<void>;
};

type AppContextType = {
  theme: ReturnType<typeof useTheme>["theme"];
  themeName: ReturnType<typeof useTheme>["themeName"];
  toggleTheme: () => void;

  lang: Lang;
  setLang: (v: Lang | ((p: Lang) => Lang)) => void;
  toggleLang: () => void;
  t: TDict;

  country: string;
  setCountry: (c: string) => void;
  setCountryTracked: (c: string) => void;
  fuelType: FuelType;
  setFuelType: (v: FuelType | ((p: FuelType) => FuelType)) => void;

  favorites: string[];
  toggleFavorite: (c: string) => void;

  compareCountries: string[];
  addCompare: (c: string) => void;
  removeCompare: (c: string) => void;
  applyCompareSet: (cs: string[]) => void;
  maxCompare: number;

  currencyMode: CurrencyMode;
  setCurrencyMode: (v: CurrencyMode | ((p: CurrencyMode) => CurrencyMode)) => void;
  effectiveCurrencyMode: CurrencyMode;
  currency: string;
  canLocal: boolean;

  radiusM: number;
  setRadiusM: (v: number | ((p: number) => number)) => void;

  data: LatestEurope | null;
  prevSelected: CountryPrices | null;
  cacheSavedAtUtc: string | null;
  isFromCache: boolean;
  error: string;
  loading: boolean;
  refreshing: boolean;
  countries: string[];
  selected: CountryPrices | null;

  fxRates: Record<string, number> | null;

  loc: ReturnType<typeof useUserLocation>;
  nearby: ReturnType<typeof useNearbyStations>;

  reward: RewardPlaceholder;
  rate: ReturnType<typeof useRatePrompt>;

  adUnitId: string;

  refreshAll: () => void;
  markMapsOpened: () => void;

  openRewardModal: (after?: () => void) => void;
  closeRewardModal: (suppress: boolean) => void;
  onRewardContinue: () => void;
  onRewardWatch: () => Promise<void>;
  rewardModalOpen: boolean;
  canAskReward: boolean;

  rateOpen: boolean;
  setRateOpen: (v: boolean) => void;
  openStoreReview: () => Promise<void>;
  openFeedback: () => Promise<void>;
};

const AppContext = createContext<AppContextType | null>(null);

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { theme, themeName, toggleTheme } = useTheme();

  const { value: lang, setValue: setLang } = useAsyncStorageState<Lang>(STORAGE_LANG_KEY, "en", {
    deserialize: (raw) => (raw === "sq" ? "sq" : "en"),
  });

  const { value: radiusM, setValue: setRadiusM } = useAsyncStorageState<number>(STORAGE_STATIONS_RADIUS_KEY, 5000, {
    deserialize: (raw) => {
      const n = Number(raw);
      return n === 2000 || n === 5000 || n === 10000 ? n : 5000;
    },
    serialize: (v) => String(v),
  });

  const { value: country, setValue: setCountry } = useAsyncStorageState<string>(STORAGE_COUNTRY_KEY, "Albania");

  const { value: fuelType, setValue: setFuelType } = useAsyncStorageState<FuelType>(STORAGE_FUELTYPE_KEY, "diesel", {
    deserialize: (raw) => (raw === "gasoline95" || raw === "lpg" || raw === "diesel" ? raw : "diesel"),
  });

  const { value: favorites, setValue: setFavorites } = useAsyncStorageState<string[]>(STORAGE_FAVORITES_KEY, [], {
    serialize: (v) => JSON.stringify(v),
    deserialize: parseStringArray,
  });

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

  useEffect(() => {
    mobileAds().initialize();
  }, []);

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

  const rate = useRatePrompt({ threshold: 4, cooldownDays: 7 });

  useEffect(() => {
    if (!data?.countries?.length) return;
    const exists = new Set(data.countries.map((c) => c.country));
    setFavorites((p) => p.filter((x) => exists.has(x)));
    setCompareCountries((p) => p.filter((x) => exists.has(x)));
  }, [data?.countries?.length, setFavorites, setCompareCountries]);

  const toggleLang = () => setLang((p) => (p === "en" ? "sq" : "en"));

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

  const applyCompareSet = (countriesToApply: string[]) => {
    setCompareCountries(countriesToApply);
  };

  const [rewardModalOpen, setRewardModalOpen] = useState(false);
  const pendingActionRef = useRef<null | (() => void)>(null);

  const { value: rewardPromptCooldownUntil, setValue: setRewardPromptCooldownUntil } = useAsyncStorageState<number>(
    "reward_prompt_cooldown_until_utc_ms",
    0,
    {
      deserialize: (raw) => {
        const n = Number(raw);
        return Number.isFinite(n) ? n : 0;
      },
      serialize: (v) => String(v),
    }
  );

  const nowMs = Date.now();
  const canAskReward = !reward.unlocked && nowMs >= rewardPromptCooldownUntil;

  const suppressRewardPromptFor30Min = () => {
    setRewardPromptCooldownUntil(Date.now() + 30 * 60 * 1000);
  };

  const openRewardModal = useCallback(
    (after?: () => void) => {
      pendingActionRef.current = after ?? null;
      setRewardModalOpen(true);
    },
    []
  );

  const closeRewardModal = useCallback(
    (suppress: boolean) => {
      if (suppress) suppressRewardPromptFor30Min();
      setRewardModalOpen(false);
      pendingActionRef.current = null;
    },
    [setRewardPromptCooldownUntil]
  );

  const onRewardContinue = useCallback(() => {
    const act = pendingActionRef.current;
    closeRewardModal(true);
    act?.();
  }, [closeRewardModal]);

  const onRewardWatch = useCallback(async () => {
    await reward.showRewardedAndUnlock();
    const act = pendingActionRef.current;
    closeRewardModal(false);
    act?.();
  }, [reward, closeRewardModal]);

  const refreshAll = useCallback(() => {
    nearby.refresh?.();
    refresh();
  }, [nearby.refresh, refresh]);

  const [rateOpen, setRateOpen] = useState(false);

  useEffect(() => {
    if (!rateOpen && rate.canShow) setRateOpen(true);
  }, [rate.canShow, rateOpen]);

  const setCountryTracked = useCallback(
    (c: string) => {
      setCountry(c);
      rate.track("country_change");
    },
    [setCountry, rate]
  );

  const onOpenExternalMapTracked = useCallback(() => {
    markMapsOpened();
    rate.track("open_map");
  }, [markMapsOpened, rate]);

  const openFeedback = useCallback(async () => {
    const subject = encodeURIComponent("Fuel app feedback");
    const body = encodeURIComponent("Hi! I have feedback:\n\n");
    const mailto = `mailto:fenixkola@gmail.com?subject=${subject}&body=${body}`;
    const ok = await Linking.canOpenURL(mailto);
    if (ok) await Linking.openURL(mailto);
  }, []);

  const openStoreReview = useCallback(async () => {
    rate.markRated();
    setRateOpen(false);
    const url = PLAY_STORE_URL;
    const ok = await Linking.canOpenURL(url);
    if (ok) await Linking.openURL(url);
  }, [rate]);

  const currency = useMemo(() => getCurrencyForCountry(country), [country]);
  const canLocal = useMemo(() => currency !== "EUR" && hasRate(currency, fx.rates), [currency, fx.rates]);
  const effectiveCurrencyMode: CurrencyMode = currencyMode === "local" && canLocal ? "local" : "eur";

  const value = useMemo<AppContextType>(
    () => ({
      theme,
      themeName,
      toggleTheme,
      lang,
      setLang,
      toggleLang,
      t,
      country,
      setCountry,
      setCountryTracked,
      fuelType,
      setFuelType,
      favorites,
      toggleFavorite,
      compareCountries,
      addCompare,
      removeCompare,
      applyCompareSet,
      maxCompare,
      currencyMode,
      setCurrencyMode,
      effectiveCurrencyMode,
      currency,
      canLocal,
      radiusM,
      setRadiusM,
      data,
      prevSelected,
      cacheSavedAtUtc,
      isFromCache,
      error,
      loading,
      refreshing,
      countries,
      selected,
      fxRates: fx.rates,
      loc,
      nearby,
      reward,
      rate,
      adUnitId,
      refreshAll,
      markMapsOpened: onOpenExternalMapTracked,
      openRewardModal,
      closeRewardModal,
      onRewardContinue,
      onRewardWatch,
      rewardModalOpen,
      canAskReward,
      rateOpen,
      setRateOpen,
      openStoreReview,
      openFeedback,
    }),
    [
      theme,
      themeName,
      toggleTheme,
      lang,
      setLang,
      toggleLang,
      t,
      country,
      setCountry,
      setCountryTracked,
      fuelType,
      setFuelType,
      favorites,
      compareCountries,
      maxCompare,
      currencyMode,
      setCurrencyMode,
      effectiveCurrencyMode,
      currency,
      canLocal,
      radiusM,
      setRadiusM,
      data,
      prevSelected,
      cacheSavedAtUtc,
      isFromCache,
      error,
      loading,
      refreshing,
      countries,
      selected,
      fx.rates,
      loc,
      nearby,
      reward,
      rate,
      adUnitId,
      refreshAll,
      onOpenExternalMapTracked,
      openRewardModal,
      closeRewardModal,
      onRewardContinue,
      onRewardWatch,
      rewardModalOpen,
      canAskReward,
      rateOpen,
      setRateOpen,
      openStoreReview,
      openFeedback,
      toggleFavorite,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}