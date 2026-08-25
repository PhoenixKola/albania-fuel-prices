export type ThemeName = "light" | "dark";

export type Palette = {
  name: ThemeName;
  colors: {
    bg: string;
    card: string;
    tile: string;
    text: string;
    subText: string;
    muted: string;
    border: string;
    pillBg: string;
    primary: string;
    primaryText: string;
    linkBg: string;
    linkText: string;
    danger: string;
    overlay: string;
  };
};

export const themes: Record<ThemeName, Palette> = {
  light: {
    name: "light",
    colors: {
      bg: "#F7F3EC",
      card: "#FFFCF7",
      tile: "#EFF6F4",
      text: "#102033",
      subText: "#405063",
      muted: "#718094",
      border: "rgba(16,32,51,0.10)",
      pillBg: "rgba(16,32,51,0.06)",
      primary: "#0F766E",
      primaryText: "#FFFFFF",
      linkBg: "rgba(14, 116, 144, 0.10)",
      linkText: "#0E7490",
      danger: "#D14343",
      overlay: "rgba(0,0,0,0.45)",
    },
  },
  dark: {
    name: "dark",
    colors: {
      bg: "#07111F",
      card: "#0D1B2F",
      tile: "rgba(148, 163, 184, 0.11)",
      text: "rgba(248,250,252,0.94)",
      subText: "rgba(226,232,240,0.74)",
      muted: "rgba(203,213,225,0.62)",
      border: "rgba(226,232,240,0.13)",
      pillBg: "rgba(226,232,240,0.10)",
      primary: "#2DD4BF",
      primaryText: "#FFFFFF",
      linkBg: "rgba(45, 212, 191, 0.14)",
      linkText: "#8DEDE1",
      danger: "#FB7185",
      overlay: "rgba(0,0,0,0.55)",
    },
  },
};

// ─── Responsive metrics ─────────────────────────────────────────────────────
// The app previously hardcoded every size against roughly a 390pt design,
// so it cramped on 320pt phones and looked stranded on tablets. These
// helpers scale spacing and type against the real window width, clamped at
// both ends so nothing collapses or balloons, and cap the content column so
// wide screens read as a centred layout rather than stretched rows.

/** Width the original spacing and type were designed against. */
const DESIGN_WIDTH = 390;

export type Metrics = {
  width: number;
  height: number;
  /** Scale a spacing value (padding, margin, gap). */
  s: (n: number) => number;
  /** Scale a font size — deliberately gentler than spacing. */
  f: (n: number) => number;
  /** Narrow phones (iPhone SE, small Androids). */
  isSmall: boolean;
  /** Tablets and foldables opened out. */
  isTablet: boolean;
  isLandscape: boolean;
  /** Horizontal screen padding. */
  gutter: number;
  /** Cap for the readable content column on wide screens. */
  maxContentWidth: number;
};

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export function makeMetrics(width: number, height: number): Metrics {
  const isTablet = Math.min(width, height) >= 600;
  const isSmall = width < 360;
  const isLandscape = width > height;

  // Content is centred and capped, so wide screens get a column, not a stretch.
  const maxContentWidth = isTablet ? 640 : 560;

  // Scale off the SHORTER edge: a phone rotated to landscape is still a phone,
  // and inflating spacing there would eat the little vertical room it has.
  const reference = Math.min(Math.min(width, height), maxContentWidth);
  const ratio = reference / DESIGN_WIDTH;
  const spaceRatio = clamp(ratio, 0.86, 1.18);
  const fontRatio = clamp(ratio, 0.92, 1.12);

  return {
    width,
    height,
    s: (n) => Math.round(n * spaceRatio),
    f: (n) => Math.round(n * fontRatio),
    isSmall,
    isTablet,
    isLandscape,
    gutter: Math.round((isSmall ? 12 : 16) * spaceRatio),
    maxContentWidth,
  };
}

/** Fallback for any style factory called outside a component tree. */
export const defaultMetrics = makeMetrics(DESIGN_WIDTH, 844);


/** A palette plus the responsive metrics for the current window. */
export type Theme = Palette & { m: Metrics };

export function composeTheme(name: ThemeName, width: number, height: number): Theme {
  return { ...themes[name], m: makeMetrics(width, height) };
}
