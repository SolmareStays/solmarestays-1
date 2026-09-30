import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Check, Mail } from 'lucide-react';

/**
 * Guest email capture.
 *
 * 🔴 The site had ZERO email inputs outside the owner inquiry form — no capture on the
 * homepage, the property pages or any of the ten guides. Email drove 3 sessions in
 * September against 457 paid sessions that converted nothing, while email out-performs
 * every social channel by more than 12x per owner. Anyone who read a guide and left was
 * unrecoverable, and guides are exactly where somebody planning a trip four months out
 * arrives first.
 *
 * ⚠ Deliberately NOT gated behind a popup or an exit-intent overlay. Those depress the
 * Core Web Vitals we just spent a month fixing and they are the first thing an owner
 * would ask us to remove.
 *
 * ⏳ FOLLOW-UP (not done here): this posts to Web3Forms, which emails the address. It
 * does NOT add the subscriber to Mailchimp. Routing it into the audience needs either a
 * Zap or a small job against the Mailchimp API (add_subscriber) — until that exists,
 * signups land in the inbox and must be added by hand. Do not describe this as a live
 * Mailchimp integration.
 */
export function EmailCapture({
  /** Where the signup came from, so the inbox shows which page earned it. */
  source,
  heading = 'Get the Avila Beach guide before you book',
  blurb = 'Where to eat, when the fog lifts, which beach is which — plus first access to shoulder-season dates. One email, no spam.',
  className = '',
}: {
  source: string;
  heading?: string;
  blurb?: string;
  className?: string;
}) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const form = e.target as HTMLFormElement;
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: new FormData(form),
      });
      const data = await response.json();
      if (!data.success) throw new Error('Submission failed');
      setIsSubmitted(true);
      setEmail('');
      // ⚠ NOT a Meta `Lead`. A newsletter signup is not owner intent, and firing Lead
      // here would pollute the one conversion the ad account optimises against.
      window.gtag?.('event', 'sign_up', { method: 'email', event_category: source });
    } catch {
      toast.error('That did not go through. Try again, or email info@solmarestays.com.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={`py-14 border-t ${className}`}>
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-xl text-center">
        <Mail className="w-6 h-6 mx-auto mb-4 opacity-70" aria-hidden="true" />
        <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-3">{heading}</h2>
        <p className="text-muted-foreground mb-6">{blurb}</p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          {/* ⚠ Public key, same as the owner form — see the note on Contact.tsx. */}
          <input type="hidden" name="access_key" value={import.meta.env.VITE_WEB3FORMS} />
          <input type="hidden" name="subject" value={`Guide signup — ${source}`} />
          <input type="hidden" name="from_name" value="Solmaré Stays — Guide signup" />
          <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

          <Label htmlFor={`email-capture-${source}`} className="sr-only">
            Email address
          </Label>
          <Input
            id={`email-capture-${source}`}
            name="email"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="h-12 flex-1"
            disabled={isSubmitted}
          />
          <Button type="submit" size="lg" disabled={isSubmitting || isSubmitted}>
            {isSubmitted ? (
              <>
                <Check className="w-4 h-4 mr-2" /> Thanks — check your inbox
              </>
            ) : isSubmitting ? (
              'Sending…'
            ) : (
              'Send it to me'
            )}
          </Button>
        </form>
      </div>
    </section>
  );
}
