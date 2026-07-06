import { useCallback, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { FuelType, LatestEurope } from "../types/fuel";
import { getFuelPrice, fuelLabel } from "../utils/fuel";

declare const require: (name: string) => any;

export type PriceAlertRule = {
  id: string;
  country: string;
  fuelType: FuelType;
  direction: "below" | "above";
  targetEur: number;
  createdAtUtc: string;
  lastTriggeredKey?: string;
};

const STORAGE_KEY = "price_alert_rules_v1";

function safeParse(raw: string | null): PriceAlertRule[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((x): PriceAlertRule => {
        const fuelType: FuelType =
          x?.fuelType === "gasoline95" || x?.fuelType === "lpg" || x?.fuelType === "diesel" ? x.fuelType : "diesel";
        const direction: PriceAlertRule["direction"] = x?.direction === "above" ? "above" : "below";

        return {
          id: String(x?.id ?? ""),
          country: String(x?.country ?? ""),
          fuelType,
          direction,
          targetEur: Number(x?.targetEur),
          createdAtUtc: String(x?.createdAtUtc ?? ""),
          lastTriggeredKey: typeof x?.lastTriggeredKey === "string" ? x.lastTriggeredKey : undefined,
        };
      })
      .filter((x) => x.id && x.country && Number.isFinite(x.targetEur) && x.targetEur > 0);
  } catch {
    return [];
  }
}

async function notify(title: string, body: string) {
  try {
    const Notifications = require("expo-notifications");
    const status = await Notifications.getPermissionsAsync();
    const granted = status.granted || (await Notifications.requestPermissionsAsync()).granted;
    if (!granted) return false;

    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null,
    });
    return true;
  } catch {
    return false;
  }
}

export function usePriceAlerts(data: LatestEurope | null, t: any) {
  const [rules, setRules] = useState<PriceAlertRule[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => setRules(safeParse(raw))).catch(() => {});
  }, []);

  const saveRules = useCallback(async (next: PriceAlertRule[]) => {
    setRules(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const upsertRule = useCallback(
    async (country: string, fuelType: FuelType, direction: "below" | "above", targetEur: number) => {
      const nextRule: PriceAlertRule = {
        id: `${country}_${fuelType}`,
        country,
        fuelType,
        direction,
        targetEur,
        createdAtUtc: new Date().toISOString(),
      };

      await saveRules([nextRule, ...rules.filter((rule) => rule.id !== nextRule.id)].slice(0, 30));
      await notify("Price alert saved", `${fuelLabel(fuelType, t)} in ${country}: ${direction} ${targetEur.toFixed(3)} EUR/L`);
    },
    [rules, saveRules, t]
  );

  const removeRule = useCallback(
    async (id: string) => {
      await saveRules(rules.filter((rule) => rule.id !== id));
    },
    [rules, saveRules]
  );

  const getRule = useCallback(
    (country: string, fuelType: FuelType) => rules.find((rule) => rule.country === country && rule.fuelType === fuelType) ?? null,
    [rules]
  );

  useEffect(() => {
    if (!data?.countries?.length || !rules.length) return;

    const byCountry = new Map(data.countries.map((row) => [row.country, row]));
    const triggered: PriceAlertRule[] = [];

    const next = rules.map((rule) => {
      const row = byCountry.get(rule.country);
      const price = getFuelPrice(row ?? null, rule.fuelType);
      if (price == null) return rule;

      const hit = rule.direction === "below" ? price <= rule.targetEur : price >= rule.targetEur;
      const triggerKey = `${data.as_of}_${price.toFixed(3)}`;
      if (!hit || rule.lastTriggeredKey === triggerKey) return rule;

      const updated = { ...rule, lastTriggeredKey: triggerKey };
      triggered.push(updated);
      return updated;
    });

    if (!triggered.length) return;

    saveRules(next).catch(() => {});
    triggered.forEach((rule) => {
      notify(
        "Fuel price alert",
        `${fuelLabel(rule.fuelType, t)} in ${rule.country} is ${rule.direction} ${rule.targetEur.toFixed(3)} EUR/L.`
      );
    });
  }, [data, rules, saveRules, t]);

  return useMemo(() => ({ rules, upsertRule, removeRule, getRule }), [rules, upsertRule, removeRule, getRule]);
}
