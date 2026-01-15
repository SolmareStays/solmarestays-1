import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { TrendingUp, Shield, Users, BarChart3, Calendar, Headphones, Check } from 'lucide-react';
import homeownersHeroImage from '@/assets/homeowners-hero.jpg';
import propertyHummingbird from '@/assets/property-hummingbird.jpg';

const benefits = [
  {
    icon: TrendingUp,
    title: 'Maximize Your Revenue',
    description: 'Our dynamic pricing strategies and marketing expertise ensure your property achieves optimal occupancy and nightly rates.',
  },
  {
    icon: Shield,
    title: 'Protect Your Investment',
    description: 'We treat your home like our own—with rigorous guest screening, comprehensive insurance, and meticulous property care.',
  },
  {
    icon: Users,
    title: 'Professional Guest Management',
    description: '24/7 guest communication, seamless check-ins, and immediate response to any concerns or emergencies.',
  },
  {
    icon: BarChart3,
    title: 'Transparent Reporting',
    description: 'Real-time dashboards and monthly statements keep you informed about your property\'s performance.',
  },
  {
    icon: Calendar,
    title: 'Flexible Owner Access',
    description: 'Use your property whenever you want. Our booking system makes it easy to block dates for personal use.',
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    description: 'A personal account manager who knows your property inside and out, always just a call away.',
  },
];

const services = [
  'Professional photography & listing optimization',
  'Dynamic pricing & revenue management',
  'Guest screening & communication',
  'Professional cleaning & linen service',
  'Maintenance coordination & inspections',
  'Financial reporting & tax documents',
  'Interior design consultation',
  '24/7 emergency response',
];

const ForHomeownersPage = () => {
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  const benefitsRef = useRef(null);
  const isBenefitsInView = useInView(benefitsRef, { once: true, margin: '-100px' });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section - Full Screen */}
        {/* Hero Section - Full Screen */}
        <section ref={heroRef} className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <motion.img
              src={homeownersHeroImage}
              alt="Coastal property"
              className="w-full h-full object-cover"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>

          {/* Content Box */}
          <div className="absolute bottom-0 left-0 w-full md:w-[600px] lg:w-[700px] bg-white pt-12 pb-10 pr-12 pl-4 md:pl-8 lg:pl-16 rounded-tr-[3rem]">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="max-w-xl"
            >
              <span className="inline-block text-sm font-semibold tracking-widest text-muted-foreground uppercase mb-4">For Property Owners</span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-foreground mb-6">
                Elevate Your Property.<br />
                Maximize Your Returns.
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Partner with Solmaré Stays and transform your Central Coast property into a
                high-performing vacation rental. We handle everything—so you can enjoy the
                returns without the work.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="default" size="xl" asChild>
                  <Link to="/contact">Schedule a Consultation</Link>
                </Button>
                <Button variant="outline" size="xl" asChild>
                  <Link to="/services">Our Services</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Benefits Grid - Stacking Cards */}
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
                    Why Partner With Us?
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                    We bring hospitality expertise, local knowledge, and meticulous attention
                    to detail to every property we manage. Our approach ensures your home is
                    cared for and your revenue is optimized.
                  </p>
                  <Button variant="default" size="lg" asChild className="rounded-full">
                    <Link to="/contact">Schedule a Consultation</Link>
                  </Button>
                </motion.div>
              </div>

              {/* Right Benefits - Stacking Cards */}
              <div className="relative flex flex-col gap-8 pb-12">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={isBenefitsInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                    className="bg-card p-8 md:p-12 rounded-3xl shadow-lg border border-border/50 sticky top-24 lg:top-32 min-h-[300px] flex flex-col justify-center"
                  >
                    <div className="flex flex-col gap-6">
                      <div className="w-14 h-14 rounded-full bg-ocean/10 flex items-center justify-center shrink-0">
                        <benefit.icon className="w-7 h-7 text-ocean" />
                      </div>
                      <div>
                        <h3 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-4">
                          {benefit.title}
                        </h3>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* Full Service */}
        <section className="section-padding bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-6">
                  Full-Service Management
                </h2>
                <p className="text-primary-foreground/80 text-lg mb-8">
                  From listing creation to guest checkout, we handle every aspect of your
                  vacation rental business. Our comprehensive approach ensures nothing falls
                  through the cracks.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {services.map((service, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <Check className="w-5 h-5 text-gold flex-shrink-0" />
                      <span className="text-sm">{service}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <img
                  src={propertyHummingbird}
                  alt="Beautifully managed property"
                  className="rounded-2xl shadow-elevated"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-background">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Let's discuss how Solmaré Stays can help you achieve your rental property goals.
                Schedule a free consultation today.
              </p>
              <Button variant="hero" size="xl" asChild>
                <Link to="/contact">Contact Us Today</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ForHomeownersPage;
