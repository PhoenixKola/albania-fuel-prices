import { useMemo, useState } from "react";
import type { LatestEurope, FuelType } from "../../models/fuel";
import type { TDict } from "../../locales";
import type { Trends } from "../../models/trends";
import { getTrendSeries, getWeeklyDeltaEur } from "../../models/trends";
import { FUEL_TYPES } from "../../models/fuel";
import { getEurPrice, fuelLabel } from "../../utils/fuel";
import type { Currency } from "../../models/currency";
import { formatFuelPrice } from "../../utils/priceDisplay";
import type { FxRates } from "../../utils/currency";
import { getIso2ForCountry, getFlagImgUrl } from "../../utils/countryFlag";
import { isEuropeanCountry } from "../../utils/regions";
import Sparkline from "./Sparkline";

type Props = {
  t: TDict;
  data: LatestEurope | null;
  fuelType: FuelType;
  setFuelType: (v: FuelType) => void;
  currency: Currency;
  onOpen: (country: string) => void;
  fxRates: FxRates | null;
  trends: Trends | null;
  currentCountry?: string;
};

function Flag({ country }: { country: string }) {
  const iso2 = getIso2ForCountry(country);
  if (!iso2) return null;
  return (
    <>
      <img src={getFlagImgUrl(iso2)} alt={country} className="countryFlagImg" />{" "}
    </>
  );
}

const COLLAPSED_ROWS = 12;

export default function RankingCard({ t, data, fuelType, setFuelType, currency, fxRates, trends, onOpen, currentCountry }: Props) {
  const [expanded, setExpanded] = useState(false);

  const { europe, global } = useMemo(() => {
    const all =
      data?.countries
        ?.map((c) => ({ country: c.country, eur: getEurPrice(c, fuelType) }))
        .filter((x): x is { country: string; eur: number } => x.eur != null) ?? [];

    const europe = all.filter((x) => isEuropeanCountry(x.country)).sort((a, b) => a.eur - b.eur);
    const global = all.filter((x) => !isEuropeanCountry(x.country)).sort((a, b) => a.eur - b.eur);
    return { europe, global };
  }, [data, fuelType]);

  const average = europe.length ? europe.reduce((sum, x) => sum + x.eur, 0) / europe.length : null;
  const cheapest = europe[0] ?? null;
  const expensive = europe[europe.length - 1] ?? null;

  const fmt = (countryName: string, v: number | null) => formatFuelPrice(countryName, v, currency, fxRates);

  const visible = expanded ? europe : europe.slice(0, COLLAPSED_ROWS);
  const maxEur = expensive?.eur ?? 1;

  const renderRow = (r: { country: string; eur: number }, rank: number) => {
    const isCurrent = r.country === currentCountry;
    const weeklyDelta = getWeeklyDeltaEur(trends, r.country, fuelType);
    const series = getTrendSeries(trends, r.country, fuelType);
    const tone = weeklyDelta == null || Math.abs(weeklyDelta) < 0.0005 ? "flat" : weeklyDelta > 0 ? "up" : "down";
    const barPct = Math.max(4, Math.round((r.eur / maxEur) * 100));

    return (
      <button
        key={r.country}
        className={`rankingTableRow ${isCurrent ? "rankingTableRowCurrent" : ""}`}
        type="button"
        onClick={() => onOpen(r.country)}
      >
        <span className="rankingTableRank">{rank}</span>
        <span className="rankingTableName">
          <Flag country={r.country} />
          {r.country}
          {isCurrent ? <span className="youChip">{t.rankingsYou}</span> : null}
        </span>
        <span className="rankingTableBarTrack" aria-hidden="true">
          <span className="rankingTableBarFill" style={{ width: `${barPct}%` }} />
        </span>
        <span className="rankingTableSpark">{series ? <Sparkline values={series} tone={tone} width={72} height={22} /> : null}</span>
        <span className={`rankingTableDelta delta ${tone === "flat" ? "deltaFlat" : tone === "up" ? "deltaUp" : "deltaDown"}`}>
          {weeklyDelta == null ? "—" : Math.abs(weeklyDelta) < 0.0005 ? "0.000" : `${weeklyDelta > 0 ? "+" : "−"}${Math.abs(weeklyDelta).toFixed(3)}`}
        </span>
        <span className="rankingTablePrice">{fmt(r.country, r.eur)}</span>
      </button>
    );
  };

  return (
    <div className="card rankingCard">
      <div className="rankingTop">
        <div className="rankingTitle">{t.rankings}</div>
        <div className="rankingSub">{t.rankingsTableNote}</div>

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
              {cheapest ? <><Flag country={cheapest.country} />{cheapest.country}</> : "—"}
            </span>
          </div>

          <div className="rankingSummaryItem">
            <span className="rankingSummaryLabel">{t.rankingsEuropeAverage}</span>
            <span className="rankingSummaryValue">{average != null ? `${average.toFixed(3)} EUR/L` : "—"}</span>
          </div>

          <div className="rankingSummaryItem">
            <span className="rankingSummaryLabel">{t.mostExpensive}</span>
            <span className="rankingSummaryValue">
              {expensive ? <><Flag country={expensive.country} />{expensive.country}</> : "—"}
            </span>
          </div>
        </div>
      </div>

      <div className="body rankingBody">
        <div className="rankingTableHeader" aria-hidden="true">
          <span className="rankingTableRank">#</span>
          <span className="rankingTableName">{t.rankingsCountryCol}</span>
          <span className="rankingTableBarTrack" />
          <span className="rankingTableSpark">{t.rankingsTrendCol}</span>
          <span className="rankingTableDelta">{t.rankingsWeekCol}</span>
          <span className="rankingTablePrice">{t.rankingsPriceCol}</span>
        </div>

        <div className="rankingTable">
          {visible.map((r, i) => renderRow(r, i + 1))}
        </div>

        {europe.length > COLLAPSED_ROWS ? (
          <button className="btn btn-ghost rankingExpandBtn" type="button" onClick={() => setExpanded((p) => !p)}>
            {expanded ? t.rankingsShowLess : t.rankingsShowAll(europe.length)}
          </button>
        ) : null}

        {global.length ? (
          <>
            <div className="rankingGlobalHeading">
              <span>{t.rankingsGlobalTitle}</span>
              <span className="rankingGlobalNote">{t.rankingsGlobalNote}</span>
            </div>
            <div className="rankingGlobalWrap">
              {global.map((r) => (
                <button key={r.country} type="button" className="countryChip rankingGlobalChip" onClick={() => onOpen(r.country)}>
                  <Flag country={r.country} />
                  {r.country}
                  <span className="rankingGlobalPrice">{fmt(r.country, r.eur)}</span>
                </button>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
