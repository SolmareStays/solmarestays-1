import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Star, MapPin, Home, Award } from 'lucide-react';

interface CounterProps {
  from: number;
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

function AnimatedCounter({ from, to, duration = 2, suffix = '', prefix = '' }: CounterProps) {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (value) => Math.round(value));
  const [displayValue, setDisplayValue] = useState(from);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, to, { duration, ease: 'easeOut' });
      return controls.stop;
    }
  }, [isInView, count, to, duration]);

  useEffect(() => {
    const unsubscribe = rounded.on('change', (value) => setDisplayValue(value));
    return unsubscribe;
  }, [rounded]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{displayValue}{suffix}
    </span>
  );
}

const stats = [
  {
    icon: MapPin,
    value: 100,
    suffix: '%',
    label: 'Local',
    description: 'We Know This Coast By Heart',
    hasCounter: true,
  },
  {
    icon: Home,
    value: 10,
    suffix: '+',
    label: 'Properties',
    description: 'Curated Coastal Rentals',
    hasCounter: true,
  },
  {
    icon: Star,
    value: 5,
    suffix: '-Star',
    label: 'Rated',
    description: 'On All Booking Platforms',
    hasCounter: true,
  },
  {
    icon: Award,
    value: 500,
    suffix: '+',
    label: 'Happy Guests',
    description: 'And Counting',
    hasCounter: true,
  },
];

export function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <p className="font-serif text-2xl md:text-3xl text-foreground leading-relaxed font-light">
            Solmaré Stays offers curated, high-end vacation rentals along California’s Central Coast—delivering elevated coastal stays with style, comfort, and personalized hospitality.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 border-t border-border/40 pt-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.08 }}
              className="text-center"
            >
               {/* Icon - Subtle */}
               <div className="inline-flex items-center justify-center mb-4 text-muted-foreground">
                  <stat.icon className="w-5 h-5" strokeWidth={1.5} />
               </div>

                {/* Counter */}
                <div className="font-serif text-4xl lg:text-5xl font-medium text-foreground mb-2">
                  {stat.hasCounter ? (
                    <AnimatedCounter from={0} to={stat.value} suffix={stat.suffix} />
                  ) : (
                    <span>{stat.value}{stat.suffix}</span>
                  )}
                </div>

                {/* Label */}
                <div className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground/80 font-light">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
