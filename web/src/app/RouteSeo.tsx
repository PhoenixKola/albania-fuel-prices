import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import Seo from "../components/meta/Seo";
import { getCountryEditorial } from "../config/countryContent";
import { getRouteConfig } from "../config/routes";
import { getArticle } from "../config/articles";
import type { LatestEurope } from "../models/fuel";
import { normalizeCanonicalPath } from "../utils/canonical";
import { getRoadRoute } from "../data/roadRoutes";
import { roadRouteDescription, roadRouteTitle } from "../utils/roadSeo";

function countryDescription(base: string, country: string, data: LatestEurope | null) {
  const row = data?.countries.find((item) => item.country === country);
  if (row?.gasoline95_eur == null || row.diesel_eur == null || !data?.as_of) return base;
  const date = new Date(`${data.as_of}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  });
  const prefix = `Petrol €${row.gasoline95_eur.toFixed(3)}/L, diesel €${row.diesel_eur.toFixed(3)}/L as of ${date}. `;
  const full = prefix + base;
  if (full.length <= 158) return full;
  const cut = full.slice(0, 158);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.\s]+$/, "")}…`;
}

export default function RouteSeo({ data }: { data: LatestEurope | null }) {
  const { pathname } = useLocation();
  const canonicalPath = normalizeCanonicalPath(pathname);

  const meta = useMemo(() => {
    const configured = getRouteConfig(canonicalPath);
    if (configured) return { title: configured.title, description: configured.description, path: canonicalPath, noindex: configured.noindex };
    if (canonicalPath.startsWith("/road-status/")) {
      const route = getRoadRoute(canonicalPath.replace("/road-status/", ""));
      if (route) return { title: roadRouteTitle(route), description: roadRouteDescription(route), path: canonicalPath, noindex: !route.indexable };
    }
    if (canonicalPath.startsWith("/insights/")) {
      const slug = canonicalPath.replace("/insights/", "");
      const article = getArticle(slug);

      if (article) {
        return {
          title: article.seoTitle ?? `${article.title} | Fuel Today`,
          description: article.description,
          path: canonicalPath,
        };
      }
    }

    if (canonicalPath.startsWith("/fuel-prices/")) {
      const slug = canonicalPath.replace("/fuel-prices/", "");
      const editorial = getCountryEditorial(slug);

      if (editorial) {
        return {
          title: editorial.metaTitle,
          description: countryDescription(editorial.metaDescription, editorial.dataCountryName, data),
          path: canonicalPath,
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
  }, [canonicalPath, data]);

  return (
    <Seo
      title={meta.title}
      description={meta.description}
      path={meta.path}
      noindex={meta.noindex}
    />
  );
}
