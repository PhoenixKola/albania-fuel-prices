import { useEffect, useRef } from "react";
import { albaniaAlternates } from "../../config/localizedAlbania";
import { jsonLdAction } from "../../utils/jsonLdPlan";

const SITE_URL = "https://karburantisot.com";

export type SeoProps = {
  title: string;
  description: string;
  path: string;
  ogTitle?: string;
  ogDescription?: string;
  noindex?: boolean;
  jsonLd?: object;
};

function setOrCreateMeta(selector: string, attrs: Record<string, string>) {
  let meta = document.head.querySelector<HTMLMetaElement>(selector);
  if (!meta) {
    meta = document.createElement("meta");
    document.head.appendChild(meta);
  }

  for (const [key, value] of Object.entries(attrs)) {
    meta.setAttribute(key, value);
  }
}

function setCanonical(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

export default function Seo({
  title,
  description,
  path,
  ogTitle,
  ogDescription,
  noindex = false,
  jsonLd,
}: SeoProps) {
  const prerenderedPath = useRef<string | null | undefined>(undefined);
  useEffect(() => {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const canonical = cleanPath === "/" ? SITE_URL : `${SITE_URL}${cleanPath}`;

    document.title = title;
    setCanonical(canonical);
    document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach(link => link.remove());
    for (const alternate of albaniaAlternates(cleanPath)) {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = alternate.lang;
      link.href = `${SITE_URL}${alternate.path}`;
      document.head.appendChild(link);
    }
    if (prerenderedPath.current === undefined) {
      prerenderedPath.current = document.head.querySelector('script[type="application/ld+json"]:not([data-paired-seo])') ? cleanPath : null;
    }
    const action = jsonLdAction(prerenderedPath.current, cleanPath, Boolean(jsonLd));
    if (action !== "keep") {
      prerenderedPath.current = null;
      document.head.querySelectorAll('script[type="application/ld+json"]').forEach(script => script.remove());
      if (jsonLd) {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.dataset.pairedSeo = "true";
        script.textContent = JSON.stringify(jsonLd);
        document.head.appendChild(script);
      }
    }

    setOrCreateMeta('meta[name="description"]', {
      name: "description",
      content: description,
    });

    setOrCreateMeta('meta[name="robots"]', {
      name: "robots",
      content: noindex
        ? "noindex,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
        : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
    });

    setOrCreateMeta('meta[property="og:type"]', {
      property: "og:type",
      content: "website",
    });

    setOrCreateMeta('meta[property="og:title"]', {
      property: "og:title",
      content: ogTitle ?? title,
    });

    setOrCreateMeta('meta[property="og:description"]', {
      property: "og:description",
      content: ogDescription ?? description,
    });

    setOrCreateMeta('meta[property="og:url"]', {
      property: "og:url",
      content: canonical,
    });

    setOrCreateMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: ogTitle ?? title,
    });

    setOrCreateMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: ogDescription ?? description,
    });
  }, [title, description, path, ogTitle, ogDescription, noindex, jsonLd]);

  return null;
}
