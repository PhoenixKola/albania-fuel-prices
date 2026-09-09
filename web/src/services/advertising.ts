import { monetization, adsAllowed } from "../config/monetization";
declare global {
  interface Window {
    adsbygoogle?: { push: (value: Record<string, never>) => unknown };
    googlefc?: { callbackQueue: Array<Record<string, () => void>>; showRevocationMessage?: () => void };
  }
}
let adsReady: Promise<void> | undefined;
export function loadAdvertising(lang: string): Promise<void> | null {
  if (typeof window === "undefined" || !adsAllowed(monetization, window.location.hostname, lang)) return null;
  if (adsReady) return adsReady;
  adsReady = new Promise<void>((resolve, reject) => {
    let scriptReady = false;
    let consentReady = false;
    const complete = () => { if (scriptReady && consentReady) resolve(); };
    window.googlefc = window.googlefc || { callbackQueue: [] };
    window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
    window.googlefc.callbackQueue.push({ CONSENT_DATA_READY: () => { consentReady = true; complete(); } });
    const script = document.createElement("script");
    script.id = "fuel-adsense"; script.async = true; script.crossOrigin = "anonymous";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${monetization.client}`;
    script.onload = () => { scriptReady = true; complete(); };
    script.onerror = () => reject(new Error("Advertising unavailable"));
    document.head.append(script);
  });
  void adsReady.catch(() => {});
  return adsReady;
}
export function initializeAdSlot(element: HTMLElement): boolean {
  if (!element.isConnected || element.clientWidth <= 0 || element.dataset.requested || element.dataset.adsbygoogleStatus) return false;
  element.dataset.requested = "true";
  try {
    const queue = window.adsbygoogle ?? ([] as Record<string, never>[]);
    window.adsbygoogle = queue;
    queue.push({});
    return true;
  }
  catch { element.dataset.failed = "true"; return false; }
}
