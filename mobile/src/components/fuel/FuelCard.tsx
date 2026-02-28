import React, { useMemo } from "react";
import { ActivityIndicator, Linking, Pressable, Share, Text, View } from "react-native";
import type { LatestEurope, CountryPrices, FuelType } from "../../types/fuel";
import type { Theme } from "../../theme/theme";
import { getFuelPrice, fuelLabel } from "../../utils/fuel";
import { getCurrencyForCountry, convertEur } from "../../utils/currency";
import { formatMoney, hasRate } from "../../utils/money";
import { makeFuelCardStyles } from "./FuelCard.styles";

type CurrencyMode = "eur" | "local";

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

  const subtitle = props.loading ? <ActivityIndicator /> : null;

  const currency = useMemo(() => getCurrencyForCountry(props.country), [props.country]);
  const canLocal = useMemo(() => hasRate(currency, props.fxRates), [currency, props.fxRates]);
  const mode: CurrencyMode = props.currencyMode === "local" && canLocal ? "local" : "eur";

  const fmt = (eur: number | null | undefined) => {
    if (mode === "eur") return formatMoney(eur ?? null, "EUR");
    const local = convertEur(eur ?? null, currency, props.fxRates);
    return formatMoney(local, currency);
  };

  const fmtDelta = (currentEur: number | null | undefined, prevEur: number | null | undefined) => {
    if (currentEur == null || prevEur == null) return null;
    const diffEur = currentEur - prevEur;

    if (!Number.isFinite(diffEur) || Math.abs(diffEur) < 0.0001) return "—";

    const arrow = diffEur > 0 ? "↑" : "↓";
    const sign = diffEur > 0 ? "+" : "-";
    const absEur = Math.abs(diffEur);

    if (mode === "eur") {
      return `${arrow} ${sign}${formatMoney(absEur, "EUR")}`;
    }

    const r = props.fxRates?.[currency];
    if (!r || !Number.isFinite(r)) return `${arrow} ${sign}${formatMoney(absEur, "EUR")}`;

    const absLocal = absEur * r;
    return `${arrow} ${sign}${formatMoney(absLocal, currency)}`;
  };

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

    const message = [`${props.t.title} — ${props.country}`, `${fuelName}: ${priceText}`, asOf, source]
      .filter(Boolean)
      .join("\n");

    try {
      await Share.share({ message });
    } catch {}
  };

  // const cachedLine =
  //   props.isFromCache && props.cacheSavedAtUtc
  //     ? `${props.t.showingCached} • ${props.t.lastUpdated}: ${new Date(props.cacheSavedAtUtc).toLocaleString()}`
  //     : props.cacheSavedAtUtc
  //       ? `${props.t.lastUpdated}: ${new Date(props.cacheSavedAtUtc).toLocaleString()}`
  //       : "";

  return (
    <View style={s.card}>
      <View style={s.rowBetween}>
        <Text style={s.title}>{props.t.selectCountry}</Text>
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          {subtitle}
          <Pressable onPress={onShare} style={s.btnGhost}>
            <Text style={s.btnGhostText}>{props.t.share}</Text>
          </Pressable>
          <Pressable onPress={props.onRefresh} style={s.btnGhost} disabled={props.refreshing}>
            <Text style={s.btnGhostText}>{props.refreshing ? props.t.refreshing : props.t.refresh}</Text>
          </Pressable>
        </View>
      </View>

      <View style={s.rowBetween}>
        <Text style={s.countryName}>{props.country}</Text>
        <Pressable onPress={props.onOpenCountrySearch} style={s.btnGhost}>
          <Text style={s.btnGhostText}>{props.t.changeCountry}</Text>
        </Pressable>
      </View>

      <View style={s.currencyRow}>
        <Text style={s.currencyLabel}>{props.t.currency}</Text>
        <View style={s.currencyPills}>
          <Pressable
            onPress={() => props.setCurrencyMode("eur")}
            style={[s.currencyPill, mode === "eur" ? s.currencyPillActive : null]}
          >
            <Text style={[s.currencyPillText, mode === "eur" ? s.currencyPillTextActive : null]}>
              {props.t.currencyEUR}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              if (canLocal) props.setCurrencyMode("local");
            }}
            style={[
              s.currencyPill,
              mode === "local" ? s.currencyPillActive : null,
              !canLocal ? s.currencyPillDisabled : null,
            ]}
          >
            <Text
              style={[
                s.currencyPillText,
                mode === "local" ? s.currencyPillTextActive : null,
                !canLocal ? s.currencyPillTextDisabled : null,
              ]}
            >
              {props.t.currencyLocal}
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={s.grid}>
        <View style={s.tile}>
          <Text style={s.tileLabel}>{props.t.gasoline95}</Text>
          <Text style={s.tileValue}>{fmt(props.selected?.gasoline95_eur)}</Text>
          <Text style={s.tileDelta}>
            {fmtDelta(props.selected?.gasoline95_eur, props.prevSelected?.gasoline95_eur) ?? ""}
          </Text>
        </View>

        <View style={s.tile}>
          <Text style={s.tileLabel}>{props.t.diesel}</Text>
          <Text style={s.tileValue}>{fmt(props.selected?.diesel_eur)}</Text>
          <Text style={s.tileDelta}>
            {fmtDelta(props.selected?.diesel_eur, props.prevSelected?.diesel_eur) ?? ""}
          </Text>
        </View>

        <View style={s.tile}>
          <Text style={s.tileLabel}>{props.t.lpg}</Text>
          <Text style={s.tileValue}>{fmt(props.selected?.lpg_eur)}</Text>
          <Text style={s.tileDelta}>
            {fmtDelta(props.selected?.lpg_eur, props.prevSelected?.lpg_eur) ?? ""}
          </Text>
        </View>
      </View>

      <View style={s.divider} />

      <Text style={s.metaLabel}>{props.t.source}</Text>
      <View style={s.rowBetween}>
        <Text style={s.metaText}>{props.data?.source ?? "—"}</Text>
        {props.data?.source_url ? (
          <Pressable onPress={() => Linking.openURL(props.data!.source_url)} style={s.linkBtn}>
            <Text style={s.linkBtnText}>{props.t.open}</Text>
          </Pressable>
        ) : null}
      </View>

      <Text style={s.mutedSmall}>
        {props.data?.fetched_at_utc ? props.t.fetchedAt(new Date(props.data.fetched_at_utc).toLocaleString()) : ""}
      </Text>

      {/* {cachedLine ? <Text style={s.mutedSmall}>{cachedLine}</Text> : null} */}
    </View>
  );
}