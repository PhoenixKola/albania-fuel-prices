import type { LatestEurope, FuelType } from "../../models/fuel";
import type { TDict } from "../../locales";
import Chip from "../ui/Chip";
import { getEurPrice, fuelLabel } from "../../utils/fuel";
import type { Currency } from "../../models/currency";
import { formatFuelPrice } from "../../utils/priceDisplay";
import type { FxRates } from "../../utils/currency";

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
  fxRates: FxRates | null;
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
  fxRates,
}: Props) {
  const rows =
    data?.countries
      ?.filter((c) => watchlist.includes(c.country))
      .map((c) => {
        const eur = getEurPrice(c, fuelType);
        return { country: c.country, eur };
      }) ?? [];

  rows.sort((a, b) => (a.eur ?? Infinity) - (b.eur ?? Infinity));

  const isCurrentSaved = has.has(current);

  return (
    <div className="card watchlistCard">
      <div className="watchlistTop">
        <div className="watchlistTopRow">
          <div className="watchlistTopText">
            <div className="watchlistEyebrow">
              <span className="livePill">{t.watchlist}</span>
              <span className="ghostPill">{fuelLabel(t, fuelType)}</span>
            </div>

            <div className="watchlistTitleWrap">
              <div className="watchlistTitle">{t.watchlist}</div>
              <div className="watchlistSub">{current}</div>
            </div>
          </div>

          <div className="watchlistTopAction">
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => onAdd(current)}
              disabled={isCurrentSaved}
            >
              {t.addToWatchlist}
            </button>
          </div>
        </div>

        <div className="watchlistStats">
          <div className="watchlistStat">
            <div className="watchlistStatLabel">{t.watchlist}</div>
            <div className="watchlistStatValue">{watchlist.length}</div>
          </div>

          <div className="watchlistStat">
            <div className="watchlistStatLabel">{t.compare}</div>
            <div className="watchlistStatValue">{rows.length}</div>
          </div>

          <div className="watchlistStat">
            <div className="watchlistStatLabel">{fuelLabel(t, fuelType)}</div>
            <div className="watchlistStatValue watchlistStatValueText">{current}</div>
          </div>
        </div>
      </div>

      <div className="body watchlistBody">
        <div className="watchlistChipSection">
          {watchlist.length === 0 ? (
            <div className="mutedBox">{t.emptyWatchlist}</div>
          ) : (
            <div className="chipRow watchlistChipRow">
              {watchlist.map((c) => (
                <Chip key={c} label={c} active={c === current} onClick={() => onOpen(c)} onRemove={() => onRemove(c)} />
              ))}
            </div>
          )}
        </div>

        {watchlist.length ? (
          <div className="tableWrap watchlistTableWrap">
            <div className="tableTitle">{t.compare}</div>

            <div className="table watchlistTable">
              {rows.map((r, index) => (
                <button
                  key={r.country}
                  className="watchlistRow"
                  type="button"
                  onClick={() => onOpen(r.country)}
                >
                  <div className="watchlistRowLeft">
                    <div className="watchlistRank">{index + 1}</div>

                    <div className="watchlistRowText">
                      <div className="watchlistRowName">{r.country}</div>
                      <div className="watchlistRowMeta">
                        {r.country === current ? (
                          <span className="watchlistCurrentPill">{current}</span>
                        ) : (
                          <span className="watchlistMutedMeta">{fuelLabel(t, fuelType)}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="watchlistRowRight">
                    <div className="watchlistPricePill">
                      {formatFuelPrice(r.country, r.eur, currency, fxRates)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}