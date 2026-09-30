import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { OwnerLeadForm } from '@/components/OwnerLeadForm';
import { PUBLISHED_MARKETS, PERMIT_LABEL, type PermitStatus } from '@/data/markets';
import { CONTACT } from '@/data/stats';

const SITE_URL = 'https://www.solmarestays.com';

/**
 * /vacation-rental-management — the county hub.
 *
 * The genuinely useful thing no competitor publishes: one table showing, per SLO
 * County jurisdiction, whether new short-term rental permits are available and what
 * the lodging tax totals. That is the question every prospective owner opens with,
 * and answering it plainly is what earns the link and the AI citation.
 *
 * ⚖ Driven by markets.ts, so an unverified market cannot leak onto the page.
 */

const ORDER: PermitStatus[] = ['open', 'capped', 'emerging', 'frozen'];

const GROUP_INTRO: Record<PermitStatus, string> = {
  open: 'New permits are available in these markets, so a property that qualifies can be licensed and listed.',
  capped: 'These markets have a hard cap. New applications join a waiting list, and the wait is not predictable.',
  emerging: 'No dedicated short-term rental ordinance exists here yet. Expect the requirements to change.',
  frozen: 'No new permits are being issued. These are markets for owners who already hold a licence — or for stays of 31 nights and longer, which are not short-term rentals at all.',
};

const ManagementHub = () => {
  const grouped = ORDER.map(status => ({
    status,
    markets: PUBLISHED_MARKETS.filter(m => m.permit === status),
  })).filter(g => g.markets.length > 0);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Short-term rental permit status by San Luis Obispo County jurisdiction',
    itemListElement: PUBLISHED_MARKETS.map((m, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${m.name} — ${PERMIT_LABEL[m.permit]}`,
      url: `${SITE_URL}/vacation-rental-management/${m.slug}`,
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      {/*
        absoluteTitle, not title: SEO appends "| Solmaré Stays" and the prerendered
        <title> already carries it. Passing `title` produced a doubled brand AND made
        the tag flip on hydration, a bug this repo has fixed once already.
      */}
      <SEO
        absoluteTitle="Vacation Rental Management in SLO County — Permit Status by City | Solmaré Stays"
        description="Which San Luis Obispo County cities are still issuing short-term rental permits, and what lodging tax each one charges. Pismo is frozen, Paso is capped, the unincorporated county is open."
        schema={schema}
        breadcrumbs={[
          { name: 'Home', url: SITE_URL },
          { name: 'Property Management', url: `${SITE_URL}/vacation-rental-management` },
        ]}
      />
      <Header />

      <main className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl pt-32 pb-20">
        <p className="text-xs tracking-[0.18em] uppercase text-muted-foreground mb-3">
          San Luis Obispo County
        </p>
        <h1 className="font-serif text-3xl md:text-5xl font-semibold leading-tight mb-5">
          Where you can still get a short-term rental permit in SLO County
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-2xl">
          Permit availability is not the same across the county, and it is the first
          thing that decides whether owning a short-term rental here is even possible.
          Pismo Beach has issued no new licence since November 2023. Paso Robles
          non-hosted permits are at capacity. The unincorporated county is open.
        </p>
        <p className="text-muted-foreground mb-4 max-w-2xl">
          We work with owners across the whole county — Avila Beach to Cambria, Paso Robles
          to Nipomo — and we specialise in design-led, higher-end homes. We will tell you
          plainly when a market is closed rather than sell you a projection for a property
          that cannot be licensed.
        </p>
        {/* Existing permit holders = the easiest owners to win, and in frozen markets
            the only ones who can operate at all. Kyle 2026-09-30. */}
        <p className="text-muted-foreground mb-12 max-w-2xl">
          <strong className="text-foreground">Already hold a permit?</strong> That is the
          hard part done — it stays in your name and we operate underneath it, usually
          live within a week. And if you are not looking to hire anyone at all, ask
          anyway: we would rather this area be run well than run by us.
        </p>

        {/* Summary table — the reference people will link to. */}
        <div className="overflow-x-auto border rounded-md mb-14">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="text-left font-semibold px-4 py-3">Market</th>
                <th className="text-left font-semibold px-4 py-3">Regulated by</th>
                <th className="text-left font-semibold px-4 py-3">New permits</th>
                <th className="text-left font-semibold px-4 py-3 whitespace-nowrap">Lodging tax</th>
              </tr>
            </thead>
            <tbody>
              {PUBLISHED_MARKETS.map(m => (
                <tr key={m.slug} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <Link to={`/vacation-rental-management/${m.slug}`} className="underline font-medium">
                      {m.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {m.unincorporated ? 'SLO County' : m.jurisdiction.replace(/^City of /, '')}
                  </td>
                  <td className="px-4 py-3">{PERMIT_LABEL[m.permit]}</td>
                  <td className="px-4 py-3 tabular-nums whitespace-nowrap">{m.totRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {grouped.map(({ status, markets }) => (
          <section key={status} className="mb-12">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-2">
              {PERMIT_LABEL[status]}
            </h2>
            <p className="text-muted-foreground mb-5 max-w-2xl">{GROUP_INTRO[status]}</p>
            <ul className="space-y-4">
              {markets.map(m => (
                <li key={m.slug} className="border-l-2 pl-4">
                  <Link
                    to={`/vacation-rental-management/${m.slug}`}
                    className="font-medium underline"
                  >
                    Vacation rental management in {m.name}
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1">
                    {m.permitDetail.split(/(?<=\.)\s/)[0]}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="border-t pt-10">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-2">
            Not sure which rules apply to your address?
          </h2>
          <p className="text-muted-foreground mb-6">
            City limits and unincorporated county lines do not follow mailing addresses —
            a property addressed as Arroyo Grande or Paso Robles is often permitted by the
            County instead. Send us the address and we will tell you which jurisdiction
            governs it and whether it can be licensed.
          </p>
          <OwnerLeadForm subject="Property Management Inquiry — SLO County hub" />
          <p className="text-xs text-muted-foreground mt-6">
            Permit rules and tax rates change. Confirm current requirements with the
            relevant jurisdiction, or call{' '}
            <a href={CONTACT.phoneHref} className="underline">
              {CONTACT.phone}
            </a>
            .
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ManagementHub;
