import type { TDict } from "../../locales";

type CountryPriceLike = {
  country: string
  petrol?: number | null
  diesel?: number | null
  currency?: string | null
}

type EditorialSummaryProps = {
  t: TDict;
  items?: CountryPriceLike[] | null;
  title?: string;
};

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function formatPrice(value: number | null | undefined, currency: string | null | undefined, t: TDict) {
  if (!isNumber(value)) return t.notAvailable;
  return `${value.toFixed(2)} ${currency || ""}`.trim();
}

export default function EditorialSummary({
  t,
  items,
  title,
}: EditorialSummaryProps) {
  const safeItems = (items || []).filter(
    (item) => isNumber(item.petrol) || isNumber(item.diesel)
  );

  const petrolItems = safeItems.filter((item) => isNumber(item.petrol));
  const dieselItems = safeItems.filter((item) => isNumber(item.diesel));

  const cheapestPetrol = petrolItems.length
    ? petrolItems.reduce((a, b) => (a.petrol! < b.petrol! ? a : b))
    : null;

  const mostExpensivePetrol = petrolItems.length
    ? petrolItems.reduce((a, b) => (a.petrol! > b.petrol! ? a : b))
    : null;

  const cheapestDiesel = dieselItems.length
    ? dieselItems.reduce((a, b) => (a.diesel! < b.diesel! ? a : b))
    : null;

  const mostExpensiveDiesel = dieselItems.length
    ? dieselItems.reduce((a, b) => (a.diesel! > b.diesel! ? a : b))
    : null;

  const petrolSpread =
    cheapestPetrol && mostExpensivePetrol && isNumber(cheapestPetrol.petrol) && isNumber(mostExpensivePetrol.petrol)
      ? mostExpensivePetrol.petrol - cheapestPetrol.petrol
      : null;

  const dieselSpread =
    cheapestDiesel && mostExpensiveDiesel && isNumber(cheapestDiesel.diesel) && isNumber(mostExpensiveDiesel.diesel)
      ? mostExpensiveDiesel.diesel - cheapestDiesel.diesel
      : null;

  return (
    <section className="contentSection">
      <h2 className="contentHeading">{title ?? t.editorialTitle}</h2>

      {safeItems.length === 0 ? (
        <p className="contentBody">
          {t.editorialEmpty}
        </p>
      ) : (
        <>
          <p className="contentBody">{t.editorialLead}</p>

          <ul className="contentList">
            <li>
              {t.editorialCheapestPetrol}:{" "}
              <strong>
                {cheapestPetrol?.country || t.notAvailable} ({formatPrice(cheapestPetrol?.petrol, cheapestPetrol?.currency, t)})
              </strong>
            </li>
            <li>
              {t.editorialMostExpensivePetrol}:{" "}
              <strong>
                {mostExpensivePetrol?.country || t.notAvailable} ({formatPrice(mostExpensivePetrol?.petrol, mostExpensivePetrol?.currency, t)})
              </strong>
            </li>
            <li>
              {t.editorialPetrolSpread}:{" "}
              <strong>{petrolSpread !== null ? petrolSpread.toFixed(2) : t.notAvailable}</strong>
            </li>
            <li>
              {t.editorialCheapestDiesel}:{" "}
              <strong>
                {cheapestDiesel?.country || t.notAvailable} ({formatPrice(cheapestDiesel?.diesel, cheapestDiesel?.currency, t)})
              </strong>
            </li>
            <li>
              {t.editorialMostExpensiveDiesel}:{" "}
              <strong>
                {mostExpensiveDiesel?.country || t.notAvailable} ({formatPrice(mostExpensiveDiesel?.diesel, mostExpensiveDiesel?.currency, t)})
              </strong>
            </li>
            <li>
              {t.editorialDieselSpread}:{" "}
              <strong>{dieselSpread !== null ? dieselSpread.toFixed(2) : t.notAvailable}</strong>
            </li>
          </ul>
        </>
      )}
    </section>
  );
}