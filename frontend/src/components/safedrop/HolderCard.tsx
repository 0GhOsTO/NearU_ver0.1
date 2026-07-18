import Link from 'next/link';
import { MapPin, Package } from 'lucide-react';
import RatingStars from '@/components/profile/RatingStars';

interface HolderCardProps {
  id: string;
  name: string;
  address: string;
  rating: number;
  capacity: number;
}

export default function HolderCard({ id, name, address, rating, capacity }: HolderCardProps) {
  return (
    <Link href={`/safedrop/${id}`}>
      <div className="group rounded-2xl border border-nu-border bg-nu-surface p-4 transition-all hover:border-nu-border/80 hover:bg-nu-elevated">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-nu-text group-hover:text-nu-blue transition-colors">{name}</h3>
            <div className="mt-1 flex items-center gap-1 text-sm text-nu-muted">
              <MapPin className="h-3.5 w-3.5 text-nu-blue flex-shrink-0" />
              <span className="truncate">{address}</span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <RatingStars rating={rating} />
              <div className="flex items-center gap-1 text-sm text-nu-dim">
                <Package className="h-3.5 w-3.5" />
                <span>{capacity} slots</span>
              </div>
            </div>
          </div>
          <span className="text-xs font-semibold text-nu-blue">Message</span>
        </div>
      </div>
    </Link>
  );
}
