import type { Lang } from "../models/i18n";
import { editorialCopy } from "../config/editorialCopy";
import PolicyPage from "../components/content/PolicyPage";

export default function EditorialPolicyPage({ lang }: { lang: Lang }) {
  return <PolicyPage lang={lang} document={editorialCopy[lang].policies.editorial} />;
}
