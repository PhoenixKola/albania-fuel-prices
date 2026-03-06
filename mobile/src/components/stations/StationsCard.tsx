import React, { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { Theme } from "../../theme/theme";
import { openMaps } from "../../utils/maps";
import type { Station } from "../../hooks/useNearbyStations";
import AnimatedPressable from "../ui/AnimatedPressable";
import { makeStationsStyles } from "./StationsCard.styles";

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

  const [visible, setVisible] = useState(10);

  React.useEffect(() => {
    setVisible(10);
  }, [props.radiusM, props.totalCount]);

  const shownStations = useMemo(() => props.stations.slice(0, visible), [props.stations, visible]);

  const canShowMore = visible < props.stations.length;
  const canShowAll = visible < props.stations.length;
  const canCollapse = visible > 10;
  const showActions = canCollapse || canShowMore || canShowAll;

  const radiusLabel = useMemo(() => {
    if (props.radiusM === 2000) return props.t.radius2km;
    if (props.radiusM === 5000) return props.t.radius5km;
    if (props.radiusM === 10000) return props.t.radius10km;
    if (props.radiusM === 30000) return props.t.radius30km;
    if (props.radiusM === 50000) return props.t.radius50km;
    return `${Math.round(props.radiusM / 1000)} km`;
  }, [props.radiusM, props.t]);

  const liveLabel = props.fromCache ? (props.t.cachedWorksOffline ?? "Cached") : (props.t.live ?? "Live");

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
            <View style={s.pill}>
              <Ionicons
                name={props.fromCache ? "cloud-offline-outline" : "pulse-outline"}
                size={14}
                color={props.theme.colors.muted}
              />
              <Text style={s.pillText}>{liveLabel}</Text>
            </View>

            <View style={s.pill}>
              <Ionicons name="resize-outline" size={14} color={props.theme.colors.muted} />
              <Text style={s.pillText} numberOfLines={1}>
                {radiusLabel}
              </Text>
            </View>
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
            const disabled = it.locked;

            return (
              <AnimatedPressable
                key={it.v}
                onPress={() => {
                  if (disabled) {
                    props.onRadiusPress?.();
                    return;
                  }
                  props.setRadiusM(it.v);
                  props.onRadiusPress?.();
                }}
                disabled={false}
                contentStyle={[
                  s.radiusPill,
                  active ? s.radiusPillActive : null,
                  disabled ? s.radiusPillLocked : null
                ]}
                scaleIn={0.98}
              >
                <Ionicons
                  name={disabled ? "lock-closed-outline" : it.icon}
                  size={14}
                  color={active ? props.theme.colors.text : props.theme.colors.muted}
                />
                <Text
                  style={[
                    s.radiusPillText,
                    active ? s.radiusPillTextActive : null,
                    disabled ? s.radiusPillTextLocked : null
                  ]}
                >
                  {it.label}
                </Text>
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

          <AnimatedPressable
            onPress={props.onRequestLocation}
            disabled={props.locating}
            contentStyle={s.primaryBtn}
            scaleIn={0.98}
          >
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
                const isVeryNear = item.distanceKm <= 1;

                return (
                  <AnimatedPressable
                    onPress={() => {
                      props.onOpenExternalMap?.();
                      openMaps(item.lat, item.lon, item.name);
                    }}
                    contentStyle={s.rowCard}
                    scaleIn={0.99}
                  >
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
                      </View>
                    </View>

                    <View style={s.rowRight}>
                      <View style={[s.kmPill, isVeryNear ? s.kmPillNear : null]}>
                        <Ionicons name="walk-outline" size={14} color={props.theme.colors.muted} />
                        <Text style={s.kmText}>{item.distanceKm.toFixed(2)} km</Text>
                      </View>

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
                  onPress={() => props.onShowAllPress(() => setVisible(props.stations.length))}
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