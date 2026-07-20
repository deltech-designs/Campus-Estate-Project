'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/partials/Button';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Close mobile menu when viewport matches desktop breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navLinks = [
    { label: 'Browse Properties', href: '#properties' },
    { label: 'Platform Features', href: '#features' },
    { label: 'Live Stats', href: '#stats' },
    { label: 'Reviews', href: '#testimonials' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--color-surface)]/80 backdrop-blur-md border-b border-[var(--color-border)] shadow-sm">
      {/* Top accent color strip */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-info)] to-[var(--color-success)]" />
      
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo and Brand */}
        <div 
          className="flex items-center gap-3 group cursor-pointer" 
          onClick={() => {
            setIsOpen(false);
            window.location.href = '/';
          }}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] rounded-[var(--radius-md)] flex items-center justify-center shadow-[0_0_15px_rgba(var(--color-primary),0.2)] group-hover:shadow-[0_0_20px_var(--color-primary)/0.35] group-hover:scale-105 transition-all duration-300">
            <span className="text-[var(--color-text-inverse)] text-xl font-bold font-display">E</span>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-[var(--color-primary)] font-display group-hover:text-[var(--color-primary-hover)] transition-colors">
            CampusEstate
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10 text-sm font-semibold text-[var(--color-text-secondary)]">
          {navLinks.map((link) => (
            <a 
              key={link.label}
              href={link.href} 
              className="hover:text-[var(--color-primary)] transition-all duration-200 relative group py-2"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-info)] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isLoading ? (
            <span className="w-5 h-5 border-2 border-[var(--color-text-secondary)] border-t-transparent rounded-full animate-spin" />
          ) : isAuthenticated ? (
            <Button 
              onClick={() => {
                const ROLE_HOME: Record<string, string> = {
                  admin: '/admin/overview',
                  manager: '/manager/overview',
                  tenant: '/tenants',
                };
                window.location.href = ROLE_HOME[user?.role ?? ''] ?? '/overview';
              }}
              size="md" 
              className="shadow-[0_4px_12px_var(--color-primary)/0.15] hover:shadow-[0_4px_20px_var(--color-primary)/0.3] hover:scale-[1.01] transition-all"
            >
              Go to Dashboard
            </Button>
          ) : (
            <>
              <a href="/login" className="text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">
                Sign In
              </a>
              <Button 
                onClick={() => window.location.href = '/register'} 
                size="md" 
                className="shadow-[0_4px_12px_var(--color-primary)/0.15] hover:shadow-[0_4px_20px_var(--color-primary)/0.3] hover:scale-[1.01] transition-all"
              >
                Create Account
              </Button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-sunken)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6 text-[var(--color-text-primary)]" /> : <Menu className="w-6 h-6 text-[var(--color-text-primary)]" />}
        </button>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'calc(100vh - 83px)' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden fixed top-[83px] left-0 w-full bg-[var(--color-surface-raised)] border-b border-[var(--color-border)] shadow-lg overflow-y-auto z-30"
          >
            <div className="px-6 py-8 flex flex-col h-full justify-between gap-8">
              <nav className="flex flex-col gap-6">
                {navLinks.map((link, idx) => (
                  <motion.a
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between text-base font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors border-b border-[var(--color-border)]/50 pb-3"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-[var(--color-text-disabled)]" />
                  </motion.a>
                ))}
              </nav>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
                className="flex flex-col gap-4 mt-auto pb-12"
              >
                {isLoading ? (
                  <div className="flex justify-center py-2">
                    <span className="w-6 h-6 border-2 border-[var(--color-text-secondary)] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : isAuthenticated ? (
                  <Button
                    onClick={() => {
                      const ROLE_HOME: Record<string, string> = {
                        admin: '/admin/overview',
                        manager: '/manager/overview',
                        tenant: '/tenants',
                      };
                      setIsOpen(false);
                      window.location.href = ROLE_HOME[user?.role ?? ''] ?? '/overview';
                    }}
                    size="lg"
                    className="w-full flex items-center justify-center gap-2 shadow-[0_4px_12px_var(--color-primary)/0.15]"
                  >
                    Go to Dashboard
                  </Button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <a
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="w-full py-3 flex items-center justify-center text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] bg-[var(--color-surface-sunken)] rounded-[var(--radius-btn)] border border-[var(--color-border)] transition-all text-center"
                    >
                      Sign In
                    </a>
                    <Button
                      onClick={() => {
                        setIsOpen(false);
                        window.location.href = '/register';
                      }}
                      size="md"
                      className="w-full shadow-[0_4px_12px_var(--color-primary)/0.15]"
                    >
                      Create Account
                    </Button>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
