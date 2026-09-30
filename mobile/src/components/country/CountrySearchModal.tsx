import React, { useMemo, useState } from "react";
import { FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Theme } from "../../theme/theme";
import { getFlagForCountry } from "../../utils/countryFlag";
import { makeCountryModalStyles } from "./CountrySearchModal.styles";

export default function CountrySearchModal(props: {
  theme: Theme;
  open: boolean;
  title: string;
  placeholder: string;
  closeLabel: string;
  selectedLabel: string;
  saveLabel?: (country: string) => string;
  unsaveLabel?: (country: string) => string;
  countries: string[];
  value: string;
  favorites?: string[];
  onToggleFavorite?: (c: string) => void;
  onSelect: (c: string) => void;
  onClose: () => void;
  /** Countries already chosen: shown with a badge and not selectable again. */
  added?: string[];
  addedLabel?: string;
  /** Countries that cannot be chosen, with the reason shown on the row. */
  unavailable?: string[];
  unavailableLabel?: string;
  emptyLabel?: string;
}) {
  const s = useMemo(() => makeCountryModalStyles(props.theme), [props.theme]);
  const insets = useSafeAreaInsets();
  const [q, setQ] = useState("");

  React.useEffect(() => {
    if (props.open) setQ("");
  }, [props.open]);

  const favSet = useMemo(() => new Set(props.favorites ?? []), [props.favorites]);
  const addedSet = useMemo(() => new Set(props.added ?? []), [props.added]);
  const unavailableSet = useMemo(() => new Set(props.unavailable ?? []), [props.unavailable]);

  const items = useMemo(() => {
    const query = q.trim().toLowerCase();
    const base = !query ? props.countries : props.countries.filter((c) => c.toLowerCase().includes(query));
    const fav = base.filter((c) => favSet.has(c));
    const rest = base.filter((c) => !favSet.has(c));
    return [...fav, ...rest];
  }, [q, props.countries, favSet]);

  return (
    <Modal
      visible={props.open}
      transparent
      animationType={props.theme.motion.reduced ? "none" : "slide"}
      statusBarTranslucent
      onRequestClose={props.onClose}
    >
      <KeyboardAvoidingView style={s.overlay} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <Pressable style={s.backdrop} onPress={props.onClose} accessibilityRole="button" accessibilityLabel={props.closeLabel} />
        <View style={[s.sheet, { paddingBottom: props.theme.m.s(18) + insets.bottom }]} accessibilityViewIsModal>
          <View style={s.headerRow}>
            <Text style={s.title} accessibilityRole="header">{props.title}</Text>
            <Pressable
              onPress={props.onClose}
              style={s.closeBtn}
              accessibilityRole="button"
              accessibilityLabel={props.closeLabel}
            >
              <Text style={s.closeText}>{props.closeLabel}</Text>
            </Pressable>
          </View>

          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder={props.placeholder}
            placeholderTextColor={props.theme.colors.muted}
            style={s.input}
            autoCorrect={false}
            autoCapitalize="none"
            accessibilityLabel={props.placeholder}
          />

          <View style={s.list}>
            <FlatList
              data={items}
              keyExtractor={(x) => x}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              contentContainerStyle={{ paddingBottom: 6 }}
              ListEmptyComponent={props.emptyLabel ? <Text style={s.empty}>{props.emptyLabel}</Text> : null}
              renderItem={({ item, index }) => {
                const active = item === props.value;
                const isAdded = addedSet.has(item);
                const isUnavailable = !isAdded && unavailableSet.has(item);
                const disabled = isAdded || isUnavailable;
                const isLast = index === items.length - 1;
                const isFav = favSet.has(item);
                const badge = isAdded ? props.addedLabel : isUnavailable ? props.unavailableLabel : active ? props.selectedLabel : null;

                return (
                  <Pressable
                    onPress={() => props.onSelect(item)}
                    disabled={disabled}
                    accessibilityRole="button"
                    accessibilityLabel={badge ? `${item}, ${badge}` : item}
                    accessibilityState={{ selected: active || isAdded, disabled }}
                    style={({ pressed }) => [
                      s.row,
                      isLast ? { borderBottomWidth: 0 } : null,
                      active || isAdded ? { backgroundColor: props.theme.colors.tile } : null,
                      pressed && !disabled ? { backgroundColor: props.theme.colors.pillBg } : null,
                    ]}
                  >
                    <Text style={s.flag} accessibilityElementsHidden importantForAccessibility="no">{getFlagForCountry(item) || "•"}</Text>
                    <View style={s.rowCopy}>
                      <Text style={[s.rowText, isUnavailable ? s.rowTextMuted : null]}>{item}</Text>
                      {badge ? <Text style={s.badgeText}>{badge}</Text> : null}
                    </View>

                    {props.onToggleFavorite ? (
                      <Pressable
                        onPress={() => props.onToggleFavorite?.(item)}
                        style={s.starBtn}
                        accessibilityRole="button"
                        accessibilityLabel={(isFav ? props.unsaveLabel : props.saveLabel)?.(item) ?? item}
                        accessibilityState={{ selected: isFav }}
                      >
                        <Text style={[s.starText, isFav ? s.starOn : s.starOff]}>{isFav ? "★" : "☆"}</Text>
                      </Pressable>
                    ) : null}
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
