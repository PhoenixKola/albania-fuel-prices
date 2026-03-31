import React, { useMemo } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useApp } from "../context/AppContext";
import StationsCard from "../components/stations/StationsCard";
import { makeScreenHeaderStyles } from "./screenHeader.styles";

export default function StationsTab() {
  const ctx = useApp();
  const hs = useMemo(() => makeScreenHeaderStyles(ctx.theme), [ctx.theme]);

  return (
    <View style={{ flex: 1, backgroundColor: ctx.theme.colors.bg }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 12 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={ctx.nearby.loading}
            onRefresh={() => ctx.nearby.refresh?.()}
          />
        }
      >
        <View style={hs.header}>
          <View style={hs.iconWrap}>
            <Ionicons name="navigate-outline" size={18} color={ctx.theme.colors.primary} />
          </View>
          <View>
            <Text style={hs.title}>{ctx.t.stationsNearbyTitle}</Text>
            <Text style={hs.subtitle}>
              {ctx.nearby.stations.length > 0
                ? ctx.t.stationsNearbyFound(ctx.nearby.stations.length)
                : ctx.t.stationsNearbyTitle}
            </Text>
          </View>
        </View>

        <StationsCard
          theme={ctx.theme}
          t={ctx.t}
          permission={ctx.loc.permission}
          locating={ctx.loc.loading}
          onRequestLocation={ctx.loc.request}
          stations={ctx.nearby.stations}
          totalCount={ctx.nearby.totalCount}
          loading={ctx.nearby.loading}
          error={ctx.nearby.error}
          onRefresh={ctx.nearby.refresh}
          fromCache={ctx.nearby.fromCache}
          radiusM={ctx.radiusM}
          setRadiusM={ctx.setRadiusM}
          onOpenExternalMap={ctx.markMapsOpened}
          rewardUnlocked={ctx.reward.unlocked}
          onShowAllPress={(proceed) => {
            proceed();
          }}
          onRadiusPress={() => {
            ctx.rate.track("stations_use");
            if (!ctx.canAskReward) return;
            ctx.openRewardModal();
          }}
        />
      </ScrollView>
    </View>
  );
}
