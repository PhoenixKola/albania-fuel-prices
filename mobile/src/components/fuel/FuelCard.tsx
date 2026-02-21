import React, { useMemo } from "react";
import { ActivityIndicator, Linking, Pressable, Text, View } from "react-native";
import type { LatestEurope, CountryPrices } from "../../types/fuel";
import type { Theme } from "../../theme/theme";
import { formatPriceEur } from "../../utils/format";
import { makeFuelCardStyles } from "./FuelCard.styles";

export default function FuelCard(props: {
  theme: Theme;
  t: any;
  data: LatestEurope | null;
  selected: CountryPrices | null;
  loading: boolean;
  country: string;
  refreshing: boolean;
  onRefresh: () => void;
  onOpenCountrySearch: () => void;
}) {
  const s = useMemo(() => makeFuelCardStyles(props.theme), [props.theme]);

  const subtitle = props.loading ? <ActivityIndicator /> : null;

  return (
    <View style={s.card}>
      <View style={s.rowBetween}>
        <Text style={s.title}>{props.t.selectCountry}</Text>
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          {subtitle}
          <Pressable onPress={props.onRefresh} style={s.btnGhost} disabled={props.refreshing}>
            <Text style={s.btnGhostText}>{props.refreshing ? props.t.refreshing : props.t.refresh}</Text>
          </Pressable>
        </View>
      </View>

      <View style={s.rowBetween}>
        <Text style={s.countryName}>{props.country}</Text>
        <Pressable onPress={props.onOpenCountrySearch} style={s.btnGhost}>
          <Text style={s.btnGhostText}>{props.t.changeCountry}</Text>
        </Pressable>
      </View>

      <View style={s.grid}>
        <View style={s.tile}>
          <Text style={s.tileLabel}>{props.t.gasoline95}</Text>
          <Text style={s.tileValue}>{formatPriceEur(props.selected?.gasoline95_eur)}</Text>
        </View>

        <View style={s.tile}>
          <Text style={s.tileLabel}>{props.t.diesel}</Text>
          <Text style={s.tileValue}>{formatPriceEur(props.selected?.diesel_eur)}</Text>
        </View>

        <View style={s.tile}>
          <Text style={s.tileLabel}>{props.t.lpg}</Text>
          <Text style={s.tileValue}>{formatPriceEur(props.selected?.lpg_eur)}</Text>
        </View>
      </View>

      <View style={s.divider} />

      <Text style={s.metaLabel}>{props.t.source}</Text>
      <View style={s.rowBetween}>
        <Text style={s.metaText}>{props.data?.source ?? "—"}</Text>
        {props.data?.source_url ? (
          <Pressable onPress={() => Linking.openURL(props.data!.source_url)} style={s.linkBtn}>
            <Text style={s.linkBtnText}>{props.t.open}</Text>
          </Pressable>
        ) : null}
      </View>

      <Text style={s.mutedSmall}>
        {props.data?.fetched_at_utc ? props.t.fetchedAt(new Date(props.data.fetched_at_utc).toLocaleString()) : ""}
      </Text>
    </View>
  );
}