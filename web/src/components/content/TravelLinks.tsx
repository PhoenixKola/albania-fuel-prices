import type { Lang } from "../../models/i18n";
import { travelLabels } from "../../config/travelLabels";

function TravelCardArtwork({ kind }: { kind: "calculator" | "guide" }) {
  if (kind === "guide") {
    return (
      <span className="homeTravelArtwork homeTravelArtworkGuide" aria-hidden="true">
        <svg viewBox="0 0 360 190" fill="none">
          <path className="homeTravelGridLine" d="M14 38h332M14 96h332M14 154h332M70 12v166M180 12v166M290 12v166" />
          <path className="homeTravelRoute" d="M30 145c42-4 50-62 98-62 35 0 35 41 74 41 45 0 51-78 124-82" />
          <circle className="homeTravelWaypoint" cx="30" cy="145" r="6" />
          <circle className="homeTravelWaypoint" cx="326" cy="42" r="6" />
          <path className="homeTravelCar" d="M137 109h78l13 20v23h-10a14 14 0 0 1-28 0h-31a14 14 0 0 1-28 0h-9v-25l15-18Zm13 0 9-19h35l14 19" />
          <circle className="homeTravelCarWheel" cx="145" cy="152" r="7" />
          <circle className="homeTravelCarWheel" cx="204" cy="152" r="7" />
        </svg>
        <span className="homeTravelCoordinate">41.3275° N / 19.8187° E</span>
      </span>
    );
  }

  return (
    <span className="homeTravelArtwork homeTravelArtworkCalculator" aria-hidden="true">
      <svg viewBox="0 0 360 190" fill="none">
        <path className="homeTravelGridLine" d="M14 38h332M14 96h332M14 154h332M70 12v166M180 12v166M290 12v166" />
        <path className="homeTravelRoute" d="M30 142c35-5 43-49 75-49 36 0 36 34 75 34 43 0 43-86 79-86 29 0 31 41 67 44" />
        <circle className="homeTravelWaypoint" cx="30" cy="142" r="6" />
        <circle className="homeTravelWaypoint" cx="326" cy="85" r="6" />
        <path className="homeTravelPump" d="M146 151V70a10 10 0 0 1 10-10h46a10 10 0 0 1 10 10v81M158 76h42v34h-42V76Zm54 10h12l13 17v35c0 8-5 13-12 13s-13-5-13-13v-14" />
        <path className="homeTravelPumpBase" d="M132 151h96" />
      </svg>
      <span className="homeTravelCoordinate">KM × L/100 KM × €/L</span>
    </span>
  );
}

export function TravelLinks({ lang, featured = false }: { lang: Lang; featured?: boolean }) {
  const c = travelLabels[lang];

  if (!featured) {
    return (
      <nav className="travelLinks" aria-label={c.related}>
        <a className="editorialAction editorialActionPrimary" href="/trip-cost-calculator">{c.openCalculator} →</a>
        <a className="editorialAction" href="/albania-car-rental-guide">{c.openGuide} →</a>
      </nav>
    );
  }

  return (
    <nav className="travelLinks travelLinksFeatured" aria-label={c.related}>
      <a className="homeTravelCard homeTravelCardCalculator" href="/trip-cost-calculator">
        <span className="homeTravelCardTopline"><span>{c.calculatorCardEyebrow}</span><i>01</i></span>
        <TravelCardArtwork kind="calculator" />
        <span className="homeTravelCardCopy">
          <strong>{c.openCalculator}</strong>
          <small>{c.calculatorCardText}</small>
        </span>
        <span className="homeTravelCardAction">{c.calculatorCardCta}<i aria-hidden="true" /></span>
      </a>

      <a className="homeTravelCard homeTravelCardGuide" href="/albania-car-rental-guide">
        <span className="homeTravelCardTopline"><span>{c.guideCardEyebrow}</span><i>02</i></span>
        <TravelCardArtwork kind="guide" />
        <span className="homeTravelCardCopy">
          <strong>{c.openGuide}</strong>
          <small>{c.guideCardText}</small>
        </span>
        <span className="homeTravelCardAction">{c.guideCardCta}<i aria-hidden="true" /></span>
      </a>
    </nav>
  );
}

