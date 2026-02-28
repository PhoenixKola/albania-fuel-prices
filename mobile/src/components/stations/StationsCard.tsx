import React, { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import type { Theme } from "../../theme/theme";
import { openMaps } from "../../utils/maps";
import type { Station } from "../../hooks/useNearbyStations";
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
      { v: 2000, label: props.t.radius2km },
      { v: 5000, label: props.t.radius5km },
      { v: 10000, label: props.t.radius10km },
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
        <Text style={s.title}>{props.t.stationsNearbyTitle}</Text>

        <View style={s.headerRight}>
          {props.loading ? <ActivityIndicator /> : null}
          <Pressable onPress={props.onRefresh} style={s.btn}>
            <Text style={s.btnText}>{props.t.stationsNearbyRefresh}</Text>
          </Pressable>
        </View>
      </View>

      <View style={s.radiusRow}>
        <Text style={s.radiusLabel}>{props.t.radius}</Text>
        <View style={s.radiusPills}>
          {radiusItems.map((it) => {
            const active = props.radiusM === it.v;
            return (
              <Pressable
                key={it.v}
                onPress={() => props.setRadiusM(it.v)}
                style={[s.radiusPill, active ? s.radiusPillActive : null]}
              >
                <Text style={[s.radiusPillText, active ? s.radiusPillTextActive : null]}>{it.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {props.permission === "granted" ? (
        <View style={s.countRow}>
          <Text style={s.muted}>{props.t.stationsNearbyFound(props.totalCount)}</Text>
          <Text style={s.muted}>
            {props.t.stationsNearbyShowing(shownStations.length, props.totalCount)}
          </Text>
        </View>
      ) : null}

      {props.permission !== "granted" ? (
        <View style={s.notice}>
          <Text style={s.noticeText}>{props.t.stationsNearbyNeedLocation}</Text>
          <Pressable onPress={props.onRequestLocation} style={s.primaryBtn} disabled={props.locating}>
            <Text style={s.primaryBtnText}>
              {props.locating ? props.t.stationsNearbyGettingLocation : props.t.stationsNearbyUseMyLocation}
            </Text>
          </Pressable>
        </View>
      ) : null}

      {props.error ? <Text style={s.errorText}>{props.error}</Text> : null}
      {props.fromCache ? <Text style={s.muted}>{props.t.stationsNearbyCached}</Text> : null}

      {props.permission === "granted" ? (
        <>
          <View style={s.list}>
            {props.totalCount === 0 && !props.loading ? <Text style={s.muted}>{props.t.stationsNearbyNone}</Text> : null}

            <FlatList
              data={shownStations}
              keyExtractor={(x) => x.id}
              scrollEnabled={false}
              renderItem={({ item, index }) => (
                <Pressable
                  onPress={() => openMaps(item.lat, item.lon, item.name)}
                  style={[s.row, index === shownStations.length - 1 ? { borderBottomWidth: 0 } : null]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={s.rowTitle}>{item.name}</Text>
                    {item.brand ? <Text style={s.rowSub}>{item.brand}</Text> : null}
                  </View>

                  <View style={s.right}>
                    <Text style={s.km}>{item.distanceKm.toFixed(2)} km</Text>
                    <Text style={s.openHint}>{props.t.stationsNearbyOpen}</Text>
                  </View>
                </Pressable>
              )}
            />
          </View>

          {showActions  ? (
            <View style={s.actionsRow}>
              {visible > 10 ? (
                <Pressable onPress={() => setVisible(10)} style={s.btn}>
                  <Text style={s.btnText}>{props.t.stationsNearbyCollapse}</Text>
                </Pressable>
              ) : null}

              {canShowMore ? (
                <Pressable onPress={() => setVisible((p) => p + 10)} style={s.btn}>
                  <Text style={s.btnText}>{props.t.stationsNearbyShowMore}</Text>
                </Pressable>
              ) : null}

              {canShowAll ? (
                <Pressable onPress={() => setVisible(props.stations.length)} style={s.btn}>
                  <Text style={s.btnText}>{props.t.stationsNearbyShowAll}</Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}
        </>
      ) : null}
    </View>
  );
}