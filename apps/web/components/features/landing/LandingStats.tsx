'use client';

import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 15,
    },
  },
};

export function LandingStats() {
  return (
    <section id="stats" className="py-20 max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ type: 'spring', stiffness: 60, damping: 15 }}
        className="bg-gradient-to-tr from-[var(--color-sidebar-bg)] to-[var(--color-primary)] text-white rounded-[var(--radius-xl)] p-10 sm:p-16 shadow-[var(--shadow-modal)] relative overflow-hidden"
      >
        
        {/* Background Blueprint grids */}
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--color-success),transparent_50%)] opacity-10 pointer-events-none" />
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center"
        >
          <motion.div 
            variants={itemVariants} 
            className="flex flex-col items-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all duration-300 group shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_var(--color-primary)/0.25]"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-[var(--color-primary-light)]/10 text-[var(--color-primary-light)] mb-4 group-hover:scale-110 group-hover:bg-[var(--color-primary-light)]/20 transition-all duration-300">
              🛏️
            </div>
            <span className="text-4xl sm:text-5xl font-black font-display tracking-tight text-white group-hover:text-[var(--color-primary-light)] transition-colors">500+</span>
            <p className="mt-3 text-xs sm:text-sm text-slate-300 font-semibold group-hover:text-white transition-colors">Verified Beds Managed</p>
          </motion.div>
          
          <motion.div 
            variants={itemVariants} 
            className="flex flex-col items-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all duration-300 group shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_var(--color-success)/0.25]"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-[var(--color-success)]/10 text-[var(--color-success)] mb-4 group-hover:scale-110 group-hover:bg-[var(--color-success)]/20 transition-all duration-300">
              📈
            </div>
            <span className="text-4xl sm:text-5xl font-black font-display tracking-tight text-[var(--color-success)] group-hover:scale-105 transition-all duration-300">98.4%</span>
            <p className="mt-3 text-xs sm:text-sm text-slate-300 font-semibold group-hover:text-white transition-colors">Verified Occupancy Rate</p>
          </motion.div>
          
          <motion.div 
            variants={itemVariants} 
            className="flex flex-col items-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all duration-300 group shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_var(--color-warning)/0.25]"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-[var(--color-warning)]/10 text-[var(--color-warning)] mb-4 group-hover:scale-110 group-hover:bg-[var(--color-warning)]/20 transition-all duration-300">
              ⚡
            </div>
            <span className="text-4xl sm:text-5xl font-black font-display tracking-tight text-white group-hover:text-[var(--color-warning)] transition-colors">&lt; 8h</span>
            <p className="mt-3 text-xs sm:text-sm text-slate-300 font-semibold group-hover:text-white transition-colors">Avg Maintenance Response</p>
          </motion.div>
          
          <motion.div 
            variants={itemVariants} 
            className="flex flex-col items-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all duration-300 group shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_var(--color-info)/0.25]"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-[var(--color-info)]/10 text-[var(--color-info)] mb-4 group-hover:scale-110 group-hover:bg-[var(--color-info)]/20 transition-all duration-300">
              🛡️
            </div>
            <span className="text-4xl sm:text-5xl font-black font-display tracking-tight text-white group-hover:text-[var(--color-info)] transition-colors">₦0</span>
            <p className="mt-3 text-xs sm:text-sm text-slate-300 font-semibold group-hover:text-white transition-colors">Agent Commissions / Fees</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

