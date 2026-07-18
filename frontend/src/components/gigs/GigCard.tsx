import Link from 'next/link';
import { MapPin } from 'lucide-react';
import GigStatusBadge from './GigStatusBadge';

interface GigCardProps {
  id: string;
  title: string;
  distance?: string;
  poster: string;
  status: 'open' | 'in_progress' | 'completed';
}

export default function GigCard({ id, title, distance, poster, status }: GigCardProps) {
  return (
    <Link href={`/gigs/${id}`}>
      <div className="group rounded-2xl border border-nu-border border-l-4 border-l-emerald-400 bg-white p-4 transition-all hover:shadow-card-md">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-nu-text truncate group-hover:text-nu-blue transition-colors">{title}</h3>
            <p className="mt-1 text-sm text-nu-muted">by {poster}</p>
            {distance && (
              <div className="mt-2 flex items-center gap-1 text-xs text-nu-dim">
                <MapPin className="h-3 w-3 text-emerald-500" />
                <span>{distance} away</span>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <GigStatusBadge status={status} />
          </div>
        </div>
      </div>
    </Link>
  );
}
