import { ROAD_ROUTES } from "../src/data/roadRoutes";
import type { RoadRoute } from "../src/models/road";
import { countRouteStatuses, formatRoadTimestamp, roadFreshness, statusTone } from "../src/utils/roadReality";
import { roadRouteDescription, roadRouteTitle } from "../src/utils/roadSeo";

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function renderRoadRealityStatic(route: RoadRoute, includeRouteIndex = false) {
  const counts = countRouteStatuses(route);
  const freshness = roadFreshness(route.lastCheckedAt);
  const routeIndex = includeRouteIndex ? `
    <section class="contentSection roadStaticIndex">
      <h2 class="contentHeading">Curated Albania routes</h2>
      <p class="contentBody">Choose a route to restore its sourced status page. Routes without current route-specific authority evidence remain marked UNKNOWN.</p>
      <ul class="contentList">${ROAD_ROUTES.map((item) => `<li><a href="/road-status/${item.slug}">${escapeHtml(item.title)}</a> — ${item.overallStatus}</li>`).join("")}</ul>
    </section>` : "";
  return `
    <main class="roadPage roadStaticPage">
      <header class="contentHero roadStaticHero">
        <p class="contentHeroBadge">Road Reality · sourced route intelligence</p>
        <h1 class="contentHeroTitle">Albania Road Conditions &amp; Route Status</h1>
        <p class="contentHeroText">Check road closures, restrictions, surface conditions, and recent official updates before driving in Albania.</p>
      </header>
      <article class="contentPage">
        <section class="contentSection">
          <p class="contentBodyMuted">ROUTE STATUS · ${escapeHtml(freshness.label)}</p>
          <h2 class="contentHeading">${escapeHtml(route.title)}</h2>
          <p class="roadStatusBadge roadStatus-${statusTone(route.overallStatus)}">${route.overallStatus}</p>
          <p class="contentBody">${escapeHtml(route.statusExplanation)}</p>
          <p class="contentBody"><strong>Last checked:</strong> ${escapeHtml(formatRoadTimestamp(route.lastCheckedAt))}. <strong>Confidence:</strong> ${route.confidence}. <strong>Known restricted or closed sections:</strong> ${counts.RESTRICTED + counts.CLOSED}. <strong>Unknown sections:</strong> ${counts.UNKNOWN}.</p>
          <p class="contentBody"><a href="/trip-cost-calculator">Calculate fuel cost</a></p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Route sections</h2>
          ${route.routeSections.map((section) => `<article><h3>${escapeHtml(section.name)} · ${section.status}</h3><p class="contentBody"><strong>Surface:</strong> ${escapeHtml(section.surface)}. ${escapeHtml(section.notes)}</p><p class="contentBodyMuted">${escapeHtml(section.vehicleConsideration)}</p></article>`).join("")}
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Vehicle considerations</h2>
          <p class="contentBody">Normal 2WD: ${route.vehicleGuidance.normal2wd}. Low-clearance vehicle: ${route.vehicleGuidance.lowClearance}. Higher-clearance vehicle: ${route.vehicleGuidance.higherClearance}. Rental vehicle: check your rental supplier's road restrictions.</p>
          <p class="contentBody">${escapeHtml(route.vehicleGuidance.note)}</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Sources and provenance</h2>
          ${route.sources.map((source) => `<article><h3>${escapeHtml(source.authority)}</h3><p class="contentBody">${escapeHtml(source.title)}. Scope: ${escapeHtml(source.geographicScope)}. Published: ${source.publishedAt ? escapeHtml(formatRoadTimestamp(source.publishedAt)) : "not stated / rolling archive"}. Checked by Karburanti Sot: ${escapeHtml(formatRoadTimestamp(source.checkedAt))}.</p><p class="contentBody">${escapeHtml(source.note)}</p><p><a href="${escapeHtml(source.url)}" rel="noopener noreferrer">View source</a></p></article>`).join("")}
        </section>
        ${routeIndex}
        <section class="contentSection"><h2 class="contentHeading">Before you drive</h2><p class="contentBody">Road conditions can change quickly. Karburanti Sot summarizes available sources and does not replace instructions from road authorities, police, emergency services, road signs, or your rental supplier.</p></section>
      </article>
    </main>`;
}

export function buildRoadRealityPrerenderRoutes() {
  const defaultRoute = ROAD_ROUTES.find((route) => route.slug === "tirana-theth") ?? ROAD_ROUTES[0];
  return [
    {
      path: "/road-status",
      title: "Albania Road Conditions & Route Status | Karburanti Sot",
      description: "Check sourced road closures, restrictions, route sections and verification dates for important driving routes across Albania.",
      jsonLdType: "WebPage" as const,
      datePublished: "2026-09-10",
      dateModified: "2026-09-10",
      content: renderRoadRealityStatic(defaultRoute, true),
    },
    ...ROAD_ROUTES.map((route) => ({
      path: `/road-status/${route.slug}`,
      title: roadRouteTitle(route),
      description: roadRouteDescription(route),
      jsonLdType: "WebPage" as const,
      datePublished: "2026-09-10",
      dateModified: route.lastCheckedAt.slice(0, 10),
      noindex: !route.indexable,
      content: renderRoadRealityStatic(route),
    })),
  ];
}
