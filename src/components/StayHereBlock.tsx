import { Link } from 'react-router-dom';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { useProperties } from '@/hooks/useProperties';

/**
 * "Where to stay" block for guide pages.
 *
 * 🔴 Measured 2026-10-01: all ten blog posts carried 24-28 internal links and
 * ZERO links to a property page. A guide that never points at anything bookable
 * is a guide that cannot earn a booking — and property pages are the strongest
 * template on the site, so the guides were sending their authority nowhere useful.
 *
 * ⚖ Lives in the TEMPLATE rather than in the post bodies, because the bodies are
 * Sanity PortableText and editing ten of them by hand would drift the moment anyone
 * edits a post. One component fixes every current and future guide.
 *
 * `pick` selects by intent so the suggestion is relevant rather than random:
 * a wine-country guide should not lead with a studio bungalow.
 */
export function StayHereBlock({
  slug,
  heading = 'Where to stay',
  blurb = 'Whole homes on the Central Coast, booked direct — no platform service fee.',
  limit = 3,
}: {
  /** Blog slug, used to choose which homes are relevant. */
  slug: string;
  heading?: string;
  blurb?: string;
  limit?: number;
}) {
  const { data: properties = [] } = useProperties();
  if (properties.length === 0) return null;

  const byLocation = (needle: string) =>
    properties.filter(p => (p.location || '').toLowerCase().includes(needle));

  const bySleeps = (min: number) =>
    [...properties].filter(p => (p.sleeps || 0) >= min).sort((a, b) => (b.sleeps || 0) - (a.sleeps || 0));

  let picked = properties;
  if (/wine-country|edna/.test(slug)) picked = byLocation('arroyo');
  else if (/large-group|group/.test(slug)) picked = bySleeps(6);
  else if (/cal-poly/.test(slug)) picked = bySleeps(4);
  else if (/pet-friendly|dog/.test(slug)) {
    picked = properties.filter(p =>
      (p.amenities || []).some(a => /pet|dog/i.test(a)),
    );
  } else picked = byLocation('avila');

  const shown = (picked.length > 0 ? picked : properties).slice(0, limit);
  if (shown.length === 0) return null;

  return (
    <section className="section-padding bg-secondary">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-4">
            {heading}
          </h2>
          <p className="text-muted-foreground text-lg">{blurb}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {shown.map((property, index) => (
            <PropertyCard key={property.id} property={property} index={index} />
          ))}
        </div>

        <p className="text-center mt-10">
          <Link to="/collection" className="underline text-muted-foreground hover:text-foreground">
            Browse all {properties.length} homes
          </Link>
        </p>
      </div>
    </section>
  );
}
