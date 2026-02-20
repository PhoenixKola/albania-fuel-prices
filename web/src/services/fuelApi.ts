import type { LatestEurope } from "../models/fuel";

export async function fetchLatestEurope(url: string): Promise<LatestEurope> {
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  return r.json();
}