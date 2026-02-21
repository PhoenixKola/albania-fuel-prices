export type ThemeName = "light" | "dark";

export type Theme = {
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

export const themes: Record<ThemeName, Theme> = {
  light: {
    name: "light",
    colors: {
      bg: "#F6F7FB",
      card: "#FFFFFF",
      tile: "#F3F5FF",
      text: "#0F172A",
      subText: "#334155",
      muted: "#64748B",
      border: "rgba(0,0,0,0.08)",
      pillBg: "rgba(17,24,39,0.06)",
      primary: "#111827",
      primaryText: "#FFFFFF",
      linkBg: "rgba(37, 99, 235, 0.10)",
      linkText: "#1D4ED8",
      danger: "#DC2626",
      overlay: "rgba(0,0,0,0.45)",
    },
  },
  dark: {
    name: "dark",
    colors: {
      bg: "#0B1220",
      card: "#0F1730",
      tile: "rgba(255,255,255,0.08)",
      text: "rgba(255,255,255,0.92)",
      subText: "rgba(255,255,255,0.70)",
      muted: "rgba(255,255,255,0.60)",
      border: "rgba(255,255,255,0.12)",
      pillBg: "rgba(255,255,255,0.10)",
      primary: "#3B82F6",
      primaryText: "#FFFFFF",
      linkBg: "rgba(96, 165, 250, 0.16)",
      linkText: "rgba(255,255,255,0.92)",
      danger: "#F87171",
      overlay: "rgba(0,0,0,0.55)",
    },
  },
};