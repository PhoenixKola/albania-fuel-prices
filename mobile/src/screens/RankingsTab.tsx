import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, RefreshControl, ScrollView, Text, View, type ListRenderItem } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useApp } from "../context/AppContext";
import type { FuelType } from "../types/fuel";
import { useRankingsModel, type LadderItem, type RankOrder, type RankRow, type RankScope } from "../hooks/useRankingsModel";
import { formatShortDate } from "../hooks/useHomeMarket";
import { fuelLabel } from "../utils/fuel";
import { getFlagForCountry } from "../utils/countryFlag";
import ScreenTitle from "../components/ui/ScreenTitle";
import SegmentedControl from "../components/ui/SegmentedControl";
import AnimatedPressable from "../components/ui/AnimatedPressable";
import CountrySearchModal from "../components/country/CountrySearchModal";
import PositionPanel from "../components/rankings/PositionPanel";
import LadderRow, { AverageRung } from "../components/rankings/LadderRow";
import RankActionsSheet from "../components/rankings/RankActionsSheet";
import { makeRankingStyles, rankingsPalette } from "../components/rankings/rankings.styles";
import { isTwoPaneRankings, makeRankingsTabStyles } from "./RankingsTab.styles";

export default function RankingsTab() {
  const ctx = useApp();
  const { theme, t, reward } = ctx;
  const s = useMemo(() => makeRankingStyles(theme), [theme]);
  const p = useMemo(() => rankingsPalette(theme), [theme]);
  const layout = useMemo(() => makeRankingsTabStyles(theme), [theme]);
  const reduce = theme.motion.reduced;

  const [scope, setScope] = useState<RankScope>("europe");
  const [order, setOrder] = useState<RankOrder>("cheapest");
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [sheetRow, setSheetRow] = useState<RankRow | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const listRef = useRef<FlatList<LadderItem>>(null);

  const model = useRankingsModel(scope, order);
  const fuelName = fuelLabel(ctx.fuelType, t);
  const expensiveLocked = !reward.unlocked;

  // Most-expensive order is a rewarded view: when the unlock lapses, fall back to cheapest first.
  useEffect(() => {
    if (reward.hydrated && !reward.unlocked && order === "expensive") setOrder("cheapest");
  }, [reward.hydrated, reward.unlocked, order]);

  const fuelItems = useMemo(
    () => [
      { value: "diesel" as FuelType, label: t.diesel },
      { value: "gasoline95" as FuelType, label: t.gasoline95 },
      { value: "lpg" as FuelType, label: t.lpg },
    ],
    [t]
  );

  const toggleOrder = () => {
    if (order === "cheapest" && expensiveLocked) {
      ctx.openRewardModal(() => setOrder("expensive"));
      return;
    }
    setOrder((o) => (o === "cheapest" ? "expensive" : "cheapest"));
  };

  const displayPos = useMemo(() => {
    const map = new Map<string, number>();
    let i = 0;
    for (const it of model.items) if (it.kind === "row") map.set(it.row.country, i++);
    return map;
  }, [model.items]);

  const openRow = useCallback((row: RankRow) => {
    setSheetRow(row);
    setSheetOpen(true);
  }, []);

  const jumpToMine = () => {
    if (model.selectedIndex < 0) return;
    listRef.current?.scrollToIndex({ index: model.selectedIndex, viewPosition: 0.3, animated: !reduce });
  };

  const insufficientFavorites = scope === "favorites" && model.total < 2;
  const endTag = order === "cheapest" ? t.cheapestShort : t.dearestShort;

  const renderItem: ListRenderItem<LadderItem> = useCallback(
    ({ item }) => {
      if (item.kind === "average") return <AverageRung s={s} label={t.europeAverageIs(model.fmt(item.eur))} />;
      const pos = displayPos.get(item.row.country) ?? 99;
      return (
        <LadderRow
          row={item.row}
          total={model.total}
          mine={item.row.country === ctx.country}
          favorite={model.favoriteSet.has(item.row.country)}
          top={pos < 3}
          endTag={pos === 0 && model.total > 1 ? endTag : null}
          s={s}
          p={p}
          t={t}
          reduceMotion={reduce}
          fmt={model.fmt}
          fmtSigned={model.fmtSigned}
          onPress={openRow}
        />
      );
    },
    [s, p, t, reduce, model.fmt, model.fmtSigned, model.total, model.favoriteSet, displayPos, ctx.country, endTag, openRow]
  );

  // ── Blocks ────────────────────────────────────────────────────────────────

  const status = ctx.data ? (
    <View style={s.statusRow}>
      <View style={[s.dot, { backgroundColor: ctx.error ? p.warn : p.accent }]} />
      <Text style={s.statusText}>{[t.pricesOf(formatShortDate(ctx.data.as_of, t)), ctx.error ? t.refreshFailed : null].filter(Boolean).join(" · ")}</Text>
      {ctx.error ? (
        <AnimatedPressable onPress={ctx.refreshAll} contentStyle={s.retry} haptic={false} reduceMotion={reduce} accessibilityLabel={t.tryAgain}>
          <Text style={s.retryText}>{t.tryAgain}</Text>
        </AnimatedPressable>
      ) : null}
    </View>
  ) : null;

  const controls = ctx.data ? (
    <>
      <SegmentedControl theme={theme} value={ctx.fuelType} items={fuelItems} onChange={ctx.setFuelType} accessibilityLabel={t.selectFuel} />
      <View style={s.viewRow}>
        <View style={s.scopeGroup} accessibilityRole="radiogroup" accessibilityLabel={t.scopeLabel}>
          {(["europe", "favorites"] as const).map((value) => {
            const active = scope === value;
            return (
              <AnimatedPressable
                key={value}
                onPress={() => setScope(value)}
                contentStyle={[s.chip, active ? s.chipActive : null]}
                reduceMotion={reduce}
                accessibilityRole="radio"
                accessibilityState={{ checked: active }}
                accessibilityLabel={value === "europe" ? t.scopeEurope : t.favorites}
              >
                <Ionicons name={value === "europe" ? "globe-outline" : "star-outline"} size={17} color={active ? p.accent : p.inkSoft} />
                <Text style={[s.chipText, active ? s.chipTextActive : null]}>{value === "europe" ? t.scopeEurope : t.favorites}</Text>
              </AnimatedPressable>
            );
          })}
        </View>
        <AnimatedPressable
          onPress={toggleOrder}
          contentStyle={s.orderButton}
          reduceMotion={reduce}
          accessibilityLabel={`${order === "cheapest" ? t.orderCheapestFirst : t.orderExpensiveFirst}${order === "cheapest" && expensiveLocked ? `. ${t.locked}` : ""}`}
          accessibilityHint={order === "cheapest" && expensiveLocked ? t.orderLockedHint : t.orderSwitchHint}
        >
          <Ionicons name={order === "cheapest" ? "arrow-down" : "arrow-up"} size={18} color={p.ink} />
          <Text style={s.orderText}>{order === "cheapest" ? t.orderCheapestFirst : t.orderExpensiveFirst}</Text>
          <Ionicons name={order === "cheapest" && expensiveLocked ? "lock-closed-outline" : "swap-vertical"} size={17} color={p.inkSoft} />
        </AnimatedPressable>
      </View>
      {order === "cheapest" && expensiveLocked ? <Text style={s.lockNote}>{t.orderLockedHint}</Text> : null}
    </>
  ) : null;

  const stage = !ctx.data ? (
    ctx.loading ? (
      <View style={s.deck} accessible accessibilityRole="progressbar" accessibilityLabel={t.loadingPrices}>
        <View style={[s.module, s.skeletonModule]}>
          <View style={[s.skeletonBar, { width: "40%" }]} />
          <View style={[s.skeletonBar, { width: "60%", height: 22 }]} />
          <View style={[s.skeletonBar, { width: "30%", height: 40 }]} />
        </View>
      </View>
    ) : (
      <View style={s.state}>
        <View style={s.stateIcon}><Ionicons name="cloud-offline-outline" size={26} color={p.accent} /></View>
        <Text style={s.stateTitle} accessibilityRole="header">{t.couldntLoad}</Text>
        <Text style={s.stateBody}>{t.dataUnavailable}</Text>
        <AnimatedPressable onPress={ctx.refreshAll} contentStyle={s.primaryButton} reduceMotion={reduce} accessibilityLabel={t.tryAgain}>
          <Ionicons name="refresh" size={19} color={p.onAccent} />
          <Text style={s.primaryText}>{t.tryAgain}</Text>
        </AnimatedPressable>
      </View>
    )
  ) : insufficientFavorites ? (
    <View style={s.state}>
      <View style={s.stateIcon}><Ionicons name="star-outline" size={26} color={p.accent} /></View>
      <Text style={s.stateTitle} accessibilityRole="header">{t.rankingsFavoritesTitle}</Text>
      <Text style={s.stateBody}>{t.addFavoritesToUseFavoritesRanking}</Text>
      <AnimatedPressable onPress={() => setFavoritesOpen(true)} contentStyle={s.primaryButton} reduceMotion={reduce} accessibilityLabel={t.manageFavorites}>
        <Ionicons name="star" size={19} color={p.onAccent} />
        <Text style={s.primaryText}>{t.manageFavorites}</Text>
      </AnimatedPressable>
    </View>
  ) : (
    <PositionPanel
      s={s}
      p={p}
      t={t}
      reduceMotion={reduce}
      scope={scope}
      fuelName={fuelName}
      country={ctx.country}
      flag={getFlagForCountry(ctx.country)}
      selected={model.selected}
      hasPrice={model.selectedHasPrice}
      inScope={model.selectedInScope}
      rows={model.rows}
      total={model.total}
      average={model.average}
      fmt={model.fmt}
      canJump={model.selectedIndex >= 0}
      onJump={jumpToMine}
      onAddFavorite={() => ctx.toggleFavorite(ctx.country)}
    />
  );

  const ladderHeader =
    ctx.data && !insufficientFavorites && model.total ? (
      <View style={s.ladderHeader}>
        <Text style={s.ladderTitle} accessibilityRole="header">{scope === "europe" ? t.ladderEurope : t.ladderFavorites}</Text>
        <Text style={s.ladderCount}>
          {`${t.marketsInScope(model.total)} · ${order === "cheapest" ? t.orderCheapestFirst : t.orderExpensiveFirst}`}
        </Text>
      </View>
    ) : null;

  const refreshControl = <RefreshControl refreshing={ctx.refreshing} onRefresh={ctx.refreshAll} tintColor={p.accent} colors={[p.accent]} />;

  const list = (header: React.ReactElement | null, contentStyle: object) => (
    <FlatList
      ref={listRef}
      data={ctx.data && !insufficientFavorites ? model.items : []}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListHeaderComponent={header}
      contentContainerStyle={contentStyle}
      showsVerticalScrollIndicator={false}
      initialNumToRender={14}
      windowSize={11}
      refreshControl={refreshControl}
      onScrollToIndexFailed={(info) => {
        // Rows have variable heights; land near the target, then retry once it has been measured.
        listRef.current?.scrollToOffset({ offset: info.averageItemLength * info.index, animated: false });
        setTimeout(() => listRef.current?.scrollToIndex({ index: info.index, viewPosition: 0.3, animated: !reduce }), 120);
      }}
    />
  );

  const selectedScopeCaption = scope === "europe" ? t.rankOfEurope(model.total) : t.rankOfFavorites(model.total);
  const overlays = (
    <>
      <RankActionsSheet
        theme={theme}
        t={t}
        s={s}
        p={p}
        row={sheetRow}
        open={sheetOpen}
        subtitle={sheetRow ? `#${sheetRow.rank} ${selectedScopeCaption} · ${model.fmt(sheetRow.eur)}/L` : ""}
        isMine={!!sheetRow && sheetRow.country === ctx.country}
        isFavorite={!!sheetRow && model.favoriteSet.has(sheetRow.country)}
        inCompare={!!sheetRow && ctx.compareCountries.includes(sheetRow.country)}
        compareFull={ctx.compareCountries.length >= ctx.maxCompare}
        compareFullDetail={t.allSlotsUsed(ctx.maxCompare)}
        onSetMine={(c) => {
          ctx.setCountryTracked(c);
          ctx.showToast(t.marketSet(c));
          setSheetOpen(false);
        }}
        onAddCompare={(c) => {
          ctx.addCompare(c);
          ctx.showToast(t.addedToCompare(c));
          setSheetOpen(false);
        }}
        onToggleFavorite={(c) => {
          ctx.toggleFavorite(c);
          setSheetOpen(false);
        }}
        onClose={() => setSheetOpen(false)}
      />
      <CountrySearchModal
        theme={theme}
        open={favoritesOpen}
        title={t.manageFavorites}
        placeholder={t.searchPlaceholder}
        closeLabel={t.close}
        selectedLabel={t.selected}
        saveLabel={t.saveMarketA11y}
        unsaveLabel={t.unsaveMarketA11y}
        countries={ctx.countries}
        value=""
        favorites={ctx.favorites}
        onToggleFavorite={ctx.toggleFavorite}
        emptyLabel={t.noCountryResults}
        onClose={() => setFavoritesOpen(false)}
        onSelect={ctx.toggleFavorite}
      />
    </>
  );

  if (isTwoPaneRankings(theme) && ctx.data) {
    return (
      <View style={layout.screen}>
        <View style={layout.panes}>
          <ScrollView style={layout.sidePane} contentContainerStyle={layout.sideContent} showsVerticalScrollIndicator={false} refreshControl={refreshControl}>
            <ScreenTitle theme={theme} title={t.rankingsTitle} />
            {status}
            {controls}
            {stage}
          </ScrollView>
          <View style={layout.feedPane}>{list(ladderHeader, layout.feedContent)}</View>
        </View>
        {overlays}
      </View>
    );
  }

  return (
    <View style={layout.screen}>
      {list(
        <View style={layout.header}>
          <ScreenTitle theme={theme} title={t.rankingsTitle} />
          {status}
          {controls}
          {stage}
          {ladderHeader}
        </View>,
        layout.listContent
      )}
      {overlays}
    </View>
  );
}

const keyExtractor = (item: LadderItem) => (item.kind === "row" ? item.row.country : "europe-average");
