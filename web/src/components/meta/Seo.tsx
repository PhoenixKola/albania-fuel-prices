import { useEffect } from "react";

const SITE_URL = "https://karburantisot.com";

export type SeoProps = {
  title: string;
  description: string;
  path: string;
  ogTitle?: string;
  ogDescription?: string;
  noindex?: boolean;
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
}: SeoProps) {
  useEffect(() => {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const canonical = `${SITE_URL}${cleanPath}`;

    document.title = title;
    setCanonical(canonical);

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
  }, [title, description, path, ogTitle, ogDescription, noindex]);

  return null;
}
