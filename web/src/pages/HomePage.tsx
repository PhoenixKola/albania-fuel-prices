import { useEffect } from "react";
import type { Lang } from "../models/i18n";
import type { Currency } from "../models/currency";
import type { FuelType } from "../models/fuel";
import type { TDict } from "../locales";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
import { useFuelData } from "../hooks/useFuelData";
import { useWatchlist } from "../hooks/useWatchlist";
import { useToast } from "../hooks/useToast";
import { useFxRates } from "../hooks/useFxRates";
import {
  DATA_URL,
  STORAGE_COUNTRY_KEY,
  STORAGE_CURRENCY_KEY,
  STORAGE_FUELTYPE_KEY,
  STORAGE_STATIONS_RADIUS_KEY,
} from "../config/constants";

import AdBar from "../components/ads/AdBar";
import FuelCard from "../components/fuel/FuelCard";
import SourceCard from "../components/meta/SourceCard";
import Notice from "../components/feedback/Notice";
import ToastHost from "../components/feedback/ToastHost";
import WatchlistCard from "../components/fuel/WatchlistCard";
import RankingCard from "../components/fuel/RankingCard";
import NearbyStationsCard from "../components/meta/NearbyStationsCard";

import HeroIntro from "../components/content/HeroIntro";
import EditorialSummary from "../components/content/EditorialSummary";
import MethodologySection from "../components/content/MethodologySection";
import FaqSection from "../components/content/FaqSection";

type Props = {
  t: TDict;
  lang: Lang;
  setSubtitle: (s: string) => void;
};

export default function HomePage({ t, lang, setSubtitle }: Props) {
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

  const { data, error, loading, countries, selected, refresh } = useFuelData({
    url: DATA_URL,
    country,
    setCountry,
  });

  const fx = useFxRates();
  const { watchlist, add, remove, has } = useWatchlist();
  const { toast, show } = useToast();

  useEffect(() => {
    setSubtitle(data ? t.subtitleAsOf(data.as_of) : t.subtitleLoading);
  }, [data, t, setSubtitle]);

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      show(t.copied);
    } catch {
      show("Copy failed");
    }
  };

  const shareText = async (text: string) => {
    const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
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

  const canShowAds = lang === "en" && !loading && !error && !!data && data.countries.length > 0;

  const editorialItems =
    data?.countries?.map((c) => ({
      country: c.country,
      petrol: typeof c.gasoline95_eur === "number" ? c.gasoline95_eur : null,
      diesel: typeof c.diesel_eur === "number" ? c.diesel_eur : null,
      currency: "EUR",
    })) ?? [];

  return (
    <>
      <ToastHost message={toast} />

      <HeroIntro t={t} lang={lang} updatedAt={data?.fetched_at_utc ?? null} />

      <EditorialSummary t={t} items={editorialItems} />

      <div className="card pageIntroCard">
        <div className="body pageIntroBody">
          <div className="pageIntroContent">
            <div className="pageIntroText">
              <div className="cardTitle">{t.currencyMode}</div>
              <div className="cardSubtle">{country}</div>
            </div>

            <div className="segRow pageIntroSeg">
              <button
                type="button"
                className={`seg ${currency === "eur" ? "segActive" : ""}`}
                onClick={() => setCurrency("eur")}
              >
                {t.currencyEUR}
              </button>
              <button
                type="button"
                className={`seg ${currency === "local" ? "segActive" : ""}`}
                onClick={() => setCurrency("local")}
              >
                {t.currencyLocal}
              </button>
            </div>
          </div>
        </div>
      </div>

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
            fxRates={fx.rates}
            onCopy={copyText}
            onShare={shareText}
          />

          <NearbyStationsCard t={t} radiusM={radiusM} setRadiusM={setRadiusM} />
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
            fxRates={fx.rates}
          />

          <RankingCard
            t={t}
            data={data}
            fuelType={fuelType}
            setFuelType={setFuelType}
            currency={currency}
            fxRates={fx.rates}
            onOpen={setCountry}
          />
        </div>
      </div>

      <MethodologySection
        t={t}
        fuelSourceLabel={data?.source ?? t.methodologyFuelSourceDefault}
        fxSourceLabel={t.methodologyFxSourceDefault}
        updateFrequency={t.methodologyUpdateFrequencyDefault}
      />

      <SourceCard t={t} data={data} />

      <FaqSection t={t} />

      <AdBar
        adClient="ca-pub-2653462201538649"
        adSlot="5789581249"
        enabled={canShowAds}
        lang={lang}
      />
    </>
  );
}
