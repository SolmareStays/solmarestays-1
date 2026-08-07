import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// Property slugs that map to individual listing pages
const PROPERTY_SLUGS = new Set([
  "emberlight", "the-deckhouse", "the-nest", "shoreline-suite",
  "casa-azul", "la-casita", "hummingbird-house", "monterey-heights-suite",
  "the-palm-house", "the-pine-house", "the-coral-house",
  "wine-country-estate", "flora-farm-cottage",
]);

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
      });
      window.gtag?.("event", "view_item", {
        items: [{ item_name: propertySlug, item_category: "vacation_rental" }],
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
    // submission or a booking, and no such handler exists in this codebase yet.
    // When one is added, fire Lead from the submit handler, never from a route.

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
      });
      window.gtag?.("event", "begin_checkout", {
        items: [{ item_name: propertySlug }],
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
