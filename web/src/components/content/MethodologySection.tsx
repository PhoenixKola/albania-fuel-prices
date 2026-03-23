import type { TDict } from "../../locales";

type MethodologySectionProps = {
  t: TDict;
  fuelSourceLabel?: string;
  fxSourceLabel?: string;
  updateFrequency?: string;
};

export default function MethodologySection({
  t,
  fuelSourceLabel,
  fxSourceLabel,
  updateFrequency,
}: MethodologySectionProps) {
  const fuelLabel = fuelSourceLabel ?? t.methodologyFuelSourceDefault;
  const fxLabel = fxSourceLabel ?? t.methodologyFxSourceDefault;
  const updateLabel = updateFrequency ?? t.methodologyUpdateFrequencyDefault;

  return (
    <section className="contentSection">
      <h2 className="contentHeading">{t.methodologyTitle}</h2>

      <p className="contentBody">{t.methodologyParagraph1}</p>

      <p className="contentBody">{t.methodologyParagraph2}</p>

      <p className="contentBody">{t.methodologyParagraph3}</p>

      <div className="contentInfoBox">
        <p className="contentBody">
          <strong>{t.methodologyFuelSource}:</strong> {fuelLabel}
        </p>
        <p className="contentBody">
          <strong>{t.methodologyFxSource}:</strong> {fxLabel}
        </p>
        <p className="contentBody contentBodyNoMargin">
          <strong>{t.methodologyUpdatePattern}:</strong> {updateLabel}
        </p>
      </div>
    </section>
  );
}