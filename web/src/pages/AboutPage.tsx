import { Link } from "react-router-dom";
import type { Lang } from "../models/i18n";
import { editorialCopy } from "../config/editorialCopy";
import { ANALYSIS_META } from "../generated/analysisMeta";

/**
 * About reads as a narrative, not a reference document, so it has no contents
 * rail and no numbered sections. The live coverage figures carry the argument
 * the prose is making, so they sit directly under the opening statement.
 */
export default function AboutPage({ lang }: { lang: Lang }) {
  const copy = editorialCopy[lang];
  const page = copy.about;
  const sq = lang === "sq";

  const byId = Object.fromEntries(page.sections.map((section) => [section.id, section]));
  const principles = byId.principles;
  const story = ["mission", "process", "corrections", "independence"]
    .map((id) => byId[id])
    .filter(Boolean);

  return (
    <main className="aboutPage">
      <header className="aboutHero">
        <p className="aboutEyebrow"><i aria-hidden="true" />{page.eyebrow}</p>
        <h1>{page.title}</h1>
        <p className="aboutLede">{page.lede}</p>
        <p className="aboutStatus">{page.status}</p>

        <dl className="aboutFigures">
          <div>
            <dt>{page.metrics[0]}</dt>
            <dd>{ANALYSIS_META.countriesAnalysed || 0}</dd>
            <p>{sq ? "tregje evropiane" : "European markets"}</p>
          </div>
          <div>
            <dt>{page.metrics[1]}</dt>
            <dd>{ANALYSIS_META.daysObserved || 0}</dd>
            <p>{sq ? "ditë të ruajtura pa ndërprerje" : "consecutive days recorded"}</p>
          </div>
          <div>
            <dt>{page.metrics[2]}</dt>
            <dd>{sq ? "I pavarur" : "Independent"}</dd>
            <p>{sq ? "pa renditje ose përfundime me pagesë" : "no paid rankings or conclusions"}</p>
          </div>
        </dl>
      </header>

      <div className="aboutStory">
        {story.map((section, index) => (
          <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`}>
            <div className="aboutStoryHeading">
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <h2 id={`${section.id}-title`}>{section.title}</h2>
            </div>
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </section>
        ))}
      </div>

      {principles ? (
        <section className="aboutPrinciples" aria-labelledby="about-principles">
          <div className="aboutPrinciplesHead">
            <h2 id="about-principles">{principles.title}</h2>
            {principles.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <ol>
            {(principles.bullets ?? []).map((item, index) => {
              const [head, ...rest] = item.split(":");
              return (
                <li key={item}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <b>{head}</b>
                  <p>{rest.join(":").trim()}</p>
                </li>
              );
            })}
          </ol>
        </section>
      ) : null}

      <section className="aboutClose" aria-labelledby="about-close">
        <h2 id="about-close">{sq ? "Kontrolloje punën tonë" : "Check our work"}</h2>
        <p>{sq
          ? "Metodologjia shpjegon çdo burim dhe llogaritje. Nëse një shifër duket e gabuar, dërgoje dhe e verifikojmë."
          : "The methodology documents every source and calculation. If a figure looks wrong, send it and we will verify it."}</p>
        <div className="aboutCloseActions">
          <Link className="aboutActionPrimary" to="/methodology">{page.methodCta}<span aria-hidden="true">→</span></Link>
          <Link className="aboutAction" to="/contact">{page.contactCta}</Link>
        </div>
      </section>
    </main>
  );
}
