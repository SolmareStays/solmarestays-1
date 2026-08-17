/**
 * Portfolio and review statistics — ONE source for the whole site.
 *
 * ⚠ Before this file existed the same statistic shipped six different ways:
 * ratingCount 746 (SEO.tsx), 842 + reviewCount 1564 (the prerender), "9.6/10 from
 * 1,500+ verified reviews" (ReviewsSection), ratingCount 2429 (Avila + Central Coast),
 * and a hardcoded 50 per property (PropertyDetail). Google saw three of them on the
 * same page. Import from here instead of typing a number into a template.
 *
 * Derived 2026-08-17 from the full Hostaway review corpus (3,124 records, paginated —
 * /reviews caps a page at 500 and DOES honour offset):
 *
 *   3,124 total records
 *   1,566 guest-to-host   ← the only ones that are "guest reviews"
 *   1,558 host-to-guest   ← Kyle reviewing guests. Never count these.
 *     842 guest-to-host AND carrying a numeric rating (all published)
 *   9.648/10 average over those 842  =  4.82 / 5
 *     730 rated exactly 10/10        ← the real "five-star" count
 *
 * 🔴 "1,500+ five-star reviews" was false: 1,566 is the TOTAL review count, and only
 * 730 are five-star. "1,500+ guest reviews" is true and says the same thing honestly.
 *
 * To refresh: POST /api/hostaway {"endpoint":"/reviews?limit=500&offset=N"}, walk the
 * offsets, keep type === 'guest-to-host', and count the ones with a numeric rating.
 */

export const REVIEWS = {
  /** Guest-to-host reviews, all statuses. The headline "reviews" number. */
  total: 1566,
  /** Guest-to-host reviews carrying a numeric rating — schema ratingCount. */
  rated: 842,
  /** Average of those 842, on the 5-point scale Google expects. */
  averageFive: '4.82',
  /** The same average as guests see it on Airbnb/Vrbo. */
  averageTen: '9.6',
  /** Rated exactly 10/10. The only number that may be called "five-star". */
  fiveStar: 730,
  /** Rounded, for prose. True: 1,566 ≥ 1,500. */
  totalRounded: '1,500+',
} as const;

export const PORTFOLIO = {
  /** Live Hostaway listings. Verified 13 'listed' on 2026-08-17. */
  properties: 13,
  avilaBeach: 10,
  arroyoGrande: 2,
  sanLuisObispo: 1,
} as const;

/**
 * Contact. ⚠ The footer used to link tel:+18058016429 — Kyle's personal cell — while
 * every schema block published the business line. Inconsistent NAP suppresses the
 * local pack, so both now come from here.
 */
export const CONTACT = {
  phone: '(805) 242-6411',
  phoneHref: 'tel:+18052426411',
  phoneSchema: '+1-805-242-6411',
  email: 'info@solmarestays.com',
} as const;
