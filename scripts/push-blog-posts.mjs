/**
 * One-source blog publisher for solmarestays.com
 *
 * Each post is authored ONCE in markdown-lite below. The script converts it to:
 *   1. Sanity portable text  -> createOrReplace into the production dataset
 *      (deterministic _id per slug, so re-runs update rather than duplicate)
 *   2. Crawler HTML          -> written to ./html-out/<slug>.html for pasting
 *      into scripts/prerender.mjs PAGES entries
 *
 * Markdown-lite grammar: "## " h2, "### " h3, "- " bullet, blank line separates
 * blocks, **bold**, _em_, [text](href). Nothing else.
 *
 * Usage: node push-posts.mjs [--dry]   (--dry skips the Sanity write)
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const OUT = join(tmpdir(), 'solmare-blog-html');
mkdirSync(OUT, { recursive: true });

// ── Read Sanity token from the repo's .env.local ─────────────────────────────
const envFile = readFileSync('/Users/aihost/solmarestays-1/.env.local', 'utf-8');
const token = envFile.split('\n').find(l => l.startsWith('SANITY_API_TOKEN='))?.split('=')[1]?.trim().replace(/^["']|["']$/g, '');
if (!token) { console.error('No SANITY_API_TOKEN found'); process.exit(1); }
const PROJECT = 'mggny2hi';
const DATASET = 'production';

let keyCounter = 0;
const key = () => 'k' + (++keyCounter).toString(36).padStart(6, '0');

// ── Inline markdown (bold / em / links) → portable text children + markDefs ──
function parseInline(text) {
  const children = [];
  const markDefs = [];
  // Tokenize: links first, then bold, then em
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|_([^_]+)_/g;
  let last = 0, m;
  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) children.push({ _type: 'span', _key: key(), text: text.slice(last, m.index), marks: [] });
    if (m[1] !== undefined) {
      const defKey = key();
      markDefs.push({ _type: 'link', _key: defKey, href: m[2] });
      children.push({ _type: 'span', _key: key(), text: m[1], marks: [defKey] });
    } else if (m[3] !== undefined) {
      children.push({ _type: 'span', _key: key(), text: m[3], marks: ['strong'] });
    } else {
      children.push({ _type: 'span', _key: key(), text: m[4], marks: ['em'] });
    }
    last = pattern.lastIndex;
  }
  if (last < text.length) children.push({ _type: 'span', _key: key(), text: text.slice(last), marks: [] });
  if (children.length === 0) children.push({ _type: 'span', _key: key(), text: '', marks: [] });
  return { children, markDefs };
}

function toPortableText(md) {
  const blocks = [];
  for (const raw of md.split('\n')) {
    const line = raw.trimEnd();
    if (!line.trim()) continue;
    let style = 'normal', listItem, text = line;
    if (line.startsWith('## ')) { style = 'h2'; text = line.slice(3); }
    else if (line.startsWith('### ')) { style = 'h3'; text = line.slice(4); }
    else if (line.startsWith('- ')) { listItem = 'bullet'; text = line.slice(2); }
    const { children, markDefs } = parseInline(text);
    const block = { _type: 'block', _key: key(), style, children, markDefs };
    if (listItem) { block.listItem = listItem; block.level = 1; }
    blocks.push(block);
  }
  return blocks;
}

function inlineHtml(text) {
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/_([^_]+)_/g, '<em>$1</em>');
}

function toHtml(md) {
  const out = [];
  let inList = false;
  for (const raw of md.split('\n')) {
    const line = raw.trimEnd();
    if (!line.trim()) continue;
    const isBullet = line.startsWith('- ');
    if (inList && !isBullet) { out.push('</ul>'); inList = false; }
    if (line.startsWith('## ')) out.push(`<h2>${inlineHtml(line.slice(3))}</h2>`);
    else if (line.startsWith('### ')) out.push(`<h3>${inlineHtml(line.slice(4))}</h3>`);
    else if (isBullet) {
      if (!inList) { out.push('<ul>'); inList = true; }
      out.push(`<li>${inlineHtml(line.slice(2))}</li>`);
    } else out.push(`<p>${inlineHtml(line)}</p>`);
  }
  if (inList) out.push('</ul>');
  return out.join('\n');
}

// ═════════════════════════════════════════════════════════════════════════════
// POSTS — the 5 already-prerendered posts (Sanity versions so humans see them)
// plus 5 new bottom-funnel posts.
// ═════════════════════════════════════════════════════════════════════════════

const POSTS = [
  // ── EXISTING 5 (content mirrors scripts/prerender.mjs crawler layer) ──────
  {
    slug: 'best-restaurants-avila-beach',
    title: "Best Restaurants in Avila Beach — A Local's Guide",
    seoTitle: "Best Restaurants in Avila Beach — A Local's Guide (2026)",
    seoDescription: 'The best restaurants in Avila Beach, CA ranked by a local. From seafood on the pier to hidden wine bars. Updated for 2026 with menus, prices, and reservation tips.',
    excerpt: 'The best restaurants in Avila Beach, ranked by the team that lives here and eats at these spots weekly. Seafood on the pier, farm-to-table date nights, and the Friday market.',
    publishedAt: '2026-06-05T10:00:00Z',
    categories: ['local-guide'],
    isNew: false,
    body: `
_Updated June 2026 by the Solmaré Stays team. We live and work in Avila Beach and eat at these spots weekly._

Avila Beach may be a small town, but the dining scene punches well above its weight. From fresh-off-the-boat seafood to a quiet wine tasting with ocean views, these are the spots we actually send guests to.

## 1. Custom House: Best Overall

Right on the promenade with ocean views from every table. The fish tacos and clam chowder are the move. Reservations recommended on weekends. Open for lunch and dinner daily.

## 2. Mersea's: Best Seafood

Casual counter-service spot at the end of the pier. The fish and chips are some of the best on the Central Coast. Grab a table outside and watch the surfers. Cash-friendly prices.

## 3. Gardens of Avila: Best Date Night

Tucked inside the Sycamore Mineral Springs resort, this is the fancy one. Farm-to-table menu, excellent wine list focused on local Edna Valley producers. Ask for the garden patio at sunset.

## 4. Blue Moon Over Avila: Best Bar & Apps

Lively bar scene with solid appetizers and craft cocktails. Live music on weekends. Great for a casual night out after a beach day.

## 5. Mr. Rick's: Best Waterfront Drinks

The original Avila Beach bar. Nothing fancy, but the deck overlooking the harbor is unbeatable for sunset drinks. Classic California dive bar energy.

## 6. Avila Beach Farmers Market (Fridays)

Not a restaurant, but the Friday afternoon farmers market on the promenade is an Avila institution. Fresh produce, local honey, tri-tip sandwiches, live music, and a crowd that feels like the whole town showed up. 4-8 PM every Friday, year-round.

## Wine Tasting in Avila Beach

Several tasting rooms are walkable from our vacation rentals: Alapay Cellars, Peloton Cellars, and Sinor-LaVallee are all within a 5-minute walk. For a bigger wine experience, Edna Valley and Arroyo Grande Valley wineries are a 10-minute drive.

## Where to Stay

All of our [Avila Beach vacation rentals](/avila-beach) are within walking distance of every restaurant on this list. [Browse all 13 properties](/collection) or [contact us](/contact) for recommendations based on your group size.
`,
  },
  {
    slug: 'avila-beach-vs-pismo-beach',
    title: 'Avila Beach vs Pismo Beach — Where Should You Stay?',
    seoTitle: 'Avila Beach vs Pismo Beach — Where Should You Stay?',
    seoDescription: "Avila Beach vs Pismo Beach: which is better for your vacation? Compare beaches, restaurants, vibe, and accommodation. A local's honest comparison.",
    excerpt: "Both towns are 10 minutes apart on California's Central Coast. A local's honest comparison of beaches, restaurants, weather, and vibe to help you decide.",
    publishedAt: '2026-05-20T10:00:00Z',
    categories: ['travel-tips'],
    isNew: false,
    body: `
_Both towns are 10 minutes apart on California's Central Coast. Here's how to decide which one is right for your trip._

## The Quick Answer

**Choose Avila Beach** if you want: a quieter, more intimate beach town. Walkable restaurants and wine tasting. A sheltered bay with calm water perfect for families, kayaking, and paddleboarding. More sunshine, too: Avila sits in a sun pocket and often runs 10 degrees warmer than Pismo.

**Choose Pismo Beach** if you want: a bigger town feel with more shops and nightlife. Direct access to Oceano Dunes for ATVing. A classic California pier town vibe. More hotel options.

## Beach Comparison

**Avila Beach:** Sheltered bay, calm water, south-facing (maximum sun). Wide sandy beach with a gentle slope, great for kids. The pier is walkable from downtown. Less crowded than Pismo, even in summer.

**Pismo Beach:** Open coast, bigger waves, more dramatic. The famous Pismo Pier stretches 1,200 feet into the ocean. Oceano Dunes (the only California beach you can drive on) is at the south end. More exposed to wind and fog.

## Restaurants & Nightlife

**Avila Beach:** Smaller but curated. Custom House, Mersea's, Gardens of Avila, and several wine tasting rooms all within walking distance. Friday farmers market is legendary. Quieter at night.

**Pismo Beach:** More options overall. Ventana Grill, Splash Café (famous clam chowder), Giuseppe's, and a larger bar scene on Price Street. Premium Outlets for shopping.

## For Families

Avila Beach wins for families. The calm, sheltered bay is safer for young kids. Everything is walkable. The Bob Jones Trail is a flat, paved bike path perfect for family rides. Avila Beach Golf Resort has mini golf.

## For Couples

Avila Beach wins again. Gardens of Avila for dinner, wine tasting walkable from your rental, sunset from the pier, then hot springs at Sycamore Mineral Springs. More romantic, less commercial.

## The Best of Both

Stay in Avila Beach, day-trip to Pismo. They're 10 minutes apart. You get the quiet home base with easy access to Pismo's pier, shopping, and dunes whenever you want it.

[Browse our Avila Beach vacation rentals](/avila-beach). All of them are within walking distance of the beach, restaurants, and wine tasting.
`,
  },
  {
    slug: 'things-to-do-avila-beach',
    title: 'Things to Do in Avila Beach — The Complete Guide',
    seoTitle: 'Things to Do in Avila Beach — The Complete Guide (2026)',
    seoDescription: 'The complete guide to things to do in Avila Beach, CA. Beaches, hiking, wine tasting, hot springs, kayaking, and local favorites from the team that lives here.',
    excerpt: 'Everything worth doing in Avila Beach, from a team that lives here year-round: beaches, kayaking, the Bob Jones Trail, wine tasting, hot springs, and the lighthouse.',
    publishedAt: '2026-06-18T10:00:00Z',
    categories: ['local-guide'],
    isNew: false,
    body: `
_Everything worth doing in Avila Beach, from a team that lives here year-round. Updated for 2026._

## Beach & Water Activities

### Swimming & Sunbathing

Avila Beach's sheltered bay offers the calmest, warmest water on the Central Coast. The south-facing beach gets sun all day. Lifeguards on duty in summer.

### Kayaking & Paddleboarding

Rent kayaks and SUPs from Avila Beach Paddlesports right on the sand. Paddle to the sea caves at Point San Luis or just cruise the calm bay. Morning sessions are glassiest.

### Fishing from the Pier

Avila Beach Pier is free to fish. No license needed for pier fishing in California. Perch, halibut, and rockfish are common catches.

## Hiking & Outdoors

### Bob Jones Trail

A flat, paved 3-mile trail along San Luis Obispo Creek. Perfect for biking, jogging, or a family walk. Connects Avila Beach to the Ontario Road trailhead. Shaded and scenic.

### Pecho Coast Trail

A 3.7-mile one-way hike along the bluffs to Point San Luis Lighthouse, with ocean views the entire way. Whale watching in winter. The docent-led tours sell out, so book ahead.

### Pirate's Cove

A short hike down to one of the Central Coast's most scenic (and clothing-optional) beaches. Dramatic cliffs, tide pools, and sea caves. The trailhead is on Cave Landing Road.

## Wine Tasting

Avila Beach has several walkable tasting rooms: Alapay Cellars, Peloton Cellars, Sinor-LaVallee. For a bigger wine day, drive 10 minutes to Edna Valley (Tolosa, Chamisal, Baileyana) or Arroyo Grande Valley (Talley, Laetitia, Timbre).

## Hot Springs

Sycamore Mineral Springs Resort offers private hillside hot tubs fed by natural mineral springs. Book a 1-hour soak ($20-25/person) and follow it with dinner at Gardens of Avila next door. One of the most unique experiences on the Central Coast.

## Point San Luis Lighthouse

A historic 1890 lighthouse accessible only by guided hike or boat. Trolley rides available for those who can't hike. Tours run Wednesdays and Saturdays; book at pointsanluislighthouse.org.

## Where to Stay

Our [Avila Beach vacation rentals](/avila-beach) put you walking distance from the beach, pier, restaurants, and wine tasting. [Browse all properties](/collection).
`,
  },
  {
    slug: 'pet-friendly-vacation-rentals-avila-beach',
    title: 'Pet-Friendly Vacation Rentals in Avila Beach',
    seoTitle: 'Pet-Friendly Vacation Rentals in Avila Beach (2026)',
    seoDescription: 'The best pet-friendly vacation rentals in Avila Beach, CA. Bring your dog to the coast. Dog-friendly beaches, trails, restaurants, and accommodations.',
    excerpt: "Traveling with your dog? Everything you need to know about bringing your pup to Avila Beach: pet-friendly rentals, beaches, trails, and patios.",
    publishedAt: '2026-07-02T10:00:00Z',
    categories: ['travel-tips'],
    isNew: false,
    body: `
_Traveling with your dog? Here's everything you need to know about bringing your pup to Avila Beach._

## Our Pet-Friendly Rentals

Solmaré Stays offers pet-friendly vacation rentals in Avila Beach that welcome dogs:

- **The Palm House**: King studio with ocean peeks and a private balcony. Fenced area nearby.
- **The Pine House**: Queen studio with balcony views. Walking distance to the beach.
- **Wine Country Estate (Arroyo Grande)**: 13-acre private estate with room to roam. Dogs welcome with approval.

Pet fees vary by property. [See all pet-friendly properties](/pet-friendly) or [contact us](/contact) with questions about your specific pet.

## Dog-Friendly Beaches

### Avila Beach (Leashed)

Dogs are welcome on Avila Beach on a leash. Early morning and evening are the best times: fewer crowds, cooler sand, and more space for your dog to run.

### Pirate's Cove (Off-Leash Friendly)

While not officially off-leash, Pirate's Cove is a more relaxed beach where dogs commonly run free. It's a short hike down from Cave Landing Road. Beautiful cliffs and tide pools.

### Shell Beach / Dinosaur Caves Park

Just 10 minutes south. Dogs on leash in the park, with grassy areas, benches, and ocean views. Great for a morning walk.

## Dog-Friendly Trails

**Bob Jones Trail** is flat and shaded, dogs on leash. **Ontario Ridge Trail** is more of a climb, also leashed, with great views. Both start within minutes of our properties.

## Dog-Friendly Dining

Most Avila Beach restaurants have outdoor patios that welcome dogs: Custom House, Blue Moon, Mr. Rick's, and the Friday Farmers Market are all dog-friendly.

## Tips for Visiting with Dogs

- Bring water and a portable bowl (the sand gets hot)
- Clean up after your dog (bags available at most trail heads)
- Check tide schedules before beach walks
- The Friday Farmers Market can overwhelm anxious dogs, so go early

[Book a pet-friendly rental](/pet-friendly). Your dog deserves a vacation too.
`,
  },
  {
    slug: 'avila-beach-property-management',
    title: 'Vacation Rental Property Management in Avila Beach',
    seoTitle: 'Vacation Rental Property Management in Avila Beach, CA',
    seoDescription: "Thinking about hiring a property manager for your Avila Beach vacation rental? Here's what professional management looks like and what it costs.",
    excerpt: "If you own a vacation rental on the Central Coast and you're doing everything yourself, here's what it looks like when a professional takes over, and what it costs.",
    publishedAt: '2026-07-15T10:00:00Z',
    categories: ['for-owners'],
    isNew: false,
    body: `
_If you own a vacation rental on the Central Coast and you're doing everything yourself (pricing, guest messages, cleaning coordination, maintenance), here's what it looks like when a professional takes over._

## Self-Managing vs Professional Management

Most Avila Beach owners start by self-managing their rental. It works at first. Then the 2 AM guest messages, the double-bookings, the cleaning no-shows, and the bad reviews start adding up. The math changes.

- **Occupancy:** self-managed rentals typically run 35-42%. Our portfolio runs 51%.
- **Guest rating:** self-managed averages 4.5-4.7/5. Ours is 4.8/5 (9.6/10) across 1,500+ reviews.
- **Response time:** hours vs minutes. Our team is local, not a call center.
- **Pricing:** fixed or manual vs dynamic daily pricing powered by PriceLabs.
- **Channels:** Airbnb-only vs Airbnb + VRBO + Google + direct booking.
- **Your time:** 10-20 hours a week vs zero.

## What's Included

- **Listing optimization**: professional photos, search-optimized descriptions, strategic pricing
- **Dynamic pricing**: PriceLabs adjusts your rates daily based on demand, events, and market data
- **Multi-channel distribution**: Airbnb, VRBO, Google Vacation Rentals, and our direct booking website
- **24/7 guest communication**: a local team on call, not an overseas call centre
- **Professional cleaning**: 50-point checklist, hotel-quality linens, restocking
- **Maintenance coordination**: proactive inspections, vendor management, emergency response
- **Owner reporting**: weekly performance reports, monthly financial statements

## The Avila Beach Market

Avila Beach has unique dynamics: extreme seasonality (peak summer vs. quiet winter), event-driven demand (Cal Poly, wine festivals), and a small inventory that rewards quality. The market average occupancy is around 40%, and a professionally managed property that runs 10+ points above that is the difference between a property that covers its mortgage and one that generates real income.

## What It Costs

Management fees on the Central Coast typically range from 15-25% of gross revenue. The fee pays for itself when professional management increases your occupancy and ADR enough to more than offset the commission. Most owners we work with see a net revenue increase even after our fee.

## Is It Right for You?

If you own a vacation rental in Avila Beach, Pismo Beach, Shell Beach, San Luis Obispo, or Arroyo Grande, we'd love to show you what your property could be earning. No pressure. We start with a free market analysis and revenue projection.

[Learn more about our management services](/management) or [get in touch](/contact). Call Kyle directly at (805) 242-6411.
`,
  },

  // ── NEW 5 — bottom-funnel buildout, 2026-08-13 ────────────────────────────
  {
    slug: 'cal-poly-graduation-where-to-stay',
    title: 'Where to Stay for Cal Poly Graduation & Parents Weekend',
    seoTitle: 'Where to Stay for Cal Poly Graduation Weekend (SLO)',
    seoDescription: 'Visiting Cal Poly for graduation, move-in, or Open House? Where to stay in San Luis Obispo and Avila Beach, when to book, and how to beat hotel price spikes.',
    excerpt: 'Cal Poly weekends sell out San Luis Obispo months ahead. When to book, where to stay, and why a vacation rental 15 minutes away often beats a marked-up hotel.',
    publishedAt: '2026-08-13T10:00:00Z',
    categories: ['travel-tips'],
    isNew: false,
    body: `
_If you're visiting Cal Poly for graduation, move-in weekend, Open House, or a campus tour, here's the honest local guide to where to stay, and when to book before everything sells out._

## The Problem: SLO Sells Out on Cal Poly Weekends

San Luis Obispo is a small city with limited hotel inventory, and Cal Poly weekends (spring commencement in June, fall commencement in December, Open House in spring, move-in in September) reliably sell the whole town out. Hotels that normally charge $150 a night list at $400+ with two-night minimums, and the closest ones go first.

The families who have done this before book months ahead. If your student just told you a date, book your lodging this week.

## Option 1: Stay Walking Distance from Campus

Our **Monterey Heights Suite** is a 2-bedroom, 1-bath suite that sleeps 4, with a private patio and kitchenette, within walking distance of both Cal Poly and downtown San Luis Obispo. For a graduation weekend that means: no fighting for campus parking, walk to the ceremony, walk downtown for the celebration dinner, and a real kitchen for the morning of.

It starts around $140 a night in normal season. [Check dates and pricing here](/san-luis-obispo).

## Option 2: Stay at the Beach, Drive 20 Minutes

Here's the local secret: **Avila Beach is about 20 minutes from campus.** Families who book our [Avila Beach vacation rentals](/avila-beach) get a beach vacation wrapped around the ceremony: morning on the sand, afternoon at commencement, dinner on the promenade. For multi-day trips (move-in especially), the beach base is the better trip.

Most of our 10 Avila Beach properties are 1-2 blocks from the sand, ranging from couples studios to two-bedroom beach houses.

## Option 3: Bring the Whole Family

Graduations pull grandparents, siblings, and partners into one trip. For big family groups, our **Wine Country Estate** in Arroyo Grande sleeps 14 across a private 13-acre property with a pool and hot tub, about 20 minutes from campus. One house, one kitchen, one celebration, instead of coordinating four hotel rooms. [See group options](/group-stays).

## When to Book

- **Spring commencement (June):** book by February. This is the single most compressed weekend of the year in SLO.
- **Fall commencement (December):** book by October.
- **Move-in (September):** book by July.
- **Open House / campus tours (spring):** book 6-8 weeks out.

## Why Book Direct

Booking directly at [solmarestays.com](/collection) costs less than the same property on Airbnb or Vrbo because there's no platform service fee. And you're dealing with a local team that answers in minutes if anything comes up on your weekend. [Contact us](/contact) or call (805) 242-6411 if you want a recommendation for your group size.
`,
  },
  {
    slug: 'large-group-vacation-rentals-central-coast',
    title: 'Large Group Vacation Rentals on the Central Coast (Sleeps 10-14+)',
    seoTitle: 'Large Group Vacation Rentals — Central Coast, CA',
    seoDescription: 'Vacation rentals for large groups on the California Central Coast. A private 13-acre estate sleeping 14, and side-by-side Avila Beach bungalows for reunions and retreats.',
    excerpt: 'Planning a reunion, retreat, or milestone birthday for 10-14+ people? The two ways to house a big group on the Central Coast: one estate or a beach compound.',
    publishedAt: '2026-08-13T10:00:00Z',
    categories: ['travel-tips'],
    isNew: false,
    body: `
_Family reunion, milestone birthday, company retreat, wedding weekend: housing 10 to 14+ people on the Central Coast comes down to two good options. Here's how to choose._

## The Two Ways to House a Big Group

Most vacation rentals sleep 4-8, so groups usually face a bad choice: split across hotel rooms and lose the shared-house feeling, or squeeze into a place that's too small. On the Central Coast there are two better answers.

## Option 1: One Private Estate That Sleeps 14

Our **Wine Country Estate** in Arroyo Grande is a private 13-acre property with a main house and 4 guest casitas, 5 bedrooms and 5 bathrooms in total, sleeping 14. It comes with a solar-heated pool, a hot tub, a bocce court, and walking trails. It's booked as a whole estate only, so your group never shares the grounds with strangers.

What it's good for:

- **Family reunions**: separate casitas mean grandparents, couples, and kids each get privacy, then everyone gathers at the main house.
- **Small weddings and celebrations**: event use is possible with advance approval. Tell us what you're planning when you enquire.
- **Company retreats**: space to work, space to unwind, 10 minutes from downtown SLO.

Talley, Laetitia, Timbre, and the Edna Valley wineries are minutes away, and Pismo Beach is 15 minutes by car. [See the Arroyo Grande estate](/arroyo-grande).

## Option 2: A Beach Compound of Side-by-Side Bungalows in Avila Beach

Several of our Avila Beach properties sit within the same compound, so larger groups can book multiple bungalows side by side and effectively take over a private cluster **1-2 blocks from the sand**. Everyone gets their own front door; the beach, pier, and restaurants are a 2-minute walk.

This is the move for groups that want the beach-town experience (morning coffee on the promenade, kayaking in the calm bay, the Friday farmers market) with the togetherness of shared walls. [Tell us your dates and headcount](/contact) and we'll check which combination of bungalows is open.

## How to Decide

- **Want privacy, a pool, and one big table?** The estate.
- **Want to walk to the beach and restaurants?** The Avila compound.
- **Group bigger than 14?** Combine. Some groups book the estate for the core family and Avila bungalows for the overflow; the two are 25 minutes apart.

## Book Early: Big Inventory Is Scarce

Properties that sleep 10+ are the scarcest inventory on the Central Coast. Summer weekends and holiday weeks at the estate book out months ahead. [Start with our group stays page](/group-stays), or call (805) 242-6411 and we'll help you plan it.
`,
  },
  {
    slug: 'avila-beach-hot-springs',
    title: 'Avila Beach Hot Springs — The Complete Guide',
    seoTitle: 'Avila Beach Hot Springs Guide — Sycamore & Beyond',
    seoDescription: 'The complete guide to hot springs in Avila Beach, CA: Sycamore Mineral Springs private hillside tubs, Avila Hot Springs, prices, tips, and how to book.',
    excerpt: "Avila Beach sits on natural mineral springs. It's one of the few California beach towns where you can soak in a hillside hot tub after a beach day. Here's the guide.",
    publishedAt: '2026-08-13T10:00:00Z',
    categories: ['local-guide'],
    isNew: false,
    body: `
_Avila Beach sits on top of natural mineral springs. It's one of the few beach towns in California where you can follow a day on the sand with a soak in a hillside hot tub. Here's how to do it right._

## Sycamore Mineral Springs Resort

The signature experience. Sycamore's private open-air hot tubs are terraced up a wooded hillside along Avila Beach Drive, each fed by naturally heated mineral water and screened from the others by oak trees. You book by the hour.

- **What it costs:** roughly $20-25 per person per hour for the hillside tubs. Prices vary by day and time, so check current rates when you book.
- **When to go:** after sunset is the magic window. The tubs are lit, the hillside is quiet, and the temperature contrast is best once the coastal air cools.
- **Book ahead:** weekend evening slots sell out, especially in summer. Reserve a day or two ahead minimum.
- **Make a night of it:** Gardens of Avila, the farm-to-table restaurant on the resort grounds, is one of the best dinners in town. Soak first, dinner after.

## Avila Hot Springs

At the Highway 101 end of Avila Beach Drive, Avila Hot Springs is the casual, family-friendly option: a large warm mineral pool alongside a freshwater swimming pool. Day passes are inexpensive, kids are welcome, and no reservation is needed for general soaking. Less romantic than Sycamore, much easier with children.

## Which One Should You Pick?

- **Couples / date night:** Sycamore's private hillside tubs, evening slot.
- **Families with kids:** Avila Hot Springs' warm pool.
- **Both:** they're 5 minutes apart. Plenty of guests do the family pool by day and trade off babysitting for a Sycamore hour at night.

## Make It a Weekend

The hot springs pair naturally with everything else in town: a morning on [Avila's sheltered, south-facing beach](/avila-beach), lunch on the promenade, the [Bob Jones Trail](/blog/things-to-do-avila-beach) by bike, wine tasting at the walkable downtown tasting rooms, then a soak as the sun drops.

Our [Avila Beach vacation rentals](/avila-beach) are 1-2 blocks from the beach and a short drive (or bike ride up the Bob Jones Trail) from both springs. [Browse all 13 properties](/collection). If you're planning a couples trip, ask us which ones have the best sunset views.
`,
  },
  {
    slug: 'wine-country-stays-edna-valley-arroyo-grande',
    title: 'Where to Stay in SLO Wine Country — Edna Valley & Arroyo Grande Valley',
    seoTitle: 'Where to Stay in SLO Wine Country — Edna Valley',
    seoDescription: 'Where to stay for wine tasting in Edna Valley and Arroyo Grande Valley: a private 13-acre estate, a working farm cottage, and the wineries locals actually visit.',
    excerpt: "San Luis Obispo wine country without the Napa crowds or prices. Where to stay among the vines, plus the wineries worth your time.",
    publishedAt: '2026-08-13T10:00:00Z',
    categories: ['local-guide'],
    isNew: false,
    body: `
_Edna Valley and Arroyo Grande Valley are what Napa was thirty years ago: world-class pinot noir and chardonnay, tasting rooms where the winemaker might pour your flight, and none of the crowds. Here's where to stay and where to taste._

## Why SLO Wine Country

The Edna Valley and Arroyo Grande Valley AVAs sit in a rare east-west corridor that funnels ocean air inland, giving the region one of the longest growing seasons in California. The result is exceptional cool-climate pinot noir, chardonnay, and albariño, all 10 minutes from the beach. Tastings here still cost a fraction of Napa's, and reservations are usually easy.

## Stay Among the Vines

### Wine Country Estate: Private 13 Acres, Sleeps 14

Our flagship [Arroyo Grande property](/arroyo-grande): a main house and 4 guest casitas on 13 private acres with a solar-heated pool, hot tub, and bocce court. Booked whole-estate only, so it's yours alone. This is the wine-trip base for a group: taste all afternoon, cook long dinners, and never worry about who's driving far.

### Flora Farm Cottage: A Working Farm Stay, Sleeps 4

The intimate option: a 2-bedroom cottage on a working Arroyo Grande farm, with a hot tub, a creek, and fresh eggs in the morning. It's the kind of stay the region does better than anywhere: agricultural, quiet, and genuinely local. Perfect for couples doing a tasting weekend.

## The Wineries Worth Your Time

### Edna Valley (10 minutes from SLO)

- **Tolosa**: polished tasting room, excellent single-vineyard pinot flights.
- **Chamisal Vineyards**: the valley's historic first vineyard, known for chardonnay.
- **Baileyana**: tastings in an old schoolhouse.

### Arroyo Grande Valley

- **Talley Vineyards**: the benchmark producer of the valley. The estate tasting overlooks the vines.
- **Laetitia**: sparkling wine specialists on a dramatic coastal ridge.
- **Timbre Winery**: small-production, music-themed, worth the stop.

## A Perfect Day

Morning coffee on the farm or by the pool. Two tastings in Edna Valley before lunch in the village of Edna. One more tasting at Talley in the afternoon. Then 15 minutes to Pismo or 20-25 to [Avila Beach](/avila-beach) for sunset on the sand. Here, unlike Napa, the beach is part of the wine trip.

[See both wine country properties](/arroyo-grande), [browse the full collection](/collection), or [contact us](/contact) to match the right property to your group.
`,
  },
  {
    slug: 'slo-county-short-term-rental-rules',
    title: "Short-Term Rental Rules in SLO County — An Owner's Guide",
    seoTitle: 'SLO County Short-Term Rental Rules 2026 — Permits & TOT',
    seoDescription: 'What Central Coast owners need to know before renting short-term: permits and licenses by jurisdiction, transient occupancy tax rates, and the rules that trip owners up.',
    excerpt: 'Thinking of renting your Central Coast property short-term? The permits, licenses, and transient occupancy taxes vary sharply by jurisdiction. Here\'s the owner\'s map.',
    publishedAt: '2026-08-13T10:00:00Z',
    categories: ['for-owners'],
    isNew: false,
    body: `
_Thinking about renting out your Central Coast property as a vacation rental? The single most important thing to understand is that the rules change completely depending on which jurisdiction your property sits in. Sometimes they change across the street. Here's the owner's map._

**A note before we start:** rules and tax rates change, and this article is a practical orientation, not legal advice. Verify current requirements with the county or city before you list, or [ask us](/contact) and we'll point you at the right office.

## First: Which Jurisdiction Are You Actually In?

San Luis Obispo County is a patchwork. Avila Beach is unincorporated county land. The city of San Luis Obispo has its own (much stricter) rules. Arroyo Grande has a city permit process, while rural Arroyo Grande addresses can fall under the county instead. Two properties five minutes apart can face entirely different rulebooks, so confirm your parcel's jurisdiction before anything else.

## Unincorporated SLO County (Includes Avila Beach)

Vacation rentals in the unincorporated county (which covers Avila Beach and much of the rural coast and wine country) operate under the county's vacation rental licensing rules. Expect requirements around:

- A county business license and vacation rental license for the property
- Occupancy limits tied to bedrooms and parking
- Separation/density rules in some communities (limits on how many rentals per block)
- Quiet hours and a designated local contact who can respond to issues

Licenses renew on a cycle and keep their number when renewed on time. Letting one lapse can mean rejoining the queue under whatever rules exist then, which matters in communities with density caps.

## City of San Luis Obispo

The city of SLO is the strictest jurisdiction in the county: unhosted whole-home vacation rentals are broadly prohibited in most residential zones, and short-term renting generally requires a permitted, hosted homestay arrangement. If your property is inside SLO city limits, don't assume anything that applies in Avila Beach applies to you. Check with the city's community development department before listing.

## Transient Occupancy Tax (TOT)

Every short-term stay in the county collects lodging tax from guests, and the total rate varies by jurisdiction: roughly 10.5% to 13.5% once county or city TOT plus local tourism assessments are combined. Avila Beach-area rentals sit at the lower end of that range; the cities run higher. Three things owners get wrong:

- **It's the guest's tax, but your liability.** You (or your platform/manager) must register, collect, and remit it.
- **Platform collection isn't universal.** Airbnb collects and remits in some cases; direct bookings are always on you.
- **Tourism assessments stack on top of base TOT**, so budget from the combined rate, not the headline number.

## The Mistakes That Cost Owners Real Money

- Listing before the license exists. Enforcement is complaint-driven, and neighbors do complain.
- Letting a license lapse in a density-capped community and losing the slot.
- Ignoring the local-contact requirement, then getting cited over a noise complaint nobody answered.
- Registering for TOT late and owing back taxes on months of stays.

## Or: Have Someone Handle All of This

This is a meaningful part of what professional management is for. Solmaré Stays manages 13 vacation rentals across Avila Beach, Arroyo Grande, and San Luis Obispo. We operate inside these rules every day, keep licenses current, and handle TOT registration and remittance as part of [full-service management](/management).

If you own a property on the Central Coast and want to know what compliant short-term renting would look like, and what the property could earn, [request a free revenue projection](/management) or call (805) 242-6411.
`,
  },
];

// ═════════════════════════════════════════════════════════════════════════════

const dry = process.argv.includes('--dry');
const mutations = [];

for (const p of POSTS) {
  const doc = {
    _id: `blogPost-${p.slug}`,
    _type: 'blogPost',
    title: p.title,
    slug: { _type: 'slug', current: p.slug },
    publishedAt: p.publishedAt,
    excerpt: p.excerpt,
    author: 'Solmaré Stays Team',
    categories: p.categories,
    seoTitle: p.seoTitle,
    seoDescription: p.seoDescription,
    body: toPortableText(p.body),
  };
  mutations.push({ createOrReplace: doc });
  writeFileSync(join(OUT, `${p.slug}.html`), toHtml(p.body));
  console.log(`prepared: ${p.slug} (${doc.body.length} blocks)`);
}

if (dry) {
  console.log('\n--dry: skipping Sanity write. HTML in', OUT);
  process.exit(0);
}

const res = await fetch(`https://${PROJECT}.api.sanity.io/v2024-01-01/data/mutate/${DATASET}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  body: JSON.stringify({ mutations }),
});
const json = await res.json();
if (!res.ok) { console.error('Sanity mutation FAILED:', JSON.stringify(json, null, 2)); process.exit(1); }
console.log(`\nSanity: ${json.results?.length ?? 0} documents written (transaction ${json.transactionId})`);
