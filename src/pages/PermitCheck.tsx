import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { OwnerLeadForm } from '@/components/OwnerLeadForm';
import { PUBLISHED_MARKETS, PERMIT_LABEL, PERMITS_VERIFIED_AS_OF, type PermitStatus } from '@/data/markets';

const SITE_URL = 'https://www.solmarestays.com';

/**
 * /permit-check — landing page for the permit ads (Google AG3, Meta V1/V2/V4).
 *
 * The ad asks "what does your address allow?", so the page answers at county level
 * first (status per jurisdiction, straight from markets.ts) and then takes the
 * address, because eligibility is decided parcel by parcel. Same OwnerLeadForm as
 * /management, with its own subject so these leads are attributable.
 *
 * ⛔ No phone here: owner ads are form only (Kyle 10/26).
 */

const ORDER: PermitStatus[] = ['open', 'capped', 'emerging', 'frozen'];

const GROUP_NOTE: Record<PermitStatus, string> = {
  open: 'Permits are being issued. Whether your parcel qualifies still depends on the address.',
  capped: 'A hard cap is reached. New applications join a waiting list.',
  emerging: 'No dedicated ordinance yet. Expect the rules to change.',
  frozen: 'No new permits. Existing permit holders can keep operating.',
};

const PermitCheck = () => {
  const grouped = ORDER.map(status => ({
    status,
    markets: PUBLISHED_MARKETS.filter(m => m.permit === status),
  })).filter(g => g.markets.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        absoluteTitle="SLO County STR Permit Check — What Does Your Address Allow? | Solmaré Stays"
        description="Short-term rental permit status for every San Luis Obispo County jurisdiction, and a check on your own address. Kyle replies within 24 hours."
        breadcrumbs={[
          { name: 'Home', url: SITE_URL },
          { name: 'STR Permit Check', url: `${SITE_URL}/permit-check` },
        ]}
      />
      <Header />

      <main className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl pt-32 pb-20">
        <p className="text-xs tracking-[0.18em] uppercase text-muted-foreground mb-3">
          STR permit check · San Luis Obispo County
        </p>
        <h1 className="font-serif text-3xl md:text-5xl font-semibold leading-tight mb-5">
          What does your address allow?
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-2xl">
          Short-term rental rules change from one SLO County jurisdiction to the next, and the
          mailing address does not tell you which one governs. A home addressed as Arroyo Grande
          or Paso Robles is often permitted by the County instead.
        </p>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          Send the address and Kyle checks which rules apply and whether the property can be
          licensed. You hear back within 24 hours. No obligation.
        </p>
        <a
          href="#permit-form"
          className="inline-flex items-center rounded-md bg-primary text-primary-foreground px-6 h-12 font-medium mb-14"
        >
          Check my address
        </a>

        <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-6">
          Where permits stand today
        </h2>
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          {grouped.map(({ status, markets }) => (
            <section key={status} className="border rounded-md p-5">
              <h3 className="font-semibold mb-1">{PERMIT_LABEL[status]}</h3>
              <p className="text-sm text-muted-foreground mb-3">{GROUP_NOTE[status]}</p>
              <ul className="text-sm space-y-1">
                {markets.map(m => (
                  <li key={m.slug}>
                    <Link to={`/vacation-rental-management/${m.slug}`} className="underline">
                      {m.name}
                    </Link>
                    <span className="text-muted-foreground">
                      {' '}· {m.unincorporated ? 'SLO County' : m.jurisdiction.replace(/^City of /, '')}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mb-14 max-w-2xl">
          Open does not mean every parcel qualifies. Avila Beach, for example, has a minimum
          distance between vacation rentals, and inland the County does not allow one in an ADU
          or guest house. That is why we check the address, not just the town.
        </p>

        <section className="border-t pt-10 mb-14 max-w-2xl">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-3">
            Already have a permit?
          </h2>
          <p className="text-muted-foreground mb-3">
            Keep your permit and we run the home under it: listing, pricing, guests, cleaning
            and repairs, with an owner portal and monthly statements. In Pismo Beach's residential
            neighbourhoods an existing licence cannot currently be replaced, so running it well and
            never missing a renewal is the whole job.
          </p>
          <p className="text-foreground font-medium mb-1">
            New owners: your first month of management is free.
          </p>
          <p className="text-muted-foreground">
            Plans from 10%, full service typically 18% of net rental revenue, not a cut of the
            gross. 30 days notice, no long-term contract.
          </p>
        </section>

        <section id="permit-form" className="border-t pt-10 scroll-mt-28">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-2">
            Check your address
          </h2>
          <p className="text-muted-foreground mb-6">
            Street address please, not just the town. Kyle replies within 24 hours.
          </p>
          <OwnerLeadForm subject="Permit Check — /permit-check" submitLabel="Check My Address" />
          <p className="text-xs text-muted-foreground mt-6">
            Permit status as of {PERMITS_VERIFIED_AS_OF}, read from each jurisdiction's own code
            and permit pages. Rules change; confirm current requirements with the jurisdiction
            before you buy or apply.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PermitCheck;
