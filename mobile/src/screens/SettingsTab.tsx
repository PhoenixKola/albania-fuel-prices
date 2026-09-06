import React, { useMemo, useState } from "react";
import { Linking, ScrollView, Share, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useApp } from "../context/AppContext";
import type { ThemePreference } from "../hooks/useTheme";
import PremiumHeader from "../components/ui/PremiumHeader";
import BottomSheet from "../components/ui/BottomSheet";
import AnimatedPressable from "../components/ui/AnimatedPressable";
import { makeSettingsStyles } from "./SettingsTab.styles";
import { PLAY_STORE_URL } from "../constants/urls";

declare const require: (name: string) => any;
const PRIVACY_URL = "https://karburantisot.com/privacy";
const TERMS_URL = "https://karburantisot.com/terms";

async function openUrl(url: string) {
  try {
    const supported = await Linking.canOpenURL(url);
    if (!supported) return false;
    await Linking.openURL(url);
    return true;
  } catch {
    return false;
  }
}

function appVersion() {
  try { return require("expo-constants").default?.expoConfig?.version ?? ""; } catch { return ""; }
}

export default function SettingsTab() {
  const ctx = useApp();
  const s = useMemo(() => makeSettingsStyles(ctx.theme), [ctx.theme]);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const version = useMemo(appVersion, []);
  const sourceUrl = ctx.data?.source_url ?? null;
  const dataUnavailable = !!ctx.error && !ctx.data;
  const dataStatus = dataUnavailable ? ctx.t.dataUnavailable : ctx.isFromCache ? ctx.t.cachedData : ctx.t.liveData;
  const healthColor = dataUnavailable ? ctx.theme.colors.danger : ctx.isFromCache ? ctx.theme.colors.warning : ctx.theme.colors.success;

  const themeOptions: Array<{ value: ThemePreference; label: string; icon: React.ComponentProps<typeof Ionicons>["name"] }> = [
    { value: "system", label: ctx.t.themeSystem, icon: "phone-portrait-outline" },
    { value: "light", label: ctx.t.themeLight, icon: "sunny-outline" },
    { value: "dark", label: ctx.t.themeDark, icon: "moon-outline" },
  ];

  const shareApp = async () => {
    try { await Share.share({ message: `${ctx.t.shareAppMessage} ${PLAY_STORE_URL}` }); } catch {}
  };
  const openExternal = async (url: string) => {
    if (!await openUrl(url)) ctx.showToast(ctx.t.linkUnavailable);
  };

  return (
    <View style={s.screen}>
      <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
        <PremiumHeader theme={ctx.theme} eyebrow={ctx.t.preferences} title={ctx.t.settingsTitle} subtitle={ctx.t.settingsSubtitle} icon="settings-outline" />

        <View style={s.appearanceCard}>
          <View style={s.appearanceHeader}>
            <View><Text style={s.cardKicker}>{ctx.t.appearance}</Text><Text style={s.cardTitle}>{ctx.themePreference === "system" ? ctx.t.followDeviceTheme : ctx.themePreference === "dark" ? ctx.t.themeDark : ctx.t.themeLight}</Text></View>
            <View style={s.appearanceIcon}><Ionicons name={ctx.themeName === "dark" ? "moon" : "sunny"} size={27} color={ctx.theme.colors.primary} /></View>
          </View>
          <View style={s.themeOptions} accessibilityRole="tablist">
            {themeOptions.map((option) => {
              const active = ctx.themePreference === option.value;
              return <AnimatedPressable key={option.value} onPress={() => ctx.setThemePreference(option.value)} style={s.themeItem} contentStyle={[s.themeButton, active ? s.themeButtonActive : null]} accessibilityRole="tab" accessibilityState={{ selected: active }} accessibilityLabel={option.label} reduceMotion={ctx.theme.motion.reduced}>
                <Ionicons name={option.icon} size={18} color={active ? ctx.theme.colors.primary : ctx.theme.colors.muted} /><Text style={[s.themeText, active ? s.themeTextActive : null]} numberOfLines={1}>{option.label}</Text>
              </AnimatedPressable>;
            })}
          </View>
        </View>

        <Section title={ctx.t.preferences}>
          <SettingsRow icon="language-outline" tone="blue" label={ctx.t.language} detail={ctx.t.chooseLanguage} value={ctx.lang === "en" ? "English" : "Shqip"} onPress={() => setLanguageOpen(true)} />
          <Divider />
          <SettingsRow icon="cash-outline" tone="green" label={ctx.t.currency} detail={ctx.t.chooseCurrency} value={ctx.effectiveCurrencyMode === "eur" ? "EUR" : ctx.currency} onPress={() => setCurrencyOpen(true)} />
        </Section>

        <View style={s.dataCard}>
          <View style={s.dataHeader}>
            <View style={s.dataTitleRow}><View style={[s.healthDot, { backgroundColor: healthColor }]} /><View><Text style={s.cardKicker}>{ctx.t.dataHealth}</Text><Text style={s.dataStatus}>{dataStatus}</Text></View></View>
            <AnimatedPressable onPress={ctx.refreshAll} disabled={ctx.refreshing} contentStyle={s.refreshButton} accessibilityLabel={ctx.t.refresh} accessibilityState={{ disabled: ctx.refreshing }} reduceMotion={ctx.theme.motion.reduced}><Ionicons name="refresh" size={19} color={ctx.theme.colors.primary} /></AnimatedPressable>
          </View>
          <View style={s.dataRows}>
            <DataRow label={ctx.t.source} value={ctx.data?.source ?? "—"} />
            <DataRow label={ctx.t.lastUpdated} value={ctx.data?.as_of ?? "—"} />
            <DataRow label={ctx.t.lastSync} value={ctx.data?.fetched_at_utc ? new Date(ctx.data.fetched_at_utc).toLocaleString() : "—"} />
          </View>
          {sourceUrl ? <AnimatedPressable onPress={() => openExternal(sourceUrl)} contentStyle={s.sourceButton} accessibilityLabel={ctx.t.openSource}><Ionicons name="open-outline" size={17} color={ctx.theme.colors.text} /><Text style={s.sourceButtonText}>{ctx.t.openSource}</Text></AnimatedPressable> : null}
        </View>

        <Section title={ctx.t.appSupport}>
          <SettingsRow icon="mail-outline" tone="pink" label={ctx.t.feedback} detail={ctx.t.feedbackSubtitle} onPress={ctx.openFeedback} />
          <Divider />
          <SettingsRow icon="star-outline" tone="amber" label={ctx.t.rateApp} detail={ctx.t.rateAppSubtitle} onPress={ctx.openStoreReview} />
          <Divider />
          <SettingsRow icon="share-social-outline" tone="teal" label={ctx.t.shareApp} detail={ctx.t.shareAppSubtitle} onPress={shareApp} />
        </Section>

        <Section title={ctx.t.aboutSection}>
          <SettingsRow icon="shield-checkmark-outline" tone="violet" label={ctx.t.privacyPolicy} detail={ctx.t.privacyPolicySubtitle} external onPress={() => openExternal(PRIVACY_URL)} />
          <Divider />
          <SettingsRow icon="document-text-outline" tone="slate" label={ctx.t.termsOfUse} detail={ctx.t.termsOfUseSubtitle} external onPress={() => openExternal(TERMS_URL)} />
        </Section>

        <View style={s.footer}><Text style={s.footerBrand}>Karburanti Sot</Text>{version ? <Text style={s.footerVersion}>{ctx.t.version} {version}</Text> : null}</View>
      </ScrollView>

      <BottomSheet theme={ctx.theme} open={languageOpen} title={ctx.t.chooseLanguage} closeLabel={ctx.t.close} onClose={() => setLanguageOpen(false)}>
        <View style={s.sheetOptions}>
          <SheetOption label="English" detail="EN" selected={ctx.lang === "en"} onPress={() => { ctx.setLang("en"); setLanguageOpen(false); }} />
          <SheetOption label="Shqip" detail="AL" selected={ctx.lang === "sq"} onPress={() => { ctx.setLang("sq"); setLanguageOpen(false); }} />
        </View>
      </BottomSheet>

      <BottomSheet theme={ctx.theme} open={currencyOpen} title={ctx.t.chooseCurrency} closeLabel={ctx.t.close} onClose={() => setCurrencyOpen(false)}>
        <View style={s.sheetOptions}>
          <SheetOption label="Euro" detail="EUR" selected={ctx.effectiveCurrencyMode === "eur"} onPress={() => { ctx.setCurrencyMode("eur"); setCurrencyOpen(false); }} />
          <SheetOption label={ctx.t.currencyLocal} detail={ctx.currency} selected={ctx.effectiveCurrencyMode === "local"} disabled={!ctx.canLocal} helper={!ctx.canLocal ? ctx.t.fxUnavailable : undefined} onPress={() => { ctx.setCurrencyMode("local"); setCurrencyOpen(false); }} />
        </View>
      </BottomSheet>
    </View>
  );

  function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return <View><Text style={s.sectionTitle}>{title}</Text><View style={s.section}>{children}</View></View>;
  }
  function Divider() { return <View style={s.divider} />; }
  function SettingsRow(props: { icon: React.ComponentProps<typeof Ionicons>["name"]; tone: keyof ReturnType<typeof toneStyle>; label: string; detail: string; value?: string; external?: boolean; onPress: () => void }) {
    const tones = toneStyle();
    return <AnimatedPressable onPress={props.onPress} contentStyle={s.row} accessibilityLabel={`${props.label}${props.value ? `, ${props.value}` : ""}`} reduceMotion={ctx.theme.motion.reduced}>
      <View style={[s.rowIcon, { backgroundColor: tones[props.tone].bg }]}><Ionicons name={props.icon} size={20} color={tones[props.tone].fg} /></View>
      <View style={s.rowCopy}><Text style={s.rowLabel}>{props.label}</Text><Text style={s.rowDetail} numberOfLines={2}>{props.detail}</Text></View>
      {props.value ? <Text style={s.rowValue} numberOfLines={1}>{props.value}</Text> : null}<Ionicons name={props.external ? "open-outline" : "chevron-forward"} size={17} color={ctx.theme.colors.muted} />
    </AnimatedPressable>;
  }
  function DataRow({ label, value }: { label: string; value: string }) { return <View style={s.dataRow}><Text style={s.dataLabel}>{label}</Text><Text style={s.dataValue} numberOfLines={2}>{value}</Text></View>; }
  function SheetOption(props: { label: string; detail: string; selected: boolean; disabled?: boolean; helper?: string; onPress: () => void }) {
    return <AnimatedPressable onPress={props.onPress} disabled={props.disabled} contentStyle={[s.sheetOption, props.selected ? s.sheetSelected : null, props.disabled ? s.disabled : null]} accessibilityLabel={`${props.label}, ${props.detail}${props.helper ? `, ${props.helper}` : ""}`} accessibilityState={{ selected: props.selected, disabled: props.disabled }}>
      <View style={s.sheetOptionCopy}><Text style={s.sheetOptionLabel}>{props.label}</Text><Text style={s.sheetOptionDetail}>{props.helper ?? props.detail}</Text></View>{props.selected ? <Ionicons name="checkmark-circle" size={23} color={ctx.theme.colors.primary} /> : <Ionicons name="ellipse-outline" size={23} color={ctx.theme.colors.muted} />}
    </AnimatedPressable>;
  }
  function toneStyle() {
    return {
      blue: { bg: "rgba(2,132,199,0.13)", fg: ctx.theme.colors.info }, green: { bg: "rgba(16,185,129,0.13)", fg: ctx.theme.colors.success }, pink: { bg: "rgba(236,72,153,0.13)", fg: "#EC4899" }, amber: { bg: "rgba(245,158,11,0.14)", fg: ctx.theme.colors.warning }, teal: { bg: ctx.theme.colors.accentSoft, fg: ctx.theme.colors.primary }, violet: { bg: "rgba(124,58,237,0.13)", fg: "#8B5CF6" }, slate: { bg: themeSlate(ctx.theme.name), fg: ctx.theme.colors.muted },
    };
  }
}

function themeSlate(name: "light" | "dark") { return name === "light" ? "rgba(71,85,105,0.10)" : "rgba(148,163,184,0.12)"; }
