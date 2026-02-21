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
  countries: string[];
  value: string;
  onSelect: (c: string) => void;
  onClose: () => void;
}) {
  const s = useMemo(() => makeCountryModalStyles(props.theme), [props.theme]);
  const [q, setQ] = useState("");

  const items = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return props.countries;
    return props.countries.filter((c) => c.toLowerCase().includes(query));
  }, [q, props.countries]);

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
                    {active ? (
                      <View style={s.badge}>
                        <Text style={s.badgeText}>Selected</Text>
                      </View>
                    ) : null}
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