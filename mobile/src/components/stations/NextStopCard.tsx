import React, { memo } from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { Lang, TDict } from "../../i18n";
import type { Station } from "../../hooks/useNearbyStations";
import AnimatedPressable from "../ui/AnimatedPressable";
import type { StationStyles, StationsPalette } from "./stations.styles";
import { formatDistance, hoursInfo, stationA11yLabel, stationSubtitle, stationTitle } from "./stationFormat";

type Props = {
  station: Station;
  isMatch: boolean;
  favorite: boolean;
  s: StationStyles;
  p: StationsPalette;
  t: TDict;
  lang: Lang;
  reduceMotion: boolean;
  stacked: boolean;
  onDirections: (station: Station) => void;
  onToggleFavorite: (id: string) => void;
};

/** The one station to act on: nearest overall, or nearest matching the active search/filters. */
function NextStopCard({ station, isMatch, favorite, s, p, t, lang, reduceMotion, stacked, onDirections, onToggleFavorite }: Props) {
  const title = stationTitle(station, t);
  const subtitle = stationSubtitle(station);
  const distance = formatDistance(station.distanceKm, lang);
  const hours = hoursInfo(station, t);
  const hoursColor = hours.tone === "open" ? p.moduleOpen : hours.tone === "closed" ? p.moduleClosed : p.moduleSoft;
  const kicker = isMatch ? t.closestMatch : t.nearestStation;

  return (
    <View style={s.deck}>
      <View style={s.module} accessible accessibilityLabel={`${kicker}. ${stationA11yLabel(station, t, lang)}`}>
        <Text style={s.kicker}>{kicker}</Text>
        <Text style={s.nextName}>{title}</Text>
        {subtitle ? <Text style={s.nextBrand}>{subtitle}</Text> : null}

        <View style={s.distanceRow}>
          {/* Display numeral: already ~3× body size, so a 1.5× ceiling keeps it on screen at 200% text. */}
          <Text style={s.distanceValue} maxFontSizeMultiplier={1.5}>{distance.value}</Text>
          <Text style={s.distanceUnit}>{distance.unit}</Text>
        </View>
        <Text style={s.distanceCaption}>{t.straightLine}</Text>

        <View style={s.hoursRow}>
          <Ionicons name={hours.icon} size={18} color={hoursColor} />
          <Text style={[s.hoursText, { color: hoursColor }]}>{hours.label}</Text>
        </View>
        {hours.tone !== "unknown" ? <Text style={s.hoursNote}>{t.hoursListedNote}</Text> : null}
      </View>

      <View style={s.nextActions}>
        <AnimatedPressable
          onPress={() => onDirections(station)}
          style={stacked ? undefined : { flexGrow: 1 }}
          contentStyle={s.primaryButton}
          reduceMotion={reduceMotion}
          accessibilityLabel={t.directionsTo(title)}
        >
          <Ionicons name="navigate" size={19} color={p.onAccent} />
          <Text style={s.primaryText}>{t.directions}</Text>
        </AnimatedPressable>
        <AnimatedPressable
          onPress={() => onToggleFavorite(station.id)}
          contentStyle={s.secondaryButton}
          scaleIn={0.94}
          reduceMotion={reduceMotion}
          accessibilityLabel={favorite ? t.unsaveStationA11y(title) : t.saveStationA11y(title)}
          accessibilityState={{ selected: favorite }}
        >
          <Ionicons name={favorite ? "star" : "star-outline"} size={21} color={favorite ? p.accent : p.ink} />
          {stacked ? <Text style={s.secondaryText}>{favorite ? t.savedStation : t.save}</Text> : null}
        </AnimatedPressable>
      </View>
    </View>
  );
}

export default memo(NextStopCard);
