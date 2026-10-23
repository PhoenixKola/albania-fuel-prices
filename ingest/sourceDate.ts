/** A source date is publication evidence, never the time this job ran. */
export function validSourceDate(value: string, now = new Date()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value &&
    date.getTime() <= now.getTime();
}

export function parseDateFromText(text: string, now = new Date()): string | null {
  // Callers pass only the source's publication heading. A date in a footer,
  // article or retrieval timestamp is not evidence of fuel-price publication.
  const label = text.replace(/\s+/g, " ").trim();
  const match = label.match(/^(?:(?:european\s+)?(?:average\s+)?(?:fuel\s+)?prices(?:\s+of\s+1\s+litre\s+of\s+fuel\s+in\s+europe)?(?:\s+as\s+of)?\s+)?(\d{1,2})\.?\s+([A-Za-z]+)\s+(\d{4})$/i);
  if (!match) return null;
  const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  const month = months.indexOf(match[2].toLowerCase()) + 1;
  if (!month) return null;
  const value = `${match[3]}-${String(month).padStart(2, "0")}-${match[1].padStart(2, "0")}`;
  return validSourceDate(value, now) ? value : null;
}
