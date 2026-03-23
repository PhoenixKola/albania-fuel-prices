import { useEffect } from "react";
import type { Lang } from "../../models/i18n";

type Props = {
  adClient: string;
  adSlot: string;
  enabled?: boolean;
  lang?: Lang;
};

export default function AdBar({ adClient, adSlot, enabled = true, lang = "en" }: Props) {
  const shouldRender = enabled && lang === "en";

  useEffect(() => {
    if (!shouldRender) return;

    try {
      // @ts-expect-error - AdSense injects this global
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      //
    }
  }, [shouldRender]);

  if (!shouldRender) return null;

  return (
    <div className="adbar" aria-label="Advertisement">
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}