import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-16 w-16 text-xl',
  xl: 'h-28 w-28 text-3xl',
  '2xl': 'h-36 w-36 text-4xl',
};

const colors = [
  'bg-nu-blue text-nu-bg',
  'bg-nu-mint text-nu-bg',
  'bg-nu-coral text-white',
  'bg-sky-500 text-white',
  'bg-violet-500 text-white',
  'bg-pink-500 text-white',
  'bg-teal-500 text-white',
  'bg-orange-500 text-white',
];

function getColor(name: string) {
  return colors[name.charCodeAt(0) % colors.length];
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function Avatar({ src, name, size = 'md' }: AvatarProps) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover ring-2 ring-nu-border', sizeClasses[size])}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full font-bold ring-2 ring-nu-border',
        sizeClasses[size],
        getColor(name)
      )}
    >
      {getInitials(name)}
    </div>
  );
}
