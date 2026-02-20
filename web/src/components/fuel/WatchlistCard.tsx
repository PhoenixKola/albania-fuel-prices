import type { LatestEurope, FuelType } from "../../models/fuel";
import type { TDict } from "../../locales";
import Chip from "../ui/Chip";
import { getEurPrice, fuelLabel } from "../../utils/fuel";
import { formatEurPerLiter, formatAllPerLiter } from "../../utils/format";
import type { Currency } from "../../models/currency";

type Props = {
  t: TDict;
  data: LatestEurope | null;
  watchlist: string[];
  has: Set<string>;
  current: string;
  onAdd: (country: string) => void;
  onRemove: (country: string) => void;
  onOpen: (country: string) => void;
  fuelType: FuelType;
  currency: Currency;
  allPerEur: number;
};

export default function WatchlistCard({
  t,
  data,
  watchlist,
  has,
  current,
  onAdd,
  onRemove,
  onOpen,
  fuelType,
  currency,
  allPerEur,
}: Props) {
  const rows =
    data?.countries
      ?.filter((c) => watchlist.includes(c.country))
      .map((c) => {
        const eur = getEurPrice(c, fuelType);
        return { country: c.country, eur };
      }) ?? [];

  rows.sort((a, b) => (a.eur ?? Infinity) - (b.eur ?? Infinity));

  return (
    <div className="card">
      <div className="cardHeader cardHeaderRow">
        <div>
          <div className="cardTitle">{t.watchlist}</div>
          <div className="cardSubtle">{fuelLabel(t, fuelType)}</div>
        </div>
        <button className="btn btn-primary" type="button" onClick={() => onAdd(current)} disabled={has.has(current)}>
          {t.addToWatchlist}
        </button>
      </div>

      <div className="body">
        <div className="chipRow">
          {watchlist.length === 0 ? <div className="mutedBox">{t.emptyWatchlist}</div> : null}
          {watchlist.map((c) => (
            <Chip key={c} label={c} active={c === current} onClick={() => onOpen(c)} onRemove={() => onRemove(c)} />
          ))}
        </div>

        {watchlist.length ? (
          <div className="tableWrap">
            <div className="tableTitle">{t.compare}</div>
            <div className="table">
              {rows.map((r) => (
                <div key={r.country} className="tRow">
                  <div className="tLeft">{r.country}</div>
                  <div className="tMid">
                    {currency === "EUR" ? formatEurPerLiter(r.eur) : formatAllPerLiter(r.eur, allPerEur)}
                  </div>
                  <div className="tRight">
                    <button className="btn btn-ghost" type="button" onClick={() => onOpen(r.country)}>
                      {t.openCountry}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}