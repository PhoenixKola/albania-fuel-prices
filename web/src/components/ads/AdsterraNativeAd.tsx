import { useContext, useEffect, useRef, useState } from "react";
import { ADSTERRA_NATIVE } from "../../config/monetization";
import { mountAdsterraNative } from "../../services/adsterra";
import { AdContext } from "./AdContext";

export default function AdsterraNativeAd({ enabled = true, location }: { enabled?: boolean; location: string }) {
  const context = useContext(AdContext);
  if (!enabled || !context.enabled) return null;
  return <NativePlacement key={`${context.pathname}:${location}`} lang={context.lang} location={location} />;
}

function NativePlacement({ lang, location }: { lang: "en" | "sq"; location: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"loading" | "filled" | "empty">("loading");

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    const start = window.setTimeout(() => {
      if (containerRef.current) cleanup = mountAdsterraNative(containerRef.current, setState);
    }, 0);
    return () => {
      window.clearTimeout(start);
      cleanup?.();
    };
  }, []);

  return (
    <aside className="adsterraPlacement" aria-label={lang === "sq" ? "Reklamë" : "Advertisement"} data-ad-location={location} data-state={state}>
      <span className="adsterraPlacementLabel">{lang === "sq" ? "Reklamë" : "Advertisement"}</span>
      <div id={ADSTERRA_NATIVE.containerId} ref={containerRef} />
    </aside>
  );
}
