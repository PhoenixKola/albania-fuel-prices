import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Theme } from "../../theme/theme";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

export default function PremiumHeader(props: {
  theme: Theme;
  eyebrow: string;
  title: string;
  subtitle: string;
  icon: IconName;
  action?: React.ReactNode;
}) {
  const s = useMemo(() => makeStyles(props.theme), [props.theme]);
  return (
    <View style={s.header}>
      <View style={s.iconWrap} accessibilityElementsHidden>
        <Ionicons name={props.icon} size={22} color={props.theme.colors.primary} />
      </View>
      <View style={s.copy}>
        <Text style={s.eyebrow}>{props.eyebrow}</Text>
        <Text style={s.title} accessibilityRole="header">{props.title}</Text>
        <Text style={s.subtitle}>{props.subtitle}</Text>
      </View>
      {props.action}
    </View>
  );
}

const makeStyles = (theme: Theme) => StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: theme.m.s(12), paddingVertical: theme.m.s(4) },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.accentSoft,
    borderWidth: 1,
    borderColor: theme.name === "light" ? "rgba(15,118,110,0.14)" : "rgba(45,212,191,0.18)",
  },
  copy: { flex: 1, minWidth: 0 },
  eyebrow: { color: theme.colors.primary, fontSize: theme.m.f(10), fontWeight: "900", letterSpacing: 1.1, textTransform: "uppercase" },
  title: { marginTop: 2, color: theme.colors.text, fontSize: theme.m.f(24), lineHeight: theme.m.f(29), fontWeight: "900" },
  subtitle: { marginTop: 3, color: theme.colors.muted, fontSize: theme.m.f(12), lineHeight: theme.m.f(17), fontWeight: "700" },
});
