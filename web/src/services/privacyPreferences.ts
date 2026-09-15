export const PRIVACY_PREFERENCES_KEY = "karburanti-privacy-v1";

export type AdvertisingPreference = boolean | null;
export type PrivacyPreferences = {
  version: 1;
  necessary: true;
  advertising: AdvertisingPreference;
};

export const DEFAULT_PRIVACY_PREFERENCES: PrivacyPreferences = {
  version: 1,
  necessary: true,
  advertising: null,
};

export function readPrivacyPreferences(storage?: Pick<Storage, "getItem">): PrivacyPreferences {
  if (!storage) return DEFAULT_PRIVACY_PREFERENCES;
  try {
    const value = JSON.parse(storage.getItem(PRIVACY_PREFERENCES_KEY) ?? "null") as Partial<PrivacyPreferences> | null;
    if (value?.version === 1 && typeof value.advertising === "boolean") {
      return { version: 1, necessary: true, advertising: value.advertising };
    }
  } catch {
    // Invalid or older preferences are treated as undecided.
  }
  return DEFAULT_PRIVACY_PREFERENCES;
}

export function writePrivacyPreferences(advertising: boolean, storage?: Pick<Storage, "setItem">): PrivacyPreferences {
  const value: PrivacyPreferences = { version: 1, necessary: true, advertising };
  storage?.setItem(PRIVACY_PREFERENCES_KEY, JSON.stringify(value));
  return value;
}
