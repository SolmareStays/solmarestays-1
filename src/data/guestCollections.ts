/**
 * Guest-intent landing pages — ONE source for both the React page and the prerender.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * WHY THESE THREE, AND WHY NOT A PAGE PER TOWN
 * ────────────────────────────────────────────────────────────────────────────
 * The owner side can justify a page per jurisdiction because the PERMIT RULES
 * genuinely differ in each one. The guest side cannot: we hold homes in Avila
 * Beach and Arroyo Grande only, so "vacation rentals in Morro Bay" would be a
 * page with nothing real behind it — a doorway page, and a misleading one.
 *
 * What does justify a page is an INTENT we can actually answer:
 *   /cal-poly    — recurring, dated, high-spend demand, and SLO city sells out
 *   /wine-country— we hold two wine-country homes including a 13-acre estate
 *   /beachfront  — ten homes a block or two from the sand is the core proposition
 *
 * 🔴 The test before adding a fourth: can you write 150 words that are true and
 * appear nowhere else on the site? If not, it belongs as a section on an
 * existing page, not as a new URL.
 *
 * ⚖ `guestCollections.generated.json` is emitted from this file at prebuild and
 * read by scripts/prerender.mjs, so the static HTML and the React page cannot
 * drift. That drift has already bitten twice on the owner pages.
 */

export interface GuestCollection {
  /** URL segment, e.g. /cal-poly */
  slug: string;
  /** <title> — written in full, passed to SEO as absoluteTitle. */
  title: string;
  description: string;
  h1: string;
  /** Hero paragraph. */
  lede: string;
  /** How to pick the homes shown on this page. */
  match: 'avila' | 'arroyoGrande' | 'all';
  /** Largest homes first, for group-led intents. */
  sortBySleeps: boolean;
  gridHeading: string;
  gridIntro: string;
  /** The content that makes this page worth existing. */
  sections: { h2: string; body: string[] }[];
  related: { to: string; label: string }[];
}

export const GUEST_COLLECTIONS: GuestCollection[] = [
  {
    slug: 'cal-poly',
    title: 'Where to Stay for Cal Poly Weekends | Solmaré Stays',
    description:
      'SLO sells out for Cal Poly graduation, move-in and parents weekend. Stay 20 minutes away in Avila Beach — whole homes sleeping 2 to 14, booked direct.',
    h1: 'Where to Stay for Cal Poly Weekends',
    lede:
      'Graduation, move-in, parents weekend and home football all empty San Luis Obispo at once. These are the most predictable sell-out dates on the Central Coast — and the reason most visiting families end up at the beach instead.',
    match: 'all',
    sortBySleeps: true,
    gridHeading: 'Whole homes, 20 minutes from campus',
    gridIntro:
      'Sleeping 2 to 14. Larger parties tend to book a single house rather than four hotel rooms, which is usually cheaper per person and a good deal less miserable.',
    sections: [
      {
        h2: 'Why San Luis Obispo sells out',
        body: [
          'Cal Poly has roughly 22,000 students, and on commencement weekend a large share of their families arrive at once into a city of about 47,000 people. SLO simply does not hold that much lodging. The same squeeze happens at September move-in and again at parents weekend.',
          'Rates inside the city climb hard on those dates and minimum stays appear. The practical consequence is that the decision is rarely "hotel or rental" — it is "book early, or stay further out".',
        ],
      },
      {
        h2: 'The twenty-minute trade',
        body: [
          'Avila Beach is about 20 minutes from the Cal Poly campus and 15 from downtown SLO — a straight run down Highway 101 and then the Avila Beach Drive turnoff, no mountain passes and no traffic to speak of outside summer weekends.',
          'What you get for those twenty minutes is a whole house instead of a room, parking you do not have to fight for, a kitchen for the morning of a ceremony, and a beach the rest of the family can disappear to while the graduate does their thing.',
          'We do not manage a property inside San Luis Obispo city, and we will say so plainly rather than pretend otherwise — the city only permits owner-occupied homestays, so whole-home rentals inside the city limits are not legal there at all.',
        ],
      },
      {
        h2: 'When these dates actually book',
        body: [
          'Commencement weekend is the earliest. Families routinely book it a year out, and the larger houses go first because there are fewer of them. Move-in weekend fills next, then parents weekend, then home football.',
          'If you are reading this inside three months of a Cal Poly weekend, go straight to whatever is still available rather than holding out for a particular house. If you are a year out, pick the house.',
        ],
      },
      {
        h2: 'Which house for which group',
        body: [
          'Two to four people — a bungalow or a one-bedroom is plenty, and it is the cheapest way to be close to the water.',
          'Five to six — a two-bedroom home gives the graduate somewhere to crash separately from their parents, which matters more than it sounds.',
          'Eight and up — one of the larger houses, or the Arroyo Grande estate, which sleeps 14 and is 25 minutes from campus. For a family travelling from several directions it is usually the simplest answer.',
        ],
      },
    ],
    related: [
      { to: '/blog/cal-poly-graduation-where-to-stay', label: 'Full Cal Poly weekend guide' },
      { to: '/san-luis-obispo', label: 'Staying near San Luis Obispo' },
      { to: '/group-stays', label: 'Homes for larger groups' },
      { to: '/collection', label: 'Browse every home' },
    ],
  },

  {
    slug: 'wine-country',
    title: 'Wine Country Vacation Rentals, Edna Valley | Solmaré Stays',
    description:
      'Whole-home rentals in the Edna and Arroyo Grande Valleys, including a private 13-acre estate sleeping 14. Tasting rooms minutes away. Book direct.',
    h1: 'Wine Country Rentals in the Edna & Arroyo Grande Valleys',
    lede:
      'The quieter half of Central Coast wine country. Edna Valley and the Arroyo Grande Valley sit between the ocean and the hills, twenty minutes from the beach and a world away from the Paso Robles crowds.',
    match: 'arroyoGrande',
    sortBySleeps: true,
    gridHeading: 'Our wine country homes',
    gridIntro:
      'Two properties in the valley, including a private estate that takes a whole party at once.',
    sections: [
      {
        h2: 'Edna Valley is not Paso Robles, and that is the point',
        body: [
          'Paso Robles has more than 200 wineries and the weekend traffic to match. The Edna Valley has a few dozen, most of them small, and you can generally walk into a tasting room on a Saturday without a reservation booked weeks ahead.',
          'The valley runs cool — fog pulls in off the ocean through the Los Osos and Edna gaps most mornings — which is why it does Chardonnay and Pinot Noir properly rather than the big reds Paso is known for. If you have done Paso and found it busy, this is the alternative.',
        ],
      },
      {
        h2: 'What is actually close',
        body: [
          'From the Arroyo Grande Valley you are roughly ten minutes from the Edna Valley tasting rooms, fifteen from the village of Arroyo Grande, twenty from Avila Beach and twenty-five from downtown San Luis Obispo.',
          'That combination is the reason people book out here rather than in a town: tasting in the afternoon, the beach the next morning, and somewhere quiet to come back to that is not a hotel corridor.',
        ],
      },
      {
        h2: 'Wine country works best for groups',
        body: [
          'A tasting trip is a group activity, and the economics follow. Our estate sits on 13 private acres and sleeps 14 across the main house and four casitas, with a solar-heated pool and a hot tub — so a party that would otherwise be spread across several hotels stays in one place.',
          'The farm cottage is the opposite end of the same idea: two bedrooms on a working farm, a creek, a hot tub, and fresh eggs. Good for two couples or a small family who want the valley without the scale.',
        ],
      },
      {
        h2: 'Getting around without driving',
        body: [
          'Tasting and driving do not mix, and the valley is spread out. Plan a driver, or book a local car service directly — we are happy to point you to the operators people here actually use, though you will book them yourself.',
          'Several Edna Valley tasting rooms are close enough together to walk between once you have parked, which is the easiest way to do an afternoon without moving the car twice.',
        ],
      },
    ],
    related: [
      { to: '/blog/wine-country-stays-edna-valley-arroyo-grande', label: 'Full Edna Valley guide' },
      { to: '/arroyo-grande', label: 'Arroyo Grande rentals' },
      { to: '/group-stays', label: 'Group and estate stays' },
      { to: '/experiences', label: 'What we can arrange for you' },
    ],
  },

  {
    slug: 'beachfront',
    title: 'Walk-to-the-Sand Vacation Rentals in Avila Beach | Solmaré Stays',
    description:
      'Ten homes in Avila Beach, most a block or two from the sand. A sheltered cove that stays sunny when the rest of the coast is fogged in. Book direct.',
    h1: 'Homes You Can Walk to the Beach From',
    lede:
      'Ten of our twelve houses are in Avila Beach, and most of them are a block or two from the sand. Close enough that the beach is where you go between things, not an expedition you plan.',
    match: 'avila',
    sortBySleeps: false,
    gridHeading: 'Avila Beach homes',
    gridIntro:
      'From studio bungalows to a two-bedroom house that sleeps six. Walking distance to the pier, the promenade and the tasting rooms.',
    sections: [
      {
        h2: 'Avila has its own weather, and it is the reason to come',
        body: [
          'Avila Beach sits in a sheltered cove that faces south rather than west — unusual on this coastline. The headland takes the brunt of the wind and the marine layer tends to burn off here earlier than it does a few miles away.',
          'In practice that means Avila is often sunny and still when Pismo Beach, ten minutes down the coast, is grey and blowing. It is the single biggest difference between the two towns and it does not show up in photographs.',
        ],
      },
      {
        h2: 'What "a block from the sand" means here',
        body: [
          'Avila is small — the whole village is walkable in about fifteen minutes end to end. From most of our homes the sand is a two to five minute walk, and the pier, the promenade, the waterfront restaurants and the tasting rooms are all inside that same radius.',
          'The practical version: you park the car when you arrive and you do not touch it again until you leave, unless you are driving out to the hot springs or up to San Luis Obispo.',
        ],
      },
      {
        h2: 'Parking is the thing nobody mentions',
        body: [
          'Avila gets busy on summer weekends and public parking fills by late morning. Every one of our homes comes with its own parking, which sounds mundane until you have circled the village for twenty minutes with a car full of beach gear.',
          'It is also why staying in Avila beats day-tripping to it. The people having the best time here walked out of their front door.',
        ],
      },
      {
        h2: 'Beyond the sand, on foot or close to it',
        body: [
          'The Bob Jones Trail runs flat and paved from the edge of the village up along San Luis Obispo Creek — easy on a bike, and we keep beach cruisers at several of the homes.',
          'Sycamore Mineral Springs is about eight minutes by car, with private hot tubs built into the hillside. Downtown San Luis Obispo is fifteen, and the Thursday night farmers market there is worth planning an evening around.',
        ],
      },
    ],
    related: [
      { to: '/avila-beach', label: 'Avila Beach guide' },
      { to: '/blog/avila-beach-vs-pismo-beach', label: 'Avila Beach vs Pismo Beach' },
      { to: '/blog/things-to-do-avila-beach', label: 'Things to do in Avila Beach' },
      { to: '/blog/avila-beach-hot-springs', label: 'The hot springs guide' },
    ],
  },
];

export function collectionBySlug(slug: string): GuestCollection | undefined {
  return GUEST_COLLECTIONS.find(c => c.slug === slug);
}
