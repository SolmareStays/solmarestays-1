import faqs from '@/data/faqs.json';

/**
 * The visible half of the FAQ.
 *
 * 🔴 Every page that emits FAQPage schema must also SHOW those questions. Twenty
 * pages shipped 68 Q&As inside <script type="application/ld+json"> and rendered none
 * of them: a Google structured-data policy violation, and finished answers to the two
 * objections blocking both funnels (the management fee, and whether booking direct
 * beats Airbnb) hidden from every visitor.
 *
 * ⚖ src/data/faqs.json is GENERATED from the faq: arrays in scripts/prerender.mjs by
 * the `prebuild` step. Never hand-edit it, and never type a question straight into a
 * page component — the schema and the visible copy have to come from one array or
 * they drift, which is the bug this replaced.
 */

type Faq = { q: string; a: string };

const BY_ROUTE = faqs as Record<string, Faq[]>;

export function FaqSection({
  route,
  heading = 'Frequently asked questions',
  className = '',
}: {
  /** Route key into faqs.json, e.g. '/management'. */
  route: string;
  heading?: string;
  className?: string;
}) {
  const items = BY_ROUTE[route];
  if (!items || items.length === 0) return null;

  return (
    <section className={`py-16 md:py-24 ${className}`} aria-labelledby="faq-heading">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-3xl">
        <h2
          id="faq-heading"
          className="font-serif text-3xl md:text-4xl font-semibold mb-8 text-center"
        >
          {heading}
        </h2>
        {/*
          🔴 Native <details>, deliberately NOT the Radix Accordion this first shipped
          with. Radix unmounts AccordionContent while collapsed, so the ANSWERS were
          absent from the hydrated DOM entirely — measured on the built page: every
          question visible, every answer missing. Google renders JS, so it would have
          seen a FAQPage schema whose answers appear nowhere, which is the exact
          violation this component exists to fix.

          <details> keeps its content in the DOM when closed, so the answers are
          crawlable and still collapsed for the reader. The first item opens by default.
        */}
        <dl className="divide-y">
          {items.map((item, i) => (
            <div key={item.q} className="py-2">
              <details open={i === 0} className="group">
                <summary className="cursor-pointer list-none py-3 flex items-start justify-between gap-4">
                  <dt className="text-base md:text-lg font-medium">{item.q}</dt>
                  <span
                    aria-hidden="true"
                    className="mt-1 flex-none transition-transform group-open:rotate-45 text-xl leading-none opacity-60"
                  >
                    +
                  </span>
                </summary>
                <dd className="pb-4 pr-8 text-base leading-relaxed opacity-90">{item.a}</dd>
              </details>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
