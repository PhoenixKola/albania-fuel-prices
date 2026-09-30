import type { Lang, TDict } from "../../i18n";
import type { Station } from "../../hooks/useNearbyStations";
import { formatShortDate } from "../../hooks/useHomeMarket";

export type HoursTone = "open" | "closed" | "unknown";

export function stationTitle(st: Station, t: TDict) {
  return st.name || st.brand || t.unnamedStation;
}

/** Brand line only when it adds information beyond the title. */
export function stationSubtitle(st: Station) {
  if (!st.brand || !st.name) return null;
  return st.name.toLocaleLowerCase().includes(st.brand.toLocaleLowerCase()) ? null : st.brand;
}

function decimal(n: number, digits: number, lang: Lang) {
  const s = n.toFixed(digits);
  return lang === "sq" ? s.replace(".", ",") : s;
}

/** Straight-line distance at a precision the measurement can honestly support. */
export function formatDistance(km: number, lang: Lang) {
  if (km < 1) return { value: String(Math.max(10, Math.round((km * 1000) / 10) * 10)), unit: "m" };
  if (km < 10) return { value: decimal(km, 1, lang), unit: "km" };
  return { value: String(Math.round(km)), unit: "km" };
}

export function distanceText(km: number, lang: Lang) {
  const d = formatDistance(km, lang);
  return `${d.value} ${d.unit}`;
}

function clock(ms: number) {
  const d = new Date(ms);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function hoursInfo(st: Station, t: TDict): { tone: HoursTone; label: string; icon: "time-outline" | "infinite-outline" | "close-circle-outline" | "help-circle-outline" } {
  if (st.isOpen24Hours) return { tone: "open", label: t.hoursOpen24, icon: "infinite-outline" };
  if (st.isOpenNow === true) {
    const change = st.hoursChangeAtMs ? ` · ${t.hoursClosesAt(clock(st.hoursChangeAtMs))}` : "";
    return { tone: "open", label: `${t.stationsNearbyOpenNow}${change}`, icon: "time-outline" };
  }
  if (st.isOpenNow === false) {
    const change = st.hoursChangeAtMs ? ` · ${t.hoursOpensAt(clock(st.hoursChangeAtMs))}` : "";
    return { tone: "closed", label: `${t.hoursClosedNow}${change}`, icon: "close-circle-outline" };
  }
  return { tone: "unknown", label: t.stationsNearbyHoursUnknown, icon: "help-circle-outline" };
}

export function stationA11yLabel(st: Station, t: TDict, lang: Lang) {
  const hours = hoursInfo(st, t);
  return [
    stationTitle(st, t),
    stationSubtitle(st),
    distanceText(st.distanceKm, lang),
    hours.tone === "unknown" ? hours.label : `${hours.label}, ${t.byListedHours}`,
  ]
    .filter(Boolean)
    .join(", ");
}

/** Case- and diacritic-insensitive for Albanian (ë, ç) without relying on String.normalize. */
export function searchKey(s: string) {
  return s.toLocaleLowerCase().replace(/[ëèéê]/g, "e").replace(/ç/g, "c");
}

/** Same-day timestamps show only the time; older ones include the date. */
export function formatStamp(iso: string | null, t: TDict) {
  if (!iso) return null;
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return null;
  return d.toDateString() === new Date().toDateString() ? clock(d.getTime()) : formatShortDate(iso, t, true);
}
