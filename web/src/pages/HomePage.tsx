import { lazy, Suspense, useMemo } from "react";
import { Link } from "react-router-dom";
import type { Lang } from "../models/i18n";
import type { Currency } from "../models/currency";
import type { CountryPrices, FuelType, LatestEurope } from "../models/fuel";
import type { TDict } from "../locales";
import type { FxRates } from "../utils/currency";
import type { Trends } from "../models/trends";
import { getWeeklyDeltaEur } from "../models/trends";
import { getEurPrice } from "../utils/fuel";
import { isEuropeanCountry } from "../utils/regions";
import { STORAGE_ALL_RATE_KEY } from "../config/constants";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

import AdsterraNativeAd from "../components/ads/AdsterraNativeAd";
import { TravelLinks } from "../components/content/TravelLinks";
import FuelPulse from "../components/fuel/FuelPulse";
import QuickCalcCard from "../components/fuel/QuickCalcCard";
import SourceCard from "../components/meta/SourceCard";
import Notice from "../components/feedback/Notice";
import ToastHost from "../components/feedback/ToastHost";

import { HOME_SUMMARY_HTML } from "../generated/homeSummary";
import HeroIntro, { type HomeFreshness, type HomeHeroModel } from "../components/content/HeroIntro";
import EditorialSummary from "../components/content/EditorialSummary";
import MethodologySection from "../components/content/MethodologySection";
import "../styles/home.css";
import "../styles/home-signature.css";

const HomeEditorialDeepDive = lazy(() => import("../components/content/HomeEditorialDeepDive"));
const HOME_RENDERED_AT = Date.now();

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

type DecisionLink = {
  to: string;
  eyebrow: string;
  title: string;
  text: string;
  cta: string;
  icon: "compare" | "rankings" | "roads" | "stations";
};

function RouteIcon({ icon }: { icon: DecisionLink["icon"] }) {
  if (icon === "compare") {
    return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 8h18M7 8l4-4M7 8l4 4M25 24H7m18 0-4-4m4 4-4 4" /></svg>;
  }
  if (icon === "rankings") {
    return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 26V16h6v10M13 26V9h6v17M20 26V4h6v22M4 26h24" /></svg>;
  }
  if (icon === "roads") {
    return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M12 28 15 4M20 28 17 4M16 9v4M16 18v5M5 26c4-3 6-3 9-1M27 7c-4 3-6 3-9 1" /></svg>;
  }
  return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M8 28V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v22M8 14h14M12 9h6M22 9h3l3 4v10a3 3 0 0 1-6 0v-5" /></svg>;
}

function DriverDecisionRail({ t, lang }: { t: TDict; lang: Lang }) {
  const road = lang === "sq"
    ? { title: "Kontrollo rrugën", text: "Shiko kufizimet, mbylljet dhe datën e fundit të verifikimit.", cta: "Gjendja e rrugëve" }
    : { title: "Check the road", text: "Review restrictions, closures, and the latest verification date.", cta: "Road conditions" };
  const links: DecisionLink[] = [
    { to: "/compare", eyebrow: "01", title: t.homeRouteCompareTitle, text: t.homeRouteCompareText, cta: t.homeRouteCta, icon: "compare" },
    { to: "/rankings", eyebrow: "02", title: t.homeRouteRankingsTitle, text: t.homeRouteRankingsText, cta: t.homeRouteCta, icon: "rankings" },
    { to: "/road-status", eyebrow: "03", title: road.title, text: road.text, cta: road.cta, icon: "roads" },
    { to: "/stations", eyebrow: "04", title: t.homeRouteStationsTitle, text: t.homeRouteStationsText, cta: t.homeRouteCta, icon: "stations" },
  ];

  return (
    <section className="homeDecisionRoute" aria-labelledby="home-routes-title">
      <SectionIntro kicker={t.homeRoutesKicker} title={t.homeRoutesTitle} text={t.homeRoutesSubtitle} id="home-routes-title" />
      <nav className="homeDecisionTrack" aria-label={t.homeRoutesTitle}>
        {links.map((item) => (
          <Link className={`homeDecisionStop homeDecisionStop-${item.icon}`} to={item.to} key={item.to}>
            <span className="homeDecisionMarker"><i>{item.eyebrow}</i><RouteIcon icon={item.icon} /></span>
            <span className="homeDecisionCopy"><strong>{item.title}</strong><small>{item.text}</small></span>
            <span className="homeDecisionAction">{item.cta}<i aria-hidden="true">→</i></span>
          </Link>
        ))}
      </nav>
    </section>
  );
}

function SectionIntro({ kicker, title, text, id }: { kicker: string; title: string; text: string; id?: string }) {
  return (
    <div className="homeSectionIntro">
      <span className="homeEyebrow">{kicker}</span>
      <h2 id={id}>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

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

  const allPerEur = useMemo(() => {
    if (allPerEurStored > 0) return allPerEurStored;
    const live = fxRates?.["ALL"];
    return typeof live === "number" && live > 0 ? Math.round(live * 10) / 10 : 100;
  }, [allPerEurStored, fxRates]);

  const heroModel = useMemo<HomeHeroModel>(() => {
    const selectedPrice = getEurPrice(selected, fuelType);
    const markets = data?.countries
      .filter((item) => isEuropeanCountry(item.country))
      .map((item) => ({ country: item.country, price: getEurPrice(item, fuelType) }))
      .filter((item): item is { country: string; price: number } => typeof item.price === "number" && Number.isFinite(item.price))
      .sort((a, b) => a.price - b.price) ?? [];
    const europeanAverage = markets.length ? markets.reduce((sum, item) => sum + item.price, 0) / markets.length : null;
    const rank = selectedPrice != null && isEuropeanCountry(country)
      ? markets.filter((item) => item.price < selectedPrice).length + 1
      : null;

    return {
      selectedPrice,
      country,
      fuelType,
      rank,
      marketTotal: markets.length,
      europeanAverage,
      averageDifference: selectedPrice != null && europeanAverage != null ? selectedPrice - europeanAverage : null,
      weeklyDelta: getWeeklyDeltaEur(trends, country, fuelType),
      updatedAt: data?.fetched_at_utc ?? null,
    };
  }, [country, data, fuelType, selected, trends]);

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      show(t.copied);
    } catch {
      show(t.homeCopyFailed);
    }
  };

  const shareText = async (text: string) => {
    const nav = navigator as Navigator & { share?: (shareData: ShareData) => Promise<void> };
    if (nav.share) {
      try {
        await nav.share({ title: t.shareTextTitle, text });
      } catch {
        // The native share sheet can be dismissed without being an error state.
      }
      return;
    }
    await copyText(text);
  };

  const canShowAds = !loading && !error && !!data && data.countries.length > 0;
  const editorialItems = data?.countries
    ?.filter((item) => isEuropeanCountry(item.country))
    .map((item) => ({
      country: item.country,
      petrol: typeof item.gasoline95_eur === "number" ? item.gasoline95_eur : null,
      diesel: typeof item.diesel_eur === "number" ? item.diesel_eur : null,
      currency: "EUR",
    })) ?? [];

  const freshness = useMemo<HomeFreshness>(() => {
    if (!data?.as_of) return {
      state: "unknown",
      shortLabel: lang === "sq" ? "Data e panjohur" : "Date unavailable",
      detail: t.heroLiveFallback,
    };
    const asOf = new Date(`${data.as_of}T00:00:00Z`);
    if (Number.isNaN(asOf.getTime())) return {
      state: "unknown",
      shortLabel: lang === "sq" ? "Data e panjohur" : "Date unavailable",
      detail: t.heroLiveFallback,
    };
    const days = Math.max(0, Math.floor((HOME_RENDERED_AT - asOf.getTime()) / 86_400_000));
    const date = asOf.toLocaleDateString(lang === "sq" ? "sq-AL" : "en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
    if (days <= 3) return {
      state: "current",
      shortLabel: date,
      detail: lang === "sq" ? `Vlerat e referencës më ${date}.` : `Reference values dated ${date}.`,
    };
    return {
      state: "stale",
      shortLabel: lang === "sq" ? `${days} ditë të vjetra` : `${days} days old`,
      detail: t.homeStaleNotice(date, days),
    };
  }, [data, lang, t]);

  return (
    <main className="homeExperience">
      <ToastHost message={toast} />
      <HeroIntro
        t={t}
        lang={lang}
        model={heroModel}
        data={data}
        selected={selected}
        countries={countries}
        currency={currency}
        fxRates={fxRates}
        freshness={freshness}
        onSelectCountry={setCountry}
        onSelectFuel={setFuelType}
      />

      {error ? <Notice t={t} message={error} onRetry={refresh} /> : null}

      <FuelPulse
        t={t}
        lang={lang}
        data={data}
        loading={loading}
        countries={countries}
        country={country}
        selected={selected}
        fuelType={fuelType}
        setFuelType={setFuelType}
        setCountry={setCountry}
        currency={currency}
        fxRates={fxRates}
        trends={trends}
        model={heroModel}
        onCopy={copyText}
        onShare={shareText}
      />

      <AdsterraNativeAd location="home-after-primary-prices" enabled={canShowAds} />
      <TravelLinks lang={lang} featured />
      <DriverDecisionRail t={t} lang={lang} />

      <section className="homeDashboardSection homeCalculatorSection" aria-labelledby="home-calculator-title">
        <SectionIntro kicker={t.homeCalculatorKicker} title={t.homeCalculatorTitle} text={t.homeCalculatorSubtitle} id="home-calculator-title" />
        <div className="homeCalculatorShell">
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
        </div>
      </section>

      <section className="homeDashboardSection homeStorySection" aria-labelledby="home-story-title">
        <SectionIntro kicker={t.homeStoryKicker} title={t.homeStoryTitle} text={t.homeStorySubtitle} id="home-story-title" />
        <div className="homeStoryGrid">
          {HOME_SUMMARY_HTML[lang] ? <div className="homeMarketStory" dangerouslySetInnerHTML={{ __html: HOME_SUMMARY_HTML[lang] }} /> : null}
          <div className="homeEditorialPanel"><EditorialSummary t={t} items={editorialItems} /></div>
        </div>
      </section>

      <section className="homeDashboardSection homeTransparencySection" aria-labelledby="home-transparency-title">
        <SectionIntro kicker={t.homeTransparencyKicker} title={t.homeTransparencyTitle} text={t.homeTransparencySubtitle} id="home-transparency-title" />
        <div className="homeTransparencyLedger">
          <div className="homeSourcePanel"><SourceCard t={t} data={data} /></div>
          <div className="homeTrustDetails">
            <details className="contentAccordion homeDisclosure">
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

            <details className="contentAccordion homeDisclosure homeGuideDisclosure">
              <summary className="contentAccordionSummary">{t.accordionGuide}</summary>
              <div className="contentAccordionBody">
                <Suspense fallback={<section className="contentSection"><div className="skeletonWrap"><div className="skeletonLine" /><div className="skeletonLine short" /></div></section>}>
                  <HomeEditorialDeepDive data={data} lang={lang} />
                </Suspense>
              </div>
            </details>
          </div>
        </div>
      </section>


    </main>
  );
}
