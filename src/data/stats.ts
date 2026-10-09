/**
 * Portfolio and review statistics — ONE source for the whole site.
 *
 * ⚠ Before this file existed the same statistic shipped six different ways:
 * ratingCount 746 (SEO.tsx), 842 + reviewCount 1564 (the prerender), "9.6/10 from
 * 1,500+ verified reviews" (ReviewsSection), ratingCount 2429 (Avila + Central Coast),
 * and a hardcoded 50 per property (PropertyDetail). Google saw three of them on the
 * same page. Import from here instead of typing a number into a template.
 *
 * Re-derived 2026-10-09 from the full Hostaway review corpus (3,147 records,
 * paginated — /reviews caps a page at 500 and DOES honour offset):
 *
 *   3,147 total records
 *   1,577 guest-to-host   ← the only ones that are "guest reviews"
 *   1,570 host-to-guest   ← Kyle reviewing guests. Never count these.
 *     920 guest-to-host AND carrying a numeric rating (657 are rating: null)
 *   9.667/10 average over those 920  =  4.83 / 5
 *     802 rated exactly 10/10        ← the real "five-star" count
 *
 * ⚠ guest-to-host went 1,566 (8/17) → 1,604 (9/02) → 1,577 (today). It can go DOWN:
 * Monterey Heights left the portfolio on 2026-09-04 and its reviews left with it.
 * A smaller number here is not necessarily a bad measurement.
 *
 * 🔴 "1,500+ five-star reviews" was false: 1,577 is the TOTAL review count, and only
 * 802 are five-star. "1,500+ guest reviews" is true and says the same thing honestly.
 * 🔴 A null rating is "no star rating recorded", NOT a low score. Dividing fiveStar by
 * `total` rather than `rated` is how we once implied under half our reviews were good.
 *
 * To refresh: POST /api/hostaway {"endpoint":"/reviews?limit=500&offset=N"}, walk the
 * offsets, keep type === 'guest-to-host', and count the ones with a numeric rating.
 * (Or run lib/hostaway.get_all_reviews() in solmare-automation, which does the walk.)
 * ⚠ scripts/prerender.mjs recomputes all of this live at build time and overwrites its
 * own fallback — keep that fallback in sync with the values below, not with each other.
 */

export const REVIEWS = {
  /** Guest-to-host reviews, all statuses. The headline "reviews" number. */
  total: 1577,
  /** Guest-to-host reviews carrying a numeric rating — schema ratingCount. */
  rated: 920,
  /** Average of those 920, on the 5-point scale Google expects. */
  averageFive: '4.83',
  /** The same average as guests see it on Airbnb/Vrbo. */
  averageTen: '9.7',
  /** Rated exactly 10/10. The only number that may be called "five-star". */
  fiveStar: 802,
  /** Rounded, for prose. True: 1,577 ≥ 1,500. */
  totalRounded: '1,500+',
} as const;

export const PORTFOLIO = {
  /** Live Hostaway listings. Verified 12 'listed' on 2026-09-04 (Monterey Heights
   *  left the portfolio; it was the only San Luis Obispo *city* property). */
  properties: 12,
  avilaBeach: 10,
  arroyoGrande: 2,
  sanLuisObispo: 0,
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
