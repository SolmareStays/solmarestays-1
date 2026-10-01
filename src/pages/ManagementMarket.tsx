import { useParams, Link, Navigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { OwnerLeadForm } from '@/components/OwnerLeadForm';
import { marketBySlug, PERMIT_LABEL, LONG_TERM_OFFERING_LIVE, type Market } from '@/data/markets';
import { CONTACT, REVIEWS, PORTFOLIO } from '@/data/stats';
import { CheckCircle2, XCircle, Clock, FileText } from 'lucide-react';

const SITE_URL = 'https://www.solmarestays.com';

/**
 * Per-market owner page: /vacation-rental-management/{city}
 *
 * 🔴 This is deliberately NOT one template with the city name swapped — that is a
 * doorway page. Every page is anchored on a fact that is only true in that
 * jurisdiction: whether new STR permits are even being issued, what the lodging tax
 * actually totals, and whether we hold doors nearby. Pismo Beach has issued no new
 * licence since 2023; Paso Robles non-hosted permits are at capacity; Morro Bay is
 * mid-audit. A page that ignores that sells owners something they cannot buy.
 *
 * ⚖ Only markets with `verified: true` in markets.ts reach the router. See that file.
 */

const PERMIT_ICON = {
  open: CheckCircle2,
  frozen: XCircle,
  capped: Clock,
  emerging: FileText,
} as const;

/** Honest framing for what an owner can actually do in this market right now. */
function permitStance(m: Market) {
  switch (m.permit) {
    case 'open':
      return `New short-term rental permits are being issued in ${m.name}, so if your property qualifies you can start from scratch here.`;
    case 'frozen':
      return `No new short-term rental permits are being issued in ${m.name}. If you already hold one, it is worth protecting. If you are buying, confirm what transfers before you close.`;
    case 'capped':
      return `Permits in ${m.name} are capped, so new applications join a waiting list. That changes the plan, and it is better to know now.`;
    case 'emerging':
      return `${m.name} has no dedicated short-term rental ordinance yet, so today's route is not necessarily next year's. Build a plan that survives the rules being written.`;
  }
}

const ManagementMarket = () => {
  const { city } = useParams<{ city: string }>();
  const market = city ? marketBySlug(city) : undefined;

  // Unverified or unknown market → the hub, never a thin invented page.
  if (!market) return <Navigate to="/vacation-rental-management" replace />;

  const Icon = PERMIT_ICON[market.permit];
  const title = `Vacation Rental Management in ${market.name}, CA | Solmaré Stays`;
  const description = `Short-term rental management for ${market.name} owners. ${PERMIT_LABEL[market.permit]} — lodging tax ${market.totRate}. Local team, ${market.minutesFromBase === 0 ? 'based here' : `${market.minutesFromBase} minutes away`}.`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: `Solmaré Stays — Vacation Rental Management, ${market.name}`,
    url: `${SITE_URL}/vacation-rental-management/${market.slug}`,
    description,
    telephone: CONTACT.phoneSchema,
    email: CONTACT.email,
    serviceType: 'Vacation rental property management',
    areaServed: { '@type': 'City', name: market.name, containedInPlace: { '@type': 'AdministrativeArea', name: 'San Luis Obispo County, California' } },
    provider: {
      '@type': 'Organization',
      name: 'Solmaré Stays',
      url: SITE_URL,
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: REVIEWS.averageFive,
        ratingCount: String(REVIEWS.rated),
        bestRating: '5',
      },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        absoluteTitle={title}
        description={description}
        schema={schema}
        breadcrumbs={[
          { name: 'Home', url: SITE_URL },
          { name: 'Property Management', url: `${SITE_URL}/vacation-rental-management` },
          { name: market.name, url: `${SITE_URL}/vacation-rental-management/${market.slug}` },
        ]}
      />
      <Header />

      <main className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl pt-32 pb-20">
        <p className="text-xs tracking-[0.18em] uppercase text-muted-foreground mb-3">
          San Luis Obispo County
        </p>
        <h1 className="font-serif text-3xl md:text-5xl font-semibold leading-tight mb-5">
          Vacation Rental Management in {market.name}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl">
          {permitStance(market)}
        </p>

        {/* The permit reality. This is the whole reason this page exists. */}
        <section className="border rounded-md p-6 mb-8">
          <div className="flex items-start gap-3 mb-4">
            <Icon className="w-5 h-5 mt-1 flex-shrink-0" aria-hidden="true" />
            <div>
              <h2 className="font-serif text-2xl font-semibold mb-1">
                Permits: {PERMIT_LABEL[market.permit]}
              </h2>
              <p className="text-sm text-muted-foreground">
                Regulated by {market.jurisdiction}
              </p>
            </div>
          </div>
          <p className="leading-relaxed mb-5">{market.permitDetail}</p>

          <h3 className="font-semibold mb-1">Lodging tax: {market.totRate}</h3>
          <p className="leading-relaxed text-muted-foreground">{market.totDetail}</p>

          {market.permit !== 'open' && (
            <p className="leading-relaxed mt-5 pt-5 border-t">
              <strong>Worth knowing:</strong> a stay of 31 nights or longer is not a
              short-term rental, so permit caps and freezes do not reach it.{' '}
              {LONG_TERM_OFFERING_LIVE ? (
                <>
                  We manage furnished monthly stays as well as nightly ones, and in a
                  capped market that is often the route that still works.
                </>
              ) : (
                <>
                  We do not take on 31+ night rentals yet — that is licensed activity in
                  California and we will offer it when ours issues. We would still rather
                  you knew the option exists, so ask and we will point you the right way.
                </>
              )}
            </p>
          )}
        </section>

        {/* Existing permit holders are the easiest and fastest owners to onboard, and in
            a frozen market the only ones who can legally operate. Kyle 2026-09-30. */}
        <section className="mb-10">
          <h2 className="font-serif text-2xl font-semibold mb-3">
            {market.permit === 'open'
              ? `Already have a permit in ${market.name}?`
              : `If you already hold a ${market.name} permit`}
          </h2>
          {/* ⚠ The full how-switching-works paragraph lives once, on /management. It
              used to repeat verbatim on all 18 market pages — the most duplicated block
              on the site. Keep the market-specific sentence here and link out. */}
          <p className="leading-relaxed">
            {market.permit !== 'open' ? (
              <>
                In {market.name} an existing permit is genuinely valuable — it cannot
                currently be replaced, so the job is running it well and never missing a
                renewal.
              </>
            ) : (
              <>
                New permits are available in {market.name}, so you can start from scratch
                here — but if you already hold one, switching is the faster route.
              </>
            )}{' '}
            Your permit stays in your name either way.{' '}
            <Link to="/management" className="underline">
              How switching works
            </Link>
            .
          </p>
        </section>

        {/* Honest local position. */}
        <section className="mb-10">
          <h2 className="font-serif text-2xl font-semibold mb-3">
            Where we actually stand in {market.name}
          </h2>
          <p className="leading-relaxed mb-4">{market.angle}</p>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <strong className="text-foreground">
                {market.doorsManaged > 0
                  ? `${market.doorsManaged} ${market.doorsManaged === 1 ? 'property' : 'properties'} under management here`
                  : `Taking on properties in ${market.name}`}
              </strong>{' '}
              — part of a {PORTFOLIO.properties}-home portfolio across San Luis Obispo County.
            </li>
            <li>
              <strong className="text-foreground">
                {market.minutesFromBase === 0
                  ? 'Our team is based in this market'
                  : `About ${market.minutesFromBase} minutes from our Pismo Beach base`}
              </strong>{' '}
              — close enough for in-person inspection between every stay.
            </li>
            <li>
              <strong className="text-foreground">
                {REVIEWS.totalRounded} guest reviews averaging {REVIEWS.averageFive}/5
              </strong>{' '}
              across Airbnb, Vrbo and Google.
            </li>
          </ul>
        </section>

        {/*
          Kyle 2026-09-30: we want clients in ALL areas of the county, we specialise in
          high-end homes, and concierge is part of the offer.
          🔴 CONCIERGE BRIGHT LINE — "we book things that don't move". The CA Seller of
          Travel Act (B&P 17550) hooks on TRANSPORTATION and catches you for merely
          ADVERTISING that you can arrange it; the penalty starts at a cease-and-desist
          on ALL advertising, this website included. ✅ Safe to name: restaurants, wine
          tastings, private chefs, spa, guides, photographers, in-home experiences.
          ⛔ NEVER name or imply: flights, airport transfers, car services, van wine
          tours, boat charters. Refer warmly, let the guest book it, take nothing.
        */}
        <section className="mb-10">
          <h2 className="font-serif text-2xl font-semibold mb-3">
            Built for high-end homes
          </h2>
          <p className="leading-relaxed mb-4">
            We specialise in design-led, higher-end properties, and we run them like it:
            professional photography, listing copy written for the house rather than a
            template, dynamic nightly pricing, strict guest screening, hotel-grade linens,
            and an in-person inspection between every single stay.
          </p>
          <p className="leading-relaxed">
            Guests also get a concierge — we arrange restaurant reservations, winery
            tastings, private chefs, in-home massage, surf and hiking guides and
            photographers, and stock the house before arrival. It is a real reason guests
            book direct with us a second time, and direct nights are the ones that carry
            the least commission for you.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-serif text-2xl font-semibold mb-3">What we run for you</h2>
          <p className="leading-relaxed mb-4">
            Listing and channel management across Airbnb, Vrbo, Google and direct;
            dynamic nightly pricing; guest screening and communication; cleaning and
            linen coordination; inspection between every stay; maintenance; and monthly
            owner statements. The full breakdown is on our{' '}
            <Link to="/management" className="underline">
              property management page
            </Link>
            , and the county-wide permit and tax rules are in our{' '}
            <Link to="/blog/slo-county-short-term-rental-rules" className="underline">
              SLO County short-term rental guide
            </Link>
            .
          </p>
        </section>

        <section className="border-t pt-10 mb-10">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-2">
            Get a revenue projection for your {market.name} property
          </h2>
          <p className="text-muted-foreground mb-4">
            Tell us the address and we will come back with a realistic earnings estimate
            and a straight answer on whether it can be permitted. No cost, no obligation.
          </p>
          <p className="text-muted-foreground mb-6">
            And if you are not looking to hire anyone — you self-manage, or you are just
            weighing whether a property pencils — ask anyway. We would rather this area be
            run well than run by us, and there is no expectation of anything after.
          </p>
          <OwnerLeadForm
            subject={`Property Management Inquiry — ${market.name} market page`}
          />
        </section>

        {/* Citations. Owners are being told what is legal; show the receipts. */}
        {market.sources.length > 0 && (
          <section className="border-t pt-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide mb-3">
              Sources
            </h2>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {market.sources.map(url => (
                <li key={url}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="underline break-all"
                  >
                    {url}
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground mt-4">
              Permit rules and tax rates change. Confirm current requirements with{' '}
              {market.jurisdiction} before making a decision, or call us on{' '}
              <a href={CONTACT.phoneHref} className="underline">
                {CONTACT.phone}
              </a>{' '}
              and we will walk through your specific address.
            </p>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ManagementMarket;
