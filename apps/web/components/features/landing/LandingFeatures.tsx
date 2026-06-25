import { Badge } from '@/components/partials/Badge';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 70,
      damping: 15,
    },
  },
};

export function LandingFeatures() {
  return (
    <section id="features" className="py-24 bg-[var(--color-surface-raised)] border-y border-[var(--color-border)] relative overflow-hidden">
      {/* Mesh Glow */}
      <div className="absolute right-0 top-1/2 w-64 h-64 rounded-full bg-[var(--color-primary)] opacity-5 filter blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <Badge variant="info" className="mb-3">PLATFORM CAPABILITIES</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[var(--color-text-primary)] tracking-tight">
            Designed Exclusively for Campus Living
          </h2>
          <p className="mt-3 text-base text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Skip traditional tenancy pain points. We built a fully integrated ecosystem matching verified student hostels with smart management.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
        >
          <motion.div variants={itemVariants} className="group bg-[var(--color-surface)] p-8 rounded-[var(--radius-xl)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-2xl mb-6 shadow-sm group-hover:scale-105 transition-transform">
              🎓
            </div>
            <h3 className="text-base font-extrabold text-[var(--color-text-primary)] font-display">Proximity Map Zones</h3>
            <p className="mt-3 text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Every property maps explicitly to campus zones, verifying direct walkable distances to lecture theaters and student halls.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="group bg-[var(--color-surface)] p-8 rounded-[var(--radius-xl)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl mb-6 shadow-sm group-hover:scale-105 transition-transform">
              📄
            </div>
            <h3 className="text-base font-extrabold text-[var(--color-text-primary)] font-display">Smart Paperless Leases</h3>
            <p className="mt-3 text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Review terms, sign agreements, log check-in condition reports, and handle digital renewals seamlessly.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="group bg-[var(--color-surface)] p-8 rounded-[var(--radius-xl)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl mb-6 shadow-sm group-hover:scale-105 transition-transform">
              💳
            </div>
            <h3 className="text-base font-extrabold text-[var(--color-text-primary)] font-display">Integrated Banking</h3>
            <p className="mt-3 text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Automated monthly bills. Pay directly via bank transfer or card with instant receipts. Fully traceable rent ledger history.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="group bg-[var(--color-surface)] p-8 rounded-[var(--radius-xl)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl mb-6 shadow-sm group-hover:scale-105 transition-transform">
              🔧
            </div>
            <h3 className="text-base font-extrabold text-[var(--color-text-primary)] font-display">Fast Track Maintenance</h3>
            <p className="mt-3 text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Issue plumbing, power, or security tickets from your room dashboard. Monitor technicians and vendor repair timelines.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
