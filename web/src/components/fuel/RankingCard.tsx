import type { LatestEurope, FuelType } from "../../models/fuel";
import type { TDict } from "../../locales";
import { FUEL_TYPES } from "../../models/fuel";
import { getEurPrice, fuelLabel } from "../../utils/fuel";
import { formatEurPerLiter, formatAllPerLiter } from "../../utils/format";
import type { Currency } from "../../models/currency";

type Props = {
  t: TDict;
  data: LatestEurope | null;
  fuelType: FuelType;
  setFuelType: (v: FuelType) => void;
  currency: Currency;
  allPerEur: number;
  onOpen: (country: string) => void;
};

export default function RankingCard({ t, data, fuelType, setFuelType, currency, allPerEur, onOpen }: Props) {
  const list =
    data?.countries
      ?.map((c) => ({ country: c.country, eur: getEurPrice(c, fuelType) }))
      .filter((x) => x.eur != null) ?? [];

  const asc = [...list].sort((a, b) => (a.eur ?? 0) - (b.eur ?? 0));
  const cheapest = asc.slice(0, 5);
  const expensive = asc.slice(-5).reverse();

  const fmt = (v: number | null) => (currency === "EUR" ? formatEurPerLiter(v) : formatAllPerLiter(v, allPerEur));

  return (
    <div className="card">
      <div className="cardHeader">
        <div className="cardHeaderRow">
          <div>
            <div className="cardTitle">{t.rankings}</div>
            <div className="cardSubtle">{t.fuelType}</div>
          </div>
          <div className="segRow">
            {FUEL_TYPES.map((ft) => (
              <button
                key={ft}
                type="button"
                className={`seg ${ft === fuelType ? "segActive" : ""}`}
                onClick={() => setFuelType(ft)}
              >
                {fuelLabel(t, ft)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="body">
        <div className="rankGrid">
          <div className="rankCol">
            <div className="rankTitle">{t.cheapest}</div>
            {cheapest.map((r) => (
              <button key={r.country} className="rankRow" type="button" onClick={() => onOpen(r.country)}>
                <span className="rankName">{r.country}</span>
                <span className="rankVal">{fmt(r.eur)}</span>
              </button>
            ))}
          </div>

          <div className="rankCol">
            <div className="rankTitle">{t.mostExpensive}</div>
            {expensive.map((r) => (
              <button key={r.country} className="rankRow" type="button" onClick={() => onOpen(r.country)}>
                <span className="rankName">{r.country}</span>
                <span className="rankVal">{fmt(r.eur)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}