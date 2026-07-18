import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

interface ListingCardProps {
  id: string;
  title: string;
  price: number;
  image?: string;
  condition: string;
  seller: string;
}

const conditionConfig: Record<string, { label: string; className: string }> = {
  new:      { label: 'New',       className: 'bg-emerald-100 text-emerald-700' },
  like_new: { label: 'Like New',  className: 'bg-blue-100 text-nu-blue' },
  good:     { label: 'Good',      className: 'bg-amber-100 text-amber-700' },
  fair:     { label: 'Fair',      className: 'bg-orange-100 text-orange-700' },
};

export default function ListingCard({ id, title, price, image, condition, seller }: ListingCardProps) {
  const cfg = conditionConfig[condition] ?? { label: condition, className: 'bg-nu-elevated text-nu-muted' };

  return (
    <Link href={`/marketplace/${id}`}>
      <div className="group rounded-2xl border border-nu-border bg-white hover:shadow-card-md transition-all overflow-hidden">
        {/* Image */}
        <div className="aspect-square bg-nu-elevated flex items-center justify-center overflow-hidden">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <span className="text-4xl opacity-20">📦</span>
          )}
        </div>
        {/* Info */}
        <div className="p-3">
          <h3 className="font-semibold text-nu-text truncate text-sm group-hover:text-nu-blue transition-colors">{title}</h3>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="font-display text-lg font-bold text-amber-600">{formatCurrency(price)}</span>
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${cfg.className}`}>
              {cfg.label}
            </span>
          </div>
          <p className="mt-1 text-xs text-nu-dim">{seller}</p>
        </div>
      </div>
    </Link>
  );
}
