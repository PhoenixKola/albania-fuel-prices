export type CountryPageConfig = {
  slug: string;
  label: string;
  dataCountryName: string;
  context: string;
  compareHint: string;
};

export const COUNTRY_PAGES: CountryPageConfig[] = [
  {
    slug: "albania",
    label: "Albania",
    dataCountryName: "Albania",
    context:
      "Albania is a strong baseline for Balkan fuel planning because many overland trips begin in Tirana and continue toward Kosovo, Montenegro, North Macedonia, and Greece.",
    compareHint:
      "Use this page as your home-market reference before comparing neighboring countries.",
  },
  {
    slug: "kosovo",
    label: "Kosovo",
    dataCountryName: "Kosovo",
    context:
      "Kosovo is one of the most relevant cross-border comparisons for Albanian drivers travelling on the Tirana-Pristina corridor.",
    compareHint:
      "Compare Kosovo with Albania and North Macedonia when estimating regional travel costs.",
  },
  {
    slug: "montenegro",
    label: "Montenegro",
    dataCountryName: "Montenegro",
    context:
      "Montenegro matters for coastal and tourism-focused trips from northern Albania and for broader Adriatic road itineraries.",
    compareHint:
      "Compare Montenegro with Albania and Croatia for Adriatic travel planning.",
  },
  {
    slug: "north-macedonia",
    label: "North Macedonia",
    dataCountryName: "North Macedonia",
    context:
      "North Macedonia is a practical benchmark for eastern Balkan trips and a common transit market for regional drivers.",
    compareHint:
      "Compare with Albania, Greece, and Kosovo when planning cross-border routes.",
  },
  {
    slug: "greece",
    label: "Greece",
    dataCountryName: "Greece",
    context:
      "Greece is a major destination for Albanian travelers and typically reflects southern European tax and tourism demand dynamics.",
    compareHint:
      "Compare Greece against Albania for summer-season route budgeting.",
  },
  {
    slug: "italy",
    label: "Italy",
    dataCountryName: "Italy",
    context:
      "Italy is useful as a Mediterranean benchmark, especially for ferry-linked travel from Albania and wider EU comparisons.",
    compareHint:
      "Compare Italy with Albania and Croatia for Adriatic corridor planning.",
  },
  {
    slug: "croatia",
    label: "Croatia",
    dataCountryName: "Croatia",
    context:
      "Croatia offers a strong reference for Adriatic and Central European road routes and often sits between Balkan and western EU price patterns.",
    compareHint:
      "Compare Croatia with Montenegro and Italy on coastal routes.",
  },
  {
    slug: "portugal",
    label: "Portugal",
    dataCountryName: "Portugal",
    context:
      "Portugal is useful for western Europe comparisons where refinery access, logistics, and tax policy can create different price patterns.",
    compareHint:
      "Use Portugal as a western benchmark against Mediterranean and Balkan markets.",
  },
  {
    slug: "switzerland",
    label: "Switzerland",
    dataCountryName: "Switzerland",
    context:
      "Switzerland is a high-income market that helps users understand how premium economies can diverge from Balkan price levels.",
    compareHint:
      "Compare Switzerland with Italy and Albania to understand price spread magnitude.",
  },
  {
    slug: "united-kingdom",
    label: "United Kingdom",
    dataCountryName: "United Kingdom",
    context:
      "The United Kingdom is helpful for broader Europe-wide comparisons where tax structure and currency effects differ from eurozone countries.",
    compareHint:
      "Compare the UK with Portugal and Italy for western Europe context.",
  },
];

export function getCountryPageBySlug(slug: string) {
  return COUNTRY_PAGES.find((item) => item.slug === slug);
}
