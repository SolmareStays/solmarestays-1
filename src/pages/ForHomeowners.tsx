import { motion, useInView } from 'framer-motion';
import { usePage } from '@/hooks/useSanityContent';
import { SanitySectionRenderer } from '@/components/sanity/SanitySectionRenderer';
import { useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Link } from 'react-router-dom';
import { FaqSection } from '@/components/FaqSection';
import { OwnerLeadForm } from '@/components/OwnerLeadForm';
import { SEO } from '@/components/SEO';
import { REVIEWS, CONTACT, PORTFOLIO } from '@/data/stats';
import { PUBLISHED_MARKETS } from '@/data/markets';
import { Button } from '@/components/ui/button';
import { TrendingUp, Shield, Users, BarChart3, Calendar, Headphones, Check, Star, Quote } from 'lucide-react';


// 6 Pillars - Sharpened Copy
const benefits = [
  {
    icon: TrendingUp,
    title: 'Maximize Your Revenue',
    description: 'Dynamic pricing algorithms and direct-booking strategies designed to outperform the market average.',
  },
  {
    icon: Shield,
    title: 'Protect Your Investment',
    description: 'Strict guest screening and video-verified inspections after every stay ensure your home stays pristine.',
  },
  {
    icon: Users,
    title: 'Professional Guest Management',
    description: 'From inquiry to checkout, we handle 100% of guest communications with 24/7 local support.',
  },
  {
    icon: BarChart3,
    title: 'Transparent Reporting',
    description: "Real-time access to your financial performance and calendar. No hidden fees, no confusing statements.",
  },
  {
    icon: Calendar,
    title: 'Flexible Owner Access',
    description: "It's your home. Block dates for personal use whenever you want without penalty or hassle.",
  },
  {
    icon: Headphones,
    title: 'Dedicated Local Support',
    description: 'No call centers. You get direct access to our local team who knows your property inside and out.',
  },
];

// Owner testimonials - 3 cards as specified
const ownerReviews = [
  {
    name: 'Chad V., Owner',
    property: 'La Casita | Avila Beach',
    stats: ['+22% ADR Lift', '4.9★ Rating'],
    rating: 5,
    text: 'Our experience with Solmaré Stays has been exceptional. Their attentive service, transparency, and deep market insight make vacation rental ownership truly hands-off for us. They are incredibly responsive and detail-oriented, consistently going above and beyond to ensure everything runs smoothly. After previously using another local company, the difference is clear—this has been a far superior, easier, and more professional experience in every way.',
  },
  {
    name: 'Jane M., Owner',
    property: 'The Hummingbird | Avila Beach',
    stats: ['+31% Occupancy', '+42% Profit Increase'],
    rating: 5,
    text: 'Solmaré Stays has done an amazing job managing Hummingbird House. The team handles all aspects of property management for me — bookings, cleaning, refilling supplies, and troubleshooting. The whole process is hands-off for me, and I get an organized revenue summary each month.',
  },
];

// Comprehensive Services - 5 Columns
const serviceCategories = [
  {
    title: 'Listing & Marketing',
    items: [
      'Professional photography coordination',
      'Listing creation and optimization',
      'Multi-platform distribution (Airbnb, Vrbo, Direct)',
      'Ongoing listing updates',
    ],
  },
  {
    title: 'Pricing & Revenue',
    items: [
      'Dynamic pricing adjustments',
      'Seasonal strategy',
      'Length-of-stay optimization',
      'Tax collection and remittance',
    ],
  },
  {
    title: 'Guest Management',
    items: [
      'Strict guest screening',
      '24/7 guest communication',
      'Check-in/out coordination',
      'Concierge support',
    ],
  },
  {
    title: 'Cleaning & Maintenance',
    items: [
      'Professional cleaning coordination',
      'Linen and laundry management',
      'Pre-arrival inspections',
      'Routine maintenance coordination',
    ],
  },
  {
    title: 'Owner Reporting',
    items: [
      'Monthly financial statements',
      'Real-time calendar visibility',
      'Owner portal access',
    ],
  },
];

/**
 * What an owner actually wants to know, in the order they ask it.
 *
 * ⚖ `short` is visible while collapsed — a scanner should get the real answer without
 * opening anything. `body` is the detail, and carries the links out to the market pages
 * and guides so this section feeds the rest of the site rather than dead-ending.
 * ⛔ Keep `short` to one sentence. If it needs two, the answer is too complicated.
 */
const OWNER_ANSWERS: { q: string; short: string; body: JSX.Element }[] = [
  {
    q: 'What does it cost?',
    short: '18% of net rental revenue — not the gross a guest pays.',
    body: (
      <>
        <p>
          Our fee comes off <strong>after</strong> lodging tax, the cleaning fee and any
          pet fee, because those are pass-throughs rather than income. Plenty of managers
          quote a lower-sounding rate and charge it against the full amount the guest
          paid — run both on the same booking before you compare them.
        </p>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
          <li>No onboarding fee and no monthly minimum</li>
          <li>No charge on nights you block for yourself</li>
          <li>We only earn when the property does</li>
        </ul>
        <p className="text-muted-foreground">
          Terms flex a little with scope and channel mix, and whatever we agree goes in
          writing before you commit to anything.
        </p>
      </>
    ),
  },
  {
    q: 'I already have a short-term rental permit. How hard is it to switch?',
    short: 'Easier than most owners expect — the permit stays in your name.',
    body: (
      <>
        <p>
          This is the most common way owners join us. We operate underneath your existing
          permit and handle the channel migration, the calendar, the crew and the tax
          filings. Most homes are live with us inside a week.
        </p>
        <p>
          It matters more than it used to. Pismo Beach has issued no new residential
          licence since November 2023 and Paso Robles non-hosted permits are at capacity,
          so in several markets an existing permit is the whole ballgame.{' '}
          <Link to="/vacation-rental-management" className="underline">
            See the permit status for every city
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    q: 'Which areas do you cover?',
    short: 'All of San Luis Obispo County, from our base in Pismo Beach.',
    body: (
      <>
        <p>
          Avila Beach and Arroyo Grande are where the current portfolio sits, but we work
          with owners across the county and we want to hear from you wherever your
          property is:
        </p>
        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1 list-disc pl-5">
          {PUBLISHED_MARKETS.map(m => (
            <li key={m.slug}>
              <Link to={`/vacation-rental-management/${m.slug}`} className="underline">
                {m.name}
              </Link>
            </li>
          ))}
        </ul>
        <p className="text-muted-foreground">
          One catch worth knowing: city limits and unincorporated county lines don't
          follow mailing addresses. A home addressed as Arroyo Grande or Paso Robles is
          often permitted by the County instead, under completely different rules.
        </p>
      </>
    ),
  },
  {
    q: 'Can I still get a permit where my property is?',
    short: 'Depends entirely on the jurisdiction — some are open, several are frozen.',
    body: (
      <>
        <p>
          The unincorporated county — Avila Beach, Cayucos, Cambria — still issues new
          vacation rental clearances. Pismo Beach and Morro Bay are not issuing any. Paso
          Robles non-hosted permits are at capacity, and Los Osos is capped at fifty for
          the whole community.
        </p>
        <p>
          We'll tell you plainly which bucket your address falls into before anything
          else.{' '}
          <Link to="/vacation-rental-management" className="underline">
            Permit status and lodging tax by city
          </Link>
          , or read the{' '}
          <Link to="/blog/slo-county-short-term-rental-rules" className="underline">
            SLO County short-term rental rules guide
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    q: 'What do you actually do day to day?',
    short: 'Listing and pricing, guests, cleaning, maintenance — plus a guest concierge.',
    body: (
      <>
        <p>
          Professional photography, listing copy written for the house rather than a
          template, dynamic nightly pricing, strict guest screening, 24/7 guest
          communication, cleaning and linen coordination, an in-person inspection between
          every stay, maintenance, and monthly owner statements.
        </p>
        {/* 🔴 CONCIERGE BRIGHT LINE — name only things that don't move. The CA Seller of
            Travel Act hooks on TRANSPORTATION and catches you for merely ADVERTISING it.
            ⛔ Never add flights, transfers, car service, van wine tours or charters. */}
        <p>
          Guests also get a concierge: restaurant reservations, winery tastings, private
          chefs, in-home massage, surf and hiking guides, photographers, and the house
          stocked before they arrive. It's a real reason guests come back and{' '}
          <Link to="/collection" className="underline">
            book direct
          </Link>{' '}
          — the channel that costs you least.
        </p>
      </>
    ),
  },
  {
    q: 'What happens after I send the form?',
    short: 'I reply within 24 hours, then we check what your address actually allows.',
    body: (
      <>
        <ol className="list-decimal pl-5 space-y-2">
          <li>I reply within 24 hours — me, not a shared inbox.</li>
          <li>
            We confirm which jurisdiction governs your address and what it permits.
          </li>
          <li>
            You get a revenue projection built from real local comparables and realistic
            occupancy for the property's size and location — not a best case.
          </li>
          <li>If it fits for both of us, we talk terms. If it doesn't, I'll say so.</li>
        </ol>
        <p className="text-muted-foreground">
          No cost, no obligation, and we never sell or share your details.
        </p>
      </>
    ),
  },
  {
    q: "What if I'm not looking to hire anyone?",
    short: 'Ask anyway — we help owners across the county with no strings.',
    body: (
      <p>
        We'd rather this area be run well than run by us. A second opinion on your
        nightly rates, whether a property pencils before you buy it, or simply which
        jurisdiction governs an address and what it allows — send the note or call{' '}
        <a href={CONTACT.phoneHref} className="underline">
          {CONTACT.phone}
        </a>
        . There's no expectation of anything after that.
      </p>
    ),
  },
];

const ForHomeownersPage = () => {
  const { data: pageData, isLoading } = usePage('management');
  const showSanityContent = !isLoading && pageData?.sections?.length > 0;

  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  const benefitsRef = useRef(null);
  const isBenefitsInView = useInView(benefitsRef, { once: true, margin: '-100px' });

  const testimonialsRef = useRef(null);
  const isTestimonialsInView = useInView(testimonialsRef, { once: true, margin: '-100px' });

  const servicesRef = useRef(null);
  const isServicesInView = useInView(servicesRef, { once: true, margin: '-100px' });

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={pageData?.title || "Vacation Rental Property Management — Avila Beach"}
        description={pageData?.metaDescription || "Partner with Solmaré Stays to maximize your rental revenue on California's Central Coast. Full-service property management in Avila Beach, Pismo Beach, and SLO County. See your revenue projection."}
        breadcrumbs={[
          { name: 'Home', url: 'https://www.solmarestays.com/' },
          { name: 'Property Management', url: 'https://www.solmarestays.com/management' },
        ]}
      />
      <Header />
      <main>
        {showSanityContent ? (
          <div className="pt-32">
            <SanitySectionRenderer sections={pageData.sections} />
          </div>
        ) : (
          <>
            {/* SECTION 1: Hero */}
            <section ref={heroRef} className="relative h-[82vh] min-h-[550px] flex items-center overflow-hidden">
              {/* 🔴 LCP element. Measured 9.5s on mobile 2026-09-24, which is why every
                  Owner keyword scored post_click_quality_score = BELOW_AVERAGE, QS 1-3 and
                  a $2.49 CPC while /avila-beach (3.6s) scored QS 8-10. Three rules here:

                  1. Plain <img> inside <picture>, never motion.img. framer-motion defers
                     the element past hydration, so the preload scanner never sees it.
                     The zoom is CSS (hero-zoom) and animates the wrapper instead.
                  2. fetchpriority="high" + eager. This is the one image on the page that
                     must not wait behind anything.
                  3. AVIF first, then WebP, then JPEG. 768w AVIF is 39KB against the old
                     329KB single JPEG. Regenerate from public/_originals/homeowners/ if
                     the art changes — do not ship a bare .jpg back into this slot.

                  index.html injects a matching rel=preload for /management during HTML
                  parse, before React boots. Keep the srcset in the two files in sync. */}
              <div className="absolute inset-0 hero-zoom">
                <picture>
                  <source
                    type="image/avif"
                    srcSet="/homeowners/management-hero-768.avif 768w, /homeowners/management-hero-1280.avif 1280w, /homeowners/management-hero-1920.avif 1920w"
                    sizes="100vw"
                  />
                  <source
                    type="image/webp"
                    srcSet="/homeowners/management-hero-768.webp 768w, /homeowners/management-hero-1280.webp 1280w, /homeowners/management-hero-1920.webp 1920w"
                    sizes="100vw"
                  />
                  <img
                    src="/homeowners/management-hero-1280.jpg"
                    alt="Coastal property managed by Solmaré Stays in Avila Beach"
                    className="w-full h-full object-cover"
                    width={1280}
                    height={853}
                    fetchPriority="high"
                    loading="eager"
                    decoding="async"
                  />
                </picture>
              </div>

              <div className="absolute bottom-6 left-6 md:bottom-[55%] md:-translate-y-[-50%] md:left-16 w-[calc(100%-3rem)] md:w-auto bg-white/10 backdrop-blur-md p-6 md:p-10 rounded-[2rem] shadow-2xl border border-white/15">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8 }}
                >
                  {/* H1 leads with the service + place so it matches the search that
                      paid for the click. The brand line keeps its place directly below —
                      moving it out of the h1 is what lifted landing-page relevance. */}
                  <h1 className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] font-semibold leading-tight text-white mb-3">
                    Vacation Rental<br />
                    Property Management
                    <span className="block text-lg md:text-xl lg:text-2xl font-normal text-white/90 mt-2">
                      in San Luis Obispo County
                    </span>
                  </h1>
                  <p className="text-base md:text-lg text-white/80 leading-relaxed mb-6 max-w-lg">
                    <span className="block font-serif text-lg md:text-xl text-white mb-2">
                      Twelve houses, chosen one at a time.
                    </span>
                    {/* 🔴 Read the count before editing: ten + two = twelve, and it must
                        match config.py:PROPERTY_MAP. This line said "one in San Luis Obispo"
                        until 2026-09-24 — a leftover from Monterey Heights, which left the
                        portfolio on 9/4 — so the breakdown summed to thirteen while the
                        sentence above it said twelve, on the landing page every Owner ad
                        points at. */}
                    Ten in Avila Beach, two in Arroyo Grande. Same crew, same pricing engine, same person answering at nine at night.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="default" size="xl" asChild>
                      <a href="#contact-form">Get Your Revenue Projection</a>
                    </Button>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* SECTION 2: Comprehensive Management */}
            <section ref={servicesRef} className="section-padding bg-secondary">
              <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isServicesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8 }}
                  className="text-center max-w-3xl mx-auto mb-16"
                >
                  <h2 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-4 uppercase">
                    Comprehensive Management
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    We handle every operational detail required to run a successful short-term rental.
                  </p>
                </motion.div>

                {/* 5-Column Service Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                  {serviceCategories.map((category, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={isServicesInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-card p-6 rounded-xl shadow-soft"
                    >
                      <h3 className="font-serif text-lg font-semibold text-foreground mb-4 pb-3 border-b border-border">
                        {category.title}
                      </h3>
                      <ul className="space-y-3">
                        {category.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Check className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 3: Owner Reviews */}
            <section ref={testimonialsRef} className="section-padding bg-background">
              <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isTestimonialsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8 }}
                  className="text-center max-w-2xl mx-auto mb-16"
                >
                  <h2 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-4">
                    Real Results
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    Hear from property owners who have partnered with Solmaré Stays.
                  </p>
                </motion.div>

                {/* 3 Cards Horizontally */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {ownerReviews.map((review, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={isTestimonialsInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-elevated transition-shadow duration-300 flex flex-col"
                    >
                      {/* Header */}
                      <div className="mb-4">
                        <h3 className="font-serif text-lg font-semibold text-foreground mb-3">{review.property}</h3>
                        {/* Blue Data Badges */}
                        <div className="flex flex-wrap gap-2">
                          {review.stats.map((stat, i) => (
                            <span key={i} className="text-xs font-medium text-ocean bg-ocean/10 px-3 py-1 rounded-full">
                              {stat}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'fill-gold text-gold' : 'text-muted-foreground/30'
                              }`}
                          />
                        ))}
                      </div>

                      {/* Review Text */}
                      <div className="flex-grow">
                        <p className="text-foreground text-sm leading-relaxed mb-6 font-light">
                          "{review.text}"
                        </p>
                      </div>

                      {/* Reviewer Info */}
                      <div className="border-t border-border pt-4 mt-auto">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-ocean/10 flex items-center justify-center flex-shrink-0">
                            <Quote className="w-5 h-5 text-ocean" />
                          </div>
                          <p className="font-semibold text-foreground text-sm">{review.name}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 5: Why Partner With Solmaré */}
            <section ref={benefitsRef} className="section-padding bg-secondary relative">
              <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">

                  {/* Left Content - Sticky */}
                  <div className="lg:sticky lg:top-32 h-fit mb-12 lg:mb-0">
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      animate={isBenefitsInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.8 }}
                    >
                      <h2 className="font-serif text-3xl md:text-5xl font-semibold text-foreground mb-6 leading-tight">
                        Why Partner With Solmaré?
                      </h2>
                      <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                        We treat your home as a high-performing asset, not just inventory. By combining local stewardship with sophisticated revenue strategies, we deliver higher net income and better property care than large, impersonal management firms.
                      </p>
                      <Button variant="default" size="lg" asChild className="rounded-full">
                        <a href="#contact-form">Get Your Revenue Projection</a>
                      </Button>
                    </motion.div>
                  </div>

                  {/* Right Benefits - 2x3 Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {benefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        animate={isBenefitsInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
                        className="bg-card p-6 rounded-2xl shadow-soft border border-border/50"
                      >
                        <div className="w-10 h-10 rounded-full bg-ocean/10 flex items-center justify-center mb-4">
                          <benefit.icon className="w-5 h-5 text-ocean" />
                        </div>
                        <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                          {benefit.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {benefit.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                </div>
              </div>
            </section>
            {/*
            {/*
              SECTION 5b: who we are, then the answers — in that order.

              ⚖ Kyle 2026-09-30: "main about me section ... the other sections should have
              a main line or two and is collapsable ... information based on what the
              visitor is looking for, external links to other pages."

              So: the About block stays open and does the selling; everything else is a
              native <details> whose SUMMARY already carries the one-line answer, so a
              scanner gets the whole picture without opening anything.

              🔴 Native <details>, never Radix Accordion — Radix UNMOUNTS collapsed
              content, which would hide this copy from Google entirely. <details> keeps
              it in the DOM. Same rule as FaqSection.
            */}
            <section className="section-padding bg-background border-t">
              <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">

                  {/* ── Who we are ── */}
                  <div className="grid md:grid-cols-[180px_1fr] gap-8 md:gap-10 items-start">
                    <picture>
                      <source
                        type="image/webp"
                        srcSet="/team/kyle-van-til-400.webp 400w, /team/kyle-van-til-800.webp 800w"
                        sizes="180px"
                      />
                      <img
                        src="/team/kyle-van-til-400.jpg"
                        alt="Kyle Van Til, founder of Solmaré Stays, Pismo Beach"
                        width={400}
                        height={400}
                        loading="lazy"
                        decoding="async"
                        className="w-36 h-36 md:w-44 md:h-44 rounded-full object-cover"
                      />
                    </picture>
                    <div>
                      <p className="text-xs tracking-[0.18em] uppercase text-muted-foreground mb-2">
                        Who we are
                      </p>
                      <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">
                        A small team on the coast, doing the work ourselves
                      </h2>
                      <p className="text-base md:text-lg leading-relaxed mb-4">
                        I'm Kyle Van Til. I run Solmaré Stays out of Pismo Beach with a
                        small team that works this stretch of coast every day — no call
                        centre, no regional office, no account managers. Between us we
                        handle the guest messages, the turnovers, the inspections and the
                        maintenance calls, and when something goes wrong at nine at night
                        it's one of us who picks up.
                      </p>
                      <p className="text-base md:text-lg leading-relaxed mb-6">
                        We look after {PORTFOLIO.properties} homes — {PORTFOLIO.avilaBeach}{' '}
                        in Avila Beach, {PORTFOLIO.arroyoGrande} in Arroyo Grande wine
                        country — and we take on design-led, higher-end properties across
                        San Luis Obispo County. Being hands-on is the whole model: every
                        home gets inspected in person between stays, not photographed by a
                        contractor and signed off remotely.
                      </p>
                      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4 text-sm border-t pt-5">
                        <div>
                          <dt className="text-muted-foreground mb-0.5">Based in</dt>
                          <dd className="font-semibold">Pismo Beach</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground mb-0.5">Homes managed</dt>
                          <dd className="font-semibold">{PORTFOLIO.properties}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground mb-0.5">Guest reviews</dt>
                          <dd className="font-semibold">
                            {REVIEWS.totalRounded} · {REVIEWS.averageFive}/5
                          </dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground mb-0.5">Direct line</dt>
                          <dd className="font-semibold">
                            <a href={CONTACT.phoneHref} className="hover:underline">
                              {CONTACT.phone}
                            </a>
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  {/* ── The answers, collapsed ── */}
                  <div className="mt-14 pt-10 border-t">
                    <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-2">
                      The questions owners actually ask
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Short answer on every one. Open it for the detail.
                    </p>

                    <div className="divide-y border-t border-b">
                      {OWNER_ANSWERS.map(({ q, short, body }, i) => (
                        <details key={q} open={i === 0} className="group py-4">
                          <summary className="cursor-pointer list-none flex items-start justify-between gap-4">
                            <span>
                              <span className="block font-semibold text-base md:text-lg mb-1">
                                {q}
                              </span>
                              <span className="block text-muted-foreground text-sm md:text-base">
                                {short}
                              </span>
                            </span>
                            <span
                              aria-hidden="true"
                              className="mt-1 flex-none text-xl leading-none opacity-50 transition-transform group-open:rotate-45"
                            >
                              +
                            </span>
                          </summary>
                          <div className="pt-4 pb-1 pr-8 space-y-3 leading-relaxed">
                            {body}
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* SECTION 6: Inline Lead Capture Form */}
            <section id="contact-form" className="section-padding bg-background">
              <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-10"
                  >
                    <h2 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-4">
                      Get Your Revenue Projection
                    </h2>
                    <p className="text-muted-foreground text-lg">
                      Tell us about your property and we'll put together a free earnings estimate.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-card p-8 md:p-10 rounded-2xl shadow-elevated"
                  >
                    <OwnerLeadForm />
                  </motion.div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
      <FaqSection route="/management" />
      <Footer />
    </div>
  );
};

export default ForHomeownersPage;
