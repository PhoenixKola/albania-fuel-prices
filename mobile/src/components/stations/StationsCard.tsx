import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Linking, Modal, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import type { Theme } from "../../theme/theme";
import type { Station } from "../../hooks/useNearbyStations";
import AnimatedPressable from "../ui/AnimatedPressable";
import { makeStationsStyles } from "./StationsCard.styles";

type MapProvider = "system" | "google" | "apple" | "waze";

const STORAGE_STATION_FAVORITES_KEY = "stations_favorites_v1";
const STORAGE_MAP_PROVIDER_KEY = "maps_provider_v1";

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

async function openPreferredMap(provider: MapProvider, lat: number, lon: number, label: string) {
  const q = encodeURIComponent(label);
  const ll = `${lat},${lon}`;

  const candidates: string[] =
    provider === "google"
      ? [`google.navigation:q=${ll}(${q})`, `https://www.google.com/maps/dir/?api=1&destination=${ll}&destination_place_id=&travelmode=driving`]
      : provider === "apple"
        ? [`http://maps.apple.com/?daddr=${ll}&q=${q}`]
        : provider === "waze"
          ? [`waze://?ll=${ll}&navigate=yes`, `https://waze.com/ul?ll=${ll}&navigate=yes`]
          : [`https://www.google.com/maps/search/?api=1&query=${ll}(${q})`];

  for (const url of candidates) {
    try {
      const ok = await Linking.canOpenURL(url);
      if (ok) {
        await Linking.openURL(url);
        return;
      }
    } catch {}
  }
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
  const [mapProvider, setMapProvider] = useState<MapProvider>("system");

  useEffect(() => {
    (async () => {
      const favRaw = await AsyncStorage.getItem(STORAGE_STATION_FAVORITES_KEY);
      setFavoriteIds(safeParseStringArray(favRaw));

      const mpRaw = await AsyncStorage.getItem(STORAGE_MAP_PROVIDER_KEY);
      const mp = (mpRaw as MapProvider) || "system";
      setMapProvider(mp === "google" || mp === "apple" || mp === "waze" || mp === "system" ? mp : "system");
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

  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [rememberProvider, setRememberProvider] = useState(true);
  const [pendingStation, setPendingStation] = useState<Station | null>(null);

  const openStation = async (st: Station) => {
    props.onOpenExternalMap?.();

    if (mapProvider !== "system") {
      await openPreferredMap(mapProvider, st.lat, st.lon, st.name);
      return;
    }

    setPendingStation(st);
    setMapModalOpen(true);
  };

  const chooseProvider = async (p: MapProvider) => {
    const st = pendingStation;
    setMapModalOpen(false);
    setPendingStation(null);

    if (rememberProvider) {
      setMapProvider(p);
      await AsyncStorage.setItem(STORAGE_MAP_PROVIDER_KEY, p);
    }

    if (st) await openPreferredMap(p, st.lat, st.lon, st.name);
  };

  const canResetProvider = mapProvider !== "system";

  const resetProvider = async () => {
    setMapProvider("system");
    await AsyncStorage.setItem(STORAGE_MAP_PROVIDER_KEY, "system");
  };

  return (
    <View style={s.card}>
      <View style={s.headerRow}>
        <View style={s.headerLeft}>
          <View style={s.headerIcon}>
            <Ionicons name="navigate-outline" size={18} color={props.theme.colors.linkText} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={s.title}>{props.t.stationsNearbyTitle}</Text>
            <Text style={s.subtitle} numberOfLines={2}>
              {props.t.stationsNearbyFound(props.totalCount)}
            </Text>
          </View>
        </View>

        <View style={s.headerRight}>
          <View style={s.headerPills}>
            {canResetProvider ? (
              <AnimatedPressable onPress={resetProvider} contentStyle={s.pillBtn} scaleIn={0.98}>
                <Ionicons name="map-outline" size={14} color={props.theme.colors.text} />
                <Text style={s.pillBtnText}>{props.t.resetMaps ?? "Maps"}</Text>
              </AnimatedPressable>
            ) : null}
          </View>

          <AnimatedPressable onPress={props.onRefresh} contentStyle={s.iconBtn} scaleIn={0.98}>
            {props.loading ? <ActivityIndicator /> : <Ionicons name="refresh" size={18} color={props.theme.colors.text} />}
          </AnimatedPressable>
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
        <View style={s.notice}>
          <View style={s.noticeTop}>
            <Ionicons name="location-outline" size={18} color={props.theme.colors.muted} />
            <Text style={s.noticeText}>{props.t.stationsNearbyNeedLocation}</Text>
          </View>

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
          </View>

          {props.totalCount === 0 && !props.loading ? (
            <View style={s.emptyCard}>
              <Ionicons name="alert-circle-outline" size={18} color={props.theme.colors.muted} />
              <Text style={s.emptyText}>{props.t.stationsNearbyNone}</Text>
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

                      <Ionicons name="chevron-forward" size={16} color={props.theme.colors.muted} />
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

      <Modal visible={mapModalOpen} transparent animationType="fade" onRequestClose={() => setMapModalOpen(false)}>
        <View style={s.modalBackdrop}>
          <View style={s.modalCard}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>{props.t.chooseMapsApp ?? "Open with"}</Text>
              <AnimatedPressable onPress={() => setMapModalOpen(false)} contentStyle={s.modalCloseBtn} scaleIn={0.98}>
                <Ionicons name="close" size={18} color={props.theme.colors.text} />
              </AnimatedPressable>
            </View>

            <View style={s.modalOptions}>
              <AnimatedPressable onPress={() => chooseProvider("google")} contentStyle={s.modalOption} scaleIn={0.98}>
                <Ionicons name="logo-google" size={18} color={props.theme.colors.text} />
                <Text style={s.modalOptionText}>Google Maps</Text>
              </AnimatedPressable>

              <AnimatedPressable onPress={() => chooseProvider("apple")} contentStyle={s.modalOption} scaleIn={0.98}>
                <Ionicons name="map-outline" size={18} color={props.theme.colors.text} />
                <Text style={s.modalOptionText}>Apple Maps</Text>
              </AnimatedPressable>

              <AnimatedPressable onPress={() => chooseProvider("waze")} contentStyle={s.modalOption} scaleIn={0.98}>
                <Ionicons name="navigate-outline" size={18} color={props.theme.colors.text} />
                <Text style={s.modalOptionText}>Waze</Text>
              </AnimatedPressable>
            </View>

            <AnimatedPressable
              onPress={() => setRememberProvider((p) => !p)}
              contentStyle={s.rememberRow}
              scaleIn={0.98}
            >
              <Ionicons
                name={rememberProvider ? "checkbox-outline" : "square-outline"}
                size={18}
                color={props.theme.colors.text}
              />
              <Text style={s.rememberText}>{props.t.rememberChoice ?? "Remember my choice"}</Text>
            </AnimatedPressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}