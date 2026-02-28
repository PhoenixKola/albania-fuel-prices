import React, { useMemo, useState } from "react";
import { FlatList, Modal, Pressable, Text, TextInput, View } from "react-native";
import type { Theme } from "../../theme/theme";
import { makeCountryModalStyles } from "./CountrySearchModal.styles";

export default function CountrySearchModal(props: {
  theme: Theme;
  open: boolean;
  title: string;
  placeholder: string;
  closeLabel: string;
  selectedLabel: string;
  countries: string[];
  value: string;
  favorites?: string[];
  onToggleFavorite?: (c: string) => void;
  onSelect: (c: string) => void;
  onClose: () => void;
}) {
  const s = useMemo(() => makeCountryModalStyles(props.theme), [props.theme]);
  const [q, setQ] = useState("");

  const favSet = useMemo(() => new Set(props.favorites ?? []), [props.favorites]);

  const items = useMemo(() => {
    const query = q.trim().toLowerCase();
    const base = !query ? props.countries : props.countries.filter((c) => c.toLowerCase().includes(query));
    const fav = base.filter((c) => favSet.has(c));
    const rest = base.filter((c) => !favSet.has(c));
    return [...fav, ...rest];
  }, [q, props.countries, favSet]);

  return (
    <Modal visible={props.open} transparent animationType="slide" onRequestClose={props.onClose}>
      <Pressable style={s.overlay} onPress={props.onClose}>
        <Pressable style={s.sheet} onPress={() => {}}>
          <View style={s.headerRow}>
            <Text style={s.title}>{props.title}</Text>
            <Pressable onPress={props.onClose} style={s.closeBtn}>
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
          />

          <View style={s.list}>
            <FlatList
              data={items}
              keyExtractor={(x) => x}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item, index }) => {
                const active = item === props.value;
                const isLast = index === items.length - 1;
                const isFav = favSet.has(item);

                return (
                  <Pressable
                    onPress={() => props.onSelect(item)}
                    style={[
                      s.row,
                      isLast ? { borderBottomWidth: 0 } : null,
                      active ? { backgroundColor: props.theme.colors.tile } : null,
                    ]}
                  >
                    <Text style={s.rowText}>{item}</Text>

                    <View style={s.right}>
                      {props.onToggleFavorite ? (
                        <Pressable onPress={() => props.onToggleFavorite?.(item)} style={s.starBtn}>
                          <Text style={[s.starText, isFav ? s.starOn : s.starOff]}>{isFav ? "★" : "☆"}</Text>
                        </Pressable>
                      ) : null}

                      {active ? (
                        <View style={s.badge}>
                          <Text style={s.badgeText}>{props.selectedLabel}</Text>
                        </View>
                      ) : null}
                    </View>
                  </Pressable>
                );
              }}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}