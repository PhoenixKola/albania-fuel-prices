import type { LatestEurope } from "../models/fuel";
import { isValidSourceDate, compareCountries } from "../models/countryComparison";

export const SQ_ALBANIA_PATH = "/sq/cmimet-e-karburanteve-ne-shqiperi";
export const EN_ALBANIA_PATH = "/fuel-prices/albania";
export const SQ_ALBANIA_UPDATED = "2026-11-15";
export const SQ_ALBANIA_TITLE = "Çmimet e karburanteve në Shqipëri | Naftë, benzinë, gaz";
export const SQ_ALBANIA_DESCRIPTION = "Nafta, benzina 95 dhe gazi LPG në Shqipëri: vlera orientuese me datën e burimit, EUR për litër dhe buxhet për 50 litra. Jo çmime të garantuara në pompë.";

export function pairedAlbaniaPath(path: string) {
  if (path === SQ_ALBANIA_PATH) return EN_ALBANIA_PATH;
  if (path === EN_ALBANIA_PATH) return SQ_ALBANIA_PATH;
  return null;
}

export function albaniaAlternates(path: string) {
  return pairedAlbaniaPath(path) ? [{ lang: "en", path: EN_ALBANIA_PATH }, { lang: "sq", path: SQ_ALBANIA_PATH }] : [];
}

export function sqDate(date: string | null) {
  if (!date || !isValidSourceDate(date)) return "datë e paverifikuar";
  const months = ["janar", "shkurt", "mars", "prill", "maj", "qershor", "korrik", "gusht", "shtator", "tetor", "nëntor", "dhjetor"];
  const [year, month, day] = date.split("-").map(Number);
  return `${day} ${months[month - 1]} ${year}`;
}

export function albaniaSqModel(data: LatestEurope | null, fx?: { rate: number; date: string } | null, now = new Date()) {
  const row = data?.countries.find(row => row.country === "Albania");
  const source = row?.source ?? (!row?.provenance ? data?.source : null);
  const candidateUrl = row?.source_url ?? (!row?.provenance ? data?.source_url : null);
  let sourceUrl: string | null = null;
  try { if (candidateUrl && new URL(candidateUrl).protocol === "https:") sourceUrl = candidateUrl; } catch { /* Unusable provenance stays unlinked. */ }
  const verified = !!row && !row.provenance && typeof source === "string" && !!source.trim() && !!sourceUrl && isValidSourceDate(row.source_as_of ?? data?.as_of, now);
  const date = verified ? row!.source_as_of ?? data!.as_of : isValidSourceDate(row?.last_observed_at, now) ? row.last_observed_at : null;
  const usableFx = fx && Number.isFinite(fx.rate) && fx.rate > 50 && fx.rate < 250 && isValidSourceDate(fx.date, now) && now.getTime() - Date.parse(fx.date) <= 7 * 86400000 ? fx : null;
  const fuels = ([['diesel', 'Naftë (diesel)'], ['gasoline95', 'Benzinë 95'], ['lpg', 'Gaz për automjete (LPG)']] as const).map(([key, label]) => {
    const value = row?.[`${key}_eur`];
    const eur = typeof value === "number" && Number.isFinite(value) && value >= .1 && value <= 10 ? value : null;
    return { key, label, eur, tank: eur == null ? null : eur * 50, all: eur != null && usableFx ? eur * usableFx.rate : null };
  });
  const stale = !verified || !date || now.getTime() - Date.parse(date) > 3 * 86400000;
  // Deterministic SQ formatting also works in browsers with reduced ICU locales.
  const number = (value: number, digits: number) => value.toFixed(digits).replace(".", ",");
  const price = (value: number | null, digits = 3) => value == null ? "Nuk disponohet" : `${number(value, digits)} €`;
  const diesel = fuels[0];
  const dateLabel = date ? `${verified ? "Publikuar më" : "Vëzhguar më"} ${sqDate(date)}` : "Data e leximit nuk është verifikuar";
  const comparisons = ([['Greece', 'Greqi'], ['Kosovo', 'Kosovë']] as const).map(([country, label]) => {
    const other = data?.countries.find(row => row.country === country);
    const otherDate = other?.source_as_of ?? data?.as_of;
    let otherSourced = false;
    try {
      const url = other?.source_url ?? (country === "Kosovo" ? undefined : data?.source_url);
      otherSourced = !!(other?.source ?? (country === "Kosovo" ? undefined : data?.source)) && !!url && new URL(url).protocol === "https:";
    } catch { /* An untraceable reading is not a numerical comparison. */ }
    if (!verified || !other || !otherSourced || other.provenance || !isValidSourceDate(otherDate, now) || (country === "Kosovo" && !other.source_as_of)) return {
      country, label, text: `Krahasimi numerik nuk shfaqet pa datë publikimi të verifikuar për të dy tregjet.${isValidSourceDate(other?.last_observed_at, now) ? ` Vlera e ruajtur për këtë treg është vëzhguar më ${sqDate(other.last_observed_at)}; publikimi mbetet i paverifikuar.` : ""}`,
    };
    const parts = ([['diesel', 'Nafta'], ['gasoline95', 'Benzina 95']] as const).flatMap(([fuel, name]) => {
      const result = compareCountries(data, "Albania", country, fuel, 50, now);
      if (!result || result.provisional) return [];
      return [`${name}: ${price(result.priceA)}/L në Shqipëri dhe ${price(result.priceB)}/L në ${label}. Diferenca për 50 L është ${price(Math.abs(result.differenceForTank), 2)}${result.direction === "equal" ? " (vlera të barabarta)" : ` ${result.direction === "a-higher" ? "më shumë" : "më pak"} në Shqipëri`}.`];
    });
    return { country, label, text: `${parts.length ? parts.join(" ") : "Nuk ka çmime të përdorshme për krahasim."} Publikimet: Shqipëri ${sqDate(date)}; ${label} ${sqDate(otherDate)}.${date !== otherDate ? " Datat ndryshojnë; ky nuk është krahasim i së njëjtës ditë." : ""} Këto janë referenca të datuara, jo premtim kursimi në pompë.` };
  });
  const answer = diesel.eur == null ? "Nuk kemi një vlerë të përdorshme për naftën. Nuk e zëvendësojmë me një çmim të hamendësuar." : `Vlera orientuese e naftës është ${price(diesel.eur)} për litër. ${dateLabel}. Kjo është një referencë kombëtare për planifikim, jo çmim i garantuar në një pikë karburanti.`;
  const faqs = [
    { question: "Sa kushton nafta sot në Shqipëri?", answer: `${answer} ${stale ? "Leximi nuk është verifikuar si çmim i sotëm; kontrolloni çmimin në pompë para furnizimit." : "Edhe një publikim i ditës nuk vërteton çmimin në çdo pompë."}` },
    { question: "Sa kushtojnë 50 litra naftë?", answer: diesel.tank == null ? "Llogaritja nuk disponohet pa një çmim të përdorshëm për litër." : `Me këtë lexim të datuar: 50 L × ${price(diesel.eur)} për litër = ${price(diesel.tank, 2)}. Shuma reale varet nga çmimi i pikës ku furnizoheni.` },
    { question: "A janë këto çmimet tavan të Bordit të Transparencës?", answer: "Jo. Këtu paraqiten referenca kombëtare nga burimi i shënuar. Një çmim tavan është kufi maksimal i përcaktuar në një vendim zyrtar; nuk është çmim i vëzhguar në çdo pompë. Nuk publikojmë këtu një shifër tavani pa verifikuar vendimin dhe vlefshmërinë e tij." },
    { question: "Çfarë do të thotë çmimi në lekë?", answer: usableFx ? `Është vetëm përllogaritje: EUR/L × ${number(usableFx.rate, 4)} ALL për EUR, me kurs të datës ${sqDate(usableFx.date)}. Nuk është matje e çmimit në pompë dhe nuk përfshin kursin ose tarifat e bankës suaj.` : "Konvertimi në lekë nuk disponohet pa një kurs të vlefshëm dhe të datuar. Vlerat në EUR mbeten të përdorshme si referencë; nuk përdorim kurs të hamendësuar." },
    { question: "A tregon harta çmimin e çdo stacioni?", answer: "Jo. Harta ndihmon të gjeni stacione të listuara, largësinë e përafërt dhe oraret kur disponohen. Nuk kemi çmime të verifikuara për çdo pompë." },
  ];
  return { fuels, comparisons, verified, date, dateLabel, source: source ?? "Burimi i këtij leximi nuk është verifikuar", sourceUrl, fx: usableFx, stale, answer, faqs, price, number };
}

export function sqAlbaniaSchema(data: LatestEurope | null) {
  const m = albaniaSqModel(data);
  return { "@context": "https://schema.org", "@type": "WebPage", inLanguage: "sq", name: SQ_ALBANIA_TITLE, description: SQ_ALBANIA_DESCRIPTION, url: `https://karburantisot.com${SQ_ALBANIA_PATH}`, ...(m.verified && m.date ? { dateModified: m.date > SQ_ALBANIA_UPDATED ? m.date : SQ_ALBANIA_UPDATED, isBasedOn: m.sourceUrl ?? undefined } : {}), mainEntity: { "@type": "FAQPage", inLanguage: "sq", mainEntity: m.faqs.filter((_, i) => i !== 3).map(f => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) } };
}
