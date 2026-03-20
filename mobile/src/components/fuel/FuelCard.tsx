import React, { useEffect, useMemo, useState } from "react";
import { Linking, Share, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import type { LatestEurope, CountryPrices, FuelType } from "../../types/fuel";
import type { Theme } from "../../theme/theme";
import { getFuelPrice, fuelLabel } from "../../utils/fuel";
import { getCurrencyForCountry, convertEur } from "../../utils/currency";
import { formatMoney, hasRate } from "../../utils/money";
import AnimatedPressable from "../ui/AnimatedPressable";
import { makeFuelCardStyles } from "./FuelCard.styles";
import { PLAY_STORE_URL } from "../../constants/urls";
import { getFlagForCountry } from "../../utils/countryFlag";

type CurrencyMode = "eur" | "local";

type StoredBaseline = {
  savedAtUtc: string;
  diesel_eur: number | null;
  gasoline95_eur: number | null;
  lpg_eur: number | null;
};

function safeParseBaseline(raw: string | null): StoredBaseline | null {
  if (!raw) return null;
  try {
    const j = JSON.parse(raw);
    if (!j || typeof j !== "object") return null;
    return {
      savedAtUtc: String(j.savedAtUtc ?? ""),
      diesel_eur: typeof j.diesel_eur === "number" ? j.diesel_eur : null,
      gasoline95_eur: typeof j.gasoline95_eur === "number" ? j.gasoline95_eur : null,
      lpg_eur: typeof j.lpg_eur === "number" ? j.lpg_eur : null
    };
  } catch {
    return null;
  }
}

export default function FuelCard(props: {
  theme: Theme;
  t: any;
  data: LatestEurope | null;
  selected: CountryPrices | null;
  prevSelected: CountryPrices | null;

  loading: boolean;
  country: string;
  fuelType: FuelType;

  currencyMode: CurrencyMode;
  setCurrencyMode: (v: CurrencyMode | ((p: CurrencyMode) => CurrencyMode)) => void;
  fxRates: Record<string, number> | null;

  isFromCache: boolean;
  cacheSavedAtUtc: string | null;

  refreshing: boolean;
  onRefresh: () => void;
  onOpenCountrySearch: () => void;
}) {
  const s = useMemo(() => makeFuelCardStyles(props.theme), [props.theme]);

  const currency = useMemo(() => getCurrencyForCountry(props.country), [props.country]);
  const canLocal = useMemo(() => hasRate(currency, props.fxRates), [currency, props.fxRates]);
  const mode: CurrencyMode = props.currencyMode === "local" && canLocal ? "local" : "eur";

  const baselineKey = useMemo(() => `fuel_baseline_v1_${props.country}`, [props.country]);
  const [baseline, setBaseline] = useState<StoredBaseline | null>(null);

  const flag = useMemo(() => getFlagForCountry(props.country), [props.country]);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(baselineKey);
      setBaseline(safeParseBaseline(raw));
    })();
  }, [baselineKey]);

  useEffect(() => {
    (async () => {
      const cur = props.selected;
      if (!cur) return;

      const next: StoredBaseline = {
        savedAtUtc: new Date().toISOString(),
        diesel_eur: typeof cur.diesel_eur === "number" ? cur.diesel_eur : null,
        gasoline95_eur: typeof cur.gasoline95_eur === "number" ? cur.gasoline95_eur : null,
        lpg_eur: typeof cur.lpg_eur === "number" ? cur.lpg_eur : null
      };

      if (!baseline) {
        setBaseline(next);
        await AsyncStorage.setItem(baselineKey, JSON.stringify(next));
        return;
      }

      const changed =
        (next.diesel_eur != null && baseline.diesel_eur != null && Math.abs(next.diesel_eur - baseline.diesel_eur) > 0.0001) ||
        (next.gasoline95_eur != null && baseline.gasoline95_eur != null && Math.abs(next.gasoline95_eur - baseline.gasoline95_eur) > 0.0001) ||
        (next.lpg_eur != null && baseline.lpg_eur != null && Math.abs(next.lpg_eur - baseline.lpg_eur) > 0.0001);

      if (changed) {
        setBaseline(next);
        await AsyncStorage.setItem(baselineKey, JSON.stringify(next));
      }
    })();
  }, [props.selected, baseline, baselineKey]);

  const fmt = (eur: number | null | undefined) => {
    if (mode === "eur") return formatMoney(eur ?? null, "EUR");
    const local = convertEur(eur ?? null, currency, props.fxRates);
    return formatMoney(local, currency);
  };

  const fmtDelta = (currentEur: number | null | undefined, baseEur: number | null | undefined) => {
    if (currentEur == null || baseEur == null) return "—";

    const diffEur = currentEur - baseEur;
    if (!Number.isFinite(diffEur) || Math.abs(diffEur) < 0.001) return "—";

    const sign = diffEur > 0 ? "+" : "-";
    const absEur = Math.abs(diffEur);

    if (mode === "eur") return `${sign}${formatMoney(absEur, "EUR")}`;

    const r = props.fxRates?.[currency];
    if (!r || !Number.isFinite(r)) return `${sign}${formatMoney(absEur, "EUR")}`;

    const absLocal = absEur * r;
    return `${sign}${formatMoney(absLocal, currency)}`;
  };

  const baseDiesel = baseline?.diesel_eur ?? props.prevSelected?.diesel_eur ?? null;
  const baseGas = baseline?.gasoline95_eur ?? props.prevSelected?.gasoline95_eur ?? null;
  const baseLpg = baseline?.lpg_eur ?? props.prevSelected?.lpg_eur ?? null;

  const onShare = async () => {
    const fuelName = fuelLabel(props.fuelType, props.t);
    const eurPrice = getFuelPrice(props.selected, props.fuelType);
    const eurText = formatMoney(eurPrice, "EUR");

    const localText =
      currency !== "EUR" && hasRate(currency, props.fxRates)
        ? formatMoney(convertEur(eurPrice, currency, props.fxRates), currency)
        : null;

    const priceText =
      mode === "local" && localText ? `${localText} (${eurText})` : localText ? `${eurText} (${localText})` : eurText;

    const asOf = props.data?.as_of ? props.t.subtitleAsOf(props.data.as_of) : "";
    const source = props.data?.source ? `${props.t.source}: ${props.data.source}` : "";
    const isSq = props.t?.title?.includes("Çmimet") || props.t?.langSQ === "AL";

    const headline = isSq
      ? `⛽ ${fuelName} ne ${props.country}: ${priceText}`
      : `⛽ ${fuelName} in ${props.country}: ${priceText}`;

    const cta = isSq ? `📲 Shkarko aplikacionin: ${PLAY_STORE_URL}` : `📲 Get the app: ${PLAY_STORE_URL}`;

    const details = [`${props.t.title} — ${props.country}`, `${fuelName}: ${priceText}`, asOf, source]
      .filter(Boolean)
      .join("\n");

    const message = [headline, asOf, cta, "", details].filter(Boolean).join("\n");

    try {
      await Share.share({ message });
    } catch {}
  };

  const modeLabel =
    mode === "eur"
      ? props.t.currencyEUR ?? "EUR"
      : props.t.currencyLocal ?? "Local";

  return (
    <View style={s.styles.card}>
      <View style={s.styles.headerRow}>
        <View style={s.styles.headerLeft}>
          <View style={s.styles.headerIcon}>
            <Ionicons name="speedometer-outline" size={18} color={props.theme.colors.linkText} />
          </View>

          <View style={s.styles.flex1}>
            <View style={s.styles.titleRow}>
              <Text style={s.styles.title}>{props.t.selectCountry}</Text>

              <View style={s.styles.badgeRow}>
                <View style={s.styles.badge}>
                  <Ionicons
                    name={props.isFromCache ? "cloud-offline-outline" : "pulse-outline"}
                    size={14}
                    color={props.theme.colors.linkText}
                  />
                  <Text style={s.styles.badgeText}>
                    {props.isFromCache ? props.t.cachedWorksOffline ?? "Cached" : props.t.live ?? "Live"}
                  </Text>
                </View>

                {props.loading ? (
                  <View style={s.styles.loadingPill}>
                    <Ionicons name="time-outline" size={14} color={props.theme.colors.muted} />
                    <Text style={s.styles.loadingText}>{props.t.loading ?? "Loading"}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        </View>

        <View style={s.styles.headerActions}>
          <AnimatedPressable onPress={onShare} contentStyle={s.styles.iconBtn} scaleIn={0.98}>
            <Ionicons name="share-outline" size={18} color={props.theme.colors.text} />
          </AnimatedPressable>
        </View>
      </View>

      <View style={s.styles.countryRow}>
        <View style={s.styles.flex1}>
          <View style={s.styles.countryTitleRow}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              {flag ? <Text style={{ fontSize: 20 }}>{flag}</Text> : null}
              <Text style={s.styles.countryName}>{props.country}</Text>
            </View>

            <View style={s.styles.modeChip}>
              <Ionicons name={mode === "eur" ? "logo-euro" : "cash-outline"} size={14} color={props.theme.colors.text} />
              <Text style={s.styles.modeChipText} numberOfLines={1}>
                {mode === "eur" ? "EUR" : currency}
              </Text>
            </View>
          </View>

          <Text style={s.styles.subText}>
            {props.t.currency}: {modeLabel}
            {!canLocal && currency !== "EUR" ? ` · ${props.t.fxUnavailable ?? "FX unavailable"}` : ""}
          </Text>
        </View>

        <AnimatedPressable onPress={props.onOpenCountrySearch} contentStyle={s.styles.changeBtn} scaleIn={0.98}>
          <Ionicons name="swap-horizontal-outline" size={16} color={props.theme.colors.text} />
          <Text style={s.styles.changeBtnText}>{props.t.changeCountry}</Text>
        </AnimatedPressable>
      </View>

      <View style={s.styles.grid}>
        <PriceTile
          theme={props.theme}
          tone="cool"
          label={props.t.gasoline95}
          icon="car-sport-outline"
          value={fmt(props.selected?.gasoline95_eur)}
          delta={fmtDelta(props.selected?.gasoline95_eur, baseGas)}
          deltaUp={props.selected?.gasoline95_eur != null && baseGas != null && props.selected.gasoline95_eur > baseGas}
        />

        <PriceTile
          theme={props.theme}
          tone="neutral"
          label={props.t.diesel}
          icon="trail-sign-outline"
          value={fmt(props.selected?.diesel_eur)}
          delta={fmtDelta(props.selected?.diesel_eur, baseDiesel)}
          deltaUp={props.selected?.diesel_eur != null && baseDiesel != null && props.selected.diesel_eur > baseDiesel}
        />

        <PriceTile
          theme={props.theme}
          tone="warm"
          label={props.t.lpg}
          icon="flame-outline"
          value={fmt(props.selected?.lpg_eur)}
          delta={fmtDelta(props.selected?.lpg_eur, baseLpg)}
          deltaUp={props.selected?.lpg_eur != null && baseLpg != null && props.selected.lpg_eur > baseLpg}
        />
      </View>

      <View style={s.styles.divider} />

      <View style={s.styles.sourceRow}>
        <View style={s.styles.flex1}>
          <Text style={s.styles.label}>{props.t.source}</Text>
          <Text style={s.styles.sourceText} numberOfLines={2}>
            {props.data?.source ?? "—"}
          </Text>
        </View>

        {props.data?.source_url ? (
          <AnimatedPressable
            onPress={() => Linking.openURL(props.data!.source_url)}
            contentStyle={s.styles.linkBtn}
            scaleIn={0.98}
          >
            <Ionicons name="open-outline" size={16} color={props.theme.colors.linkText} />
            <Text style={s.styles.linkBtnText}>{props.t.open}</Text>
          </AnimatedPressable>
        ) : null}
      </View>

      <Text style={s.styles.mutedSmall}>
        {props.data?.fetched_at_utc ? props.t.fetchedAt(new Date(props.data.fetched_at_utc).toLocaleString()) : ""}
      </Text>
    </View>
  );
}

function PriceTile(props: {
  theme: Theme;
  label: string;
  icon: any;
  value: string;
  delta: string;
  deltaUp: boolean;
  tone: "cool" | "neutral" | "warm";
}) {
  const s = useMemo(() => makeFuelCardStyles(props.theme), [props.theme]);

  const showDelta = props.delta !== "—";
  const deltaText = props.delta;
  const sign = showDelta ? deltaText.trim().slice(0, 1) : "";
  const rest = showDelta ? deltaText.trim().slice(1) : "";
  const isMinus = showDelta && sign === "-";

  const tintBg = s.toneBg[props.tone];
  const tintBorder = s.toneBorder[props.tone];

  return (
    <View style={s.styles.tile}>
      <View style={s.styles.tileTopRow}>
        <View style={s.styles.tileLeft}>
          <View style={[s.styles.tileIcon, { backgroundColor: tintBg, borderColor: tintBorder }]}>
            <Ionicons name={props.icon} size={16} color={props.theme.colors.text} />
          </View>

          <Text style={s.styles.tileLabel} numberOfLines={1}>
            {props.label}
          </Text>
        </View>

        <View style={s.styles.deltaPill}>
          {showDelta ? (
            <>
              <Ionicons
                name={props.deltaUp ? "arrow-up" : "arrow-down"}
                size={14}
                color={props.deltaUp ? s.colors.up : props.theme.colors.danger}
              />

              {isMinus ? (
                <View style={[s.styles.minusBubble, { backgroundColor: tintBg, borderColor: tintBorder }]}>
                  <Text style={s.styles.minusText}>-</Text>
                </View>
              ) : null}

              <Text style={s.styles.deltaText}>{isMinus ? rest : deltaText}</Text>
            </>
          ) : (
            <Text style={s.styles.deltaText}>—</Text>
          )}
        </View>
      </View>

      <Text style={s.styles.tileValue}>{props.value}</Text>
    </View>
  );
}