import React, { useEffect, useMemo, useState } from "react";
import { RefreshControl, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import mobileAds, { TestIds } from "react-native-google-mobile-ads";

import { DATA_URL } from "../constants/urls";
import {
  STORAGE_CITY_BIAS_KEY,
  STORAGE_CITY_KEY,
  STORAGE_COUNTRY_KEY,
  STORAGE_FUELTYPE_KEY,
  STORAGE_LANG_KEY,
} from "../constants/storage";
import { i18n, type Lang } from "../i18n";
import type { FuelType } from "../types/fuel";
import { useAsyncStorageState } from "../hooks/useAsyncStorageState";
import { useFuelData } from "../hooks/useFuelData";
import { useTheme } from "../hooks/useTheme";

import TopBar from "../components/layout/TopBar";
import FuelCard from "../components/fuel/FuelCard";
import RankingCard from "../components/fuel/RankingCard";
import CityEstimateCard from "../components/fuel/CityEstimateCard";
import ErrorCard from "../components/feedback/ErrorCard";
import CountrySearchModal from "../components/country/CountrySearchModal";
import AdBar from "../components/ads/AdBar";

import { makeHomeStyles } from "./HomeScreen.styles";

export default function HomeScreen() {
  const { theme, themeName, toggleTheme } = useTheme();
  const s = useMemo(() => makeHomeStyles(theme), [theme]);

  const { value: lang, setValue: setLang } = useAsyncStorageState<Lang>(STORAGE_LANG_KEY, "en", {
    deserialize: (raw) => (raw === "sq" ? "sq" : "en"),
  });

  const { value: country, setValue: setCountry } = useAsyncStorageState<string>(
    STORAGE_COUNTRY_KEY,
    "Albania"
  );

  const { value: fuelType, setValue: setFuelType } = useAsyncStorageState<FuelType>(
    STORAGE_FUELTYPE_KEY,
    "diesel",
    {
      deserialize: (raw) =>
        raw === "gasoline95" || raw === "lpg" || raw === "diesel" ? raw : "diesel",
    }
  );

  const { value: city, setValue: setCity } = useAsyncStorageState<string>(STORAGE_CITY_KEY, "Tirana");

  const { value: cityBias, setValue: setCityBias } = useAsyncStorageState<number>(
    STORAGE_CITY_BIAS_KEY,
    0,
    {
      deserialize: (raw) => {
        const n = Number(raw);
        return Number.isFinite(n) ? n : 0;
      },
      serialize: (v) => String(v),
    }
  );

  const t = i18n[lang];

  const { data, error, loading, refreshing, countries, selected, refresh } = useFuelData({
    url: DATA_URL,
    country,
    setCountry,
  });

  const [countryModalOpen, setCountryModalOpen] = useState(false);

  useEffect(() => {
    mobileAds().initialize();
  }, []);

  const toggleLang = () => setLang((p) => (p === "en" ? "sq" : "en"));

  const adUnitId = __DEV__ ? TestIds.BANNER : "ca-app-pub-2653462201538649/5444199958";

  return (
    <SafeAreaView style={s.screen} edges={["top", "left", "right", "bottom"]}>
      <StatusBar
        barStyle={themeName === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.bg}
      />

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
          themePillLabel={themeName === "dark" ? "☀️" : "🌙"}
          onToggleTheme={toggleTheme}
        />

        {!data && !error && loading ? null : null}

        {error ? (
          <ErrorCard theme={theme} title={t.couldntLoad} message={error} cta={t.tryAgain} onPress={refresh} />
        ) : null}

        <FuelCard
          theme={theme}
          t={t}
          data={data}
          loading={loading}
          country={country}
          selected={selected}
          refreshing={refreshing}
          onRefresh={refresh}
          onOpenCountrySearch={() => setCountryModalOpen(true)}
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
          />
        ) : null}

        <RankingCard
          theme={theme}
          t={t}
          data={data}
          fuelType={fuelType}
          setFuelType={setFuelType}
          currentCountry={country}
          onOpenCountry={(c) => setCountry(c)}
        />

        <CountrySearchModal
          theme={theme}
          open={countryModalOpen}
          title={t.changeCountry}
          placeholder={t.searchPlaceholder}
          closeLabel={t.close}
          countries={countries}
          value={country}
          onClose={() => setCountryModalOpen(false)}
          onSelect={(c) => {
            setCountry(c);
            setCountryModalOpen(false);
          }}
        />

        <AdBar theme={theme} unitId={adUnitId} />
      </ScrollView>
    </SafeAreaView>
  );
}