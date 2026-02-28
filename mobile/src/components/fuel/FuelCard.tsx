import React, { useMemo } from "react";
import { ActivityIndicator, Linking, Share, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { LatestEurope, CountryPrices, FuelType } from "../../types/fuel";
import type { Theme } from "../../theme/theme";
import { getFuelPrice, fuelLabel } from "../../utils/fuel";
import { getCurrencyForCountry, convertEur } from "../../utils/currency";
import { formatMoney, hasRate } from "../../utils/money";
import AnimatedPressable from "../ui/AnimatedPressable";
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

    const arrow = diffEur > 0 ? "arrow-up" : "arrow-down";
    const sign = diffEur > 0 ? "+" : "-";
    const absEur = Math.abs(diffEur);

    if (mode === "eur") return `${sign}${formatMoney(absEur, "EUR")}`;

    const r = props.fxRates?.[currency];
    if (!r || !Number.isFinite(r)) return `${sign}${formatMoney(absEur, "EUR")}`;

    const absLocal = absEur * r;
    return `${sign}${formatMoney(absLocal, currency)}`;
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

  const badgeText = props.isFromCache ? props.t.cachedWorksOffline ?? "Cached" : props.t.live ?? "Live";

  return (
    <View style={s.card}>
      <View style={s.headerRow}>
        <View style={s.headerLeft}>
          <View style={s.headerIcon}>
            <Ionicons name="speedometer-outline" size={18} color={props.theme.colors.linkText} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.title}>{props.t.selectCountry}</Text>
            <View style={s.badgeRow}>
              <View style={s.badge}>
                <Ionicons name={props.isFromCache ? "cloud-offline-outline" : "pulse-outline"} size={14} color={props.theme.colors.linkText} />
                <Text style={s.badgeText}>{badgeText}</Text>
              </View>
              {props.loading ? (
                <View style={s.loadingPill}>
                  <ActivityIndicator />
                </View>
              ) : null}
            </View>
          </View>
        </View>

        <View style={s.headerActions}>
          <AnimatedPressable onPress={onShare} contentStyle={s.iconBtn} scaleIn={0.98}>
            <Ionicons name="share-outline" size={18} color={props.theme.colors.text} />
          </AnimatedPressable>

          <AnimatedPressable onPress={props.onRefresh} disabled={props.refreshing} contentStyle={[s.iconBtn, props.refreshing ? s.iconBtnDisabled : null]} scaleIn={0.98}>
            {props.refreshing ? <ActivityIndicator /> : <Ionicons name="refresh" size={18} color={props.theme.colors.text} />}
          </AnimatedPressable>
        </View>
      </View>

      <View style={s.countryRow}>
        <View style={{ flex: 1 }}>
          <Text style={s.countryName}>{props.country}</Text>
          <Text style={s.subText}>{props.t.currency}: {mode === "eur" ? props.t.currencyEUR : props.t.currencyLocal}</Text>
        </View>

        <AnimatedPressable onPress={props.onOpenCountrySearch} contentStyle={s.ghostBtn} scaleIn={0.98}>
          <Ionicons name="swap-horizontal-outline" size={16} color={props.theme.colors.text} />
          <Text style={s.ghostBtnText}>{props.t.changeCountry}</Text>
        </AnimatedPressable>
      </View>

      <View style={s.currencyRow}>
        <Text style={s.label}>{props.t.currency}</Text>
        <View style={s.currencyPills}>
          <AnimatedPressable onPress={() => props.setCurrencyMode("eur")} contentStyle={[s.pill, mode === "eur" ? s.pillActive : null]} scaleIn={0.98}>
            <Ionicons name="logo-euro" size={14} color={mode === "eur" ? props.theme.colors.text : props.theme.colors.muted} />
            <Text style={[s.pillText, mode === "eur" ? s.pillTextActive : null]}>{props.t.currencyEUR}</Text>
          </AnimatedPressable>

          <AnimatedPressable
            onPress={() => {
              if (canLocal) props.setCurrencyMode("local");
            }}
            disabled={!canLocal}
            contentStyle={[
              s.pill,
              mode === "local" ? s.pillActive : null,
              !canLocal ? s.pillDisabled : null
            ]}
            scaleIn={0.98}
          >
            <Ionicons name="cash-outline" size={14} color={mode === "local" ? props.theme.colors.text : props.theme.colors.muted} />
            <Text style={[
              s.pillText,
              mode === "local" ? s.pillTextActive : null,
              !canLocal ? s.pillTextDisabled : null
            ]}>
              {props.t.currencyLocal}
            </Text>
          </AnimatedPressable>
        </View>
      </View>

      <View style={s.grid}>
        <PriceTile
          theme={props.theme}
          label={props.t.gasoline95}
          icon="car-sport-outline"
          value={fmt(props.selected?.gasoline95_eur)}
          delta={fmtDelta(props.selected?.gasoline95_eur, props.prevSelected?.gasoline95_eur)}
          deltaUp={(props.selected?.gasoline95_eur ?? 0) > (props.prevSelected?.gasoline95_eur ?? 0)}
        />

        <PriceTile
          theme={props.theme}
          label={props.t.diesel}
          icon="trail-sign-outline"
          value={fmt(props.selected?.diesel_eur)}
          delta={fmtDelta(props.selected?.diesel_eur, props.prevSelected?.diesel_eur)}
          deltaUp={(props.selected?.diesel_eur ?? 0) > (props.prevSelected?.diesel_eur ?? 0)}
        />

        <PriceTile
          theme={props.theme}
          label={props.t.lpg}
          icon="flame-outline"
          value={fmt(props.selected?.lpg_eur)}
          delta={fmtDelta(props.selected?.lpg_eur, props.prevSelected?.lpg_eur)}
          deltaUp={(props.selected?.lpg_eur ?? 0) > (props.prevSelected?.lpg_eur ?? 0)}
        />
      </View>

      <View style={s.divider} />

      <View style={s.sourceRow}>
        <View style={{ flex: 1 }}>
          <Text style={s.label}>{props.t.source}</Text>
          <Text style={s.sourceText} numberOfLines={2}>{props.data?.source ?? "—"}</Text>
        </View>

        {props.data?.source_url ? (
          <AnimatedPressable
            onPress={() => Linking.openURL(props.data!.source_url)}
            contentStyle={s.linkBtn}
            scaleIn={0.98}
          >
            <Ionicons name="open-outline" size={16} color={props.theme.colors.linkText} />
            <Text style={s.linkBtnText}>{props.t.open}</Text>
          </AnimatedPressable>
        ) : null}
      </View>

      <Text style={s.mutedSmall}>
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
  delta: string | null;
  deltaUp: boolean;
}) {
  const t = props.theme;
  return (
    <View style={{
      borderRadius: 16,
      padding: 12,
      backgroundColor: t.colors.tile,
      borderWidth: 1,
      borderColor: t.colors.border,
      gap: 8
    }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons name={props.icon} size={16} color={t.colors.muted} />
          <Text style={{ fontSize: 13, color: t.colors.muted, fontWeight: "900" }}>{props.label}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={t.colors.muted} />
      </View>

      <Text style={{ fontSize: 18, fontWeight: "900", color: t.colors.text }}>{props.value}</Text>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <Ionicons
          name={props.delta == null || props.delta === "—" ? "remove" : props.deltaUp ? "arrow-up" : "arrow-down"}
          size={14}
          color={props.delta == null || props.delta === "—" ? t.colors.muted : props.deltaUp ? "#22c55e" : t.colors.danger}
        />
        <Text style={{ fontSize: 12, color: t.colors.muted, fontWeight: "800" }}>
          {props.delta ?? ""}
        </Text>
      </View>
    </View>
  );
}