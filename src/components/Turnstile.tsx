import { useEffect, useRef } from 'react';

/**
 * Cloudflare Turnstile widget for the Web3Forms contact forms.
 *
 * Why this exists: the Web3Forms access key ships in the public JS bundle
 * (VITE_WEB3FORMS is a build-time variable), so anything on the internet can
 * POST straight to api.web3forms.com without ever loading this site. Ten such
 * submissions arrived between 2026-08-04 and 2026-08-17, all inside a
 * 07:04-07:44 UTC band, replaying scraped co-registration leads.
 *
 * The existing `botcheck` honeypot cannot catch those. Web3Forms only rejects
 * when that field comes back FILLED, and a bot that never renders the page
 * never sees it — absent counts as a pass. Turnstile is the opposite: it must
 * be PRESENT and valid, so a direct POST has nothing to send.
 *
 * Renders nothing when VITE_TURNSTILE_SITEKEY is unset, which keeps the forms
 * working exactly as they do today. That matters for rollout order:
 *
 *   1. create the Turnstile site key in Cloudflare, set VITE_TURNSTILE_SITEKEY
 *   2. deploy  (npx vercel --prod --yes — this project does NOT deploy on push)
 *   3. ONLY THEN enable captcha enforcement in the Web3Forms dashboard
 *
 * Enabling enforcement before step 2 rejects every real submission.
 */

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: { sitekey: string; theme?: string }) => string;
      remove: (id: string) => void;
    };
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

function loadScript(): Promise<void> {
  if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Turnstile script failed to load'));
    document.head.appendChild(s);
  });
}

export function Turnstile() {
  const sitekey = import.meta.env.VITE_TURNSTILE_SITEKEY;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sitekey || !ref.current) return;
    let widgetId: string | undefined;
    let cancelled = false;

    // Explicit render, not the implicit scan: this is an SPA, so the div mounts
    // after the script has already swept the document.
    loadScript()
      .then(() => {
        if (cancelled || !ref.current || !window.turnstile) return;
        widgetId = window.turnstile.render(ref.current, { sitekey });
      })
      .catch(() => {
        // Leave the form usable. A failed challenge load must not become a
        // silent wall between a real guest and the only contact form we have.
      });

    return () => {
      cancelled = true;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [sitekey]);

  if (!sitekey) return null;
  // Turnstile injects <input name="cf-turnstile-response"> into the enclosing
  // <form>, which is what new FormData(form) then picks up.
  return <div ref={ref} className="my-2" />;
}
