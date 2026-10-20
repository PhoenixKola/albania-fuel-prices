import type { CountryEditorial } from "./countryContent";
import type { LatestEurope, FuelType } from "../models/fuel";
import { compareCountries, comparisonSentence, isValidSourceDate } from "../models/countryComparison";

const context: Record<string, { en: string; sq: string }> = {
  Albania: { en: "Albania is the reference market for journeys toward Kosovo, Greece, Montenegro and North Macedonia.", sq: "Shqipëria është tregu i referencës për udhëtimet drejt Kosovës, Greqisë, Malit të Zi dhe Maqedonisë së Veriut." },
  Kosovo: { en: "Kosovo uses the euro; the Albania–Kosovo corridor is a useful two-market trip example.", sq: "Kosova përdor euron; korridori Shqipëri–Kosovë është shembull praktik i një udhëtimi mes dy tregjeve." },
  Montenegro: { en: "Montenegro uses the euro and sits on Adriatic routes north of Albania.", sq: "Mali i Zi përdor euron dhe ndodhet në rrugët adriatike në veri të Shqipërisë." },
  "North Macedonia": { en: "North Macedonia is relevant to routes from Albania toward Ohrid and Skopje.", sq: "Maqedonia e Veriut lidhet me rrugët nga Shqipëria drejt Ohrit dhe Shkupit." },
  Greece: { en: "Greece is a common destination south of Albania; petrol and diesel comparisons can point in different directions.", sq: "Greqia është destinacion i zakonshëm në jug të Shqipërisë; krahasimet e benzinës dhe naftës mund të tregojnë drejtime të ndryshme." },
  Italy: { en: "Italy is relevant to journeys involving Adriatic ferry crossings and onward European roads.", sq: "Italia lidhet me udhëtimet që përfshijnë tragetet e Adriatikut dhe rrugët e mëtejshme evropiane." },
  Croatia: { en: "Croatia is a practical reference for longer Adriatic journeys through several countries.", sq: "Kroacia është referencë praktike për udhëtime më të gjata përgjatë Adriatikut në disa vende." },
  Portugal: { en: "Portugal provides a western European reference for longer trips and local driving budgets.", sq: "Portugalia shërben si referencë e Evropës Perëndimore për udhëtime më të gjata dhe buxhete lokale drejtimi." },
  Switzerland: { en: "Switzerland uses the franc; EUR values here are comparison references, not a CHF pump quote.", sq: "Zvicra përdor frangun; vlerat në EUR këtu shërbejnë për krahasim dhe nuk janë çmime pompe në CHF." },
  "United Kingdom": { en: "The United Kingdom uses sterling; EUR values here are comparison references, not a GBP pump quote.", sq: "Mbretëria e Bashkuar përdor stërlinën; vlerat në EUR këtu shërbejnë për krahasim dhe nuk janë çmime pompe në GBP." },
};

const fuels: FuelType[] = ["gasoline95", "diesel", "lpg"];
const fuelNames = { en: { gasoline95: "Petrol 95", diesel: "diesel", lpg: "LPG" }, sq: { gasoline95: "Benzina 95", diesel: "nafta", lpg: "LPG" } } as const;

/** The same dated, fuel-specific editorial model feeds React and prerender/JSON-LD. */
export function countryPageContent(editorial: CountryEditorial, data: LatestEurope | null, lang: "en" | "sq") {
  const name = editorial.dataCountryName;
  const row = data?.countries.find((item) => item.country === name);
  const date = isValidSourceDate(data?.as_of) ? data.as_of : null;
  const marketDate = row?.provenance === "date-unverified" || row?.provenance === "historical-fallback"
    ? (isValidSourceDate(row.source_as_of) ? row.source_as_of : null)
    : (isValidSourceDate(row?.source_as_of) ? row.source_as_of : date);
  const values = fuels.map((fuel) => {
    const value = row?.[`${fuel}_eur` as const];
    return `${fuelNames[lang][fuel]}: ${typeof value === "number" && value > 0 && value <= 10 ? `€${value.toFixed(3)}/L` : (lang === "sq" ? "pa të dhëna" : "unavailable")}`;
  }).join(" · ");
  const sourceLabel = row?.source ?? (row?.provenance === "date-unverified" || row?.provenance === "historical-fallback"
    ? (lang === "sq" ? "vlerë e ruajtur më parë; burimi i këtij tregu i paverifikuar" : "previously collected value; market source unverified")
    : data?.source ?? (lang === "sq" ? "burimi nuk disponohet" : "source unavailable"));
  const dateLabel = marketDate ?? (lang === "sq" ? "datë e paverifikuar" : "date unverified");
  const baseline = name === "Albania" ? "Greece" : "Albania";
  const comparison = (fuel: FuelType, a = name, b = baseline) => comparisonSentence(compareCountries(data, a, b, fuel), a, b, fuel, lang);
  const borderAdvice = name === "Albania"
    ? ["Greece", "Kosovo"].flatMap((other) => fuels.map((fuel) => comparison(fuel, "Albania", other))).join(" ")
    : fuels.map((fuel) => comparison(fuel)).join(" ");
  const contextText = context[name]?.[lang] ?? (lang === "sq" ? "Përdorni këto vlera për planifikimin e udhëtimit." : "Use these values for trip planning.");

  if (lang === "sq") return {
    marketOverview: `${contextText} Vlerat kombëtare orientuese: ${values}. Data e burimit për këtë treg: ${dateLabel}.`,
    albaniaContext: `Krahasimi me Shqipërinë përdor të njëjtin lloj karburanti dhe çmimet në EUR/L. Për rrugën tuaj, vendosni distancën dhe konsumin te llogaritësi i udhëtimit.`,
    travelRelevance: `${contextText} Shikoni edhe kushtet e rrugës dhe stacionet e listuara përpara nisjes; kjo faqe nuk raporton çmime në pompa të veçanta.`,
    fuelInterpretation: `Benzina 95, nafta dhe LPG krahasohen veçmas. Mungesa e një çmimi LPG këtu nuk provon mungesën e stacioneve LPG. ${values}.`,
    borderAdvice,
    dataLimitations: "Këto janë vlera orientuese në nivel vendi, jo çmime të konfirmuara në stacione. Krahasimi i 50 L është shembull; konsumi, rruga, devijimet, pagesat dhe çmimi real në pompë mund ta ndryshojnë rezultatin.",
    sourceTransparency: `Burimi: ${sourceLabel}. Data e publikimit/vëzhgimit për këtë treg: ${dateLabel}. Koha kur sistemi ynë e mori skedarin nuk është data e publikimit nga burimi.`,
    faqs: [
      { question: `Sa janë çmimet orientuese të karburantit në ${editorial.label}?`, answer: `${values}. Data e burimit: ${dateLabel}.` },
      { question: `Si krahasohet nafta në ${editorial.label} me ${baseline}?`, answer: comparison("diesel") },
      { question: `A është ky çmimi në çdo pompë në ${editorial.label}?`, answer: "Jo. Janë vlera kombëtare orientuese; çmimet e stacioneve dhe oraret duhen kontrolluar veçmas." },
    ],
  };
  return {
    marketOverview: `${contextText} National reference values: ${values}. Source date for this market: ${dateLabel}.`,
    albaniaContext: "The Albania comparison uses the same fuel type and EUR/L reference prices. Enter your own distance and consumption in the trip calculator for a route estimate.",
    travelRelevance: `${contextText} Check listed stations and road conditions before departure; this page does not report individual pump prices.`,
    fuelInterpretation: `Petrol 95, diesel and LPG are compared separately. Missing LPG data here does not prove that LPG stations are absent. ${values}.`,
    borderAdvice,
    dataLimitations: "These are country-level reference values, not confirmed station prices. The 50 L comparison is illustrative; consumption, route, detours, payment and the actual pump price can change the result.",
    sourceTransparency: `Source: ${sourceLabel}. Publication/observation date for this market: ${dateLabel}. The time our system fetched the file is not the upstream publication date.`,
    faqs: [
      { question: `What are the reference fuel prices in ${editorial.label}?`, answer: `${values}. Source date: ${dateLabel}.` },
      { question: `How does ${editorial.label} diesel compare with ${baseline}?`, answer: comparison("diesel") },
      { question: `Is this the price at every pump in ${editorial.label}?`, answer: "No. These are national reference values; check station prices and opening hours separately." },
    ],
  };
}
