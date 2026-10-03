import AsyncStorage from "@react-native-async-storage/async-storage";
import * as BackgroundTask from "expo-background-task";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import { Platform } from "react-native";

import { DATA_URL } from "../constants/urls";
import { STORAGE_LANG_KEY, STORAGE_PRICE_ALERTS_KEY } from "../constants/storage";
import { i18n, type Lang, type TDict } from "../i18n";
import type { FuelType, LatestEurope } from "../types/fuel";
import { fuelLabel, getFuelPrice } from "../utils/fuel";

export type PriceAlertRule = {
  id: string;
  country: string;
  fuelType: FuelType;
  direction: "below" | "above";
  targetEur: number;
  createdAtUtc: string;
  lastTriggeredKey?: string;
};

export const PRICE_ALERT_TASK = "karburanti-price-alert-check-v1";
const ALERT_CHANNEL_ID = "fuel-price-alerts";
const BACKGROUND_INTERVAL_MINUTES = 6 * 60;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function parsePriceAlertRules(raw: string | null): PriceAlertRule[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((x): PriceAlertRule => {
        const fuelType: FuelType =
          x?.fuelType === "gasoline95" || x?.fuelType === "lpg" || x?.fuelType === "diesel" ? x.fuelType : "diesel";
        return {
          id: String(x?.id ?? ""),
          country: String(x?.country ?? ""),
          fuelType,
          direction: x?.direction === "above" ? "above" : "below",
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

export function evaluatePriceAlerts(data: LatestEurope, rules: PriceAlertRule[]) {
  const byCountry = new Map(data.countries.map((row) => [row.country, row]));
  const triggered: PriceAlertRule[] = [];
  const next = rules.map((rule) => {
    const price = getFuelPrice(byCountry.get(rule.country) ?? null, rule.fuelType);
    if (price == null) return rule;
    const hit = rule.direction === "below" ? price <= rule.targetEur : price >= rule.targetEur;
    const triggerKey = `${data.as_of}_${price.toFixed(3)}`;
    if (!hit || rule.lastTriggeredKey === triggerKey) return rule;
    const updated = { ...rule, lastTriggeredKey: triggerKey };
    triggered.push(updated);
    return updated;
  });
  return { next, triggered };
}

export async function preparePriceAlertNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(ALERT_CHANNEL_ID, {
      name: "Fuel price alerts",
      description: "Price threshold alerts for saved fuel markets",
      importance: Notifications.AndroidImportance.HIGH,
      sound: "default",
      vibrationPattern: [0, 180, 100, 180],
      showBadge: false,
    });
  }
}

export async function requestPriceAlertPermissionAsync() {
  try {
    await preparePriceAlertNotificationsAsync();
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;
    return (await Notifications.requestPermissionsAsync()).granted;
  } catch {
    return false;
  }
}

export async function presentPriceAlertNotificationAsync(title: string, body: string, data?: Record<string, string>) {
  try {
    await preparePriceAlertNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: { title, body, data, sound: "default" },
      trigger: Platform.OS === "android" ? { channelId: ALERT_CHANNEL_ID } : null,
    });
    return true;
  } catch {
    return false;
  }
}

async function notifyTriggeredRules(rules: PriceAlertRule[], t: TDict) {
  for (const rule of rules) {
    await presentPriceAlertNotificationAsync(
      t.alertFiredTitle,
      t.alertFiredBody(fuelLabel(rule.fuelType, t), rule.country, rule.direction, `€${rule.targetEur.toFixed(3)}`),
      { type: "price-alert", country: rule.country, fuelType: rule.fuelType }
    );
  }
}

export async function checkPriceAlertsAsync(data: LatestEurope, rules: PriceAlertRule[], t: TDict) {
  const result = evaluatePriceAlerts(data, rules);
  if (!result.triggered.length) return result;
  await AsyncStorage.setItem(STORAGE_PRICE_ALERTS_KEY, JSON.stringify(result.next));
  await notifyTriggeredRules(result.triggered, t);
  return result;
}

export async function syncPriceAlertBackgroundTaskAsync(hasRules: boolean) {
  try {
    const available = await TaskManager.isAvailableAsync();
    if (!available) return false;
    const registered = await TaskManager.isTaskRegisteredAsync(PRICE_ALERT_TASK);
    if (hasRules && !registered) {
      const status = await BackgroundTask.getStatusAsync();
      if (status !== BackgroundTask.BackgroundTaskStatus.Available) return false;
      await BackgroundTask.registerTaskAsync(PRICE_ALERT_TASK, { minimumInterval: BACKGROUND_INTERVAL_MINUTES });
    } else if (!hasRules && registered) {
      await BackgroundTask.unregisterTaskAsync(PRICE_ALERT_TASK);
    }
    return true;
  } catch {
    return false;
  }
}

if (!TaskManager.isTaskDefined(PRICE_ALERT_TASK)) {
  TaskManager.defineTask(PRICE_ALERT_TASK, async () => {
    try {
      const rules = parsePriceAlertRules(await AsyncStorage.getItem(STORAGE_PRICE_ALERTS_KEY));
      if (!rules.length) return BackgroundTask.BackgroundTaskResult.Success;
      const response = await fetch(DATA_URL, { cache: "no-store" });
      if (!response.ok) return BackgroundTask.BackgroundTaskResult.Failed;
      const data = (await response.json()) as LatestEurope;
      if (!Array.isArray(data?.countries) || !data.as_of) return BackgroundTask.BackgroundTaskResult.Failed;
      const storedLang = await AsyncStorage.getItem(STORAGE_LANG_KEY);
      const lang: Lang = storedLang === "sq" ? "sq" : "en";
      await checkPriceAlertsAsync(data, rules, i18n[lang]);
      return BackgroundTask.BackgroundTaskResult.Success;
    } catch {
      return BackgroundTask.BackgroundTaskResult.Failed;
    }
  });
}
