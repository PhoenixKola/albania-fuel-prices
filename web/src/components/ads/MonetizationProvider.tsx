import { useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import type { Lang } from "../../models/i18n";
import { adsterraAllowed, isAdsterraRoute, isProductionHost, monetization } from "../../config/monetization";
import { readPrivacyPreferences, writePrivacyPreferences, type AdvertisingPreference } from "../../services/privacyPreferences";
import { AdContext } from "./AdContext";

const privacyCopy = {
  en: {
    title: "Privacy choices",
    body: "Karburanti Sot uses essential browser storage for site preferences. Optional advertising may load third-party technologies only after you allow it. The website works fully without advertising.",
    necessary: "Essential storage",
    necessaryDetail: "Always active for language, theme, fuel and other settings you choose.",
    advertising: "Optional advertising",
    advertisingOn: "Allowed on eligible pages when site advertising is enabled.",
    advertisingOff: "Not allowed. No Adsterra advertising request will be made.",
    allow: "Allow advertising",
    decline: "Continue without advertising",
    close: "Close privacy choices",
    footer: "Privacy & cookies",
  },
  sq: {
    title: "Zgjedhjet e privatësisë",
    body: "Karburanti Sot përdor ruajtje thelbësore në shfletues për preferencat e faqes. Reklamat opsionale mund të ngarkojnë teknologji të palëve të treta vetëm pasi t’i lejosh. Faqja funksionon plotësisht pa reklama.",
    necessary: "Ruajtja thelbësore",
    necessaryDetail: "Gjithmonë aktive për gjuhën, temën, karburantin dhe cilësime të tjera që zgjedh.",
    advertising: "Reklamat opsionale",
    advertisingOn: "Lejohen në faqet e përshtatshme kur reklamat e faqes janë aktive.",
    advertisingOff: "Nuk lejohen. Nuk do të bëhet asnjë kërkesë reklamimi te Adsterra.",
    allow: "Lejo reklamat",
    decline: "Vazhdo pa reklama",
    close: "Mbyll zgjedhjet e privatësisë",
    footer: "Privatësia & cookies",
  },
} as const;

export function MonetizationProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const { pathname } = useLocation();
  const [advertising, setAdvertisingState] = useState<AdvertisingPreference>(() =>
    typeof window === "undefined" ? null : readPrivacyPreferences(window.localStorage).advertising,
  );
  const [privacyOpen, setPrivacyOpen] = useState(advertising === null);
  const c = privacyCopy[lang];
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const enabled = typeof window !== "undefined" && isAdsterraRoute(pathname) &&
    adsterraAllowed(monetization, window.location.hostname, advertising === true);

  const closePrivacy = () => {
    setPrivacyOpen(false);
    window.requestAnimationFrame(() => previousFocusRef.current?.focus());
  };
  const openPrivacy = () => {
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setPrivacyOpen(true);
  };
  const setAdvertising = (value: boolean) => {
    writePrivacyPreferences(value, window.localStorage);
    setAdvertisingState(value);
    closePrivacy();
  };

  useEffect(() => {
    if (!privacyOpen) return;
    closeRef.current?.focus();
    const handleDialogKeys = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePrivacy();
      if (event.key !== "Tab" || !dialogRef.current) return;
      const controls = [...dialogRef.current.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])')];
      const first = controls[0];
      const last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", handleDialogKeys);
    return () => document.removeEventListener("keydown", handleDialogKeys);
  }, [privacyOpen]);

  useEffect(() => {
    if (!monetization.production || !monetization.analyticsToken || !isProductionHost(window.location.hostname)) return;
    if (document.querySelector('script[src*="static.cloudflareinsights.com/beacon.min.js"]')) return;
    const script = document.createElement("script");
    script.defer = true;
    script.src = "https://static.cloudflareinsights.com/beacon.min.js";
    script.dataset.cfBeacon = JSON.stringify({ token: monetization.analyticsToken });
    document.head.append(script);
  }, []);

  const value = {
    lang,
    enabled,
    pathname,
    advertising,
    setAdvertising,
    openPrivacy,
  };

  return (
    <AdContext.Provider value={value}>
      {children}
      {privacyOpen ? (
        <div className="privacyOverlay" role="presentation" onMouseDown={closePrivacy}>
          <section ref={dialogRef} className="privacyDialog" role="dialog" aria-modal="true" aria-labelledby="privacy-dialog-title" aria-describedby="privacy-dialog-description" onMouseDown={(event) => event.stopPropagation()}>
            <button ref={closeRef} type="button" className="privacyClose" aria-label={c.close} onClick={closePrivacy}>×</button>
            <span className="privacyEyebrow">{c.footer}</span>
            <h2 id="privacy-dialog-title">{c.title}</h2>
            <p id="privacy-dialog-description">{c.body}</p>
            <dl className="privacyDetails">
              <div><dt>{c.necessary}</dt><dd>{c.necessaryDetail}</dd></div>
              <div><dt>{c.advertising}</dt><dd>{advertising === true ? c.advertisingOn : c.advertisingOff}</dd></div>
            </dl>
            <div className="privacyActions">
              <button type="button" className="btn btn-primary" onClick={() => setAdvertising(true)}>{c.allow}</button>
              <button type="button" className="btn btn-ghost" onClick={() => setAdvertising(false)}>{c.decline}</button>
            </div>
          </section>
        </div>
      ) : null}
    </AdContext.Provider>
  );
}

export function PrivacyChoices() {
  const { lang, openPrivacy } = useContext(AdContext);
  return <button type="button" className="footerLegalLink privacyChoicesButton" onClick={openPrivacy}>{privacyCopy[lang].footer}</button>;
}
