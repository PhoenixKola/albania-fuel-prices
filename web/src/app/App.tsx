import { useMemo, useState } from "react";
import type { Lang } from "../models/i18n";
import type { Currency } from "../models/currency";
import type { FuelType } from "../models/fuel";
import { i18n } from "../locales";
import {
  DATA_URL,
  STORAGE_ALL_RATE_KEY,
  STORAGE_CITY_BIAS_KEY,
  STORAGE_CITY_KEY,
  STORAGE_COUNTRY_KEY,
  STORAGE_CURRENCY_KEY,
  STORAGE_FUELTYPE_KEY,
  STORAGE_LANG_KEY,
} from "../config/constants";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
import { useFuelData } from "../hooks/useFuelData";
import { useTheme } from "../hooks/useTheme";
import { useWatchlist } from "../hooks/useWatchlist";
import { useToast } from "../hooks/useToast";

import AdBar from "../components/ads/AdBar";
import TopBar from "../components/layout/TopBar";
import FuelCard from "../components/fuel/FuelCard";
import SourceCard from "../components/meta/SourceCard";
import Notice from "../components/feedback/Notice";
import ToastHost from "../components/feedback/ToastHost";
import WatchlistCard from "../components/fuel/WatchlistCard";
import RankingCard from "../components/fuel/RankingCard";
import QuickCalcCard from "../components/fuel/QuickCalcCard";
import CityEstimateCard from "../components/fuel/CityEstimateCard";

import Modal from "../components/ui/Modal";
import SourceFab from "../components/meta/SourceFab";

import { getEurPrice } from "../utils/fuel";
import logo from "../assets/logo.png";

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { toast, show } = useToast();
  const [sourceOpen, setSourceOpen] = useState(false);

  const [lang, setLang] = useLocalStorageState<Lang>(STORAGE_LANG_KEY, "en", {
    deserialize: (raw) => (raw === "sq" ? "sq" : "en"),
  });

  const [country, setCountry] = useLocalStorageState<string>(STORAGE_COUNTRY_KEY, "Albania");

  const [fuelType, setFuelType] = useLocalStorageState<FuelType>(STORAGE_FUELTYPE_KEY, "diesel", {
    deserialize: (raw) => (raw === "gasoline95" || raw === "lpg" || raw === "diesel" ? raw : "diesel"),
  });

  const [currency, setCurrency] = useLocalStorageState<Currency>(STORAGE_CURRENCY_KEY, "EUR", {
    deserialize: (raw) => (raw === "ALL" ? "ALL" : "EUR"),
  });

  const [allPerEur, setAllPerEur] = useLocalStorageState<number>(STORAGE_ALL_RATE_KEY, 100, {
    deserialize: (raw) => {
      const n = Number(raw);
      return Number.isFinite(n) && n > 0 ? n : 100;
    },
    serialize: (v) => String(v),
  });

  const [city, setCity] = useLocalStorageState<string>(STORAGE_CITY_KEY, "Tirana");
  const [cityBias, setCityBias] = useLocalStorageState<number>(STORAGE_CITY_BIAS_KEY, 0, {
    deserialize: (raw) => {
      const n = Number(raw);
      return Number.isFinite(n) ? n : 0;
    },
    serialize: (v) => String(v),
  });

  const t = i18n[lang];

  const { data, error, loading, refreshing, countries, selected, refresh } = useFuelData({
    url: DATA_URL,
    country,
    setCountry,
  });

  const { watchlist, add, remove, has } = useWatchlist();

  const subtitle = data ? t.subtitleAsOf(data.as_of) : t.subtitleLoading;

  const toggleLang = () => setLang(lang === "en" ? "sq" : "en");

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      show(t.copied);
    } catch {
      show("Copy failed");
    }
  };

  const shareText = async (text: string) => {
    const nav = navigator;
    if (nav.share) {
      try {
        await nav.share({ title: t.shareTextTitle, text });
      } catch {
        //
      }
      return;
    }
    await copyText(text);
  };

  const priceForTools = useMemo(() => getEurPrice(selected, fuelType), [selected, fuelType]);

  return (
    <>
      <ToastHost message={toast} />

      <div className="page">
        <div className="container">
          <TopBar
            t={t}
            logoSrc={logo}
            subtitle={subtitle}
            lang={lang}
            theme={theme}
            refreshing={refreshing}
            onRefresh={refresh}
            onToggleLang={toggleLang}
            onToggleTheme={toggleTheme}
          />

          {error ? <Notice t={t} message={error} onRetry={refresh} /> : null}

          <div className="grid">
            <div className="mainCol">
              <FuelCard
                t={t}
                data={data}
                loading={loading}
                countries={countries}
                country={country}
                selected={selected}
                onSelectCountry={setCountry}
                currency={currency}
                allPerEur={allPerEur}
                onCopy={copyText}
                onShare={shareText}
              />
              
              {country === "Albania" ? (
                <CityEstimateCard
                  t={t}
                  base={selected}
                  city={city}
                  setCity={setCity}
                  bias={cityBias}
                  setBias={setCityBias}
                  currency={currency}
                  allPerEur={allPerEur}
                />
              ) : null}

              <QuickCalcCard
                t={t}
                fuelType={fuelType}
                setFuelType={setFuelType}
                currency={currency}
                setCurrency={setCurrency}
                allPerEur={allPerEur}
                setAllPerEur={setAllPerEur}
                priceEur={priceForTools}
              />
            </div>

            <div className="sideCol">
              <WatchlistCard
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
                allPerEur={allPerEur}
              />

              <RankingCard
                t={t}
                data={data}
                fuelType={fuelType}
                setFuelType={setFuelType}
                currency={currency}
                allPerEur={allPerEur}
                onOpen={setCountry}
              />
            </div>
          </div>
          <AdBar adClient="ca-pub-2653462201538649" adSlot="5789581249" />
        </div>
      </div>

      <SourceFab label={t.source} onClick={() => setSourceOpen(true)} />

      <Modal open={sourceOpen} title={t.source} onClose={() => setSourceOpen(false)}>
        <SourceCard t={t} lang={lang} data={data} />
      </Modal>
    </>
  );
}