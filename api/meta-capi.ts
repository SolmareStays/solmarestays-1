import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHash } from 'node:crypto';

/**
 * Meta Conversions API forwarder
 *
 * The browser pixel already fires every event (see src/components/TrackingEvents.tsx
 * and the two form submit handlers). This route sends the SAME event a second time
 * from the server, which is the point: iOS/ad-blockers drop a meaningful share of
 * browser events, and the server can attach the real client IP and user agent that
 * the pixel cannot vouch for. Meta collapses the pair on `event_id`.
 *
 * ⚠ event_id MUST match the `eventID` passed to fbq() for the same event, or Meta
 * counts it twice and every conversion number doubles.
 *
 * Usage from client: POST /api/meta-capi
 * Body: { event_name, event_id, event_source_url, email?, phone?, custom_data? }
 */

const PIXEL_ID = '882294231450852';
const GRAPH_URL = `https://graph.facebook.com/v21.0/${PIXEL_ID}/events`;
const CAPI_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;

// Only events the site actually fires. An unknown name is a bug, not a new event.
const ALLOWED_EVENTS = new Set([
  'Lead',
  'ViewContent',
  'InitiateCheckout',
  'PageView',
  'Purchase',
]);

const rateLimiter = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 60;
const RATE_WINDOW = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimiter.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimiter.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

// Meta requires PII lowercased and trimmed before SHA-256, or the hash will not
// match theirs and the identity is silently discarded.
function hash(value: string): string {
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

// Phone must be digits only, country code included, before hashing.
function hashPhone(value: string): string {
  const digits = value.replace(/\D/g, '');
  const e164 = digits.length === 10 ? `1${digits}` : digits;
  return createHash('sha256').update(e164).digest('hex');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
    req.socket.remoteAddress ||
    '';

  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }

  if (!CAPI_TOKEN) {
    // Never fail the user's form submission because our analytics is misconfigured.
    console.error('[meta-capi] META_CAPI_ACCESS_TOKEN is not set — event dropped');
    return res.status(200).json({ ok: false, reason: 'not_configured' });
  }

  const { event_name, event_id, event_source_url, email, phone, custom_data } =
    req.body ?? {};

  if (!event_name || !ALLOWED_EVENTS.has(event_name)) {
    return res.status(400).json({ error: 'Unknown event_name' });
  }
  if (!event_id) {
    // Without event_id there is no dedup key, and sending would double-count.
    return res.status(400).json({ error: 'event_id is required for deduplication' });
  }

  const user_data: Record<string, unknown> = {
    client_ip_address: ip,
    client_user_agent: req.headers['user-agent'] ?? '',
  };
  if (email) user_data.em = [hash(String(email))];
  if (phone) user_data.ph = [hashPhone(String(phone))];

  // Meta's cookies carry the click/browser id that make attribution work.
  const cookies = req.cookies ?? {};
  if (cookies._fbp) user_data.fbp = cookies._fbp;
  if (cookies._fbc) user_data.fbc = cookies._fbc;

  const payload = {
    data: [
      {
        event_name,
        event_id,
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_source_url: event_source_url ?? req.headers.referer ?? '',
        user_data,
        ...(custom_data && { custom_data }),
      },
    ],
  };

  try {
    const response = await fetch(`${GRAPH_URL}?access_token=${CAPI_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await response.json();

    if (!response.ok) {
      console.error('[meta-capi] Graph rejected event', event_name, result);
      return res.status(200).json({ ok: false, reason: 'graph_error' });
    }

    return res.status(200).json({ ok: true, events_received: result.events_received });
  } catch (err) {
    console.error('[meta-capi] forward failed', err);
    return res.status(200).json({ ok: false, reason: 'network_error' });
  }
}
