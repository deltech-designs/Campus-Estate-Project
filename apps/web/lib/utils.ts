/**
 * Shared utility helpers for @ems/web
 */

/** Format a date string to a human-readable format */
export function formatDate(dateStr: string, options?: Intl.DateTimeFormatOptions): string {
  return new Date(dateStr).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  });
}

/** Format a number as Nigerian Naira currency */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount);
}

/** Capitalise the first letter of a string */
export function capitalise(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/** Get the full name from first + last */
export function fullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim();
}

/** Get initials from a name */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
