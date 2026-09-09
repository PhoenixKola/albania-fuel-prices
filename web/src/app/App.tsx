import { ALBANIAN_ENABLED } from "../config/features";
import { useEffect, useCallback, useMemo, lazy, Suspense } from "react";
import { Routes, Route, useLocation, useParams } from "react-router-dom";
import type { Lang } from "../models/i18n";
import type { FuelType } from "../models/fuel";
import type { LatestEurope } from "../models/fuel";
import type { Trends } from "../models/trends";
import type { Currency } from "../models/currency";
import { i18n } from "../locales";
import type { TDict } from "../locales";
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
import { useTrends } from "../hooks/useTrends";
import { useWatchlist } from "../hooks/useWatchlist";
import { useToast } from "../hooks/useToast";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import HomePage from "../pages/HomePage";
const StationsPage = lazy(() => import("../pages/StationsPage"));
const ComparePage = lazy(() => import("../pages/ComparePage"));
const RankingsPage = lazy(() => import("../pages/RankingsPage"));
const AboutPage = lazy(() => import("../pages/AboutPage"));
const ContactPage = lazy(() => import("../pages/ContactPage"));
const PrivacyPage = lazy(() => import("../pages/PrivacyPage"));
const TermsPage = lazy(() => import("../pages/TermsPage"));
const EditorialPolicyPage = lazy(() => import("../pages/EditorialPolicyPage"));
const DisclaimerPage = lazy(() => import("../pages/DisclaimerPage"));
const FuelQuizPage = lazy(() => import("../pages/FuelQuizPage"));
const DailyChallengePage = lazy(() => import("../pages/DailyChallengePage"));
const MethodologyPage = lazy(() => import("../pages/MethodologyPage"));
const HowFuelPricesWorkPage = lazy(() => import("../pages/HowFuelPricesWorkPage"));
const EuropeFuelComparisonPage = lazy(() => import("../pages/EuropeFuelComparisonPage"));
const RoadTripFuelGuidePage = lazy(() => import("../pages/RoadTripFuelGuidePage"));
const CountryFuelPricesPage = lazy(() => import("../pages/CountryFuelPricesPage"));
const MarketReportPage = lazy(() => import("../pages/MarketReportPage"));
const InsightsIndexPage = lazy(() => import("../pages/InsightsIndexPage"));
const InsightArticlePage = lazy(() => import("../pages/InsightArticlePage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
import RouteSeo from "./RouteSeo";
import { MonetizationProvider } from "../components/ads/MonetizationProvider";
const TripCostCalculatorPage = lazy(() => import("../pages/TripCostCalculatorPage"));
const AlbaniaCarRentalGuidePage = lazy(() => import("../pages/AlbaniaCarRentalGuidePage"));
import "../styles/travel.css";
import "../styles/editorial.css";

import logo from "../assets/Logo.png";

type CountryFuelRouteProps = {
  t: TDict;
  lang: Lang;
  data: LatestEurope | null;
  trends: Trends | null;
  fuelType: FuelType;
  setFuelType: (v: FuelType) => void;
  loading: boolean;
  setCountry: (country: string) => void;
  currency: Currency;
  fxRates: ReturnType<typeof useFxRates>["rates"];
};

function CountryFuelRoute({ t, lang, data, trends, fuelType, setFuelType, loading, setCountry, currency, fxRates }: CountryFuelRouteProps) {
  const { countrySlug } = useParams<{ countrySlug: string }>();

  return (
    <CountryFuelPricesPage
      slug={countrySlug ?? ""}
      t={t}
      lang={lang}
      data={data}
      trends={trends}
      fuelType={fuelType}
      setFuelType={setFuelType}
      loading={loading}
      setCountry={setCountry}
      currency={currency}
      fxRates={fxRates}
    />
  );
}

export default function App() {
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  const [preferredLang, setLang] = useLocalStorageState<Lang>(STORAGE_LANG_KEY, "en", {
    deserialize: (raw) => (raw === "sq" ? "sq" : "en"),
  });

  const lang: Lang = ALBANIAN_ENABLED ? preferredLang : "en";

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
  const trends = useTrends();
  const { watchlist, add, remove, has } = useWatchlist();
  const { toast, show } = useToast();

  const subtitle = useMemo(() => {
    if (!data) return t.subtitleLoading;
    const parsed = new Date(`${data.as_of}T00:00:00Z`);
    const pretty = Number.isNaN(parsed.getTime())
      ? data.as_of
      : parsed.toLocaleDateString(lang === "sq" ? "sq-AL" : "en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
          timeZone: "UTC",
        });
    return t.subtitleAsOf(pretty);
  }, [data, t, lang]);

  const handleRefresh = useCallback(() => {
    refresh();
  }, [refresh]);

  return (
    <MonetizationProvider lang={lang}><div className="page">
      <div className="container">
        <Navbar
          t={t}
          logoSrc={logo}
          subtitle={subtitle}
          lang={lang}
          theme={theme}
          currency={currency}
          onSetCurrency={setCurrency}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onToggleLang={toggleLang}
          onToggleTheme={toggleTheme}
        />

        <RouteSeo />

        <Suspense
          fallback={
            <section className="contentSection pageSkeleton" aria-busy="true">
              <div className="skeletonBlock skeletonBlockTitle" />
              <div className="skeletonBlock" />
              <div className="skeletonBlock skeletonBlockShort" />
            </section>
          }
        >
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
                fuelType={fuelType}
                setFuelType={setFuelType}
                setCountry={setCountry}
                currency={currency}
                setCurrency={setCurrency}
                fxRates={fx.rates}
                trends={trends}
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
                trends={trends}
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
                trends={trends}
                country={country}
                onOpen={setCountry}
              />
            }
          />
          <Route path="/about" element={<AboutPage lang={lang} />} />
          <Route path="/contact" element={<ContactPage lang={lang} />} />
          <Route path="/privacy" element={<PrivacyPage lang={lang} />} />
          <Route path="/terms" element={<TermsPage lang={lang} />} />
          <Route path="/editorial-policy" element={<EditorialPolicyPage lang={lang} />} />
          <Route path="/disclaimer" element={<DisclaimerPage lang={lang} />} />
          <Route
            path="/fuel-quiz"
            element={<FuelQuizPage data={data} loading={loading} />}
          />
          <Route
            path="/daily-challenge"
            element={<DailyChallengePage data={data} loading={loading} />}
          />
          <Route path="/market-report" element={<MarketReportPage lang={lang} data={data} />} />
          <Route path="/insights" element={<InsightsIndexPage />} />
          <Route path="/insights/:articleSlug" element={<InsightArticlePage />} />
          <Route path="/methodology" element={<MethodologyPage t={t} />} />
          <Route path="/how-fuel-prices-work" element={<HowFuelPricesWorkPage t={t} />} />
          <Route path="/europe-fuel-comparison" element={<EuropeFuelComparisonPage t={t} />} />
          <Route path="/trip-cost-calculator" element={<TripCostCalculatorPage lang={lang} data={data} fxRates={fx.rates} loading={loading} />} />
          <Route path="/albania-car-rental-guide" element={<AlbaniaCarRentalGuidePage lang={lang} data={data} />} />
          <Route path="/road-trip-fuel-guide" element={<RoadTripFuelGuidePage t={t} lang={lang} />} />
          <Route
            path="/fuel-prices/:countrySlug"
            element={
              <CountryFuelRoute
                t={t}
                lang={lang}
                data={data}
                trends={trends}
                fuelType={fuelType}
                setFuelType={setFuelType}
                loading={loading}
                setCountry={setCountry}
                currency={currency}
                fxRates={fx.rates}
              />
            }
          />
          <Route path="*" element={<NotFoundPage t={t} />} />
        </Routes>
        </Suspense>

        <Footer t={t} lang={lang} dataAsOf={data?.as_of ?? null} />
      </div>
    </div></MonetizationProvider>
  );
}
