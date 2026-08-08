import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// Slug → Hostaway listing ID. These are the retailer_ids in the Meta catalog
// "Solmaré Properties" (1080256234419979) — content_ids must match them exactly
// or dynamic catalog ads cannot personalize.
const PROPERTY_IDS: Record<string, string> = {
  "emberlight": "335975", "the-deckhouse": "335976", "the-nest": "335977",
  "shoreline-suite": "335978", "casa-azul": "335979", "la-casita": "335980",
  "hummingbird-house": "391355", "monterey-heights-suite": "400378",
  "the-palm-house": "429263", "the-pine-house": "429264",
  "the-coral-house": "434918", "wine-country-estate": "504852",
  "flora-farm-cottage": "512768",
};

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

export function TrackingEvents() {
  const location = useLocation();
  const lastTracked = useRef("");

  useEffect(() => {
    const path = location.pathname;
    if (path === lastTracked.current) return;
    lastTracked.current = path;

    // Fire PageView on every SPA navigation (index.html only fires on initial load)
    window.fbq?.("track", "PageView");
    window.gtag?.("event", "page_view", { page_path: path });

    const slug = path.replace(/^\//, "").replace(/\/$/, "");

    // Property detail pages → ViewContent
    if (slug.startsWith("property/")) {
      const propertySlug = slug.replace("property/", "");
      window.fbq?.("track", "ViewContent", {
        content_name: propertySlug,
        content_type: "product",
        content_category: "vacation_rental",
        ...(PROPERTY_IDS[propertySlug] && { content_ids: [PROPERTY_IDS[propertySlug]] }),
      });
      window.gtag?.("event", "view_item", {
        items: [{ item_id: PROPERTY_IDS[propertySlug], item_name: propertySlug, item_category: "vacation_rental" }],
      });
    }

    // ⚠ These were `Lead` / `generate_lead` until 2026-08-07. Firing a conversion
    // on a PAGE VIEW — neither page has a form — meant every visitor counted as a
    // lead. Meta reported 26 "Leads" in 29 days; Google reported 1,201 conversions
    // from 305 clicks (492%). Real owner leads: zero. Notion's 0-new-leads count
    // was the accurate one the whole time.
    //
    // A page view is interest, not a lead. ViewContent / view_item say that
    // honestly. Do NOT restore a Lead fire here — a real lead needs a form
    // submission. As of 2026-08-07 both forms do fire it, from their own
    // `if (data.success)` branches: ForHomeowners.tsx and Contact.tsx.
    // Lead fires from a submit handler, never from a route.

    // Contact page → ViewContent (interest, not a lead — no form on this page)
    if (slug === "contact") {
      window.fbq?.("track", "ViewContent", {
        content_name: "contact_page",
        content_category: "contact",
      });
      window.gtag?.("event", "view_item", { event_category: "contact" });
    }

    // Management page → ViewContent (owner interest, not a lead)
    if (slug === "management" || slug === "for-homeowners") {
      window.fbq?.("track", "ViewContent", {
        content_name: "management_page",
        content_category: "owner",
      });
      window.gtag?.("event", "view_item", { event_category: "owner" });
    }

    // Checkout page → InitiateCheckout
    if (slug.startsWith("checkout/")) {
      const propertySlug = slug.replace("checkout/", "");
      window.fbq?.("track", "InitiateCheckout", {
        content_name: propertySlug,
        content_type: "product",
        ...(PROPERTY_IDS[propertySlug] && { content_ids: [PROPERTY_IDS[propertySlug]] }),
      });
      window.gtag?.("event", "begin_checkout", {
        items: [{ item_id: PROPERTY_IDS[propertySlug], item_name: propertySlug }],
      });
    }

    // Collection (all properties browse) → ViewContent
    if (slug === "collection" || slug === "book") {
      window.fbq?.("track", "ViewContent", {
        content_name: "collection",
        content_type: "product_group",
      });
    }
  }, [location.pathname]);

  return null;
}
