import React, { useEffect, useMemo, useState } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Pressable,
  Linking,
  Platform,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import mobileAds, { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads";

type CountryPrices = {
  country: string;
  gasoline95_eur: number | null;
  diesel_eur: number | null;
  lpg_eur: number | null;
};

type LatestEurope = {
  region: string;
  as_of: string;
  source: string;
  source_url: string;
  fetched_at_utc: string;
  unit: string;
  countries: CountryPrices[];
};

type Lang = "en" | "sq";

const STORAGE_LANG_KEY = "lang";
const STORAGE_COUNTRY_KEY = "country";

const i18n = {
  en: {
    title: "Europe Fuel Prices",
    subtitleAsOf: (d: string) => `As of ${d}`,
    subtitleLoading: "Loading latest data…",
    fetching: "Fetching latest data…",
    couldntLoad: "Couldn’t load data",
    tryAgain: "Try again",
    refresh: "Refresh",
    refreshing: "Refreshing…",
    selectCountry: "Select a country",
    gasoline95: "Gasoline 95",
    diesel: "Diesel",
    lpg: "LPG",
    source: "Source",
    open: "Open",
    fetchedAt: (s: string) => `Fetched at: ${s}`,
    langEN: "EN",
    langSQ: "AL",
  },
  sq: {
    title: "Çmimet e Karburanteve në Europë",
    subtitleAsOf: (d: string) => `Data: ${d}`,
    subtitleLoading: "Po ngarkohen të dhënat…",
    fetching: "Po shkarkohen të dhënat…",
    couldntLoad: "S’u arrit të ngarkohen të dhënat",
    tryAgain: "Provo përsëri",
    refresh: "Rifresko",
    refreshing: "Po rifreskohet…",
    selectCountry: "Zgjidh një shtet",
    gasoline95: "Benzinë 95",
    diesel: "Naftë",
    lpg: "LPG",
    source: "Burimi",
    open: "Hap",
    fetchedAt: (s: string) => `Marrë më: ${s}`,
    langEN: "EN",
    langSQ: "AL",
  },
} as const;

function formatPrice(v: number | null) {
  if (v == null) return "—";
  return `${v.toFixed(3)} €/L`;
}

export default function App() {
  const insets = useSafeAreaInsets();

  const [data, setData] = useState<LatestEurope | null>(null);
  const [err, setErr] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [lang, setLang] = useState<Lang>("en");
  const [country, setCountry] = useState("Albania");

  const t = i18n[lang];

  const url =
    "https://raw.githubusercontent.com/PhoenixKola/albania-fuel-prices/main/data/latest.json";

  const selected = useMemo(() => {
    if (!data) return null;
    return data.countries.find((c) => c.country === country) ?? data.countries[0] ?? null;
  }, [data, country]);

  const countries = useMemo(() => (data?.countries ?? []).map((c) => c.country), [data]);

  const load = async () => {
    setErr("");
    setRefreshing(true);
    try {
      const r = await fetch(url, { cache: "no-store" as any });
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
    }
  };

  useEffect(() => {
    mobileAds().initialize();

    (async () => {
      const savedLang = (await AsyncStorage.getItem(STORAGE_LANG_KEY)) as Lang | null;
      if (savedLang === "en" || savedLang === "sq") setLang(savedLang);

      const savedCountry = await AsyncStorage.getItem(STORAGE_COUNTRY_KEY);
      if (savedCountry) setCountry(savedCountry);
    })();

    load();
  }, []);

  const toggleLang = async () => {
    const next: Lang = lang === "en" ? "sq" : "en";
    setLang(next);
    await AsyncStorage.setItem(STORAGE_LANG_KEY, next);
  };

  const onSelectCountry = async (next: string) => {
    setCountry(next);
    await AsyncStorage.setItem(STORAGE_COUNTRY_KEY, next);
  };

  const adUnitId = __DEV__ ? TestIds.BANNER : "ca-app-pub-2653462201538649/5444199958";

  return (
    <SafeAreaView style={styles.screen} edges={["top", "left", "right", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F7FB" />

      <View style={[styles.content, { paddingTop: insets.top + 12 }]}>
        <View style={styles.header}>
          <View style={styles.rowBetween}>
            <View style={{ flex: 1 }}>
              <Text style={styles.h1}>{t.title}</Text>
              <Text style={styles.sub}>
                {data ? t.subtitleAsOf(data.as_of) : t.subtitleLoading}
              </Text>
            </View>

            <Pressable onPress={toggleLang} style={styles.langPill}>
              <Text style={styles.langText}>{lang === "en" ? t.langSQ : t.langEN}</Text>
            </Pressable>
          </View>
        </View>

        {!data && !err ? (
          <View style={styles.center}>
            <ActivityIndicator />
            <Text style={styles.muted}>{t.fetching}</Text>
          </View>
        ) : null}

        {err ? (
          <View style={[styles.card, styles.cardError]}>
            <Text style={styles.errorTitle}>{t.couldntLoad}</Text>
            <Text style={styles.errorText}>{err}</Text>
            <Pressable onPress={load} style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>{t.tryAgain}</Text>
            </Pressable>
          </View>
        ) : null}

        {data && selected ? (
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={styles.cardTitle}>{t.selectCountry}</Text>
              <Pressable onPress={load} style={styles.ghostBtn} disabled={refreshing}>
                <Text style={styles.ghostBtnText}>
                  {refreshing ? t.refreshing : t.refresh}
                </Text>
              </Pressable>
            </View>

            <View style={styles.pickerWrap}>
              <Picker selectedValue={country} onValueChange={(v) => onSelectCountry(String(v))} style={styles.picker} dropdownIconColor="#475569">
                {countries.map((c) => (
                  <Picker.Item key={c} label={c} value={c} />
                ))}
              </Picker>
            </View>

            <View style={styles.grid}>
              <View style={styles.tile}>
                <Text style={styles.tileLabel}>{t.gasoline95}</Text>
                <Text style={styles.tileValue}>{formatPrice(selected.gasoline95_eur)}</Text>
              </View>

              <View style={styles.tile}>
                <Text style={styles.tileLabel}>{t.diesel}</Text>
                <Text style={styles.tileValue}>{formatPrice(selected.diesel_eur)}</Text>
              </View>

              <View style={styles.tile}>
                <Text style={styles.tileLabel}>{t.lpg}</Text>
                <Text style={styles.tileValue}>{formatPrice(selected.lpg_eur)}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.metaLabel}>{t.source}</Text>
            <View style={styles.rowBetween}>
              <Text style={styles.metaText}>{data.source}</Text>
              <Pressable onPress={() => Linking.openURL(data.source_url)} style={styles.linkBtn}>
                <Text style={styles.linkBtnText}>{t.open}</Text>
              </Pressable>
            </View>

            <Text style={styles.mutedSmall}>
              {t.fetchedAt(new Date(data.fetched_at_utc).toLocaleString())}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.adBar}>
        <BannerAd unitId={adUnitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  h1: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 0.2,
    color: "#0F172A",
  },
  sub: {
    marginTop: 4,
    fontSize: 14,
    color: "#334155",
  },
  center: {
    marginTop: 28,
    alignItems: "center",
    gap: 10,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  cardError: {
    borderColor: "rgba(220, 38, 38, 0.25)",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  pickerWrap: {
    marginTop: 10,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    backgroundColor: "#F3F5FF",
  },
  picker: {
    color: "#0F172A",
  },
  grid: {
    marginTop: 14,
    gap: 10,
  },
  tile: {
    borderRadius: 14,
    padding: 12,
    backgroundColor: "#F3F5FF",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  tileLabel: {
    fontSize: 13,
    color: "#475569",
    fontWeight: "600",
  },
  tileValue: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.06)",
    marginVertical: 14,
  },
  metaLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
    marginBottom: 6,
  },
  metaText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
  muted: {
    color: "#64748B",
  },
  mutedSmall: {
    marginTop: 8,
    fontSize: 12,
    color: "#64748B",
  },
  primaryBtn: {
    marginTop: 12,
    backgroundColor: "#111827",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryBtnText: {
    color: "white",
    fontWeight: "700",
  },
  ghostBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "rgba(17,24,39,0.06)",
  },
  ghostBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  linkBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "rgba(37, 99, 235, 0.10)",
  },
  linkBtnText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1D4ED8",
  },
  langPill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "rgba(17,24,39,0.06)",
  },
  langText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 6,
    color: "#991B1B",
  },
  errorText: {
    color: "#334155",
    lineHeight: 18,
  },
  adBar: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F6F7FB",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
    paddingBottom: Platform.OS === "android" ? 6 : 0,
  },
});