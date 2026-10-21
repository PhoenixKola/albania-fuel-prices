import { validPosition, withTimeout, type Coords, type PositionLike } from "./locationPolicy";

export type LocationOutcome = { changed: boolean; issue: "servicesOff" | "noFix" | null; cancelled?: boolean };
export type LocationSource = "lastKnown" | "device";

export function permissionStep(status: "unknown" | "granted" | "denied", canAskAgain: boolean) {
  return status === "granted" ? "locate" : status === "denied" && !canAskAgain ? "settings" : "prompt";
}

export async function acquireLocation(
  api: {
    servicesEnabled: () => Promise<boolean>;
    recent: () => Promise<PositionLike | null>;
    fresh: () => Promise<PositionLike | null>;
  },
  onFix: (coords: Coords, source: LocationSource) => boolean,
  isCurrent: () => boolean,
  hadPosition: () => boolean,
  limits = { services: 2500, recent: 2500, fresh: 9000 },
): Promise<LocationOutcome> {
  try {
    const servicesOn = await withTimeout(api.servicesEnabled(), limits.services);
    if (!isCurrent()) return { changed: false, issue: null, cancelled: true };
    if (!servicesOn) return { changed: false, issue: "servicesOff" };

    const fresh = withTimeout(api.fresh(), limits.fresh).catch(() => null);
    const last = await withTimeout(api.recent(), limits.recent).catch(() => null);
    if (!isCurrent()) return { changed: false, issue: null, cancelled: true };
    const recentFix = validPosition(last, true);
    let changed = recentFix ? onFix(recentFix, "lastKnown") : false;

    const current = validPosition(await fresh);
    if (!isCurrent()) return { changed: false, issue: null, cancelled: true };
    if (current) changed = onFix(current, "device") || changed;
    return { changed, issue: !current && !recentFix && !hadPosition() ? "noFix" : null };
  } catch {
    return { changed: false, issue: isCurrent() && !hadPosition() ? "noFix" : null };
  }
}
