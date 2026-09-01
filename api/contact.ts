import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Contact form verdict.
 *
 * Scores a submission and returns whether it looks human. It does NOT forward
 * anything — the browser still posts to Web3Forms itself, because the free plan
 * rejects server-side calls outright:
 *
 *   "This method is not allowed. Use our API in client side or contact support
 *    with server IP address (Pro plan is required)"
 *
 * So this endpoint exists for one job, and it is the expensive one. The bots
 * hitting these forms RENDER THE PAGE and submit through them, so
 * `trackMetaEvent('Lead')` fired for every single one. On 2026-08-17 Meta's Lead
 * counts matched the bot submissions exactly — midnight PT, day after day — which
 * means the ad account was being trained to go find more of that traffic. The
 * client now asks here first and fires Lead only when `clean` comes back true.
 *
 * Deliberately NOT the gate on delivery. Every submission still reaches
 * info@solmarestays.com, and inbound_leads.py scores it again independently on
 * the way into Notion. Two things follow from that: a false positive here costs
 * an ad signal, never a lead; and if this route is down the form still works.
 *
 * `reasons` is never returned. A bot that learns why it was rejected iterates
 * until it stops being rejected.
 *
 * Worth revisiting on Web3Forms Pro: with server-side calls allowed, this becomes
 * a real proxy, the access key stops shipping in the public bundle, and blocked
 * submissions never reach the inbox at all.
 */

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

interface Submission {
  name?: string;
  email?: string;
  message?: string;
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

  // The honeypot only means something when it is FILLED. A client that never
  // rendered it sends nothing, and absent has to read as a pass.
  if (sub.botcheck) decisive.push('honeypot filled');

  if (FAKE_IDENTITY_DOMAINS.has(domain)) decisive.push(`fake-identity domain (${domain})`);

  // 2026-08-14: the name field held a 700-char search.dailyread.co ad URL.
  if (/https?:\/\//.test(name) || name.length > 120) {
    decisive.push('URL or overlong string in name field');
  }

  // 2026-08-17: "Tommie Wilkes / twilkes091@comcast.net" put a SECOND address in
  // the message — a list record with two email columns overflowing into the form.
  const others = (message.match(EMAIL_RE) ?? [])
    .filter((a) => a.toLowerCase() !== email.toLowerCase());
  if (others.length) decisive.push('second email address in message');

  if (norm.length > 12 && !norm.includes(' ')) decisive.push('keyboard-mash message');

  // Absent means an older client and must not count against anyone. Under three
  // seconds is not someone reading a page and composing a message.
  if (typeof sub.elapsedMs === 'number' && sub.elapsedMs < 3000) {
    decisive.push(`submitted in ${sub.elapsedMs}ms`);
  }

  // ── weak: each has a legitimate explanation, so two are required ──
  if (GENERIC_PHRASES.some((p) => norm.startsWith(p))) weak.push('generic template message');

  // 2026-08-31: `empty message` was REMOVED as a signal. The message field is not
  // `required` on either form — you cannot hold a blank optional field against the
  // person who left it blank. Paired with 'name and email share no token' (which a
  // business address like info@millerproperties.com trips innocently) it silently
  // suppressed Lead/generate_lead for exactly the owner who fills the required
  // fields and submits. The lead still reached info@ and Notion, so nothing was
  // lost — it just never counted as a conversion, which is the same hole the
  // 8/31 tracking work was closing. Make the field required before restoring this.

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
    return res.status(405).json({ clean: false });
  }

  const sub = (req.body ?? {}) as Submission;
  const reasons = classify(sub);
  const clean = reasons.length === 0;

  // The only record of the verdict. Runtime logs are how we check the filter is
  // still behaving after the operator changes tactics — which they already did
  // once, moving off the 07:00 UTC window the same day it was documented.
  console.log(`[contact] ${clean ? 'CLEAN' : 'BLOCKED'} <${sub.email ?? '?'}>` +
    (clean ? '' : ` — ${reasons.join('; ')}`));

  return res.status(200).json({ clean });
}
