import type { Lang } from "../../models/i18n";
import type { Currency } from "../../models/currency";
import type { CountryPrices, FuelType, LatestEurope } from "../../models/fuel";
import type { TDict } from "../../locales";
import { Link } from "react-router-dom";
import type { FxRates } from "../../utils/currency";
import { fuelLabel, getEurPrice } from "../../utils/fuel";
import { formatFuelPrice } from "../../utils/priceDisplay";
import { isEuropeanCountry } from "../../utils/regions";

type HeroIntroProps = {
  t: TDict;
  lang: Lang;
  updatedAt?: string | Date | null;
  data: LatestEurope | null;
  country: string;
  selected: CountryPrices | null;
  fuelType: FuelType;
  currency: Currency;
  fxRates: FxRates | null;
};

function formatUpdatedAt(value: string | Date | null | undefined, t: TDict, lang: Lang) {
  if (!value) return t.heroLiveFallback;

  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return t.heroLiveFallback;

  const locale = lang === "sq" ? "sq-AL" : "en-GB";
  return t.heroUpdatedAt(
    date.toLocaleString(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    })
  );
}

export default function HeroIntro({ t, lang, updatedAt, data, country, selected, fuelType, currency, fxRates }: HeroIntroProps) {
  const selectedPrice = getEurPrice(selected, fuelType);
  const heroPrice = formatFuelPrice(country, selectedPrice, currency, fxRates);
  const heroFuel = fuelLabel(t, fuelType);
  const pricedCountries =
    data?.countries
      ?.filter((item) => isEuropeanCountry(item.country))
      .map((item) => ({ country: item.country, price: getEurPrice(item, fuelType) }))
      .filter((item): item is { country: string; price: number } => typeof item.price === "number" && Number.isFinite(item.price))
      .sort((a, b) => a.price - b.price) ?? [];
  const rank =
    selectedPrice != null && isEuropeanCountry(country) && pricedCountries.length
      ? pricedCountries.filter((item) => item.price < selectedPrice).length + 1
      : null;
  const average = pricedCountries.length
    ? pricedCountries.reduce((sum, item) => sum + item.price, 0) / pricedCountries.length
    : null;
  const averageLabel =
    selectedPrice == null || average == null
      ? t.heroShowcaseMockupRow2
      : selectedPrice <= average
        ? t.heroShowcaseBelowAverage
        : t.heroShowcaseAboveAverage;

  return (
    <section className="contentHero" aria-labelledby="home-hero-title">
      <div className="contentHeroCopy">
        <div className="contentHeroBadge">{t.heroShowcaseBadge}</div>
        <h1 id="home-hero-title" className="contentHeroTitle">{t.heroShowcaseTitle}</h1>
        <p className="contentHeroText">{t.heroShowcaseSubtitle}</p>

        <div className="contentHeroActions">
          <a className="heroCta heroCtaPrimary" href="#price-tool" aria-label={t.heroShowcasePrimaryCta}>
            {t.heroShowcasePrimaryCta}
          </a>
          <Link className="heroCta heroCtaSecondary" to="/stations" aria-label={t.heroShowcaseSecondaryCta}>
            {t.heroShowcaseSecondaryCta}
          </Link>
        </div>

        <div className="heroTrustRow" aria-label={formatUpdatedAt(updatedAt, t, lang)}>
          <span>{t.heroShowcaseTrust1}</span>
          <span>{t.heroShowcaseTrust2}</span>
          <span>{t.heroShowcaseTrust3}</span>
        </div>
      </div>

      <div className="contentHeroVisual" aria-hidden="true">
        <div className="heroFloatCard heroFloatCardTop">{t.heroShowcaseFloat1}</div>
        <div className="heroFloatCard heroFloatCardBottom">{t.heroShowcaseFloat2}</div>

        <div className="heroPhone">
          <div className="heroPhoneSpeaker" />
          <div className="heroPhoneScreen">
            <div className="heroPhoneStatus">
              <span>{t.heroShowcaseMockupStatus}</span>
              <span>•••</span>
            </div>
            <div className="heroPhoneBalance">
              <span className="heroPhoneAmount">{heroPrice}</span>
              <span className="heroPhoneUnit">/L</span>
            </div>
            <div className="heroPhonePill">{country}<span aria-hidden="true"> · </span>{heroFuel}</div>
            <div className="heroPhoneActions">
              <span />
              <span />
              <span />
            </div>
            <div className="heroPhonePulse">
              <strong>{t.heroShowcaseMockupCardTitle}</strong>
              <span>{rank ? t.heroShowcaseRank(rank) : t.heroShowcaseMockupRow1}</span>
              <span>{averageLabel}</span>
              <span>{t.heroShowcaseMockupRow3}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
