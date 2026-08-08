/**
 * Post-build SEO injection script.
 *
 * Generates static HTML for key routes by injecting proper meta tags,
 * schema markup, and crawlable content into the built index.html.
 * No browser required — pure Node.js string templating.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DIST = join(__dirname, '..', 'dist');
const BASE_URL = 'https://www.solmarestays.com';

// Read the built index.html as our template.
//
// TRAP: the homepage ('/') is written back to this same dist/index.html. Running this
// script twice without an intervening `vite build` would therefore read an
// ALREADY-INJECTED template and inject on top of it — duplicating every schema block
// and leaking the homepage's schema and body onto all 34 pages. Silently producing
// corrupt output is far worse than stopping, so detect it and refuse.
const template = readFileSync(join(DIST, 'index.html'), 'utf-8');
if (template.includes('<div id="root"><div style="max-width:900px')) {
  console.error(
    '\nERROR: dist/index.html has already been prerendered.\n' +
    'Running again would duplicate every schema block and copy homepage content\n' +
    'onto every route. Run a full `npm run build` instead of `npm run prerender`.\n'
  );
  process.exit(1);
}

/**
 * Page definitions with SEO data.
 * Each page gets its own title, description, schema, and crawlable body content.
 */
const PAGES = [
  {
    route: '/',
    title: 'Avila Beach Vacation Rentals | Solmaré Stays',
    description: 'Refined vacation rentals in Avila Beach, Pismo Beach & SLO. 1,500+ five-star reviews. Book direct for the best rates.',
    h1: 'Avila Beach Vacation Rentals — Book Direct & Save',
    body: `<p>Solmaré Stays manages 13 premium vacation rentals across California's Central Coast — from beachfront bungalows in Avila Beach to a private wine country estate in Arroyo Grande. 1,500+ five-star reviews across Airbnb, VRBO, and Google.</p>
<h2>Why Book Direct with Solmaré Stays?</h2>
<ul><li>Save 15% vs Airbnb — best rate guaranteed</li><li>No service fees</li><li>Direct communication with our local Avila Beach team</li><li>24/7 guest support</li></ul>
<h2>Our Locations</h2>
<ul><li><a href="/avila-beach">Avila Beach</a> — 10 properties, steps from the pier and beach</li><li><a href="/pismo-beach">Pismo Beach</a> — minutes from the pier and Oceano Dunes</li><li><a href="/san-luis-obispo">San Luis Obispo</a> — walk to downtown SLO and Cal Poly</li><li><a href="/arroyo-grande">Arroyo Grande</a> — private 7-acre wine country estate</li></ul>
<h2>Featured Properties</h2>
<ul><li><strong>Hummingbird House</strong> — 2BR/2BA, rooftop terrace with panoramic ocean views</li><li><strong>La Casita</strong> — luxury 2BR beach house, 1 minute from the sand</li><li><strong>Casitas Estate</strong> — private 7-acre estate sleeping 14 with pool & hot tub</li><li><strong>The Coral House</strong> — modern 1BR with bifold doors and ocean views</li></ul>
<p>Browse all <a href="/collection">13 vacation rentals</a> or <a href="/contact">contact us</a> at (805) 801-6429.</p>`,
    schema: {
      "@context": "https://schema.org",
      "@type": "VacationRentalAgency",
      "name": "Solmaré Stays",
      "url": "https://www.solmarestays.com",
      "logo": "https://www.solmarestays.com/logo.png",
      "description": "Professional vacation rental management on California's Central Coast. 13 properties in Avila Beach, Pismo Beach, Arroyo Grande, and San Luis Obispo.",
      "telephone": "+1-805-801-6429",
      "email": "kyle@solmarestays.com",
      "address": { "@type": "PostalAddress", "addressLocality": "Avila Beach", "addressRegion": "CA", "postalCode": "93424", "addressCountry": "US" },
      "areaServed": ["Avila Beach", "Pismo Beach", "Shell Beach", "Arroyo Grande", "San Luis Obispo"].map(c => ({ "@type": "City", "name": c })),
      // Verified against Hostaway 2026-08-08: 1,541 guest-to-host reviews across the
      // 13 listings, of which 827 carry a numeric rating averaging 9.64/10 = 4.82/5.
      // Was "4.9 / 2400", which counted host-to-guest reviews and rounded upward.
      "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "ratingCount": "827", "reviewCount": "1541", "bestRating": "5" },
      // sameAs ties the site to its off-site profiles so search engines and AI
      // systems resolve them to one entity instead of several unrelated mentions.
      "sameAs": [
        "https://www.facebook.com/solmarestays",
        "https://www.instagram.com/solmarestays"
      ]
    },
    faq: [
      { q: "Who is Solmaré Stays?", a: "Solmaré Stays is a boutique vacation rental company based in Avila Beach, California. It manages 13 short-term rental properties across Avila Beach, Arroyo Grande, and San Luis Obispo on behalf of homeowners, and rents those same properties directly to travelers at solmarestays.com." },
      { q: "Is it cheaper to book direct than on Airbnb?", a: "Yes. Booking directly at solmarestays.com costs less than the identical property on Airbnb or Vrbo, because those platforms add a guest service fee on top of the nightly rate. Booking direct also means you deal with the local Avila Beach team rather than a platform inbox." },
      { q: "Where are Solmaré Stays properties located?", a: "Ten properties are in Avila Beach, most within a block or two of the sand. Two are in Arroyo Grande wine country, including a 7-acre private estate and a working farm cottage. One is in San Luis Obispo, walking distance from downtown and Cal Poly." },
      { q: "What is the best time of year to visit Avila Beach?", a: "Avila Beach sits in a sheltered, south-facing cove, so it stays mild year-round — daytime highs average around 68°F and the town records roughly 3,500 hours of sunshine a year. Summer is busiest and books earliest. September is the warmest month and noticeably quieter than August." },
      { q: "Do you also manage properties for owners?", a: "Yes. Solmaré Stays provides full-service vacation rental management for Central Coast homeowners, covering listing optimization, dynamic pricing, guest communication, cleaning, and maintenance. Owners can request a revenue projection for their property at solmarestays.com/management." }
    ]
  },
  {
    route: '/avila-beach',
    title: 'Avila Beach Vacation Rentals | Solmaré Stays',
    description: 'Browse luxury vacation rentals in Avila Beach, CA. Steps to the sand, ocean views, pet-friendly options. Book direct with Solmaré Stays for the best rates.',
    h1: 'Avila Beach Vacation Rentals',
    body: `<p>Discover Solmaré Stays' curated collection of vacation rentals in Avila Beach, California. Our properties are located just steps from the sand, offering ocean views, modern amenities, and the authentic Central Coast experience.</p>
<h2>Why Stay in Avila Beach?</h2>
<p>Avila Beach is a small seaside village on California's Central Coast, sheltered in a south-facing cove with roughly 3,500 hours of sunshine a year and daytime highs averaging around 68°F. Walk to the pier, enjoy waterfront dining, explore the Bob Jones Trail, or visit nearby hot springs at Sycamore Mineral Springs.</p>
<h2>Our Avila Beach Properties</h2>
<ul>
<li><strong>Hummingbird House</strong> — 2BR/2BA with private rooftop terrace and panoramic ocean views</li>
<li><strong>La Casita</strong> — Luxury 2BR beach house with chef's kitchen, 1 minute from the sand</li>
<li><strong>The Coral House</strong> — Modern 1BR with bifold doors and ocean views</li>
<li><strong>Shoreline Suite</strong> — Spacious 1BR with full kitchen and balcony</li>
<li><strong>The Deckhouse</strong> — Historic beach cottage with King bed, sleeps 4</li>
<li><strong>Emberlight</strong> — Private fire pit bungalow, steps to the beach</li>
<li><strong>Casa Azul</strong> — Colorful King bed studio with vintage charm</li>
<li><strong>The Nest</strong> — Intimate couples retreat with King bed</li>
<li><strong>The Palm House</strong> — Pet-friendly studio with ocean peeks</li>
<li><strong>The Pine House</strong> — Pet-friendly cottage with balcony views</li>
</ul>
<h2>Frequently Asked Questions</h2>
<h3>How far are your rentals from Avila Beach?</h3>
<p>Most of our Avila Beach properties are just 1-2 blocks from the sand — a 2-minute walk to the beach, pier, and promenade.</p>
<h3>Do you have pet-friendly rentals in Avila Beach?</h3>
<p>Yes! The Palm House and The Pine House are both pet-friendly. Dogs are welcome with advance notice.</p>
<h3>What is there to do in Avila Beach?</h3>
<p>Avila Beach offers beach activities, the Bob Jones Trail, Avila Beach Golf Resort, wine tasting at nearby wineries, kayaking, paddleboarding, and the famous Avila Beach Farmers Market on Fridays.</p>`,
    schema: {
      "@context": "https://schema.org",
      "@type": "LodgingBusiness",
      "name": "Solmaré Stays — Avila Beach Vacation Rentals",
      "description": "Luxury vacation rentals in Avila Beach, CA. Steps to the sand with ocean views.",
      "url": `${BASE_URL}/avila-beach`,
      "address": { "@type": "PostalAddress", "addressLocality": "Avila Beach", "addressRegion": "CA", "addressCountry": "US" },
      "geo": { "@type": "GeoCoordinates", "latitude": 35.1797, "longitude": -120.7331 }
    },
    faq: [
      { q: "How far are your rentals from Avila Beach?", a: "Most of our Avila Beach properties are just 1-2 blocks from the sand — a 2-minute walk to the beach, pier, and promenade." },
      { q: "Do you have pet-friendly rentals in Avila Beach?", a: "Yes! The Palm House and The Pine House are both pet-friendly. Dogs are welcome with advance notice." },
      { q: "What is there to do in Avila Beach?", a: "Avila Beach offers beach activities, the Bob Jones Trail, wine tasting, kayaking, paddleboarding, and the Avila Beach Farmers Market on Fridays." }
    ]
  },
  {
    route: '/pismo-beach',
    title: 'Pismo Beach Vacation Rentals | Solmaré Stays',
    description: 'Find luxury vacation rentals near Pismo Beach, CA. Ocean views, modern amenities, and steps to the sand. Book direct with Solmaré Stays.',
    h1: 'Pismo Beach Vacation Rentals',
    body: `<p>Experience California's Central Coast from Solmaré Stays' collection of vacation rentals near Pismo Beach. Our Avila Beach properties are just 5 minutes from Pismo Beach, offering easy access to both towns.</p>
<h2>About Pismo Beach</h2>
<p>Pismo Beach is a classic California beach town known for its iconic pier, Pismo Beach Premium Outlets, vibrant downtown, and stunning sunsets. Located just minutes from our Avila Beach properties.</p>`,
    schema: {
      "@context": "https://schema.org",
      "@type": "LodgingBusiness",
      "name": "Solmaré Stays — Pismo Beach Area Vacation Rentals",
      "url": `${BASE_URL}/pismo-beach`,
      "address": { "@type": "PostalAddress", "addressLocality": "Pismo Beach", "addressRegion": "CA", "addressCountry": "US" }
    },
    faq: [
      { q: "Does Solmaré Stays have rentals in Pismo Beach itself?", a: "Our properties are in Avila Beach, about 5 to 10 minutes' drive from Pismo Beach. Guests get quick access to the Pismo pier, downtown, and the Oceano Dunes while staying in a quieter beach village with easier parking." },
      { q: "Avila Beach or Pismo Beach — which should I stay in?", a: "Pismo is livelier, with more bars, shops, and the dunes. Avila is smaller, more sheltered, and noticeably warmer because it faces south. Choose Pismo for nightlife and activity, Avila for calm water and a quieter stay within easy reach of both." },
      { q: "Can you drive on the beach near Pismo?", a: "Yes, Oceano Dunes State Vehicular Recreation Area just south of Pismo Beach is one of the few California beaches permitting street-legal vehicles and OHVs. Access rules and seasonal restrictions change, so check current State Parks guidance before you go." }
    ]
  },
  {
    route: '/san-luis-obispo',
    title: 'San Luis Obispo Vacation Rentals | Solmaré Stays',
    description: 'Vacation rentals in San Luis Obispo, CA. Walk to Cal Poly, minutes from downtown SLO. Book direct with Solmaré Stays.',
    h1: 'San Luis Obispo Vacation Rentals',
    body: `<p>Stay in the heart of San Luis Obispo with Solmaré Stays. Our Monterey Heights Suite is a walkable distance from Cal Poly and minutes from downtown SLO's restaurants, shops, and Thursday night farmers market.</p>
<h2>Our SLO Property</h2>
<ul><li><strong>Monterey Heights Suite</strong> — Cal King bed, private patio, kitchenette, walk to Cal Poly campus</li></ul>`,
    schema: {
      "@context": "https://schema.org",
      "@type": "LodgingBusiness",
      "name": "Solmaré Stays — San Luis Obispo Vacation Rentals",
      "url": `${BASE_URL}/san-luis-obispo`,
      "address": { "@type": "PostalAddress", "addressLocality": "San Luis Obispo", "addressRegion": "CA", "addressCountry": "US" }
    },
    faq: [
      { q: "Where can I stay near Cal Poly San Luis Obispo?", a: "Monterey Heights Suite is a 2-bedroom, 1-bathroom suite sleeping 4, within walking distance of both downtown SLO and Cal Poly. It starts from $140 per night, which makes it a practical base for campus visits, graduations, and parents' weekends." },
      { q: "Is San Luis Obispo good for a family or group stay?", a: "Monterey Heights Suite sleeps 4 and suits families or two couples. Larger groups are better served by Wine Country Estate in Arroyo Grande, about 20 minutes south, which sleeps 14 across 5 bedrooms." },
      { q: "How far is San Luis Obispo from the beach?", a: "About 15 minutes to Avila Beach and 20 minutes to Pismo Beach. Staying in SLO puts you between the coast and wine country, with downtown restaurants, the Thursday farmers market, and Bishop Peak hiking on your doorstep." }
    ]
  },
  {
    route: '/arroyo-grande',
    title: 'Arroyo Grande & Wine Country Vacation Rentals | Solmaré Stays',
    description: 'Luxury wine country estate rental in Arroyo Grande, California. Private 7-acre estate sleeping 14 with pool, hot tub, and vineyard views. 15 minutes to Pismo Beach. Book direct and save.',
    h1: 'Arroyo Grande & Wine Country Vacation Rentals',
    body: `<p>Stay in the heart of Central Coast wine country. Our Casitas Estate in Arroyo Grande offers seven private acres with a 3,700 sq ft Main House, five private casitas, pool, hot tub, bocce court, and walking trails — all exclusively yours.</p>
<h2>Wine Country at Your Doorstep</h2>
<p>Talley Vineyards, Chamisal Vineyards, Laetitia, Timbre Winery, and dozens more are minutes away. The Edna Valley and Arroyo Grande Valley AVAs produce world-class pinot noir and chardonnay.</p>
<h2>Minutes from the Beach</h2>
<p>Pismo Beach is 15 minutes away. Avila Beach is 20 minutes. Downtown San Luis Obispo is 10 minutes. Wine country mornings, beach afternoons.</p>`,
    schema: {
      "@context": "https://schema.org",
      "@type": "LodgingBusiness",
      "name": "Solmaré Stays — Arroyo Grande & Wine Country Vacation Rentals",
      "url": `${BASE_URL}/arroyo-grande`,
      "address": { "@type": "PostalAddress", "addressLocality": "Arroyo Grande", "addressRegion": "CA", "postalCode": "93420", "addressCountry": "US" }
    },
    faq: [
      { q: "What vacation rentals does Solmaré Stays have in Arroyo Grande?", a: "Two. Wine Country Estate is a private 7-acre property with 5 bedrooms, a solar-heated pool, hot tub, and separate casitas, sleeping 14. Flora Farm Cottage is a 2-bedroom cottage on a working farm with a hot tub, a creek, and fresh eggs, sleeping 4." },
      { q: "Is Arroyo Grande good for wine tasting?", a: "Yes. Arroyo Grande sits in the Arroyo Grande Valley AVA at the southern end of San Luis Obispo wine country, within easy reach of Edna Valley and the Santa Maria Valley. Both Solmaré properties there are set among vineyards and farmland rather than in town." },
      { q: "How far is Arroyo Grande from the beach?", a: "Roughly 15 to 20 minutes by car to Pismo Beach and about 25 minutes to Avila Beach. Staying in Arroyo Grande gets you significantly more space and privacy for the money while keeping the coast within a short drive." }
    ]
  },
  {
    route: '/central-coast',
    title: 'Central Coast California Vacation Rentals | Solmaré Stays',
    description: 'Luxury vacation rentals on California\'s Central Coast. Avila Beach, Pismo Beach, San Luis Obispo, and Arroyo Grande. Book direct for the best rates.',
    h1: 'Central Coast California Vacation Rentals',
    body: `<p>Solmaré Stays manages 12 premium vacation rentals across California's Central Coast, from beachfront bungalows in Avila Beach to a 7-acre wine country estate in Arroyo Grande.</p>
<h2>Our Locations</h2>
<ul>
<li><a href="/avila-beach">Avila Beach</a> — 10 properties, steps to the sand</li>
<li><a href="/san-luis-obispo">San Luis Obispo</a> — Walk to Cal Poly</li>
<li><a href="/pismo-beach">Pismo Beach</a> — Minutes from the pier</li>
<li><a href="/arroyo-grande">Arroyo Grande</a> — Wine Country Estate with pool, hot tub, 4 casitas</li>
</ul>`,
    schema: {
      "@context": "https://schema.org",
      "@type": "LodgingBusiness",
      "name": "Solmaré Stays — Central Coast Vacation Rentals",
      "url": `${BASE_URL}/central-coast`,
      "address": { "@type": "PostalAddress", "addressRegion": "CA", "addressCountry": "US" }
    },
    faq: [
      { q: "Where is California's Central Coast?", a: "The Central Coast runs roughly between Santa Barbara and Monterey. Solmaré Stays operates in its southern half, in San Luis Obispo County — Avila Beach, Pismo Beach, Shell Beach, Arroyo Grande, and the city of San Luis Obispo." },
      { q: "What is the Central Coast known for?", a: "Uncrowded beaches, the Edna Valley and Arroyo Grande Valley wine regions, Hearst Castle, elephant seals at Piedras Blancas, and Highway 1. It is markedly quieter and less expensive than either the Bay Area or Southern California coastline." },
      { q: "How do I get to the Central Coast?", a: "San Luis Obispo County Regional Airport (SBP) is the closest, about 15 minutes from Avila Beach. Santa Barbara is roughly 90 minutes south by car and Los Angeles about 3 hours. Amtrak's Pacific Surfliner and Coast Starlight both stop in San Luis Obispo." },
      { q: "When is the best time to visit?", a: "September is the warmest month on the Central Coast and quieter than August, which makes early autumn the sweet spot. Late spring is green and mild. June often brings coastal fog in the mornings, though the sheltered south-facing position of Avila Beach clears earlier than much of the coast." }
    ]
  },
  {
    route: '/collection',
    title: 'Browse All Properties | Solmaré Stays',
    description: 'Browse all 13 vacation rental properties managed by Solmaré Stays. Avila Beach, Pismo Beach, SLO, and wine country. Filter by location, guests, and dates.',
    h1: 'Our Vacation Rental Collection',
    body: `<p>Browse Solmaré Stays' curated collection of 13 vacation rentals across California's Central Coast. From intimate beach studios to a 7-acre wine country estate, find your perfect stay.</p>`,
    faq: [
      { q: "How many vacation rentals does Solmaré Stays have?", a: "Solmaré Stays manages 13 vacation rental properties on California's Central Coast: 10 in Avila Beach, 2 in Arroyo Grande wine country, and 1 in San Luis Obispo. All are managed and operated directly by the Solmaré team rather than sublet or franchised." },
      { q: "What is the largest property you offer?", a: "Wine Country Estate in Arroyo Grande is the largest, with 5 bedrooms and 5 bathrooms across a private 7-acre property that sleeps 14. It includes a solar-heated pool and hot tub and is booked as a whole estate rather than by individual casita." },
      { q: "What is the smallest or most affordable option?", a: "The Palm House, The Pine House, and Monterey Heights Suite all start around $140 per night. The Avila Beach studios sleep two, while Monterey Heights Suite in San Luis Obispo has two bedrooms and sleeps four, making it the best value for small groups." },
      { q: "Do you offer discounts for longer stays?", a: "Yes. Weekly and monthly stays receive automatic length-of-stay discounts that are applied when you select your dates. Longer bookings also tend to land on lower nightly rates because pricing responds to how far ahead the reservation is made." }
    ]
  },
  {
    route: '/pet-friendly',
    title: 'Pet-Friendly Vacation Rentals in Avila Beach | Solmaré Stays',
    description: 'Pet-friendly vacation rentals in Avila Beach, CA. Bring your dog to the beach! The Palm House and Pine House welcome pets. Book direct.',
    h1: 'Pet-Friendly Vacation Rentals',
    body: `<p>Traveling with your dog? Solmaré Stays offers pet-friendly vacation rentals in Avila Beach. Our pet-friendly properties welcome well-behaved dogs so your whole family can enjoy the Central Coast together.</p>
<h2>Pet-Friendly Properties</h2>
<ul>
<li><strong>The Palm House</strong> — King studio with ocean peeks and private balcony. Pet fee applies.</li>
<li><strong>The Pine House</strong> — Queen studio with balcony views. Pet fee applies.</li>
<li><strong>Wine Country Estate</strong> — 7-acre estate with room to roam. Dogs welcome with approval.</li>
</ul>`,
    faq: [
      { q: "Which Solmaré Stays rentals are pet friendly?", a: "Three properties accept dogs. The Palm House and The Pine House in Avila Beach both welcome dogs, and each is a one-bedroom studio sleeping two. Wine Country Estate in Arroyo Grande welcomes up to two dogs with prior approval, on seven acres of private grounds. Dogs must be added to the reservation in advance at all three." },
      { q: "Where can I walk my dog near the Avila Beach rentals?", a: "The Bob Jones Trail runs from Avila Beach inland along San Luis Obispo Creek and is a popular leashed walk from our properties. Beach access rules for dogs vary by season and by section of beach, so check current City of Avila Beach signage when you arrive." },
      { q: "Is there a pet fee?", a: "Yes. At Wine Country Estate it is $100 per dog, for up to two dogs, with approval before booking. At The Palm House and The Pine House a pet fee also applies — add your dog to the reservation and we will confirm the amount for your dates, so the property can be prepared." },
      { q: "Are there breed or size restrictions?", a: "There are no blanket breed restrictions, but pets should be house-trained and not left unattended in the property. Larger dogs are generally better suited to Wine Country Estate, which has fenced outdoor space, than to the Avila Beach studios." }
    ]
  },
  {
    route: '/group-stays',
    title: 'Group Vacation Rentals in Avila Beach | Solmaré Stays',
    description: 'Plan a group trip to Avila Beach. Book multiple bungalows together or rent the entire Wine Country Estate for up to 14 guests. Weddings, reunions, retreats.',
    h1: 'Group Stays & Private Compound Rentals',
    body: `<p>Planning a group trip, family reunion, wedding, or corporate retreat on the Central Coast? Solmaré Stays offers unique group accommodation options.</p>
<h2>Options for Groups</h2>
<ul>
<li><strong>Wine Country Estate</strong> — Private 7-acre estate with a main house and 4 guest casitas, pool, hot tub, bocce court. Sleeps 14.</li>
<li><strong>Las Casitas Avila Compound</strong> — Book multiple bungalows in our Avila Beach compound for a private group experience.</li>
</ul>`,
    faq: [
      { q: "What is the best rental for a large group on the Central Coast?", a: "Wine Country Estate in Arroyo Grande sleeps 14 across 5 bedrooms and 5 bathrooms on a private 7-acre property, with a solar-heated pool, hot tub, and separate casitas. It is the only single Solmaré property that accommodates a group that size." },
      { q: "Can I book several Avila Beach properties together?", a: "Yes. Several Solmaré properties sit within the same Avila Beach compound, so larger groups can reserve multiple bungalows side by side and effectively take over a private cluster. Contact us with your dates and headcount and we will check which combination is available." },
      { q: "Do you host weddings or corporate retreats?", a: "Wine Country Estate is well suited to small weddings, family reunions, and corporate retreats given its acreage and separate casitas. Event use needs approval in advance, so tell us what you are planning when you enquire rather than after booking." },
      { q: "Can I rent just one casita at Wine Country Estate?", a: "No. Wine Country Estate is booked as a whole estate only. The casitas are not rented individually, which keeps the property private for whichever group has it and avoids sharing grounds, pool, and hot tub between separate parties." }
    ]
  },
  {
    route: '/philosophy',
    title: 'Our Philosophy | Solmaré Stays',
    description: 'Learn about Solmaré Stays\' approach to luxury vacation rental hospitality on California\'s Central Coast. Elevated stays, local expertise, 5-star service.',
    h1: 'Our Philosophy',
    body: `<p>At Solmaré Stays, we believe vacation rentals should feel like more than just a place to sleep. Every property in our collection is hand-selected, professionally designed, and maintained to hotel-quality standards — with the warmth and privacy of a home.</p>`
  },
  {
    route: '/management',
    title: 'Vacation Rental Property Management | Avila Beach & Central Coast | Solmaré Stays',
    description: 'Professional vacation rental management in Avila Beach, Pismo Beach, and SLO County. Maximize revenue with Solmaré Stays\' full-service property management.',
    h1: 'Vacation Rental Property Management',
    body: `<p>Solmaré Stays provides full-service vacation rental management for homeowners on California's Central Coast. We handle everything — from listing optimization and dynamic pricing to guest communication, cleaning, and maintenance — so you can earn more while doing less.</p>
<h2>Why Partner with Solmaré Stays?</h2>
<ul>
<li>9.6/10 average guest rating across 1,500+ reviews</li>
<li>Professional photography and listing optimization</li>
<li>Dynamic pricing powered by PriceLabs</li>
<li>24/7 local guest support team</li>
<li>Hotel-quality cleaning and property inspections</li>
</ul>`,
    schema: {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Solmaré Stays — Vacation Rental Property Management",
      "url": "https://www.solmarestays.com/management",
      "logo": "https://www.solmarestays.com/logo.png",
      "image": "https://www.solmarestays.com/logo.png",
      "description": "Full-service vacation rental property management for homeowners on California's Central Coast, covering listing optimization, dynamic pricing, guest communication, cleaning, and maintenance.",
      "telephone": "+1-805-801-6429",
      "email": "kyle@solmarestays.com",
      "priceRange": "$$",
      "address": { "@type": "PostalAddress", "addressLocality": "Avila Beach", "addressRegion": "CA", "postalCode": "93424", "addressCountry": "US" },
      "geo": { "@type": "GeoCoordinates", "latitude": 35.1797, "longitude": -120.7331 },
      "areaServed": ["Avila Beach", "Pismo Beach", "Shell Beach", "Arroyo Grande", "San Luis Obispo"].map(c => ({ "@type": "City", "name": c })),
      "serviceType": "Vacation rental property management",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Property management services",
        "itemListElement": [
          "Listing creation and optimization",
          "Dynamic nightly pricing",
          "Guest communication and screening",
          "Professional photography",
          "Cleaning and linen service",
          "Property inspection and maintenance coordination"
        ].map(s => ({ "@type": "Offer", "itemOffered": { "@type": "Service", "name": s } }))
      }
    },
    faq: [
      { q: "What does a vacation rental property manager do?", a: "A vacation rental manager handles everything an owner would otherwise do themselves: creating and optimizing listings across Airbnb, Vrbo and Google, setting nightly rates, screening and communicating with guests, coordinating cleaning and linens between stays, inspecting the property, and handling maintenance issues as they come up." },
      { q: "How much does vacation rental management cost in Avila Beach?", a: "Management is priced as a percentage of booking revenue, so the manager only earns when the property does. The exact rate depends on the property, its location, and how much service the owner wants. Solmaré Stays provides a revenue projection and proposed terms before any commitment." },
      { q: "How does Solmaré Stays set nightly rates?", a: "Rates are dynamic rather than fixed. Solmaré uses PriceLabs alongside local market data and live booking pace to adjust pricing by season, day of week, remaining lead time, and local demand events. Rates are reviewed continuously rather than set once per season." },
      { q: "Is Solmaré Stays local to Avila Beach?", a: "Yes. Solmaré Stays is based in Avila Beach and manages 13 properties, all within roughly 20 miles. That means same-day response to guest and maintenance issues, in-person inspection between every stay, and direct owner access rather than a regional account manager." },
      { q: "How do I get a revenue estimate for my property?", a: "Request a revenue projection at solmarestays.com/contact or call (805) 801-6429. Solmaré reviews the property, comparable local performance, and realistic occupancy for its location and size, then proposes terms based on that analysis." }
    ]
  },
  {
    route: '/experiences',
    title: 'Guest Experiences | Central Coast Activities | Solmaré Stays',
    description: 'Discover the best experiences on California\'s Central Coast. Wine tasting, beach activities, hiking, dining, and more — curated by Solmaré Stays.',
    h1: 'Central Coast Guest Experiences',
    body: `<p>Make the most of your Central Coast vacation with our curated guide to local experiences. From wine tasting and beach adventures to hiking and dining, we'll help you discover the best of Avila Beach and beyond.</p>`
  },
  {
    route: '/contact',
    title: 'Contact Solmaré Stays | Avila Beach Vacation Rentals',
    description: 'Get in touch with Solmaré Stays for vacation rental inquiries, property management questions, or group booking requests. We respond within the hour.',
    h1: 'Contact Us',
    body: `<p>Have questions about our vacation rentals or interested in property management services? We'd love to hear from you. Our local team typically responds within the hour.</p>`
  },
  {
    route: '/blog',
    title: 'Blog | Avila Beach & Central Coast Travel Guide | Solmaré Stays',
    description: 'Travel tips, local guides, and insider recommendations for Avila Beach, Pismo Beach, and California\'s Central Coast from Solmaré Stays.',
    h1: 'Solmaré Stays Blog',
    body: `<p>Your guide to California's Central Coast. Discover travel tips, local recommendations, seasonal events, and insider knowledge from our team in Avila Beach.</p>`
  },
  // ── BLOG POSTS ──
  {
    route: '/blog/best-restaurants-avila-beach',
    title: 'Best Restaurants in Avila Beach — A Local\'s Guide (2026) | Solmaré Stays',
    description: 'The best restaurants in Avila Beach, CA ranked by a local. From seafood on the pier to hidden wine bars. Updated for 2026 with menus, prices, and reservation tips.',
    h1: 'Best Restaurants in Avila Beach — A Local\'s Guide',
    body: `<p><em>Updated June 2026 by the Solmaré Stays team — we live and work in Avila Beach and eat at these spots weekly.</em></p>
<p>Avila Beach may be a small town, but the dining scene punches well above its weight. Whether you're craving fresh-off-the-boat seafood, wood-fired pizza, or a quiet wine tasting with ocean views, here are the restaurants worth your time.</p>
<h2>1. Custom House — Best Overall</h2>
<p>Right on the promenade with ocean views from every table. The fish tacos and clam chowder are the move. Reservations recommended on weekends. Open for lunch and dinner daily.</p>
<h2>2. Mersea's — Best Seafood</h2>
<p>Casual counter-service spot at the end of the pier. The fish and chips are some of the best on the Central Coast. Grab a table outside and watch the surfers. Cash-friendly prices.</p>
<h2>3. Gardens of Avila — Best Date Night</h2>
<p>Tucked inside the Sycamore Mineral Springs resort, this is the elevated option. Farm-to-table menu, excellent wine list focused on local Edna Valley producers. The garden patio is magical at sunset.</p>
<h2>4. Blue Moon Over Avila — Best Bar & Apps</h2>
<p>Lively bar scene with solid appetizers and craft cocktails. Live music on weekends. Great for a casual night out after a beach day.</p>
<h2>5. Mr. Rick's — Best Waterfront Drinks</h2>
<p>The original Avila Beach bar. Nothing fancy, but the deck overlooking the harbor is unbeatable for sunset drinks. Classic California dive bar energy.</p>
<h2>6. Avila Beach Farmers Market (Fridays)</h2>
<p>Not a restaurant, but the Friday afternoon farmers market on the promenade is an Avila institution. Fresh produce, local honey, tri-tip sandwiches, live music, and a community atmosphere you won't find anywhere else. 4-8 PM every Friday, year-round.</p>
<h2>Wine Tasting in Avila Beach</h2>
<p>Several tasting rooms are walkable from our vacation rentals: Alapay Cellars, Peloton Cellars, and Sinor-LaVallee are all within a 5-minute walk. For a bigger wine experience, Edna Valley and Arroyo Grande Valley wineries are a 10-minute drive.</p>
<h2>Where to Stay</h2>
<p>All of our <a href="/avila-beach">Avila Beach vacation rentals</a> are within walking distance of every restaurant on this list. <a href="/collection">Browse all 13 properties</a> or <a href="/contact">contact us</a> for recommendations based on your group size.</p>`,
    faq: [
      { q: "What is the best restaurant in Avila Beach?", a: "Custom House is the best overall restaurant in Avila Beach, with ocean views, excellent seafood, and a prime location on the promenade." },
      { q: "Where can I get seafood in Avila Beach?", a: "Mersea's on the pier has the best fish and chips. Custom House offers upscale seafood with ocean views. Both are walkable from Solmaré Stays properties." },
      { q: "Is there a farmers market in Avila Beach?", a: "Yes — the Avila Beach Farmers Market runs every Friday from 4-8 PM on the promenade. It features local produce, food vendors, live music, and is a must-visit." }
    ]
  },
  {
    route: '/blog/avila-beach-vs-pismo-beach',
    title: 'Avila Beach vs Pismo Beach — Where to Stay on the Central Coast | Solmaré Stays',
    description: 'Avila Beach vs Pismo Beach: which is better for your vacation? Compare beaches, restaurants, vibe, and accommodation. A local\'s honest comparison.',
    h1: 'Avila Beach vs Pismo Beach — Where Should You Stay?',
    body: `<p><em>Both towns are 10 minutes apart on California's Central Coast. Here's how to decide which one is right for your trip.</em></p>
<h2>The Quick Answer</h2>
<p><strong>Choose Avila Beach</strong> if you want: a quieter, more intimate beach town. Walkable restaurants and wine tasting. A sheltered bay with calm water perfect for families, kayaking, and paddleboarding. More sunshine (Avila is in a sun pocket — it's often 10 degrees warmer than Pismo).</p>
<p><strong>Choose Pismo Beach</strong> if you want: a bigger town feel with more shops and nightlife. Direct access to Oceano Dunes for ATVing. A classic California pier town vibe. More hotel options.</p>
<h2>Beach Comparison</h2>
<p><strong>Avila Beach:</strong> Sheltered bay, calm water, south-facing (maximum sun). Wide sandy beach with a gentle slope — great for kids. The pier is walkable from downtown. Less crowded than Pismo, even in summer.</p>
<p><strong>Pismo Beach:</strong> Open coast, bigger waves, more dramatic. The famous Pismo Pier stretches 1,200 feet into the ocean. Oceano Dunes (the only California beach you can drive on) is at the south end. More exposed to wind and fog.</p>
<h2>Restaurants & Nightlife</h2>
<p><strong>Avila Beach:</strong> Smaller but curated. Custom House, Mersea's, Gardens of Avila, and several wine tasting rooms all within walking distance. Friday farmers market is legendary. Quieter at night.</p>
<p><strong>Pismo Beach:</strong> More options overall. Ventana Grill, Splash Café (famous clam chowder), Giuseppe's, and a larger bar scene on Price Street. Premium Outlets for shopping.</p>
<h2>For Families</h2>
<p>Avila Beach wins for families. The calm, sheltered bay is safer for young kids. Everything is walkable. The Bob Jones Trail is a flat, paved bike path perfect for family rides. Avila Beach Golf Resort has mini golf.</p>
<h2>For Couples</h2>
<p>Avila Beach wins again. Gardens of Avila for dinner, wine tasting walkable from your rental, sunset from the pier, then hot springs at Sycamore Mineral Springs. More romantic, less commercial.</p>
<h2>The Best of Both</h2>
<p>Stay in Avila Beach, day-trip to Pismo. They're 10 minutes apart. You get the quiet home base with easy access to Pismo's pier, shopping, and dunes whenever you want it.</p>
<p><a href="/avila-beach">Browse our Avila Beach vacation rentals</a> — all within walking distance of the beach, restaurants, and wine tasting.</p>`,
    faq: [
      { q: "Is Avila Beach or Pismo Beach better?", a: "Avila Beach is better for families and couples who want a quieter, walkable beach town with wine tasting and calm water. Pismo Beach is better for those who want a bigger town with more nightlife and ocean dunes." },
      { q: "How far is Avila Beach from Pismo Beach?", a: "Avila Beach and Pismo Beach are about 10 minutes apart by car (7 miles). Many visitors stay in Avila and day-trip to Pismo." },
      { q: "Which beach is warmer, Avila or Pismo?", a: "Avila Beach is typically 5-10 degrees warmer than Pismo Beach because it sits in a south-facing sheltered bay that blocks coastal fog and wind." }
    ]
  },
  {
    route: '/blog/things-to-do-avila-beach',
    title: 'Things to Do in Avila Beach — The Complete Guide (2026) | Solmaré Stays',
    description: 'The complete guide to things to do in Avila Beach, CA. Beaches, hiking, wine tasting, hot springs, kayaking, and hidden gems from locals who live here.',
    h1: 'Things to Do in Avila Beach — The Complete Guide',
    body: `<p><em>Everything worth doing in Avila Beach, from a team that lives here year-round. Updated for 2026.</em></p>
<h2>Beach & Water Activities</h2>
<h3>Swimming & Sunbathing</h3><p>Avila Beach's sheltered bay offers the calmest, warmest water on the Central Coast. The south-facing beach gets sun all day. Lifeguards on duty in summer.</p>
<h3>Kayaking & Paddleboarding</h3><p>Rent kayaks and SUPs from Avila Beach Paddlesports right on the sand. Paddle to the sea caves at Point San Luis or just cruise the calm bay. Morning sessions are glassiest.</p>
<h3>Fishing from the Pier</h3><p>Avila Beach Pier is free to fish — no license needed for pier fishing in California. Perch, halibut, and rockfish are common catches.</p>
<h2>Hiking & Outdoors</h2>
<h3>Bob Jones Trail</h3><p>A flat, paved 3-mile trail along San Luis Obispo Creek. Perfect for biking, jogging, or a family walk. Connects Avila Beach to the Ontario Road trailhead. Shaded and scenic.</p>
<h3>Pecho Coast Trail</h3><p>A stunning 3.7-mile one-way hike along the bluffs to Point San Luis Lighthouse. Ocean views the entire way. Whale watching in winter. Docent-led tours available — book in advance as they sell out.</p>
<h3>Pirate's Cove</h3><p>A short hike down to one of the Central Coast's most scenic (and clothing-optional) beaches. Dramatic cliffs, tide pools, and sea caves. The trailhead is on Cave Landing Road.</p>
<h2>Wine Tasting</h2>
<p>Avila Beach has several walkable tasting rooms: Alapay Cellars, Peloton Cellars, Sinor-LaVallee. For a bigger wine day, drive 10 minutes to Edna Valley (Tolosa, Chamisal, Baileyana) or Arroyo Grande Valley (Talley, Laetitia, Timbre).</p>
<h2>Hot Springs</h2>
<p>Sycamore Mineral Springs Resort offers private hillside hot tubs fed by natural mineral springs. Book a 1-hour soak ($20-25/person) and follow it with dinner at Gardens of Avila next door. One of the most unique experiences on the Central Coast.</p>
<h2>Point San Luis Lighthouse</h2>
<p>A historic 1890 lighthouse accessible only by guided hike or boat. Trolley rides available for those who can't hike. Tours run Wednesdays and Saturdays — book at pointsanluislighthouse.org.</p>
<h2>Where to Stay</h2>
<p>Our <a href="/avila-beach">Avila Beach vacation rentals</a> put you walking distance from the beach, pier, restaurants, and wine tasting. <a href="/collection">Browse all properties</a>.</p>`,
    faq: [
      { q: "What is there to do in Avila Beach?", a: "Avila Beach offers swimming, kayaking, paddleboarding, pier fishing, the Bob Jones Trail for biking, wine tasting at walkable tasting rooms, hot springs at Sycamore Mineral Springs, and the Point San Luis Lighthouse hike." },
      { q: "Is Avila Beach good for families?", a: "Yes — Avila Beach is one of the best family beaches on the Central Coast. The sheltered bay has calm, warm water safe for kids. The Bob Jones Trail is flat and stroller-friendly. The Friday farmers market is family-friendly." },
      { q: "Where can I go wine tasting near Avila Beach?", a: "Several tasting rooms are walkable in downtown Avila Beach (Alapay Cellars, Peloton). Edna Valley wineries (Tolosa, Chamisal) are a 10-minute drive. Arroyo Grande Valley (Talley, Laetitia) is 15 minutes." }
    ]
  },
  {
    route: '/blog/pet-friendly-vacation-rentals-avila-beach',
    title: 'Pet-Friendly Vacation Rentals in Avila Beach (2026) | Solmaré Stays',
    description: 'The best pet-friendly vacation rentals in Avila Beach, CA. Bring your dog to the coast. Dog-friendly beaches, trails, restaurants, and accommodations.',
    h1: 'Pet-Friendly Vacation Rentals in Avila Beach',
    body: `<p><em>Traveling with your dog? Here's everything you need to know about bringing your pup to Avila Beach.</em></p>
<h2>Our Pet-Friendly Rentals</h2>
<p>Solmaré Stays offers pet-friendly vacation rentals in Avila Beach that welcome dogs:</p>
<ul>
<li><strong>The Palm House</strong> — King studio with ocean peeks and private balcony. Fenced area nearby.</li>
<li><strong>The Pine House</strong> — Queen studio with balcony views. Walking distance to the beach.</li>
<li><strong>Casitas Estate (Arroyo Grande)</strong> — 7-acre private estate with room to roam. Dogs welcome with approval.</li>
</ul>
<p>Pet fees vary by property. <a href="/pet-friendly">See all pet-friendly properties</a> or <a href="/contact">contact us</a> with questions about your specific pet.</p>
<h2>Dog-Friendly Beaches</h2>
<h3>Avila Beach (Leashed)</h3><p>Dogs are welcome on Avila Beach on a leash. Early morning and evening are the best times — fewer crowds, cooler sand, and your dog gets more space to explore.</p>
<h3>Pirate's Cove (Off-Leash Friendly)</h3><p>While not officially off-leash, Pirate's Cove is a more relaxed beach where dogs commonly run free. It's a short hike down from Cave Landing Road. Beautiful cliffs and tide pools.</p>
<h3>Shell Beach / Dinosaur Caves Park</h3><p>Just 10 minutes south. Dogs on leash in the park, with grassy areas, benches, and ocean views. Great for a morning walk.</p>
<h2>Dog-Friendly Trails</h2>
<p><strong>Bob Jones Trail</strong> — dogs on leash, flat and shaded. <strong>Ontario Ridge Trail</strong> — more challenging, dogs on leash, great views. Both start within minutes of our properties.</p>
<h2>Dog-Friendly Dining</h2>
<p>Most Avila Beach restaurants have outdoor patios that welcome dogs: Custom House, Blue Moon, Mr. Rick's, and the Friday Farmers Market are all dog-friendly.</p>
<h2>Tips for Visiting with Dogs</h2>
<ul><li>Bring water and a portable bowl — the beach gets hot</li><li>Clean up after your dog (bags available at most trail heads)</li><li>Check tide schedules before beach walks</li><li>The Friday Farmers Market can be overwhelming for anxious dogs — consider going early</li></ul>
<p><a href="/pet-friendly">Book a pet-friendly rental</a> — your dog deserves a vacation too.</p>`,
    faq: [
      { q: "Are dogs allowed on Avila Beach?", a: "Yes, dogs are allowed on Avila Beach on a leash. Early morning and evening are the best times for beach walks with your dog." },
      { q: "Are there pet-friendly vacation rentals in Avila Beach?", a: "Yes — Solmaré Stays offers pet-friendly vacation rentals including The Palm House and The Pine House, both in Avila Beach. Our Casitas Estate in Arroyo Grande also welcomes dogs." },
      { q: "Where can I take my dog off-leash near Avila Beach?", a: "Pirate's Cove, a short hike from Cave Landing Road, is a beach where dogs commonly run off-leash. It's about 5 minutes from Avila Beach." }
    ]
  },
  {
    route: '/blog/avila-beach-property-management',
    title: 'Vacation Rental Property Management in Avila Beach — What to Expect | Solmaré Stays',
    description: 'Thinking about hiring a property manager for your Avila Beach vacation rental? Here\'s what professional management looks like and what it costs.',
    h1: 'Vacation Rental Property Management in Avila Beach',
    body: `<p><em>If you own a vacation rental on the Central Coast and you're doing everything yourself — pricing, guest messages, cleaning coordination, maintenance — here's what it looks like when a professional takes over.</em></p>
<h2>Self-Managing vs Professional Management</h2>
<p>Most Avila Beach owners start by self-managing their rental. It works at first. Then the 2 AM guest messages, the double-bookings, the cleaning no-shows, and the bad reviews start adding up. The math changes.</p>
<table><tr><th></th><th>Self-Managed</th><th>Solmaré Stays</th></tr>
<tr><td>Avg occupancy</td><td>Typically 35-42%</td><td>51%</td></tr>
<tr><td>Avg guest rating</td><td>Typically 4.5-4.7/5</td><td>4.8/5 (9.6/10)</td></tr>
<tr><td>Response time</td><td>Hours</td><td>Minutes (local team)</td></tr>
<tr><td>Pricing strategy</td><td>Fixed or manual</td><td>Dynamic (PriceLabs)</td></tr>
<tr><td>Channels</td><td>Airbnb only</td><td>Airbnb + VRBO + Google + Direct</td></tr>
<tr><td>Your time</td><td>10-20 hrs/week</td><td>0 hrs/week</td></tr></table>
<h2>What's Included</h2>
<ul>
<li><strong>Listing optimization</strong> — professional photos, SEO-optimized descriptions, strategic pricing</li>
<li><strong>Dynamic pricing</strong> — PriceLabs adjusts your rates daily based on demand, events, and market data</li>
<li><strong>Multi-channel distribution</strong> — Airbnb, VRBO, Google Vacation Rentals, and our direct booking website</li>
<li><strong>24/7 guest communication</strong> — a local team on call, not an overseas call centre</li>
<li><strong>Professional cleaning</strong> — 50-point checklist, hotel-quality linens, restocking</li>
<li><strong>Maintenance coordination</strong> — proactive inspections, vendor management, emergency response</li>
<li><strong>Owner reporting</strong> — weekly performance reports, monthly financial statements</li>
</ul>
<h2>The Avila Beach Market</h2>
<p>Avila Beach has unique dynamics: extreme seasonality (peak summer vs. quiet winter), event-driven demand (Cal Poly, wine festivals), and a small inventory that rewards quality. The market average occupancy is 40%. Our portfolio runs at 59%. That 19-point gap is the difference between a property that covers its mortgage and one that generates real income.</p>
<h2>What It Costs</h2>
<p>Management fees on the Central Coast typically range from 15-25% of gross revenue. The fee pays for itself when professional management increases your occupancy and ADR enough to more than offset the commission. Most owners we work with see a net revenue increase even after our fee.</p>
<h2>Is It Right for You?</h2>
<p>If you own a vacation rental in Avila Beach, Pismo Beach, Shell Beach, San Luis Obispo, or Arroyo Grande, we'd love to show you what your property could be earning. No pressure — we start with a free market analysis and revenue projection.</p>
<p><a href="/management">Learn more about our management services</a> or <a href="/contact">get in touch</a>. Call Kyle directly at (805) 801-6429.</p>`,
    faq: [
      { q: "How much does vacation rental management cost in Avila Beach?", a: "Management fees on the Central Coast typically range from 15-25% of gross revenue. Solmaré Stays' fees vary by property. The fee pays for itself when professional management increases occupancy and revenue." },
      { q: "What is the average occupancy for vacation rentals in Avila Beach?", a: "The market average occupancy in Avila Beach is approximately 40%. Solmaré Stays' portfolio runs at 59% occupancy — 19 points above the market average." },
      { q: "Should I self-manage my Avila Beach vacation rental?", a: "Self-managing works if you have the time and expertise. But professional management typically increases occupancy from 35-42% to 55-60%+, improves guest ratings, and adds channels (VRBO, Google, direct) that most self-managers don't use." }
    ]
  },
  // ── Legacy URL aliases ──────────────────────────────────────────────────
  // App.tsx renders these with the SAME component as their primary, so Google
  // indexes duplicate copies that compete with each other (/for-homeowners sits
  // at position 22.4 while /management sits at 28.0, splitting the same intent).
  // Prerendering them with a canonical consolidates the signal. They are
  // deliberately kept OUT of the sitemap — canonicalised duplicates should not
  // be submitted for indexing.
  {
    route: '/for-homeowners',
    canonical: '/management',
    title: 'Vacation Rental Property Management | Avila Beach & Central Coast | Solmaré Stays',
    description: 'Professional vacation rental management in Avila Beach, Pismo Beach, and SLO County. Maximize revenue with Solmaré Stays\' full-service property management.',
    h1: 'Vacation Rental Property Management',
    body: `<p>This page has moved to <a href="/management">Solmaré Stays property management</a>. Full-service vacation rental management for homeowners on California's Central Coast.</p>`
  },
  {
    route: '/why-choose-us',
    canonical: '/philosophy',
    title: 'Our Philosophy | Solmaré Stays',
    description: 'Why homeowners and guests choose Solmaré Stays for Central Coast vacation rentals.',
    h1: 'Our Philosophy',
    body: `<p>This page has moved to <a href="/philosophy">our philosophy</a>.</p>`
  },
  {
    route: '/guest-experience',
    canonical: '/experiences',
    title: 'Central Coast Guest Experiences | Solmaré Stays',
    description: 'Curated Central Coast experiences for Solmaré Stays guests.',
    h1: 'Central Coast Guest Experiences',
    body: `<p>This page has moved to <a href="/experiences">guest experiences</a>.</p>`
  },
  {
    route: '/services',
    canonical: '/experiences',
    title: 'Central Coast Guest Experiences | Solmaré Stays',
    description: 'Curated Central Coast experiences for Solmaré Stays guests.',
    h1: 'Central Coast Guest Experiences',
    body: `<p>This page has moved to <a href="/experiences">guest experiences</a>.</p>`
  },
  {
    route: '/terms',
    title: 'Terms of Service | Solmaré Stays',
    description: 'Terms and conditions for booking vacation rentals with Solmaré Stays.',
    h1: 'Terms of Service',
    body: ''
  },
  {
    route: '/privacy',
    title: 'Privacy Policy | Solmaré Stays',
    description: 'Privacy policy for Solmaré Stays vacation rental bookings and website.',
    h1: 'Privacy Policy',
    body: ''
  }
];

function generatePage(page) {
  let html = template;

  // Replace title
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${page.title}</title>`
  );

  // Replace meta description
  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${page.description}" />`
  );

  // Add canonical URL.
  //
  // page.canonical lets a legacy alias point at its primary. App.tsx routes four
  // old URLs to the SAME component as their replacement (/for-homeowners →
  // ForHomeowners, same as /management) — the comment there says "Redirects for
  // old URLs" but nothing redirects, so Google indexes both copies and they
  // compete. A canonical consolidates them without changing live URL behaviour.
  const canonicalRoute = page.canonical || page.route;
  if (html.includes('rel="canonical"')) {
    html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${BASE_URL}${canonicalRoute}" />`);
  } else {
    html = html.replace('</head>', `  <link rel="canonical" href="${BASE_URL}${canonicalRoute}" />\n</head>`);
  }

  // Inject OG and Twitter tags before </head> (removed from static index.html, Helmet handles client-side)
  const ogTags = [
    `<meta property="og:title" content="${page.title}" />`,
    `<meta property="og:description" content="${page.description}" />`,
    `<meta property="og:url" content="${BASE_URL}${page.route}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Solmaré Stays" />`,
    page.image ? `<meta property="og:image" content="${page.image}" />` : '',
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${page.title}" />`,
    `<meta name="twitter:description" content="${page.description}" />`,
    page.image ? `<meta name="twitter:image" content="${page.image}" />` : '',
  ].filter(Boolean).join('\n  ');
  html = html.replace('</head>', `  ${ogTags}\n</head>`);

  // Add JSON-LD schema before </head>
  const schemas = [];

  // Page-specific schema
  if (page.schema) {
    schemas.push(page.schema);
  }

  // FAQ schema
  if (page.faq && page.faq.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": page.faq.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a }
      }))
    });
  }

  // BreadcrumbList
  const pageName = page.h1 || page.title.split('|')[0].trim();
  schemas.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
      { "@type": "ListItem", "position": 2, "name": pageName, "item": `${BASE_URL}${page.route}` }
    ]
  });

  if (schemas.length > 0) {
    const schemaScripts = schemas
      .map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`)
      .join('\n  ');
    html = html.replace('</head>', `  ${schemaScripts}\n</head>`);
  }

  // Inject content into root div so ALL crawlers (Google + AI) see real HTML
  if (page.h1 || page.body) {
    const seoContent = `<div id="root"><div style="max-width:900px;margin:0 auto;padding:2rem;font-family:system-ui,sans-serif;color:#1a1a1a"><h1>${page.h1 || ''}</h1>${page.body || ''}<p><a href="${BASE_URL}">← Back to Solmaré Stays</a> | <a href="tel:+18058016429">(805) 801-6429</a></p></div></div>`;
    html = html.replace(/<div id="root"><\/div>/, seoContent);
  }

  return html;
}

// --- Fetch properties from Hostaway for property page prerendering ---

function loadEnv() {
  // Read .env.local too — the repo ships .env.local, not .env, so reading only
  // .env meant local builds silently skipped all 13 property pages and produced
  // a sitemap missing them. Vercel is unaffected (it injects real env vars).
  const env = {};
  for (const name of ['.env', '.env.local']) {
    const envPath = join(__dirname, '..', name);
    if (!existsSync(envPath)) continue;
    const content = readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex === -1) continue;
      const key = trimmed.slice(0, eqIndex).trim();
      let value = trimmed.slice(eqIndex + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      env[key] = value;
    }
  }
  return env;
}

function generateSlug(name) {
  const baseName = name.split('|')[0].trim();
  return baseName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function fetchProperties() {
  const env = loadEnv();
  const token = env.HOSTAWAY_API_TOKEN || env.VITE_HOSTAWAY_API_TOKEN || process.env.HOSTAWAY_API_TOKEN || process.env.VITE_HOSTAWAY_API_TOKEN;
  const apiUrl = env.VITE_HOSTAWAY_API_URL || process.env.VITE_HOSTAWAY_API_URL || 'https://api.hostaway.com/v1';

  if (!token) {
    console.warn('  Warning: No Hostaway token — skipping property prerendering');
    return [];
  }

  try {
    const res = await fetch(`${apiUrl}/listings`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      console.warn(`  Warning: Hostaway API returned ${res.status}`);
      return [];
    }
    const data = await res.json();
    if (data.status === 'success' && Array.isArray(data.result)) {
      return data.result.filter(l => l.isActive !== 0);
    }
    return [];
  } catch (err) {
    console.warn('  Warning: Failed to fetch Hostaway listings:', err.message);
    return [];
  }
}

/**
 * Real guest-review counts per listing, keyed by Hostaway listingMapId.
 * Each value is { reviews, rated } where:
 *   reviews = all guest-to-host reviews (schema.org reviewCount)
 *   rated   = the subset carrying a numeric rating (schema.org ratingCount)
 *
 * Two traps, both of which inflate AggregateRating if missed:
 *  1. Hostaway /reviews returns BOTH directions. Roughly half the rows are
 *     "host-to-guest", which are reviews of the GUEST, not of the property.
 *  2. Only ~54% of guest reviews carry a numeric rating. ratingCount must be
 *     that subset, since it is what the average is computed from — using the
 *     full review count overstates it (e.g. Deckhouse 232 vs the true 136).
 *
 * Returns an empty Map on any failure so the caller omits aggregateRating
 * entirely rather than publishing an invented number.
 */
async function fetchReviewCounts() {
  const env = loadEnv();
  const token = env.HOSTAWAY_API_TOKEN || env.VITE_HOSTAWAY_API_TOKEN || process.env.HOSTAWAY_API_TOKEN || process.env.VITE_HOSTAWAY_API_TOKEN;
  const apiUrl = env.VITE_HOSTAWAY_API_URL || process.env.VITE_HOSTAWAY_API_URL || 'https://api.hostaway.com/v1';
  const counts = new Map();
  if (!token) return counts;

  try {
    let offset = 0;
    for (;;) {
      const res = await fetch(`${apiUrl}/reviews?limit=500&offset=${offset}`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        console.warn(`  Warning: reviews API returned ${res.status} — omitting ratingCount`);
        return new Map();
      }
      const data = await res.json();
      const rows = Array.isArray(data.result) ? data.result : [];
      for (const r of rows) {
        if (r.type !== 'guest-to-host') continue;
        const c = counts.get(r.listingMapId) || { reviews: 0, rated: 0, ratingSum: 0 };
        c.reviews += 1;
        if (r.rating !== null && r.rating !== undefined) {
          c.rated += 1;
          c.ratingSum += Number(r.rating);
        }
        counts.set(r.listingMapId, c);
      }
      if (rows.length < 500) break;
      offset += 500;
    }
  } catch (err) {
    console.warn('  Warning: Failed to fetch reviews:', err.message);
    return new Map();
  }
  return counts;
}

/** Below this many rated reviews, publish no aggregateRating at all. */
const MIN_RATINGS_FOR_AGGREGATE = 5;

function buildPropertyPage(listing, reviewCount) {
  const slug = generateSlug(listing.name);
  const name = listing.name.split('|')[0].trim();
  const tagline = listing.name.includes('|') ? listing.name.split('|').slice(1).join('|').trim() : '';
  const city = listing.city || 'Avila Beach';
  const bedrooms = listing.bedroomsNumber || 0;
  const bathrooms = listing.bathroomsNumber || 1;
  const sleeps = listing.personCapacity || 2;
  const price = listing.price || 0;
  const description = (listing.description || '').replace(/<[^>]+>/g, '').substring(0, 300).trim();
  const image = listing.thumbnailUrl || '';
  const images = (listing.listingImages || [])
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, 10)
    .map(img => img.url);
  const amenities = (listing.listingAmenities || []).map(a => a.amenityName);
  const lat = listing.lat;
  const lng = listing.lng;
  const address = listing.publicAddress || listing.address || `${listing.street || ''}, ${city}`;
  const checkinStart = listing.checkInTimeStart;
  const checkoutTime = listing.checkOutTime;
  const avgRating = listing.averageReviewRating;

  return {
    route: `/property/${slug}`,
    title: `${name} | Vacation Rental in ${city} | Solmaré Stays`,
    description: description ? `${description.substring(0, 155)}...` : `${name} — ${bedrooms}BR/${bathrooms}BA vacation rental in ${city}. Sleeps ${sleeps}. Book direct with Solmaré Stays.`,
    image,
    h1: name,
    body: `<p>${tagline ? tagline + '. ' : ''}${bedrooms} bedroom${bedrooms !== 1 ? 's' : ''}, ${bathrooms} bathroom${bathrooms !== 1 ? 's' : ''}, sleeps ${sleeps}. Starting from $${price}/night in ${city}, California.</p>
<p>${description}</p>
${amenities.length > 0 ? `<p>Amenities: ${amenities.slice(0, 15).join(', ')}.</p>` : ''}
<p>Managed by <a href="/">Solmaré Stays</a> — professional vacation rental management on California's Central Coast.</p>
<p><a href="/collection">Browse all properties</a> | <a href="/contact">Contact us</a> | <a href="tel:+18058016429">(805) 801-6429</a></p>`,
    schema: {
      "@context": "https://schema.org",
      "@type": "VacationRental",
      "name": name,
      "description": description,
      "url": `${BASE_URL}/property/${slug}`,
      "image": images.length > 0 ? images : (image ? [image] : []),
      "address": {
        "@type": "PostalAddress",
        "streetAddress": address,
        "addressLocality": city,
        "addressRegion": "CA",
        "postalCode": city === 'Avila Beach' ? '93424' : city === 'Arroyo Grande' ? '93420' : '93449',
        "addressCountry": "US",
      },
      ...(lat && lng ? {
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": lat,
          "longitude": lng,
        },
      } : {}),
      "numberOfBedrooms": bedrooms,
      "numberOfBathroomsTotal": bathrooms,
      "occupancy": { "@type": "QuantitativeValue", "maxValue": sleeps },
      ...(amenities.length > 0 ? {
        "amenityFeature": amenities.slice(0, 20).map(a => ({
          "@type": "LocationFeatureSpecification",
          "name": a,
          "value": true,
        })),
      } : {}),
      "petsAllowed": amenities.some(a => {
        const l = a.toLowerCase();
        return l.includes('pet') || l.includes('dog');
      }),
      // Only emit aggregateRating when the rating AND a real rated-review count are
      // known. Inventing a count is worse than omitting the block — Google treats
      // fabricated review counts as a rich-result violation and AI systems repeat
      // the number verbatim. MIN_RATINGS guards the other end: a lone 5.0 (Wine
      // Country Estate has exactly one rated review) is not a credible aggregate.
      ...(avgRating && reviewCount.rated >= MIN_RATINGS_FOR_AGGREGATE ? {
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": (avgRating > 5 ? avgRating / 2 : avgRating).toFixed(1),
          "bestRating": "5",
          "ratingCount": String(reviewCount.rated),
          "reviewCount": String(reviewCount.reviews),
        },
      } : {}),
      "offers": {
        "@type": "Offer",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": price,
          "priceCurrency": "USD",
          "unitCode": "DAY",
        },
      },
      "checkinTime": checkinStart ? `${String(checkinStart).padStart(2, '0')}:00` : "15:00",
      "checkoutTime": checkoutTime ? `${String(checkoutTime).padStart(2, '0')}:00` : "11:00",
    },
  };
}

// Generate all pages
async function main() {
  let count = 0;

  // Review data must be fetched BEFORE the static pages render — the homepage
  // is written inside that loop and carries the sitewide aggregateRating.
  console.log('\nFetching review data from Hostaway...');
  const reviewCounts = await fetchReviewCounts();
  console.log(`  Real guest-review counts for ${reviewCounts.size} listings`);

  // Recompute the SITEWIDE aggregateRating from the same source the per-property
  // ones use. Hardcoding it guarantees drift: reviews arrive continuously, so a
  // literal in PAGES silently stops reconciling with the sum of the property
  // pages within days. Skipped entirely if the reviews API failed, rather than
  // leaving a stale literal in place.
  if (reviewCounts.size > 0) {
    let reviews = 0, rated = 0, ratingSum = 0;
    for (const c of reviewCounts.values()) {
      reviews += c.reviews; rated += c.rated; ratingSum += c.ratingSum;
    }
    const home = PAGES.find(p => p.route === '/');
    if (home?.schema?.aggregateRating && rated > 0) {
      const avgTen = ratingSum / rated;              // Hostaway ratings are out of 10
      home.schema.aggregateRating.ratingValue = (avgTen / 2).toFixed(1);
      home.schema.aggregateRating.ratingCount = String(rated);
      home.schema.aggregateRating.reviewCount = String(reviews);
      console.log(`  Sitewide rating: ${(avgTen / 2).toFixed(1)}/5 from ${rated} ratings across ${reviews} reviews`);
    }
  }


  // Static pages
  for (const page of PAGES) {
    const html = generatePage(page);
    let outputPath;
    if (page.route === '/') {
      outputPath = join(DIST, 'index.html');
    } else {
      const outputDir = join(DIST, page.route);
      mkdirSync(outputDir, { recursive: true });
      outputPath = join(outputDir, 'index.html');
    }
    writeFileSync(outputPath, html, 'utf-8');
    console.log(`  ${page.route || '/'} -> ${outputPath} (${(html.length / 1024).toFixed(0)}KB)`);
    count++;
  }

  // Property pages
  console.log('\nFetching properties from Hostaway...');
  const listings = await fetchProperties();
  console.log(`  Found ${listings.length} active listings`);

  for (const listing of listings) {
    const page = buildPropertyPage(
      listing,
      reviewCounts.get(listing.id) || { reviews: 0, rated: 0 },
    );
    const html = generatePage(page);
    const outputDir = join(DIST, page.route);
    mkdirSync(outputDir, { recursive: true });
    const outputPath = join(outputDir, 'index.html');
    writeFileSync(outputPath, html, 'utf-8');
    console.log(`  ${page.route} -> ${outputPath} (${(html.length / 1024).toFixed(0)}KB)`);
    count++;
  }

  console.log(`\nGenerated ${count} SEO pages (${PAGES.length} static + ${listings.length} properties).`);
}

main().catch(err => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
