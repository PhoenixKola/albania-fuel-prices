import { useEffect } from "react";
import * as Updates from "expo-updates";

export function useOtaUpdateOnLaunch() {
  useEffect(() => {
    let cancelled = false;

    async function checkAndApplyUpdate() {
      if (__DEV__ || !Updates.isEnabled) return;

      try {
        const update = await Updates.checkForUpdateAsync();
        if (cancelled || !update.isAvailable) return;

        await Updates.fetchUpdateAsync();
        if (cancelled) return;

        await Updates.reloadAsync();
      } catch {
        // Keep startup resilient if the update server or network is unavailable.
      }
    }

    checkAndApplyUpdate();

    return () => {
      cancelled = true;
    };
  }, []);
}
