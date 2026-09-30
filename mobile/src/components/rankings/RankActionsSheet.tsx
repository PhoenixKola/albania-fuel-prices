import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { Theme } from "../../theme/theme";
import type { TDict } from "../../i18n";
import type { RankRow } from "../../hooks/useRankingsModel";
import BottomSheet from "../ui/BottomSheet";
import AnimatedPressable from "../ui/AnimatedPressable";
import type { RankingStyles, RankingsPalette } from "./rankings.styles";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

type Props = {
  theme: Theme;
  t: TDict;
  s: RankingStyles;
  p: RankingsPalette;
  /** Kept after closing so the sheet's content doesn't blank out during the close animation. */
  row: RankRow | null;
  open: boolean;
  subtitle: string;
  isMine: boolean;
  isFavorite: boolean;
  inCompare: boolean;
  compareFull: boolean;
  compareFullDetail: string;
  onSetMine: (country: string) => void;
  onAddCompare: (country: string) => void;
  onToggleFavorite: (country: string) => void;
  onClose: () => void;
};

export default function RankActionsSheet(props: Props) {
  const { theme, t, s, p, row } = props;
  const reduce = theme.motion.reduced;

  const option = (key: string, icon: IconName, title: string, detail: string | null, disabled: boolean, onPress: () => void, selected?: boolean) => (
    <AnimatedPressable
      key={key}
      onPress={onPress}
      disabled={disabled}
      contentStyle={[s.option, disabled ? s.disabled : null]}
      reduceMotion={reduce}
      accessibilityLabel={detail ? `${title}, ${detail}` : title}
      accessibilityState={selected != null ? { selected } : undefined}
    >
      <View style={s.optionIcon}><Ionicons name={icon} size={20} color={disabled ? p.inkSoft : p.accent} /></View>
      <View style={s.optionCopy}>
        <Text style={s.optionTitle}>{title}</Text>
        {detail ? <Text style={s.optionDetail}>{detail}</Text> : null}
      </View>
    </AnimatedPressable>
  );

  return (
    <BottomSheet theme={theme} open={props.open && !!row} title={row ? `${row.flag} ${row.country}`.trim() : ""} closeLabel={t.close} onClose={props.onClose}>
      {row ? (
        <View style={s.sheetBody}>
          <Text style={s.sheetSub}>{props.subtitle}</Text>
          {option("mine", props.isMine ? "location" : "location-outline", props.isMine ? t.yourMarket : t.setAsMyMarket, null, props.isMine, () => props.onSetMine(row.country), props.isMine)}
          {option(
            "compare",
            "git-compare-outline",
            t.addToCompare,
            props.inCompare ? t.inCompare : props.compareFull ? props.compareFullDetail : null,
            props.inCompare || props.compareFull,
            () => props.onAddCompare(row.country)
          )}
          {option(
            "favorite",
            props.isFavorite ? "star" : "star-outline",
            props.isFavorite ? t.removeFromFavorites : t.addToFavorites,
            null,
            false,
            () => props.onToggleFavorite(row.country),
            props.isFavorite
          )}
        </View>
      ) : null}
    </BottomSheet>
  );
}
