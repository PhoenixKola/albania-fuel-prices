import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import { prepareInitialHomeIntro } from "./utils/homeIntro";
import "./styles/global.css";
import "./styles/road.css";

prepareInitialHomeIntro();

function revealMountedHomepage() {
  if (window.location.pathname !== "/") return;
  let attempts = 0;
  const revealWhenReady = () => {
    if (document.querySelector(".homeJourneyHero") || attempts >= 60) {
      document.documentElement.classList.remove("home-app-booting");
      return;
    }
    attempts += 1;
    window.requestAnimationFrame(revealWhenReady);
  };
  window.requestAnimationFrame(revealWhenReady);
}

// Directly loaded content routes already have useful prerendered HTML in #root.
// Keep those visible until their route chunk is ready. The homepage alone uses
// the boot guard above because its static editorial shell and cinematic hero
// intentionally have different layouts.
function preloadInitialRoute(path: string): Promise<unknown> {
  if (path.startsWith("/fuel-prices/")) return import("./pages/CountryFuelPricesPage");
  if (path.startsWith("/road-status")) return import("./pages/RoadStatusPage");
  if (path.startsWith("/insights/")) return import("./pages/InsightArticlePage");
  switch (path) {
    case "/": return Promise.resolve();
    case "/stations": return import("./pages/StationsPage");
    case "/compare": return import("./pages/ComparePage");
    case "/rankings": return import("./pages/RankingsPage");
    case "/about": return import("./pages/AboutPage");
    case "/contact": return import("./pages/ContactPage");
    case "/privacy": return import("./pages/PrivacyPage");
    case "/terms": return import("./pages/TermsPage");
    case "/editorial-policy": return import("./pages/EditorialPolicyPage");
    case "/disclaimer": return import("./pages/DisclaimerPage");
    case "/fuel-quiz": return import("./pages/FuelQuizPage");
    case "/daily-challenge": return import("./pages/DailyChallengePage");
    case "/market-report": return import("./pages/MarketReportPage");
    case "/insights": return import("./pages/InsightsIndexPage");
    case "/methodology": return import("./pages/MethodologyPage");
    case "/how-fuel-prices-work": return import("./pages/HowFuelPricesWorkPage");
    case "/europe-fuel-comparison": return import("./pages/EuropeFuelComparisonPage");
    case "/trip-cost-calculator": return import("./pages/TripCostCalculatorPage");
    case "/albania-car-rental-guide": return import("./pages/AlbaniaCarRentalGuidePage");
    case "/road-trip-fuel-guide": return import("./pages/RoadTripFuelGuidePage");
    default: return import("./pages/NotFoundPage");
  }
}

void preloadInitialRoute(window.location.pathname).catch(() => undefined).then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
  revealMountedHomepage();
});
