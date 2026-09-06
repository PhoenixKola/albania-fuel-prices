import { useEffect, useState, type ReactNode } from "react";

export type EditorialNavItem = { id: string; label: string };

type ShellProps = {
  variant: "dossier" | "newsroom";
  eyebrow: string;
  title: string;
  lede: string;
  updated?: string;
  status?: string;
  sections: EditorialNavItem[];
  contentsLabel: string;
  children: ReactNode;
  heroAside?: ReactNode;
  actions?: ReactNode;
};

export function EditorialShell({
  variant,
  eyebrow,
  title,
  lede,
  updated,
  status,
  sections,
  contentsLabel,
  children,
  heroAside,
  actions,
}: ShellProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.replace(/^#/, ""));
    const frame = window.requestAnimationFrame(() => {
      if (id) document.getElementById(id)?.scrollIntoView();
      else window.scrollTo(0, 0);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const nodes = sections
      .map((section) => document.getElementById(section.id))
      .filter((node): node is HTMLElement => node instanceof HTMLElement);
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: [0, 0.15, 0.5] }
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [sections]);

  const navigation = (
    <nav className="editorialTocLinks" aria-label={contentsLabel}>
      {sections.map((section, index) => (
        <a
          key={section.id}
          className={activeId === section.id ? "isActive" : ""}
          href={`#${section.id}`}
          aria-current={activeId === section.id ? "location" : undefined}
        >
          <span>{String(index + 1).padStart(2, "0")}</span>
          {section.label}
        </a>
      ))}
    </nav>
  );

  return (
    <article className={`editorialExperience editorialExperience-${variant}`}>
      <header className="editorialHero">
        <div className="editorialHeroCopy">
          <p className="editorialEyebrow"><i aria-hidden="true" />{eyebrow}</p>
          <h1>{title}</h1>
          <p className="editorialLede">{lede}</p>
          {(updated || status) ? (
            <div className="editorialMeta" aria-label={[updated, status].filter(Boolean).join(" · ")}>
              {status ? <span className="editorialStatus"><i aria-hidden="true" />{status}</span> : null}
              {updated ? <span>{updated}</span> : null}
            </div>
          ) : null}
          {actions ? <div className="editorialHeroActions">{actions}</div> : null}
        </div>
        {heroAside ? <div className="editorialHeroAside">{heroAside}</div> : null}
      </header>

      {sections.length ? (
        <details className="editorialMobileToc">
          <summary>{contentsLabel}<span aria-hidden="true">＋</span></summary>
          {navigation}
        </details>
      ) : null}

      <div className="editorialBodyGrid">
        <div className="editorialMain">{children}</div>
        {sections.length ? (
          <aside className="editorialToc">
            <p>{contentsLabel}</p>
            {navigation}
          </aside>
        ) : null}
      </div>
    </article>
  );
}

type SectionProps = {
  id: string;
  index?: string;
  title: string;
  intro?: string;
  tone?: "default" | "accent" | "warning";
  children?: ReactNode;
};

export function EditorialSection({ id, index, title, intro, tone = "default", children }: SectionProps) {
  return (
    <section id={id} className={`editorialSection editorialSection-${tone}`} aria-labelledby={`${id}-title`}>
      <div className="editorialSectionHeading">
        {index ? <span>{index}</span> : null}
        <div>
          <h2 id={`${id}-title`}>{title}</h2>
          {intro ? <p>{intro}</p> : null}
        </div>
      </div>
      {children ? <div className="editorialSectionBody">{children}</div> : null}
    </section>
  );
}

export function EditorialMetrics({ items }: { items: { label: string; value: string; note?: string }[] }) {
  return (
    <div className="editorialMetricGrid">
      {items.map((item) => (
        <div className="editorialMetric" key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
          {item.note ? <small>{item.note}</small> : null}
        </div>
      ))}
    </div>
  );
}

export function EditorialCallout({ label, children, warning = false }: { label: string; children: ReactNode; warning?: boolean }) {
  return (
    <aside className={`editorialCallout ${warning ? "editorialCalloutWarning" : ""}`}>
      <span>{label}</span>
      <div>{children}</div>
    </aside>
  );
}
