import React, { useEffect, useMemo, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, type RouteProp } from "@react-navigation/native";

import { useApp } from "../context/AppContext";
import CompareCard from "../components/fuel/CompareCard";
import RankingCard from "../components/fuel/RankingCard";
import SegmentedControl from "../components/ui/SegmentedControl";
import CountrySearchModal from "../components/country/CountrySearchModal";
import { makeScreenHeaderStyles } from "./screenHeader.styles";

type SubTab = "compare" | "rankings";
type CompareRouteParams = { subTab?: SubTab };

export default function CompareTab() {
  const ctx = useApp();
  const hs = useMemo(() => makeScreenHeaderStyles(ctx.theme), [ctx.theme]);
  const route = useRoute<RouteProp<Record<string, CompareRouteParams>, string>>();

  const [subTab, setSubTab] = useState<SubTab>("compare");
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  // Home shortcuts navigate here with an explicit target sub-tab.
  useEffect(() => {
    const requested = route.params?.subTab;
    if (requested === "compare" || requested === "rankings") setSubTab(requested);
  }, [route.params?.subTab]);

  const compareLabel = ctx.t.compareTitle;
  const rankingsLabel = ctx.t.rankingsTitle;

  return (
    <View style={{ flex: 1, backgroundColor: ctx.theme.colors.bg }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 12 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={ctx.refreshing} onRefresh={ctx.refreshAll} />}
      >
        <View style={hs.header}>
          <View style={hs.iconWrap}>
            <Ionicons name="git-compare-outline" size={18} color={ctx.theme.colors.primary} />
          </View>
          <View>
            <Text style={hs.title}>{compareLabel} & {rankingsLabel}</Text>
            <Text style={hs.subtitle}>
              {subTab === "compare"
                ? ctx.t.compareSubtitle(ctx.t[ctx.fuelType] ?? ctx.fuelType)
                : ctx.t.rankingsSubtitle(ctx.t[ctx.fuelType] ?? ctx.fuelType)}
            </Text>
          </View>
        </View>

        <SegmentedControl
          theme={ctx.theme}
          value={subTab}
          onChange={(v) => setSubTab(v as SubTab)}
          items={[
            { value: "compare", label: compareLabel, icon: "git-compare-outline" },
            { value: "rankings", label: rankingsLabel, icon: "podium-outline" },
          ]}
        />

        {subTab === "compare" ? (
          <CompareCard
            theme={ctx.theme}
            t={ctx.t}
            data={ctx.data}
            fuelType={ctx.fuelType}
            compareCountries={ctx.compareCountries}
            onRemove={ctx.removeCompare}
            onAddPress={() => {
              if (ctx.compareCountries.length >= ctx.maxCompare) return;
              setCompareModalOpen(true);
            }}
            currencyMode={ctx.effectiveCurrencyMode}
            fxRates={ctx.fxRates}
            maxCompare={ctx.maxCompare}
            onApplySet={ctx.applyCompareSet}
          />
        ) : null}

        {subTab === "rankings" ? (
          <RankingCard
            theme={ctx.theme}
            t={ctx.t}
            data={ctx.data}
            fuelType={ctx.fuelType}
            setFuelType={ctx.setFuelType}
            currentCountry={ctx.country}
            onOpenCountry={(c) => ctx.setCountryTracked(c)}
            currencyMode={ctx.effectiveCurrencyMode}
            fxRates={ctx.fxRates}
            rewardUnlocked={ctx.reward.unlocked}
            favorites={ctx.favorites}
          />
        ) : null}
      </ScrollView>

      <CountrySearchModal
        theme={ctx.theme}
        open={compareModalOpen}
        title={ctx.t.addCountry}
        placeholder={ctx.t.searchPlaceholder}
        closeLabel={ctx.t.close}
        selectedLabel={ctx.t.selected}
        countries={ctx.countries}
        value={""}
        favorites={ctx.favorites}
        onToggleFavorite={ctx.toggleFavorite}
        onClose={() => setCompareModalOpen(false)}
        onSelect={(c) => {
          ctx.addCompare(c);
          setCompareModalOpen(false);
        }}
      />
    </View>
  );
}
