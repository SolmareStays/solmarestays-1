/**
 * Dual-fires a Meta event: browser pixel + Conversions API.
 *
 * Both calls carry the same eventId, which is how Meta collapses them into one
 * conversion instead of two. The server copy exists because iOS and ad blockers
 * drop a real share of browser events — see api/meta-capi.ts.
 *
 * The CAPI POST is fire-and-forget on purpose: analytics must never delay or
 * fail a form submission the user is waiting on.
 */

type TrackOptions = {
  email?: string;
  phone?: string;
  customData?: Record<string, unknown>;
};

export function trackMetaEvent(
  eventName: 'Lead' | 'ViewContent' | 'InitiateCheckout' | 'Purchase',
  customData: Record<string, unknown> = {},
  options: TrackOptions = {},
) {
  const eventId = crypto.randomUUID();

  window.fbq?.('track', eventName, customData, { eventID: eventId });

  void fetch('/api/meta-capi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event_name: eventName,
      event_id: eventId,
      event_source_url: window.location.href,
      email: options.email,
      phone: options.phone,
      custom_data: { ...customData, ...options.customData },
    }),
  }).catch(() => {
    // Swallowed deliberately. A dropped server event costs match quality;
    // a thrown one would surface as a broken form.
  });
}
