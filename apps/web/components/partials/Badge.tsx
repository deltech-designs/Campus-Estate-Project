type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-[oklch(95%_0.06_160)] text-[oklch(35%_0.16_160)]',
  warning: 'bg-[oklch(96%_0.08_75)] text-[oklch(45%_0.18_75)]',
  danger:  'bg-[oklch(96%_0.06_25)] text-[oklch(40%_0.22_25)]',
  info:    'bg-[oklch(95%_0.06_240)] text-[oklch(35%_0.18_240)]',
  neutral: 'bg-[var(--color-surface-2)] text-[var(--color-muted)]',
};

export function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        variantStyles[variant],
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );
}
