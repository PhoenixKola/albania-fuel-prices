import { useMemo } from "react";
import { useAsyncStorageState } from "./useAsyncStorageState";
import { STORAGE_RATE_COOLDOWN_UNTIL_KEY, STORAGE_RATE_DONE_KEY, STORAGE_RATE_EVENTS_KEY } from "../constants/storage";

type EventName = "open_map" | "country_change" | "stations_use";

export function useRatePrompt(options?: { threshold?: number; cooldownDays?: number }) {
  const threshold = options?.threshold ?? 4;
  const cooldownDays = options?.cooldownDays ?? 30;

  const { value: done, setValue: setDone } = useAsyncStorageState<number>(STORAGE_RATE_DONE_KEY, 0, {
    deserialize: (raw) => {
      const n = Number(raw);
      return Number.isFinite(n) ? n : 0;
    },
    serialize: (v) => String(v)
  });

  const { value: events, setValue: setEvents } = useAsyncStorageState<number>(STORAGE_RATE_EVENTS_KEY, 0, {
    deserialize: (raw) => {
      const n = Number(raw);
      return Number.isFinite(n) ? n : 0;
    },
    serialize: (v) => String(v)
  });

  const { value: cooldownUntil, setValue: setCooldownUntil } = useAsyncStorageState<number>(STORAGE_RATE_COOLDOWN_UNTIL_KEY, 0, {
    deserialize: (raw) => {
      const n = Number(raw);
      return Number.isFinite(n) ? n : 0;
    },
    serialize: (v) => String(v)
  });

  const canShow = useMemo(() => {
    if (done === 1) return false;
    return Date.now() >= cooldownUntil && events >= threshold;
  }, [done, cooldownUntil, events, threshold]);

  const track = (name: EventName) => {
    if (done === 1) return;
    setEvents((p) => (typeof p === "number" ? p + 1 : 1));
  };

  const markRated = () => {
    setDone(1);
  };

  const snooze = () => {
    const ms = Date.now() + cooldownDays * 24 * 60 * 60 * 1000;
    setCooldownUntil(ms);
    setEvents(0);
  };

  const resetCounter = () => {
    setEvents(0);
  };

  return { canShow, track, markRated, snooze, resetCounter };
}