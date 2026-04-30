import { useEffect } from "react";
import { Link } from "react-router-dom";
import type { TDict } from "../locales";

type Props = { t: TDict };

export default function NotFoundPage({ t }: Props) {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <article className="contentPage notFoundPage">
      <div className="notFoundContent">
        <h1 className="contentPageTitle">{t.notFoundTitle}</h1>
        <p className="notFoundSub">{t.notFoundSubtitle}</p>
        <p className="contentBody notFoundBody">{t.notFoundMessage}</p>
        <p className="contentBody notFoundBody">
          Try <Link to="/methodology" className="inlineLink">Methodology</Link>, <Link to="/europe-fuel-comparison" className="inlineLink">Europe comparison</Link>, or <Link to="/contact" className="inlineLink">Contact</Link>.
        </p>
        <Link to="/" className="btn btn-primary notFoundBtn">
          {t.notFoundButtonHome}
        </Link>
      </div>
    </article>
  );
}
