'use client';

import { Badge } from '@/components/partials/Badge';

export function LandingTestimonials() {
  return (
    <section id="testimonials" className="py-24 bg-[var(--color-surface-raised)] border-t border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <Badge variant="info" className="mb-3">TESTIMONIALS</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[var(--color-text-primary)] tracking-tight">
            Trusted by Campus Communities
          </h2>
          <p className="mt-3 text-base text-[var(--color-text-secondary)] max-w-xl mx-auto">
            Real stories from students and estate landlords managing housing on CampusEstate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="bg-[var(--color-surface)] p-8 rounded-[var(--radius-xl)] border border-[var(--color-border)] relative flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex gap-0.5 text-amber-500 text-sm mb-4">★★★★★</div>
              <p className="text-sm italic text-[var(--color-text-primary)] leading-relaxed">
                "Finding Ivy Heights was incredibly stress-free. In Yaba, agents typically charge exorbitant, hidden fees. Here, I applied online, signed my lease contract, and checked in within 48 hours without paying any commission."
              </p>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-xs">
                CO
              </div>
              <div>
                <h4 className="text-xs font-bold text-[var(--color-text-primary)]">Chidi Okoro</h4>
                <p className="text-[10px] text-[var(--color-text-secondary)]">Computer Science Undergraduate</p>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-[var(--color-surface)] p-8 rounded-[var(--radius-xl)] border border-[var(--color-border)] relative flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex gap-0.5 text-amber-500 text-sm mb-4">★★★★★</div>
              <p className="text-sm italic text-[var(--color-text-primary)] leading-relaxed">
                "We own three student hostels near Akoka. Reconciling bank payments manually was an absolute mess. The CampusEstate landlord portal automates our rent collection and registers lease documents instantly."
              </p>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center font-bold text-teal-700 text-xs">
                FA
              </div>
              <div>
                <h4 className="text-xs font-bold text-[var(--color-text-primary)]">Mrs. Funmi Alao</h4>
                <p className="text-[10px] text-[var(--color-text-secondary)]">Operations Manager, Alao Hostels</p>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-[var(--color-surface)] p-8 rounded-[var(--radius-xl)] border border-[var(--color-border)] relative flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex gap-0.5 text-amber-500 text-sm mb-4">★★★★★</div>
              <p className="text-sm italic text-[var(--color-text-primary)] leading-relaxed">
                "I had a water pipe leak on a Saturday morning. Logged a repair ticket from my room dashboard with a photo, and the campus vendor arrived within two hours to patch it up. I didn't spend a single Naira."
              </p>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700 text-xs">
                TE
              </div>
              <div>
                <h4 className="text-xs font-bold text-[var(--color-text-primary)]">Tobi Emmanuel</h4>
                <p className="text-[10px] text-[var(--color-text-secondary)]">Mechanical Engineering Student</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
