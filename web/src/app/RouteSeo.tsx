import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import Seo from "../components/meta/Seo";
import { getCountryEditorial } from "../config/countryContent";
import { countryMetaDescription } from "../config/countryMetaDescription";
import { getRouteConfig } from "../config/routes";
import { getArticle } from "../config/articles";
import type { LatestEurope } from "../models/fuel";
import { normalizeCanonicalPath } from "../utils/canonical";
import { getRoadRoute } from "../data/roadRoutes";
import { roadRouteDescription, roadRouteTitle } from "../utils/roadSeo";
import { SQ_ALBANIA_PATH, EN_ALBANIA_PATH, sqAlbaniaSchema } from "../config/localizedAlbania";
import acceptedSnapshot from "../../../data/latest.json";
import { countryPageContent } from "../config/countryPageContent";

export default function RouteSeo({ data }: { data: LatestEurope | null }) {
  const { pathname } = useLocation();
  const canonicalPath = normalizeCanonicalPath(pathname);
  const pairedSchema = useMemo(() => {
    const reading = data ?? acceptedSnapshot as LatestEurope;
    if (canonicalPath === SQ_ALBANIA_PATH) return sqAlbaniaSchema(reading);
    if (canonicalPath === EN_ALBANIA_PATH) {
      const editorial = getCountryEditorial("albania")!;
      const copy = countryPageContent(editorial, reading, "en");
      return { "@context": "https://schema.org", "@type": "WebPage", inLanguage: "en", url: `https://karburantisot.com${EN_ALBANIA_PATH}`, name: editorial.metaTitle, mainEntity: { "@type": "FAQPage", mainEntity: copy.faqs.map(f => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) } };
    }
    return undefined;
  }, [canonicalPath, data]);

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
          description: countryMetaDescription(editorial.metaDescription, editorial.dataCountryName, data),
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
      jsonLd={pairedSchema}
    />
  );
}
