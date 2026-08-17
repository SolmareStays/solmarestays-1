import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Vercel Serverless Proxy for Hostaway API
 *
 * Routes all Hostaway API calls through the server so the API token
 * never reaches the client browser.
 *
 * Usage from client: POST /api/hostaway
 * Body: { endpoint: "/listings", method: "GET" }
 *   or: { endpoint: "/listings/391355/calendar?startDate=...&endDate=...", method: "GET" }
 *   or: { endpoint: "/reservations?validatePaymentMethod=1", method: "POST", body: { ... } }
 */

const HOSTAWAY_API_URL = 'https://api.hostaway.com/v1';
const HOSTAWAY_API_TOKEN = process.env.HOSTAWAY_API_TOKEN;

// Rate limiting: simple in-memory tracker
const rateLimiter = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 60; // requests per window
const RATE_WINDOW = 60_000; // 1 minute

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

/**
 * Allowlist of (method, path) pairs — exactly the seven calls src/services/hostaway.ts
 * makes, and nothing else.
 *
 * ⚠ The METHOD is half the rule. Matching on path alone let `/reservations` through for
 * every verb, so an unauthenticated GET returned every reservation in the account —
 * guest names, emails, phones, prices — and PUT/DELETE could rewrite them. Same for
 * `/listings/{id}`, which PUT would have made writable. Booking needs POST /reservations
 * and nothing needs GET, so the pair is what gets allowed.
 *
 * ⚠ Patterns are $-anchored. The old unanchored /^\/reservations/ also matched
 * /reservations/12345 and /reservationsAnything.
 */
const ALLOWED_ROUTES: ReadonlyArray<{ method: 'GET' | 'POST'; pattern: RegExp }> = [
  { method: 'GET', pattern: /^\/listings$/ },
  { method: 'GET', pattern: /^\/listings\/\d+$/ },
  { method: 'GET', pattern: /^\/listings\/\d+\/calendar$/ },
  { method: 'POST', pattern: /^\/listings\/\d+\/calendar\/priceDetails$/ },
  { method: 'POST', pattern: /^\/reservations$/ },
  { method: 'GET', pattern: /^\/coupons$/ },
  { method: 'GET', pattern: /^\/reviews$/ },
];

function isAllowedRoute(endpoint: string, method: string): boolean {
  const path = endpoint.split('?')[0]; // strip query params
  const verb = method.toUpperCase();
  return ALLOWED_ROUTES.some(r => r.method === verb && r.pattern.test(path));
}

// Browsers may call this only from our own site. The previous '*' let any origin on the
// web invoke the proxy with our Hostaway token attached.
const ALLOWED_ORIGINS = new Set([
  'https://www.solmarestays.com',
  'https://solmarestays.com',
]);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers — echoed back only for origins we own. Same-origin calls from the site
  // itself send no Origin header and are unaffected.
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // Rate limiting
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Try again later.' });
  }

  // Validate token exists
  if (!HOSTAWAY_API_TOKEN) {
    console.error('HOSTAWAY_API_TOKEN not set in environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Parse request
  const { endpoint, method = 'GET', body } = req.body || {};

  if (!endpoint || typeof endpoint !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid endpoint' });
  }

  // Validate the method+endpoint pair is on the allowlist
  if (!isAllowedRoute(endpoint, method)) {
    return res.status(403).json({ error: 'Endpoint not allowed' });
  }

  // Build the Hostaway request
  const url = `${HOSTAWAY_API_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${HOSTAWAY_API_TOKEN}`,
    'Cache-control': 'no-cache',
  };

  const fetchOptions: RequestInit = {
    method: method.toUpperCase(),
    headers,
  };

  if (body && (method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT')) {
    headers['Content-Type'] = 'application/json';
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, fetchOptions);
    const data = await response.json();

    // Forward the response status and body
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Hostaway proxy error:', error);
    return res.status(502).json({ error: 'Failed to reach Hostaway API' });
  }
}
