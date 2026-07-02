declare const require: (name: string) => any;

/**
 * Haptics are loaded lazily via require so an OTA (JS-only) update shipped
 * to a binary built without expo-haptics degrades to a silent no-op instead
 * of crashing at import time.
 */
function getHaptics(): any | null {
  try {
    return require("expo-haptics");
  } catch {
    return null;
  }
}

const haptics = getHaptics();

/** Light tap for ordinary presses (buttons, chips, rows). */
export function hapticLight() {
  haptics?.impactAsync?.(haptics.ImpactFeedbackStyle.Light)?.catch?.(() => {});
}

/** Selection tick for toggles and segmented controls. */
export function hapticSelect() {
  haptics?.selectionAsync?.()?.catch?.(() => {});
}

/** Success notification for completed actions (e.g. reward unlocked). */
export function hapticSuccess() {
  haptics?.notificationAsync?.(haptics.NotificationFeedbackType.Success)?.catch?.(() => {});
}
