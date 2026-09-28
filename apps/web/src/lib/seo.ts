import { useEffect } from "react";

export const SITE_URL = (import.meta.env.VITE_SITE_URL ?? "https://adaraai.xyz").replace(/\/$/, "");
export const SITE_NAME = "Adara AI Lab";

export const DEFAULT_TITLE = "Adara AI Lab | Data and tools that make AI understand Africa";
export const DEFAULT_DESCRIPTION =
  "Adara AI Lab builds African language datasets, speech-to-text, text-to-speech and context APIs so AI understands Africa in its languages, its logic, and its lived reality.";
export const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

type SeoOptions = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
  jsonLd?: Record<string, unknown>;
};

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
}

function apply({ title, description, path, image, type, noindex }: SeoOptions) {
  const fullTitle = title ? `${title} | Adara AI Lab` : DEFAULT_TITLE;
  const desc = description ?? DEFAULT_DESCRIPTION;
  const url = `${SITE_URL}${path ?? window.location.pathname}`;
  const img = image ? new URL(image, SITE_URL).href : DEFAULT_IMAGE;

  document.title = fullTitle;
  setMeta("name", "description", desc);
  setMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large");
  setCanonical(url);

  setMeta("property", "og:title", fullTitle);
  setMeta("property", "og:description", desc);
  setMeta("property", "og:url", url);
  setMeta("property", "og:type", type ?? "website");
  setMeta("property", "og:image", img);

  setMeta("name", "twitter:title", fullTitle);
  setMeta("name", "twitter:description", desc);
  setMeta("name", "twitter:image", img);
}

export function useSeo(options: SeoOptions = {}) {
  const { title, description, path, image, type, noindex, jsonLd } = options;
  const jsonLdString = jsonLd ? JSON.stringify(jsonLd) : undefined;

  useEffect(() => {
    apply({ title, description, path, image, type, noindex });

    let script: HTMLScriptElement | undefined;
    if (jsonLdString) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.seo = "page";
      script.text = jsonLdString;
      document.head.appendChild(script);
    }

    return () => {
      script?.remove();
      apply({ path: "/" });
    };
  }, [title, description, path, image, type, noindex, jsonLdString]);
}
