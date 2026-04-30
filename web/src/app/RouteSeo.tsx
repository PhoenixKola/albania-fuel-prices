import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import type { LatestEurope } from "../models/fuel";
import Seo from "../components/meta/Seo";
import { getCountryPageBySlug } from "../config/countryPages";

type Props = {
  data: LatestEurope | null;
  loading: boolean;
};

function hasUsableCountryFuelData(row: LatestEurope["countries"][number] | undefined) {
  if (!row) return false;
  return [row.gasoline95_eur, row.diesel_eur, row.lpg_eur].some((value) => typeof value === "number");
}

export default function RouteSeo({ data, loading }: Props) {
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

    if (pathname.startsWith("/fuel-prices/")) {
      const slug = pathname.replace("/fuel-prices/", "");
      const countryPage = getCountryPageBySlug(slug);
      const countryRow = data?.countries.find((c) => c.country === countryPage?.dataCountryName);
      const hasData = hasUsableCountryFuelData(countryRow);

      if (countryPage) {
        return {
          title: `${countryPage.label} Fuel Prices | Fuel Today`,
          description: hasData
            ? `Latest ${countryPage.label} fuel prices for petrol, diesel, and LPG where available, with Albania comparison context and methodology links.`
            : `${countryPage.label} fuel price context page with Albania comparison guidance and transparent notes about current data availability.`,
          path: pathname,
          noindex: !loading && !hasData,
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
  }, [pathname, data, loading]);

  return (
    <Seo
      title={meta.title}
      description={meta.description}
      path={meta.path}
      noindex={meta.noindex}
    />
  );
}
