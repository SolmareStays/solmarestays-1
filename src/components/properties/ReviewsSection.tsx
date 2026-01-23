import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronDown, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Review {
  id: string;
  guestName: string;
  rating: number;
  date: string;
  comment: string;
}

interface ReviewsSectionProps {
  propertyName: string;
  averageRating?: number | null;
}

// Sample reviews - in production these would come from Hostaway API
const sampleReviews: Review[] = [
  {
    id: '1',
    guestName: 'Sarah M.',
    rating: 5,
    date: '2025-12-15',
    comment: 'Absolutely stunning property! The views were incredible and the host was so responsive. Everything was spotless and exactly as described. We will definitely be back!',
  },
  {
    id: '2',
    guestName: 'Michael R.',
    rating: 5,
    date: '2025-11-28',
    comment: 'Perfect getaway spot. The location is unbeatable - walking distance to the beach and great restaurants. The bungalow had everything we needed.',
  },
  {
    id: '3',
    guestName: 'Jennifer L.',
    rating: 5,
    date: '2025-11-10',
    comment: 'We had an amazing stay! The property exceeded our expectations. So cozy and beautifully decorated. Kyle was an excellent host.',
  },
  {
    id: '4',
    guestName: 'David K.',
    rating: 4,
    date: '2025-10-22',
    comment: 'Great place for a weekend escape. Very clean and comfortable. Would recommend to anyone visiting Avila Beach.',
  },
  {
    id: '5',
    guestName: 'Emily T.',
    rating: 5,
    date: '2025-10-05',
    comment: 'This was our second stay and it was just as wonderful as the first. The fire pit is perfect for evening relaxation. Can\'t wait to return!',
  },
];

export function ReviewsSection({ propertyName, averageRating }: ReviewsSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'rating-high' | 'rating-low'>('date');

  const sortedReviews = useMemo(() => {
    const reviews = [...sampleReviews];
    switch (sortBy) {
      case 'rating-high':
        return reviews.sort((a, b) => b.rating - a.rating);
      case 'rating-low':
        return reviews.sort((a, b) => a.rating - b.rating);
      case 'date':
      default:
        return reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  }, [sortBy]);

  const visibleReviews = showAll ? sortedReviews : sortedReviews.slice(0, 3);
  const averageScore = averageRating ?? (sampleReviews.reduce((acc, r) => acc + r.rating, 0) / sampleReviews.length);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      id="reviews"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="scroll-mt-32"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">
            Guest Reviews
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${star <= Math.round(averageScore)
                      ? 'fill-gold text-gold'
                      : 'text-muted-foreground/30'
                    }`}
                />
              ))}
            </div>
            <span className="font-semibold text-foreground">{averageScore.toFixed(1)}</span>
            <span className="text-muted-foreground">({sampleReviews.length} reviews)</span>
          </div>
        </div>

        {/* Sort Dropdown */}
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
          <SelectTrigger className="w-[180px]">
            <ArrowUpDown className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Most Recent</SelectItem>
            <SelectItem value="rating-high">Highest Rating</SelectItem>
            <SelectItem value="rating-low">Lowest Rating</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {visibleReviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-secondary rounded-xl p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-medium text-foreground">{review.guestName}</p>
                <p className="text-sm text-muted-foreground">{formatDate(review.date)}</p>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${star <= review.rating
                        ? 'fill-gold text-gold'
                        : 'text-muted-foreground/30'
                      }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
          </motion.div>
        ))}
      </div>

      {/* View All Button */}
      {sampleReviews.length > 3 && (
        <Button
          variant="ghost"
          onClick={() => setShowAll(!showAll)}
          className="mt-4 gap-2"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${showAll ? 'rotate-180' : ''}`} />
          {showAll ? 'Show less' : `View all ${sampleReviews.length} reviews`}
        </Button>
      )}
    </motion.div>
  );
}
