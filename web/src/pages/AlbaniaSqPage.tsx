import type { LatestEurope } from "../models/fuel";
import { albaniaSqModel, EN_ALBANIA_PATH, sqDate } from "../config/localizedAlbania";

/** Shared verbatim by React and the static HTML build; no English analysis fragments. */
export default function AlbaniaSqPage({ data, fx }: { data: LatestEurope | null; fx?: { rate: number; date: string } | null }) {
  const m = albaniaSqModel(data, fx);
  return <main className="editorialExperience sqFuelPage" id="sq-price-answer">
    <header className="sqFuelHero">
      <p className="sqFuelEyebrow">Shqipëri · Referencë për buxhetin e karburantit</p>
      <h1>Çmimet e karburanteve në Shqipëri</h1>
      <p className="sqFuelAnswer">{m.answer}</p>
      <p className="sqFuelDate">{m.dateLabel}. Burimi: {m.sourceUrl ? <a href={m.sourceUrl} target="_blank" rel="noopener noreferrer">{m.source}</a> : m.source}.</p>
      <p className="sqFuelNotice" role="status">{m.stale ? "Lexim i mëparshëm: këto vlera nuk vërtetojnë çmimin e sotëm në pompë. Kontrolloni datën dhe çmimin e pikës para furnizimit." : "Publikimi është i afërt në kohë, por çmimi në pompë mund të ndryshojë nga kjo referencë."}</p>
      <a className="editorialAction" href={EN_ALBANIA_PATH} hrefLang="en">Lexo versionin në anglisht →</a>
    </header>

    <section className="sqFuelSection" aria-labelledby="sq-fuels">
      <div className="sqFuelSectionHeading"><span aria-hidden="true">01</span><h2 id="sq-fuels">Një litër dhe një furnizim prej 50 litrash</h2></div>
      <p>Nafta është karburanti diesel; benzina 95 dhe gazi LPG paraqiten veçmas. Të gjitha llogaritjet më poshtë përdorin të njëjtin lexim: {m.dateLabel.toLocaleLowerCase("sq-AL")}.</p>
      <div className="sqFuelGrid">
        {m.fuels.map(f => <article className="sqFuelTile" key={f.key}>
          <h3>{f.label}</h3><p className="sqFuelValue">{m.price(f.eur)}<span>për 1 L</span></p>
          {f.all != null ? <p className="sqFuelAll">≈ {m.number(f.all, 1)} lekë/L <span>· konvertim orientues</span></p> : <p className="sqFuelAll">Konvertimi në lekë nuk disponohet.</p>}
          <div className="sqFuelTank"><span>Buxheti për 50 L</span><strong>{m.price(f.tank, 2)}</strong><small>{f.eur == null ? "Llogaritja nuk disponohet." : `50 L × ${m.price(f.eur)}/L`}</small></div>
        </article>)}
      </div>
      <p className="sqFuelMuted">{m.fx ? `Kurs orientues i datës ${sqDate(m.fx.date)}: 1 EUR = ${m.number(m.fx.rate, 4)} ALL. Burimi i kursit: ` : "Pa një kurs të vlefshëm dhe të datuar, paraqesim vetëm EUR. "}{m.fx ? <a href="https://github.com/fawazahmed0/exchange-api" target="_blank" rel="noopener noreferrer">Exchange API</a> : null} {m.fx ? "Shuma në lekë është përllogaritje, jo çmim i vëzhguar në pompë; kursi dhe tarifat e bankës mund të ndryshojnë." : "Nuk përdorim një kurs të hamendësuar."}</p>
    </section>

    <section className="sqFuelSection" aria-labelledby="sq-meaning">
      <div className="sqFuelSectionHeading"><span aria-hidden="true">02</span><h2 id="sq-meaning">Çfarë përfaqësojnë këto çmime?</h2></div>
      <dl className="sqFuelDefinitions">
        <div><dt>Referencë kombëtare</dt><dd>Vlerë orientuese për vendin, nga burimi dhe data e shënuar. Nuk është mesatare zyrtare e verifikuar nga ne dhe nuk garanton çmimin e një stacioni.</dd></div>
        <div><dt>Konvertim në lekë</dt><dd>Llogaritje EUR/L × kursi ALL për EUR, vetëm kur kursi ka vlerë dhe datë të vlefshme. Nuk është ofertë shitjeje.</dd></div>
        <div><dt>Çmim tavan</dt><dd>Kufi maksimal i përcaktuar në një vendim zyrtar, me datë dhe kohë hyrjeje në fuqi. Është e dhënë tjetër nga referenca jonë. Këtu nuk shfaqim një shifër tavani me vlefshmëri të pakonfirmuar.</dd></div>
        <div><dt>Çmim në pompë</dt><dd>Çmimi që afishon pika ku furnizoheni. Verifikojeni aty para blerjes; harta jonë nuk ofron çmime të verifikuara për çdo pompë.</dd></div>
      </dl>
      <p>Lexoni <a href="/methodology">metodologjinë dhe kufijtë e të dhënave</a>. Koha e shkarkimit të skedarit nuk është data e publikimit të çmimit.</p>
    </section>

    <section className="sqFuelSection" aria-labelledby="sq-plan">
      <div className="sqFuelSectionHeading"><span aria-hidden="true">03</span><h2 id="sq-plan">Nga çmimi për litër te udhëtimi juaj</h2></div>
      <div className="sqFuelToolGrid">
        <a href="/trip-cost-calculator"><strong>Llogaritni buxhetin e udhëtimit ↗︎</strong><span>Vendosni kilometrat, konsumin dhe karburantin. Rezultati është përllogaritje me referenca të datuara.</span></a>
        <a href="/fuel-detour-calculator"><strong>A ia vlen devijimi për furnizim? ↗︎</strong><span>Krahasoni diferencën e çmimit me karburantin e shpenzuar nga devijimi që vendosni ju.</span></a>
        <a href="/stations"><strong>Gjeni stacione të listuara ↗︎</strong><span>Shihni vendndodhjen, largësinë e përafërt dhe oraret kur disponohen. Pa çmime të verifikuara në pompë.</span></a>
        <a href="/compare"><strong>Krahasoni vendet ↗︎</strong><span>Zgjidhni të njëjtin karburant dhe kontrolloni datat e burimit përpara krahasimit.</span></a>
      </div>
      <h3>Krahasime të datuara me vendet fqinje</h3>
      {m.comparisons.map(c => <p key={c.country}><strong>{c.label}: </strong>{c.text}</p>)}
      <p>Për udhëtime ndërkufitare shihni <a href="/fuel-prices/kosovo">referencat e karburanteve në Kosovë</a> dhe <a href="/fuel-prices/greece">referencat në Greqi</a>. Kosova mund të ketë vetëm një datë vëzhgimi; ajo nuk është domosdoshmërisht datë publikimi. Nuk premtojmë kursim në pompë nga krahasimi i vendeve.</p>
    </section>

    <section className="sqFuelSection" aria-labelledby="sq-faq">
      <div className="sqFuelSectionHeading"><span aria-hidden="true">04</span><h2 id="sq-faq">Pyetje të shpeshta</h2></div>
      <div className="sqFuelFaq">{m.faqs.map(f => <div key={f.question}><h3>{f.question}</h3><p>{f.answer}</p></div>)}</div>
    </section>
  </main>;
}
