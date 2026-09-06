import React, { useMemo } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Theme } from "../../theme/theme";
import AnimatedPressable from "./AnimatedPressable";

export default function BottomSheet(props: {
  theme: Theme;
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  scroll?: boolean;
  closeLabel?: string;
}) {
  const s = useMemo(() => makeStyles(props.theme), [props.theme]);
  const body = props.scroll === false ? props.children : <ScrollView showsVerticalScrollIndicator={false}>{props.children}</ScrollView>;

  return (
    <Modal
      visible={props.open}
      transparent
      animationType={props.theme.motion.reduced ? "none" : "slide"}
      onRequestClose={props.onClose}
      statusBarTranslucent
    >
      <View style={s.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={props.onClose} accessibilityRole="button" accessibilityLabel={props.closeLabel ?? "Close"} />
        <View style={s.sheet} accessibilityViewIsModal>
          <View style={s.handle} />
          <View style={s.header}>
            <Text style={s.title} accessibilityRole="header">{props.title}</Text>
            <AnimatedPressable
              onPress={props.onClose}
              contentStyle={s.close}
              reduceMotion={props.theme.motion.reduced}
              accessibilityLabel={props.closeLabel ?? "Close"}
            >
              <Ionicons name="close" size={20} color={props.theme.colors.text} />
            </AnimatedPressable>
          </View>
          <View style={s.body}>{body}</View>
          {props.footer ? <View style={s.footer}>{props.footer}</View> : null}
        </View>
      </View>
    </Modal>
  );
}

const makeStyles = (theme: Theme) => StyleSheet.create({
  backdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: theme.colors.overlay },
  sheet: {
    maxHeight: "88%",
    backgroundColor: theme.colors.surfaceRaised,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingBottom: theme.m.s(18),
  },
  handle: { width: 42, height: 5, borderRadius: 999, backgroundColor: theme.colors.border, alignSelf: "center", marginTop: 9 },
  header: { minHeight: 64, paddingHorizontal: theme.m.s(18), flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { color: theme.colors.text, fontSize: theme.m.f(20), fontWeight: "900" },
  close: { width: 48, height: 48, borderRadius: theme.radius.md, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.pillBg },
  body: { paddingHorizontal: theme.m.s(18) },
  footer: { paddingHorizontal: theme.m.s(18), paddingTop: theme.m.s(14), borderTopWidth: 1, borderTopColor: theme.colors.border },
});
