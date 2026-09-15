import { ADSTERRA_NATIVE } from "../config/monetization";

type ActivePlacement = { container: HTMLElement; script: HTMLScriptElement };
let activePlacement: ActivePlacement | null = null;

export function mountAdsterraNative(
  container: HTMLElement,
  onStateChange: (state: "filled" | "empty") => void,
  emptyAfterMs = 8_000,
): () => void {
  if (activePlacement) {
    activePlacement.script.remove();
    activePlacement.container.replaceChildren();
    activePlacement = null;
  }

  let disposed = false;
  const report = (state: "filled" | "empty") => { if (!disposed) onStateChange(state); };
  const script = document.createElement("script");
  script.async = true;
  script.dataset.cfasync = "false";
  script.dataset.adsterraNative = "true";
  script.src = ADSTERRA_NATIVE.scriptUrl;
  script.onerror = () => report("empty");

  let filled = false;
  const observer = new MutationObserver(() => {
    if (container.childElementCount > 0) {
      filled = true;
      report("filled");
    }
  });
  observer.observe(container, { childList: true, subtree: true });
  container.before(script);
  activePlacement = { container, script };

  const emptyTimer = window.setTimeout(() => {
    if (!filled && container.childElementCount === 0) report("empty");
  }, emptyAfterMs);

  return () => {
    disposed = true;
    window.clearTimeout(emptyTimer);
    observer.disconnect();
    script.onerror = null;
    script.remove();
    container.replaceChildren();
    if (activePlacement?.container === container) activePlacement = null;
  };
}

export function hasActiveAdsterraPlacement(): boolean {
  return activePlacement !== null;
}
