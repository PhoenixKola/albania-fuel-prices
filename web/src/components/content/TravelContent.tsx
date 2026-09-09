import type { Lang } from "../../models/i18n";
import type { LatestEurope } from "../../models/fuel";
import { travelCopy } from "../../config/travelCopy";
import { ANALYSIS_META } from "../../generated/analysisMeta";
import { calculateTrip, defaultTrip, isPriceStale, tripSearch } from "../../utils/trip";
import JourneyArtwork from "./JourneyArtwork";

export function TravelHeader({ lang, guide = false }: { lang: Lang; guide?: boolean }) {
  const c = travelCopy[lang];
  return <header className="travelHero"><div className="travelHeroCopy"><p className="travelEyebrow">{c.eyebrow}</p>
    <h1>{guide ? c.guide : c.calculator}</h1><p>{guide ? c.guideIntro : c.intro}</p>
    {guide ? <p className="travelSmall">{c.reviewed}</p> : null}
    </div><div className="travelHeroArt"><JourneyArtwork /><div><strong>{c.heroNote}</strong><span>{c.heroDetail}</span></div></div>
  </header>;
}

export function RentalGuideHighlights({ lang }: { lang: Lang }) {
  return <div className="rentalHighlights">{travelCopy[lang].guideHighlights.map((item, index) => <div key={item.title}>
    <span aria-hidden="true">0{index + 1}</span><h2>{item.title}</h2><p>{item.text}</p>
  </div>)}</div>;
}

export function PriceDate({ lang, asOf }: { lang: Lang; asOf?: string }) {
  const c = travelCopy[lang];
  if (!asOf) return null;
  return <div className="travelPriceDate"><p>{c.asOf} <time dateTime={asOf}>{asOf}</time></p>
    {isPriceStale(asOf, ANALYSIS_META.staleAfterDays) ? <p className="travelNotice" role="status">{c.stale}</p> : null}</div>;
}

export function TripExplanation({ lang }: { lang: Lang }) {
  const c = travelCopy[lang];
  return <section className="travelSection"><h2>{c.howTitle}</h2><p>{c.how}</p><p>{c.note}</p>
    <a className="inlineLink" href="/methodology">{c.methodology} →</a></section>;
}

export function TripExample({ lang, data }: { lang: Lang; data: LatestEurope | null }) {
  const c = travelCopy[lang];
  const input = { ...defaultTrip(), legs: [{ country: "Albania", km: "500" }] };
  const result = calculateTrip(input, data?.countries ?? [], null);
  const price = result.legs[0].price;
  return <section className="travelSection travelExample"><span className="travelEyebrow">500 KM / 7 L/100 KM</span>
    <h2>{c.example}</h2><p>{c.exampleIntro}</p>
    <p className="travelEquation">35 L × {price === null ? "—" : `€${price.toFixed(3)}/L`} = <strong>{result.totalEur === null ? c.unavailable : `€${result.totalEur.toFixed(2)}`}</strong></p>
    <PriceDate lang={lang} asOf={data?.as_of} />
    {data?.source_url && /^https:\/\//.test(data.source_url) ? <p className="travelSmall">{c.source}: <a href={data.source_url} target="_blank" rel="noopener noreferrer">{data.source}</a></p> : null}
    <a className="editorialAction" href={`/trip-cost-calculator${tripSearch(input)}`}>{c.exampleCta} →</a>
  </section>;
}

export function RentalGuideSections({ lang, start = 0, end }: { lang: Lang; start?: number; end?: number }) {
  return <>{travelCopy[lang].guideSections.slice(start, end).map((section, index) => <section className="travelSection" key={section.title}>
    <span className="travelEyebrow">0{start + index + 1}</span><h2>{section.title}</h2><p>{section.text}</p>
    <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
  </section>)}</>;
}

export function RentalGuideSources({ lang }: { lang: Lang }) {
  const c = travelCopy[lang];
  return <section className="travelSection"><h2>{c.sourcesTitle}</h2><p>{c.sourcesText}</p><ul>
    <li><a href="https://www.discovercars.com/albania" target="_blank" rel="noopener noreferrer">{c.rentalSource}</a></li>
    <li><a href="https://www.discovercars.com/terms-and-conditions" target="_blank" rel="noopener noreferrer">{c.termsSource}</a></li>
    <li><a href="/methodology">{c.methodology}</a></li>
  </ul></section>;
}
