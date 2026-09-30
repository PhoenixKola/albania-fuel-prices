import React, { useMemo } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Theme } from "../../theme/theme";
import AnimatedPressable from "./AnimatedPressable";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

/** Centred modal dialog: real Modal (screen-reader focus trap, Android back), scrolls at large text. */
export default function Dialog(props: {
  theme: Theme;
  open: boolean;
  title: string;
  icon: IconName;
  closeLabel: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const { theme } = props;
  const s = useMemo(() => makeStyles(theme), [theme]);

  return (
    <Modal visible={props.open} transparent animationType={theme.motion.reduced ? "none" : "fade"} statusBarTranslucent onRequestClose={props.onClose}>
      <View style={s.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={props.onClose} accessibilityRole="button" accessibilityLabel={props.closeLabel} />
        <View style={s.card} accessibilityViewIsModal>
          <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
            <View style={s.titleRow}>
              <Ionicons name={props.icon} size={20} color={theme.colors.linkText} />
              <Text style={s.title} accessibilityRole="header">{props.title}</Text>
              <AnimatedPressable onPress={props.onClose} contentStyle={s.close} reduceMotion={theme.motion.reduced} accessibilityLabel={props.closeLabel}>
                <Ionicons name="close" size={20} color={theme.colors.muted} />
              </AnimatedPressable>
            </View>
            {props.children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export const makeDialogStyles = (theme: Theme) =>
  StyleSheet.create({
    body: { gap: theme.m.s(10) },
    line: { flexDirection: "row", alignItems: "center", gap: theme.m.s(10) },
    bullet: {
      width: 32,
      height: 32,
      borderRadius: 10,
      backgroundColor: theme.colors.tile,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    text: { flex: 1, color: theme.colors.subText, fontSize: theme.m.f(14), lineHeight: theme.m.f(20), fontWeight: "700" },
    actions: { gap: theme.m.s(10), marginTop: theme.m.s(4) },
    primaryBtn: {
      minHeight: 52,
      borderRadius: 14,
      paddingVertical: theme.m.s(12),
      paddingHorizontal: theme.m.s(14),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.m.s(10),
      backgroundColor: theme.colors.primary,
    },
    primaryText: { flexShrink: 1, color: theme.colors.primaryText, fontSize: theme.m.f(15), fontWeight: "900", textAlign: "center" },
    secondaryBtn: {
      minHeight: 52,
      borderRadius: 14,
      paddingVertical: theme.m.s(12),
      paddingHorizontal: theme.m.s(14),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.m.s(10),
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    secondaryText: { flexShrink: 1, color: theme.colors.text, fontSize: theme.m.f(15), fontWeight: "900", textAlign: "center" },
  });

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    overlay: { flex: 1, backgroundColor: theme.colors.overlay, justifyContent: "center", alignItems: "center", padding: theme.m.s(18) },
    card: {
      width: "100%",
      maxWidth: 440,
      maxHeight: "90%",
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.card,
    },
    content: { padding: theme.m.s(16), gap: theme.m.s(12) },
    titleRow: { flexDirection: "row", alignItems: "center", gap: theme.m.s(10) },
    title: { flex: 1, fontSize: theme.m.f(17), lineHeight: theme.m.f(23), fontWeight: "900", color: theme.colors.text },
    close: { width: 48, height: 48, marginRight: -8, alignItems: "center", justifyContent: "center", borderRadius: 14 },
  });
