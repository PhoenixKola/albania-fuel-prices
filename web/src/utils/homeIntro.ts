const HOME_INTRO_KEY = "karburanti-home-intro-played";

let playedInRuntime = false;

function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function alreadyPlayed() {
  if (playedInRuntime) return true;
  try {
    return window.sessionStorage.getItem(HOME_INTRO_KEY) === "1";
  } catch {
    return false;
  }
}

/** Claim the one full homepage opening allowed during this browser session. */
export function claimHomeIntro() {
  if (typeof document === "undefined" || typeof window === "undefined") return false;
  if (document.documentElement.dataset.homeIntro === "running") return true;
  if (reducedMotion() || alreadyPlayed()) return false;

  playedInRuntime = true;
  try {
    window.sessionStorage.setItem(HOME_INTRO_KEY, "1");
  } catch {
    // Private browsing can deny storage; the in-memory guard still applies.
  }
  document.documentElement.dataset.homeIntro = "running";
  return true;
}

/** Called before React mounts so the navbar never flashes in its settled state. */
export function prepareInitialHomeIntro() {
  if (typeof window !== "undefined" && window.location.pathname === "/") claimHomeIntro();
}

export function settleHomeIntro() {
  if (typeof document !== "undefined" && document.documentElement.dataset.homeIntro === "running") {
    document.documentElement.dataset.homeIntro = "settled";
  }
}
