import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { REVIEWS, PORTFOLIO, CONTACT } from '@/data/stats';

/**
 * Alias routes → the URL that should own the ranking.
 *
 * ⚠ App.tsx serves four legacy paths from the same components as their primaries.
 * `canonical` was built as SITE_URL + location.pathname, so every alias pointed at
 * itself and competed with the page it duplicates. Anything not listed here
 * self-canonicalises, which is correct for a real page.
 */
const CANONICAL_ALIASES: Record<string, string> = {
  '/why-choose-us': '/philosophy',
  '/for-homeowners': '/management',
  '/guest-experience': '/experiences',
  '/services': '/experiences',
};

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SEOProps {
  title: string;
  /**
   * Use the string verbatim instead of appending " | Solmaré Stays".
   *
   * ⚠ Needed because scripts/prerender.mjs writes the real <title> into the static
   * HTML and React then overwrote it on hydration with a different string — the tab
   * title visibly changed on every page. Worse, the homepage re-took
   * "Avila Beach Vacation Rentals | Solmaré Stays", which is /avila-beach's title and
   * exactly the cannibalisation the 2026-08-13 SEO pass removed. Any page whose
   * prerender title is not `<title> | Solmaré Stays` must pass it here.
   */
  absoluteTitle?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
  schema?: Record<string, any>;
  breadcrumbs?: BreadcrumbItem[];
}

const SITE_URL = 'https://www.solmarestays.com';

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Solmaré Stays',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: `Professional vacation rental management on California's Central Coast. ${PORTFOLIO.properties} properties across Avila Beach and Arroyo Grande. ${REVIEWS.totalRounded} guest reviews averaging ${REVIEWS.averageFive} out of 5.`,
  telephone: CONTACT.phoneSchema,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Avila Beach',
    addressRegion: 'CA',
    postalCode: '93424',
    addressCountry: 'US',
  },
  areaServed: [
    { '@type': 'City', name: 'Avila Beach' },
    { '@type': 'City', name: 'Pismo Beach' },
    { '@type': 'City', name: 'Shell Beach' },
    { '@type': 'City', name: 'Arroyo Grande' },
    { '@type': 'City', name: 'San Luis Obispo' },
    { '@type': 'City', name: 'Grover Beach' },
    { '@type': 'City', name: 'Oceano' },
  ],
  sameAs: [
    'https://www.instagram.com/solmarestays',
    'https://www.facebook.com/solmarestays',
    'https://www.tiktok.com/@solmarestays',
    'https://www.linkedin.com/in/kyle-van-til',
  ],
};

const lodgingBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: 'Solmaré Stays',
  url: SITE_URL,
  telephone: CONTACT.phoneSchema,
  description:
    `Professional vacation rental management on California's Central Coast. ${PORTFOLIO.properties} properties in Avila Beach and Arroyo Grande. From beach bungalows to a wine country estate. ${REVIEWS.totalRounded} guest reviews averaging ${REVIEWS.averageFive} out of 5. Book direct for the best rates.`,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Avila Beach',
    addressRegion: 'CA',
    postalCode: '93424',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 35.1803,
    longitude: -120.7314,
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: REVIEWS.averageFive,
    ratingCount: String(REVIEWS.rated),
    bestRating: '5',
    worstRating: '1',
  },
  priceRange: '$140 - $4,000',
  numberOfRooms: PORTFOLIO.properties,
  checkinTime: '15:00',
  checkoutTime: '11:00',
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Free WiFi', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Free Parking', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Air Conditioning', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Kitchen', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Washer/Dryer', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Pet Friendly', value: true },
  ],
};

const webSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Solmaré Stays',
  url: SITE_URL,
  description:
    `Vacation rentals on California's Central Coast. ${PORTFOLIO.properties} properties in Avila Beach and Arroyo Grande. From beach bungalows to a wine country estate. Book direct for the best rates.`,
  publisher: {
    '@type': 'Organization',
    name: 'Solmaré Stays',
  },
};

function buildBreadcrumbSchema(breadcrumbs: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function SEO({ title, absoluteTitle, description, image, type = 'website', schema, breadcrumbs }: SEOProps) {
  const location = useLocation();
  const siteTitle = 'Solmaré Stays';
  const fullTitle = absoluteTitle ?? `${title} | ${siteTitle}`;
  const defaultDescription = `Refined vacation rentals in Avila Beach, Pismo Beach & SLO. ${REVIEWS.totalRounded} guest reviews averaging ${REVIEWS.averageFive} out of 5. Book direct for the best rates.`;

  // Construct canonical URL safely — aliases point at the page they duplicate.
  const canonicalPath = CANONICAL_ALIASES[location.pathname] ?? location.pathname;
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;

  const isHomepage = location.pathname === '/' || location.pathname === '';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:url" content={canonicalUrl} />
      {image && <meta property="og:image" content={image} />}
      {image && <meta property="og:image:width" content="1200" />}
      {image && <meta property="og:image:height" content="630" />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      {image && <meta name="twitter:image" content={image} />}

      {/* Organization Schema — always present */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>

      {/* LodgingBusiness Schema — always present */}
      <script type="application/ld+json">
        {JSON.stringify(lodgingBusinessSchema)}
      </script>

      {/* WebSite Schema — homepage only */}
      {isHomepage && (
        <script type="application/ld+json">
          {JSON.stringify(webSiteSchema)}
        </script>
      )}

      {/* BreadcrumbList Schema — when breadcrumbs prop provided */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify(buildBreadcrumbSchema(breadcrumbs))}
        </script>
      )}

      {/* Page-specific Structured Data (JSON-LD) */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
