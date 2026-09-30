import React, { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import type { Theme } from "../../theme/theme";
import type { TDict } from "../../i18n";
import { getFlagForCountry } from "../../utils/countryFlag";
import BottomSheet from "../ui/BottomSheet";
import AnimatedPressable from "../ui/AnimatedPressable";
import type { CompareStyles, ComparePalette } from "./compare.styles";

export type CompareSet = { id: string; name: string; countries: string[]; savedAtUtc: string };

const STORAGE_COMPARE_SETS_KEY = "compare_saved_sets_v1";
const MAX_SETS = 30;
const MAX_NAME = 40;

/** Drops malformed entries and duplicate countries left by older versions or partial writes. */
function parseSets(raw: string | null): CompareSet[] {
  if (!raw) return [];
  try {
    const value = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    return value
      .filter((set) => set && typeof set.id === "string" && typeof set.name === "string" && set.name.trim() && Array.isArray(set.countries))
      .map((set) => ({
        id: set.id,
        name: set.name.trim().slice(0, MAX_NAME),
        countries: Array.from(new Set<string>(set.countries.filter((c: unknown) => typeof c === "string"))),
        savedAtUtc: typeof set.savedAtUtc === "string" ? set.savedAtUtc : "",
      }))
      .filter((set) => set.countries.length > 0)
      .slice(0, MAX_SETS);
  } catch {
    return [];
  }
}

export default function SavedComparisonsSheet(props: {
  theme: Theme;
  t: TDict;
  s: CompareStyles;
  p: ComparePalette;
  open: boolean;
  current: string[];
  onApply: (countries: string[]) => void;
  onSaved: (name: string) => void;
  onClose: () => void;
}) {
  const { theme, t, s, p } = props;
  const reduce = theme.motion.reduced;
  const [sets, setSets] = useState<CompareSet[]>([]);
  const [name, setName] = useState("");

  // Re-read on every open so another screen or an older write never shows stale sets.
  useEffect(() => {
    if (!props.open) return;
    setName("");
    AsyncStorage.getItem(STORAGE_COMPARE_SETS_KEY).then((raw) => setSets(parseSets(raw))).catch(() => {});
  }, [props.open]);

  const trimmed = name.trim();
  const enoughMarkets = props.current.length >= 2;
  const canSave = enoughMarkets && !!trimmed;
  const replaces = !!trimmed && sets.some((set) => set.name.toLocaleLowerCase() === trimmed.toLocaleLowerCase());

  const persist = (next: CompareSet[]) => {
    setSets(next);
    AsyncStorage.setItem(STORAGE_COMPARE_SETS_KEY, JSON.stringify(next)).catch(() => {});
  };

  const save = () => {
    if (!canSave) return;
    const entry: CompareSet = { id: `${Date.now()}`, name: trimmed, countries: [...props.current], savedAtUtc: new Date().toISOString() };
    const rest = sets.filter((set) => set.name.toLocaleLowerCase() !== trimmed.toLocaleLowerCase());
    persist([entry, ...rest].slice(0, MAX_SETS));
    setName("");
    props.onSaved(trimmed);
  };

  return (
    <BottomSheet theme={theme} open={props.open} title={t.savedComparisons} closeLabel={t.close} onClose={props.onClose} avoidKeyboard>
      <View style={s.sheetBody}>
        <Text style={s.sheetLabel} accessibilityRole="header">{t.saveThisComparison}</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={t.setNamePlaceholder}
          placeholderTextColor={p.inkSoft}
          style={s.input}
          maxLength={MAX_NAME}
          returnKeyType="done"
          onSubmitEditing={save}
          editable={enoughMarkets}
          accessibilityLabel={t.saveThisComparison}
          accessibilityHint={!enoughMarkets ? t.saveTwoCountries : undefined}
        />
        {!enoughMarkets ? <Text style={s.helper}>{t.saveTwoCountries}</Text> : replaces ? <Text style={s.helper}>{t.setNameReplaces}</Text> : null}
        <AnimatedPressable
          onPress={save}
          disabled={!canSave}
          contentStyle={[s.primaryButton, !canSave ? s.disabled : null]}
          reduceMotion={reduce}
          accessibilityLabel={t.save}
        >
          <Ionicons name="bookmark-outline" size={19} color={p.onAccent} />
          <Text style={s.primaryText}>{t.save}</Text>
        </AnimatedPressable>

        <View style={s.sheetDivider} />
        <Text style={s.sheetLabel} accessibilityRole="header">{t.savedComparisons}</Text>
        {sets.length ? (
          sets.map((set) => (
            <View key={set.id} style={s.setRow}>
              <View style={s.setTop}>
                <View style={s.setCopy} accessible accessibilityLabel={`${set.name}: ${set.countries.join(", ")}`}>
                  <Text style={s.setName}>{set.name}</Text>
                  <Text style={s.setCountries}>{set.countries.map((c) => `${getFlagForCountry(c)} ${c}`.trim()).join("  ·  ")}</Text>
                </View>
                <View style={s.setActions}>
                  <AnimatedPressable
                    onPress={() => props.onApply(set.countries)}
                    style={theme.m.isLargeText ? { flexGrow: 1 } : undefined}
                    contentStyle={s.setOpen}
                    reduceMotion={reduce}
                    accessibilityLabel={t.openSetA11y(set.name)}
                  >
                    <Ionicons name="open-outline" size={17} color={p.accent} />
                    <Text style={s.setOpenText}>{t.open}</Text>
                  </AnimatedPressable>
                  <AnimatedPressable
                    onPress={() => persist(sets.filter((item) => item.id !== set.id))}
                    contentStyle={s.setDelete}
                    reduceMotion={reduce}
                    accessibilityLabel={t.deleteSetA11y(set.name)}
                  >
                    <Ionicons name="trash-outline" size={19} color={p.rise} />
                  </AnimatedPressable>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text style={s.emptySets}>{t.noSavedSets}</Text>
        )}
      </View>
    </BottomSheet>
  );
}
