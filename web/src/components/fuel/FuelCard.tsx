import { useMemo, useState } from "react";
import type { CountryPrices, LatestEurope } from "../../models/fuel";
import type { TDict } from "../../locales";
import type { Currency } from "../../models/currency";
import type { FxRates } from "../../utils/currency";
import { formatFuelPrice } from "../../utils/priceDisplay";
import LoadingRow from "../feedback/LeadingRow";
import PriceKpi from "./PriceKpi";
import { usePriceMemory } from "../../hooks/usePriceMemory";

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

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return countries;
    return countries.filter((c) => c.toLowerCase().includes(s));
  }, [q, countries]);

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

  return (
    <div className="card">
      <div className="cardHeader cardHeaderRow">
        <div>
          <div className="cardTitle">{t.selectCountry}</div>
          <div className="cardSubtle">{data?.region ? t.region(data.region) : ""}</div>
        </div>

        <div className="headerActions">
          <button className="btn btn-ghost" type="button" onClick={() => onCopy(shareText)}>
            {t.copy}
          </button>
          <button className="btn btn-ghost" type="button" onClick={() => onShare(shareText)}>
            {t.share}
          </button>
        </div>
      </div>

      <div className="body">
        {loading ? <LoadingRow t={t} /> : null}

        {data ? (
          <>
            <div className="field">
              <div className="label">{t.selectCountry}</div>
              <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" />
              <select className="select" value={country} onChange={(e) => onSelectCountry(e.target.value)}>
                {filtered.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
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