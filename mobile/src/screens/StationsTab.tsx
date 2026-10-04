import React, { useCallback, useDeferredValue, useMemo, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Linking, RefreshControl, ScrollView, Text, TextInput, View, type ListRenderItem } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import { FREE_MAX_RADIUS_M, STATION_RADII_M, useApp } from "../context/AppContext";
import type { Station } from "../hooks/useNearbyStations";
import { useStationFavorites } from "../hooks/useStationFavorites";
import ScreenTitle from "../components/ui/ScreenTitle";
import AnimatedPressable from "../components/ui/AnimatedPressable";
import NextStopCard from "../components/stations/NextStopCard";
import StationRow from "../components/stations/StationRow";
import StationFiltersSheet from "../components/stations/StationFiltersSheet";
import { StationsSkeleton, StationsState } from "../components/stations/StationsStates";
import { makeStationStyles, stationsPalette } from "../components/stations/stations.styles";
import { formatStamp, searchKey, stationTitle } from "../components/stations/stationFormat";
import { openMaps } from "../utils/maps";
import { isTwoPaneStations, makeStationsTabStyles } from "./StationsTab.styles";

type Phase = "checking" | "permission" | "blocked" | "locating" | "locationError" | "loading" | "loadError" | "empty" | "ready";

export default function StationsTab() {
  const ctx = useApp();
  const { theme, t, lang, loc, nearby, reward } = ctx;
  const s = useMemo(() => makeStationStyles(theme), [theme]);
  const p = useMemo(() => stationsPalette(theme), [theme]);
  const layout = useMemo(() => makeStationsTabStyles(theme), [theme]);
  const reduce = theme.motion.reduced;
  const twoPane = isTwoPaneStations(theme);
  const { favoriteSet, toggleFavorite } = useStationFavorites();

  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [openOnly, setOpenOnly] = useState(false);
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [pulling, setPulling] = useState(false);

  // Listed hours are evaluated against the clock, so re-derive them whenever the tab is shown.
  const recheckHours = nearby.recheckHours;
  useFocusEffect(useCallback(() => recheckHours(), [recheckHours]));

  const km = Math.round(ctx.radiusM / 1000);
  const needle = searchKey(deferredQuery.trim());
  const isFiltering = !!needle || openOnly || favoriteOnly;
  const activeFilterCount = (openOnly ? 1 : 0) + (favoriteOnly ? 1 : 0);

  const filtered = useMemo(
    () =>
      nearby.stations.filter((st) => {
        if (openOnly && !(st.isOpen24Hours || st.isOpenNow === true)) return false;
        if (favoriteOnly && !favoriteSet.has(st.id)) return false;
        if (needle && !searchKey(`${st.name} ${st.brand ?? ""}`).includes(needle)) return false;
        return true;
      }),
    [nearby.stations, openOnly, favoriteOnly, favoriteSet, needle]
  );
  const nextStop = filtered[0] ?? null;
  const feed = useMemo(() => filtered.slice(1), [filtered]);

  // Stable handlers keep memoised rows from re-rendering on unrelated context changes (toasts, ads).
  const latest = useRef({ markMapsOpened: ctx.markMapsOpened, t });
  latest.current = { markMapsOpened: ctx.markMapsOpened, t };
  const onDirections = useCallback((st: Station) => {
    latest.current.markMapsOpened();
    openMaps(st.lat, st.lon, stationTitle(st, latest.current.t));
  }, []);

  const isLocked = useCallback((radiusM: number) => radiusM > FREE_MAX_RADIUS_M && !reward.unlocked, [reward.unlocked]);
  const selectRadius = (radiusM: number) => {
    if (isLocked(radiusM)) {
      setFiltersOpen(false);
      ctx.openRewardModal(() => ctx.setRadiusM(radiusM));
      return;
    }
    ctx.setRadiusM(radiusM);
  };

  const clearFilters = () => {
    setQuery("");
    setOpenOnly(false);
    setFavoriteOnly(false);
  };

  const busy = nearby.loading || loc.loading;
  const refreshStations = useCallback(async () => {
    if (loc.permission !== "granted") return;
    // Re-read the position first: a station finder should answer for where the driver is now.
    const moved = await loc.locate();
    if (!moved) await nearby.refresh();
  }, [loc.permission, loc.locate, nearby.refresh]);

  const onPull = useCallback(() => {
    setPulling(true);
    refreshStations().finally(() => setPulling(false));
  }, [refreshStations]);

  const hasStations = nearby.stations.length > 0;
  let phase: Phase;
  if (!loc.checked) phase = "checking";
  else if (loc.permission !== "granted") phase = loc.permission === "denied" && !loc.canAskAgain ? "blocked" : "permission";
  else if (!loc.coords) phase = loc.loading ? "locating" : "locationError";
  else if (hasStations) phase = "ready";
  else if (nearby.loading) phase = "loading";
  else if (nearby.error) phase = "loadError";
  else phase = nearby.cacheSavedAtUtc ? "empty" : "loading";

  const nextRadius = STATION_RADII_M.find((r) => r > ctx.radiusM) ?? null;
  const stamp = formatStamp(nearby.cacheSavedAtUtc, t);
  const refreshFailed = !!nearby.error && nearby.fromCache;

  // Home sections

  const refreshAction =
    loc.permission === "granted" && loc.coords ? (
      <AnimatedPressable
        onPress={refreshStations}
        disabled={busy}
        contentStyle={layout.headerAction}
        reduceMotion={reduce}
        accessibilityLabel={t.refresh}
        accessibilityState={{ busy }}
      >
        {busy ? <ActivityIndicator color={p.accent} /> : <Ionicons name="refresh" size={20} color={p.ink} />}
      </AnimatedPressable>
    ) : null;

  const statusLine =
    phase === "ready" ? (
      refreshFailed ? (
        <View style={s.statusCard} accessibilityLiveRegion="polite">
          <View style={s.statusIcon}>
            <Ionicons name="cloud-offline-outline" size={20} color={p.warn} />
          </View>
          <View style={s.statusCopy}>
            <Text style={s.statusTitle}>{t.showingCached}</Text>
            <Text style={s.statusPrimary}>{t.stationsWithin(nearby.totalCount, km)}</Text>
            <Text style={s.statusMeta}>
              {[stamp ? t.stationsSavedList(stamp) : null, nearby.error === "timeout" ? t.stationsTimeoutCached : t.refreshFailed]
                .filter(Boolean)
                .join(" · ")}
            </Text>
          </View>
          <AnimatedPressable
            onPress={refreshStations}
            disabled={busy}
            contentStyle={s.retryButton}
            haptic={false}
            reduceMotion={reduce}
            accessibilityLabel={t.tryAgain}
            accessibilityState={{ busy }}
          >
            {busy ? <ActivityIndicator size="small" color={p.accent} /> : <Ionicons name="refresh" size={17} color={p.accent} />}
            <Text style={s.retryText}>{t.tryAgain}</Text>
          </AnimatedPressable>
        </View>
      ) : (
        <View style={s.statusRow} accessibilityLiveRegion="polite">
          <View style={s.statusReadyIcon}><Ionicons name="checkmark" size={13} color={p.onAccent} /></View>
          <Text style={s.statusText}>
            {[t.stationsWithin(nearby.totalCount, km), stamp ? t.stationsUpdatedAt(stamp) : null].filter(Boolean).join(" · ")}
          </Text>
        </View>
      )
    ) : null;
  const controls =
    phase === "ready" ? (
      <View style={{ gap: 10 }}>
        <View style={s.controls}>
          <View style={s.search}>
            <Ionicons name="search" size={19} color={p.inkSoft} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={t.stationSearchPlaceholder}
              placeholderTextColor={p.inkSoft}
              style={s.searchInput}
              accessibilityLabel={t.searchStations}
              returnKeyType="search"
              autoCorrect={false}
              clearButtonMode="never"
            />
            {query ? (
              <AnimatedPressable onPress={() => setQuery("")} contentStyle={s.clearSearch} haptic={false} reduceMotion={reduce} accessibilityLabel={t.clearFilters}>
                <Ionicons name="close-circle" size={21} color={p.inkSoft} />
              </AnimatedPressable>
            ) : null}
          </View>
          <AnimatedPressable
            onPress={() => setFiltersOpen(true)}
            contentStyle={[s.filterButton, activeFilterCount ? s.filterButtonActive : null]}
            reduceMotion={reduce}
            accessibilityLabel={t.filtersA11y(activeFilterCount)}
          >
            <Ionicons name="options-outline" size={19} color={activeFilterCount ? p.accent : p.ink} />
            <Text style={s.filterText}>{t.filters}</Text>
            {activeFilterCount ? (
              <View style={s.badge}>
                <Text style={s.badgeText}>{activeFilterCount}</Text>
              </View>
            ) : null}
          </AnimatedPressable>
        </View>
        {activeFilterCount ? (
          <View style={s.activeFilters}>
            {openOnly ? activeChip("open", t.stationsNearbyOpenNow, () => setOpenOnly(false)) : null}
            {favoriteOnly ? activeChip("favorites", t.favoriteOnly, () => setFavoriteOnly(false)) : null}
          </View>
        ) : null}
      </View>
    ) : null;

  const stage = (() => {
    switch (phase) {
      case "checking":
        return <StationsSkeleton s={s} label={t.loading} />;
      case "locating":
        return <StationsSkeleton s={s} label={t.stationsNearbyGettingLocation} />;
      case "loading":
        return <StationsSkeleton s={s} label={t.stationsLookingWithin(km)} />;
      case "permission":
        return (
          <StationsState
            s={s}
            p={p}
            reduceMotion={reduce}
            icon="navigate-outline"
            title={t.locationPrimerTitle}
            body={t.locationPrimerBody}
            primary={{ label: t.allowLocation, icon: "locate-outline", onPress: loc.request, loading: loc.loading }}
          />
        );
      case "blocked":
        return (
          <StationsState
            s={s}
            p={p}
            reduceMotion={reduce}
            icon="location-outline"
            title={t.locationPermissionDenied}
            body={t.locationPermissionDeniedHint}
            primary={{ label: t.openSettings, icon: "settings-outline", onPress: () => Linking.openSettings().catch(() => {}) }}
          />
        );
      case "locationError":
        return (
          <StationsState
            s={s}
            p={p}
            reduceMotion={reduce}
            icon="warning-outline"
            title={t.locationUnavailable}
            body={t.locationUnavailableHint}
            primary={{ label: t.tryAgain, icon: "refresh", onPress: () => loc.locate(), loading: loc.loading }}
          />
        );
      case "loadError":
        return (
          <StationsState
            s={s}
            p={p}
            reduceMotion={reduce}
            icon="cloud-offline-outline"
            title={t.stationsLoadFailedTitle}
            body={t.stationsLoadError}
            primary={{ label: t.tryAgain, icon: "refresh", onPress: refreshStations, loading: busy }}
          />
        );
      case "empty":
        return (
          <StationsState
            s={s}
            p={p}
            reduceMotion={reduce}
            icon="map-outline"
            title={t.noStationsWithin(km)}
            body={t.stationsTryWiderRadius}
            primary={
              nextRadius
                ? {
                    label: t.searchWithinKm(nextRadius / 1000),
                    icon: isLocked(nextRadius) ? "lock-closed-outline" : "expand-outline",
                    onPress: () => selectRadius(nextRadius),
                  }
                : undefined
            }
            secondary={{ label: t.refresh, icon: "refresh", onPress: refreshStations }}
          />
        );
      case "ready":
        return nextStop ? (
          <NextStopCard
            station={nextStop}
            isMatch={isFiltering}
            favorite={favoriteSet.has(nextStop.id)}
            s={s}
            p={p}
            t={t}
            lang={lang}
            reduceMotion={reduce}
            stacked={theme.m.isXLText}
            onDirections={onDirections}
            onToggleFavorite={toggleFavorite}
          />
        ) : (
          <StationsState
            s={s}
            p={p}
            reduceMotion={reduce}
            icon="search-outline"
            title={t.noStationMatches}
            body={openOnly ? t.openNowFilterDetail : favoriteOnly ? t.favoriteFilterDetail : undefined}
            primary={{ label: t.clearFilters, icon: "close-circle-outline", onPress: clearFilters }}
          />
        );
    }
  })();

  const feedHeader =
    phase === "ready" && feed.length ? (
      <View style={s.feedHeader}>
        <Text style={s.feedKicker} accessibilityRole="header">{t.otherStations}</Text>
        {isFiltering ? (
          <Text style={s.feedCount} accessibilityLiveRegion="polite">{t.stationsMatches(filtered.length)}</Text>
        ) : null}
      </View>
    ) : null;

  const note =
    phase === "ready" ? (
      <View style={s.note}>
        <Ionicons name="information-circle-outline" size={16} color={p.inkSoft} />
        <Text style={s.noteText}>{t.stationsSourceNote}</Text>
      </View>
    ) : null;

  const renderItem: ListRenderItem<Station> = useCallback(
    ({ item }) => (
      <StationRow
        station={item}
        favorite={favoriteSet.has(item.id)}
        s={s}
        p={p}
        t={t}
        lang={lang}
        reduceMotion={reduce}
        compactName={!theme.m.isLargeText}
        onDirections={onDirections}
        onToggleFavorite={toggleFavorite}
      />
    ),
    [favoriteSet, s, p, t, lang, reduce, theme.m.isLargeText, onDirections, toggleFavorite]
  );
  const Separator = useCallback(() => <View style={s.separator} />, [s]);

  const refreshControl =
    loc.permission === "granted" ? (
      <RefreshControl refreshing={pulling} onRefresh={onPull} tintColor={p.accent} colors={[p.accent]} />
    ) : undefined;

  const sheet = (
    <StationFiltersSheet
      theme={theme}
      t={t}
      s={s}
      p={p}
      open={filtersOpen}
      openOnly={openOnly}
      favoriteOnly={favoriteOnly}
      radiusM={ctx.radiusM}
      radii={STATION_RADII_M}
      isLocked={isLocked}
      onToggleOpenOnly={() => setOpenOnly((v) => !v)}
      onToggleFavoriteOnly={() => setFavoriteOnly((v) => !v)}
      onSelectRadius={selectRadius}
      onClear={() => {
        setOpenOnly(false);
        setFavoriteOnly(false);
      }}
      onClose={() => setFiltersOpen(false)}
    />
  );

  const list = (listHeader: React.ReactElement | null, contentStyle: object, footer: React.ReactElement | null) => (
    <FlatList
      data={phase === "ready" ? feed : []}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ItemSeparatorComponent={Separator}
      ListHeaderComponent={listHeader}
      ListFooterComponent={footer}
      contentContainerStyle={contentStyle}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      initialNumToRender={8}
      windowSize={9}
      refreshControl={refreshControl}
    />
  );

  if (twoPane) {
    return (
      <View style={layout.screen}>
        <View style={layout.panes}>
          <ScrollView
            style={layout.sidePane}
            contentContainerStyle={layout.sideContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            refreshControl={refreshControl}
          >
            <ScreenTitle theme={theme} title={t.stationsNearbyTitle} action={refreshAction} />
            {statusLine}
            {controls}
            {stage}
            {note}
          </ScrollView>
          <View style={layout.feedPane}>{list(feedHeader, layout.feedContent, null)}</View>
        </View>
        {sheet}
      </View>
    );
  }

  return (
    <View style={layout.screen}>
      {list(
        <View style={layout.header}>
          <ScreenTitle theme={theme} title={t.stationsNearbyTitle} action={refreshAction} />
          {statusLine}
          {controls}
          {stage}
          {feedHeader}
        </View>,
        layout.listContent,
        note
      )}
      {sheet}
    </View>
  );

  function activeChip(key: string, label: string, onRemove: () => void) {
    return (
      <AnimatedPressable key={key} onPress={onRemove} contentStyle={s.activeChip} reduceMotion={reduce} accessibilityLabel={t.removeFilterA11y(label)}>
        <Text style={s.activeChipText}>{label}</Text>
        <Ionicons name="close" size={17} color={p.accent} />
      </AnimatedPressable>
    );
  }
}

const keyExtractor = (item: Station) => item.id;
