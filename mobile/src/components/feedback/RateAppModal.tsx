import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Theme } from "../../theme/theme";
import type { TDict } from "../../i18n";
import AnimatedPressable from "../ui/AnimatedPressable";
import Dialog, { makeDialogStyles } from "../ui/Dialog";

export default function RateAppModal(props: {
  theme: Theme;
  t: TDict;
  open: boolean;
  onClose: () => void;
  onRate: () => void;
  onLater: () => void;
}) {
  const { theme, t } = props;
  const s = useMemo(() => makeDialogStyles(theme), [theme]);

  return (
    <Dialog theme={theme} open={props.open} title={t.rateTitle} icon="star-outline" closeLabel={t.close} onClose={props.onClose}>
      <Text style={s.text}>{t.rateBody}</Text>
      <View style={s.actions}>
        <AnimatedPressable onPress={props.onRate} contentStyle={s.primaryBtn} reduceMotion={theme.motion.reduced} accessibilityLabel={t.rateNow}>
          <Ionicons name="star" size={19} color={theme.colors.primaryText} />
          <Text style={s.primaryText}>{t.rateNow}</Text>
        </AnimatedPressable>
        <AnimatedPressable onPress={props.onLater} contentStyle={s.secondaryBtn} reduceMotion={theme.motion.reduced} accessibilityLabel={t.rateLater}>
          <Ionicons name="time-outline" size={19} color={theme.colors.text} />
          <Text style={s.secondaryText}>{t.rateLater}</Text>
        </AnimatedPressable>
      </View>
    </Dialog>
  );
}
