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
