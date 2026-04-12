'use client';

import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Terms() {
  return (
    <>
      <Header />
      <main className="overflow-x-hidden bg-white pt-20 text-gray-900">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#001F3F]/10 via-white to-white" />
          <div className="relative mx-auto flex min-h-[40vh] max-w-7xl items-center px-6 py-16 sm:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-4xl"
            >
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[#FF6B35]">
                Legal
              </p>
              <h1 className="text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl text-gray-900">
                Terms<span className="text-[#FF6B35]"> of Service</span>
              </h1>
              <p className="mt-6 max-w-3xl text-lg text-gray-600 sm:text-xl">
                The Polity Media – Terms of Service (2025)
              </p>
            </motion.div>
          </div>
        </section>

        <section className="px-6 py-16 sm:px-8 lg:px-12 bg-gray-50">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="rounded-3xl border border-gray-200 bg-white p-8 md:p-12">
                <p className="text-gray-500 text-sm mb-8">Last updated: 2025</p>

                <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900">1. Booking & Payment</h2>
                <ul className="text-gray-600 leading-relaxed mb-6 space-y-2">
                  <li>• A non-refundable deposit is required to secure your booking.</li>
                  <li>• Full payment must be completed no later than 4 weeks before the event date.</li>
                  <li>• Bookings are only confirmed once payment has been received.</li>
                  <li>• Late payments may incur additional charges or result in cancellation.</li>
                </ul>

                <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900">2. Cancellations & Rescheduling</h2>
                <ul className="text-gray-600 leading-relaxed mb-6 space-y-2">
                  <li>• Changes to the event date or location after booking may attract additional fees.</li>
                  <li>• The Polity Media reserves the right to cancel up to 4 weeks before the event due to emergencies or unforeseen circumstances, with a full refund issued.</li>
                </ul>

                <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900">3. Service Delivery</h2>
                <ul className="text-gray-600 leading-relaxed mb-6 space-y-2">
                  <li>• Final edited photos and/or videos will be delivered within 1–4 weeks after the event.</li>
                  <li>• Up to 50 images will be retouched, and all images will be edited.</li>
                  <li>• Deliverables will match what is stated in your invoice.</li>
                  <li>• Raw/unedited files are not included unless separately agreed for an additional fee.</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900">Quality Standards</h3>
                <ul className="text-gray-600 leading-relaxed mb-6 space-y-2">
                  <li>• Photos are acceptable if subjects or actions are clear and identifiable.</li>
                  <li>• Audio is acceptable if speech is audible and understandable.</li>
                  <li>• Creative styles (e.g., motion blur, depth of field, camera movement) are intentional artistic choices, not defects.</li>
                  <li>• Preferences beyond this standard are considered subjective, not quality issues.</li>
                </ul>

                <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900">4. Event Day Logistics</h2>
                <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900">General Logistics</h3>
                <ul className="text-gray-600 leading-relaxed mb-4 space-y-2">
                  <li>• The Polity Media manages crew logistics.</li>
                  <li>• For smooth coverage, transporting the crew alongside the couple is recommended.</li>
                  <li>• If travel between locations exceeds 15 minutes, additional logistics fees may apply.</li>
                  <li>• Arrival and departure times must be finalized at least 9 weeks before the event.</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900">Timing</h3>
                <ul className="text-gray-600 leading-relaxed mb-4 space-y-2">
                  <li>• Earliest crew arrival: 8:00 AM.</li>
                  <li>• Earlier arrival may incur additional charges.</li>
                  <li>• Multi-location events may attract extra fees.</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900">Coverage Scope</h3>
                <p className="text-gray-600 leading-relaxed mb-3">We aim to capture the following (subject to your package and schedule):</p>
                <ul className="text-gray-600 leading-relaxed mb-4 space-y-2">
                  <li>• Pre-event preparations (makeup, dressing, etc.)</li>
                  <li>• Portrait sessions</li>
                  <li>• Bridal and couple entrances</li>
                  <li>• Exchange of vows and rings</li>
                  <li>• Bridal party entrances</li>
                  <li>• Traditional/registry ceremony & reception</li>
                  <li>• First dance and parent dances</li>
                  <li>• Cake cutting</li>
                </ul>
                <p className="text-gray-600 leading-relaxed mb-4 italic">Note: Coverage depends on actual event activities and booked hours. Additional hours must be booked in advance or will be charged at a higher rate on the day. Activities outside booked hours are treated as after-party coverage.</p>

                <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900">5. Other Media Teams</h2>
                <ul className="text-gray-600 leading-relaxed mb-6 space-y-2">
                  <li>• To ensure the best results, The Polity Media should be the only media team present.</li>
                  <li>• If additional media teams or content creators will be present, this must be disclosed in advance.</li>
                  <li>• Coverage guarantees apply only when we are the sole media provider.</li>
                </ul>

                <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900">6. Accommodation</h2>
                <ul className="text-gray-600 leading-relaxed mb-6 space-y-2">
                  <li>• If provided by the client, accommodation must be safe, clean, and suitable.</li>
                  <li>• The client is responsible for the safety of crew members and equipment.</li>
                  <li>• If overnight stay is required due to timing or logistics, accommodation fees will apply.</li>
                </ul>

                <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900">7. Copyright & Usage</h2>
                <ul className="text-gray-600 leading-relaxed mb-6 space-y-2">
                  <li>• The Polity Media retains full ownership of all content produced.</li>
                  <li>• We reserve the right to use images and videos for promotion, advertising, and social media.</li>
                  <li>• Clients may be tagged in shared content.</li>
                </ul>

                <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900">8. Client Usage Rights</h2>
                <ul className="text-gray-600 leading-relaxed mb-6 space-y-2">
                  <li>• Clients receive a personal, non-commercial license for their media.</li>
                  <li>• Commercial use (e.g., advertising or resale) requires a separate agreement.</li>
                </ul>

                <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900">9. Refund Policy</h2>
                <ul className="text-gray-600 leading-relaxed mb-6 space-y-2">
                  <li>• All payments are final. No refunds after booking.</li>
                  <li>• Clients are advised to: Review package details carefully, Communicate preferences in advance</li>
                </ul>

                <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900">10. Dispute Resolution</h2>
                <ul className="text-gray-600 leading-relaxed mb-6 space-y-2">
                  <li>• Complaints must be submitted via email within 5 working days of delivery.</li>
                  <li>• Issues will be reviewed and resolved where appropriate.</li>
                </ul>

                <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900">11. Liability</h2>
                <ul className="text-gray-600 leading-relaxed mb-6 space-y-2">
                  <li>• The Polity Media is not liable for circumstances beyond its control (e.g., weather, unforeseen disruptions).</li>
                </ul>

                <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900">12. Data Storage</h2>
                <ul className="text-gray-600 leading-relaxed mb-6 space-y-2">
                  <li>• Files are stored for 7 days after delivery.</li>
                  <li>• Clients are responsible for downloading and backing up their files promptly.</li>
                  <li>• After this period, file availability is not guaranteed.</li>
                  <li>• Flash drives are for delivery only, not long-term storage.</li>
                </ul>

                <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900">13. Client Conduct</h2>
                <ul className="text-gray-600 leading-relaxed mb-6 space-y-2">
                  <li>• Clients must treat staff with respect and professionalism.</li>
                  <li>• Harassment or abusive behavior will result in immediate termination of services without refund.</li>
                </ul>

                <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900">14. Agreement</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  By making payment, you confirm that you have:
                </p>
                <ul className="text-gray-600 leading-relaxed mb-6 space-y-2">
                  <li>• Read and understood these terms</li>
                  <li>• Agreed to be bound by them</li>
                </ul>

                <div className="mt-12 p-6 bg-gray-100 rounded-2xl text-center">
                  <h3 className="text-xl font-bold mb-4 text-gray-900">Book Now</h3>
                  <p className="text-gray-600 mb-6">Secure your date by completing your deposit with The Polity Media.</p>
                  <a href="/contact" className="inline-block px-8 py-4 bg-[#FF6B35] text-white rounded-full font-medium hover:bg-[#FF9F66] transition-colors">
                    Contact Us
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}