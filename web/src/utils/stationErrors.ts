export type LocationErrorCode = "unsupported" | "insecure" | "denied" | "unavailable" | "timeout";
export type StationErrorCode = "timeout" | "busy" | "provider" | "invalid" | "network";

export function locationErrorCode(code: number | undefined): LocationErrorCode {
  return code === 1 ? "denied" : code === 3 ? "timeout" : "unavailable";
}

export function stationErrorCode(error: unknown): StationErrorCode {
  const message = error instanceof Error ? error.message : String(error);
  if (error instanceof DOMException && error.name === "AbortError") return "timeout";
  if (/\b504\b/.test(message)) return "timeout";
  if (/\b429\b/.test(message)) return "busy";
  if (/\b(502|503|504)\b/.test(message)) return "provider";
  if (/invalid station response/i.test(message)) return "invalid";
  return "network";
}
