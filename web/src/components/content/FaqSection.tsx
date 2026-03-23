import type { TDict } from "../../locales";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqSectionProps = {
  t: TDict;
  items?: FaqItem[];
  title?: string;
};

export default function FaqSection({
  t,
  items,
  title,
}: FaqSectionProps) {
  const defaultItems: FaqItem[] = [
    { question: t.faqQ1, answer: t.faqA1 },
    { question: t.faqQ2, answer: t.faqA2 },
    { question: t.faqQ3, answer: t.faqA3 },
    { question: t.faqQ4, answer: t.faqA4 },
    { question: t.faqQ5, answer: t.faqA5 },
    { question: t.faqQ6, answer: t.faqA6 },
  ];

  const renderedItems = items ?? defaultItems;

  return (
    <section className="contentSection">
      <h2 className="contentHeading">{title ?? t.faqTitle}</h2>

      {renderedItems.map((item) => (
        <div key={item.question} className="contentFaqItem">
          <h3 className="contentFaqQuestion">{item.question}</h3>
          <p className="contentFaqAnswer">{item.answer}</p>
        </div>
      ))}
    </section>
  );
}