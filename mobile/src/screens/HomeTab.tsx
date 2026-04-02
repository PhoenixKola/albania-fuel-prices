import React, { useMemo, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";

import { useApp } from "../context/AppContext";
import { makeHomeStyles } from "./HomeScreen.styles";

import TopBar from "../components/layout/TopBar";
import QuickSwitchCard from "../components/layout/QuickSwitchCard";
import FuelCard from "../components/fuel/FuelCard";
import ErrorCard from "../components/feedback/ErrorCard";
import CountrySearchModal from "../components/country/CountrySearchModal";
import FeedbackCurrencyBar from "../components/layout/FeedbackCurrencyBar";

export default function HomeTab() {
  const ctx = useApp();
  const s = useMemo(() => makeHomeStyles(ctx.theme), [ctx.theme]);

  const [countryModalOpen, setCountryModalOpen] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: ctx.theme.colors.bg }}>
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={ctx.refreshing} onRefresh={ctx.refreshAll} />}
      >
        <TopBar
          theme={ctx.theme}
          title={ctx.t.title}
          subtitle={ctx.data ? ctx.t.subtitleAsOf(ctx.data.as_of) : ctx.t.subtitleLoading}
          t={ctx.t}
          rewardEnabled={ctx.reward.unlocked}
        />

        <FeedbackCurrencyBar
          theme={ctx.theme}
          t={ctx.t}
          onFeedbackPress={ctx.openFeedback}
          onUnlockPress={() => ctx.openRewardModal()}
          unlockDisabled={!ctx.canAskReward || ctx.reward.unlocked}
          rewardUnlocked={ctx.reward.unlocked}
          headerBtnStyle={s.headerBtn}
          headerBtnTextStyle={s.headerBtnText}
        />

        <QuickSwitchCard
          theme={ctx.theme}
          t={ctx.t}
          favorites={ctx.favorites}
          currentCountry={ctx.country}
          onEdit={() => setCountryModalOpen(true)}
          onSelect={(c: any) => ctx.setCountryTracked(c)}
        />

        {ctx.error ? (
          <ErrorCard theme={ctx.theme} title={ctx.t.couldntLoad} message={ctx.error} cta={ctx.t.tryAgain} onPress={ctx.refreshAll} />
        ) : null}

        <FuelCard
          theme={ctx.theme}
          t={ctx.t}
          data={ctx.data}
          selected={ctx.selected}
          prevSelected={ctx.prevSelected}
          loading={ctx.loading}
          country={ctx.country}
          fuelType={ctx.fuelType}
          currencyMode={ctx.effectiveCurrencyMode}
          setCurrencyMode={ctx.setCurrencyMode}
          fxRates={ctx.fxRates}
          isFromCache={ctx.isFromCache}
          cacheSavedAtUtc={ctx.cacheSavedAtUtc}
          refreshing={ctx.refreshing}
          onRefresh={ctx.refreshAll}
          onOpenCountrySearch={() => setCountryModalOpen(true)}
        />
      </ScrollView>

      <CountrySearchModal
        theme={ctx.theme}
        open={countryModalOpen}
        title={ctx.t.changeCountry}
        placeholder={ctx.t.searchPlaceholder}
        closeLabel={ctx.t.close}
        selectedLabel={ctx.t.selected}
        countries={ctx.countries}
        value={ctx.country}
        favorites={ctx.favorites}
        onToggleFavorite={ctx.toggleFavorite}
        onClose={() => setCountryModalOpen(false)}
        onSelect={(c) => {
          ctx.setCountryTracked(c);
          setCountryModalOpen(false);
        }}
      />
    </View>
  );
}
