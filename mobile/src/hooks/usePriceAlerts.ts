import { useCallback, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { STORAGE_PRICE_ALERTS_KEY } from "../constants/storage";
import type { TDict } from "../i18n";
import type { FuelType, LatestEurope } from "../types/fuel";
import { fuelLabel } from "../utils/fuel";
import {
  checkPriceAlertsAsync,
  parsePriceAlertRules,
  presentPriceAlertNotificationAsync,
  requestPriceAlertPermissionAsync,
  syncPriceAlertBackgroundTaskAsync,
  type PriceAlertRule,
} from "../notifications/priceAlerts";

export type { PriceAlertRule } from "../notifications/priceAlerts";

export function usePriceAlerts(data: LatestEurope | null, t: TDict) {
  const [rules, setRules] = useState<PriceAlertRule[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_PRICE_ALERTS_KEY)
      .then((raw) => {
        const stored = parsePriceAlertRules(raw);
        setRules(stored);
        syncPriceAlertBackgroundTaskAsync(stored.length > 0).catch(() => {});
      })
      .catch(() => {})
      .finally(() => setHydrated(true));
  }, []);

  const saveRules = useCallback(async (next: PriceAlertRule[]) => {
    setRules(next);
    await AsyncStorage.setItem(STORAGE_PRICE_ALERTS_KEY, JSON.stringify(next));
    await syncPriceAlertBackgroundTaskAsync(next.length > 0);
  }, []);

  const upsertRule = useCallback(
    async (country: string, fuelType: FuelType, direction: "below" | "above", targetEur: number) => {
      const permitted = await requestPriceAlertPermissionAsync();
      if (!permitted) return false;

      const nextRule: PriceAlertRule = {
        id: `${country}_${fuelType}`,
        country,
        fuelType,
        direction,
        targetEur,
        createdAtUtc: new Date().toISOString(),
      };
      await saveRules([nextRule, ...rules.filter((rule) => rule.id !== nextRule.id)].slice(0, 30));
      await presentPriceAlertNotificationAsync(
        t.alertSavedTitle,
        t.alertSavedBody(fuelLabel(fuelType, t), country, direction, `€${targetEur.toFixed(3)}`),
        { type: "price-alert-saved", country, fuelType }
      );
      return true;
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
    if (!hydrated || !data?.countries?.length || !rules.length) return;
    let cancelled = false;
    checkPriceAlertsAsync(data, rules, t)
      .then((result) => {
        if (!cancelled && result.triggered.length) setRules(result.next);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [data, hydrated, rules, t]);

  return useMemo(() => ({ rules, hydrated, upsertRule, removeRule, getRule }), [rules, hydrated, upsertRule, removeRule, getRule]);
}
