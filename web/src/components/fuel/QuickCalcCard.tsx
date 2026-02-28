import { useMemo, useState } from "react";
import type { Currency } from "../../models/currency";
import type { FuelType } from "../../models/fuel";
import type { TDict } from "../../locales";
import { clamp, formatMoneyALL, formatMoneyEUR } from "../../utils/format";
import { fuelLabel } from "../../utils/fuel";

type Props = {
  t: TDict;
  fuelType: FuelType;
  setFuelType: (v: FuelType) => void;
  currency: Currency;
  setCurrency: (v: Currency) => void;
  allPerEur: number;
  setAllPerEur: (v: number) => void;
  priceEur: number | null;
};

export default function QuickCalcCard({
  t,
  fuelType,
  setFuelType,
  currency,
  setCurrency,
  allPerEur,
  setAllPerEur,
  priceEur,
}: Props) {
  const [tab, setTab] = useState<"fill" | "budget" | "trip">("fill");
  const [liters, setLiters] = useState(4);
  const [budget, setBudget] = useState(20);
  const [km, setKm] = useState(50);
  const [cons, setCons] = useState(7);

  const costEur = useMemo(() => (priceEur == null ? null : priceEur * liters), [priceEur, liters]);
  const costAll = useMemo(() => (costEur == null ? null : costEur * allPerEur), [costEur, allPerEur]);

  const litersFromBudget = useMemo(() => {
    if (priceEur == null || priceEur <= 0) return null;
    const bEur = currency === "eur" ? budget : budget / allPerEur;
    return bEur / priceEur;
  }, [priceEur, budget, currency, allPerEur]);

  const litersNeeded = useMemo(() => (km * cons) / 100, [km, cons]);
  const tripCostEur = useMemo(() => (priceEur == null ? null : litersNeeded * priceEur), [priceEur, litersNeeded]);
  const tripCostAll = useMemo(() => (tripCostEur == null ? null : tripCostEur * allPerEur), [tripCostEur, allPerEur]);

  const fuelTabs: FuelType[] = ["gasoline95", "diesel", "lpg"];

  return (
    <div className="card">
      <div className="cardHeader cardHeaderRow">
        <div>
          <div className="cardTitle">{t.tools}</div>
          <div className="cardSubtle">{fuelLabel(t, fuelType)}</div>
        </div>
        <div className="segRow">
          {fuelTabs.map((ft) => (
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

      <div className="body">
        <div className="toolbarRow">
          <div className="segRow">
            <button type="button" className={`seg ${tab === "fill" ? "segActive" : ""}`} onClick={() => setTab("fill")}>
              {t.tabFill}
            </button>
            <button type="button" className={`seg ${tab === "budget" ? "segActive" : ""}`} onClick={() => setTab("budget")}>
              {t.tabBudget}
            </button>
            <button type="button" className={`seg ${tab === "trip" ? "segActive" : ""}`} onClick={() => setTab("trip")}>
              {t.tabTrip}
            </button>
          </div>

          <div className="segRow">
            <button
              type="button"
              className={`seg ${currency === "eur" ? "segActive" : ""}`}
              onClick={() => setCurrency("eur")}
            >
              EUR
            </button>
            <button
              type="button"
              className={`seg ${currency === "local" ? "segActive" : ""}`}
              onClick={() => setCurrency("local")}
            >
              ALL
            </button>
          </div>
        </div>

        <div className="rateRow">
          <div className="rateLabel">{t.exchangeRate}</div>
          <input
            className="input"
            inputMode="numeric"
            value={String(allPerEur)}
            onChange={(e) => setAllPerEur(clamp(Number(e.target.value || 0), 1, 9999))}
          />
        </div>

        {priceEur == null ? <div className="mutedBox">—</div> : null}

        {tab === "fill" ? (
          <>
            <div className="fieldRow">
              <div className="field">
                <div className="label">{t.liters}</div>
                <input
                  className="input"
                  inputMode="decimal"
                  value={String(liters)}
                  onChange={(e) => setLiters(clamp(Number(e.target.value || 0), 0, 999))}
                />
              </div>

              <div className="quickBtns">
                {[4, 10, 20, 40].map((x) => (
                  <button key={x} type="button" className="btn btn-ghost" onClick={() => setLiters(x)}>
                    {x}L
                  </button>
                ))}
              </div>
            </div>

            <div className="resultRow">
              <div className="resultLabel">{t.cost}</div>
              <div className="resultValue">
                {currency === "eur" ? formatMoneyEUR(costEur) : formatMoneyALL(costAll)}
              </div>
            </div>
          </>
        ) : null}

        {tab === "budget" ? (
          <>
            <div className="fieldRow">
              <div className="field">
                <div className="label">{t.budget}</div>
                <input
                  className="input"
                  inputMode="decimal"
                  value={String(budget)}
                  onChange={(e) => setBudget(clamp(Number(e.target.value || 0), 0, 999999))}
                />
              </div>
            </div>

            <div className="resultRow">
              <div className="resultLabel">{t.youGet}</div>
              <div className="resultValue">{litersFromBudget == null ? "—" : `${litersFromBudget.toFixed(2)} L`}</div>
            </div>
          </>
        ) : null}

        {tab === "trip" ? (
          <>
            <div className="tripGrid">
              <div className="field">
                <div className="label">{t.distanceKm}</div>
                <input
                  className="input"
                  inputMode="decimal"
                  value={String(km)}
                  onChange={(e) => setKm(clamp(Number(e.target.value || 0), 0, 999999))}
                />
              </div>
              <div className="field">
                <div className="label">{t.consumption}</div>
                <input
                  className="input"
                  inputMode="decimal"
                  value={String(cons)}
                  onChange={(e) => setCons(clamp(Number(e.target.value || 0), 0, 99))}
                />
              </div>
            </div>

            <div className="resultRow" style={{ marginTop: '12px' }}>
              <div className="resultLabel">{t.litersNeeded}</div>
              <div className="resultValue">{`${litersNeeded.toFixed(2)} L`}</div>
            </div>

            <div className="resultRow" style={{ marginTop: '12px' }}>
              <div className="resultLabel">{t.cost}</div>
              <div className="resultValue">
                {currency === "eur" ? formatMoneyEUR(tripCostEur) : formatMoneyALL(tripCostAll)}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}