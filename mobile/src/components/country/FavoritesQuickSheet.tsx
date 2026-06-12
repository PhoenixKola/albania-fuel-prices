import React, { useMemo } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Theme } from "../../theme/theme";
import { getFlagForCountry } from "../../utils/countryFlag";

type Props = {
  theme: Theme;
  open: boolean;
  currentCountry: string;
  favorites: string[];
  closeLabel: string;
  onSelect: (c: string) => void;
  onOpenFull: () => void;
  onClose: () => void;
};

export default function FavoritesQuickSheet({
  theme,
  open,
  currentCountry,
  favorites,
  closeLabel,
  onSelect,
  onOpenFull,
  onClose,
}: Props) {
  const s = useMemo(() => makeStyles(theme), [theme]);

  // Favorites excluding the current country (current always shown separately at top)
  const favList = useMemo(
    () => favorites.filter((c) => c !== currentCountry),
    [favorites, currentCountry]
  );

  function Row({ country, isCurrent }: { country: string; isCurrent?: boolean }) {
    return (
      <Pressable
        style={[s.row, isCurrent ? s.rowActive : null]}
        onPress={() => {
          onSelect(country);
          onClose();
        }}
      >
        <Text style={s.rowFlag}>{getFlagForCountry(country) || "•"}</Text>
        <Text style={s.rowName} numberOfLines={1}>{country}</Text>
        {isCurrent ? (
          <View style={s.currentBadge}>
            <Text style={s.currentBadgeText}>Selected</Text>
          </View>
        ) : null}
      </Pressable>
    );
  }

  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={s.overlay} onPress={onClose}>
        <Pressable style={s.sheet} onPress={() => {}}>
          <View style={s.handle} />

          <View style={s.headerRow}>
            <Text style={s.title}>Quick switch</Text>
            <Pressable onPress={onClose} style={s.closeBtn}>
              <Text style={s.closeText}>{closeLabel}</Text>
            </Pressable>
          </View>

          <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
            <Text style={s.sectionLabel}>Current</Text>
            <View style={s.list}>
              <Row country={currentCountry} isCurrent />
            </View>

            {favList.length > 0 ? (
              <>
                <Text style={s.sectionLabel}>Favorites</Text>
                <View style={s.list}>
                  {favList.map((c, i) => (
                    <View key={c}>
                      {i > 0 ? <View style={s.divider} /> : null}
                      <Row country={c} />
                    </View>
                  ))}
                </View>
              </>
            ) : (
              <Text style={s.emptyHint}>
                Star countries from the search to add favorites here.
              </Text>
            )}
          </ScrollView>

          <Pressable style={s.searchBtn} onPress={onOpenFull}>
            <Ionicons name="search" size={16} color={theme.colors.muted} />
            <Text style={s.searchBtnText}>Search all countries</Text>
            <Ionicons name="chevron-forward" size={15} color={theme.colors.muted} />
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: theme.colors.overlay,
      justifyContent: "flex-end",
    },
    sheet: {
      backgroundColor: theme.colors.bg,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 16,
      paddingBottom: 36,
      borderTopWidth: 1,
      borderColor: theme.colors.border,
      maxHeight: "70%",
    },
    handle: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.colors.border,
      alignSelf: "center",
      marginBottom: 14,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    title: {
      fontSize: 16,
      fontWeight: "800",
      color: theme.colors.text,
    },
    closeBtn: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 12,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    closeText: {
      fontSize: 13,
      fontWeight: "800",
      color: theme.colors.text,
    },
    sectionLabel: {
      fontSize: 11,
      fontWeight: "700",
      color: theme.colors.muted,
      textTransform: "uppercase",
      letterSpacing: 0.8,
      marginBottom: 6,
      marginTop: 4,
    },
    list: {
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.card,
      overflow: "hidden",
      marginBottom: 12,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginHorizontal: 12,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 13,
      paddingHorizontal: 14,
      gap: 12,
    },
    rowActive: {
      backgroundColor: theme.colors.tile,
    },
    rowFlag: {
      fontSize: 22,
    },
    rowName: {
      flex: 1,
      fontSize: 15,
      fontWeight: "700",
      color: theme.colors.text,
    },
    currentBadge: {
      paddingVertical: 3,
      paddingHorizontal: 10,
      borderRadius: 999,
      backgroundColor: theme.colors.pillBg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    currentBadgeText: {
      fontSize: 11,
      fontWeight: "800",
      color: theme.colors.muted,
    },
    emptyHint: {
      fontSize: 13,
      color: theme.colors.muted,
      textAlign: "center",
      paddingVertical: 20,
      paddingHorizontal: 8,
    },
    searchBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingVertical: 13,
      paddingHorizontal: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.card,
      marginTop: 4,
    },
    searchBtnText: {
      flex: 1,
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.muted,
    },
  });
