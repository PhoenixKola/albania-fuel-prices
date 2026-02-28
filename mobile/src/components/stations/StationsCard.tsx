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
}) {
  const s = useMemo(() => makeStationsStyles(props.theme), [props.theme]);

  const radiusItems = useMemo(
    () => [
      { v: 2000, label: props.t.radius2km, icon: "location-outline" as const },
      { v: 5000, label: props.t.radius5km, icon: "navigate-outline" as const },
      { v: 10000, label: props.t.radius10km, icon: "compass-outline" as const }
    ],
    [props.t]
  );

  const [visible, setVisible] = useState(10);

  React.useEffect(() => {
    setVisible(10);
  }, [props.radiusM, props.totalCount]);

  const shownStations = useMemo(() => props.stations.slice(0, visible), [props.stations, visible]);

  const canShowMore = visible < props.stations.length;
  const canShowAll = visible < props.stations.length;
  const canCollapse = visible > 10;
  const showActions = canCollapse || canShowMore || canShowAll;

  return (
    <View style={s.card}>
      <View style={s.headerRow}>
        <View style={s.headerLeft}>
          <View style={s.headerIcon}>
            <Ionicons name="navigate-outline" size={18} color={props.theme.colors.linkText} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.title}>{props.t.stationsNearbyTitle}</Text>
            <Text style={s.subtitle}>{props.t.stationsNearbyFound(props.totalCount)}</Text>
          </View>
        </View>

        <View style={s.headerRight}>
          {props.loading ? <ActivityIndicator /> : null}
          <AnimatedPressable onPress={props.onRefresh} contentStyle={s.iconBtn} scaleIn={0.98}>
            <Ionicons name="refresh" size={18} color={props.theme.colors.text} />
          </AnimatedPressable>
        </View>
      </View>

      <View style={s.radiusRow}>
        <Text style={s.radiusLabel}>{props.t.radius}</Text>
        <View style={s.radiusPills}>
          {radiusItems.map((it) => {
            const active = props.radiusM === it.v;
            return (
              <AnimatedPressable
                key={it.v}
                onPress={() => props.setRadiusM(it.v)}
                contentStyle={[s.radiusPill, active ? s.radiusPillActive : null]}
                scaleIn={0.98}
              >
                <Ionicons name={it.icon} size={14} color={active ? props.theme.colors.text : props.theme.colors.muted} />
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
            {props.locating ? <ActivityIndicator color={props.theme.colors.primaryText} /> : <Ionicons name="locate-outline" size={18} color={props.theme.colors.primaryText} />}
            <Text style={s.primaryBtnText}>
              {props.locating ? props.t.stationsNearbyGettingLocation : props.t.stationsNearbyUseMyLocation}
            </Text>
          </AnimatedPressable>
        </View>
      ) : null}

      {props.error ? <Text style={s.errorText}>{props.error}</Text> : null}
      {props.fromCache ? (
        <View style={s.cacheRow}>
          <Ionicons name="cloud-offline-outline" size={16} color={props.theme.colors.muted} />
          <Text style={s.cacheText}>{props.t.stationsNearbyCached}</Text>
        </View>
      ) : null}

      {props.permission === "granted" ? (
        <>
          <View style={s.countRow}>
            <Text style={s.mutedText}>{props.t.stationsNearbyShowing(shownStations.length, props.totalCount)}</Text>
          </View>

          <View style={s.list}>
            {props.totalCount === 0 && !props.loading ? <Text style={s.emptyText}>{props.t.stationsNearbyNone}</Text> : null}

            <FlatList
              data={shownStations}
              keyExtractor={(x) => x.id}
              scrollEnabled={false}
              renderItem={({ item, index }) => (
                <AnimatedPressable
                  onPress={() => openMaps(item.lat, item.lon, item.name)}
                  contentStyle={[s.row, index === shownStations.length - 1 ? { borderBottomWidth: 0 } : null]}
                  scaleIn={0.99}
                >
                  <View style={s.rowLeft}>
                    <View style={s.rowIcon}>
                      <Ionicons name="pin-outline" size={18} color={props.theme.colors.linkText} />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={s.rowTitle}>{item.name}</Text>
                      {item.brand ? <Text style={s.rowSub}>{item.brand}</Text> : null}
                    </View>
                  </View>

                  <View style={s.right}>
                    <Text style={s.km}>{item.distanceKm.toFixed(2)} km</Text>
                    <View style={s.openRow}>
                      <Ionicons name="open-outline" size={14} color={props.theme.colors.linkText} />
                      <Text style={s.openHint}>{props.t.stationsNearbyOpen}</Text>
                    </View>
                  </View>
                </AnimatedPressable>
              )}
            />
          </View>

          {showActions ? (
            <View style={s.actionsRow}>
              {visible > 10 ? (
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
                <AnimatedPressable onPress={() => setVisible(props.stations.length)} contentStyle={s.btn} scaleIn={0.98}>
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