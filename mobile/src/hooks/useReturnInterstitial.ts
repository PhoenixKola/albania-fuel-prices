import { useEffect, useMemo, useRef, useState } from "react";
import { AppState } from "react-native";

type Options = {
  enabled?: boolean;
  unitId: string;
  cooldownMs?: number;
  maxPerSession?: number;
  minBackgroundMs?: number;
};

declare const require: (name: string) => any;

export function useReturnInterstitial(opts: Options) {
  const enabled = opts.enabled ?? true;
  const cooldownMs = opts.cooldownMs ?? 2 * 60 * 1000;
  const maxPerSession = opts.maxPerSession ?? 3;
  const minBackgroundMs = opts.minBackgroundMs ?? 1200;

  const ad = useMemo(() => {
    if (!enabled || !opts.unitId) return null;
    const { InterstitialAd } = require("react-native-google-mobile-ads");
    return InterstitialAd.createForAdRequest(opts.unitId);
  }, [enabled, opts.unitId]);

  const [loaded, setLoaded] = useState(false);

  const pendingRef = useRef(false);
  const lastShownRef = useRef(0);
  const shownThisSessionRef = useRef(0);

  const appStateRef = useRef(AppState.currentState);
  const leftAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (!ad) return;
    const { AdEventType } = require("react-native-google-mobile-ads");
    const unsubLoaded = ad.addAdEventListener(AdEventType.LOADED, () => setLoaded(true));
    const unsubClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      setLoaded(false);
      ad.load();
    });
    const unsubError = ad.addAdEventListener(AdEventType.ERROR, () => setLoaded(false));

    ad.load();

    return () => {
      unsubLoaded();
      unsubClosed();
      unsubError();
    };
  }, [ad]);

  useEffect(() => {
    if (!ad) return;
    const sub = AppState.addEventListener("change", (next) => {
      const prev = appStateRef.current;
      appStateRef.current = next;

      const leaving = prev === "active" && (next === "background" || next === "inactive");
      if (leaving) {
        leftAtRef.current = Date.now();
        return;
      }

      const returning = (prev === "background" || prev === "inactive") && next === "active";
      if (!returning) return;

      const leftAt = leftAtRef.current;
      leftAtRef.current = null;

      if (!pendingRef.current) return;

      const now = Date.now();
      const cooldownOk = now - lastShownRef.current >= cooldownMs;
      const sessionOk = shownThisSessionRef.current < maxPerSession;
      const backgroundOk = leftAt ? now - leftAt >= minBackgroundMs : true;

      if (loaded && cooldownOk && sessionOk && backgroundOk) {
        pendingRef.current = false;
        lastShownRef.current = now;
        shownThisSessionRef.current += 1;

        setTimeout(() => {
          ad.show().catch(() => {});
        }, 500);
      } else {
        pendingRef.current = false;
      }
    });

    return () => sub.remove();
  }, [ad, loaded, cooldownMs, maxPerSession, minBackgroundMs]);

  return {
    markMapsOpened: () => {
      if (!enabled) return;
      pendingRef.current = true;
    }
  };
}
