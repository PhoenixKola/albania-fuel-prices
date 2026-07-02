import { lazy, Suspense, useMemo } from "react";
import type { Lang } from "../models/i18n";
import type { Currency } from "../models/currency";
import type { CountryPrices, FuelType, LatestEurope } from "../models/fuel";
import type { TDict } from "../locales";
import type { FxRates } from "../utils/currency";
import type { Trends } from "../models/trends";
import { getEurPrice } from "../utils/fuel";
import { isEuropeanCountry } from "../utils/regions";
import { STORAGE_ALL_RATE_KEY } from "../config/constants";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

import AdBar from "../components/ads/AdBar";
import FuelCard from "../components/fuel/FuelCard";
import TrendCard from "../components/fuel/TrendCard";
import QuickCalcCard from "../components/fuel/QuickCalcCard";
import SourceCard from "../components/meta/SourceCard";
import Notice from "../components/feedback/Notice";
import ToastHost from "../components/feedback/ToastHost";

import HeroIntro from "../components/content/HeroIntro";
import EditorialSummary from "../components/content/EditorialSummary";
import MethodologySection from "../components/content/MethodologySection";

const HomeEditorialDeepDive = lazy(() => import("../components/content/HomeEditorialDeepDive"));

type Props = {
  t: TDict;
  lang: Lang;
  data: LatestEurope | null;
  error: string;
  loading: boolean;
  countries: string[];
  country: string;
  selected: CountryPrices | null;
  fuelType: FuelType;
  setFuelType: (v: FuelType) => void;
  setCountry: (c: string) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  fxRates: FxRates | null;
  trends: Trends | null;
  toast: string | null;
  show: (msg: string) => void;
  refresh: () => void;
};

export default function HomePage({
  t,
  lang,
  data,
  error,
  loading,
  countries,
  country,
  selected,
  fuelType,
  setFuelType,
  setCountry,
  currency,
  setCurrency,
  fxRates,
  trends,
  toast,
  show,
  refresh,
}: Props) {
  const [allPerEurStored, setAllPerEur] = useLocalStorageState<number>(STORAGE_ALL_RATE_KEY, 0, {
    deserialize: (raw) => {
      const n = Number(raw);
      return Number.isFinite(n) && n > 0 ? n : 0;
    },
    serialize: (v) => String(v),
  });

  // Prefer the user's manual rate; fall back to the live FX rate, then ~100.
  const allPerEur = useMemo(() => {
    if (allPerEurStored > 0) return allPerEurStored;
    const live = fxRates?.["ALL"];
    return typeof live === "number" && live > 0 ? Math.round(live * 10) / 10 : 100;
  }, [allPerEurStored, fxRates]);

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

  const canShowAds = !loading && !error && !!data && data.countries.length > 0;

  const editorialItems =
    data?.countries
      ?.filter((c) => isEuropeanCountry(c.country))
      .map((c) => ({
        country: c.country,
        petrol: typeof c.gasoline95_eur === "number" ? c.gasoline95_eur : null,
        diesel: typeof c.diesel_eur === "number" ? c.diesel_eur : null,
        currency: "EUR",
      })) ?? [];

  return (
    <>
      <ToastHost message={toast} />

      <HeroIntro
        t={t}
        lang={lang}
        updatedAt={data?.fetched_at_utc ?? null}
        data={data}
        country={country}
        selected={selected}
        fuelType={fuelType}
        currency={currency}
        fxRates={fxRates}
      />

      {error ? <Notice t={t} message={error} onRetry={refresh} /> : null}

      <div id="price-tool">
        <FuelCard
          t={t}
          data={data}
          loading={loading}
          countries={countries}
          country={country}
          selected={selected}
          onSelectCountry={setCountry}
          currency={currency}
          fxRates={fxRates}
          trends={trends}
          onCopy={copyText}
          onShare={shareText}
        />
      </div>

      <TrendCard t={t} trends={trends} country={country} fuelType={fuelType} setFuelType={setFuelType} />

      <QuickCalcCard
        t={t}
        fuelType={fuelType}
        setFuelType={setFuelType}
        currency={currency}
        setCurrency={setCurrency}
        allPerEur={allPerEur}
        setAllPerEur={setAllPerEur}
        priceEur={getEurPrice(selected, fuelType)}
      />

      <EditorialSummary t={t} items={editorialItems} />

      <details className="contentAccordion" open>
        <summary className="contentAccordionSummary">{t.accordionMethodology}</summary>
        <div className="contentAccordionBody">
          <MethodologySection
            t={t}
            fuelSourceLabel={data?.source ?? t.methodologyFuelSourceDefault}
            fxSourceLabel={t.methodologyFxSourceDefault}
            updateFrequency={t.methodologyUpdateFrequencyDefault}
          />
        </div>
      </details>

      <SourceCard t={t} data={data} />

      <details className="contentAccordion" open>
        <summary className="contentAccordionSummary">{t.accordionGuide}</summary>
        <div className="contentAccordionBody">
          <Suspense fallback={<section className="contentSection"><div className="skeletonWrap"><div className="skeletonLine" /><div className="skeletonLine short" /></div></section>}>
            <HomeEditorialDeepDive data={data} />
          </Suspense>
        </div>
      </details>

      <AdBar
        adClient="ca-pub-2653462201538649"
        adSlot="5789581249"
        enabled={canShowAds}
      />
    </>
  );
}
