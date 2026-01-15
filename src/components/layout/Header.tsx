import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/collection', label: 'The Collection' },
  { href: '/why-choose-us', label: 'Why Choose Us' },
  { href: '/for-homeowners', label: 'For Homeowners' },
  { href: '/services', label: 'Services & Partners' },
  { href: '/contact', label: 'Get In Touch' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/95 backdrop-blur-md shadow-sm py-4`}
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex flex-col items-center group">
              <div className="relative mb-1">
                <svg
                  viewBox="0 0 48 48"
                  className="w-8 h-8 md:w-10 md:h-10 text-primary transition-transform duration-300 group-hover:scale-105"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                >
                   {/* Sun centered */}
                   <circle cx="24" cy="18" r="7" />
                   {/* Waves below */}
                   <path d="M10 32 C16 30, 22 34, 28 32 C34 30, 40 34, 46 32" strokeLinecap="round" />
                   <path d="M10 38 C16 36, 22 40, 28 38 C34 36, 40 40, 46 38" strokeLinecap="round" />
                   {/* Circle container */}
                   <circle cx="24" cy="24" r="22" strokeWidth="1" />
                </svg>
              </div>
              <div className="flex flex-col items-center leading-none">
                <span className="font-serif text-lg font-semibold tracking-wider text-primary">
                  SOLMARÉ
                </span>
                <span className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase mt-0.5">
                  STAYS
                </span>
              </div>
            </Link>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 absolute left-1/2 transform -translate-x-1/2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`relative group text-sm xl:text-base font-normal transition-colors hover:text-primary ${
                    location.pathname === link.href
                      ? 'text-primary'
                      : 'text-foreground/80'
                  }`}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 w-0 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Book Now Button */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="lg"
                className="hidden md:flex border-foreground/20 text-foreground hover:bg-foreground hover:text-white px-8"
                asChild
              >
                <Link to="/book">Book Now</Link>
              </Button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-background shadow-elevated p-6 pt-28"
            >
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`block px-4 py-2 text-lg font-medium transition-colors hover:text-primary ${
                      location.pathname === link.href
                        ? 'text-primary'
                        : 'text-foreground'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-8 pt-6 border-t border-border">
                  <Button variant="outline" size="lg" className="w-full border-foreground/20" asChild>
                    <Link to="/book">Book Now</Link>
                  </Button>
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
