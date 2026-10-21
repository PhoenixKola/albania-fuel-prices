export type PositionLike = {
  timestamp: number;
  coords: { latitude: number; longitude: number; accuracy?: number | null };
};
export type Coords = { lat: number; lon: number };
export const LAST_KNOWN_MAX_AGE_MS = 10 * 60 * 1000;
export const LAST_KNOWN_MAX_ACCURACY_M = 2500;

export function shouldLocateOnFocus(active: boolean, permission: string, mode: string, hasCoords: boolean, lastAttemptAt: number, now = Date.now()) {
  return active && permission === "granted" && mode !== "city" && (!hasCoords || (mode === "lastKnown" && now - lastAttemptAt > 60_000));
}

export function validPosition(pos: PositionLike | null, recent = false, now = Date.now()): Coords | null {
  if (!pos) return null;
  const { latitude: lat, longitude: lon } = pos.coords;
  if (recent && (!Number.isFinite(pos.timestamp) || now - pos.timestamp > LAST_KNOWN_MAX_AGE_MS || pos.timestamp > now + 30_000 ||
    !Number.isFinite(pos.coords.accuracy) || (pos.coords.accuracy ?? Infinity) > LAST_KNOWN_MAX_ACCURACY_M)) return null;
  return Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180 ? { lat, lon } : null;
}

export async function withTimeout<T>(promise: Promise<T>, durationMs: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error("location-timeout")), durationMs); }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
