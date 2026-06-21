import { getInitials } from '@/lib/utils';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-base' };

export function Avatar({ name, src, size = 'md', className = '' }: AvatarProps) {
  return (
    <div
      className={[
        'rounded-full flex items-center justify-center font-semibold shrink-0 overflow-hidden',
        'bg-[var(--color-primary)] text-white',
        sizeMap[size],
        className,
      ].join(' ')}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        getInitials(name)
      )}
    </div>
  );
}
