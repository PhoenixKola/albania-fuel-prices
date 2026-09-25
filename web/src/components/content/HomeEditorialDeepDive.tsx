import { Link } from "react-router-dom";
import type { LatestEurope } from "../../models/fuel";
import type { Lang } from "../../models/i18n";

type Props = { data: LatestEurope | null; lang: Lang };

function formatValue(value: number | null | undefined, lang: Lang) {
  if (typeof value !== "number") return lang === "sq" ? "nuk disponohet" : "not available";
  return `${value.toFixed(3)} EUR/L`;
}

function routeFuelCost(distanceKm: number, litersPer100: number, pricePerLiter: number | null | undefined) {
  if (typeof pricePerLiter !== "number") return null;
  return (distanceKm / 100) * litersPer100 * pricePerLiter;
}

function cost(value: number | null, lang: Lang) {
  return value == null ? (lang === "sq" ? "të dhëna të pamjaftueshme" : "insufficient price data") : `${value.toFixed(2)} EUR`;
}

export default function HomeEditorialDeepDive({ data, lang }: Props) {
  const albania = data?.countries.find((country) => country.country === "Albania") ?? null;
  const kosovo = data?.countries.find((country) => country.country === "Kosovo") ?? null;
  const montenegro = data?.countries.find((country) => country.country === "Montenegro") ?? null;
  const northMacedonia = data?.countries.find((country) => country.country === "North Macedonia") ?? null;
  const greece = data?.countries.find((country) => country.country === "Greece") ?? null;
  const routes = {
    shkoder: routeFuelCost(100, 6.8, albania?.diesel_eur ?? null),
    pristina: routeFuelCost(260, 6.8, albania?.diesel_eur ?? null),
    ohrid: routeFuelCost(135, 7.2, albania?.gasoline95_eur ?? null),
    podgorica: routeFuelCost(160, 6.8, albania?.diesel_eur ?? null),
  };

  if (lang === "sq") {
    return (
      <article className="contentPage">
        <section className="contentSection">
          <h2 className="contentHeading">Çmimet e sotme të karburantit në Shqipëri</h2>
          <p className="contentBody">Paneli më sipër është ndërtuar për vendime praktike: udhëtime të përditshme, planifikim dërgesash dhe udhëtime ndërkufitare nga Shqipëria. Vlerat më të fundit për Shqipërinë janë benzinë {formatValue(albania?.gasoline95_eur, lang)}, naftë {formatValue(albania?.diesel_eur, lang)} dhe LPG {formatValue(albania?.lpg_eur, lang)}.</p>
          <p className="contentBody">Këto janë vlera orientuese kombëtare, jo garanci për çdo pikë karburanti. Çmimet në pompë mund të ndryshojnë sipas qytetit, rrjetit dhe kohës së përditësimit.</p>
        </section>
        <section className="contentSection">
          <h2 className="contentHeading">Si të lexohen të dhënat e çmimeve</h2>
          <p className="contentBody">Karburanti Sot i normalizon vlerat e shteteve në euro për litër, që Shqipëria të krahasohet në të njëjtën shkallë me tregjet e eurozonës dhe ato jashtë saj. Përdori shifrat për trendet dhe diferencat, pastaj verifiko pikën konkrete para furnizimit.</p>
          <p className="contentBody">Për hollësitë e mbledhjes së të dhënave, lexo <Link className="inlineLink" to="/methodology">Metodologjinë</Link>. Për interpretimin e tregut, lexo <Link className="inlineLink" to="/how-fuel-prices-work">Si funksionojnë çmimet e karburantit</Link>.</p>
        </section>
        <section className="contentSection">
          <h2 className="contentHeading">Pse ndryshojnë çmimet e karburantit</h2>
          <p className="contentBody">Çmimet në Shqipëri dhe Ballkan lëvizin me treguesit ndërkombëtarë të naftës bruto, marzhet e rafinerive, kostot e transportit, taksat dhe presionin e kursit të këmbimit. Edhe kur nafta bruto është e qëndrueshme, çmimet në pompë mund të ndryshojnë nga politika fiskale ose logjistika rajonale.</p>
          <p className="contentBody">Edhe kërkesa sezonale ka ndikim: periudhat me turizëm të lartë mund të shtojnë presionin e shpërndarjes dhe të zgjerojnë diferencat mes tregjeve fqinje.</p>
        </section>
        <section className="contentSection">
          <h2 className="contentHeading">Shqipëria krahasuar me vendet fqinje</h2>
          <p className="contentBody">Tregjet fqinje janë shpesh krahasimi më i vlefshëm për drejtuesit shqiptarë. Vlerat më të fundit përfshijnë naftën në Kosovë {formatValue(kosovo?.diesel_eur, lang)}, Mal të Zi {formatValue(montenegro?.diesel_eur, lang)}, Maqedoni të Veriut {formatValue(northMacedonia?.diesel_eur, lang)} dhe Greqi {formatValue(greece?.diesel_eur, lang)}.</p>
          <p className="contentBody">Përdor <Link className="inlineLink" to="/europe-fuel-comparison">udhëzuesin e krahasimit evropian</Link> për interpretim, pastaj hap faqet e <Link className="inlineLink" to="/fuel-prices/albania">Shqipërisë</Link>, <Link className="inlineLink" to="/fuel-prices/greece">Greqisë</Link> ose <Link className="inlineLink" to="/fuel-prices/italy">Italisë</Link>.</p>
        </section>
        <section className="contentSection">
          <h2 className="contentHeading">Shembuj kostosh udhëtimi nga Shqipëria</h2>
          <p className="contentBody">Vlerësime të kostos së karburantit për një drejtim, duke përdorur vlerat orientuese kombëtare:</p>
          <ul className="contentList">
            <li>Tiranë–Shkodër (rreth 100 km): {cost(routes.shkoder, lang)}</li>
            <li>Tiranë–Prishtinë (rreth 260 km): {cost(routes.pristina, lang)}</li>
            <li>Tiranë–Ohër (rreth 135 km): {cost(routes.ohrid, lang)}</li>
            <li>Tiranë–Podgoricë (rreth 160 km): {cost(routes.podgorica, lang)}</li>
          </ul>
          <p className="contentBody">Këto janë përllogaritje planifikimi, jo fatura të sakta udhëtimi. Për këshilla sipas itinerarit, hap <Link className="inlineLink" to="/road-trip-fuel-guide">udhëzuesin e karburantit për udhëtime</Link>.</p>
        </section>
        <section className="contentSection">
          <h2 className="contentHeading">Kur përditësohen çmimet?</h2>
          <p className="contentBody">Shpeshtësia varet nga kalendari i publikimit të burimit. Disa burime përditësohen çdo javë, ndërsa të tjera më rrallë. Koha më e fundit e marrjes shfaqet në faqe, që freskia e të dhënave të kontrollohet para përdorimit.</p>
        </section>
        <section className="contentSection">
          <h2 className="contentHeading">Përmbledhja e burimit dhe metodologjisë</h2>
          <p className="contentBody">Karburanti Sot mbledh të dhëna publike kombëtare dhe i kthen në një format të krahasueshëm për drejtuesit në Shqipëri dhe Evropë. Çmimet janë orientuese dhe mund të ndryshojnë pas publikimit. Verifiko gjithmonë me pikat lokale ose burimet zyrtare para një vendimi përfundimtar.</p>
        </section>
        <section className="contentSection">
          <h2 className="contentHeading">Pyetje të shpeshta</h2>
          <h3 className="contentFaqQuestion">A janë këto çmime në kohë reale?</h3>
          <p className="contentFaqAnswer">Jo. Faqja publikon të dhënat publike më të fundit të disponueshme, por nuk pretendon saktësi në kohë reale për çdo pompë.</p>
          <h3 className="contentFaqQuestion">A mund t'i përdor për udhëtime ndërkufitare?</h3>
          <p className="contentFaqAnswer">Po, janë ndërtuar për planifikim dhe krahasim. Për vendimin përfundimtar të furnizimit, verifiko çmimet e stacioneve në itinerar.</p>
          <h3 className="contentFaqQuestion">Ku mund t'i verifikoj metodat dhe supozimet?</h3>
          <p className="contentFaqAnswer">Shiko <Link className="inlineLink" to="/methodology">Metodologjinë</Link> dhe faqen <Link className="inlineLink" to="/about">Rreth nesh</Link> për hollësitë e transparencës.</p>
        </section>
      </article>
    );
  }

  return (
    <article className="contentPage">
      <section className="contentSection">
        <h2 className="contentHeading">Today&apos;s fuel prices in Albania</h2>
        <p className="contentBody">The dashboard above is built for practical decisions: commuting, delivery planning, and cross-border travel from Albania. Current Albania values in the latest dataset are petrol {formatValue(albania?.gasoline95_eur, lang)}, diesel {formatValue(albania?.diesel_eur, lang)}, and LPG {formatValue(albania?.lpg_eur, lang)}.</p>
        <p className="contentBody">These values are a country-level reference, not a guarantee for every station. Pump prices can vary by city, chain, and update timing.</p>
      </section>
      <section className="contentSection">
        <h2 className="contentHeading">How to read the fuel price data</h2>
        <p className="contentBody">Fuel Today normalizes country values into EUR per liter so Albania can be compared with eurozone and non-eurozone markets on one scale. Use the numbers for trend and spread analysis, then validate your exact station before buying fuel.</p>
        <p className="contentBody">For collection details, review the <Link className="inlineLink" to="/methodology">Methodology page</Link>. For market interpretation, read <Link className="inlineLink" to="/how-fuel-prices-work">How fuel prices work</Link>.</p>
      </section>
      <section className="contentSection">
        <h2 className="contentHeading">Why fuel prices change</h2>
        <p className="contentBody">Albanian and Balkan prices move with international crude benchmarks, refinery margins, transport costs, taxes, and exchange-rate pressure. Even when crude is stable, pump prices can shift because fiscal policy or regional logistics changed.</p>
        <p className="contentBody">Seasonal demand also matters: tourism-heavy periods in the region can increase distribution pressure and widen differences between neighboring markets.</p>
      </section>
      <section className="contentSection">
        <h2 className="contentHeading">Albania fuel prices compared with nearby countries</h2>
        <p className="contentBody">Nearby markets are often the most relevant benchmark for Albanian drivers. Latest visible comparisons include Kosovo diesel {formatValue(kosovo?.diesel_eur, lang)}, Montenegro diesel {formatValue(montenegro?.diesel_eur, lang)}, North Macedonia diesel {formatValue(northMacedonia?.diesel_eur, lang)}, and Greece diesel {formatValue(greece?.diesel_eur, lang)}.</p>
        <p className="contentBody">Use the <Link className="inlineLink" to="/europe-fuel-comparison">Europe fuel comparison guide</Link>, then open country pages such as <Link className="inlineLink" to="/fuel-prices/albania">Albania</Link>, <Link className="inlineLink" to="/fuel-prices/greece">Greece</Link>, and <Link className="inlineLink" to="/fuel-prices/italy">Italy</Link>.</p>
      </section>
      <section className="contentSection">
        <h2 className="contentHeading">Example driving costs from Albania</h2>
        <p className="contentBody">Example one-way fuel cost estimates using country-level reference prices:</p>
        <ul className="contentList">
          <li>Tirana to Shkoder (about 100 km): {cost(routes.shkoder, lang)}</li>
          <li>Tirana to Pristina (about 260 km): {cost(routes.pristina, lang)}</li>
          <li>Tirana to Ohrid (about 135 km): {cost(routes.ohrid, lang)}</li>
          <li>Tirana to Podgorica (about 160 km): {cost(routes.podgorica, lang)}</li>
        </ul>
        <p className="contentBody">These are planning estimates, not exact trip invoices. For route-by-route advice, open the <Link className="inlineLink" to="/road-trip-fuel-guide">Road trip fuel guide</Link>.</p>
      </section>
      <section className="contentSection">
        <h2 className="contentHeading">When are prices updated?</h2>
        <p className="contentBody">Update frequency depends on upstream publication schedules. Some sources update weekly, while others publish less frequently. The latest fetch timestamp appears on the page so users can check freshness before using the numbers.</p>
      </section>
      <section className="contentSection">
        <h2 className="contentHeading">Data source and methodology summary</h2>
        <p className="contentBody">Fuel Today aggregates public country-level fuel data and converts it into a comparable format for drivers in Albania and Europe. Prices are informational and may change after publication. Always verify with local stations or official sources before final decisions.</p>
      </section>
      <section className="contentSection">
        <h2 className="contentHeading">Frequently asked questions</h2>
        <h3 className="contentFaqQuestion">Are these real-time prices?</h3>
        <p className="contentFaqAnswer">No. The site publishes the most recent available public data, but does not claim real-time pump accuracy.</p>
        <h3 className="contentFaqQuestion">Can I use this for cross-border road trips?</h3>
        <p className="contentFaqAnswer">Yes, it is designed for planning and comparison. For final purchase decisions, validate station-level prices on your route.</p>
        <h3 className="contentFaqQuestion">Where can I verify methods and assumptions?</h3>
        <p className="contentFaqAnswer">See <Link className="inlineLink" to="/methodology">Methodology</Link> and <Link className="inlineLink" to="/about">About</Link> for transparency details.</p>
      </section>
    </article>
  );
}
