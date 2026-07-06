import React, { useMemo, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useApp } from "../context/AppContext";
import CompareCard from "../components/fuel/CompareCard";
import CountrySearchModal from "../components/country/CountrySearchModal";
import { makeScreenHeaderStyles } from "./screenHeader.styles";

export default function CompareTab() {
  const ctx = useApp();
  const hs = useMemo(() => makeScreenHeaderStyles(ctx.theme), [ctx.theme]);

  const [compareModalOpen, setCompareModalOpen] = useState(false);

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
            <Text style={hs.title}>{ctx.t.compareTitle}</Text>
            <Text style={hs.subtitle}>{ctx.t.compareSubtitle(ctx.t[ctx.fuelType] ?? ctx.fuelType)}</Text>
          </View>
        </View>

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
