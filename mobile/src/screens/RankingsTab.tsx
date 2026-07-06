import React, { useMemo } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useApp } from "../context/AppContext";
import RankingCard from "../components/fuel/RankingCard";
import { makeScreenHeaderStyles } from "./screenHeader.styles";

export default function RankingsTab() {
  const ctx = useApp();
  const hs = useMemo(() => makeScreenHeaderStyles(ctx.theme), [ctx.theme]);

  return (
    <View style={{ flex: 1, backgroundColor: ctx.theme.colors.bg }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 12 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={ctx.refreshing} onRefresh={ctx.refreshAll} />}
      >
        <View style={hs.header}>
          <View style={hs.iconWrap}>
            <Ionicons name="podium-outline" size={18} color={ctx.theme.colors.primary} />
          </View>
          <View>
            <Text style={hs.title}>{ctx.t.rankingsTitle}</Text>
            <Text style={hs.subtitle}>{ctx.t.rankingsSubtitle(ctx.t[ctx.fuelType] ?? ctx.fuelType)}</Text>
          </View>
        </View>

        <RankingCard
          theme={ctx.theme}
          t={ctx.t}
          data={ctx.data}
          trends={ctx.trends}
          fuelType={ctx.fuelType}
          setFuelType={ctx.setFuelType}
          currentCountry={ctx.country}
          onOpenCountry={(c) => ctx.setCountryTracked(c)}
          currencyMode={ctx.effectiveCurrencyMode}
          fxRates={ctx.fxRates}
          rewardUnlocked={ctx.reward.unlocked}
          favorites={ctx.favorites}
        />
      </ScrollView>
    </View>
  );
}
