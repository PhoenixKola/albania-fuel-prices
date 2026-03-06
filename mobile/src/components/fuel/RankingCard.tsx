import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { Theme } from "../../theme/theme";
import type { FuelType, LatestEurope } from "../../types/fuel";
import { getFuelPrice, fuelLabel } from "../../utils/fuel";
import SegmentedControl from "../ui/SegmentedControl";
import AnimatedPressable from "../ui/AnimatedPressable";
import { makeRankingStyles } from "./RankingCard.styles";
import { CurrencyMode, formatFuelPrice } from "../../utils/priceDisplay";

export default function RankingCard(props: {
  theme: Theme;
  t: any;
  data: LatestEurope | null;
  fuelType: FuelType;
  setFuelType: (v: FuelType | ((p: FuelType) => FuelType)) => void;
  currentCountry: string;
  onOpenCountry: (c: string) => void;
  currencyMode: CurrencyMode;
  fxRates: Record<string, number> | null;
  rewardUnlocked: boolean;
}) {
  const s = useMemo(() => makeRankingStyles(props.theme), [props.theme]);

  const fuelItems = useMemo(
    () => [
      { value: "diesel" as const, label: props.t.diesel },
      { value: "gasoline95" as const, label: props.t.gasoline95 },
      { value: "lpg" as const, label: props.t.lpg }
    ],
    [props.t]
  );

  const sorted = useMemo(() => {
    if (!props.data) return [];
    return props.data.countries
      .map((c) => ({ country: c.country, price: getFuelPrice(c, props.fuelType) }))
      .filter((x) => x.price != null)
      .sort((a, b) => (a.price! < b.price! ? -1 : 1));
  }, [props.data, props.fuelType]);

  const cheapest = useMemo(() => sorted.slice(0, 10), [sorted]);

  const mostExpensive = useMemo(() => {
    if (!sorted.length) return [];
    return sorted.slice(Math.max(0, sorted.length - 10)).reverse();
  }, [sorted]);

  const currentRank = useMemo(() => {
    const idx = sorted.findIndex((x) => x.country === props.currentCountry);
    return idx >= 0 ? idx + 1 : null;
  }, [sorted, props.currentCountry]);

  const fuelName = fuelLabel(props.fuelType, props.t);

  const fuelLabelShort = useMemo(() => {
    if (props.fuelType === "diesel") return props.t.diesel ?? "Diesel";
    if (props.fuelType === "gasoline95") return props.t.gasoline95 ?? "Gasoline 95";
    return props.t.lpg ?? "LPG";
  }, [props.fuelType, props.t]);

  const currencyModeLabel = useMemo(() => {
    if (props.currencyMode === "eur") return props.t.currencyEUR ?? "EUR";
    return props.t.currencyLocal ?? "Local";
  }, [props.currencyMode, props.t]);

  const renderRow = (r: { country: string; price: number | null }, displayRank: number, isInTopList: boolean) => {
    const active = r.country === props.currentCountry;

    const medalIcon =
      displayRank === 1 ? "trophy-outline" : displayRank === 2 ? "medal-outline" : displayRank === 3 ? "ribbon-outline" : null;

    const rankTone =
      displayRank === 1 ? "gold" : displayRank === 2 ? "silver" : displayRank === 3 ? "bronze" : "base";

    return (
      <AnimatedPressable
        key={`${isInTopList ? "top" : "exp"}-${r.country}`}
        onPress={() => props.onOpenCountry(r.country)}
        contentStyle={[s.rowCard, active ? s.rowActive : null]}
        scaleIn={0.99}
      >
        <View style={s.left}>
          <View
            style={[
              s.rankBubble,
              rankTone === "gold" ? s.rankGold : null,
              rankTone === "silver" ? s.rankSilver : null,
              rankTone === "bronze" ? s.rankBronze : null,
              active ? s.rankBubbleActive : null
            ]}
          >
            {medalIcon ? <Ionicons name={medalIcon as any} size={14} color={props.theme.colors.text} /> : null}
            <Text style={[s.rankText, active ? s.rankTextActive : null]}>{displayRank}</Text>
          </View>

          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={[s.country, active ? s.countryActive : null]} numberOfLines={1}>
              {r.country}
            </Text>

            {active ? (
              <View style={s.youPill}>
                <Ionicons name="person-circle-outline" size={14} color={props.theme.colors.text} />
                <Text style={s.youPillText}>{props.t.you ?? "You"}</Text>
              </View>
            ) : null}
          </View>
        </View>

        <View style={s.right}>
          <Text style={[s.price, active ? s.priceActive : null]}>
            {formatFuelPrice(r.country, r.price, props.currencyMode, props.fxRates)}
          </Text>
          <Ionicons name="chevron-forward" size={16} color={props.theme.colors.muted} />
        </View>
      </AnimatedPressable>
    );
  };

  return (
    <View style={s.card}>
      <View style={s.headerRow}>
        <View style={s.headerLeft}>
          <View style={s.headerIcon}>
            <Ionicons name="podium-outline" size={18} color={props.theme.colors.linkText} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={s.title}>{props.t.rankingsTitle}</Text>
            <Text style={s.subtitle} numberOfLines={2}>
              {props.t.rankingsSubtitle(fuelName)}
            </Text>
          </View>
        </View>

        <View style={s.headerPills}>
          <View style={s.pill}>
            <Ionicons name="list-outline" size={14} color={props.theme.colors.muted} />
            <Text style={s.pillText}>Top 10</Text>
          </View>

          <View style={s.pill}>
            <Ionicons name="flame-outline" size={14} color={props.theme.colors.muted} />
            <Text style={s.pillText} numberOfLines={1}>
              {fuelLabelShort}
            </Text>
          </View>

          <View style={s.pill}>
            <Ionicons name={props.currencyMode === "eur" ? "logo-euro" : "cash-outline"} size={14} color={props.theme.colors.muted} />
            <Text style={s.pillText} numberOfLines={1}>
              {currencyModeLabel}
            </Text>
          </View>
        </View>
      </View>

      <SegmentedControl theme={props.theme} value={props.fuelType} items={fuelItems} onChange={props.setFuelType} />

      <View style={s.infoBanner}>
        <Ionicons name="information-circle-outline" size={18} color={props.theme.colors.muted} />
        <Text style={s.infoText}>
          {currentRank != null ? props.t.yourRank(currentRank) : props.t.rankUnavailable}
        </Text>
      </View>

      <View style={s.sectionHeaderRow}>
        <Text style={s.sectionTitle}>{props.t.rankingsCheapTitle ?? props.t.rankingsTitle ?? "Cheapest"}</Text>
        <Text style={s.sectionSub}>{props.t.rankingsCheapSubtitle?.(fuelName) ?? props.t.rankingsSubtitle?.(fuelName) ?? ""}</Text>
      </View>

      <View style={s.rows}>
        {cheapest.map((r, i) => renderRow(r, i + 1, true))}
      </View>

      <View style={s.divider} />

      <View style={s.sectionHeaderRow}>
        <View style={s.sectionTitleRow}>
          <Text style={s.sectionTitle}>{props.t.rankingsExpensiveTitle}</Text>
          {!props.rewardUnlocked ? (
            <View style={s.lockPill}>
              <Ionicons name="lock-closed-outline" size={14} color={props.theme.colors.muted} />
              <Text style={s.lockText}>{props.t.locked ?? "Locked"}</Text>
            </View>
          ) : (
            <View style={s.unlockPill}>
              <Ionicons name="sparkles-outline" size={14} color={props.theme.colors.text} />
              <Text style={s.unlockText}>{props.t.unlocked ?? "Unlocked"}</Text>
            </View>
          )}
        </View>

        <Text style={s.sectionSub}>{props.t.rankingsExpensiveSubtitle(fuelName)}</Text>
      </View>

      {props.rewardUnlocked ? (
        <View style={s.rows}>
          {mostExpensive.map((r, i) => {
            const rank = sorted.length - i;
            return renderRow(r, rank, false);
          })}
        </View>
      ) : (
        <View style={s.lockedCard}>
          <Ionicons name="lock-closed-outline" size={18} color={props.theme.colors.muted} />
          <View style={{ flex: 1 }}>
            <Text style={s.lockedTitle}>{props.t.unlockMoreRankingsTitle}</Text>
            <Text style={s.lockedSub}>{props.t.unlockMoreRankingsSubtitle}</Text>
          </View>
        </View>
      )}
    </View>
  );
}