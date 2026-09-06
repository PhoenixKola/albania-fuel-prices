import React, { useMemo, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";

import { useApp } from "../context/AppContext";
import { contentContainer } from "../theme/layout";
import CompareCard from "../components/fuel/CompareCard";
import CountrySearchModal from "../components/country/CountrySearchModal";
import PremiumHeader from "../components/ui/PremiumHeader";
import SegmentedControl from "../components/ui/SegmentedControl";

export default function CompareTab() {
  const ctx = useApp();
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const fuelItems = useMemo(() => [
    { value: "diesel" as const, label: ctx.t.diesel },
    { value: "gasoline95" as const, label: ctx.t.gasoline95 },
    { value: "lpg" as const, label: ctx.t.lpg },
  ], [ctx.t]);

  return (
    <View style={{ flex: 1, backgroundColor: ctx.theme.colors.bg }}>
      <ScrollView
        contentContainerStyle={contentContainer(ctx.theme)}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={ctx.refreshing} onRefresh={ctx.refreshAll} />}
      >
        <PremiumHeader
          theme={ctx.theme}
          eyebrow={ctx.t.premiumInsights}
          title={ctx.t.compareTitle}
          subtitle={ctx.t.compareSubtitle(ctx.t[ctx.fuelType] ?? ctx.fuelType)}
          icon="git-compare-outline"
        />

        <SegmentedControl theme={ctx.theme} value={ctx.fuelType} items={fuelItems} onChange={ctx.setFuelType} />

        <CompareCard
          theme={ctx.theme}
          t={ctx.t}
          data={ctx.data}
          trends={ctx.trends}
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
          onUnlockPress={() => ctx.openRewardModal()}
        />
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
