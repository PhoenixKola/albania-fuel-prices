import { useEffect, useCallback, useMemo } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import type { Lang } from "../models/i18n";
import type { FuelType } from "../models/fuel";
import type { Currency } from "../models/currency";
import { i18n } from "../locales";
import {
  DATA_URL,
  STORAGE_LANG_KEY,
  STORAGE_COUNTRY_KEY,
  STORAGE_CURRENCY_KEY,
  STORAGE_FUELTYPE_KEY,
  STORAGE_STATIONS_RADIUS_KEY,
} from "../config/constants";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
import { useTheme } from "../hooks/useTheme";
import { useFuelData } from "../hooks/useFuelData";
import { useFxRates } from "../hooks/useFxRates";
import { useWatchlist } from "../hooks/useWatchlist";
import { useToast } from "../hooks/useToast";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import HomePage from "../pages/HomePage";
import StationsPage from "../pages/StationsPage";
import ComparePage from "../pages/ComparePage";
import RankingsPage from "../pages/RankingsPage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import PrivacyPage from "../pages/PrivacyPage";
import TermsPage from "../pages/TermsPage";
import MethodologyPage from "../pages/MethodologyPage";
import HowFuelPricesWorkPage from "../pages/HowFuelPricesWorkPage";
import EuropeFuelComparisonPage from "../pages/EuropeFuelComparisonPage";
import RoadTripFuelGuidePage from "../pages/RoadTripFuelGuidePage";
import NotFoundPage from "../pages/NotFoundPage";

import logo from "../assets/logo.png";

export default function App() {
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [pathname]);

  const [lang, setLang] = useLocalStorageState<Lang>(STORAGE_LANG_KEY, "en", {
    // deserialize: (raw) => (raw === "sq" ? "sq" : "en"),
    deserialize: () => "en",
  });

  useEffect(() => {
    document.documentElement.lang = lang === "sq" ? "sq" : "en";
  }, [lang]);

  const t = i18n[lang];

  const toggleLang = () => setLang(lang === "en" ? "sq" : "en");

  // ── Shared state lifted from HomePage ──
  const [country, setCountry] = useLocalStorageState<string>(STORAGE_COUNTRY_KEY, "Albania");

  const [fuelType, setFuelType] = useLocalStorageState<FuelType>(STORAGE_FUELTYPE_KEY, "diesel", {
    deserialize: (raw) => (raw === "gasoline95" || raw === "lpg" || raw === "diesel" ? raw : "diesel"),
  });

  const [currency, setCurrency] = useLocalStorageState<Currency>(STORAGE_CURRENCY_KEY, "eur", {
    deserialize: (raw) => (raw === "local" ? "local" : "eur"),
  });

  const [radiusM, setRadiusM] = useLocalStorageState<number>(STORAGE_STATIONS_RADIUS_KEY, 5000, {
    deserialize: (raw) => {
      const n = Number(raw);
      return n === 2000 || n === 5000 || n === 10000 ? n : 5000;
    },
    serialize: (v) => String(v),
  });

  const { data, error, loading, refreshing, countries, selected, refresh } = useFuelData({
    url: DATA_URL,
    country,
    setCountry,
  });

  const fx = useFxRates();
  const { watchlist, add, remove, has } = useWatchlist();
  const { toast, show } = useToast();

  const subtitle = useMemo(
    () => (data ? t.subtitleAsOf(data.as_of) : t.subtitleLoading),
    [data, t]
  );

  const handleRefresh = useCallback(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="page">
      <div className="container">
        <Navbar
          t={t}
          logoSrc={logo}
          subtitle={subtitle}
          lang={lang}
          theme={theme}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onToggleLang={toggleLang}
          onToggleTheme={toggleTheme}
        />

        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                t={t}
                lang={lang}
                data={data}
                error={error}
                loading={loading}
                countries={countries}
                country={country}
                selected={selected}
                setCountry={setCountry}
                currency={currency}
                setCurrency={setCurrency}
                fxRates={fx.rates}
                toast={toast}
                show={show}
                refresh={refresh}
              />
            }
          />
          <Route
            path="/stations"
            element={<StationsPage t={t} radiusM={radiusM} setRadiusM={setRadiusM} />}
          />
          <Route
            path="/compare"
            element={
              <ComparePage
                t={t}
                data={data}
                watchlist={watchlist}
                has={has}
                current={country}
                onAdd={(c) => {
                  add(c);
                  show(`${t.addToWatchlist}: ${c}`);
                }}
                onRemove={(c) => {
                  remove(c);
                  show(`${t.remove}: ${c}`);
                }}
                onOpen={setCountry}
                fuelType={fuelType}
                currency={currency}
                fxRates={fx.rates}
              />
            }
          />
          <Route
            path="/rankings"
            element={
              <RankingsPage
                t={t}
                data={data}
                fuelType={fuelType}
                setFuelType={setFuelType}
                currency={currency}
                fxRates={fx.rates}
                onOpen={setCountry}
              />
            }
          />
          <Route path="/about" element={<AboutPage t={t} />} />
          <Route path="/contact" element={<ContactPage t={t} />} />
          <Route path="/privacy" element={<PrivacyPage t={t} />} />
          <Route path="/terms" element={<TermsPage t={t} />} />
          <Route path="/methodology" element={<MethodologyPage t={t} />} />
          <Route path="/how-fuel-prices-work" element={<HowFuelPricesWorkPage t={t} />} />
          <Route path="/europe-fuel-comparison" element={<EuropeFuelComparisonPage t={t} />} />
          <Route path="/road-trip-fuel-guide" element={<RoadTripFuelGuidePage t={t} />} />
          <Route path="*" element={<NotFoundPage t={t} />} />
        </Routes>

        <Footer t={t} />
      </div>
    </div>
  );
}