import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex flex-col items-start gap-1 mb-6 group">
              <div className="relative mb-2">
                <svg
                  viewBox="0 0 48 48"
                  className="w-10 h-10 md:w-12 md:h-12 text-primary-foreground transition-transform duration-300 group-hover:scale-105"
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
              <div className="flex flex-col leading-none">
                <span className="font-serif text-xl font-semibold tracking-wider text-primary-foreground">
                  SOLMARÉ
                </span>
                <span className="text-[10px] tracking-[0.3em] opacity-70 uppercase mt-1">
                  STAYS
                </span>
              </div>
            </Link>
            <p className="text-sm opacity-80 leading-relaxed max-w-xs">
              Where the Sun Meets the Sea in Style. Boutique vacation rentals on California's Central Coast.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Explore</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/collection" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  The Collection
                </Link>
              </li>
              <li>
                <Link to="/why-choose-us" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Why Choose Us
                </Link>
              </li>
              <li>
                <Link to="/for-homeowners" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  For Homeowners
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Services & Partners
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm opacity-80">
                <Mail className="w-4 h-4" />
                <a href="mailto:hello@solmarestays.com" className="hover:opacity-100 transition-opacity">
                  hello@solmarestays.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm opacity-80">
                <Phone className="w-4 h-4" />
                <a href="tel:+18055551234" className="hover:opacity-100 transition-opacity">
                  (805) 555-1234
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm opacity-80">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>Avila Beach & San Luis Obispo, CA</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-70">
            <p>© {new Date().getFullYear()} Solmaré Stays. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:opacity-100 transition-opacity">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:opacity-100 transition-opacity">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
