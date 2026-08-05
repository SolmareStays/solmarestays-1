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

    // Contact page → Lead
    if (slug === "contact") {
      window.fbq?.("track", "Lead", { content_name: "contact_page" });
      window.gtag?.("event", "generate_lead", { event_category: "contact" });
    }

    // Management page → Lead (owner interest)
    if (slug === "management" || slug === "for-homeowners") {
      window.fbq?.("track", "Lead", { content_name: "management_page" });
      window.gtag?.("event", "generate_lead", { event_category: "owner" });
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
