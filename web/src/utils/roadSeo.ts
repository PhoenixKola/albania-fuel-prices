import type { RoadRoute } from "../models/road";

export function roadRouteTitle(route: RoadRoute) {
  return `${route.from} to ${route.to} Road Conditions | Karburanti Sot`;
}

export function roadRouteDescription(route: RoadRoute) {
  return route.overallStatus === "UNKNOWN"
    ? `${route.title}: sourced road information, route sections, vehicle considerations and verification dates. Current route status is unknown.`
    : `${route.title}: review the stored restriction, affected section, vehicle limits, publication date and official source before departure.`;
}
