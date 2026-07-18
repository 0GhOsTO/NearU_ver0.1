import Badge from '@/components/ui/Badge';

interface GigStatusBadgeProps {
  status: 'open' | 'in_progress' | 'completed';
}

const statusConfig = {
  open:        { label: 'Open',        variant: 'success' as const },
  in_progress: { label: 'In Progress', variant: 'warning' as const },
  completed:   { label: 'Completed',   variant: 'default' as const },
};

export default function GigStatusBadge({ status }: GigStatusBadgeProps) {
  const config = statusConfig[status];
  return <Badge label={config.label} variant={config.variant} />;
}
