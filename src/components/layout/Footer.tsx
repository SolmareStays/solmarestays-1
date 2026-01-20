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
                <img
                  src="/footerlogo.avif"
                  alt="Solmaré Stays"
                  className="w-24 h-24 md:w-32 md:h-32 object-contain bg-white rounded-xl p-2 transition-transform duration-300 group-hover:scale-105"
                />
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
                <a href="mailto:info@solmarestays.com" className="hover:opacity-100 transition-opacity">
                  info@solmarestays.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm opacity-80">
                <Phone className="w-4 h-4" />
                <a href="tel:+18058016429" className="hover:opacity-100 transition-opacity">
                  (805) 801-6429
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm opacity-80">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>Licensed & Insured | Based in Pismo Beach</span>
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
