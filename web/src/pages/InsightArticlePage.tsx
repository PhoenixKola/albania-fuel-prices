import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getArticle } from "../config/articles";

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

export default function InsightArticlePage() {
  const { articleSlug } = useParams<{ articleSlug: string }>();
  const article = articleSlug ? getArticle(articleSlug) : undefined;

  useEffect(() => { window.scrollTo(0, 0); }, [articleSlug]);

  if (!article) {
    return (
      <article className="contentPage">
        <h1 className="contentPageTitle">Article not found</h1>
        <p className="contentBody">
          This article does not exist or has not been published yet. Browse all published pieces on
          the <Link to="/insights" className="inlineLink">Insights page</Link>.
        </p>
      </article>
    );
  }

  return (
    <article className="contentPage">
      <h1 className="contentPageTitle">{article.title}</h1>
      <p className="contentBodyMuted">
        By the Karburanti Sot team · Published {formatDate(article.datePublished)}
        {article.dateModified ? ` · Updated ${formatDate(article.dateModified)}` : ""}
        {" "}· {article.readMinutes} min read
      </p>
      <div dangerouslySetInnerHTML={{ __html: article.html }} />
      <section className="contentSection">
        <h2 className="contentHeading">Keep exploring</h2>
        <ul className="contentList">
          <li><Link to="/insights" className="inlineLink">All insights articles</Link></li>
          <li><Link to="/fuel-prices/albania" className="inlineLink">Albania fuel prices today</Link></li>
          <li><Link to="/rankings" className="inlineLink">Europe fuel price rankings</Link></li>
        </ul>
      </section>
    </article>
  );
}
