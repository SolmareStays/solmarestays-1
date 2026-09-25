import { Link, useLocation } from 'react-router-dom';
import { Check, Phone, Mail } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';

/**
 * Confirmation page for both forms.
 *
 * 🔴 This route exists for a measurement reason as much as a UX one. Before
 * 2026-09-24 a successful submit only flipped local state and showed a toast, so
 * the URL never changed. That meant:
 *   - the Google Ads WEBPAGE conversion action "Owner — Lead Form Submit
 *     (management page)" had no URL to match and could never fire, and
 *   - Meta had no stable page rule to build a custom conversion on, and
 *   - there was no fallback at all when the JS events were blocked.
 *
 * The Lead / generate_lead events still fire from the submit handlers, gated on
 * the bot verdict — that has not moved. This is the durable second signal.
 *
 * ⚠ Do not add a Lead or generate_lead fire on THIS route. A thank-you pageview
 * is not a second lead, and firing on a route is exactly the mistake that made
 * every visitor look like a conversion until 2026-08-07.
 */
const ThankYou = () => {
  const { pathname } = useLocation();
  const isOwner = pathname.startsWith('/management');

  return (
    <div className="min-h-screen bg-background">
      {/* noindex: this is a conversion endpoint, not a landing page. It must never
          rank, and it must never be a Google Ads final URL. */}
      {/* absoluteTitle, not title — SEO appends " | Solmaré Stays" to `title`, which
          rendered "Thank you — Solmaré Stays | Solmaré Stays". */}
      <SEO
        title="Thank you"
        absoluteTitle="Thank you — Solmaré Stays"
        description="Thanks for getting in touch with Solmaré Stays."
        noindex
      />
      <Header />
      <main className="section-padding flex items-center justify-center min-h-[70vh]">
        <div className="max-w-xl text-center px-6">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-ocean/10">
            <Check className="h-8 w-8 text-ocean" />
          </div>

          <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-4">
            {isOwner ? 'Thanks — your projection is on its way.' : 'Thanks — we got your message.'}
          </h1>

          <p className="text-muted-foreground mb-8 leading-relaxed">
            {isOwner ? (
              <>
                Kyle reads these himself. You&rsquo;ll hear back within one business day
                with a revenue projection for your property — not a brochure, and not a
                call centre.
              </>
            ) : (
              <>
                Kyle reads these himself and you&rsquo;ll hear back within one business day.
                If it&rsquo;s about a stay in progress, call instead — that&rsquo;s faster.
              </>
            )}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <a
              href="tel:+18052426411"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-ocean px-6 py-3 text-ocean hover:bg-ocean hover:text-white transition-colors"
            >
              <Phone className="h-4 w-4" /> (805) 242-6411
            </a>
            <a
              href="mailto:info@solmarestays.com"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 hover:bg-muted transition-colors"
            >
              <Mail className="h-4 w-4" /> info@solmarestays.com
            </a>
          </div>

          <p className="text-sm text-muted-foreground">
            {isOwner ? (
              <>
                While you wait —{' '}
                <Link to="/collection" className="text-ocean hover:underline">
                  see the twelve homes we run
                </Link>{' '}
                or{' '}
                <Link to="/philosophy" className="text-ocean hover:underline">
                  read why we stay small
                </Link>
                .
              </>
            ) : (
              <>
                In the meantime,{' '}
                <Link to="/collection" className="text-ocean hover:underline">
                  browse the collection
                </Link>
                .
              </>
            )}
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ThankYou;
