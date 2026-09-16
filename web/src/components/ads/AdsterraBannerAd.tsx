import { useContext, useEffect, useId, useState } from "react";
import { ADSTERRA_BANNER } from "../../config/monetization";
import { useNearViewport } from "../../hooks/useNearViewport";
import { AdContext } from "./AdContext";

function bannerDocument(id: string) {
  const message = JSON.stringify({ source: "karburanti-banner", id });
  return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;width:300px;height:250px;overflow:hidden">
<script>
window.notify = (state) => parent.postMessage({...${message}, state}, "*");
const hasCreative = () => [...document.body.children].some((element) => element.tagName !== "SCRIPT" && element.getBoundingClientRect().width > 1);
const observer = new MutationObserver(() => { if (hasCreative()) { window.notify("filled"); observer.disconnect(); } });
observer.observe(document.body, {childList:true, subtree:true});
</script>
<script>window.atOptions={key:${JSON.stringify(ADSTERRA_BANNER.key)},format:"iframe",height:${ADSTERRA_BANNER.height},width:${ADSTERRA_BANNER.width},params:{}};</script>
<script src=${JSON.stringify(ADSTERRA_BANNER.scriptUrl)} onerror="window.notify('empty')"></script>
<script>if (hasCreative()) window.notify("filled");</script>
</body></html>`;
}

export default function AdsterraBannerAd({ location, enabled = true }: { location: string; enabled?: boolean }) {
  const context = useContext(AdContext);
  if (!enabled || !context.enabled) return null;
  return <BannerPlacement key={`${context.pathname}:${location}`} lang={context.lang} location={location} />;
}

function BannerPlacement({ lang, location }: { lang: "en" | "sq"; location: string }) {
  const id = useId();
  const [slot, setSlot] = useState<HTMLDivElement | null>(null);
  const near = useNearViewport(slot, "250px");
  const [state, setState] = useState<"loading" | "filled" | "empty">("loading");
  const [frame, setFrame] = useState<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (!near || !frame) return;
    const receive = (event: MessageEvent) => {
      if (event.source !== frame.contentWindow || event.data?.source !== "karburanti-banner" || event.data?.id !== id) return;
      if (event.data.state === "filled" || event.data.state === "empty") setState(event.data.state);
    };
    window.addEventListener("message", receive);
    const timeout = window.setTimeout(() => setState((current) => current === "filled" ? current : "empty"), 8_000);
    return () => { window.removeEventListener("message", receive); window.clearTimeout(timeout); };
  }, [near, frame, id]);

  const label = lang === "sq" ? "Reklamë" : "Advertisement";
  return <aside className="adsterraPlacement adsterraBannerPlacement" aria-label={label} data-ad-format="banner" data-ad-location={location} data-state={state}>
    <span className="adsterraPlacementLabel">{label}</span>
    <div ref={setSlot} className="adsterraBannerSlot">
      {near ? <iframe ref={setFrame} title={label} width={ADSTERRA_BANNER.width} height={ADSTERRA_BANNER.height}
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox" srcDoc={bannerDocument(id)} /> : null}
    </div>
  </aside>;
}
