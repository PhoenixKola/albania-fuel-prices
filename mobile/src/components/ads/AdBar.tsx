import React, { useMemo } from "react";
import { View } from "react-native";
import type { Theme } from "../../theme/theme";
import { ADS_ENABLED } from "../../constants/ads";
import { makeAdBarStyles } from "./AdBar.styles";

declare const require: (name: string) => any;

export default function AdBar(props: { theme: Theme; unitId: string }) {
  const s = useMemo(() => makeAdBarStyles(props.theme), [props.theme]);
  if (!ADS_ENABLED || !props.unitId) return null;

  const { BannerAd, BannerAdSize } = require("react-native-google-mobile-ads");

  return (
    <View style={s.wrap}>
      <BannerAd unitId={props.unitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
    </View>
  );
}
