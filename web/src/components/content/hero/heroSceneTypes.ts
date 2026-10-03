import type { FuelType } from "../../../models/fuel";

/** Intro choreography, mirrored onto the hero as `data-stage` so the DOM board can resolve in step. */
export type HeroStage = "boot" | "source" | "road" | "markets" | "board" | "settled";

export type HeroVariant = "desktop" | "tablet" | "mobile";

export type HeroTheme = "dark" | "light";

export type HeroCta = "trip" | "stations" | null;

/** A real market shown on the route: ISO code plus its formatted national reference price. */
export type HeroMarker = { key: string; code: string; price: string };

/** Where the destination marker should land, as fractions of the scene canvas. */
export type HeroFocus = { x: number; y: number };

export type HeroSceneProps = {
  variant: HeroVariant;
  theme: HeroTheme;
  reducedMotion: boolean;
  /** Start in the resolved pose (reduced motion, or the intro window already passed). */
  skipIntro: boolean;
  active: boolean;
  fuelType: FuelType;
  destination: HeroMarker;
  context: HeroMarker[];
  cta: HeroCta;
  focus: HeroFocus;
  fontFamily: string;
  onStage: (stage: HeroStage) => void;
  /** Destination marker position in canvas pixels at the moment the board takes over. */
  onHandoff: (point: { x: number; y: number }) => void;
  onReady: () => void;
};
