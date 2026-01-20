import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section-padding bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="waves" patternUnits="userSpaceOnUse" width="40" height="20" patternTransform="rotate(10)">
            <path d="M0 10 Q10 0, 20 10 T40 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#waves)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-serif text-3xl md:text-4xl font-medium mb-5"
          >
            Ready for Your Coastal Escape?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg opacity-85 mb-8 font-light"
          >
            Book directly with us for personalized service and exclusive local perks.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-lg px-8"
              asChild
            >
              <Link to="/collection">Browse Properties</Link>
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="text-primary-foreground hover:text-primary-foreground hover:bg-primary-foreground/10 rounded-lg px-8"
              asChild
            >
              <Link to="/contact">Get In Touch</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
