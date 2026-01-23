import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import heroImage1 from '/home/home-12.jpg'
import heroImage2 from '/home/home-29.jpg'
import heroImage3 from '/home/home-09.jpg'

const slides = [
  { image: heroImage1, alt: 'Luxury coastal living room' },
  { image: heroImage2, alt: 'California Central Coast pier' },
  { image: heroImage3, alt: 'Coastal bedroom with ocean view' },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Full Screen Image Slider */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0"
          >
              <img
              src={slides[currentSlide].image}
              alt={slides[currentSlide].alt}
              className="w-full h-full object-cover"
            />
            {/* Subtle overlay for text contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content Box - Clean Minimalist Card */}
      <div className="absolute bottom-8 left-4 right-4 md:right-auto md:bottom-24 md:left-16 z-20 md:max-w-lg lg:max-w-xl bg-white p-8 md:p-10 rounded-2xl shadow-medium">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-normal text-foreground leading-tight mb-3 tracking-tight">
            Solmaré Stays
          </h1>
          <p className="text-muted-foreground text-base md:text-lg font-light tracking-wide mb-6">
            Where the Sun Meets the Sea in Style
          </p>

          <div className="flex flex-wrap gap-3">
            <Button
              size="default"
              className="bg-foreground text-white hover:bg-foreground/90 rounded-lg px-6 h-11 text-sm font-medium transition-all"
              asChild
            >
              <Link to="/collection">Explore Properties</Link>
            </Button>
            <Button
              variant="ghost"
              size="default"
              className="text-foreground hover:text-primary hover:bg-transparent px-6 h-11 text-sm font-medium transition-all"
              asChild
            >
              <Link to="/why-choose-us">Learn More</Link>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Navigation Controls - Minimal */}
      <div className="absolute bottom-10 right-8 z-20 flex gap-2">
        <button
          onClick={prevSlide}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors duration-200"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors duration-200"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Slide Indicators - Subtle */}
      <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white w-8' : 'bg-white/40 w-3'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
