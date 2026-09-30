import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { Theme } from "../../theme/theme";
import type { TDict } from "../../i18n";
import BottomSheet from "../ui/BottomSheet";
import AnimatedPressable from "../ui/AnimatedPressable";
import type { StationStyles, StationsPalette } from "./stations.styles";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

type Props = {
  theme: Theme;
  t: TDict;
  s: StationStyles;
  p: StationsPalette;
  open: boolean;
  openOnly: boolean;
  favoriteOnly: boolean;
  radiusM: number;
  radii: readonly number[];
  isLocked: (radiusM: number) => boolean;
  onToggleOpenOnly: () => void;
  onToggleFavoriteOnly: () => void;
  onSelectRadius: (radiusM: number) => void;
  onClear: () => void;
  onClose: () => void;
};

export default function StationFiltersSheet(props: Props) {
  const { theme, t, s, p } = props;
  const reduce = theme.motion.reduced;
  const hasFilters = props.openOnly || props.favoriteOnly;

  const footer = (
    <View style={s.sheetFooter}>
      {hasFilters ? (
        <AnimatedPressable onPress={props.onClear} style={s.sheetFooterItem} contentStyle={s.secondaryButton} reduceMotion={reduce} accessibilityLabel={t.clearFilters}>
          <Text style={s.secondaryText}>{t.clearFilters}</Text>
        </AnimatedPressable>
      ) : null}
      <AnimatedPressable onPress={props.onClose} style={s.sheetFooterItem} contentStyle={s.primaryButton} reduceMotion={reduce} accessibilityLabel={t.done}>
        <Text style={s.primaryText}>{t.done}</Text>
      </AnimatedPressable>
    </View>
  );

  const toggle = (label: string, detail: string, icon: IconName, value: boolean, onPress: () => void) => (
    <AnimatedPressable
      onPress={onPress}
      contentStyle={[s.option, value ? s.optionActive : null]}
      reduceMotion={reduce}
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityHint={detail}
      accessibilityState={{ checked: value }}
    >
      <View style={s.optionIcon}><Ionicons name={icon} size={20} color={value ? p.accent : p.inkSoft} /></View>
      <View style={s.optionCopy}>
        <Text style={s.optionTitle}>{label}</Text>
        <Text style={s.optionDetail}>{detail}</Text>
      </View>
      <Ionicons name={value ? "checkmark-circle" : "ellipse-outline"} size={24} color={value ? p.accent : p.inkSoft} />
    </AnimatedPressable>
  );

  return (
    <BottomSheet theme={theme} open={props.open} title={t.filters} closeLabel={t.close} onClose={props.onClose} footer={footer}>
      <View style={s.sheetBody}>
        <Text style={s.sheetLabel} accessibilityRole="header">{t.filterShow}</Text>
        {toggle(t.stationsNearbyOpenNow, t.openNowFilterDetail, "time-outline", props.openOnly, props.onToggleOpenOnly)}
        {toggle(t.favoriteOnly, t.favoriteFilterDetail, "star-outline", props.favoriteOnly, props.onToggleFavoriteOnly)}

        <Text style={[s.sheetLabel, { marginTop: 12 }]} accessibilityRole="header">{t.searchRadius}</Text>
        <View accessibilityRole="radiogroup" style={{ gap: 10 }}>
          {props.radii.map((value) => {
            const km = value / 1000;
            const locked = props.isLocked(value);
            const active = props.radiusM === value;
            return (
              <AnimatedPressable
                key={value}
                onPress={() => props.onSelectRadius(value)}
                contentStyle={[s.option, active ? s.optionActive : null]}
                reduceMotion={reduce}
                accessibilityRole="radio"
                accessibilityLabel={`${km} km${locked ? `, ${t.locked}` : ""}`}
                accessibilityHint={locked ? t.radiusLockedDetail : undefined}
                accessibilityState={{ checked: active }}
              >
                <View style={s.optionIcon}>
                  <Ionicons name={locked ? "lock-closed-outline" : "navigate-circle-outline"} size={20} color={active ? p.accent : p.inkSoft} />
                </View>
                <View style={s.optionCopy}>
                  <Text style={s.optionTitle}>{km} km</Text>
                  <Text style={s.optionDetail}>{locked ? t.radiusLockedDetail : t.withinRadius(km)}</Text>
                </View>
                <Ionicons name={active ? "radio-button-on" : "radio-button-off"} size={24} color={active ? p.accent : p.inkSoft} />
              </AnimatedPressable>
            );
          })}
        </View>
      </View>
    </BottomSheet>
  );
}
