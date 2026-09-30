import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Turnstile } from '@/components/Turnstile';
import { Check, Send } from 'lucide-react';
import { trackMetaEvent } from '@/lib/track';

/**
 * The owner inquiry form.
 *
 * Extracted from ForHomeowners.tsx so the per-market management pages
 * (/vacation-rental-management/{city}) reuse this exact form rather than a copy.
 * It carries real machinery that must not be duplicated: the /api/contact bot
 * verdict, the single permitted Meta `Lead` + `generate_lead` fire, Turnstile, and
 * the navigate to a real /thanks URL that Google Ads matches on.
 *
 * `subject` is what lands in the inbox and is the only way to tell which market page
 * produced a lead — every page passing the same string makes attribution impossible.
 */

export const OwnerLeadForm = ({
  subject = 'Property Management Inquiry — Management Page',
}: {
  subject?: string;
}) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyLocation: '',
    message: '',
  });
  // Feeds the server's dwell check — see api/contact.ts.
  const mountedAt = useRef(Date.now());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const form = e.target as HTMLFormElement;
      // Verdict first, send second — see api/contact.ts. Never blocks delivery:
      // if the route is down we send anyway and just do not claim the Lead.
      const clean = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          botcheck: (form.elements.namedItem('botcheck') as HTMLInputElement)?.checked,
          elapsedMs: Date.now() - mountedAt.current,
        }),
      })
        .then((r) => r.json())
        .then((v) => v.clean === true)
        .catch(() => false);

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: new FormData(form),
      });
      const data = await response.json();
      if (data.success) {
        // The ONLY place a Lead may fire. A route change is interest, not a lead —
        // see the note in TrackingEvents.tsx. This is a real owner form submission.
        // Goes to the pixel AND the Conversions API under one shared event id.
        // Gated on the verdict so bot submissions never train the ad account.
        if (clean) {
          trackMetaEvent(
            'Lead',
            { content_name: 'management_form', content_category: 'owner' },
            { email: formData.email, phone: formData.phone },
          );
          window.gtag?.('event', 'generate_lead', { event_category: 'owner' });
        }
        setIsSubmitted(true);
        setFormData({ name: '', email: '', phone: '', propertyLocation: '', message: '' });
        // Navigate to a real URL. The Lead / generate_lead events above are the
        // primary signal, but a conversion that only exists as a JS event has no
        // fallback — and the Google Ads WEBPAGE action "Owner — Lead Form Submit"
        // needs a URL to match, which an in-place toast never gave it.
        navigate('/management/thanks');
      } else {
        throw new Error('Submission failed');
      }
    } catch {
      toast.error('Something went wrong. Call us at (805) 242-6411.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* ⚠ Public key — see the note on Contact.tsx. Cannot move server-side until
          Web3Forms Pro; the free plan refuses server-side calls. */}
      <input type="hidden" name="access_key" value={import.meta.env.VITE_WEB3FORMS} />
      <input type="hidden" name="subject" value={subject} />
      <input type="hidden" name="from_name" value="Solmaré Stays — Owner Lead" />
      <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="owner-name">Your Name *</Label>
          <Input id="owner-name" name="name" value={formData.name} onChange={handleChange} placeholder="Full name" required className="h-12" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="owner-email">Email *</Label>
          <Input id="owner-email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@email.com" required className="h-12" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="owner-phone">Phone</Label>
          <Input id="owner-phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="(555) 123-4567" className="h-12" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="owner-location">Property Location *</Label>
          <Input id="owner-location" name="propertyLocation" value={formData.propertyLocation} onChange={handleChange} placeholder="City or address" required className="h-12" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="owner-message">Tell us about your property</Label>
        <Textarea id="owner-message" name="message" value={formData.message} onChange={handleChange} placeholder="Bedrooms, current use, any questions..." rows={4} className="resize-none" />
      </div>

      <Turnstile />

      <Button type="submit" variant="hero" size="xl" className="w-full" disabled={isSubmitting || isSubmitted}>
        {isSubmitted ? (<><Check className="w-5 h-5 mr-2" /> Sent! We'll be in touch.</>) : isSubmitting ? (<>Sending...</>) : (<><Send className="w-5 h-5 mr-2" /> Get My Free Revenue Projection</>)}
      </Button>

      {/* The Owner ads sell the phone — "No Call Center. My Cell." — and until
          2026-09-24 this was the one response channel with zero instrumentation on
          either platform. A tap here is owner intent and counts as a Lead, same as a
          form submit: there is no weaker interpretation of someone dialling a
          property manager from the management page. */}
      <p className="text-center text-xs text-muted-foreground">
        Or call us directly at{' '}
        <a
          href="tel:+18052426411"
          className="text-ocean hover:underline"
          onClick={() => {
            trackMetaEvent('Lead', {
              content_name: 'phone_click',
              content_category: 'owner',
            });
            window.gtag?.('event', 'generate_lead', {
              event_category: 'owner',
              method: 'phone_click',
            });
          }}
        >
          (805) 242-6411
        </a>
      </p>
    </form>
  );
};
