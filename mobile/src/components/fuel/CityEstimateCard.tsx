import React, { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import type { Theme } from "../../theme/theme";
import type { CountryPrices, FuelType } from "../../types/fuel";
import { formatBias, formatPriceEur } from "../../utils/format";
import { getFuelPrice, fuelLabel } from "../../utils/fuel";
import SegmentedControl from "../ui/SegmentedControl";
import { makeCityEstimateStyles } from "./CityEstimateCard.styles";

const CITY_PRESETS: { name: string; adj: number }[] = [
  { name: "Tirana", adj: 0 },
  { name: "Durrës", adj: -0.01 },
  { name: "Vlorë", adj: 0.01 },
  { name: "Shkodër", adj: -0.01 },
  { name: "Fier", adj: -0.01 },
  { name: "Elbasan", adj: 0 },
  { name: "Korçë", adj: 0.01 },
  { name: "Berat", adj: 0 },
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
}) {
  const s = useMemo(() => makeCityEstimateStyles(props.theme), [props.theme]);

  const fuelItems = useMemo(
    () => [
      { value: "diesel" as const, label: props.t.diesel },
      { value: "gasoline95" as const, label: props.t.gasoline95 },
      { value: "lpg" as const, label: props.t.lpg },
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
      <Text style={s.title}>{props.t.cityEstimateTitle}</Text>

      <SegmentedControl theme={props.theme} value={props.fuelType} items={fuelItems} onChange={props.setFuelType} />

      <View style={s.rowBetween}>
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

      <Text style={s.label}>
        {props.t.bias}: {formatBias(props.bias)}
      </Text>
      <Text style={s.hint}>{props.t.biasHint}</Text>

      <View style={s.biasRow}>
        <Pressable onPress={() => bump(-0.01)} style={s.pill}>
          <Text style={s.pillText}>-0.01</Text>
        </Pressable>
        <Pressable onPress={() => bump(0.01)} style={s.pill}>
          <Text style={s.pillText}>+0.01</Text>
        </Pressable>
        <Pressable onPress={() => props.setBias(0)} style={s.pill}>
          <Text style={s.pillText}>{props.t.reset}</Text>
        </Pressable>
      </View>

      <View style={s.estimateBox}>
        <Text style={s.label}>
          {props.t.estimate} ({fuelLabel(props.fuelType, props.t)})
        </Text>
        <Text style={s.estimateValue}>{formatPriceEur(estimated)}</Text>
        <Text style={s.note}>{props.t.approxNote}</Text>
      </View>
    </View>
  );
}