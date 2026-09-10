export const ROAD_STATUSES = ["OPEN", "CAUTION", "RESTRICTED", "CLOSED", "UNKNOWN"] as const;
export type RoadStatus = (typeof ROAD_STATUSES)[number];

export type RoadConfidence = "HIGH" | "MEDIUM" | "LOW";
export type VehicleAssessment = "CHECK" | "CAUTION" | "UNKNOWN";

export type RoadCoordinate = {
  lat: number;
  lon: number;
  label: string;
};

export type RoadSource = {
  id: string;
  authority: string;
  sourceType: "OFFICIAL_NOTICE" | "OFFICIAL_ARCHIVE" | "OPEN_MAP";
  title: string;
  url: string;
  publishedAt: string | null;
  checkedAt: string;
  geographicScope: string;
  derivedStatus: RoadStatus;
  note: string;
};

export type RoadSection = {
  id: string;
  name: string;
  status: RoadStatus;
  surface: string;
  notes: string;
  sourceIds: string[];
  lastCheckedAt: string;
  confidence: RoadConfidence;
  vehicleConsideration: string;
};

export type RoadVehicleGuidance = {
  normal2wd: VehicleAssessment;
  lowClearance: VehicleAssessment;
  higherClearance: VehicleAssessment;
  note: string;
};

export type RoadRoute = {
  id: string;
  slug: string;
  from: string;
  to: string;
  title: string;
  description: string;
  overallStatus: RoadStatus;
  statusExplanation: string;
  lastCheckedAt: string;
  lastChangedAt: string | null;
  confidence: RoadConfidence;
  routeSections: RoadSection[];
  sources: RoadSource[];
  notes: string[];
  vehicleGuidance: RoadVehicleGuidance;
  geometry: RoadCoordinate[];
  indexable: boolean;
};
