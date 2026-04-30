import { lazy, Suspense } from "react";
import type { Lang } from "../models/i18n";
import type { Currency } from "../models/currency";
import type { CountryPrices, LatestEurope } from "../models/fuel";
import type { TDict } from "../locales";
import type { FxRates } from "../utils/currency";

import AdBar from "../components/ads/AdBar";
import FuelCard from "../components/fuel/FuelCard";
import CurrencyModeCard from "../components/fuel/CurrencyModeCard";
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
  setCountry: (c: string) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  fxRates: FxRates | null;
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
  setCountry,
  currency,
  setCurrency,
  fxRates,
  toast,
  show,
  refresh,
}: Props) {
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

      <CurrencyModeCard t={t} country={country} currency={currency} setCurrency={setCurrency} />

      {error ? <Notice t={t} message={error} onRetry={refresh} /> : null}

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
        onCopy={copyText}
        onShare={shareText}
      />

      <MethodologySection
        t={t}
        fuelSourceLabel={data?.source ?? t.methodologyFuelSourceDefault}
        fxSourceLabel={t.methodologyFxSourceDefault}
        updateFrequency={t.methodologyUpdateFrequencyDefault}
      />

      <SourceCard t={t} data={data} />

      <Suspense fallback={<section className="contentSection"><p className="contentBody">Loading guide content...</p></section>}>
        <HomeEditorialDeepDive data={data} />
      </Suspense>

      <AdBar
        adClient="ca-pub-2653462201538649"
        adSlot="5789581249"
        enabled={canShowAds}
        lang={lang}
      />
    </>
  );
}
