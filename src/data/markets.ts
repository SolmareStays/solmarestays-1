/**
 * San Luis Obispo County short-term-rental markets — ONE source for every
 * owner-facing market page.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * WHY THIS FILE EXISTS, AND WHY IT IS NOT A LIST OF CITY NAMES
 * ────────────────────────────────────────────────────────────────────────────
 * The obvious way to "cover SLO County" is to clone the city-page template
 * fifteen times and swap the place name. That builds doorway pages, which
 * Google treats as spam, and it would be built on a false premise: **permit
 * availability is completely different in each jurisdiction.**
 *
 * Researched 2026-09-30:
 *   · Pismo Beach has issued NO new residential STR licence since 2023-11-07,
 *     and the licence must be held by the OWNER, not a management company,
 *     at their PRIMARY RESIDENCE. New STR acquisition there is closed.
 *   · Paso Robles non-hosted STR permits are AT CAPACITY (waiting list).
 *     Home-shares, where the owner lives on site, are uncapped.
 *   · Morro Bay is mid permit-audit and approving no new STRs; new permits
 *     also need a 175 ft separation from the next STR.
 *   · Atascadero has no STR ordinance yet — a Home Occupation Business
 *     Licence is the current route, and a primary-residence ordinance is
 *     being drafted.
 *   · Unincorporated county (Avila Beach, Cambria, Cayucos, Oceano,
 *     Templeton, …) issues a Vacation Rental Zoning Clearance under Coastal
 *     Zone LUO 23.08.165 or its inland equivalent. **These are the open
 *     markets.** Los Osos is the exception: capped at 50 with a 500 ft buffer.
 *
 * So a page that says "we manage short-term rentals in Pismo Beach, request a
 * projection" sells something an owner mostly cannot buy. The segmentation
 * below is the actual product:
 *
 *   permit: 'open'      → new STR acquisition. The growth market.
 *   permit: 'frozen'    → talk to owners who ALREADY hold a permit, and to
 *                         buyers (a licence does not automatically transfer
 *                         with the deed). Plus 30+ day stays, which are not
 *                         short-term rentals and no cap touches.
 *   permit: 'capped'    → waiting list; home-share may still be open.
 *   permit: 'emerging'  → no framework yet; rules are being written.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * 🔴 `verified` GATES PUBLICATION. Do not flip it to true without reading the
 * jurisdiction's own ordinance or finance page. These pages tell owners what
 * is legal; a wrong permit or TOT figure here is worse than no page at all.
 * Unverified markets stay out of the router and the sitemap by design.
 * ────────────────────────────────────────────────────────────────────────────
 */

/**
 * 🔴 DRE GATE — controls whether the site OFFERS 30+ night (mid-term / long-term)
 * furnished management. Keep false until the licence issues.
 *
 * California B&P 10131.01(a) exempts stays of 30 days or less, which is why the
 * existing short-term operation needs no licence. There is NO such exemption above
 * 30 days: arranging 31+ night rentals for other owners requires a broker licence, or
 * a salesperson working under a broker. Furnished vs unfurnished is irrelevant to DRE —
 * only duration matters — and operating without it is a misdemeanour under B&P 10139
 * (up to $20,000 and/or six months). The DRE Licensee Alert explicitly names the
 * evasion pattern of dressing a 31+ night stay up as a short-term booking.
 *
 * ⚖ Kyle asked on 2026-09-30 to market furnished rentals "long and short term". The
 * short-term half is live. The long-term half is built and waiting on this flag rather
 * than shipped, because advertising the service is itself the regulated activity.
 * Per dre-license-path the salesperson licence is expected around Feb 2027 — flip this
 * to true the day it ISSUES and is hung with the sponsoring broker, not before.
 *
 * ⛔ Do not flip this to make a page read better.
 */
export const LONG_TERM_OFFERING_LIVE = false;

export type PermitStatus = 'open' | 'frozen' | 'capped' | 'emerging';

export interface Market {
  /** URL segment: /vacation-rental-management/{slug} */
  slug: string;
  /** Place name as an owner would search it. */
  name: string;
  /** Who regulates STRs here. */
  jurisdiction: string;
  /** Unincorporated county areas are governed by the county, not a city. */
  unincorporated: boolean;
  permit: PermitStatus;
  /** One sentence an owner could not get from a competitor's site. */
  permitDetail: string;
  /** Total guest-facing lodging tax, and what it is made of. */
  totRate: string;
  totDetail: string;
  /** Do we currently manage here? Honesty is the differentiator. */
  doorsManaged: number;
  /** Approximate driving minutes from the Pismo Beach base. */
  minutesFromBase: number;
  /** The angle that is actually true in this market. */
  angle: string;
  /**
   * 🔴 Publication gate. true = every regulatory claim above was read from a
   * primary source. false = keep out of the router and sitemap.
   */
  verified: boolean;
  /** Primary sources, so the next person can re-check rather than re-research. */
  sources: string[];
}

export const MARKETS: Market[] = [
  // ─── OPEN: unincorporated county. Where growth to 22 doors comes from. ───
  {
    slug: 'avila-beach',
    name: 'Avila Beach',
    jurisdiction: 'San Luis Obispo County (unincorporated)',
    unincorporated: true,
    permit: 'open',
    permitDetail:
      'Avila Beach is unincorporated, so it is the County that permits short-term rentals, not a city. A Vacation Rental Zoning Clearance, a business licence and a Transient Occupancy Tax certificate are required, under Coastal Zone Land Use Ordinance section 23.08.165. The Permit Center decides whether a given parcel qualifies for a clearance or needs a Minor Use Permit, so the answer depends on your specific address.',
    totRate: '10.5%–12.5%',
    totDetail:
      '9% county Transient Occupancy Tax plus 1.5% Tourism Marketing District, and a further 2% Tourism Business Improvement District in some areas — so 10.5% or 12.5% depending on where the property sits.',
    doorsManaged: 10,
    minutesFromBase: 10,
    angle:
      'This is where most of the portfolio lives. Ten of our twelve houses are in Avila Beach, ten minutes from our Pismo Beach base, and inspections happen in person between every stay \u2014 which is what a design-led home a block from the sand actually needs.',
    verified: true,
    sources: [
      'https://www.slocounty.ca.gov/departments/planning-building/how-to-apply-for-a-permit-in-unincorporated-slo-co/land-use,-subdivision,-zoning/land-use-permit/business-license-clearance/vacation-rental-zoning-clearance/coastal-vacation-rental-clearance',
      'https://www.slocounty.ca.gov/departments/auditor-controller-treasurer-tax-collector-public/tax-collector/services/transient-occupancy-tax-(hotel-tax)',
    ],
  },
  {
    slug: 'cayucos',
    name: 'Cayucos',
    jurisdiction: 'San Luis Obispo County (unincorporated)',
    unincorporated: true,
    permit: 'open',
    permitDetail:
      'Cayucos is unincorporated, so a Vacation Rental Zoning Clearance, business licence and Transient Occupancy Tax certificate from the County are the requirement, under Coastal Zone Land Use Ordinance 23.08.165. Unlike Morro Bay a few miles north, Cayucos is not currently under a permit freeze — which is why it is one of the few genuinely open coastal markets left in the county.',
    totRate: '10.5%–12.5%',
    totDetail:
      '9% county Transient Occupancy Tax plus 1.5% Tourism Marketing District, and a further 2% Tourism Business Improvement District in some areas.',
    doorsManaged: 0,
    minutesFromBase: 40,
    angle:
      'Cayucos sits squarely in our service area at about 40 minutes up the coast from us, and it is one of very few coastal markets still issuing new permits while Morro Bay next door is frozen. If you own here, this is a market we actively want.',
    verified: true,
    sources: [
      'https://www.slocounty.ca.gov/departments/planning-building/how-to-apply-for-a-permit-in-unincorporated-slo-co/land-use,-subdivision,-zoning/land-use-permit/business-license-clearance/vacation-rental-zoning-clearance/coastal-vacation-rental-clearance',
    ],
  },
  {
    slug: 'cambria',
    name: 'Cambria',
    jurisdiction: 'San Luis Obispo County (unincorporated)',
    unincorporated: true,
    permit: 'open',
    permitDetail:
      'Cambria is unincorporated and permitted by the County: a Vacation Rental Zoning Clearance, business licence and Transient Occupancy Tax certificate under Coastal Zone Land Use Ordinance 23.08.165. Water supply has historically constrained new building in Cambria, which is a separate question from whether an existing home can be cleared as a vacation rental — worth checking for your specific parcel.',
    totRate: '10.5%–12.5%',
    totDetail:
      '9% county Transient Occupancy Tax plus 1.5% Tourism Marketing District, and a further 2% Tourism Business Improvement District in some areas.',
    doorsManaged: 0,
    minutesFromBase: 60,
    angle:
      'Cambria is one of the county\u2019s genuine luxury markets \u2014 oceanfront and Pine Knolls homes that reward being run properly \u2014 and we take on properties here. It is about an hour up the coast from us, so we staff it deliberately rather than casually, and we will tell you exactly what that looks like for your property before you commit to anything.',
    verified: true,
    sources: [
      'https://www.slocounty.ca.gov/departments/planning-building/how-to-apply-for-a-permit-in-unincorporated-slo-co/land-use,-subdivision,-zoning/land-use-permit/business-license-clearance/vacation-rental-zoning-clearance/coastal-vacation-rental-clearance',
    ],
  },

  // ─── FROZEN / CAPPED: a completely different conversation. ───
  {
    slug: 'pismo-beach',
    name: 'Pismo Beach',
    jurisdiction: 'City of Pismo Beach',
    unincorporated: false,
    permit: 'frozen',
    permitDetail:
      'Pismo Beach has not issued a new residential short-term rental licence since 7 November 2023. Only properties already licensed on that date can renew. Two further rules matter if you own here: the licence must be registered by the property owner and not by a management company, and short-term rentals are permitted only at single-family properties that are the owner’s primary residence.',
    totRate: '13.5%',
    totDetail:
      '10% city Transient Occupancy Tax, plus a 2% lodging business improvement district assessment and the 1.5% county Tourism Marketing District assessment.',
    doorsManaged: 0,
    minutesFromBase: 0,
    angle:
      'We cannot get you a new Pismo Beach licence, and neither can anyone else — but if you already hold one, this is exactly the conversation we want. The licence stays in your name and we run the operation underneath it. Buying here? Check what actually transfers before you close, and talk to us first.',
    verified: true,
    sources: [
      'https://www.prcity.com/DocumentCenter/View/25961/Pismo-Beach-Outside-Coastal-Zone-Short-Term-Rental-Ordinance',
      'http://pismobeach.org/881/Vacation-Rental-Short-Term-Rental-Homest',
      'https://www.pismobeach.org/461/Lodging-Businesses',
    ],
  },
  {
    slug: 'morro-bay',
    name: 'Morro Bay',
    jurisdiction: 'City of Morro Bay',
    unincorporated: false,
    permit: 'frozen',
    permitDetail:
      'Morro Bay requires an STR permit, a business licence and a Transient Occupancy Tax account before you operate, with annual renewal and an inspection every four years. New permits must also sit at least 175 feet from the next short-term rental, measured property line to property line. The city is currently running a permit audit and is approving no new STRs until it closes.',
    totRate: '10% base',
    totDetail:
      'The city’s base Transient Occupancy Tax rate is 10%. Confirm current district assessments with the city before quoting a guest-facing total.',
    doorsManaged: 0,
    minutesFromBase: 35,
    angle:
      'Morro Bay is a renewal-and-compliance market rather than an acquisition one, and that suits us \u2014 the 175-foot buffer means a lapsed permit can be near-impossible to recover, so the job is running it well and never missing a date. If you hold a Morro Bay permit, we would like to talk.',
    verified: true,
    sources: [
      'https://www.morrobayca.gov/1085/Short-Term-Vacation-Rentals',
      'https://www.ksby.com/morro-bay/the-city-of-morro-bay-will-not-be-approving-any-new-short-term-rental-permits-in-2025',
    ],
  },
  {
    slug: 'paso-robles',
    name: 'Paso Robles',
    jurisdiction: 'City of El Paso de Robles',
    unincorporated: false,
    permit: 'capped',
    permitDetail:
      'Paso Robles requires a short-term rental permit under Municipal Code chapter 21.34 plus a city business licence. Non-hosted permits — the normal case, where nobody lives on site — are at capacity, and new applications go onto a waiting list until one frees up. There is no cap on home-shares, where the owner lives on the property and rents part of it.',
    totRate: '11%',
    totDetail:
      'The city Transient Occupancy Tax is 11%, raised from 10%. Confirm any additional tourism district assessment with the city.',
    doorsManaged: 0,
    minutesFromBase: 50,
    angle:
      'A non-hosted permit in Paso means joining a queue, and we will say so before you engage us rather than after. Home-share is the open route today, and we work with wine-country owners across the north county \u2014 tell us about the property and we will map the realistic options.',
    verified: true,
    sources: [
      'https://www.prcity.com/521/Short-Term-Rental-Task-Force',
      'https://prcity.com/DocumentCenter/View/27355/Short-Term-Rental-Application-Packet',
      'https://www.prcity.com/161/Transient-Occupancy-Tax',
    ],
  },
  {
    slug: 'los-osos',
    name: 'Los Osos',
    jurisdiction: 'San Luis Obispo County (unincorporated)',
    unincorporated: true,
    permit: 'capped',
    permitDetail:
      'Los Osos is unincorporated but has its own community rule: vacation rentals are capped at 50 across the community, with a 500-foot buffer between them. A residential vacation rental may only be established in an existing single-family dwelling — not in a multi-family structure and not in a mobile home.',
    totRate: '10.5%–12.5%',
    totDetail:
      '9% county Transient Occupancy Tax plus 1.5% Tourism Marketing District, and a further 2% Tourism Business Improvement District in some areas.',
    doorsManaged: 0,
    minutesFromBase: 35,
    angle:
      'Fifty permits for the whole community means a new one is genuinely hard to come by \u2014 but if you already hold one, or you are not sure which category your property falls into, that is worth a conversation. We would rather look at it with you than guess from a distance.',
    verified: true,
    sources: [
      'https://www.newtimesslo.com/los-osos-gets-new-growth-and-vacation-rental-policies-10408499/',
      'https://www.slocounty.ca.gov/departments/planning-building/forms-documents/plans-and-elements/community-plans/los-osos-community-plan-update-files-513413e6e2b932dffc1fb3953e4a2d6c/residential-vacation-rentals-ordinance/lrp2020-00005-residential-vacation-rentals-ordinan',
    ],
  },
  {
    slug: 'atascadero',
    name: 'Atascadero',
    jurisdiction: 'City of Atascadero',
    unincorporated: false,
    permit: 'emerging',
    permitDetail:
      'Atascadero allows legally permitted residences, or rooms within them, to be rented for stays under 30 days, and the current route is a Home Occupation Business Licence from the city, submitted with a site plan and a signed Home Occupation Conditions form. The city does not yet have a dedicated short-term rental ordinance; council has directed staff to draft one centred on primary-residence permits, so the rules here are actively changing.',
    totRate: 'Confirm with city',
    totDetail:
      'Confirm the current Atascadero Transient Occupancy Tax rate and any district assessment with the city before quoting a guest-facing total.',
    doorsManaged: 0,
    minutesFromBase: 40,
    angle:
      'Atascadero is the one market in the county where the rules are being written right now. We are glad to work with owners here — the honest advice is not to build a plan that only works under today’s looser regime, and we will help you think that through.',
    verified: true,
    sources: [
      'https://www.atascadero.org/sites/default/files/2023-06/Vacation%20Rental%20Handout%202022%20v2.pdf',
      'https://citizenportal.ai/articles/7619302/California/San-Luis-Obispo-County/Atascadero-City/Atascadero-council-tells-staff-to-draft-short-term-rental-ordinance-centered-on-primary-residence-permits',
    ],
  },

  // ─── Arroyo Grande: we have doors here; TOT verified, permit route not yet. ───
  {
    slug: 'arroyo-grande',
    name: 'Arroyo Grande',
    jurisdiction: 'City of Arroyo Grande',
    unincorporated: false,
    permit: 'open',
    permitDetail:
      'Arroyo Grande requires a short-term rental clearance and a business licence, and collects Transient Occupancy Tax directly. Note that much of the wine country addressed as Arroyo Grande — including the Edna Valley side — is actually unincorporated county and permitted by the County instead, so the governing rules depend on which side of the city line your parcel falls.',
    totRate: '13.5%',
    totDetail:
      '10% city Transient Occupancy Tax, plus 1.5% for the county Tourism Marketing District and a further 2% for the Arroyo Grande Tourism Business Improvement District.',
    doorsManaged: 2,
    minutesFromBase: 10,
    angle:
      'We manage two properties here, including a 13-acre estate that sleeps 14, so we know how the city and county line splits this market and which rules land on which parcel.',
    // 🔴 TOT verified from the city; the permit route is described from the
    // city/county split rather than from the ordinance text. Read the AG
    // ordinance before flipping this to true.
    verified: false,
    sources: ['https://www.agpd.org/127/Transient-Occupancy-Tax'],
  },

  // ─── NOT YET VERIFIED — deliberately unpublished. ───
  // Each needs its ordinance and TOT read from a primary source before it can
  // render. ⛔ Do not guess a permit regime to fill a page.
  {
    slug: 'san-luis-obispo',
    name: 'San Luis Obispo',
    jurisdiction: 'City of San Luis Obispo',
    unincorporated: false,
    permit: 'capped',
    permitDetail:
      'PLACEHOLDER — SLO city restricts short-term rentals and enforces density/separation rules. Read the ordinance before publishing.',
    totRate: '13% (unverified)',
    totDetail: 'Recorded internally as 13%; confirm with the city before publishing.',
    doorsManaged: 0,
    minutesFromBase: 20,
    angle:
      'We hold no doors inside SLO city. Avila Beach is 15 minutes from downtown, which is how visiting Cal Poly families actually solve this.',
    verified: false,
    sources: [],
  },
  {
    slug: 'grover-beach',
    name: 'Grover Beach',
    jurisdiction: 'City of Grover Beach',
    unincorporated: false,
    permit: 'open',
    permitDetail: 'PLACEHOLDER — read the Grover Beach STR ordinance before publishing.',
    totRate: '13.5%',
    totDetail:
      '12% city Transient Occupancy Tax plus the 1.5% county Tourism Marketing District assessment.',
    doorsManaged: 0,
    minutesFromBase: 5,
    angle: 'Adjacent to Pismo but a separate jurisdiction with its own, more open rules.',
    verified: false,
    sources: ['https://www.groverbeach.org/543/Tax-Payment-TOTTMD'],
  },
  {
    slug: 'oceano',
    name: 'Oceano',
    jurisdiction: 'San Luis Obispo County (unincorporated)',
    unincorporated: true,
    permit: 'open',
    permitDetail:
      'PLACEHOLDER — unincorporated, so the County zoning-clearance route applies. Confirm Oceano-specific community standards before publishing.',
    totRate: '10.5%–12.5%',
    totDetail: 'County rate: 9% TOT plus 1.5% TMD, plus 2% TBID in some areas.',
    doorsManaged: 0,
    minutesFromBase: 7,
    angle: 'Dunes access with county rather than city permitting.',
    verified: false,
    sources: [],
  },
  {
    slug: 'nipomo',
    name: 'Nipomo',
    jurisdiction: 'San Luis Obispo County (unincorporated)',
    unincorporated: true,
    permit: 'open',
    permitDetail:
      'PLACEHOLDER — unincorporated inland; the County inland vacation-rental clearance route applies. Confirm before publishing.',
    totRate: '10.5%–12.5%',
    totDetail: 'County rate: 9% TOT plus 1.5% TMD, plus 2% TBID in some areas.',
    doorsManaged: 0,
    minutesFromBase: 15,
    angle: 'Inland south county, county-permitted.',
    verified: false,
    sources: [],
  },
  {
    slug: 'templeton',
    name: 'Templeton',
    jurisdiction: 'San Luis Obispo County (unincorporated)',
    unincorporated: true,
    permit: 'open',
    permitDetail:
      'PLACEHOLDER — unincorporated, so the County inland clearance route applies rather than the Paso Robles cap. Confirm before publishing.',
    totRate: '10.5%–12.5%',
    totDetail: 'County rate: 9% TOT plus 1.5% TMD, plus 2% TBID in some areas.',
    doorsManaged: 0,
    minutesFromBase: 45,
    angle:
      'Wine country next to Paso Robles but outside the city cap — potentially the most under-served open market in the county.',
    verified: false,
    sources: [],
  },
];

/** Markets cleared for publication. Everything else stays out of the router. */
export const PUBLISHED_MARKETS = MARKETS.filter(m => m.verified);

export function marketBySlug(slug: string): Market | undefined {
  return PUBLISHED_MARKETS.find(m => m.slug === slug);
}

export const PERMIT_LABEL: Record<PermitStatus, string> = {
  open: 'Accepting new permits',
  frozen: 'No new permits',
  capped: 'At capacity / waiting list',
  emerging: 'Rules being written',
};
