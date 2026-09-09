import { useEffect, useState, useContext, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import type { Lang } from "../../models/i18n";
import { adsAllowed, isAdRoute, isProductionHost, monetization } from "../../config/monetization";
import { loadAdvertising } from "../../services/advertising";
import { travelLabels } from "../../config/travelLabels";
import { AdContext } from "./AdContext";
export function MonetizationProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const { pathname } = useLocation();
  const enabled = typeof window !== "undefined" && adsAllowed(monetization, window.location.hostname, lang) && isAdRoute(pathname);
  useEffect(() => { if (enabled) loadAdvertising(lang); }, [enabled, lang]);
  useEffect(() => {
    if (!monetization.production || !monetization.analyticsToken || !isProductionHost(window.location.hostname)) return;
    if (document.querySelector('script[src*="static.cloudflareinsights.com/beacon.min.js"]')) return;
    const script = document.createElement("script"); script.defer = true;
    script.src = "https://static.cloudflareinsights.com/beacon.min.js";
    script.dataset.cfBeacon = JSON.stringify({ token: monetization.analyticsToken });
    document.head.append(script);
  }, []);
  return <AdContext.Provider value={{ lang, enabled, pathname }}>{children}</AdContext.Provider>;
}
export function PrivacyChoices() {
  const { lang } = useContext(AdContext);
  const [unavailable, setUnavailable] = useState(false);
  const c = travelLabels[lang];
  return <span className="privacyChoices"><button type="button" className="footerLegalLink" onClick={() => {
    if (window.googlefc?.showRevocationMessage) { setUnavailable(false); window.googlefc.showRevocationMessage(); }
    else setUnavailable(true);
  }}>{c.privacy}</button>{unavailable ? <span role="status">{c.privacyUnavailable} <a href="/privacy">{lang === "sq" ? "Privatësia" : "Privacy policy"}</a></span> : null}</span>;
}
