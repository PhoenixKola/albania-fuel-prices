import { useEffect } from "react";
import { ADS_ENABLED } from "../../config/constants";

type Props = {
  adClient: string;
  adSlot: string;
  enabled?: boolean;
};

export default function AdBar({ adClient, adSlot, enabled = true }: Props) {
  const shouldRender = enabled && ADS_ENABLED;

  useEffect(() => {
    if (!shouldRender) return;
    try {
      // @ts-expect-error - AdSense injects this global
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense not yet available; it will auto-push when the script loads.
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