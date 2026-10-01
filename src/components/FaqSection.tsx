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
    <section className={`section-padding bg-background ${className}`} aria-labelledby="faq-heading">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* ⚠ Scale matches every other section heading on the site (48px at md).
            This was text-3xl/4xl and read a size smaller than its neighbours. */}
        <h2
          id="faq-heading"
          className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-10 text-center"
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
          crawlable and still collapsed for the reader. All rows start closed — the
          page reads cleaner, and nothing is hidden from a crawler by doing so.

          Cards, matching the rest of the page rather than bare hairline rows.
        */}
        <dl className="max-w-4xl mx-auto grid gap-4">
          {items.map(item => (
            <div
              key={item.q}
              className="bg-card rounded-2xl shadow-soft border border-border/50 overflow-hidden"
            >
              <details className="group">
                <summary className="cursor-pointer list-none p-6 flex items-start justify-between gap-4">
                  <dt className="font-serif text-lg font-semibold text-foreground">{item.q}</dt>
                  <span
                    aria-hidden="true"
                    className="flex-none text-2xl leading-none text-muted-foreground/60 transition-transform duration-200 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <dd className="px-6 pb-6 text-muted-foreground text-sm leading-relaxed">
                  {item.a}
                </dd>
              </details>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
