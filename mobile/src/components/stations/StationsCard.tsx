import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Linking, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import type { Theme } from "../../theme/theme";
import type { Station } from "../../hooks/useNearbyStations";
import AnimatedPressable from "../ui/AnimatedPressable";
import { makeStationsStyles } from "./StationsCard.styles";

const STORAGE_STATION_FAVORITES_KEY = "stations_favorites_v1";

function safeParseStringArray(raw: string | null) {
  if (!raw) return [];
  try {
    const j = JSON.parse(raw);
    if (!Array.isArray(j)) return [];
    return j.filter((x) => typeof x === "string");
  } catch {
    return [];
  }
}

async function openInMaps(lat: number, lon: number) {
  const ll = `${lat},${lon}`;
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ll)}`;
  try {
    await Linking.openURL(url);
  } catch {}
}

export default function StationsCard(props: {
  theme: Theme;
  t: any;

  permission: "unknown" | "granted" | "denied";
  locating: boolean;
  onRequestLocation: () => void;

  stations: Station[];
  totalCount: number;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  fromCache: boolean;

  radiusM: number;
  setRadiusM: (v: number | ((p: number) => number)) => void;

  onOpenExternalMap?: () => void;

  rewardUnlocked: boolean;
  onShowAllPress: (proceed: () => void) => void;

  onRadiusPress?: () => void;
}) {
  const s = useMemo(() => makeStationsStyles(props.theme), [props.theme]);

  const [visible, setVisible] = useState(10);

  useEffect(() => {
    setVisible(10);
  }, [props.radiusM, props.totalCount]);

  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const favRaw = await AsyncStorage.getItem(STORAGE_STATION_FAVORITES_KEY);
      setFavoriteIds(safeParseStringArray(favRaw));
    })();
  }, []);

  const favSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const stationsSorted = useMemo(() => {
    const copy = [...props.stations];
    copy.sort((a, b) => {
      const af = favSet.has(a.id) ? 0 : 1;
      const bf = favSet.has(b.id) ? 0 : 1;
      if (af !== bf) return af - bf;
      return a.distanceKm - b.distanceKm;
    });
    return copy;
  }, [props.stations, favSet]);

  const shownStations = useMemo(() => stationsSorted.slice(0, visible), [stationsSorted, visible]);
  const nearest = stationsSorted[0] ?? null;
  const openCount = useMemo(
    () => stationsSorted.filter((st) => st.isOpen24Hours || st.isOpenNow === true).length,
    [stationsSorted]
  );

  const canShowMore = visible < stationsSorted.length;
  const canShowAll = visible < stationsSorted.length;
  const canCollapse = visible > 10;
  const showActions = canCollapse || canShowMore || canShowAll;

  const radiusItems = useMemo(() => {
    const base = [
      { v: 2000, label: props.t.radius2km, icon: "location-outline" as const, locked: false },
      { v: 5000, label: props.t.radius5km, icon: "navigate-outline" as const, locked: false },
      { v: 10000, label: props.t.radius10km, icon: "compass-outline" as const, locked: false }
    ];

    const premium = [
      { v: 30000, label: props.t.radius30km, icon: "compass-outline" as const, locked: !props.rewardUnlocked },
      { v: 50000, label: props.t.radius50km, icon: "compass-outline" as const, locked: !props.rewardUnlocked }
    ];

    return [...base, ...premium];
  }, [props.t, props.rewardUnlocked]);

  const toggleFav = async (id: string) => {
    const next = favSet.has(id) ? favoriteIds.filter((x) => x !== id) : [id, ...favoriteIds];
    setFavoriteIds(next);
    await AsyncStorage.setItem(STORAGE_STATION_FAVORITES_KEY, JSON.stringify(next));
  };

  const openStation = async (st: Station) => {
    props.onOpenExternalMap?.();
    await openInMaps(st.lat, st.lon);
  };

  return (
    <View style={s.card}>
      <View style={s.hero}>
        <View style={s.heroTop}>
          <View style={s.heroIcon}>
            <Ionicons name="map-outline" size={20} color={props.theme.colors.primary} />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={s.heroLabel}>{props.t.stationsNearbyTitle}</Text>
            <Text style={s.heroTitle} numberOfLines={1}>
              {props.permission === "granted"
                ? props.t.stationsNearbyFound(props.totalCount)
                : props.t.stationsNearbyUseMyLocation}
            </Text>
          </View>
          <AnimatedPressable onPress={props.onRefresh} contentStyle={s.refreshBtn} scaleIn={0.96}>
            {props.loading ? (
              <ActivityIndicator color={props.theme.colors.text} />
            ) : (
              <Ionicons name="refresh" size={18} color={props.theme.colors.text} />
            )}
          </AnimatedPressable>
        </View>

        <View style={s.metricGrid}>
          <View style={s.metricTile}>
            <Text style={s.metricLabel}>{props.t.radius}</Text>
            <Text style={s.metricValue}>{Math.round(props.radiusM / 1000)} km</Text>
          </View>
          <View style={s.metricTile}>
            <Text style={s.metricLabel}>Nearest</Text>
            <Text style={s.metricValue}>{nearest ? `${nearest.distanceKm.toFixed(1)} km` : "—"}</Text>
          </View>
          <View style={s.metricTile}>
            <Text style={s.metricLabel}>{props.t.stationsNearbyOpenNow}</Text>
            <Text style={s.metricValue}>{openCount || "—"}</Text>
          </View>
        </View>
      </View>

      <View style={s.radiusRow}>
        <Text style={s.radiusLabel}>{props.t.radius}</Text>
        <View style={s.radiusPills}>
          {radiusItems.map((it) => {
            const active = props.radiusM === it.v;
            const locked = it.locked;

            return (
              <AnimatedPressable
                key={it.v}
                onPress={() => {
                  if (locked) {
                    props.onRadiusPress?.();
                    return;
                  }
                  props.setRadiusM(it.v);
                  props.onRadiusPress?.();
                }}
                contentStyle={[s.radiusPill, active ? s.radiusPillActive : null, locked ? s.radiusPillLocked : null]}
                scaleIn={0.98}
              >
                <Ionicons name={locked ? "lock-closed-outline" : it.icon} size={14} color={active ? props.theme.colors.text : props.theme.colors.muted} />
                <Text style={[s.radiusPillText, active ? s.radiusPillTextActive : null]}>{it.label}</Text>
              </AnimatedPressable>
            );
          })}
        </View>
      </View>

      {props.permission !== "granted" ? (
        <View style={s.emptyState}>
          <View style={s.emptyIcon}>
            <Ionicons name="location-outline" size={24} color={props.theme.colors.primary} />
          </View>
          <Text style={s.emptyTitle}>{props.t.stationsNearbyUseMyLocation}</Text>
          <Text style={s.emptyText}>{props.t.stationsNearbyNeedLocation}</Text>

          <AnimatedPressable onPress={props.onRequestLocation} disabled={props.locating} contentStyle={s.primaryBtn} scaleIn={0.98}>
            {props.locating ? (
              <ActivityIndicator color={props.theme.colors.primaryText} />
            ) : (
              <Ionicons name="locate-outline" size={18} color={props.theme.colors.primaryText} />
            )}
            <Text style={s.primaryBtnText}>
              {props.locating ? props.t.stationsNearbyGettingLocation : props.t.stationsNearbyUseMyLocation}
            </Text>
          </AnimatedPressable>
        </View>
      ) : null}

      {props.error ? <Text style={s.errorText}>{props.error}</Text> : null}

      {props.permission === "granted" ? (
        <>
          <View style={s.countRow}>
            <Text style={s.mutedText}>{props.t.stationsNearbyShowing(shownStations.length, props.totalCount)}</Text>
            {props.fromCache ? <Text style={s.cacheText}>{props.t.stationsNearbyCached}</Text> : null}
          </View>

          {props.totalCount === 0 && !props.loading ? (
            <View style={s.emptyState}>
              <View style={s.emptyIcon}>
                <Ionicons name="map-outline" size={24} color={props.theme.colors.primary} />
              </View>
              <Text style={s.emptyTitle}>{props.t.stationsNearbyNone}</Text>
              <Text style={s.emptyText}>{props.t.stationsTryWiderRadius}</Text>
              <AnimatedPressable onPress={props.onRefresh} contentStyle={s.secondaryBtn} scaleIn={0.98}>
                <Ionicons name="refresh-outline" size={17} color={props.theme.colors.text} />
                <Text style={s.secondaryBtnText}>{props.t.stationsNearbyRefresh}</Text>
              </AnimatedPressable>
            </View>
          ) : null}

          <View style={s.rows}>
            <FlatList
              data={shownStations}
              keyExtractor={(x) => x.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              renderItem={({ item }) => {
                const isFav = favSet.has(item.id);
                const isVeryNear = item.distanceKm <= 1;

                return (
                  <AnimatedPressable onPress={() => openStation(item)} contentStyle={s.rowCard} scaleIn={0.99}>
                    <View style={s.rowLeft}>
                      <View style={s.rowIcon}>
                        <Ionicons name="pin-outline" size={18} color={props.theme.colors.linkText} />
                      </View>

                      <View style={{ flex: 1, minWidth: 0 }}>
                        <Text style={s.rowTitle} numberOfLines={1}>
                          {item.name}
                        </Text>

                        {item.brand ? (
                          <Text style={s.rowSub} numberOfLines={1}>
                            {item.brand}
                          </Text>
                        ) : null}

                        {item.isOpen24Hours ? (
                          <View style={s.open24Badge}>
                            <Ionicons name="time-outline" size={12} color={props.theme.colors.text} />
                            <Text style={s.open24BadgeText}>24h</Text>
                          </View>
                        ) : item.isOpenNow === true ? (
                          <View style={s.open24Badge}>
                            <Ionicons name="time-outline" size={12} color={props.theme.colors.text} />
                            <Text style={s.open24BadgeText}>{props.t.stationsNearbyOpenNow}</Text>
                          </View>
                        ) : item.isOpenNow === false ? (
                          <View style={s.open24Badge}>
                            <Ionicons name="time-outline" size={12} color={props.theme.colors.text} />
                            <Text style={s.open24BadgeText}>{props.t.stationsNearbyClosed}</Text>
                          </View>
                        ) : (
                          <View style={s.open24Badge}>
                            <Ionicons name="time-outline" size={12} color={props.theme.colors.text} />
                            <Text style={s.open24BadgeText}>{props.t.stationsNearbyHoursUnknown}</Text>
                          </View>
                        )}
                      </View>
                    </View>

                    <View style={s.rowRight}>
                      <View style={[s.kmPill, isVeryNear ? s.kmPillNear : null]}>
                        <Ionicons name="walk-outline" size={14} color={props.theme.colors.muted} />
                        <Text style={s.kmText}>{item.distanceKm.toFixed(2)} km</Text>
                      </View>

                      <AnimatedPressable onPress={() => toggleFav(item.id)} contentStyle={s.starBtn} scaleIn={0.98}>
                        <Ionicons name={isFav ? "star" : "star-outline"} size={18} color={isFav ? props.theme.colors.linkText : props.theme.colors.muted} />
                      </AnimatedPressable>

                      <View style={s.mapCue}>
                        <Ionicons name="navigate" size={14} color={props.theme.colors.primary} />
                      </View>
                    </View>
                  </AnimatedPressable>
                );
              }}
            />
          </View>

          {showActions ? (
            <View style={s.actionsRow}>
              {canCollapse ? (
                <AnimatedPressable onPress={() => setVisible(10)} contentStyle={s.btn} scaleIn={0.98}>
                  <Ionicons name="contract-outline" size={16} color={props.theme.colors.text} />
                  <Text style={s.btnText}>{props.t.stationsNearbyCollapse}</Text>
                </AnimatedPressable>
              ) : null}

              {canShowMore ? (
                <AnimatedPressable onPress={() => setVisible((p) => p + 10)} contentStyle={s.btn} scaleIn={0.98}>
                  <Ionicons name="add-outline" size={18} color={props.theme.colors.text} />
                  <Text style={s.btnText}>{props.t.stationsNearbyShowMore}</Text>
                </AnimatedPressable>
              ) : null}

              {canShowAll ? (
                <AnimatedPressable
                  onPress={() => props.onShowAllPress(() => setVisible(stationsSorted.length))}
                  contentStyle={s.btn}
                  scaleIn={0.98}
                >
                  <Ionicons name="list-outline" size={16} color={props.theme.colors.text} />
                  <Text style={s.btnText}>{props.t.stationsNearbyShowAll}</Text>
                </AnimatedPressable>
              ) : null}
            </View>
          ) : null}
        </>
      ) : null}

    </View>
  );
}
