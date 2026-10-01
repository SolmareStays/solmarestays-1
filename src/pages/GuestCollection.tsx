import { useParams, Link, Navigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { FaqSection } from '@/components/FaqSection';
import { EmailCapture } from '@/components/EmailCapture';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { useProperties } from '@/hooks/useProperties';
import { collectionBySlug } from '@/data/guestCollections';
import { Loader2 } from 'lucide-react';

const SITE_URL = 'https://www.solmarestays.com';

/**
 * Guest-intent landing pages: /cal-poly, /wine-country, /beachfront.
 *
 * ⚖ Content comes from src/data/guestCollections.ts, which also feeds the prerendered
 * HTML, so the static and hydrated versions cannot drift. See that file for why these
 * three intents justify a page and a page-per-town does not.
 *
 * Built from the site's own primitives — centred serif intro at text-4xl/5xl, alternating
 * bg-background / bg-secondary sections, the existing PropertyCard grid.
 */
const GuestCollectionPage = () => {
  const { data: properties = [], isLoading } = useProperties();
  const params = useParams();
  // The route is registered per slug, so derive it from the path rather than a param.
  const slug = window.location.pathname.replace(/^\/|\/$/g, '');
  const collection = collectionBySlug(params.collection ?? slug);

  if (!collection) return <Navigate to="/collection" replace />;

  const matched = properties.filter(p => {
    if (collection.match === 'all') return true;
    const loc = (p.location || '').toLowerCase();
    return collection.match === 'avila'
      ? loc.includes('avila')
      : loc.includes('arroyo');
  });

  const shown = collection.sortBySleeps
    ? [...matched].sort((a, b) => (b.sleeps || 0) - (a.sleeps || 0))
    : matched;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: collection.h1,
    description: collection.description,
    url: `${SITE_URL}/${collection.slug}`,
    about: collection.sections.map(s => s.h2),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: shown.length,
      itemListElement: shown.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: p.displayName,
        url: `${SITE_URL}/property/${p.slug}`,
      })),
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        /* absoluteTitle wins; `title` is required by the prop type and acts as the
           fallback. Both must equal the prerendered <title> or it flips on hydration. */
        title={collection.h1}
        absoluteTitle={collection.title}
        description={collection.description}
        schema={schema}
        breadcrumbs={[
          { name: 'Home', url: SITE_URL },
          { name: collection.h1, url: `${SITE_URL}/${collection.slug}` },
        ]}
      />
      <Header />

      <main>
        {/* Hero */}
        <section className="section-padding bg-secondary pt-32">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
                {collection.h1}
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {collection.lede}
              </p>
            </div>
          </div>
        </section>

        {/* Homes */}
        <section className="section-padding bg-background">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-4">
                {collection.gridHeading}
              </h2>
              <p className="text-muted-foreground text-lg">{collection.gridIntro}</p>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-7 h-7 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {shown.map((property, index) => (
                  <PropertyCard key={property.id} property={property} index={index} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* The content that earns the page */}
        <section className="section-padding bg-secondary">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-12">
              {collection.sections.map(section => (
                <div key={section.h2}>
                  <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-4">
                    {section.h2}
                  </h2>
                  {section.body.map(para => (
                    <p key={para.slice(0, 40)} className="text-muted-foreground leading-relaxed mb-4">
                      {para}
                    </p>
                  ))}
                </div>
              ))}

              <div className="pt-8 border-t border-border/50">
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
                  Keep reading
                </h2>
                <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
                  {collection.related.map(link => (
                    <li key={link.to}>
                      <Link to={link.to} className="underline text-muted-foreground hover:text-foreground">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <FaqSection route={`/${collection.slug}`} />
        <EmailCapture source={collection.slug} />
      </main>

      <Footer />
    </div>
  );
};

export default GuestCollectionPage;
