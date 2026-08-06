import { Link } from "react-router-dom";
import type { TDict } from "../../locales";
import { COUNTRY_EDITORIAL } from "../../config/countryContent";
import { isCountryIndexable } from "../../generated/indexableCountries";
import { ANALYSIS_META } from "../../generated/analysisMeta";
import { PLAY_STORE_URL } from "../../config/constants";
import logo from "../../assets/Logo.png";

type Props = {
  t: TDict;
  /** as_of from the live feed. Falls back to the build-time value until loaded. */
  dataAsOf?: string | null;
};

/** Days between an ISO date and today, or null if unparseable. */
function ageInDays(iso: string): number | null {
  const then = Date.parse(`${iso}T00:00:00Z`);
  if (Number.isNaN(then)) return null;
  const today = Date.parse(`${new Date().toISOString().slice(0, 10)}T00:00:00Z`);
  return Math.round((today - then) / 86_400_000);
}

function ChartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M4 19h16a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1V4a1 1 0 0 1 2 0v15Zm2.7-4.3a1 1 0 0 1-.4-1.36l3-5a1 1 0 0 1 1.45-.3l3.1 2.32 3.4-5.1a1 1 0 1 1 1.66 1.1l-4 6a1 1 0 0 1-1.43.25l-3.13-2.35-2.4 4a1 1 0 0 1-1.25.44Z"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M3.6 2.3a1 1 0 0 0-.6.92v17.56a1 1 0 0 0 .6.92l9.53-9.7L3.6 2.3Zm10.94 8.3 2.9-2.95-9.2-5.2 6.3 8.15Zm0 2.8-6.3 8.15 9.2-5.2-2.9-2.95Zm4.3-1.4 2.53-1.43c.83-.47.83-1.67 0-2.14l-2.2-1.24-2.76 2.81 2.43 2.0Z"
      />
    </svg>
  );
}

export default function Footer({ t, dataAsOf }: Props) {
  const year = new Date().getFullYear();

  // Prefer the live feed date so the footer never contradicts the header.
  const asOf = dataAsOf || ANALYSIS_META.asOf;
  const age = asOf ? ageInDays(asOf) : null;
  const isStale = age != null && age > ANALYSIS_META.staleAfterDays;

  // Only surface countries we can actually show prices for; the others are
  // noindexed and would be dead weight in the footer.
  const countryLinks = COUNTRY_EDITORIAL.filter((c) => isCountryIndexable(c.slug)).slice(0, 6);

  const updatedLabel = (() => {
    if (!asOf) return null;
    const d = new Date(`${asOf}T00:00:00Z`);
    if (Number.isNaN(d.getTime())) return asOf;
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  })();

  const columns = [
    {
      heading: "Explore",
      links: [
        { to: "/", label: t.navHome },
        { to: "/market-report", label: "Market report" },
        { to: "/rankings", label: t.navRankings },
        { to: "/compare", label: t.navCompare },
        { to: "/stations", label: t.navStations },
      ],
    },
    {
      heading: t.footerGuidesHeading,
      links: [
        { to: "/insights", label: "Insights" },
        { to: "/methodology", label: t.navMethodology },
        { to: "/how-fuel-prices-work", label: t.navHowPricesWork },
        { to: "/europe-fuel-comparison", label: t.navEuropeComparison },
        { to: "/road-trip-fuel-guide", label: t.navRoadTripGuide },
      ],
    },
    {
      heading: "Countries",
      links: [
        ...countryLinks.map((c) => ({
          to: `/fuel-prices/${c.slug}`,
          label: c.label,
        })),
        { to: "/rankings", label: "All countries →" },
      ],
    },
    {
      heading: "More",
      links: [
        { to: "/fuel-quiz", label: t.navFuelQuiz },
        { to: "/daily-challenge", label: t.navDailyChallenge },
        { to: "/about", label: t.navAbout },
        { to: "/contact", label: t.navContact },
      ],
    },
  ];

  const legalLinks = [
    { to: "/privacy", label: t.navPrivacy },
    { to: "/terms", label: t.navTerms },
    { to: "/editorial-policy", label: t.navEditorialPolicy },
    { to: "/disclaimer", label: t.navDisclaimer },
  ];

  return (
    <footer className="siteFooter">
      <div className="footerInner">
        <div className="footerGrid">
          <div className="footerBrand">
            <div className="footerBrandRow">
              <img className="footerLogo" src={logo} alt="" aria-hidden="true" />
              <span className="footerSiteName">{t.title}</span>
            </div>

            <p className="footerTagline">{t.footerTagline}</p>

            {/* Operational transparency: the freshness of the data is the
                product, so it gets stated plainly rather than buried. */}
            {updatedLabel ? (
              <div className={`footerStatus ${isStale ? "footerStatusStale" : ""}`}>
                <span className="footerStatusDot" aria-hidden="true" />
                <span className="footerStatusText">
                  <strong>
                    {isStale ? "Update delayed" : "Data updated"} {updatedLabel}
                  </strong>
                  {ANALYSIS_META.historyOk ? (
                    <span className="footerStatusMeta">
                      {ANALYSIS_META.countriesAnalysed} markets tracked ·{" "}
                      {ANALYSIS_META.daysObserved} days of history
                    </span>
                  ) : null}
                </span>
              </div>
            ) : null}

            <div className="footerActions">
              <Link className="footerChip" to="/methodology">
                <ChartIcon />
                <span>How we collect data</span>
              </Link>
              <a
                className="footerChip"
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <PlayIcon />
                <span>Android app</span>
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <nav className="footerCol" key={col.heading} aria-label={col.heading}>
              <h2 className="footerColHeading">{col.heading}</h2>
              <ul className="footerColList">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="footerLink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="footerBottom">
          <p className="footerCopyright">{t.footerCopyright(year)}</p>

          <nav className="footerLegal" aria-label="Legal">
            {legalLinks.map((link) => (
              <Link key={link.to} to={link.to} className="footerLegalLink">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="footerFinePrint">
          Prices are country-level reference values compiled from public sources and are not
          guaranteed pump prices. Historical ranges, volatility and percentile figures are
          calculated by Karburanti Sot from its own daily record — see our{" "}
          <Link to="/methodology" className="footerInlineLink">
            methodology
          </Link>
          .
        </p>
      </div>
    </footer>
  );
}
