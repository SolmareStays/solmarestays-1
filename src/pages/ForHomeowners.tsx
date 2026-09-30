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
import { REVIEWS, CONTACT } from '@/data/stats';
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
              SECTION 5b: Who you are actually hiring.
              🔴 The whole site named no human being — a case-insensitive search for
              "kyle" on the rendered page returned false. This page holds position 10.4
              for "avila beach property management" and converted 0 of 107 landing-page
              views in 30 days, while every owner who has ever signed came through a
              personal introduction. An owner is being asked to hand over a house worth
              close to a million dollars; an anonymous brand is the wrong thing to ask
              that of, and it is the most likely reason this page does not convert.
              ⏳ Kyle: a headshot at public/kyle-van-til.jpg slots in here. Deliberately
              omitted rather than shipped as a broken <img>.
            */}
            <section className="section-padding bg-background border-t">
              <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                  <p className="text-xs tracking-[0.18em] uppercase text-muted-foreground mb-3">
                    Who you are hiring
                  </p>
                  <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-6">
                    You deal with me, not an account manager
                  </h2>
                  <div className="space-y-4 text-base md:text-lg leading-relaxed">
                    <p>
                      I'm Kyle Van Til. I run Solmaré Stays from Avila Beach, where ten
                      of our twelve houses are. I am not a call centre and there is no
                      regional office — when something goes wrong at your property at
                      nine at night, I am the person who answers.
                    </p>
                    <p>
                      I started this because the choice for owners here was a national
                      company that treats a house as inventory, or doing it all yourself.
                      We took on twelve homes one at a time, and we turn down properties
                      we cannot service properly — Cambria is 55 minutes from our crew,
                      and I would rather say that than promise same-day maintenance I
                      cannot deliver.
                    </p>
                    <p>
                      What that has produced so far: {REVIEWS.totalRounded} guest reviews
                      averaging {REVIEWS.averageFive} out of 5 across Airbnb, Vrbo and
                      Google, an in-person inspection between every single stay, and
                      owners who can block their own dates whenever they want.
                    </p>
                  </div>

                  <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 pt-8 border-t">
                    <div>
                      <dt className="text-sm text-muted-foreground mb-1">Response time</dt>
                      <dd className="font-semibold">Within 24 hours, always</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground mb-1">Direct line</dt>
                      <dd className="font-semibold">
                        <a href={CONTACT.phoneHref} className="hover:underline">
                          {CONTACT.phone}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground mb-1">Based in</dt>
                      <dd className="font-semibold">Avila Beach, California</dd>
                    </div>
                  </dl>

                  <div className="mt-8 pt-8 border-t">
                    <h3 className="font-serif text-2xl font-semibold mb-4">
                      What happens after you send the form
                    </h3>
                    <ol className="space-y-3 list-decimal pl-5 leading-relaxed">
                      <li>
                        I reply within 24 hours — to you, not from a shared inbox.
                      </li>
                      <li>
                        I check what your address can actually be permitted for. Rules
                        differ by jurisdiction across SLO County, and in some markets new
                        short-term rental permits are not being issued at all — see the{' '}
                        <Link to="/vacation-rental-management" className="underline">
                          permit status by city
                        </Link>
                        .
                      </li>
                      <li>
                        You get a revenue projection built from comparable local
                        performance and realistic occupancy for your property's size and
                        location — not a best case.
                      </li>
                      <li>
                        If it makes sense for both of us, we talk terms. If it does not,
                        I will tell you that instead.
                      </li>
                    </ol>
                    <p className="text-sm text-muted-foreground mt-5">
                      No cost, no obligation, and we do not sell or share your details.
                    </p>
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
