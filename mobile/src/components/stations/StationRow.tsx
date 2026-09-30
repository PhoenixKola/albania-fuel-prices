import React, { memo } from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { Lang, TDict } from "../../i18n";
import type { Station } from "../../hooks/useNearbyStations";
import AnimatedPressable from "../ui/AnimatedPressable";
import type { StationStyles, StationsPalette } from "./stations.styles";
import { distanceText, hoursInfo, stationA11yLabel, stationSubtitle, stationTitle } from "./stationFormat";

type Props = {
  station: Station;
  favorite: boolean;
  s: StationStyles;
  p: StationsPalette;
  t: TDict;
  lang: Lang;
  reduceMotion: boolean;
  compactName: boolean;
  onDirections: (station: Station) => void;
  onToggleFavorite: (id: string) => void;
};

function StationRow({ station, favorite, s, p, t, lang, reduceMotion, compactName, onDirections, onToggleFavorite }: Props) {
  const title = stationTitle(station, t);
  const subtitle = stationSubtitle(station);
  const hours = hoursInfo(station, t);
  const hoursColor = hours.tone === "open" ? p.good : hours.tone === "closed" ? p.closed : p.inkSoft;

  return (
    <View style={s.row}>
      <View style={s.rowTop}>
        {/* One focus stop carries everything the row says; the visual meta line below is hidden from TalkBack. */}
        <View style={s.rowInfo} accessible accessibilityLabel={stationA11yLabel(station, t, lang)}>
          <Text style={s.rowName} numberOfLines={compactName ? 2 : undefined}>
            {title}
          </Text>
          {subtitle ? <Text style={s.rowBrand} numberOfLines={compactName ? 1 : undefined}>{subtitle}</Text> : null}
        </View>
        <AnimatedPressable
          onPress={() => onToggleFavorite(station.id)}
          contentStyle={s.rowStar}
          scaleIn={0.9}
          reduceMotion={reduceMotion}
          accessibilityLabel={favorite ? t.unsaveStationA11y(title) : t.saveStationA11y(title)}
          accessibilityState={{ selected: favorite }}
        >
          <Ionicons name={favorite ? "star" : "star-outline"} size={22} color={favorite ? p.accent : p.inkSoft} />
        </AnimatedPressable>
      </View>

      <View style={s.rowBottom}>
        <View style={s.meta} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <View style={s.metaItem}>
            <Ionicons name="navigate-outline" size={15} color={p.ink} />
            <Text style={s.metaDistance}>{distanceText(station.distanceKm, lang)}</Text>
          </View>
          <View style={s.metaItem}>
            <Ionicons name={hours.icon} size={15} color={hoursColor} />
            <Text style={[s.metaHours, { color: hoursColor }]}>{hours.label}</Text>
          </View>
        </View>
        <AnimatedPressable
          onPress={() => onDirections(station)}
          contentStyle={s.rowDirections}
          reduceMotion={reduceMotion}
          accessibilityLabel={t.directionsTo(title)}
        >
          <Ionicons name="arrow-redo-outline" size={17} color={p.accent} />
          <Text style={s.rowDirectionsText}>{t.directions}</Text>
        </AnimatedPressable>
      </View>
    </View>
  );
}

export default memo(StationRow);
