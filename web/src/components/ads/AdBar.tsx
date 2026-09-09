import { useContext, useEffect, useRef } from "react";
import { monetization, type AdPlacement } from "../../config/monetization";
import { AdContext } from "./AdContext";
import { initializeAdSlot, loadAdvertising } from "../../services/advertising";

export default function AdBar({ placement = "content", enabled = true }: { placement?: AdPlacement; enabled?: boolean }) {
  const context = useContext(AdContext);
  if (!enabled || !context.enabled || !monetization.slots[placement]) return null;
  return <AdSlot key={`${context.pathname}:${placement}`} placement={placement} lang={context.lang} />;
}
function AdSlot({ placement, lang }: { placement: AdPlacement; lang: string }) {
  const element = useRef<HTMLModElement>(null);
  const wrapper = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = element.current;
    const box = wrapper.current;
    if (!node || !box) return;
    let cancelled = false;
    let visible = false;
    let ready = false;
    const request = () => { if (!cancelled && ready && visible && initializeAdSlot(node)) box.dataset.state = "requested"; };
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) { visible = true; request(); }
    }, { rootMargin: "400px" });
    if (observer) observer.observe(node); else visible = true;
    const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(request);
    resize?.observe(node);
    const status = new MutationObserver(() => {
      if (node.dataset.adStatus === "unfilled" || node.dataset.failed) box.dataset.state = "unfilled";
    });
    status.observe(node, { attributes: true, attributeFilter: ["data-ad-status", "data-failed"] });
    loadAdvertising(lang)?.then(() => { ready = true; request(); }).catch(() => { if (!cancelled) box.dataset.state = "unfilled"; });
    return () => { cancelled = true; observer?.disconnect(); resize?.disconnect(); status.disconnect(); };
  }, [lang]);
  return <aside className="adPlacement" ref={wrapper} aria-label="Advertisement" data-placement={placement}>
    <span className="adPlacementLabel">Advertisement</span>
    <ins ref={element} className="adsbygoogle" style={{ display: "block", width: "100%", minHeight: 250 }}
      data-ad-client={monetization.client} data-ad-slot={monetization.slots[placement]} data-ad-format="auto" data-full-width-responsive="true" />
  </aside>;
}
