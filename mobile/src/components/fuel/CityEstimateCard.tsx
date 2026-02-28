import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

import type { Theme } from "../../theme/theme";
import type { CountryPrices, FuelType } from "../../types/fuel";
import { formatBias } from "../../utils/format";
import { getFuelPrice, fuelLabel } from "../../utils/fuel";
import SegmentedControl from "../ui/SegmentedControl";
import AnimatedPressable from "../ui/AnimatedPressable";
import { makeCityEstimateStyles } from "./CityEstimateCard.styles";
import { CurrencyMode, formatFuelPrice } from "../../utils/priceDisplay";

const CITY_PRESETS: { name: string; adj: number }[] = [
  { name: "Tirana", adj: 0 },
  { name: "Durrës", adj: -0.01 },
  { name: "Vlorë", adj: 0.01 },
  { name: "Shkodër", adj: -0.01 },
  { name: "Fier", adj: -0.01 },
  { name: "Elbasan", adj: 0 },
  { name: "Korçë", adj: 0.01 },
  { name: "Berat", adj: 0 }
];

export default function CityEstimateCard(props: {
  theme: Theme;
  t: any;
  base: CountryPrices | null;
  fuelType: FuelType;
  setFuelType: (v: FuelType | ((p: FuelType) => FuelType)) => void;
  city: string;
  setCity: (v: string | ((p: string) => string)) => void;
  bias: number;
  setBias: (v: number | ((p: number) => number)) => void;
  currencyMode: CurrencyMode;
  fxRates: Record<string, number> | null;
}) {
  const s = useMemo(() => makeCityEstimateStyles(props.theme), [props.theme]);

  const fuelItems = useMemo(
    () => [
      { value: "diesel" as const, label: props.t.diesel },
      { value: "gasoline95" as const, label: props.t.gasoline95 },
      { value: "lpg" as const, label: props.t.lpg }
    ],
    [props.t]
  );

  const basePrice = useMemo(() => getFuelPrice(props.base, props.fuelType), [props.base, props.fuelType]);
  const cityAdj = useMemo(() => CITY_PRESETS.find((c) => c.name === props.city)?.adj ?? 0, [props.city]);

  const estimated = useMemo(() => {
    if (basePrice == null) return null;
    return basePrice + cityAdj + props.bias;
  }, [basePrice, cityAdj, props.bias]);

  const bump = (delta: number) => props.setBias((p) => Number((p + delta).toFixed(2)));

  return (
    <View style={s.card}>
      <View style={s.headerRow}>
        <View style={s.headerLeft}>
          <View style={s.headerIcon}>
            <Ionicons name="analytics-outline" size={18} color={props.theme.colors.linkText} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.title}>{props.t.cityEstimateTitle}</Text>
            <Text style={s.subtitle}>{props.t.approxNote}</Text>
          </View>
        </View>
      </View>

      <SegmentedControl theme={props.theme} value={props.fuelType} items={fuelItems} onChange={props.setFuelType} />

      <View style={s.fieldHeader}>
        <Ionicons name="business-outline" size={14} color={props.theme.colors.muted} style={{ marginRight: 8 }} />
        <Text style={s.label}>{props.t.city}</Text>
      </View>

      <View style={s.pickerWrap}>
        <Picker
          selectedValue={props.city}
          onValueChange={(v) => props.setCity(String(v))}
          style={{ color: props.theme.colors.text }}
          dropdownIconColor={props.theme.colors.muted}
        >
          {CITY_PRESETS.map((c) => (
            <Picker.Item key={c.name} label={c.name} value={c.name} />
          ))}
        </Picker>
      </View>

      <View style={s.biasHeader}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="options-outline" size={14} color={props.theme.colors.muted} style={{ marginRight: 8 }} />
          <Text style={s.label}>
            {props.t.bias}: {formatBias(props.bias)}
          </Text>
        </View>
        <AnimatedPressable onPress={() => props.setBias(0)} contentStyle={s.ghostBtn} scaleIn={0.98}>
          <Ionicons name="refresh" size={16} color={props.theme.colors.text} />
          <Text style={s.ghostBtnText}>{props.t.reset}</Text>
        </AnimatedPressable>
      </View>

      <Text style={s.hint}>{props.t.biasHint}</Text>

      <View style={s.biasRow}>
        <AnimatedPressable onPress={() => bump(-0.01)} contentStyle={s.pill} scaleIn={0.98}>
          <Ionicons name="remove" size={18} color={props.theme.colors.text} />
          <Text style={s.pillText}>0.01</Text>
        </AnimatedPressable>

        <AnimatedPressable onPress={() => bump(0.01)} contentStyle={s.pill} scaleIn={0.98}>
          <Ionicons name="add" size={18} color={props.theme.colors.text} />
          <Text style={s.pillText}>0.01</Text>
        </AnimatedPressable>

        <AnimatedPressable onPress={() => bump(-0.05)} contentStyle={s.pill} scaleIn={0.98}>
          <Ionicons name="remove" size={18} color={props.theme.colors.text} />
          <Text style={s.pillText}>0.05</Text>
        </AnimatedPressable>

        <AnimatedPressable onPress={() => bump(0.05)} contentStyle={s.pill} scaleIn={0.98}>
          <Ionicons name="add" size={18} color={props.theme.colors.text} />
          <Text style={s.pillText}>0.05</Text>
        </AnimatedPressable>
      </View>

      <View style={s.estimateBox}>
        <View style={s.estimateTop}>
          <Text style={s.label}>
            {props.t.estimate} ({fuelLabel(props.fuelType, props.t)})
          </Text>
          <View style={s.badge}>
            <Ionicons name="sparkles-outline" size={14} color={props.theme.colors.linkText} />
            <Text style={s.badgeText}>{props.t.approx ?? "Approx"}</Text>
          </View>
        </View>

        <Text style={s.estimateValue}>{formatFuelPrice("Albania", estimated, props.currencyMode, props.fxRates)}</Text>
        <Text style={s.note}>{props.t.approxNote}</Text>
      </View>
    </View>
  );
}