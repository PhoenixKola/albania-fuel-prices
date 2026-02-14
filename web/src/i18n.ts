import type { Lang } from "./types";

export const STORAGE_LANG_KEY = "lang";
export const STORAGE_COUNTRY_KEY = "country";

export const i18n = {
  en: {
    title: "Europe Fuel Prices",
    subtitleAsOf: (d: string) => `As of ${d}`,
    subtitleLoading: "Loading latest data…",
    region: (r: string) => `Region: ${r}`,
    selectCountry: "Select a country",
    gasoline95: "Gasoline 95",
    diesel: "Diesel",
    lpg: "LPG",
    updated: (s: string) => `Fetched at: ${s}`,
    source: "Source",
    open: "Open",
    refresh: "Refresh",
    refreshing: "Refreshing…",
    couldntLoad: "Couldn’t load data",
    tryAgain: "Try again",
    hint: "National averages (EUR/L). Values come from the source site and update automatically.",
    langEN: "EN",
    langSQ: "AL",
  },
  sq: {
    title: "Çmimet e Karburanteve në Europë",
    subtitleAsOf: (d: string) => `Data: ${d}`,
    subtitleLoading: "Po ngarkohen të dhënat…",
    region: (r: string) => `Rajoni: ${r}`,
    selectCountry: "Zgjidh një shtet",
    gasoline95: "Benzinë 95",
    diesel: "Naftë",
    lpg: "LPG",
    updated: (s: string) => `Marrë më: ${s}`,
    source: "Burimi",
    open: "Hap",
    refresh: "Rifresko",
    refreshing: "Po rifreskohet…",
    couldntLoad: "S’u arrit të ngarkohen të dhënat",
    tryAgain: "Provo përsëri",
    hint: "Mesatare kombëtare (EUR/L). Vlerat vijnë nga burimi dhe përditësohen automatikisht.",
    langEN: "EN",
    langSQ: "AL",
  },
} as const satisfies Record<Lang, any>;