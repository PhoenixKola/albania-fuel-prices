import { useMemo, useState } from "react";
import type { CountryPrices, LatestEurope } from "../../models/fuel";
import type { TDict } from "../../locales";
import type { Currency } from "../../models/currency";
import type { FxRates } from "../../utils/currency";
import { formatFuelPrice } from "../../utils/priceDisplay";
import LoadingRow from "../feedback/LeadingRow";
import PriceKpi from "./PriceKpi";
import { usePriceMemory } from "../../hooks/usePriceMemory";
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
  onCopy: (text: string) => void;
  onShare: (text: string) => void;
};

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
  onCopy,
  onShare,
}: Props) {
  const [q, setQ] = useState("");
  const deltas = usePriceMemory(country, selected);

  const currentIso2 = useMemo(() => getIso2ForCountry(country), [country]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return countries;
    return countries.filter((c) => c.toLowerCase().includes(s));
  }, [q, countries]);

  const selectOptions = useMemo(() => {
    const set = new Set(filtered);
    if (country && !set.has(country) && countries.includes(country)) {
      return [country, ...filtered];
    }
    return filtered;
  }, [filtered, country, countries]);

  const [shuffleSeed] = useState(() => Math.random());
  const quickCountries = useMemo(() => {
    const a = [...countries];
    let s = shuffleSeed;
    for (let i = a.length - 1; i > 0; i--) {
      s = (s * 9301 + 49297) % 233280;
      const j = Math.floor((s / 233280) * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a.slice(0, 6);
  }, [countries, shuffleSeed]);

  const chipCountries = useMemo(() => {
    if (q.trim()) {
      return filtered.filter((c) => c !== country).slice(0, 7);
    }
    return quickCountries.filter((c) => c !== country);
  }, [q, filtered, quickCountries, country]);

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

  const resultCount = q.trim() ? filtered.length : countries.length;
  const regionText = data?.region ? t.region(data.region) : "";

  void setQ;
  void resultCount;

  return (
    <div className="card fuelHeroCard">
      <div className="fuelHeroTop">
        {/* <div className="fuelHeroEyebrow">
          <span className="livePill">{data?.source ?? t.source}</span>
          {data?.as_of ? <span className="ghostPill">{data.as_of}</span> : null}
        </div> */}

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
              {/* <div className="field">
                <div className="label">{t.selectCountry}</div>
                <div className="searchShell">
                  <input
                    className="input inputSearch"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder={t.selectCountry}
                    autoComplete="off"
                  />
                  <span className="searchCount">{resultCount}</span>
                </div>
              </div> */}

              <div className="field">
                <div className="label">{t.selectCountry}</div>
                <select className="select" value={country} onChange={(e) => onSelectCountry(e.target.value)}>
                  {selectOptions.map((c) => (
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

              {chipCountries.map((c) => (
                <button
                  key={c}
                  type="button"
                  className="countryChip"
                  onClick={() => onSelectCountry(c)}
                >
                  {(() => { const iso2 = getIso2ForCountry(c); return iso2 ? <><img src={getFlagImgUrl(iso2)} alt={c} className="countryFlagImg" />{" "}</> : null; })()}{c}
                </button>
              ))}
            </div>

            <div className="kpiGrid">
              <PriceKpi
                label={t.gasoline95}
                value={fmt(g)}
                secondary={currency === "eur" ? t.currencyEUR : t.currencyLocal}
                delta={deltas.gasoline95 == null ? null : Number(deltas.gasoline95.toFixed(3))}
                currency={currency}
                onCopy={() => onCopy(`${country} • ${t.gasoline95}: ${fmt(g)}`)}
                copyLabel={t.copy}
              />
              <PriceKpi
                label={t.diesel}
                value={fmt(d)}
                secondary={currency === "eur" ? t.currencyEUR : t.currencyLocal}
                delta={deltas.diesel == null ? null : Number(deltas.diesel.toFixed(3))}
                currency={currency}
                onCopy={() => onCopy(`${country} • ${t.diesel}: ${fmt(d)}`)}
                copyLabel={t.copy}
              />
              <PriceKpi
                label={t.lpg}
                value={fmt(l)}
                secondary={currency === "eur" ? t.currencyEUR : t.currencyLocal}
                delta={deltas.lpg == null ? null : Number(deltas.lpg.toFixed(3))}
                currency={currency}
                onCopy={() => onCopy(`${country} • ${t.lpg}: ${fmt(l)}`)}
                copyLabel={t.copy}
              />
            </div>

            <div className="mutedHint">{t.hint}</div>
          </>
        ) : null}
      </div>
    </div>
  );
}