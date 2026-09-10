import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Lang } from "../models/i18n";
import type { RoadStatus, VehicleAssessment } from "../models/road";
import { ROAD_ROUTES, getRoadRoute } from "../data/roadRoutes";
import { countRouteStatuses, formatRoadTimestamp, roadFreshness, routeShareText, statusTone } from "../utils/roadReality";
import TripSelect from "../components/content/TripSelect";
import RoadRouteMap from "../components/road/RoadRouteMap";
import RentalReferral from "../components/ads/RentalReferral";

function StatusBadge({ status, large = false }: { status: RoadStatus; large?: boolean }) {
  return <span className={`roadStatusBadge roadStatus-${statusTone(status)}${large ? " roadStatusBadgeLarge" : ""}`}><i aria-hidden="true" />{status}</span>;
}

function VehicleMark({ value }: { value: VehicleAssessment }) {
  return <span className={`roadVehicleMark roadVehicle-${value.toLowerCase()}`}>{value === "CHECK" ? "CHECK" : value}</span>;
}

function RoadSelector({ currentSlug }: { currentSlug: string }) {
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
        <TripSelect label="From" value={from} options={fromOptions} onChange={(value) => { setFrom(value); const first = ROAD_ROUTES.find((route) => route.from === value); setTo(first?.to ?? ""); }} />
        <span className="roadSelectorArrow" aria-hidden="true">→</span>
        <TripSelect label="To" value={activeTo} options={toOptions} onChange={setTo} />
      </div>
      <button className="roadCheckButton" type="submit" disabled={!selected}>Check route<span aria-hidden="true">↗</span></button>
    </form>
  );
}

export default function RoadStatusPage({ lang, initialSlug }: { lang: Lang; initialSlug?: string }) {
  const requested = getRoadRoute(initialSlug);
  const route = requested ?? ROAD_ROUTES.find((item) => item.slug === "tirana-theth") ?? ROAD_ROUTES[0];
  const invalidRoute = Boolean(initialSlug && !requested);
  const counts = countRouteStatuses(route);
  const freshness = roadFreshness(route.lastCheckedAt);
  const [shareState, setShareState] = useState<"idle" | "copied" | "failed">("idle");

  async function shareRoute() {
    const url = `${window.location.origin}/road-status/${route.slug}`;
    const text = routeShareText(route, url);
    try {
      if (navigator.share) await navigator.share({ title: `${route.title} road status`, text, url });
      else await navigator.clipboard.writeText(text);
      setShareState("copied");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareState("failed");
    }
  }

  function submitReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const body = [
      "UNVERIFIED USER REPORT",
      `Route: ${route.title}`,
      `Section/location: ${String(form.get("location") ?? "")}`,
      `Observed condition: ${String(form.get("condition") ?? "")}`,
      `Date/time observed: ${String(form.get("observedAt") ?? "")}`,
      `Source or photo URL: ${String(form.get("sourceUrl") ?? "")}`,
      `Note: ${String(form.get("note") ?? "")}`,
      "",
      "I understand this report will be reviewed and will not automatically change an official road status.",
    ].join("\n");
    window.location.href = `mailto:fenixkola@gmail.com?subject=${encodeURIComponent(`Road condition report: ${route.title}`)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <main className="roadPage">
      <header className="roadHero">
        <div className="roadHeroCopy">
          <span className="roadEyebrow"><i aria-hidden="true" />Road Reality · sourced route intelligence</span>
          <h1>Albania Road Conditions &amp; Route Status</h1>
          <p>Check road closures, restrictions, surface conditions, and recent official updates before driving in Albania.</p>
          <div className="roadHeroTrust"><span>{ROAD_ROUTES.length} curated routes</span><span>Every claim timestamped</span><span>Unknown beats a guess</span></div>
        </div>
        <div className="roadHeroSignal" aria-hidden="true"><span>RR</span><i /><i /><i /><small>VERIFY BEFORE DEPARTURE</small></div>
      </header>

      <RoadSelector currentSlug={route.slug} />
      {invalidRoute ? <p className="roadNotice" role="status">That route is not in the curated list yet. Showing Tirana → Theth instead.</p> : null}

      <section className="roadDashboard" aria-labelledby="road-result-title">
        <article className="roadResultCard">
          <div className="roadResultTopline"><span>Route status</span><span className={`roadFreshness roadFreshness-${freshness.state}`}>{freshness.label}</span></div>
          <p className="roadRouteCode">RR / {route.slug.replaceAll("-", " / ")}</p>
          <h2 id="road-result-title">{route.title}</h2>
          <StatusBadge status={route.overallStatus} large />
          <p className="roadStatusExplanation">{route.statusExplanation}</p>
          <p className="roadConditionWarning">Conditions can change after the latest verification. Check current authority guidance before departure.</p>
          <dl className="roadResultFacts">
            <div><dt>Last checked</dt><dd>{formatRoadTimestamp(route.lastCheckedAt)}</dd></div>
            <div><dt>Confidence</dt><dd>{route.confidence}</dd></div>
            <div><dt>Known cautions</dt><dd>{counts.CAUTION}</dd></div>
            <div><dt>Restricted / closed</dt><dd>{counts.RESTRICTED + counts.CLOSED}</dd></div>
            <div><dt>Unknown sections</dt><dd>{counts.UNKNOWN}</dd></div>
          </dl>
          <div className="roadResultActions">
            <button type="button" className="roadAction roadActionPrimary" onClick={shareRoute}>Share this route</button>
            <Link className="roadAction" to="/trip-cost-calculator">Calculate fuel cost</Link>
          </div>
          {shareState !== "idle" ? <p className={`roadShareState roadShareState-${shareState}`} role="status">{shareState === "copied" ? "Route status copied or shared." : "Sharing is unavailable in this browser."}</p> : null}
        </article>

        <RoadRouteMap route={route} />
      </section>

      <section className="roadVehiclePanel" aria-labelledby="road-vehicles-title">
        <div><span className="roadSectionEyebrow">Vehicle check</span><h2 id="road-vehicles-title">What this record can tell you</h2><p>These indicators are conservative. They do not replace vehicle-specific restrictions, signs, or supplier terms.</p></div>
        <dl className="roadVehicleGrid">
          <div><dt>Normal 2WD</dt><dd><VehicleMark value={route.vehicleGuidance.normal2wd} /></dd></div>
          <div><dt>Low-clearance vehicle</dt><dd><VehicleMark value={route.vehicleGuidance.lowClearance} /></dd></div>
          <div><dt>Higher-clearance vehicle</dt><dd><VehicleMark value={route.vehicleGuidance.higherClearance} /></dd></div>
          <div><dt>Rental vehicle</dt><dd>Check your rental supplier&apos;s road restrictions.</dd></div>
        </dl>
        <p className="roadVehicleNote">{route.vehicleGuidance.note}</p>
      </section>

      <section className="roadSections" aria-labelledby="road-sections-title">
        <div className="roadSectionHeading"><div><span className="roadSectionEyebrow">Route breakdown</span><h2 id="road-sections-title">Known sections</h2></div><p>{route.description}</p></div>
        <div className="roadSectionList">
          {route.routeSections.map((item, index) => {
            const itemFreshness = roadFreshness(item.lastCheckedAt);
            return (
              <article className="roadSectionCard" key={item.id}>
                <span className="roadSectionIndex">{String(index + 1).padStart(2, "0")}</span>
                <div className="roadSectionMain"><h3>{item.name}</h3><StatusBadge status={item.status} /></div>
                <dl><div><dt>Surface</dt><dd>{item.surface}</dd></div><div><dt>Verification</dt><dd className={`roadFreshness-${itemFreshness.state}`}>{itemFreshness.label}</dd></div><div><dt>Confidence</dt><dd>{item.confidence}</dd></div></dl>
                <p>{item.notes}</p>
                <small>{item.vehicleConsideration}</small>
              </article>
            );
          })}
        </div>
      </section>

      <section className="roadSources" aria-labelledby="road-sources-title">
        <div className="roadSectionHeading"><div><span className="roadSectionEyebrow">Provenance</span><h2 id="road-sources-title">Sources checked</h2></div><p>Each source retains its authority, scope, publication date where available, and the time Karburanti Sot checked it.</p></div>
        <div className="roadSourceGrid">
          {route.sources.map((source) => {
            const sourceFreshness = roadFreshness(source.publishedAt ?? source.checkedAt);
            return (
              <article className="roadSourceCard" key={source.id}>
                <span>{source.sourceType.replaceAll("_", " ")}</span>
                <h3>{source.authority}</h3>
                <strong>{source.title}</strong>
                <p>{source.note}</p>
                <dl><div><dt>Scope</dt><dd>{source.geographicScope}</dd></div><div><dt>Published</dt><dd>{source.publishedAt ? formatRoadTimestamp(source.publishedAt) : "Rolling archive / not stated"}</dd></div><div><dt>Source freshness</dt><dd className={`roadFreshness-${sourceFreshness.state}`}>{sourceFreshness.label}</dd></div></dl>
                <a href={source.url} target="_blank" rel="noopener noreferrer">View source <span aria-hidden="true">↗</span></a>
              </article>
            );
          })}
        </div>
      </section>

      <RentalReferral lang={lang} placement="roadTrip" />

      <details className="roadReport">
        <summary>Report a newer condition <span>Community input · reviewed manually</span></summary>
        <div className="roadReportBody">
          <div><span className="roadReportLabel">Unverified user report</span><h2>Tell us what you observed</h2><p>Your email opens with these details. Reports are reviewed manually and never override an official closure or restriction automatically.</p></div>
          <form onSubmit={submitReport}>
            <label>Route<input value={route.title} readOnly /></label>
            <label>Section or location<input name="location" required autoComplete="off" /></label>
            <label>Observed condition<select name="condition" required defaultValue=""><option value="" disabled>Select one</option><option>Open / passable observation</option><option>Caution or poor surface</option><option>Restriction</option><option>Closure</option><option>Other / uncertain</option></select></label>
            <label>Date and time observed<input name="observedAt" type="datetime-local" required /></label>
            <label>Source or photo URL (optional)<input name="sourceUrl" type="url" inputMode="url" /></label>
            <label className="roadReportWide">Note (optional)<textarea name="note" rows={3} /></label>
            <button type="submit" className="roadAction roadActionPrimary">Prepare email report</button>
          </form>
        </div>
      </details>

      <aside className="roadDisclaimer"><strong>Before you drive</strong><p>Road conditions can change quickly. Karburanti Sot summarizes available sources and does not replace instructions from road authorities, police, emergency services, road signs, or your rental supplier.</p></aside>
    </main>
  );
}
