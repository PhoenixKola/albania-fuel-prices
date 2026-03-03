import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RewardedAd, RewardedAdEventType, AdEventType } from "react-native-google-mobile-ads";
import { STORAGE_REWARD_UNTIL_UTC } from "../constants/storage";

type Options = {
  unitId: string;
  durationMinutes: number;
};

function parseDateMs(iso: string | null) {
  if (!iso) return 0;
  const t = new Date(iso).getTime();
  return Number.isFinite(t) ? t : 0;
}

export function useRewardUnlock(opts: Options) {
  const ad = useMemo(() => RewardedAd.createForAdRequest(opts.unitId), [opts.unitId]);

  const [loaded, setLoaded] = useState(false);
  const [unlockUntilMs, setUnlockUntilMs] = useState<number>(0);

  const durationMs = opts.durationMinutes * 60 * 1000;

  const earningRef = useRef(false);

  const unlocked = unlockUntilMs > Date.now();
  const minutesLeft = unlocked ? Math.max(0, Math.ceil((unlockUntilMs - Date.now()) / (60 * 1000))) : 0;

  const loadStored = useCallback(async () => {
    const raw = await AsyncStorage.getItem(STORAGE_REWARD_UNTIL_UTC);
    setUnlockUntilMs(parseDateMs(raw));
  }, []);

  const setUnlockForDuration = useCallback(async () => {
    const until = Date.now() + durationMs;
    setUnlockUntilMs(until);
    await AsyncStorage.setItem(STORAGE_REWARD_UNTIL_UTC, new Date(until).toISOString());
  }, [durationMs]);

  useEffect(() => {
    let cancelled = false;

    const unsubLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
      if (!cancelled) setLoaded(true);
    });

    const unsubError = ad.addAdEventListener(AdEventType.ERROR, () => {
      if (!cancelled) setLoaded(false);
    });

    const unsubClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      if (!cancelled) setLoaded(false);
      earningRef.current = false;
      ad.load();
    });

    const unsubEarned = ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, async () => {
      if (earningRef.current) return;
      earningRef.current = true;
      try {
        await setUnlockForDuration();
      } catch {}
    });

    (async () => {
      await loadStored();
      if (cancelled) return;
      ad.load();
    })();

    return () => {
      cancelled = true;
      unsubLoaded();
      unsubError();
      unsubClosed();
      unsubEarned();
    };
  }, [ad, loadStored, setUnlockForDuration]);

  const showRewardedAndUnlock = useCallback(async () => {
    if (!loaded) {
      ad.load();
      return false;
    }
    try {
      earningRef.current = false;
      await ad.show();
      return true;
    } catch {
      return false;
    }
  }, [ad, loaded]);

  const refreshStored = useCallback(async () => {
    await loadStored();
  }, [loadStored]);

  return {
    loaded,
    unlocked,
    minutesLeft,
    showRewardedAndUnlock,
    refreshStored
  };
}