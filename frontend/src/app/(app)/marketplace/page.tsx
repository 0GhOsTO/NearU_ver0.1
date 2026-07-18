import Link from 'next/link';
import { Plus } from 'lucide-react';
import ListingCard from '@/components/marketplace/ListingCard';
import ListingGrid from '@/components/marketplace/ListingGrid';
import PageHeader from '@/components/layout/PageHeader';
import { getListings } from './actions';

export default async function MarketplacePage() {
  const listings = await getListings();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageHeader title="Marketplace" />
        <Link
          href="/marketplace/new"
          className="flex items-center gap-1.5 rounded-xl bg-nu-blue px-4 py-2 text-sm font-semibold text-white hover:bg-nu-blue-dark transition-all"
        >
          <Plus className="h-4 w-4" />
          Sell
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-2xl border border-nu-border bg-nu-surface p-10 text-center shadow-card">
          <p className="font-display text-lg font-bold text-nu-text">Nothing for sale yet</p>
          <p className="mt-1 text-sm text-nu-muted">
            Be the first to list something for your neighbors.
          </p>
          <Link
            href="/marketplace/new"
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-nu-blue px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-nu-blue-dark"
          >
            <Plus className="h-4 w-4" />
            Post a listing
          </Link>
        </div>
      ) : (
        <ListingGrid>
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              id={listing.id}
              title={listing.title}
              price={listing.price_cents / 100}
              image={listing.image_url ?? undefined}
              condition={listing.condition}
              seller={listing.seller?.display_name ?? 'NearU member'}
            />
          ))}
        </ListingGrid>
      )}
    </div>
  );
}
