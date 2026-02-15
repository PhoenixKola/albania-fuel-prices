import { useEffect, useMemo, useState } from "react";
import type { CountryPrices, LatestEurope, Lang } from "./types";
import { i18n, STORAGE_COUNTRY_KEY, STORAGE_LANG_KEY } from "./i18n";
import AdBar from "./AdBar";
import logo from "./assets/logo.png";

const DATA_URL =
  "https://raw.githubusercontent.com/PhoenixKola/albania-fuel-prices/main/data/latest.json";

function fmt(v: number | null) {
  if (v == null) return "—";
  return `${v.toFixed(3)} €/L`;
}

function safeDateTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

export default function App() {
  const [data, setData] = useState<LatestEurope | null>(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [lang, setLang] = useState<Lang>("en");
  const [country, setCountry] = useState<string>("Albania");

  const t = i18n[lang];

  const countries = useMemo(() => (data?.countries ?? []).map((c) => c.country), [data]);

  const selected: CountryPrices | null = useMemo(() => {
    if (!data?.countries?.length) return null;
    return data.countries.find((c) => c.country === country) ?? data.countries[0] ?? null;
  }, [data, country]);

  const load = async () => {
    setErr("");
    setRefreshing(true);
    try {
      const r = await fetch(DATA_URL, { cache: "no-store" });
      if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
      const json: LatestEurope = await r.json();
      setData(json);

      if (json.countries?.length) {
        const exists = json.countries.some((c) => c.country === country);
        if (!exists) setCountry(json.countries[0].country);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setErr(msg);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedLang = localStorage.getItem(STORAGE_LANG_KEY);
    if (savedLang === "en" || savedLang === "sq") setLang(savedLang);

    const savedCountry = localStorage.getItem(STORAGE_COUNTRY_KEY);
    if (savedCountry) setCountry(savedCountry);

    load();
  }, []);

  const toggleLang = () => {
    const next: Lang = lang === "en" ? "sq" : "en";
    setLang(next);
    localStorage.setItem(STORAGE_LANG_KEY, next);
  };

  const onSelectCountry = (next: string) => {
    setCountry(next);
    localStorage.setItem(STORAGE_COUNTRY_KEY, next);
  };

  return (
    <>
      <div className="container">
        <div className="topbar">
          <div className="brand">
            <img className="logoImg" src={logo} alt="" aria-hidden="true" />
            <div className="hgroup">
              <h1 className="h1">{t.title}</h1>
              <p className="sub">{data ? t.subtitleAsOf(data.as_of) : t.subtitleLoading}</p>
            </div>
          </div>

          <div className="actions">
            <button className="pill primary" onClick={load} disabled={refreshing}>
              {refreshing ? t.refreshing : t.refresh}
            </button>
            <button className="pill" onClick={toggleLang}>
              {lang === "en" ? t.langSQ : t.langEN}
            </button>
          </div>
        </div>

        {err ? (
          <div className="notice">
            <p className="noticeTitle">{t.couldntLoad}</p>
            <p className="noticeText">{err}</p>
            <div style={{ marginTop: 10 }}>
              <button className="pill primary" onClick={load}>
                {t.tryAgain}
              </button>
            </div>
          </div>
        ) : null}

        <div className="grid" style={{ marginTop: err ? 14 : 0 }}>
          <div className="card">
            <div className="cardHeader">
              <div className="cardTitle">{t.selectCountry}</div>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, fontWeight: 800 }}>
                {data?.region ? t.region(data.region) : ""}
              </div>
            </div>

            <div className="body">
              {loading ? (
                <div className="loading">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                  <span>{t.subtitleLoading}</span>
                </div>
              ) : null}

              {data ? (
                <>
                  <div className="selectWrap">
                    {/* <div className="label">{t.selectCountry}</div> */}
                    <select className="select" value={country} onChange={(e) => onSelectCountry(e.target.value)}>
                      {countries.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selected ? (
                    <div className="kpis">
                      <div className="kpi">
                        <div className="kpiTop">
                          <div className="kpiName">{t.gasoline95}</div>
                        </div>
                        <div className="kpiValue">{fmt(selected.gasoline95_eur)}</div>
                        <div className="kpiHint">{t.hint}</div>
                      </div>

                      <div className="kpi">
                        <div className="kpiTop">
                          <div className="kpiName">{t.diesel}</div>
                        </div>
                        <div className="kpiValue">{fmt(selected.diesel_eur)}</div>
                        <div className="kpiHint">{t.hint}</div>
                      </div>

                      <div className="kpi">
                        <div className="kpiTop">
                          <div className="kpiName">{t.lpg}</div>
                        </div>
                        <div className="kpiValue">{fmt(selected.lpg_eur)}</div>
                        <div className="kpiHint">{t.hint}</div>
                      </div>
                    </div>
                  ) : null}
                </>
              ) : null}
            </div>
          </div>

          <div className="side">
            <div className="card">
              <div className="cardHeader">
                <div className="cardTitle">{t.source}</div>
                <a className="pill" href={data?.source_url ?? "#"} target="_blank" rel="noreferrer">
                  {t.open}
                </a>
              </div>
              <div className="body">
                <div className="metaRow">
                  <div className="metaKey">{t.source}</div>
                  <div className="metaVal">{data?.source ?? "—"}</div>
                </div>

                <div className="hr" />

                <div className="metaRow">
                  <div className="metaKey">URL</div>
                  <div className="metaVal" style={{ maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis" }}>
                    {data?.source_url ?? "—"}
                  </div>
                </div>

                <div className="hr" />

                <div className="metaRow">
                  <div className="metaKey">{lang === "sq" ? "Përditësuar" : "Updated"}</div>
                  <div className="metaVal">{data?.fetched_at_utc ? safeDateTime(data.fetched_at_utc) : "—"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AdBar adClient="ca-pub-2653462201538649" adSlot="5789581249" />
    </>
  );
}