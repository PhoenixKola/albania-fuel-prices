import type { Theme } from "../../theme/theme";

/**
 * Home-only tokens. Light is an enamel roadside sign on atlas paper (the
 * selected price module is inverted ink); dark is an asphalt board with warm
 * off-white numerals. Teal marks state, amber marks "above average".
 */
export function homePalette(theme: Theme) {
  if (theme.name === "light") {
    return {
      paper: "#F4EFE6",
      deck: "#FFFCF6",
      deckBorder: "#1B2B3F",
      ink: "#102033",
      inkSoft: "#4A5A6C",
      inkFaint: "#6B7888",
      lane: "rgba(16,32,51,0.26)",
      rule: "rgba(16,32,51,0.12)",
      module: "#102033",
      moduleText: "#FBF6EC",
      moduleSoft: "rgba(251,246,236,0.74)",
      moduleRule: "rgba(251,246,236,0.18)",
      moduleGood: "#5EEAD4",
      moduleBad: "#FCD34D",
      good: "#0F766E",
      bad: "#B45309",
      accent: "#0F766E",
      accentSoft: "rgba(15,118,110,0.10)",
      chip: "#FFFCF6",
      chipBorder: "rgba(16,32,51,0.16)",
      pressed: "rgba(16,32,51,0.06)",
      spark: "#0F766E",
      sparkFill: "rgba(15,118,110,0.10)",
      warn: "#B45309",
      shadow: 0.08,
    };
  }
  return {
    paper: "#07111F",
    deck: "#0D1B2F",
    deckBorder: "rgba(226,232,240,0.14)",
    ink: "#F4EFE6",
    inkSoft: "rgba(244,239,230,0.70)",
    inkFaint: "rgba(244,239,230,0.56)",
    lane: "rgba(244,239,230,0.20)",
    rule: "rgba(244,239,230,0.10)",
    module: "#132840",
    moduleText: "#F4EFE6",
    moduleSoft: "rgba(244,239,230,0.72)",
    moduleRule: "rgba(244,239,230,0.12)",
    moduleGood: "#5EEAD4",
    moduleBad: "#FCD34D",
    good: "#5EEAD4",
    bad: "#FCD34D",
    accent: "#2DD4BF",
    accentSoft: "rgba(45,212,191,0.12)",
    chip: "#0D1B2F",
    chipBorder: "rgba(226,232,240,0.14)",
    pressed: "rgba(244,239,230,0.06)",
    spark: "#2DD4BF",
    sparkFill: "rgba(45,212,191,0.12)",
    warn: "#FCD34D",
    shadow: 0,
  };
}

export type HomePalette = ReturnType<typeof homePalette>;

/** Compact layout for short or narrow phones so the whole deck clears the banner + tab bar. */
export function isCompactHome(theme: Theme) {
  return theme.m.isSmall || (!theme.m.isTablet && theme.m.height < 700);
}
