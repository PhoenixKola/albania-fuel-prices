import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Pressable, RefreshControl, ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import mobileAds, { TestIds } from "react-native-google-mobile-ads";
import { Ionicons } from "@expo/vector-icons";

import { DATA_URL } from "../constants/urls";
import {
  STORAGE_CITY_BIAS_KEY,
  STORAGE_CITY_KEY,
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
import CityEstimateCard from "../components/fuel/CityEstimateCard";
import ErrorCard from "../components/feedback/ErrorCard";
import CountrySearchModal from "../components/country/CountrySearchModal";
import StationsCard from "../components/stations/StationsCard";
import { useUserLocation } from "../hooks/useUserLocation";
import { useNearbyStations } from "../hooks/useNearbyStations";
import AdBar from "../components/ads/AdBar";
import SegmentedControl from "../components/ui/SegmentedControl";

import { makeHomeStyles } from "./HomeScreen.styles";

type CurrencyMode = "eur" | "local";

function parseStringArray(raw: string) {
  try {
    const j = JSON.parse(raw);
    if (!Array.isArray(j)) return [];
    return j.filter((x) => typeof x === "string");
  } catch {
    return [];
  }
}

function AnimatedPressable({
  onPress,
  children,
  style,
  contentStyle,
  scaleIn = 0.97
}: {
  onPress?: () => void;
  children: React.ReactNode;
  style?: any;
  contentStyle?: any;
  scaleIn?: number;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.timing(scale, { toValue: scaleIn, duration: 90, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  };

  const pressOut = () => {
    Animated.timing(scale, { toValue: 1, duration: 120, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut} style={contentStyle}>
        {children}
      </Pressable>
    </Animated.View>
  );
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

  const { value: city, setValue: setCity } = useAsyncStorageState<string>(STORAGE_CITY_KEY, "Tirana");

  const { value: cityBias, setValue: setCityBias } = useAsyncStorageState<number>(STORAGE_CITY_BIAS_KEY, 0, {
    deserialize: (raw) => {
      const n = Number(raw);
      return Number.isFinite(n) ? n : 0;
    },
    serialize: (v) => String(v)
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
  const [section, setSection] = useState<"rankings" | "compare">("rankings");

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

  const toggleFavorite = (c: string) => {
    setFavorites((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [c, ...prev]));
  };

  const addCompare = (c: string) => {
    setCompareCountries((prev) => {
      if (prev.includes(c)) return prev;
      if (prev.length >= 3) return prev;
      return [...prev, c];
    });
  };

  const removeCompare = (c: string) => {
    setCompareCountries((prev) => prev.filter((x) => x !== c));
  };

  return (
    <SafeAreaView style={s.screen} edges={["top", "left", "right", "bottom"]}>
      <StatusBar barStyle={themeName === "dark" ? "light-content" : "dark-content"} backgroundColor={theme.colors.bg} />

      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      >
        <TopBar
          theme={theme}
          title={t.title}
          subtitle={data ? t.subtitleAsOf(data.as_of) : t.subtitleLoading}
          langPillLabel={lang === "en" ? t.langSQ : t.langEN}
          onToggleLang={toggleLang}
          onToggleTheme={toggleTheme}
        />

        {favorites.length ? (
          <View style={s.quickCard}>
            <View style={s.cardHeader}>
              <View style={s.cardHeaderLeft}>
                <View style={s.headerIcon}>
                  <Ionicons name="flash-outline" size={18} color={theme.colors.linkText} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.cardTitle}>{t.quickSwitch}</Text>
                  <Text style={s.cardSub}>{t.tapToSwitch ?? ""}</Text>
                </View>
              </View>

              <AnimatedPressable
                onPress={() => setCountryModalOpen(true)}
                contentStyle={s.headerBtn}
                scaleIn={0.98}
              >
                <Ionicons name="create-outline" size={16} color={theme.colors.text} />
                <Text style={s.headerBtnText}>{t.edit}</Text>
              </AnimatedPressable>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.quickRow}>
              {favorites.map((c) => {
                const active = c === country;
                return (
                  <AnimatedPressable
                    key={c}
                    onPress={() => setCountry(c)}
                    contentStyle={[s.quickPill, active ? s.quickPillActive : null]}
                    scaleIn={0.97}
                  >
                    <Ionicons
                      name={active ? "checkmark-circle" : "star-outline"}
                      size={16}
                      color={active ? theme.colors.text : theme.colors.muted}
                      style={{ marginRight: 8 }}
                    />
                    <Text style={[s.quickPillText, active ? s.quickPillTextActive : null]}>{c}</Text>
                  </AnimatedPressable>
                );
              })}
            </ScrollView>
          </View>
        ) : (
          <View style={s.quickCard}>
            <View style={s.cardHeader}>
              <View style={s.cardHeaderLeft}>
                <View style={s.headerIcon}>
                  <Ionicons name="star-outline" size={18} color={theme.colors.linkText} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.cardTitle}>{t.quickSwitch}</Text>
                  <Text style={s.cardSub}>{t.quickSwitchEmpty ?? ""}</Text>
                </View>
              </View>

              <AnimatedPressable
                onPress={() => setCountryModalOpen(true)}
                contentStyle={s.headerBtnPrimary}
                scaleIn={0.98}
              >
                <Ionicons name="add" size={18} color={theme.colors.primaryText} />
                <Text style={s.headerBtnPrimaryText}>{t.edit}</Text>
              </AnimatedPressable>
            </View>
          </View>
        )}

        {error ? (
          <ErrorCard theme={theme} title={t.couldntLoad} message={error} cta={t.tryAgain} onPress={refresh} />
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
          currencyMode={currencyMode}
          setCurrencyMode={setCurrencyMode}
          fxRates={fx.rates}
          isFromCache={isFromCache}
          cacheSavedAtUtc={cacheSavedAtUtc}
          refreshing={refreshing}
          onRefresh={refresh}
          onOpenCountrySearch={() => setCountryModalOpen(true)}
        />

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
        />

        {country === "Albania" ? (
          <CityEstimateCard
            theme={theme}
            t={t}
            base={selected}
            fuelType={fuelType}
            setFuelType={setFuelType}
            city={city}
            setCity={setCity}
            bias={cityBias}
            setBias={setCityBias}
            currencyMode={currencyMode}
            fxRates={fx.rates}
          />
        ) : null}

        <SegmentedControl
          theme={theme}
          value={section}
          onChange={setSection}
          items={[
            { value: "rankings", label: t.rankingsTitle, icon: "podium-outline" },
            { value: "compare", label: t.compareTitle, icon: "git-compare-outline" }
          ]}
        />

        {section === "rankings" ? (
          <RankingCard
            theme={theme}
            t={t}
            data={data}
            fuelType={fuelType}
            setFuelType={setFuelType}
            currentCountry={country}
            onOpenCountry={(c) => setCountry(c)}
            currencyMode={currencyMode}
            fxRates={fx.rates}
          />
        ) : (
          <CompareCard
            theme={theme}
            t={t}
            data={data}
            fuelType={fuelType}
            compareCountries={compareCountries}
            onRemove={removeCompare}
            onAddPress={() => setCompareModalOpen(true)}
            currencyMode={currencyMode}
            fxRates={fx.rates}
          />
        )}

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
            setCountry(c);
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

        <AdBar theme={theme} unitId={adUnitId} />
      </ScrollView>
    </SafeAreaView>
  );
}