import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Contact form gate.
 *
 * The forms used to POST straight to api.web3forms.com from the browser. Two
 * problems with that, both measured on 2026-08-17:
 *
 *  1. VITE_WEB3FORMS is a build-time variable, so the access key shipped in the
 *     public bundle. Anyone could POST to Web3Forms with it forever.
 *  2. The bots hitting this form RENDER THE PAGE and submit through it, so
 *     `trackMetaEvent('Lead')` fired for every one. Meta's Lead counts matched
 *     the bot submissions exactly, midnight PT, day after day — the ad account
 *     was being trained to go find more of them.
 *
 * So the key moves server-side (WEB3FORMS_ACCESS_KEY, no VITE_ prefix) and every
 * submission is scored here before anything else happens. The verdict comes back
 * to the client as `clean`, and the client fires Lead only when it is true.
 *
 * Spam is still FORWARDED, with "[BLOCKED] " prefixed to the subject. That is
 * deliberate. The Notion pipeline (solmare-automation/jobs/inbound_leads.py)
 * reads these notification emails and is the audit trail; dropping them here
 * would make a blocked submission invisible everywhere, and a filter nobody can
 * audit is indistinguishable from one quietly eating real leads.
 *
 * The response is always success. A bot that learns which submissions were
 * rejected is a bot that iterates until it stops being rejected.
 */

const WEB3FORMS_URL = 'https://api.web3forms.com/submit';
const ACCESS_KEY = process.env.WEB3FORMS_ACCESS_KEY;

// Fake Name Generator's disposable set. PatriciaDValadez@teleworm.us arrived
// 2026-08-12 with a generated Minnesota address and a keyboard-mash message.
const FAKE_IDENTITY_DOMAINS = new Set([
  'teleworm.us', 'dayrep.com', 'armyspy.com', 'cuvox.de', 'einrot.com',
  'fleckens.hu', 'gustr.com', 'jourrapide.com', 'rhyta.com', 'superrito.com',
]);

const GENERIC_PHRASES = [
  'please send some information to my email',
  'i am very interested, please contact me',
  'i would like to gain in depth understanding',
  'i want to know more',
];

const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/g;

// Same shape as api/meta-capi.ts. Per-instance, so it is a speed bump against a
// burst from one address, not a distributed-attack defence.
const rateLimiter = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW = 600_000; // 10 min

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

interface Submission {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  subject?: string;
  propertyLocation?: string;
  botcheck?: unknown;
  elapsedMs?: number;
}

export function classify(sub: Submission): string[] {
  const name = (sub.name ?? '').trim();
  const email = (sub.email ?? '').trim();
  const message = (sub.message ?? '').trim();
  const norm = message.toLowerCase().replace(/[.!,]+$/, '');
  const domain = email.includes('@') ? email.split('@').pop()!.toLowerCase() : '';

  const decisive: string[] = [];
  const weak: string[] = [];

  // The honeypot only ever means something when it is FILLED. A bot that never
  // renders the page leaves it absent, and absent has to read as a pass.
  if (sub.botcheck) decisive.push('honeypot filled');

  if (FAKE_IDENTITY_DOMAINS.has(domain)) decisive.push(`fake-identity domain (${domain})`);

  // 2026-08-14: the name field held a 700-char search.dailyread.co ad URL.
  if (/https?:\/\//.test(name) || name.length > 120) {
    decisive.push('URL or overlong string in name field');
  }

  // 2026-08-17: "Tommie Wilkes / twilkes091@comcast.net" put a SECOND address in
  // the message. That is a list record with two email columns overflowing into
  // the form, not a person typing.
  const others = (message.match(EMAIL_RE) ?? [])
    .filter((a) => a.toLowerCase() !== email.toLowerCase());
  if (others.length) decisive.push(`second email address in message (${others[0]})`);

  if (norm.length > 12 && !norm.includes(' ') && !EMAIL_RE.test(norm)) {
    decisive.push('keyboard-mash message');
  }

  // Nobody reads a page, composes a message and submits in under three seconds.
  // Absent means an older client, which must not count against anyone.
  if (typeof sub.elapsedMs === 'number' && sub.elapsedMs < 3000) {
    decisive.push(`submitted in ${sub.elapsedMs}ms`);
  }

  // ── weak: real explanations exist for each, so two are required ──
  if (GENERIC_PHRASES.some((p) => norm.startsWith(p))) weak.push('generic template message');
  if (!message) weak.push('empty message');

  // "Elsie Follman" submitting joanne.l.c@att.blackberry.net is a stale scraped
  // list, not a typo.
  const local = email.includes('@') ? email.split('@')[0].toLowerCase() : '';
  const tokens = name.toLowerCase().split(/\s+/).filter((t) => t.length > 2);
  if (tokens.length && local && !tokens.some((t) => local.includes(t.slice(0, 4)))) {
    weak.push('name and email share no token');
  }

  if (decisive.length) return [...decisive, ...weak];
  return weak.length >= 2 ? weak : [];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  if (!ACCESS_KEY) {
    // Loud, because the alternative is a form that silently accepts everything
    // and delivers nothing. Same trap as the CAPI token returning 200 when unset.
    console.error('[contact] WEB3FORMS_ACCESS_KEY is not set — cannot forward');
    return res.status(500).json({ success: false, message: 'Form is misconfigured' });
  }

  const ip = String(req.headers['x-forwarded-for'] ?? '').split(',')[0].trim() || 'unknown';
  if (isRateLimited(ip)) {
    console.warn(`[contact] rate limited ${ip}`);
    return res.status(200).json({ success: true, clean: false });
  }

  const sub = (req.body ?? {}) as Submission;
  if (!sub.email || !sub.name) {
    return res.status(400).json({ success: false, message: 'Name and email are required' });
  }

  const reasons = classify(sub);
  const clean = reasons.length === 0;
  const subject = sub.subject || 'Contact Form Submission';

  console.log(`[contact] ${clean ? 'CLEAN' : 'BLOCKED'} ${subject} <${sub.email}>` +
    (clean ? '' : ` — ${reasons.join('; ')}`));

  const payload: Record<string, unknown> = {
    access_key: ACCESS_KEY,
    from_name: 'Solmaré Stays Website',
    subject: clean ? subject : `[BLOCKED] ${subject}`,
    name: sub.name,
    email: sub.email,
    phone: sub.phone ?? '',
    message: sub.message ?? '',
  };
  if (sub.propertyLocation) payload.propertyLocation = sub.propertyLocation;
  if (!clean) payload.blocked_reason = reasons.join('; ');

  try {
    const upstream = await fetch(WEB3FORMS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok || !(data as { success?: boolean }).success) {
      console.error('[contact] Web3Forms rejected the submission', upstream.status, data);
      return res.status(502).json({ success: false, message: 'Could not send your message' });
    }
  } catch (err) {
    console.error('[contact] Web3Forms unreachable', err);
    return res.status(502).json({ success: false, message: 'Could not send your message' });
  }

  // `clean` is what gates the Meta Lead on the client. Never tell the caller WHY
  // it was blocked.
  return res.status(200).json({ success: true, clean });
}
