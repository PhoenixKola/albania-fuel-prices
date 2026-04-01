import type { Currency } from "../../models/currency";
import type { TDict } from "../../locales";

type Props = {
  t: TDict;
  country: string;
  currency: Currency;
  setCurrency: (c: Currency) => void;
};

export default function CurrencyModeCard({ t, country, currency, setCurrency }: Props) {
  return (
    <div className="card pageIntroCard">
      <div className="body pageIntroBody">
        <div className="pageIntroContent">
          <div className="pageIntroText">
            <div className="cardTitle">{t.currencyMode}</div>
            <div className="cardSubtle">{country}</div>
          </div>

          <div className="segRow pageIntroSeg">
            <button
              type="button"
              className={`seg ${currency === "eur" ? "segActive" : ""}`}
              onClick={() => setCurrency("eur")}
            >
              {t.currencyEUR}
            </button>
            <button
              type="button"
              className={`seg ${currency === "local" ? "segActive" : ""}`}
              onClick={() => setCurrency("local")}
            >
              {t.currencyLocal}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
