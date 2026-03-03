import { useEffect, useMemo, useRef, useState } from "react";
import { AppState } from "react-native";
import { AdEventType, InterstitialAd } from "react-native-google-mobile-ads";

type Options = {
  unitId: string;
  cooldownMs?: number;
  maxPerSession?: number;
  minBackgroundMs?: number;
};

export function useReturnInterstitial(opts: Options) {
  const cooldownMs = opts.cooldownMs ?? 2 * 60 * 1000;
  const maxPerSession = opts.maxPerSession ?? 3;
  const minBackgroundMs = opts.minBackgroundMs ?? 1200;

  const ad = useMemo(() => InterstitialAd.createForAdRequest(opts.unitId), [opts.unitId]);

  const [loaded, setLoaded] = useState(false);

  const pendingRef = useRef(false);
  const lastShownRef = useRef(0);
  const shownThisSessionRef = useRef(0);

  const appStateRef = useRef(AppState.currentState);
  const leftAtRef = useRef<number | null>(null);

  useEffect(() => {
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
      pendingRef.current = true;
    }
  };
}