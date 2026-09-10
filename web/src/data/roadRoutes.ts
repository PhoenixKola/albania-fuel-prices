import type { RoadCoordinate, RoadRoute, RoadSection, RoadSource } from "../models/road";

export const ROAD_DATA_CHECKED_AT = "2026-09-10T08:43:00+02:00";

const ARRSH_ARCHIVE_URL = "https://www.arrsh.gov.al/informacion-i-gjendjeve-te-rrugeve.html";
const STATE_POLICE_URL = "https://asp.gov.al/";
const OSM_COPYRIGHT_URL = "https://www.openstreetmap.org/copyright";
const LIBRAZHD_RESTRICTION_URL = "https://asp.gov.al/bllokohet-levizja-ne-aksin-librazhd-pogradec-policia-ne-sherbim-per-garantimin-e-sigurise-rrugore/";
const ARRSH_DEVIATION_URL = "https://www.arrsh.gov.al/njoftim-26.html";

function reviewSources(scope: string): RoadSource[] {
  return [
    {
      id: "arrsh-road-updates",
      authority: "Albanian Road Authority (ARRSH)",
      sourceType: "OFFICIAL_ARCHIVE",
      title: "Road-condition notices",
      url: ARRSH_ARCHIVE_URL,
      publishedAt: null,
      checkedAt: ROAD_DATA_CHECKED_AT,
      geographicScope: scope,
      derivedStatus: "UNKNOWN",
      note: "The public notice archive was reviewed, but no route-specific current statement was verified for this record.",
    },
    {
      id: "state-police-updates",
      authority: "Albanian State Police",
      sourceType: "OFFICIAL_ARCHIVE",
      title: "Police notices and road updates",
      url: STATE_POLICE_URL,
      publishedAt: null,
      checkedAt: ROAD_DATA_CHECKED_AT,
      geographicScope: scope,
      derivedStatus: "UNKNOWN",
      note: "No current route-specific statement was verified during the recorded review. Silence is not treated as an open-road confirmation.",
    },
    {
      id: "openstreetmap",
      authority: "OpenStreetMap contributors",
      sourceType: "OPEN_MAP",
      title: "OpenStreetMap base map",
      url: OSM_COPYRIGHT_URL,
      publishedAt: null,
      checkedAt: ROAD_DATA_CHECKED_AT,
      geographicScope: `${scope} map context`,
      derivedStatus: "UNKNOWN",
      note: "Used for geographic context only. OpenStreetMap does not verify a current closure or driving suitability here.",
    },
  ];
}

function restrictionSources(scope: string): RoadSource[] {
  return [
    {
      id: "state-police-librazhd-restriction",
      authority: "Albanian State Police",
      sourceType: "OFFICIAL_NOTICE",
      title: "Librazhd–Pogradec restriction at Arrat e Gurrës",
      url: LIBRAZHD_RESTRICTION_URL,
      publishedAt: "2026-08-29T00:00:00+02:00",
      checkedAt: ROAD_DATA_CHECKED_AT,
      geographicScope: "Arrat e Gurrës section of the Librazhd–Pogradec road",
      derivedStatus: "RESTRICTED",
      note: "The notice prohibits heavy vehicles and buses until a further notice and asks drivers to follow signs and police instructions.",
    },
    {
      id: "arrsh-arrat-deviation",
      authority: "Albanian Road Authority (ARRSH)",
      sourceType: "OFFICIAL_NOTICE",
      title: "Temporary Arrat e Gurrës deviation",
      url: ARRSH_DEVIATION_URL,
      publishedAt: "2026-03-03T12:00:00+01:00",
      checkedAt: ROAD_DATA_CHECKED_AT,
      geographicScope: "Librazhd–Prrenjas at Arrat e Gurrës",
      derivedStatus: "CAUTION",
      note: "ARRSH described a temporary, initially unpaved deviation with construction signage. This older notice supplies context, not a fresh current-status guarantee.",
    },
    ...reviewSources(scope),
  ];
}

type Seed = {
  slug: string;
  from: string;
  to: string;
  description: string;
  sectionNames: string[];
  geometry: RoadCoordinate[];
  indexable?: boolean;
  mountain?: boolean;
  restriction?: boolean;
};

function section(id: string, name: string, restriction = false): RoadSection {
  const isRestricted = restriction && /Librazhd|Arrat|Prrenjas/i.test(name);
  return {
    id,
    name,
    status: isRestricted ? "RESTRICTED" : "UNKNOWN",
    surface: isRestricted ? "Temporary deviation; current surface not re-verified" : "Not independently field-verified",
    notes: isRestricted
      ? "An official notice restricts heavy vehicles and buses on this corridor until a further notice. Check current signs and authority instructions."
      : "No current section-level authority statement is stored for this segment.",
    sourceIds: isRestricted
      ? ["state-police-librazhd-restriction", "arrsh-arrat-deviation"]
      : ["arrsh-road-updates", "state-police-updates", "openstreetmap"],
    lastCheckedAt: ROAD_DATA_CHECKED_AT,
    confidence: "LOW",
    vehicleConsideration: isRestricted
      ? "The published restriction names heavy vehicles and buses. This record does not determine permission for a particular passenger or rental vehicle."
      : "Vehicle suitability has not been verified for this section.",
  };
}

function makeRoute(seed: Seed): RoadRoute {
  const scope = `${seed.from} to ${seed.to}`;
  const sections = seed.sectionNames.map((name, index) => section(`${seed.slug}-${index + 1}`, name, seed.restriction));
  const status = seed.restriction ? "RESTRICTED" : "UNKNOWN";
  return {
    id: seed.slug,
    slug: seed.slug,
    from: seed.from,
    to: seed.to,
    title: `${seed.from} → ${seed.to}`,
    description: seed.description,
    overallStatus: status,
    statusExplanation: seed.restriction
      ? "A State Police notice restricts heavy vehicles and buses at Arrat e Gurrës until a further notice. No newer route-specific reopening notice was verified in this review."
      : "No route-specific current authority statement was verified in the sources reviewed. This is not evidence that the road is open.",
    lastCheckedAt: ROAD_DATA_CHECKED_AT,
    lastChangedAt: seed.restriction ? "2026-08-29T00:00:00+02:00" : null,
    confidence: "LOW",
    routeSections: sections,
    sources: seed.restriction ? restrictionSources(scope) : reviewSources(scope),
    notes: [
      "Conditions can change after the latest verification.",
      seed.mountain
        ? "This route includes mountain or remote access where weather, rockfall, roadworks, and local restrictions can change conditions quickly."
        : "Traffic controls, roadworks, incidents, and weather may change conditions between checks.",
    ],
    vehicleGuidance: {
      normal2wd: seed.restriction ? "CAUTION" : "UNKNOWN",
      lowClearance: seed.restriction || seed.mountain ? "CAUTION" : "UNKNOWN",
      higherClearance: "UNKNOWN",
      note: "Check the vehicle manual, current authority guidance, road signs, and local conditions before departure.",
    },
    geometry: seed.geometry,
    indexable: Boolean(seed.indexable),
  };
}

const TIRANA = { lat: 41.3275, lon: 19.8187, label: "Tirana" };
const SHKODER = { lat: 42.0683, lon: 19.5126, label: "Shkodër" };
const THETH = { lat: 42.3952, lon: 19.7747, label: "Theth" };
const DURRES = { lat: 41.3231, lon: 19.4414, label: "Durrës" };
const VLORE = { lat: 40.4661, lon: 19.4914, label: "Vlorë" };
const SARANDE = { lat: 39.8753, lon: 20.0048, label: "Sarandë" };
const KORCE = { lat: 40.6186, lon: 20.7808, label: "Korçë" };
const POGRADEC = { lat: 40.9025, lon: 20.6525, label: "Pogradec" };
const BERAT = { lat: 40.7058, lon: 19.9522, label: "Berat" };
const GJIROKASTER = { lat: 40.0758, lon: 20.1389, label: "Gjirokastër" };
const PERMET = { lat: 40.2336, lon: 20.3517, label: "Përmet" };

export const ROAD_ROUTES: RoadRoute[] = [
  makeRoute({ slug: "tirana-theth", from: "Tirana", to: "Theth", indexable: true, mountain: true, description: "Northbound tourist route through Shkodër, Koplik, Bogë, and Qafë Thorë before the final descent to Theth.", sectionNames: ["Tirana–Shkodër / SH1", "Koplik–Bogë", "Qafë Thorë–Theth"], geometry: [TIRANA, SHKODER, { lat: 42.327, lon: 19.588, label: "Bogë" }, THETH] }),
  makeRoute({ slug: "shkoder-theth", from: "Shkodër", to: "Theth", indexable: true, mountain: true, description: "Mountain approach from Shkodër through Koplik and Bogë to Qafë Thorë and Theth.", sectionNames: ["Shkodër–Koplik", "Koplik–Bogë", "Qafë Thorë–Theth"], geometry: [SHKODER, { lat: 42.214, lon: 19.436, label: "Koplik" }, { lat: 42.327, lon: 19.588, label: "Bogë" }, THETH] }),
  makeRoute({ slug: "tirana-shkoder", from: "Tirana", to: "Shkodër", description: "The principal northbound corridor from Tirana toward Lezhë and Shkodër.", sectionNames: ["Tirana–Milot", "Milot–Lezhë", "Lezhë–Shkodër / SH1"], geometry: [TIRANA, { lat: 41.684, lon: 19.715, label: "Milot" }, { lat: 41.783, lon: 19.643, label: "Lezhë" }, SHKODER] }),
  makeRoute({ slug: "tirana-durres", from: "Tirana", to: "Durrës", description: "The main urban and motorway corridor between Albania's capital and the Adriatic port city.", sectionNames: ["Tirana western exit", "Tirana–Durrës / SH2", "Durrës urban approach"], geometry: [TIRANA, { lat: 41.345, lon: 19.65, label: "Vorë" }, DURRES] }),
  makeRoute({ slug: "tirana-vlore", from: "Tirana", to: "Vlorë", description: "Southbound route through the Durrës, Rrogozhinë, Fier, and Vlorë corridors.", sectionNames: ["Tirana–Durrës / SH2", "Rrogozhinë–Fier", "Fier–Vlorë"], geometry: [TIRANA, DURRES, { lat: 40.941, lon: 19.704, label: "Lushnjë" }, { lat: 40.724, lon: 19.556, label: "Fier" }, VLORE] }),
  makeRoute({ slug: "tirana-sarande", from: "Tirana", to: "Sarandë", indexable: true, mountain: true, description: "Long southbound journey with inland and coastal variants; the displayed corridor follows Fier, Gjirokastër, and the Muzinë approach.", sectionNames: ["Tirana–Fier", "Fier–Gjirokastër", "Muzinë–Sarandë"], geometry: [TIRANA, { lat: 40.724, lon: 19.556, label: "Fier" }, GJIROKASTER, { lat: 39.962, lon: 20.243, label: "Muzinë" }, SARANDE] }),
  makeRoute({ slug: "vlore-sarande-sh8", from: "Vlorë", to: "Sarandë / SH8", indexable: true, mountain: true, description: "The coastal SH8 route via Llogara, Himarë, Borsh, and the southern Riviera.", sectionNames: ["Vlorë–Llogara", "Llogara–Himarë / SH8", "Himarë–Sarandë / SH8"], geometry: [VLORE, { lat: 40.197, lon: 19.638, label: "Llogara" }, { lat: 40.102, lon: 19.745, label: "Himarë" }, { lat: 40.062, lon: 19.851, label: "Borsh" }, SARANDE] }),
  makeRoute({ slug: "tirana-korce", from: "Tirana", to: "Korçë", indexable: true, mountain: true, restriction: true, description: "Eastern route through Elbasan, Librazhd, Prrenjas, and Pogradec toward Korçë.", sectionNames: ["Tirana–Elbasan", "Librazhd–Prrenjas / Arrat e Gurrës", "Pogradec–Korçë"], geometry: [TIRANA, { lat: 41.112, lon: 20.082, label: "Elbasan" }, { lat: 41.179, lon: 20.315, label: "Librazhd" }, POGRADEC, KORCE] }),
  makeRoute({ slug: "tirana-berat", from: "Tirana", to: "Berat", description: "Southbound route toward Lushnjë before the approach to Berat.", sectionNames: ["Tirana–Rrogozhinë", "Rrogozhinë–Lushnjë", "Lushnjë–Berat"], geometry: [TIRANA, { lat: 41.076, lon: 19.666, label: "Rrogozhinë" }, { lat: 40.941, lon: 19.704, label: "Lushnjë" }, BERAT] }),
  makeRoute({ slug: "tirana-gjirokaster", from: "Tirana", to: "Gjirokastër", description: "Main inland journey through Fier and Tepelenë to the Drino valley and Gjirokastër.", sectionNames: ["Tirana–Fier", "Fier–Tepelenë", "Tepelenë–Gjirokastër"], geometry: [TIRANA, { lat: 40.724, lon: 19.556, label: "Fier" }, { lat: 40.295, lon: 20.019, label: "Tepelenë" }, GJIROKASTER] }),
  makeRoute({ slug: "tirana-permet", from: "Tirana", to: "Përmet", mountain: true, description: "Long inland route via Fier, Tepelenë, and Këlcyrë toward Përmet.", sectionNames: ["Tirana–Fier", "Fier–Tepelenë", "Tepelenë–Këlcyrë–Përmet"], geometry: [TIRANA, { lat: 40.724, lon: 19.556, label: "Fier" }, { lat: 40.295, lon: 20.019, label: "Tepelenë" }, { lat: 40.313, lon: 20.189, label: "Këlcyrë" }, PERMET] }),
  makeRoute({ slug: "shkoder-koman", from: "Shkodër", to: "Koman", mountain: true, description: "Inland access from Shkodër toward Vau i Dejës and the Koman ferry terminal area.", sectionNames: ["Shkodër–Vau i Dejës", "Vau i Dejës–Koman", "Koman terminal access"], geometry: [SHKODER, { lat: 42.01, lon: 19.634, label: "Vau i Dejës" }, { lat: 42.103, lon: 19.826, label: "Koman" }] }),
  makeRoute({ slug: "sarande-gjirokaster", from: "Sarandë", to: "Gjirokastër", mountain: true, description: "Cross-country connection from Sarandë through Muzinë to the Gjirokastër valley.", sectionNames: ["Sarandë–Muzinë", "Muzinë pass", "Jorgucat–Gjirokastër"], geometry: [SARANDE, { lat: 39.962, lon: 20.243, label: "Muzinë" }, { lat: 40.01, lon: 20.19, label: "Jorgucat" }, GJIROKASTER] }),
  makeRoute({ slug: "sarande-blue-eye", from: "Sarandë", to: "Blue Eye", mountain: true, description: "Short tourist route from Sarandë toward the Blue Eye spring near Muzinë.", sectionNames: ["Sarandë eastern exit", "SH99 approach", "Blue Eye access road"], geometry: [SARANDE, { lat: 39.91, lon: 20.105, label: "SH99" }, { lat: 39.923, lon: 20.192, label: "Blue Eye" }] }),
  makeRoute({ slug: "himare-gjipe", from: "Himarë", to: "Gjipe access", mountain: true, description: "Coastal SH8 journey north from Himarë followed by local access toward Gjipe.", sectionNames: ["Himarë–Vuno / SH8", "Gjipe turnoff", "Final Gjipe access"], geometry: [{ lat: 40.102, lon: 19.745, label: "Himarë" }, { lat: 40.137, lon: 19.693, label: "Vuno" }, { lat: 40.126, lon: 19.671, label: "Gjipe access" }] }),
  makeRoute({ slug: "tirana-bovilla", from: "Tirana", to: "Bovilla", indexable: true, mountain: true, description: "Mountain and reservoir access route northeast from Tirana toward Bovilla.", sectionNames: ["Tirana–Kamëz", "Zall-Herr approach", "Bovilla reservoir access"], geometry: [TIRANA, { lat: 41.381, lon: 19.83, label: "Kamëz" }, { lat: 41.39, lon: 19.88, label: "Zall-Herr" }, { lat: 41.444, lon: 19.891, label: "Bovilla" }] }),
  makeRoute({ slug: "tirana-kruje", from: "Tirana", to: "Krujë", description: "Northbound route from Tirana through the Fushë-Krujë corridor to Krujë.", sectionNames: ["Tirana–Kamëz", "Kamëz–Fushë-Krujë", "Fushë-Krujë–Krujë"], geometry: [TIRANA, { lat: 41.381, lon: 19.83, label: "Kamëz" }, { lat: 41.479, lon: 19.718, label: "Fushë-Krujë" }, { lat: 41.509, lon: 19.792, label: "Krujë" }] }),
  makeRoute({ slug: "tirana-pogradec", from: "Tirana", to: "Pogradec", indexable: true, mountain: true, restriction: true, description: "Eastern route through Elbasan, Librazhd, and Prrenjas to Lake Ohrid at Pogradec.", sectionNames: ["Tirana–Elbasan", "Librazhd–Prrenjas / Arrat e Gurrës", "Prrenjas–Pogradec"], geometry: [TIRANA, { lat: 41.112, lon: 20.082, label: "Elbasan" }, { lat: 41.179, lon: 20.315, label: "Librazhd" }, { lat: 41.067, lon: 20.548, label: "Prrenjas" }, POGRADEC] }),
  makeRoute({ slug: "berat-gjirokaster", from: "Berat", to: "Gjirokastër", description: "Southbound inland connection from Berat through Fier and Tepelenë to Gjirokastër.", sectionNames: ["Berat–Fier", "Fier–Tepelenë", "Tepelenë–Gjirokastër"], geometry: [BERAT, { lat: 40.724, lon: 19.556, label: "Fier" }, { lat: 40.295, lon: 20.019, label: "Tepelenë" }, GJIROKASTER] }),
].sort((a, b) => a.title.localeCompare(b.title));

export function getRoadRoute(slug: string | undefined) {
  return ROAD_ROUTES.find((route) => route.slug === slug);
}

export const ROAD_DESTINATIONS = Array.from(new Set(ROAD_ROUTES.flatMap((route) => [route.from, route.to]))).sort();
