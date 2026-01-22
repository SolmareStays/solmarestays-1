import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';

// TikTok icon component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

export function Footer() {
  return (
    <footer className="bg-[#f5f5f5] text-gray-700">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <img
                src="/logo.avif"
                alt="Solmaré Stays"
                className="h-24 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed">
              Where the Sun Meets the Sea in Style.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mt-1">
              Boutique vacation rentals on California's Central Coast.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/collection" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  The Collection
                </Link>
              </li>
              <li>
                <Link to="/why-choose-us" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/for-homeowners" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  For Homeowners
                </Link>
              </li>
              <li>
                <Link to="/guest-experience" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Guest Experience
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@solmarestays.com" className="hover:text-gray-900 transition-colors">
                  info@solmarestays.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <a href="tel:+18058016429" className="hover:text-gray-900 transition-colors">
                  (805) 801-6429
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>Licensed & Insured | Based in Pismo Beach</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Follow Us</h4>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/solmarestays"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:border-gray-400 transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com/@solmarestays"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:border-gray-400 transition-colors"
                aria-label="Follow us on TikTok"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com/solmarestays"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:border-gray-400 transition-colors"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="mt-10 pt-6 border-t border-gray-300">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Solmaré Stays. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/" className="hover:text-gray-900 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/" className="hover:text-gray-900 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
