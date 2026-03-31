import React, { useMemo } from "react";
import { Linking, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useApp } from "../context/AppContext";
import AnimatedPressable from "../components/ui/AnimatedPressable";
import { makeSettingsStyles } from "./SettingsTab.styles";
import { makeScreenHeaderStyles } from "./screenHeader.styles";
import { PLAY_STORE_URL } from "../constants/urls";

export default function SettingsTab() {
  const ctx = useApp();
  const s = useMemo(() => makeSettingsStyles(ctx.theme), [ctx.theme]);
  const hs = useMemo(() => makeScreenHeaderStyles(ctx.theme), [ctx.theme]);

  const isDark = ctx.themeName === "dark";

  return (
    <View style={{ flex: 1, backgroundColor: ctx.theme.colors.bg }}>
      <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
        <View style={hs.header}>
          <View style={hs.iconWrap}>
            <Ionicons name="settings-outline" size={18} color={ctx.theme.colors.primary} />
          </View>
          <View>
            <Text style={hs.title}>{(ctx.t as any).settingsTitle ?? "Settings"}</Text>
            <Text style={hs.subtitle}>{(ctx.t as any).settingsSubtitle ?? "Customize your experience"}</Text>
          </View>
        </View>

        {/* Appearance */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>{(ctx.t as any).appearance ?? "Appearance"}</Text>

          <View style={s.row}>
            <View style={s.rowLeft}>
              <View style={[s.rowIconWrap, { backgroundColor: isDark ? "rgba(250,204,21,0.15)" : "rgba(99,102,241,0.12)" }]}>
                <Ionicons name={isDark ? "sunny-outline" : "moon-outline"} size={18} color={isDark ? "#FBBF24" : "#6366F1"} />
              </View>
              <View>
                <Text style={s.rowLabel}>{(ctx.t as any).darkMode ?? "Dark Mode"}</Text>
                <Text style={s.rowSubLabel}>{isDark ? ((ctx.t as any).darkModeOn ?? "On") : ((ctx.t as any).darkModeOff ?? "Off")}</Text>
              </View>
            </View>
            <View style={s.toggleRow}>
              <AnimatedPressable
                onPress={() => !isDark || ctx.toggleTheme()}
                contentStyle={[s.pill, !isDark ? s.pillActive : null]}
                scaleIn={0.97}
              >
                <Ionicons name="sunny-outline" size={14} color={!isDark ? ctx.theme.colors.primaryText : ctx.theme.colors.text} />
                <Text style={[s.pillText, !isDark ? s.pillTextActive : null]}>Light</Text>
              </AnimatedPressable>
              <AnimatedPressable
                onPress={() => isDark || ctx.toggleTheme()}
                contentStyle={[s.pill, isDark ? s.pillActive : null]}
                scaleIn={0.97}
              >
                <Ionicons name="moon-outline" size={14} color={isDark ? ctx.theme.colors.primaryText : ctx.theme.colors.text} />
                <Text style={[s.pillText, isDark ? s.pillTextActive : null]}>Dark</Text>
              </AnimatedPressable>
            </View>
          </View>

          <View style={[s.row, s.rowBorder]}>
            <View style={s.rowLeft}>
              <View style={[s.rowIconWrap, { backgroundColor: "rgba(59,130,246,0.12)" }]}>
                <Ionicons name="globe-outline" size={18} color="#3B82F6" />
              </View>
              <View>
                <Text style={s.rowLabel}>{(ctx.t as any).language ?? "Language"}</Text>
                <Text style={s.rowSubLabel}>{ctx.lang === "en" ? "English" : "Shqip"}</Text>
              </View>
            </View>
            <View style={s.toggleRow}>
              <AnimatedPressable
                onPress={() => ctx.setLang("en")}
                contentStyle={[s.pill, ctx.lang === "en" ? s.pillActive : null]}
                scaleIn={0.97}
              >
                <Text style={[s.pillText, ctx.lang === "en" ? s.pillTextActive : null]}>EN</Text>
              </AnimatedPressable>
              <AnimatedPressable
                onPress={() => ctx.setLang("sq")}
                contentStyle={[s.pill, ctx.lang === "sq" ? s.pillActive : null]}
                scaleIn={0.97}
              >
                <Text style={[s.pillText, ctx.lang === "sq" ? s.pillTextActive : null]}>SQ</Text>
              </AnimatedPressable>
            </View>
          </View>

          <View style={[s.row, s.rowBorder]}>
            <View style={s.rowLeft}>
              <View style={[s.rowIconWrap, { backgroundColor: "rgba(16,185,129,0.12)" }]}>
                <Ionicons name="cash-outline" size={18} color="#10B981" />
              </View>
              <View>
                <Text style={s.rowLabel}>{ctx.t.currency}</Text>
                <Text style={s.rowSubLabel}>
                  {ctx.effectiveCurrencyMode === "eur" ? "EUR" : ctx.currency}
                  {!ctx.canLocal && ctx.currency !== "EUR" ? " (FX unavailable)" : ""}
                </Text>
              </View>
            </View>
            <View style={s.toggleRow}>
              <AnimatedPressable
                onPress={() => ctx.setCurrencyMode("eur")}
                contentStyle={[s.pill, ctx.effectiveCurrencyMode === "eur" ? s.pillActive : null]}
                scaleIn={0.97}
              >
                <Text style={[s.pillText, ctx.effectiveCurrencyMode === "eur" ? s.pillTextActive : null]}>EUR</Text>
              </AnimatedPressable>
              <AnimatedPressable
                onPress={() => ctx.canLocal && ctx.setCurrencyMode("local")}
                contentStyle={[s.pill, ctx.effectiveCurrencyMode === "local" ? s.pillActive : null, !ctx.canLocal ? { opacity: 0.4 } : null]}
                scaleIn={0.97}
              >
                <Text style={[s.pillText, ctx.effectiveCurrencyMode === "local" ? s.pillTextActive : null]}>{ctx.currency}</Text>
              </AnimatedPressable>
            </View>
          </View>
        </View>

        {/* Data & Sources */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>{(ctx.t as any).dataSource ?? "Data & Sources"}</Text>

          <View style={s.row}>
            <View style={s.rowLeft}>
              <View style={[s.rowIconWrap, { backgroundColor: "rgba(139,92,246,0.12)" }]}>
                <Ionicons name="server-outline" size={18} color="#8B5CF6" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.rowLabel}>{ctx.t.source}</Text>
                <Text style={s.rowSubLabel} numberOfLines={2}>
                  {ctx.data?.source ?? "—"}
                </Text>
              </View>
            </View>
            {ctx.data?.source_url ? (
              <AnimatedPressable
                onPress={() => Linking.openURL(ctx.data!.source_url)}
                contentStyle={s.pill}
                scaleIn={0.97}
              >
                <Ionicons name="open-outline" size={14} color={ctx.theme.colors.text} />
                <Text style={s.pillText}>{ctx.t.open}</Text>
              </AnimatedPressable>
            ) : null}
          </View>

          <View style={[s.row, s.rowBorder]}>
            <View style={s.rowLeft}>
              <View style={[s.rowIconWrap, { backgroundColor: "rgba(245,158,11,0.12)" }]}>
                <Ionicons name="time-outline" size={18} color="#F59E0B" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.rowLabel}>{(ctx.t as any).lastUpdated ?? "Last Updated"}</Text>
                <Text style={s.rowSubLabel}>
                  {ctx.data?.as_of ?? "—"}
                  {ctx.isFromCache ? ` · ${ctx.t.showingCached}` : ""}
                </Text>
              </View>
            </View>
          </View>

          <View style={[s.row, s.rowBorder]}>
            <View style={s.rowLeft}>
              <View style={[s.rowIconWrap, { backgroundColor: "rgba(59,130,246,0.12)" }]}>
                <Ionicons name="refresh-outline" size={18} color="#3B82F6" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.rowLabel}>{ctx.t.refresh}</Text>
                <Text style={s.rowSubLabel}>
                  {ctx.data?.fetched_at_utc
                    ? ctx.t.fetchedAt(new Date(ctx.data.fetched_at_utc).toLocaleString())
                    : "—"}
                </Text>
              </View>
            </View>
            <AnimatedPressable onPress={ctx.refreshAll} contentStyle={s.pill} scaleIn={0.97}>
              <Ionicons name="refresh-outline" size={14} color={ctx.theme.colors.text} />
              <Text style={s.pillText}>{ctx.t.refresh}</Text>
            </AnimatedPressable>
          </View>
        </View>

        {/* Feedback & Support */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>{(ctx.t as any).feedbackSupport ?? "Feedback & Support"}</Text>

          <AnimatedPressable onPress={ctx.openFeedback} contentStyle={s.row} scaleIn={0.99}>
            <View style={s.rowLeft}>
              <View style={[s.rowIconWrap, { backgroundColor: "rgba(236,72,153,0.12)" }]}>
                <Ionicons name="mail-outline" size={18} color="#EC4899" />
              </View>
              <View>
                <Text style={s.rowLabel}>{ctx.t.feedback}</Text>
                <Text style={s.rowSubLabel}>{(ctx.t as any).feedbackSubtitle ?? "Send us your thoughts"}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={ctx.theme.colors.muted} />
          </AnimatedPressable>

          <AnimatedPressable onPress={ctx.openStoreReview} contentStyle={[s.row, s.rowBorder]} scaleIn={0.99}>
            <View style={s.rowLeft}>
              <View style={[s.rowIconWrap, { backgroundColor: "rgba(250,204,21,0.12)" }]}>
                <Ionicons name="star-outline" size={18} color="#FBBF24" />
              </View>
              <View>
                <Text style={s.rowLabel}>{(ctx.t as any).rateApp ?? "Rate App"}</Text>
                <Text style={s.rowSubLabel}>{(ctx.t as any).rateAppSubtitle ?? "Rate us on Google Play"}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={ctx.theme.colors.muted} />
          </AnimatedPressable>
        </View>

        {/* Footer */}
        <View style={s.footer}>
          <Text style={s.footerText}>Europe Fuel Prices</Text>
          <Text style={s.footerVersion}>{(ctx.t as any).version ?? "Version"} 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}
