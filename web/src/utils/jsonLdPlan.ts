export type JsonLdAction = "keep" | "replace" | "clear";

/**
 * Decide what client-side routing does with structured data in <head>.
 * The prerendered block describes only the URL it was rendered for: keep it
 * while that URL is shown, never carry it to another route.
 */
export function jsonLdAction(prerenderedPath: string | null, path: string, hasClientSchema: boolean): JsonLdAction {
  if (prerenderedPath === path) return "keep";
  return hasClientSchema ? "replace" : "clear";
}
