import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import Seo from "../components/meta/Seo";
import { getCountryEditorial } from "../config/countryContent";
import { getRouteConfig } from "../config/routes";
import { getArticle } from "../config/articles";

export default function RouteSeo() {
  const { pathname } = useLocation();

  const meta = useMemo(() => {
    const configured = getRouteConfig(pathname);
    if (configured) return { title: configured.title, description: configured.description, path: pathname, noindex: configured.noindex };
    if (pathname.startsWith("/insights/")) {
      const slug = pathname.replace("/insights/", "");
      const article = getArticle(slug);

      if (article) {
        return {
          title: article.seoTitle ?? `${article.title} | Fuel Today`,
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
