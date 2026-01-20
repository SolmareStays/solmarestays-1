import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: 'Paul',
    date: 'March 2025',
    property: 'Coral House',
    rating: 5,
    text: 'Such a great place to stay! Kyle was an excellent host that helped us out with everything we might need to enjoy our trip to Avila. Would definitely stay here again.',
  },
  {
    id: 2,
    name: 'Chasity',
    date: 'Feb 2025',
    property: 'Pine House',
    rating: 5,
    text: 'Beautiful stay! 30 second walk to the beach! Super clean and plenty of amenities for a few nights. I will definitely be going back and Kyle was a great host!',
  },
  {
    id: 3,
    name: 'Sarah',
    date: 'Jan 2025',
    property: 'Ocean View Retreat',
    rating: 5,
    text: 'The perfect getaway! The property was immaculate, the views were breathtaking, and the attention to detail made us feel right at home. We can\'t wait to return!',
  },
];

export function ReviewsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section-padding bg-secondary/50">
      <div className="container mx-auto px-6 md:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-3">
            Guest Reviews
          </h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto font-light">
            Hear what our guests have to say about their coastal getaways.
          </p>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
              className="bg-card rounded-xl p-6 shadow-soft border border-border/30 hover:shadow-medium transition-shadow duration-300"
            >
              {/* Stars - Minimal */}
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < review.rating ? 'fill-gold text-gold' : 'text-muted-foreground/20'
                    }`}
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-foreground text-sm leading-relaxed mb-5 font-light">
                "{review.text}"
              </p>

              {/* Reviewer Info */}
              <div className="pt-4 border-t border-border/50">
                <p className="font-medium text-foreground text-sm">{review.name}</p>
                <p className="text-xs text-muted-foreground">
                  {review.property} • {review.date}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
