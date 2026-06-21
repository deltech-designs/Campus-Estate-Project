import { forwardRef } from 'react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, id, className = '', ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={inputId} className="flex items-center gap-2 cursor-pointer select-none">
          <input
            ref={ref}
            type="checkbox"
            id={inputId}
            className={[
              'w-4 h-4 rounded accent-[var(--color-primary)] cursor-pointer',
              className,
            ].join(' ')}
            {...props}
          />
          <span className="text-sm text-[var(--color-foreground)]">{label}</span>
        </label>
        {error && <p className="text-xs text-[var(--color-danger)] ml-6">{error}</p>}
      </div>
    );
  },
);
Checkbox.displayName = 'Checkbox';
