import { cn } from '@/lib/utils';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

const variantClasses = {
  default:  'bg-nu-elevated text-nu-muted border border-nu-border',
  success:  'bg-nu-mint/15 text-nu-mint border border-nu-mint/25',
  warning:  'bg-nu-blue/15 text-nu-blue border border-nu-blue/25',
  danger:   'bg-nu-coral/15 text-nu-coral border border-nu-coral/25',
  info:     'bg-sky-500/15 text-sky-400 border border-sky-500/25',
};

export default function Badge({ label, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide',
        variantClasses[variant],
        className
      )}
    >
      {label}
    </span>
  );
}
