import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Lang } from "../models/i18n";
import type { RoadStatus, VehicleAssessment } from "../models/road";
import { ROAD_ROUTES, getRoadRoute } from "../data/roadRoutes";
import { countRouteStatuses, formatRoadMetricTimestamp, formatRoadTimestamp, roadFreshness, roadFreshnessLabel, roadSourceAgeLabel, routeShareText, statusTone } from "../utils/roadReality";
import TripSelect from "../components/content/TripSelect";
import RoadRouteMap from "../components/road/RoadRouteMap";
import RentalReferral from "../components/ads/RentalReferral";
import AdsterraNativeAd from "../components/ads/AdsterraNativeAd";

const roadCopy = {
  en: {
    from: "From", to: "To", check: "Check route", eyebrow: "Road Reality · sourced route intelligence", title: "Albania Road Conditions & Route Status",
    lede: "Check road closures, restrictions, surface conditions, and recent official updates before driving in Albania.", curated: "curated routes", timestamped: "Every claim timestamped", unknownTrust: "Unknown beats a guess", verify: "VERIFY BEFORE DEPARTURE",
    invalid: "That route is not in the curated list yet. Showing Tirana → Theth instead.", routeStatus: "Route status", warning: "Conditions can change after the latest verification. Check current authority guidance before departure.",
    lastChecked: "Source reviewed", storedReview: "Check route displays the latest stored source review. It does not query road authorities in real time.", officialUpdates: "Check official sources", confidence: "Confidence", cautions: "Cautions", restricted: "Restricted / closed", unknown: "Unknown", share: "Share this route", calculate: "Calculate fuel cost", shared: "Route status copied or shared.", shareFailed: "Sharing is unavailable in this browser.",
    vehicleEyebrow: "Vehicle check", vehicleTitle: "What this record can tell you", vehicleIntro: "These indicators are conservative. They do not replace vehicle-specific restrictions, signs, or supplier terms.", normal: "Normal 2WD", low: "Low-clearance vehicle", high: "Higher-clearance vehicle", rental: "Rental vehicle", rentalText: "Check your rental supplier's road restrictions.",
    breakdown: "Route breakdown", sections: "Known sections", surface: "Surface", verification: "Verification", vehicleGuidance: "Vehicle guidance", noNotice: "No recent section-specific authority notice found.", notVerified: "Not verified.",
    provenance: "Provenance", sources: "Sources reviewed", sourcesIntro: "Each source retains its authority, scope, publication date where available, and the time Karburanti Sot last reviewed it.", scope: "Scope", published: "Published", sourceFreshness: "Source age", rolling: "Rolling archive / not stated", viewSource: "View source",
    before: "Before you drive", disclaimer: "Road conditions can change quickly. Karburanti Sot summarizes available sources and does not replace instructions from road authorities, police, emergency services, road signs, or your rental supplier.",
  },
  sq: {
    from: "Nga", to: "Për në", check: "Kontrollo itinerarin", eyebrow: "Road Reality · informacion rrugor me burime", title: "Kushtet dhe statusi i rrugëve në Shqipëri",
    lede: "Kontrollo mbylljet, kufizimet, sipërfaqen dhe njoftimet e fundit zyrtare para se të udhëtosh në Shqipëri.", curated: "itinerare të kuruara", timestamped: "Çdo pretendim ka datë", unknownTrust: "E panjohura është më mirë se hamendësimi", verify: "VERIFIKO PARA NISJES",
    invalid: "Ky itinerar nuk është ende në listën e kuruar. Po shfaqet Tirana → Theth.", routeStatus: "Statusi i itinerarit", warning: "Kushtet mund të ndryshojnë pas verifikimit të fundit. Kontrollo udhëzimet aktuale të autoriteteve para nisjes.",
    lastChecked: "Burimet u rishikuan", storedReview: "Kontrollo itinerarin shfaq rishikimin e fundit të ruajtur. Nuk pyet autoritetet rrugore në kohë reale.", officialUpdates: "Kontrollo burimet zyrtare", confidence: "Besueshmëria", cautions: "Kujdes", restricted: "Kufizuar / mbyllur", unknown: "E panjohur", share: "Ndaje itinerarin", calculate: "Llogarit karburantin", shared: "Statusi u kopjua ose u nda.", shareFailed: "Ndarja nuk ofrohet në këtë shfletues.",
    vehicleEyebrow: "Kontrolli i mjetit", vehicleTitle: "Çfarë tregon ky regjistrim", vehicleIntro: "Këta tregues janë konservatorë. Nuk zëvendësojnë kufizimet për mjetin, sinjalistikën apo kushtet e ofruesit.", normal: "Mjet normal 2WD", low: "Mjet me lartësi të ulët", high: "Mjet me lartësi më të madhe", rental: "Mjet me qira", rentalText: "Kontrollo kufizimet rrugore të ofruesit të qirasë.",
    breakdown: "Ndarja e itinerarit", sections: "Seksionet e njohura", surface: "Sipërfaqja", verification: "Verifikimi", vehicleGuidance: "Udhëzim për mjetin", noNotice: "Nuk u gjet njoftim i fundit zyrtar për këtë seksion.", notVerified: "E paverifikuar.",
    provenance: "Prejardhja", sources: "Burimet e rishikuara", sourcesIntro: "Çdo burim ruan autoritetin, shtrirjen, datën e publikimit kur ka dhe kohën kur Karburanti Sot e rishikoi së fundi.", scope: "Shtrirja", published: "Publikuar", sourceFreshness: "Mosha e burimit", rolling: "Arkiv i vazhdueshëm / pa datë", viewSource: "Shiko burimin",
    before: "Para se të udhëtosh", disclaimer: "Kushtet rrugore mund të ndryshojnë shpejt. Karburanti Sot përmbledh burimet e disponueshme dhe nuk zëvendëson udhëzimet e autoriteteve, policisë, emergjencës, sinjalistikës apo ofruesit të qirasë.",
  },
} as const;

const statusSq: Record<RoadStatus, string> = { OPEN: "E HAPUR", CAUTION: "KUJDES", RESTRICTED: "E KUFIZUAR", CLOSED: "E MBYLLUR", UNKNOWN: "E PANJOHUR" };

function StatusBadge({ status, lang, large = false }: { status: RoadStatus; lang: Lang; large?: boolean }) {
  return <span className={`roadStatusBadge roadStatus-${statusTone(status)}${large ? " roadStatusBadgeLarge" : ""}`}><i aria-hidden="true" />{lang === "sq" ? statusSq[status] : status}</span>;
}

function VehicleMark({ value, lang }: { value: VehicleAssessment; lang: Lang }) {
  const sq = { CHECK: "KONTROLLO", CAUTION: "KUJDES", UNKNOWN: "E PANJOHUR" } as const;
  return <span className={`roadVehicleMark roadVehicle-${value.toLowerCase()}`}>{lang === "sq" ? sq[value] : value}</span>;
}

function RoadSelector({ currentSlug, lang }: { currentSlug: string; lang: Lang }) {
  const navigate = useNavigate();
  const current = getRoadRoute(currentSlug) ?? ROAD_ROUTES[0];
  const [from, setFrom] = useState(current.from);
  const matches = useMemo(() => ROAD_ROUTES.filter((route) => route.from === from), [from]);
  const [to, setTo] = useState(current.to);
  const activeTo = matches.some((route) => route.to === to) ? to : matches[0]?.to ?? "";
  const selected = matches.find((route) => route.to === activeTo);
  const fromOptions = Array.from(new Set(ROAD_ROUTES.map((route) => route.from))).sort().map((value) => ({ value, label: value }));
  const toOptions = matches.map((route) => ({ value: route.to, label: route.to }));

  return (
    <form className="roadSelector" onSubmit={(event) => { event.preventDefault(); if (selected) navigate(`/road-status/${selected.slug}`); }}>
      <div className="roadSelectorFields">
        <TripSelect label={roadCopy[lang].from} value={from} options={fromOptions} onChange={(value) => { setFrom(value); const first = ROAD_ROUTES.find((route) => route.from === value); setTo(first?.to ?? ""); }} />
        <span className="roadSelectorArrow" aria-hidden="true">→</span>
        <TripSelect label={roadCopy[lang].to} value={activeTo} options={toOptions} onChange={setTo} />
      </div>
      <button className="roadCheckButton" type="submit" disabled={!selected}>{roadCopy[lang].check}<span aria-hidden="true">↗</span></button>
    </form>
  );
}

export default function RoadStatusPage({ lang, initialSlug }: { lang: Lang; initialSlug?: string }) {
  const requested = getRoadRoute(initialSlug);
  const route = requested ?? ROAD_ROUTES.find((item) => item.slug === "tirana-theth") ?? ROAD_ROUTES[0];
  const invalidRoute = Boolean(initialSlug && !requested);
  const counts = countRouteStatuses(route);
  const freshness = roadFreshness(route.lastCheckedAt);
  const checkedAt = formatRoadMetricTimestamp(route.lastCheckedAt, lang);
  const c = roadCopy[lang];
  const [shareState, setShareState] = useState<"idle" | "copied" | "failed">("idle");

  async function shareRoute() {
    const url = `${window.location.origin}/road-status/${route.slug}`;
    const text = lang === "sq" ? `${route.title}: ${statusSq[route.overallStatus]}. Burimet u rishikuan më ${formatRoadTimestamp(route.lastCheckedAt, lang)}. ${url}` : routeShareText(route, url);
    try {
      if (navigator.share) await navigator.share({ title: `${route.title} road status`, text, url });
      else await navigator.clipboard.writeText(text);
      setShareState("copied");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareState("failed");
    }
  }

  return (
    <main className="roadPage">
      <header className="roadHero">
        <div className="roadHeroCopy">
          <span className="roadEyebrow"><i aria-hidden="true" />{c.eyebrow}</span>
          <h1>{c.title}</h1>
          <p>{c.lede}</p>
          <div className="roadHeroTrust"><span>{ROAD_ROUTES.length} {c.curated}</span><span>{c.timestamped}</span><span>{c.unknownTrust}</span></div>
        </div>
        <div className="roadHeroSignal" aria-hidden="true"><span>RR</span><i /><i /><i /><small>{c.verify}</small></div>
      </header>

      <RoadSelector currentSlug={route.slug} lang={lang} />
      {invalidRoute ? <p className="roadNotice" role="status">{c.invalid}</p> : null}

      <section className="roadDashboard" aria-labelledby="road-result-title">
        <article className="roadResultCard">
          <div className="roadResultTopline"><span>{c.routeStatus}</span><span className={`roadFreshness roadFreshness-${freshness.state}`}>{roadFreshnessLabel(freshness, lang)}</span></div>
          <p className="roadRouteCode">RR / {route.slug.replaceAll("-", " / ")}</p>
          <h2 id="road-result-title">{route.title}</h2>
          <StatusBadge status={route.overallStatus} lang={lang} large />
          <p className="roadStatusExplanation">{lang === "sq" ? (route.overallStatus === "RESTRICTED" ? "Një njoftim i Policisë së Shtetit kufizon mjetet e rënda dhe autobusët në Arrat e Gurrës deri në një njoftim tjetër. Gjatë këtij kontrolli nuk u verifikua njoftim më i ri për rihapjen." : "Në burimet e kontrolluara nuk u verifikua njoftim aktual i autoriteteve për këtë itinerar. Kjo nuk provon se rruga është e hapur.") : route.statusExplanation}</p>
          <p className="roadConditionWarning">{c.warning}</p>
          <p className="roadStoredReviewNote">{c.storedReview}</p>
          <dl className="roadResultFacts">
            <div className="roadMetricTimestamp"><dt>{c.lastChecked}</dt><dd><strong>{checkedAt.date}</strong><span>{checkedAt.time}</span></dd></div>
            <div><dt>{c.confidence}</dt><dd><strong>{lang === "sq" && route.confidence === "LOW" ? "E ULËT" : route.confidence}</strong></dd></div>
            <div><dt>{c.cautions}</dt><dd><strong>{counts.CAUTION}</strong></dd></div>
            <div><dt>{c.restricted}</dt><dd><strong>{counts.RESTRICTED + counts.CLOSED}</strong></dd></div>
            <div><dt>{c.unknown}</dt><dd><strong>{counts.UNKNOWN}</strong></dd></div>
          </dl>
          <div className="roadResultActions">
            <button type="button" className="roadAction roadActionPrimary" onClick={shareRoute}>{c.share}</button>
            <Link className="roadAction" to="/trip-cost-calculator">{c.calculate}</Link>
            {route.sources.find((source) => source.sourceType !== "OPEN_MAP") ? <a className="roadAction" href={route.sources.find((source) => source.sourceType !== "OPEN_MAP")!.url} target="_blank" rel="noopener noreferrer">{c.officialUpdates} ↗</a> : null}
          </div>
          {shareState !== "idle" ? <p className={`roadShareState roadShareState-${shareState}`} role="status">{shareState === "copied" ? c.shared : c.shareFailed}</p> : null}
        </article>

        <RoadRouteMap route={route} lang={lang} />
      </section>

      <section className="roadVehiclePanel" aria-labelledby="road-vehicles-title">
        <div><span className="roadSectionEyebrow">{c.vehicleEyebrow}</span><h2 id="road-vehicles-title">{c.vehicleTitle}</h2><p>{c.vehicleIntro}</p></div>
        <dl className="roadVehicleGrid">
          <div><dt>{c.normal}</dt><dd><VehicleMark value={route.vehicleGuidance.normal2wd} lang={lang} /></dd></div>
          <div><dt>{c.low}</dt><dd><VehicleMark value={route.vehicleGuidance.lowClearance} lang={lang} /></dd></div>
          <div><dt>{c.high}</dt><dd><VehicleMark value={route.vehicleGuidance.higherClearance} lang={lang} /></dd></div>
          <div><dt>{c.rental}</dt><dd>{c.rentalText}</dd></div>
        </dl>
        <p className="roadVehicleNote">{lang === "sq" ? "Kontrollo manualin e mjetit, udhëzimet aktuale të autoriteteve, sinjalistikën dhe kushtet lokale para nisjes." : route.vehicleGuidance.note}</p>
      </section>

      <section className="roadSections" aria-labelledby="road-sections-title">
        <div className="roadSectionHeading"><div><span className="roadSectionEyebrow">{c.breakdown}</span><h2 id="road-sections-title">{c.sections}</h2></div><p>{lang === "sq" ? `Itinerari nga ${route.from} drejt ${route.to}, i ndarë në seksione për verifikimin e kushteve.` : route.description}</p></div>
        <div className="roadSectionList">
          {route.routeSections.map((item, index) => {
            const itemFreshness = roadFreshness(item.lastCheckedAt);
            return (
              <article className="roadSectionCard" key={item.id}>
                <header className="roadSectionMain"><span className="roadSectionIndex">{String(index + 1).padStart(2, "0")}</span><h3>{item.name}</h3><StatusBadge status={item.status} lang={lang} /></header>
                <dl><div><dt>{c.surface}</dt><dd>{lang === "sq" ? (item.status === "RESTRICTED" ? "Devijim i përkohshëm; sipërfaqja aktuale nuk është riverifikuar" : "E paverifikuar në terren në mënyrë të pavarur") : item.surface}</dd></div><div><dt>{c.verification}</dt><dd className={`roadFreshness-${itemFreshness.state}`}>{roadFreshnessLabel(itemFreshness, lang)}</dd></div><div><dt>{c.confidence}</dt><dd>{lang === "sq" && item.confidence === "LOW" ? "E ULËT" : item.confidence}</dd></div></dl>
                <p>{lang === "sq" ? (item.status === "UNKNOWN" ? c.noNotice : "Një njoftim zyrtar kufizon mjetet e rënda dhe autobusët në këtë korridor deri në një njoftim tjetër. Kontrollo sinjalistikën dhe udhëzimet aktuale.") : (item.status === "UNKNOWN" ? c.noNotice : item.notes)}</p>
                <small><strong>{c.vehicleGuidance}</strong>{lang === "sq" ? (item.status === "UNKNOWN" ? c.notVerified : "Kufizimi i publikuar përmend mjetet e rënda dhe autobusët; kontrollo lejen për mjetin tënd ose mjetin me qira.") : (item.status === "UNKNOWN" ? c.notVerified : item.vehicleConsideration)}</small>
              </article>
            );
          })}
        </div>
      </section>

      <section className="roadSources" aria-labelledby="road-sources-title">
        <div className="roadSectionHeading"><div><span className="roadSectionEyebrow">{c.provenance}</span><h2 id="road-sources-title">{c.sources}</h2></div><p>{c.sourcesIntro}</p></div>
        <div className="roadSourceGrid">
          {route.sources.map((source) => {
            const sourceFreshness = roadFreshness(source.publishedAt ?? source.checkedAt);
            return (
              <article className="roadSourceCard" key={source.id}>
                <span>{lang === "sq" ? ({ OFFICIAL_NOTICE: "NJOFTIM ZYRTAR", OFFICIAL_ARCHIVE: "ARKIV ZYRTAR", OPEN_MAP: "HARTË E HAPUR" } as const)[source.sourceType] : source.sourceType.replaceAll("_", " ")}</span>
                <h3>{source.authority}</h3>
                <strong>{lang === "sq" ? (source.id === "openstreetmap" ? "Harta bazë OpenStreetMap" : source.id.includes("restriction") ? "Kufizimi Librazhd–Pogradec në Arrat e Gurrës" : source.id.includes("deviation") ? "Devijimi i përkohshëm në Arrat e Gurrës" : source.id === "state-police-updates" ? "Njoftime policie dhe përditësime rrugore" : "Njoftime për kushtet rrugore") : source.title}</strong>
                <p>{lang === "sq" ? (source.id === "openstreetmap" ? "Përdoret vetëm për kontekst gjeografik. OpenStreetMap nuk verifikon mbylljen aktuale ose përshtatshmërinë për udhëtim." : source.id.includes("restriction") ? "Njoftimi kufizon mjetet e rënda dhe autobusët deri në një njoftim tjetër dhe u kërkon drejtuesve të ndjekin sinjalistikën dhe policinë." : source.id.includes("deviation") ? "ARRSH përshkroi një devijim të përkohshëm me sinjalistikë punimesh; njoftimi i vjetër jep kontekst dhe jo garanci aktuale." : "Arkivi publik u kontrollua, por nuk u verifikua njoftim aktual posaçërisht për këtë itinerar. Mungesa e njoftimit nuk konfirmon rrugë të hapur.") : source.note}</p>
                <dl><div><dt>{c.scope}</dt><dd>{lang === "sq" ? `${route.from} – ${route.to}${source.id === "openstreetmap" ? " · kontekst harte" : ""}` : source.geographicScope}</dd></div><div><dt>{c.published}</dt><dd>{source.publishedAt ? formatRoadTimestamp(source.publishedAt, lang) : c.rolling}</dd></div><div><dt>{c.sourceFreshness}</dt><dd className={`roadFreshness-${sourceFreshness.state}`}>{roadSourceAgeLabel(source.publishedAt, source.checkedAt, lang)}</dd></div></dl>
                <a href={source.url} target="_blank" rel="noopener noreferrer">{c.viewSource} <span aria-hidden="true">↗</span></a>
              </article>
            );
          })}
        </div>
      </section>

      <RentalReferral lang={lang} placement="roadTrip" />
      <aside className="roadDisclaimer"><span className="roadDisclaimerIcon" aria-hidden="true">!</span><div><strong>{c.before}</strong><p>{c.disclaimer}</p></div></aside>
      <AdsterraNativeAd location="road-after-source-review" />
    </main>
  );
}
