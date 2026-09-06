import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Linking, RefreshControl, Text, TextInput, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import { useApp } from "../context/AppContext";
import type { Station } from "../hooks/useNearbyStations";
import PremiumHeader from "../components/ui/PremiumHeader";
import BottomSheet from "../components/ui/BottomSheet";
import AnimatedPressable from "../components/ui/AnimatedPressable";
import { openMaps } from "../utils/maps";
import { makeStationsTabStyles } from "./StationsTab.styles";

const FAVORITES_KEY = "stations_favorites_v1";

function parseFavorites(raw: string | null) {
  if (!raw) return [];
  try {
    const value = JSON.parse(raw);
    return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export default function StationsTab() {
  const ctx = useApp();
  const s = useMemo(() => makeStationsTabStyles(ctx.theme), [ctx.theme]);
  const [query, setQuery] = useState("");
  const [openOnly, setOpenOnly] = useState(false);
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [radiusOpen, setRadiusOpen] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(FAVORITES_KEY).then((raw) => setFavoriteIds(parseFavorites(raw))).catch(() => {});
  }, []);

  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);
  const nearest = ctx.nearby.stations[0] ?? null;
  const openCount = useMemo(
    () => ctx.nearby.stations.filter((station) => station.isOpen24Hours || station.isOpenNow === true).length,
    [ctx.nearby.stations]
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return [...ctx.nearby.stations]
      .filter((station) => !needle || `${station.name} ${station.brand ?? ""}`.toLocaleLowerCase().includes(needle))
      .filter((station) => !openOnly || station.isOpen24Hours || station.isOpenNow === true)
      .filter((station) => !favoriteOnly || favoriteSet.has(station.id))
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [ctx.nearby.stations, query, openOnly, favoriteOnly, favoriteSet]);

  const toggleFavorite = async (id: string) => {
    const next = favoriteSet.has(id) ? favoriteIds.filter((item) => item !== id) : [id, ...favoriteIds];
    setFavoriteIds(next);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  };

  const clearFilters = () => {
    setQuery("");
    setOpenOnly(false);
    setFavoriteOnly(false);
  };

  const hasFilters = !!query.trim() || openOnly || favoriteOnly;
  const freshness = ctx.nearby.cacheSavedAtUtc
    ? `${ctx.t.lastUpdated} ${new Date(ctx.nearby.cacheSavedAtUtc).toLocaleString(ctx.lang === "sq" ? "sq-AL" : "en-US")}`
    : null;
  const stationStatusLabel = ctx.loc.permission !== "granted"
    ? ctx.t.stationsNearbyNeedLocation
    : ctx.loc.loading && !ctx.loc.coords
      ? ctx.t.stationsNearbyGettingLocation
      : ctx.nearby.fromCache
        ? ctx.t.stationsNearbyCached
        : ctx.t.liveData;
  const stationStatusColor = ctx.loc.permission !== "granted" || !ctx.loc.coords
    ? ctx.theme.colors.muted
    : ctx.nearby.fromCache ? ctx.theme.colors.warning : ctx.theme.colors.success;

  const header = (
    <View style={s.headerContent}>
      <PremiumHeader
        theme={ctx.theme}
        eyebrow={ctx.t.premiumInsights}
        title={ctx.t.stationsNearbyTitle}
        subtitle={ctx.loc.permission === "granted" ? ctx.t.withinRadius(Math.round(ctx.radiusM / 1000)) : ctx.t.stationsNearbyNeedLocation}
        icon="navigate-outline"
        action={
          <AnimatedPressable
            onPress={() => ctx.nearby.refresh?.()}
            disabled={ctx.nearby.loading || ctx.loc.permission !== "granted"}
            contentStyle={s.headerAction}
            reduceMotion={ctx.theme.motion.reduced}
            accessibilityLabel={ctx.t.refresh}
          >
            {ctx.nearby.loading ? <ActivityIndicator color={ctx.theme.colors.primary} /> : <Ionicons name="refresh" size={20} color={ctx.theme.colors.primary} />}
          </AnimatedPressable>
        }
      />

      <View style={s.hero} accessible accessibilityLabel={ctx.loc.permission === "granted" ? `${ctx.nearby.totalCount} ${ctx.t.stationsTitle}. ${openCount} ${ctx.t.openNowOnly}.` : ctx.t.stationsNearbyNeedLocation}>
        <View style={s.heroCopy}>
          <Text style={s.heroKicker}>{ctx.t.locationAccess}</Text>
          <Text style={s.heroTitle} numberOfLines={2}>
            {ctx.loc.permission === "granted" ? ctx.t.stationsNearbyFound(ctx.nearby.totalCount) : ctx.t.stationsNearbyUseMyLocation}
          </Text>
          <View style={s.statusRow}>
            <View style={[s.statusDot, { backgroundColor: stationStatusColor }]} />
            <Text style={s.statusText} numberOfLines={2}>
              {stationStatusLabel}{ctx.loc.coords && freshness ? ` · ${freshness}` : ""}
            </Text>
          </View>
        </View>
        <View style={s.heroMark} accessibilityElementsHidden>
          <Ionicons name="location" size={34} color={ctx.theme.colors.primary} />
        </View>
      </View>

      <View style={s.metrics}>
        <Metric label={ctx.t.nearest} value={nearest ? `${nearest.distanceKm.toFixed(1)} km` : "—"} />
        <Metric label={ctx.t.openNowOnly} value={openCount ? String(openCount) : "—"} />
        <Metric label={ctx.t.radius} value={`${Math.round(ctx.radiusM / 1000)} km`} />
      </View>

      {ctx.loc.permission === "granted" ? (
        <>
          <View style={s.searchWrap}>
            <Ionicons name="search" size={19} color={ctx.theme.colors.muted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={ctx.t.stationSearchPlaceholder}
              placeholderTextColor={ctx.theme.colors.muted}
              style={s.searchInput}
              accessibilityLabel={ctx.t.searchStations}
              returnKeyType="search"
            />
            {query ? (
              <AnimatedPressable onPress={() => setQuery("")} contentStyle={s.clearSearch} accessibilityLabel={ctx.t.clearFilters}>
                <Ionicons name="close-circle" size={20} color={ctx.theme.colors.muted} />
              </AnimatedPressable>
            ) : null}
          </View>

          <View style={s.filterRow}>
            <FilterChip label={ctx.t.openNowOnly} icon="time-outline" active={openOnly} onPress={() => setOpenOnly((value) => !value)} />
            <FilterChip label={ctx.t.favoriteOnly} icon="star-outline" active={favoriteOnly} onPress={() => setFavoriteOnly((value) => !value)} />
            <FilterChip label={`${Math.round(ctx.radiusM / 1000)} km`} icon="options-outline" active={radiusOpen} onPress={() => setRadiusOpen(true)} />
          </View>

          <View style={s.resultHeader}>
            <View>
              <Text style={s.resultTitle}>{ctx.t.allStations}</Text>
              <Text style={s.resultSub}>{ctx.t.stationsNearbyShowing(filtered.length, ctx.nearby.totalCount)}</Text>
            </View>
            {hasFilters ? (
              <AnimatedPressable onPress={clearFilters} contentStyle={s.textButton} accessibilityLabel={ctx.t.clearFilters}>
                <Text style={s.textButtonLabel}>{ctx.t.clearFilters}</Text>
              </AnimatedPressable>
            ) : null}
          </View>
        </>
      ) : null}
    </View>
  );

  return (
    <View style={s.screen}>
      <FlatList
        data={ctx.loc.permission === "granted" ? filtered : []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <StationRow station={item} favorite={favoriteSet.has(item.id)} onFavorite={() => toggleFavorite(item.id)} />}
        ItemSeparatorComponent={() => <View style={{ height: ctx.theme.m.s(10) }} />}
        ListHeaderComponent={header}
        ListEmptyComponent={
          ctx.loc.permission === "denied" ? (
            <StateCard icon="location-outline" title={ctx.t.locationPermissionDenied} message={ctx.t.locationPermissionDeniedHint} action={ctx.t.openSettings} onPress={() => Linking.openSettings()} />
          ) : ctx.loc.permission !== "granted" ? (
            <StateCard icon="locate-outline" title={ctx.t.stationsNearbyUseMyLocation} message={ctx.t.stationsNearbyNeedLocation} action={ctx.t.stationsNearbyUseMyLocation} loading={ctx.loc.loading} onPress={ctx.loc.request} />
          ) : ctx.loc.loading && !ctx.loc.coords ? (
            <View style={s.loadingState}><ActivityIndicator size="large" color={ctx.theme.colors.primary} /><Text style={s.stateMessage}>{ctx.t.stationsNearbyGettingLocation}</Text></View>
          ) : ctx.loc.error || !ctx.loc.coords ? (
            <StateCard icon="warning-outline" title={ctx.t.locationUnavailable} message={ctx.t.locationUnavailableHint} action={ctx.t.tryAgain} loading={ctx.loc.loading} onPress={ctx.loc.request} />
          ) : ctx.nearby.loading ? (
            <View style={s.loadingState}><ActivityIndicator size="large" color={ctx.theme.colors.primary} /><Text style={s.stateMessage}>{ctx.t.loading}</Text></View>
          ) : (
            <StateCard icon={hasFilters ? "search-outline" : "map-outline"} title={hasFilters ? ctx.t.noStationMatches : ctx.t.stationsNearbyNone} message={hasFilters ? ctx.t.clearFilters : ctx.t.stationsTryWiderRadius} action={hasFilters ? ctx.t.clearFilters : ctx.t.refresh} onPress={hasFilters ? clearFilters : ctx.nearby.refresh} />
          )
        }
        ListFooterComponent={ctx.nearby.error ? <View style={s.error}><Ionicons name="warning-outline" size={18} color={ctx.theme.colors.warning} /><Text style={s.errorText}>{ctx.nearby.fromCache ? ctx.t.stationsTimeoutCached : ctx.t.stationsLoadError}</Text></View> : <View style={s.footerSpace} />}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={ctx.nearby.loading} onRefresh={() => ctx.nearby.refresh?.()} tintColor={ctx.theme.colors.primary} />}
      />

      <BottomSheet theme={ctx.theme} open={radiusOpen} title={ctx.t.radius} closeLabel={ctx.t.close} onClose={() => setRadiusOpen(false)}>
        <View style={s.radiusList}>
          {[2000, 5000, 10000, 30000, 50000].map((value) => {
            const locked = value > 10000 && !ctx.reward.unlocked;
            const active = ctx.radiusM === value;
            return (
              <AnimatedPressable
                key={value}
                onPress={() => {
                  if (locked) {
                    setRadiusOpen(false);
                    ctx.openRewardModal(() => ctx.setRadiusM(value));
                    return;
                  }
                  ctx.setRadiusM(value);
                  setRadiusOpen(false);
                }}
                contentStyle={[s.radiusOption, active ? s.radiusOptionActive : null]}
                reduceMotion={ctx.theme.motion.reduced}
                accessibilityLabel={`${value / 1000} km${locked ? `, ${ctx.t.locked}` : ""}`}
                accessibilityState={{ selected: active }}
              >
                <View style={s.radiusIcon}><Ionicons name={locked ? "lock-closed-outline" : "navigate-outline"} size={19} color={active ? ctx.theme.colors.primary : ctx.theme.colors.muted} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={s.radiusTitle}>{value / 1000} km</Text>
                  <Text style={s.radiusSub}>{locked ? ctx.t.unlockStations : ctx.t.withinRadius(value / 1000)}</Text>
                </View>
                {active ? <Ionicons name="checkmark-circle" size={22} color={ctx.theme.colors.primary} /> : null}
              </AnimatedPressable>
            );
          })}
        </View>
      </BottomSheet>
    </View>
  );

  function Metric({ label, value }: { label: string; value: string }) {
    return <View style={s.metric}><Text style={s.metricValue} numberOfLines={1} adjustsFontSizeToFit>{value}</Text><Text style={s.metricLabel} numberOfLines={2}>{label}</Text></View>;
  }

  function FilterChip(props: { label: string; icon: React.ComponentProps<typeof Ionicons>["name"]; active: boolean; onPress: () => void }) {
    return (
      <AnimatedPressable onPress={props.onPress} contentStyle={[s.filterChip, props.active ? s.filterChipActive : null]} accessibilityLabel={props.label} accessibilityState={{ selected: props.active }} reduceMotion={ctx.theme.motion.reduced}>
        <Ionicons name={props.icon} size={16} color={props.active ? ctx.theme.colors.primary : ctx.theme.colors.muted} />
        <Text style={[s.filterText, props.active ? s.filterTextActive : null]} numberOfLines={1}>{props.label}</Text>
      </AnimatedPressable>
    );
  }

  function StationRow({ station, favorite, onFavorite }: { station: Station; favorite: boolean; onFavorite: () => void }) {
    const open = station.isOpen24Hours || station.isOpenNow === true;
    const status = station.isOpen24Hours ? "24h" : station.isOpenNow === true ? ctx.t.stationsNearbyOpenNow : station.isOpenNow === false ? ctx.t.stationsNearbyClosed : ctx.t.stationsNearbyHoursUnknown;
    const displayName = station.name === "Fuel station" ? ctx.t.stationsTitle : station.name;
    return (
      <View style={s.stationCard}>
        <View style={s.stationTop}>
          <View style={s.stationPin} accessibilityElementsHidden><Ionicons name="business-outline" size={20} color={ctx.theme.colors.primary} /></View>
          <View style={s.stationCopy} accessible accessibilityLabel={`${displayName}, ${station.brand ?? ctx.t.stationsTitle}`}>
            <Text style={s.stationName} numberOfLines={1}>{displayName}</Text>
            <Text style={s.stationBrand} numberOfLines={1}>{station.brand ?? ctx.t.stationsTitle}</Text>
          </View>
          <AnimatedPressable onPress={onFavorite} contentStyle={s.favoriteButton} accessibilityLabel={`${favorite ? ctx.t.remove : ctx.t.save} ${ctx.t.favorites}`} accessibilityState={{ selected: favorite }}>
            <Ionicons name={favorite ? "star" : "star-outline"} size={21} color={favorite ? ctx.theme.colors.warning : ctx.theme.colors.muted} />
          </AnimatedPressable>
        </View>
        <View style={s.stationBottom}>
          <View style={s.stationMeta} accessible accessibilityLabel={`${status}, ${station.distanceKm.toFixed(2)} km`}>
            <View style={[s.openDot, { backgroundColor: open ? ctx.theme.colors.success : station.isOpenNow === false ? ctx.theme.colors.danger : ctx.theme.colors.muted }]} />
            <Text style={s.stationStatus}>{status}</Text><Text style={s.metaDivider}>•</Text>
            <Ionicons name="navigate-outline" size={14} color={ctx.theme.colors.muted} />
            <Text style={s.stationDistance}>{station.distanceKm.toFixed(2)} km</Text>
          </View>
          <AnimatedPressable onPress={() => { ctx.markMapsOpened(); openMaps(station.lat, station.lon, displayName); }} contentStyle={s.directionsButton} accessibilityLabel={`${ctx.t.directions}, ${displayName}`} reduceMotion={ctx.theme.motion.reduced}>
            <Ionicons name="arrow-forward" size={17} color={ctx.theme.colors.primaryText} /><Text style={s.directionsText}>{ctx.t.directions}</Text>
          </AnimatedPressable>
        </View>
      </View>
    );
  }

  function StateCard(props: { icon: React.ComponentProps<typeof Ionicons>["name"]; title: string; message: string; action: string; loading?: boolean; onPress?: () => void }) {
    return (
      <View style={s.stateCard}>
        <View style={s.stateIcon}><Ionicons name={props.icon} size={27} color={ctx.theme.colors.primary} /></View>
        <Text style={s.stateTitle}>{props.title}</Text><Text style={s.stateMessage}>{props.message}</Text>
        <AnimatedPressable onPress={props.onPress} disabled={props.loading} contentStyle={s.stateButton} accessibilityLabel={props.action}>
          {props.loading ? <ActivityIndicator color={ctx.theme.colors.primaryText} /> : <Ionicons name="arrow-forward" size={18} color={ctx.theme.colors.primaryText} />}<Text style={s.stateButtonText}>{props.action}</Text>
        </AnimatedPressable>
      </View>
    );
  }
}
