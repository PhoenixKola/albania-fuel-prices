import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import Seo from "../components/meta/Seo";
import { getCountryEditorial } from "../config/countryContent";
import { getArticle } from "../config/articles";

export default function RouteSeo() {
  const { pathname } = useLocation();

  const meta = useMemo(() => {
    if (pathname === "/") {
      return {
        title: "Fuel Today Albania & Europe | Petrol, Diesel and LPG Prices",
        description:
          "Compare today's fuel prices in Albania and Europe, understand why prices move, estimate road-trip costs, and review transparent methodology before you travel.",
        path: pathname,
      };
    }

    if (pathname === "/stations") {
      return {
        title: "Nearby Fuel Stations | Fuel Today",
        description:
          "Find nearby fuel stations and use location-based context alongside country-level fuel price comparisons for Albania and Europe.",
        path: pathname,
      };
    }

    if (pathname === "/compare") {
      return {
        title: "Compare Fuel Prices Across Countries | Fuel Today",
        description:
          "Build a country watchlist and compare petrol, diesel, and LPG prices across Albania and Europe for practical trip and budget planning.",
        path: pathname,
      };
    }

    if (pathname === "/rankings") {
      return {
        title: "Europe Fuel Price Rankings | Fuel Today",
        description:
          "Explore Europe fuel price rankings by fuel type and understand where Albania sits relative to nearby and western European markets.",
        path: pathname,
      };
    }

    if (pathname === "/methodology") {
      return {
        title: "Methodology | How Fuel Today Collects and Updates Data",
        description:
          "Review data sources, update frequency, fuel definitions, and limitations behind Fuel Today's Albania and Europe fuel price comparison data.",
        path: pathname,
      };
    }

    if (pathname === "/how-fuel-prices-work") {
      return {
        title: "How Fuel Prices Work in Albania and Europe | Fuel Today",
        description:
          "Understand how crude oil, refining, taxes, transport, FX rates, and local demand shape petrol, diesel, and LPG prices across the Balkans and Europe.",
        path: pathname,
      };
    }

    if (pathname === "/europe-fuel-comparison") {
      return {
        title: "Europe Fuel Comparison with Albania | Fuel Today",
        description:
          "Compare Albania fuel prices with Kosovo, Montenegro, North Macedonia, Greece, Italy, Croatia, Portugal, Switzerland, and the United Kingdom.",
        path: pathname,
      };
    }

    if (pathname === "/road-trip-fuel-guide") {
      return {
        title: "Road Trip Fuel Cost Guide from Albania | Fuel Today",
        description:
          "Estimate road trip fuel costs from Albania with practical route examples, consumption assumptions, and cross-border petrol and diesel price context.",
        path: pathname,
      };
    }

    if (pathname === "/about") {
      return {
        title: "About Fuel Today (Karburanti Sot)",
        description:
          "Learn why Fuel Today exists, who it serves, and how it helps drivers compare Albania and European fuel prices with transparent editorial context.",
        path: pathname,
      };
    }

    if (pathname === "/contact") {
      return {
        title: "Contact Fuel Today",
        description:
          "Contact Fuel Today for data corrections, partnerships, or website feedback related to Albania and European fuel price comparisons.",
        path: pathname,
      };
    }

    if (pathname === "/privacy") {
      return {
        title: "Privacy Policy | Fuel Today",
        description:
          "Read the Fuel Today privacy policy, including data usage, local storage behavior, advertising disclosures, and contact details.",
        path: pathname,
      };
    }

    if (pathname === "/terms") {
      return {
        title: "Terms of Use | Fuel Today",
        description:
          "Review Fuel Today terms of use, informational data limitations, acceptable usage, and liability boundaries for fuel price guidance.",
        path: pathname,
      };
    }

    if (pathname === "/fuel-quiz") {
      return {
        title: "Fuel Price Quiz — Which Country Has Cheaper Fuel? | Fuel Today",
        description:
          "Test your knowledge of European fuel prices. Guess which country has cheaper petrol or diesel using live market data. Track your score and streak.",
        path: pathname,
      };
    }

    if (pathname === "/daily-challenge") {
      return {
        title: "Daily Challenge — 5 Fuel Price Questions | Fuel Today",
        description:
          "Test yourself with today's 5 fuel price questions. Same questions for everyone, refreshes daily. Compare petrol and diesel prices across Europe.",
        path: pathname,
      };
    }

    if (pathname === "/editorial-policy") {
      return {
        title: "Editorial Policy | Fuel Today",
        description:
          "Read how Fuel Today selects, produces, and maintains fuel price content — including data sourcing standards, editorial independence, accuracy principles, and corrections policy.",
        path: pathname,
      };
    }

    if (pathname === "/disclaimer") {
      return {
        title: "Disclaimer | Fuel Today",
        description:
          "Read the Fuel Today disclaimer: fuel price data is informational only, trip estimates are approximate, and no financial advice is provided.",
        path: pathname,
      };
    }

    if (pathname === "/insights") {
      return {
        title: "Fuel Market Insights | Fuel Today",
        description:
          "Analysis and background articles on the Albanian and Balkan fuel markets — taxes, cross-border savings, market structure, and monthly price recaps.",
        path: pathname,
      };
    }

    if (pathname.startsWith("/insights/")) {
      const slug = pathname.replace("/insights/", "");
      const article = getArticle(slug);

      if (article) {
        return {
          title: `${article.title} | Fuel Today`,
          description: article.description,
          path: pathname,
        };
      }
    }

    if (pathname.startsWith("/fuel-prices/")) {
      const slug = pathname.replace("/fuel-prices/", "");
      const editorial = getCountryEditorial(slug);

      if (editorial) {
        return {
          title: editorial.metaTitle,
          description: editorial.metaDescription,
          path: pathname,
        };
      }
    }

    return {
      title: "Page Not Found | Fuel Today",
      description:
        "The requested page could not be found. Explore Albania and Europe fuel price tools, methodology, and comparison guides from the homepage.",
      path: "/404",
      noindex: true,
    };
  }, [pathname]);

  return (
    <Seo
      title={meta.title}
      description={meta.description}
      path={meta.path}
      noindex={meta.noindex}
    />
  );
}
