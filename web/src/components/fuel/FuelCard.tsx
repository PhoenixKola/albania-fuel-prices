import { useMemo } from "react";
import type { CountryPrices, LatestEurope } from "../../models/fuel";
import type { TDict } from "../../locales";
import type { Currency } from "../../models/currency";
import type { FxRates } from "../../utils/currency";
import type { Trends } from "../../models/trends";
import { getTrendSeries, getWeeklyDeltaEur } from "../../models/trends";
import { formatFuelPrice } from "../../utils/priceDisplay";
import LoadingRow from "../feedback/LeadingRow";
import PriceKpi from "./PriceKpi";
import { getIso2ForCountry, getFlagImgUrl } from "../../utils/countryFlag";

type Props = {
  t: TDict;
  data: LatestEurope | null;
  loading: boolean;
  countries: string[];
  country: string;
  selected: CountryPrices | null;
  onSelectCountry: (next: string) => void;
  currency: Currency;
  fxRates: FxRates | null;
  trends: Trends | null;
  onCopy: (text: string) => void;
  onShare: (text: string) => void;
};

/**
 * Countries most relevant to the site's core audience: Albania's neighbors
 * and the most common travel corridors. Stable, so returning visitors see
 * the same chips every time.
 */
const QUICK_COUNTRIES = ["Albania", "Kosovo", "Greece", "Italy", "Montenegro", "North Macedonia", "Croatia"];

export default function FuelCard({
  t,
  data,
  loading,
  countries,
  country,
  selected,
  onSelectCountry,
  currency,
  fxRates,
  trends,
  onCopy,
  onShare,
}: Props) {
  const currentIso2 = useMemo(() => getIso2ForCountry(country), [country]);

  const available = useMemo(() => new Set(countries), [countries]);
  const chipCountries = useMemo(
    () => QUICK_COUNTRIES.filter((c) => c !== country && available.has(c)).slice(0, 6),
    [country, available]
  );

  const g = selected?.gasoline95_eur ?? null;
  const d = selected?.diesel_eur ?? null;
  const l = selected?.lpg_eur ?? null;

  const fmt = (v: number | null) => formatFuelPrice(country, v, currency, fxRates);

  const shareText = useMemo(() => {
    const F = (v: number | null) => formatFuelPrice(country, v, currency, fxRates);
    const lines = [
      `${t.shareTextTitle}`,
      `${country} — ${data?.as_of ?? ""}`,
      `${t.gasoline95}: ${F(g)}`,
      `${t.diesel}: ${F(d)}`,
      `${t.lpg}: ${F(l)}`,
      `${t.source}: ${data?.source ?? "—"}`,
    ];
    return lines.filter(Boolean).join("\n");
  }, [t, country, data?.as_of, data?.source, g, d, l, currency, fxRates]);

  const regionText = data?.region ? t.region(data.region) : "";

  const kpis = [
    { key: "gasoline95" as const, label: t.gasoline95, value: fmt(g) },
    { key: "diesel" as const, label: t.diesel, value: fmt(d) },
    { key: "lpg" as const, label: t.lpg, value: fmt(l) },
  ];

  return (
    <div className="card fuelHeroCard">
      <div className="fuelHeroTop">
        <div className="fuelHeroHeadline">
          <div className="fuelHeroText">
            <div className="fuelHeroLabel">{t.selectCountry}</div>
            <h2 className="fuelHeroTitle">
              {currentIso2 ? <><img src={getFlagImgUrl(currentIso2)} alt={country} className="countryFlagImg" />{" "}</> : null}{country}
            </h2>
            {regionText ? <div className="fuelHeroSub">{regionText}</div> : null}
          </div>

          <div className="headerActions fuelHeroActions">
            <button className="btn btn-ghost" type="button" onClick={() => onCopy(shareText)}>
              {t.copy}
            </button>
            <button className="btn btn-ghost" type="button" onClick={() => onShare(shareText)}>
              {t.share}
            </button>
          </div>
        </div>
      </div>

      <div className="body fuelHeroBody">
        {loading ? <LoadingRow t={t} /> : null}

        {data ? (
          <>
            <div className="fuelControlGrid">
              <div className="field">
                <div className="label">{t.selectCountry}</div>
                <select className="select" value={country} onChange={(e) => onSelectCountry(e.target.value)}>
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="quickCountryWrap">
              <button
                type="button"
                className="countryChip countryChipActive"
                onClick={() => onSelectCountry(country)}
              >
                {currentIso2 ? <><img src={getFlagImgUrl(currentIso2)} alt={country} className="countryFlagImg" />{" "}</> : null}{country}
              </button>

              {chipCountries.map((c) => {
                const iso2 = getIso2ForCountry(c);
                return (
                  <button
                    key={c}
                    type="button"
                    className="countryChip"
                    onClick={() => onSelectCountry(c)}
                  >
                    {iso2 ? <><img src={getFlagImgUrl(iso2)} alt={c} className="countryFlagImg" />{" "}</> : null}{c}
                  </button>
                );
              })}
            </div>

            <div className="kpiGrid">
              {kpis.map((kpi) => (
                <PriceKpi
                  key={kpi.key}
                  label={kpi.label}
                  value={kpi.value}
                  secondary={currency === "eur" ? t.currencyEUR : t.currencyLocal}
                  weeklyDelta={getWeeklyDeltaEur(trends, country, kpi.key)}
                  sparkline={getTrendSeries(trends, country, kpi.key)}
                  weeklyLabel={t.trendWeekSuffix}
                  onCopy={() => onCopy(`${country} • ${kpi.label}: ${kpi.value}`)}
                  copyLabel={t.copy}
                />
              ))}
            </div>

            <div className="mutedHint">{t.hint}</div>
          </>
        ) : null}
      </div>
    </div>
  );
}
