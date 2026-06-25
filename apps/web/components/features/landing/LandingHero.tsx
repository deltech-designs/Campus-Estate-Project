'use client';

import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const badgeVariants: Variants = {
  hidden: { opacity: 0, y: -15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

const textVariants: Variants = {
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

const trustVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const trustItemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  },
};

export function LandingHero() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto px-6 text-center relative z-10"
    >
      
      {/* ─── Premium Verified Badge ────────────────────────────────────────── */}
      <motion.div
        variants={badgeVariants}
        className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-full shadow-[var(--shadow-card)] mb-8 hover:border-[var(--color-primary)]/20 transition-all duration-300 pointer-events-none group"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-success)] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-success)]"></span>
        </span>
        
        <svg className="w-3.5 h-3.5 text-[var(--color-success)]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>

        <span className="text-xs font-bold tracking-wide uppercase text-[var(--color-text-secondary)]">
          Institutional Housing Registry
        </span>
      </motion.div>

      {/* ─── Hero Headlines ────────────────────────────────────────────────── */}
      <motion.h1
        variants={textVariants}
        className="text-4xl sm:text-7xl font-extrabold text-[var(--color-text-primary)] font-display leading-[1.08] tracking-tight max-w-5xl mx-auto"
      >
        Find Your Next Campus Home <br />
        <span className="bg-gradient-to-r from-[var(--color-primary)] via-indigo-600 to-[var(--color-success)] bg-clip-text text-transparent">
          Without the Agent Fees.
        </span>
      </motion.h1>

      {/* ─── Hero Description ──────────────────────────────────────────────── */}
      <motion.p
        variants={textVariants}
        className="mt-8 text-base sm:text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto font-normal leading-relaxed"
      >
        Verify walk-times to lectures, sign smart digital leases, and submit maintenance tickets directly. Secured student residences managed on a standardized institutional platform.
      </motion.p>

      {/* ─── Trust Indicators Row ──────────────────────────────────────────── */}
      <motion.div
        variants={trustVariants}
        className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-xs font-bold text-[var(--color-text-secondary)] border-t border-[var(--color-border)] pt-8 max-w-3xl mx-auto"
      >
        
        <motion.div
          variants={trustItemVariants}
          className="flex items-center gap-2 group cursor-pointer hover:text-[var(--color-text-primary)] transition-colors"
        >
          <div className="w-7 h-7 rounded-lg bg-[var(--color-primary-light)] flex items-center justify-center text-[var(--color-primary)] transition-transform group-hover:scale-105">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z" />
            </svg>
          </div>
          <span>Walk-Times Verified</span>
        </motion.div>

        <motion.div
          variants={trustItemVariants}
          className="flex items-center gap-2 group cursor-pointer hover:text-[var(--color-text-primary)] transition-colors"
        >
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center transition-transform group-hover:scale-105">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <span>Smart Escrow Lease</span>
        </motion.div>

        <motion.div
          variants={trustItemVariants}
          className="flex items-center gap-2 group cursor-pointer hover:text-[var(--color-text-primary)] transition-colors"
        >
          <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-700 flex items-center justify-center transition-transform group-hover:scale-105">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h16.5m-18 4.5h16.5m-18 4.5h16.5m-18 4.5h16.5m-16.5 0h16.5M12 9v9m-3-6H6m12 0h-3" />
            </svg>
          </div>
          <span>0% Agent Commissions</span>
        </motion.div>

      </motion.div>

    </motion.div>
  );
}

