import React, { useMemo, useState } from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { Theme } from "../../theme/theme";
import type { TDict } from "../../i18n";
import type { FuelType, LatestEurope } from "../../types/fuel";
import { getFuelPrice, fuelLabel } from "../../utils/fuel";
import { isEuropeanCountry } from "../../utils/regions";
import SegmentedControl from "../ui/SegmentedControl";
import AnimatedPressable from "../ui/AnimatedPressable";
import { makeRankingStyles } from "./RankingCard.styles";
import { CurrencyMode, formatFuelPrice } from "../../utils/priceDisplay";
import { getFlagForCountry } from "../../utils/countryFlag";

type Scope = "europe" | "world" | "favorites";

export default function RankingCard(props: {
  theme: Theme;
  t: TDict;
  data: LatestEurope | null;
  fuelType: FuelType;
  setFuelType: (v: FuelType | ((p: FuelType) => FuelType)) => void;
  currentCountry: string;
  onOpenCountry: (c: string) => void;
  currencyMode: CurrencyMode;
  fxRates: Record<string, number> | null;
  rewardUnlocked: boolean;
  favorites: string[];
}) {
  const s = useMemo(() => makeRankingStyles(props.theme), [props.theme]);
  const [scope, setScope] = useState<Scope>("europe");

  const fuelItems = useMemo(
    () => [
      { value: "diesel" as const, label: props.t.diesel },
      { value: "gasoline95" as const, label: props.t.gasoline95 },
      { value: "lpg" as const, label: props.t.lpg }
    ],
    [props.t]
  );

  const scopeItems = useMemo(
    () => [
      { value: "europe", label: props.t.scopeEurope },
      { value: "world", label: props.t.scopeWorld },
      { value: "favorites", label: props.t.favorites }
    ],
    [props.t]
  );

  const allSorted = useMemo(() => {
    if (!props.data) return [];
    return props.data.countries
      .map((c) => ({ country: c.country, price: getFuelPrice(c, props.fuelType) }))
      .filter((x) => x.price != null)
      .sort((a, b) => (a.price! < b.price! ? -1 : 1));
  }, [props.data, props.fuelType]);

  const europeSorted = useMemo(() => allSorted.filter((x) => isEuropeanCountry(x.country)), [allSorted]);

  const favoritesSet = useMemo(() => new Set(props.favorites ?? []), [props.favorites]);

  const sorted = useMemo(() => {
    if (scope === "europe") return europeSorted;
    if (scope === "world") return allSorted;
    return allSorted.filter((x) => favoritesSet.has(x.country));
  }, [scope, europeSorted, allSorted, favoritesSet]);

  const cheapest = useMemo(() => sorted.slice(0, 10), [sorted]);

  const mostExpensive = useMemo(() => {
    if (!sorted.length) return [];
    return sorted.slice(Math.max(0, sorted.length - 10)).reverse();
  }, [sorted]);

  const currentRankInScope = useMemo(() => {
    const idx = sorted.findIndex((x) => x.country === props.currentCountry);
    return idx >= 0 ? idx + 1 : null;
  }, [sorted, props.currentCountry]);

  const aroundYou = useMemo(() => {
    if (!sorted.length) return [];
    const idx = sorted.findIndex((x) => x.country === props.currentCountry);
    if (idx < 0) return [];
    const start = Math.max(0, idx - 2);
    const end = Math.min(sorted.length, idx + 3);
    return sorted.slice(start, end).map((x, i) => ({
      ...x,
      rank: start + i + 1
    }));
  }, [sorted, props.currentCountry]);

  const fuelName = fuelLabel(props.fuelType, props.t);

  const renderRow = (r: { country: string; price: number | null }, displayRank: number, keyPrefix: string) => {
    const active = r.country === props.currentCountry;

    const medalIcon =
      displayRank === 1 ? "trophy-outline" : displayRank === 2 ? "medal-outline" : displayRank === 3 ? "ribbon-outline" : null;

    const rankTone =
      displayRank === 1 ? "gold" : displayRank === 2 ? "silver" : displayRank === 3 ? "bronze" : "base";

    return (
      <AnimatedPressable
        key={`${keyPrefix}-${r.country}`}
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
              {getFlagForCountry(r.country) ? `${getFlagForCountry(r.country)} ${r.country}` : r.country}
            </Text>

            {active ? (
              <View style={s.youPill}>
                <Ionicons name="person-circle-outline" size={14} color={props.theme.colors.text} />
                <Text style={s.youPillText}>{props.t.you}</Text>
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

  const favoritesDisabled = (props.favorites?.length ?? 0) < 2;

  return (
    <View style={s.card}>
      <SegmentedControl theme={props.theme} value={props.fuelType} items={fuelItems} onChange={props.setFuelType} />

      <SegmentedControl
        theme={props.theme}
        value={scope}
        items={scopeItems}
        onChange={(v) => {
          if (v === "favorites" && favoritesDisabled) return;
          setScope(v as Scope);
        }}
      />

      {scope === "favorites" && favoritesDisabled ? (
        <View style={s.infoBanner}>
          <Ionicons name="information-circle-outline" size={18} color={props.theme.colors.muted} />
          <Text style={s.infoText}>{props.t.addFavoritesToUseFavoritesRanking}</Text>
        </View>
      ) : null}

      <View style={s.infoBanner}>
        <Ionicons name="information-circle-outline" size={18} color={props.theme.colors.muted} />
        <Text style={s.infoText}>
          {scope === "favorites"
            ? currentRankInScope != null
              ? props.t.yourRankInFavorites(currentRankInScope)
              : props.t.notInFavoritesRank
            : currentRankInScope != null
              ? props.t.yourRank(currentRankInScope)
              : props.t.rankUnavailable}
        </Text>
      </View>

      <View style={s.sectionHeaderRow}>
        <Text style={s.sectionTitle}>
          {scope === "favorites" ? props.t.rankingsFavoritesTitle : props.t.rankingsCheapTitle}
        </Text>
        <Text style={s.sectionSub}>
          {scope === "favorites" ? props.t.rankingsFavoritesSubtitle(fuelName) : props.t.rankingsCheapSubtitle(fuelName)}
        </Text>
      </View>

      <View style={s.rows}>
        {cheapest.map((r, i) => renderRow(r, i + 1, `${scope}-top`))}
      </View>

      {scope !== "favorites" && currentRankInScope != null && currentRankInScope > 10 && aroundYou.length ? (
        <>
          <View style={s.divider} />

          <View style={s.sectionHeaderRow}>
            <Text style={s.sectionTitle}>{props.t.rankingsAroundYouTitle}</Text>
            <Text style={s.sectionSub}>{props.t.rankingsAroundYouSubtitle}</Text>
          </View>

          <View style={s.rows}>
            {aroundYou.map((r) => renderRow(r, r.rank, `${scope}-around`))}
          </View>
        </>
      ) : null}

      <View style={s.divider} />

      <View style={s.sectionHeaderRow}>
        <View style={s.sectionTitleRow}>
          <Text style={s.sectionTitle}>{props.t.rankingsExpensiveTitle}</Text>
          {!props.rewardUnlocked ? (
            <View style={s.lockPill}>
              <Ionicons name="lock-closed-outline" size={14} color={props.theme.colors.muted} />
              <Text style={s.lockText}>{props.t.locked}</Text>
            </View>
          ) : (
            <View style={s.unlockPill}>
              <Ionicons name="sparkles-outline" size={14} color={props.theme.colors.text} />
              <Text style={s.unlockText}>{props.t.unlocked}</Text>
            </View>
          )}
        </View>

        <Text style={s.sectionSub}>{props.t.rankingsExpensiveSubtitle(fuelName)}</Text>
      </View>

      {props.rewardUnlocked ? (
        <View style={s.rows}>
          {mostExpensive.map((r, i) => {
            const rank = sorted.length - i;
            return renderRow(r, rank, `${scope}-exp`);
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
