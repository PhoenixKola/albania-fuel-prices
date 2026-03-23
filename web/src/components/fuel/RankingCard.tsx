import type { LatestEurope, FuelType } from "../../models/fuel";
import type { TDict } from "../../locales";
import { FUEL_TYPES } from "../../models/fuel";
import { getEurPrice, fuelLabel } from "../../utils/fuel";
import type { Currency } from "../../models/currency";
import { formatFuelPrice } from "../../utils/priceDisplay";
import type { FxRates } from "../../utils/currency";
import { getIso2ForCountry, getFlagImgUrl } from "../../utils/countryFlag";

type Props = {
  t: TDict;
  data: LatestEurope | null;
  fuelType: FuelType;
  setFuelType: (v: FuelType) => void;
  currency: Currency;
  onOpen: (country: string) => void;
  fxRates: FxRates | null;
};

export default function RankingCard({ t, data, fuelType, setFuelType, currency, fxRates, onOpen }: Props) {
  const list =
    data?.countries
      ?.map((c) => ({ country: c.country, eur: getEurPrice(c, fuelType) }))
      .filter((x) => x.eur != null) ?? [];

  const asc = [...list].sort((a, b) => (a.eur ?? 0) - (b.eur ?? 0));
  const cheapest = asc.slice(0, 5);
  const expensive = asc.slice(-5).reverse();

  const fmt = (countryName: string, v: number | null) => formatFuelPrice(countryName, v, currency, fxRates);

  return (
    <div className="card rankingCard">
      <div className="rankingTop">
        <div className="rankingTitle">{t.rankings}</div>
        <div className="rankingSub">{t.fuelType}</div>

        <p className="tinyNote" style={{ marginTop: 10, lineHeight: 1.7 }}>
          These rankings help compare broader price levels across countries. They are useful for spotting relative fuel
          cost differences, but they should still be treated as public market guidance rather than an exact price for
          every local station.
        </p>

        <div className="segRow rankingSegRow">
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

        <div className="rankingSummaryRow">
          <div className="rankingSummaryItem">
            <span className="rankingSummaryLabel">{t.cheapest}</span>
            <span className="rankingSummaryValue">
              {(() => {
                const iso2 = cheapest[0] ? getIso2ForCountry(cheapest[0].country) : null;
                return iso2 ? (
                  <>
                    <img src={getFlagImgUrl(iso2)} alt={cheapest[0]!.country} className="countryFlagImg" />{" "}
                  </>
                ) : null;
              })()}
              {cheapest[0]?.country ?? "—"}
            </span>
          </div>

          <div className="rankingSummaryItem">
            <span className="rankingSummaryLabel">{t.mostExpensive}</span>
            <span className="rankingSummaryValue">
              {(() => {
                const iso2 = expensive[0] ? getIso2ForCountry(expensive[0].country) : null;
                return iso2 ? (
                  <>
                    <img src={getFlagImgUrl(iso2)} alt={expensive[0]!.country} className="countryFlagImg" />{" "}
                  </>
                ) : null;
              })()}
              {expensive[0]?.country ?? "—"}
            </span>
          </div>
        </div>
      </div>

      <div className="body rankingBody">
        <div className="rankingStack">
          <div className="rankingPanel">
            <div className="rankingPanelHeader">
              <div className="rankingPanelTitle">{t.cheapest}</div>
              <div className="rankingPanelCount">{cheapest.length}</div>
            </div>

            <div className="rankingList">
              {cheapest.map((r, index) => (
                <button
                  key={r.country}
                  className="rankingRow rankingRowCheap"
                  type="button"
                  onClick={() => onOpen(r.country)}
                >
                  <div className="rankingRowLeft">
                    <div className="rankingBadge">{index + 1}</div>

                    <div className="rankingRowText">
                      <div className="rankingName">
                        {(() => {
                          const iso2 = getIso2ForCountry(r.country);
                          return iso2 ? (
                            <>
                              <img src={getFlagImgUrl(iso2)} alt={r.country} className="countryFlagImg" />{" "}
                            </>
                          ) : null;
                        })()}
                        {r.country}
                      </div>
                      <div className="rankingMeta">{fuelLabel(t, fuelType)}</div>
                    </div>
                  </div>

                  <div className="rankingRowRight">
                    <div className="rankingPricePill">{fmt(r.country, r.eur)}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rankingPanel">
            <div className="rankingPanelHeader">
              <div className="rankingPanelTitle">{t.mostExpensive}</div>
              <div className="rankingPanelCount">{expensive.length}</div>
            </div>

            <div className="rankingList">
              {expensive.map((r, index) => (
                <button
                  key={r.country}
                  className="rankingRow rankingRowExpensive"
                  type="button"
                  onClick={() => onOpen(r.country)}
                >
                  <div className="rankingRowLeft">
                    <div className="rankingBadge">{index + 1}</div>

                    <div className="rankingRowText">
                      <div className="rankingName">
                        {(() => {
                          const iso2 = getIso2ForCountry(r.country);
                          return iso2 ? (
                            <>
                              <img src={getFlagImgUrl(iso2)} alt={r.country} className="countryFlagImg" />{" "}
                            </>
                          ) : null;
                        })()}
                        {r.country}
                      </div>
                      <div className="rankingMeta">{fuelLabel(t, fuelType)}</div>
                    </div>
                  </div>

                  <div className="rankingRowRight">
                    <div className="rankingPricePill">{fmt(r.country, r.eur)}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}