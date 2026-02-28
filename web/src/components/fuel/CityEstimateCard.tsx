import type { TDict } from "../../locales";
import type { CountryPrices } from "../../models/fuel";
import { clamp  } from "../../utils/format";
import type { Currency } from "../../models/currency";
import { formatFuelPrice } from "../../utils/priceDisplay";
import type { FxRates } from "../../utils/currency";

const CITIES: { name: string; pct: number }[] = [
  { name: "Tirana", pct: 1.2 },
  { name: "Durrës", pct: 0.6 },
  { name: "Shkodër", pct: -0.4 },
  { name: "Vlorë", pct: 0.8 },
  { name: "Elbasan", pct: 0.2 },
  { name: "Fier", pct: 0.1 },
  { name: "Korçë", pct: 0.3 },
  { name: "Berat", pct: 0.0 },
];

type Props = {
  t: TDict;
  base: CountryPrices | null;
  city: string;
  setCity: (v: string) => void;
  bias: number;
  setBias: (v: number) => void;
  currency: Currency;
  fxRates: FxRates | null;
};

export default function CityEstimateCard({
  t,
  base,
  city,
  setCity,
  bias,
  setBias,
  currency,
  fxRates,
}: Props) {
  if (!base) return null;

  const cityPct = CITIES.find((c) => c.name === city)?.pct ?? 0;
  const totalPct = (cityPct + bias) / 100;

  const adj = (v: number | null) => (v == null ? null : v * (1 + totalPct));

  const g = adj(base.gasoline95_eur);
  const d = adj(base.diesel_eur);
  const l = adj(base.lpg_eur);

  const fmt = (v: number | null) => formatFuelPrice("Albania", v, currency, fxRates);

  return (
    <div className="card">
      <div className="cardHeader">
        <div className="cardHeaderRow">
          <div>
            <div className="cardTitle">{t.localEstimate}</div>
            <div className="cardSubtle">{t.estimateNote}</div>
          </div>
          <span className="badge">{t.estimated}</span>
        </div>
      </div>

      <div className="body">
        <div className="tripGrid">
          <div className="field">
            <div className="label">{t.pickCity}</div>
            <select className="select" value={city} onChange={(e) => setCity(e.target.value)}>
              {CITIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} ({c.pct > 0 ? "+" : ""}
                  {c.pct}%)
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <div className="label">{t.cityBias} (% -5 to +5)</div>
            <input
              className="input"
              inputMode="decimal"
              value={String(bias)}
              onChange={(e) => setBias(clamp(Number(e.target.value || 0), -5, 5))}
            />
          </div>
        </div>

        <div className="kpiGrid">
          <div className="kpiCard">
            <div className="kpiLabel">{t.gasoline95}</div>
            <div className="kpiValue">{fmt(g)}</div>
          </div>
          <div className="kpiCard">
            <div className="kpiLabel">{t.diesel}</div>
            <div className="kpiValue">{fmt(d)}</div>
          </div>
          <div className="kpiCard">
            <div className="kpiLabel">{t.lpg}</div>
            <div className="kpiValue">{fmt(l)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}