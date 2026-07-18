import Link from 'next/link';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';

interface FeedCardProps {
  id: string;
  type: 'gig' | 'marketplace' | 'borrow' | 'hangout' | 'ride';
  title: string;
  description: string;
  user: string;
  timestamp: string;
  price?: number;
}

const typeConfig = {
  gig: {
    label: 'Gig',
    href: '/gigs',
    pill: 'bg-emerald-100 text-emerald-700',
    border: 'border-l-emerald-400',
    price: 'text-emerald-600',
    dot: 'bg-emerald-400',
  },
  marketplace: {
    label: 'For Sale',
    href: '/marketplace',
    pill: 'bg-amber-100 text-amber-700',
    border: 'border-l-amber-400',
    price: 'text-amber-600',
    dot: 'bg-amber-400',
  },
  borrow: {
    label: 'Borrow',
    href: '/borrow',
    pill: 'bg-violet-100 text-violet-700',
    border: 'border-l-violet-400',
    price: 'text-violet-600',
    dot: 'bg-violet-400',
  },
  hangout: {
    label: 'Hangout',
    href: '/hangout',
    pill: 'bg-pink-100 text-pink-700',
    border: 'border-l-pink-400',
    price: 'text-pink-600',
    dot: 'bg-pink-400',
  },
  ride: {
    label: 'Ride',
    href: '/group-ride',
    pill: 'bg-cyan-100 text-cyan-700',
    border: 'border-l-cyan-400',
    price: 'text-cyan-600',
    dot: 'bg-cyan-400',
  },
};

export default function FeedCard({ id, type, title, description, user, timestamp, price }: FeedCardProps) {
  const config = typeConfig[type];

  return (
    <Link href={`${config.href}/${id}`}>
      <div className={`group rounded-2xl border border-nu-border border-l-4 ${config.border} bg-white p-4 transition-all hover:shadow-card-md`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.pill}`}>
                {config.label}
              </span>
              <span className="text-xs text-nu-dim">
                {formatRelativeTime(new Date(timestamp))}
              </span>
            </div>
            <h3 className="font-semibold text-nu-text truncate group-hover:text-nu-blue transition-colors">{title}</h3>
            <p className="mt-1 text-sm text-nu-muted line-clamp-2">{description}</p>
            <p className="mt-2 text-xs text-nu-dim">by {user}</p>
          </div>
          {price !== undefined && (
            <div className="flex-shrink-0 text-right">
              <span className={`font-display text-xl font-bold ${config.price}`}>{formatCurrency(price)}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
