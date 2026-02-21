import React, { useMemo } from "react";
import { View } from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import type { Theme } from "../../theme/theme";
import { makeAdBarStyles } from "./AdBar.styles";

export default function AdBar(props: { theme: Theme; unitId: string }) {
  const s = useMemo(() => makeAdBarStyles(props.theme), [props.theme]);

  return (
    <View style={s.wrap}>
      <BannerAd unitId={props.unitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
    </View>
  );
}