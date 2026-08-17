import { SEO } from "@/components/SEO";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { usePage } from "@/hooks/useSanityContent";
import { SanitySectionRenderer } from "@/components/sanity/SanitySectionRenderer";

const Terms = () => {
  const { data: pageData, isLoading } = usePage('terms');

  // Check if we have valid Sanity data with sections
  const showSanityContent = !isLoading && pageData?.sections?.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={pageData?.title || "Terms of Service"}
        description={pageData?.metaDescription || "Terms and conditions for using Solmaré Stays website."}
        breadcrumbs={[
          { name: 'Home', url: 'https://www.solmarestays.com/' },
          { name: 'Terms and Conditions', url: 'https://www.solmarestays.com/terms' },
        ]}
      />
      <Header />
      <main className="pt-32 md:pt-36 pb-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {showSanityContent ? (
              <>
                <h1 className="font-serif text-4xl font-semibold text-foreground mb-8">
                  {pageData.title}
                </h1>
                <SanitySectionRenderer sections={pageData.sections} />
              </>
            ) : (
              // Fallback Hardcoded Content
              <>
                <h1 className="font-serif text-4xl font-semibold text-foreground mb-8">
                  Booking Terms &amp; Conditions
                </h1>

                <div className="prose prose-stone max-w-none text-muted-foreground">
                  <p className="text-sm text-muted-foreground/70 mb-6 italic">Last Updated: August 17, 2026</p>

                  <p className="mb-6">
                    These Booking Terms &amp; Conditions (the &ldquo;Terms&rdquo;) govern your reservation and stay at any property managed by Solmar&eacute; Stays, a trade name of Solmare Stays LLC, a California limited liability company (CA Entity No. B20260285501) (&ldquo;Solmar&eacute; Stays,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;Manager&rdquo;). By completing a booking, you (the &ldquo;Guest&rdquo;) agree to these Terms on behalf of yourself and every member of your party.
                  </p>

                  <p className="mb-6">
                    Solmar&eacute; Stays manages each property on behalf of its owner. We are not the owner of the properties we manage.
                  </p>

                  <h2 className="text-2xl font-serif font-medium text-foreground mt-8 mb-4">Who May Book</h2>
                  <p className="mb-6">
                    You must be at least 25 years old to make a reservation. The person who books must be a member of the traveling party, must occupy the property for the entire stay, and is responsible for the conduct of everyone in the party, including minors and visitors.
                  </p>

                  <h2 className="text-2xl font-serif font-medium text-foreground mt-8 mb-4">Booking and Confirmation</h2>
                  <p className="mb-6">
                    Your reservation is not confirmed until you receive a written confirmation from us. Rates, availability, and property details are subject to change until a booking is confirmed. If a reservation is accepted in error &mdash; including an obvious pricing error or a double-booking &mdash; we may cancel it and issue a full refund.
                  </p>

                  <h2 className="text-2xl font-serif font-medium text-foreground mt-8 mb-4">Rates, Fees, and Taxes</h2>
                  <p className="mb-6">
                    The total shown at checkout includes the nightly rate, a cleaning fee, and applicable taxes. Transient Occupancy Tax is collected and remitted to the applicable jurisdiction, and the rate varies by location (City of Avila Beach, City of Arroyo Grande, City of San Luis Obispo, and San Luis Obispo County). Additional guest fees may apply above the included occupancy.
                  </p>

                  <h2 className="text-2xl font-serif font-medium text-foreground mt-8 mb-4">Payment</h2>
                  <p className="mb-6">
                    Payment is processed through our third-party payment processor. We do not store full payment card numbers. By providing card details you authorize us to charge the amounts disclosed at checkout, and to charge the same card for damage, excess cleaning, or other amounts owed under these Terms.
                  </p>

                  <h2 className="text-2xl font-serif font-medium text-foreground mt-8 mb-4">Cancellations and Changes</h2>
                  <p className="mb-6">
                    The cancellation policy that applies to your reservation is the one displayed at the time of booking and restated in your confirmation. That policy governs. Cancellation requests must be made in writing to info@solmarestays.com.
                  </p>

                  <p className="mb-6">
                    Early departure does not entitle you to a refund of unused nights. Date changes are treated as a cancellation and rebooking, subject to availability and current rates. We strongly recommend travel insurance.
                  </p>

                  <h2 className="text-2xl font-serif font-medium text-foreground mt-8 mb-4">Check-In and Check-Out</h2>
                  <p className="mb-6">
                    Check-in is after 3:00 PM or 4:00 PM depending on the property; check-out is by 11:00 AM. Your confirmation states the times for your property. Early check-in and late check-out may be available on request and are never guaranteed. Entry is by keyless smart lock, and access codes are sent before arrival.
                  </p>

                  <h2 className="text-2xl font-serif font-medium text-foreground mt-8 mb-4">Occupancy</h2>
                  <p className="mb-6">
                    Maximum occupancy is stated on each property listing and is strictly enforced, including infants and children. Exceeding the stated occupancy is grounds for immediate termination of the stay without refund. Unregistered overnight guests are not permitted.
                  </p>

                  <h2 className="text-2xl font-serif font-medium text-foreground mt-8 mb-4">House Rules</h2>
                  <p className="mb-6">
                    The house rules published on the property listing form part of these Terms. They include, without limitation:
                  </p>

                  <ul className="list-disc pl-6 mb-6">
                    <li>Quiet hours from 10:00 PM to 8:00 AM. Our properties are in residential neighborhoods.</li>
                    <li>No parties or events. These are private residences, not event venues.</li>
                    <li>No smoking or vaping anywhere inside a property. A cleaning and remediation charge will apply to violations.</li>
                    <li>Parking only in the designated space assigned to your property.</li>
                    <li>Pets are not permitted except at properties expressly designated as pet-friendly, and then only with prior written approval and payment of the applicable pet fee.</li>
                  </ul>

                  <p className="mb-6">
                    We may terminate a stay immediately and without refund for violation of these Terms or the house rules, exceeding occupancy, unauthorized pets or events, illegal activity, or conduct that endangers people or property or disturbs neighbors.
                  </p>

                  <h2 className="text-2xl font-serif font-medium text-foreground mt-8 mb-4">Amenities Are Provided as a Courtesy &mdash; Use at Your Own Risk</h2>
                  <p className="mb-6">
                    Some properties offer recreational amenities as a free convenience, which may include bicycles, helmets, beach chairs, beach towels, boogie boards and other beach gear, outdoor grills, fire pits, swimming pools, hot tubs, decks, patios, balconies, and rooftop terraces.
                  </p>

                  <p className="mb-6">
                    These amenities are provided &ldquo;as is,&rdquo; as a courtesy, and are not part of the accommodation you are paying for. Their use is entirely voluntary and at your own risk. You are responsible for inspecting any equipment before use and for determining whether it is suitable for you and for anyone in your party.
                  </p>

                  <p className="mb-6">
                    By using any of these amenities, you and every member of your party knowingly and voluntarily assume all risk of injury, death, illness, or property damage arising from that use, and agree to release, hold harmless, and indemnify Solmar&eacute; Stays, the property owner, and their respective members, employees, agents, and contractors from any claim arising out of that use, except to the extent caused by their gross negligence or willful misconduct.
                  </p>

                  <ul className="list-disc pl-6 mb-6">
                    <li><strong>Bicycles.</strong> Used at your own risk. You are responsible for inspecting brakes, tires, and condition before each ride. California law requires riders under 18 to wear a helmet, and we recommend helmets for all riders. Do not ride a bicycle you have any concern about &mdash; contact us instead.</li>
                    <li><strong>Water features.</strong> Pools and hot tubs are unattended and have no lifeguard. Children must be supervised by an adult at all times. Do not use these features alone, under the influence of alcohol, or if pregnant or with a medical condition without consulting a physician.</li>
                    <li><strong>Elevated areas.</strong> Decks, balconies, and rooftop terraces are unsupervised. Do not sit or climb on railings. Children must be supervised at all times.</li>
                    <li><strong>Fire.</strong> Grills and fire pits must never be left unattended and must be fully extinguished after use.</li>
                  </ul>

                  <h2 className="text-2xl font-serif font-medium text-foreground mt-8 mb-4">Children and Supervision</h2>
                  <p className="mb-6">
                    Our properties are private homes and are not childproofed. They may include stairs, elevated decks and rooftop terraces, fireplaces, water features, and other hazards. Guests bringing infants or young children are solely responsible for assessing the property&rsquo;s suitability and for supervising children at all times.
                  </p>

                  <h2 className="text-2xl font-serif font-medium text-foreground mt-8 mb-4">Damage, Loss, and Excess Cleaning</h2>
                  <p className="mb-6">
                    You are responsible for the property and its contents during your stay. Please report accidental damage promptly. You authorize us to charge your payment card for damage beyond normal wear and tear, missing items, excess cleaning, smoking remediation, undisclosed pets, or violations resulting in fines.
                  </p>

                  <h2 className="text-2xl font-serif font-medium text-foreground mt-8 mb-4">Manager Access, Maintenance, and Interruptions</h2>
                  <p className="mb-6">
                    We may enter the property without prior notice in an emergency, and with reasonable notice for maintenance, repair, inspection, or to address a suspected violation of these Terms.
                  </p>

                  <p className="mb-6">
                    We do not guarantee uninterrupted availability of utilities, internet, air conditioning, hot tubs, pools, or appliances. Temporary outages, construction or noise on neighboring property, and equipment failure outside our control are not grounds for a refund. If a property becomes unavailable or unsuitable before arrival, we may offer a comparable alternative or a full refund of amounts paid, and that is the limit of our obligation.
                  </p>

                  <h2 className="text-2xl font-serif font-medium text-foreground mt-8 mb-4">Local Regulations and Short-Term Rental Licenses</h2>
                  <p className="mb-6">
                    Our properties operate under short-term rental licenses issued by their local jurisdictions, and the license number is displayed on each listing. You agree to comply with all applicable local ordinances, including noise, parking, occupancy, and trash requirements. Fines issued as a result of your conduct are your responsibility.
                  </p>

                  <p className="mb-6">
                    Stays are short-term only. No stay creates a tenancy or any residential occupancy right, and you agree to vacate at the scheduled check-out time.
                  </p>

                  <h2 className="text-2xl font-serif font-medium text-foreground mt-8 mb-4">Limitation of Liability</h2>
                  <p className="mb-6">
                    To the maximum extent permitted by California law, Solmar&eacute; Stays and the property owner are not liable for indirect, incidental, special, consequential, or punitive damages, or for lost enjoyment, lost profits, or travel costs, arising from your reservation or stay.
                  </p>

                  <p className="mb-6">
                    To the maximum extent permitted by law, our total aggregate liability arising out of or relating to your reservation or stay will not exceed the total amount you paid for that reservation.
                  </p>

                  <p className="mb-6">
                    Nothing in these Terms limits liability for death or personal injury caused by negligence where such limitation is prohibited by law, for fraud, or for any liability that cannot lawfully be excluded.
                  </p>

                  <h2 className="text-2xl font-serif font-medium text-foreground mt-8 mb-4">Indemnification</h2>
                  <p className="mb-6">
                    You agree to indemnify and hold harmless Solmar&eacute; Stays, the property owner, and their respective members, employees, agents, and contractors from any claim, loss, liability, fine, or expense (including reasonable attorneys&rsquo; fees) arising from your stay, your use of the property or its amenities, or any breach of these Terms by you or a member of your party.
                  </p>

                  <h2 className="text-2xl font-serif font-medium text-foreground mt-8 mb-4">Your Insurance</h2>
                  <p className="mb-6">
                    Your personal property is not insured by us or by the property owner. You are responsible for insuring your own belongings and for your own travel insurance.
                  </p>

                  <h2 className="text-2xl font-serif font-medium text-foreground mt-8 mb-4">Force Majeure</h2>
                  <p className="mb-6">
                    Neither party is liable for failure to perform due to events beyond reasonable control, including fire, flood, earthquake, storm, wildfire, power or utility failure, public health emergency, government order, or evacuation order. In such an event we will offer a refund of amounts paid for nights not stayed, or a credit, at our discretion.
                  </p>

                  <h2 className="text-2xl font-serif font-medium text-foreground mt-8 mb-4">Website Use and Intellectual Property</h2>
                  <p className="mb-6">
                    The content of this website, including text, photography, and branding, is owned by or licensed to us and is provided for your personal use. You may not republish, sell, sub-license, reproduce, or redistribute it without our written permission. We do not warrant that the information on this website is complete or error-free.
                  </p>

                  <h2 className="text-2xl font-serif font-medium text-foreground mt-8 mb-4">Privacy</h2>
                  <p className="mb-6">
                    Our handling of your personal information is described in our <a href="/privacy" className="underline">Privacy Policy</a>, which forms part of these Terms.
                  </p>

                  <h2 className="text-2xl font-serif font-medium text-foreground mt-8 mb-4">Governing Law and Venue</h2>
                  <p className="mb-6">
                    These Terms are governed by the laws of the State of California, without regard to conflict-of-law rules. Any dispute will be brought exclusively in the state or federal courts located in San Luis Obispo County, California, and both parties consent to that jurisdiction. In any action to enforce these Terms, the prevailing party is entitled to recover reasonable attorneys&rsquo; fees and costs.
                  </p>

                  <h2 className="text-2xl font-serif font-medium text-foreground mt-8 mb-4">General</h2>
                  <p className="mb-6">
                    If any provision of these Terms is held unenforceable, the remainder stays in effect. These Terms, together with your confirmation and the property&rsquo;s house rules, are the entire agreement between you and Solmar&eacute; Stays regarding your stay. We may update these Terms at any time; the version in effect when you booked governs your reservation.
                  </p>

                  <h2 className="text-2xl font-serif font-medium text-foreground mt-8 mb-4">Contact</h2>
                  <p className="mb-6">
                    Solmare Stays LLC (dba Solmar&eacute; Stays)<br />California Entity No. B20260285501<br />3820 Sequoia Dr, San Luis Obispo, CA 93401<br />Email: info@solmarestays.com<br />Phone: (805) 242-6411
                  </p>

                </div>
              </>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
