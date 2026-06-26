import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<string, string> = {
  primary:
    'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98] active:shadow-sm shadow-sm',
  secondary:
    'bg-[var(--color-surface-raised)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:bg-[var(--color-surface-sunken)] hover:border-[var(--color-primary)]/30 hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 active:scale-[0.98] shadow-sm',
  danger:
    'bg-[var(--color-danger)] text-white hover:opacity-90 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98] shadow-sm',
  ghost:
    'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-text-primary)] active:scale-[0.98]',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-4 py-2.5 text-xs sm:text-sm font-semibold',
  md: 'px-5 py-3 text-sm font-semibold',
  lg: 'px-7 py-3.5 text-base font-semibold',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, disabled, className = '', children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled ?? loading}
      className={[
        'inline-flex items-center justify-center gap-2 font-medium rounded-[var(--radius-btn)] transition-all duration-200 ease-in-out transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        className,
      ].join(' ')}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  ),
);
Button.displayName = 'Button';
