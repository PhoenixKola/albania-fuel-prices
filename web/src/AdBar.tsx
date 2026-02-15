import { useEffect } from "react";

type Props = {
  adClient: string;
  adSlot: string;
};

export default function AdBar({ adClient, adSlot }: Props) {
  useEffect(() => {
    try {
      // @ts-expect-error - AdSense injects this global
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="adbar">
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