import Link from 'next/link';
import { Info } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import { createClient } from '@/lib/supabase/server';
import { formatCurrency } from '@/lib/utils';
import { getListing } from '../actions';

const CATEGORY_LABELS: Record<string, string> = {
  textbooks: 'Textbooks',
  electronics: 'Electronics',
  furniture: 'Furniture',
  clothing: 'Clothing',
  sports: 'Sports & Outdoors',
  other: 'Other',
};

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListing(id);

  if (!listing) {
    return (
      <div>
        <PageHeader title="Item Details" backHref="/marketplace" />
        <div className="rounded-2xl border border-nu-border bg-nu-surface p-10 text-center shadow-card">
          <p className="font-display text-lg font-bold text-nu-text">Listing not found</p>
          <p className="mt-1 text-sm text-nu-muted">
            This item may have been sold or taken down.
          </p>
          <Link
            href="/marketplace"
            className="mt-4 inline-block rounded-xl bg-nu-blue px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-nu-blue-dark"
          >
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isOwnListing = user?.id === listing.seller_id;
  const sellerName = listing.seller?.display_name ?? 'NearU member';

  return (
    <div>
      <PageHeader title="Item Details" backHref="/marketplace" />

      <div className="mb-6 flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl bg-nu-elevated">
        {listing.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={listing.image_url} alt={listing.title} className="h-full w-full object-cover" />
        ) : (
          <span className="text-6xl">📦</span>
        )}
      </div>

      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-nu-text">{listing.title}</h2>
            <div className="mt-2 flex items-center gap-2">
              <Badge label={CATEGORY_LABELS[listing.category] ?? listing.category} variant="info" />
              <Badge label={listing.condition.replace('_', ' ')} variant="default" />
              {listing.status !== 'active' && (
                <Badge label={listing.status} variant="default" />
              )}
            </div>
          </div>
          <span className="font-display text-3xl font-bold text-nu-blue">
            {formatCurrency(listing.price_cents / 100)}
          </span>
        </div>

        <div className="rounded-2xl border border-nu-border bg-nu-surface p-4">
          <h3 className="mb-2 text-sm font-semibold text-nu-muted">Description</h3>
          <p className="whitespace-pre-line text-sm leading-relaxed text-nu-muted">
            {listing.description}
          </p>
        </div>

        <div className="rounded-2xl border border-nu-border bg-nu-surface p-4">
          <h3 className="mb-3 text-sm font-semibold text-nu-muted">Seller</h3>
          <Link href={`/profile/${listing.seller_id}`} className="flex items-center gap-3">
            <Avatar src={listing.seller?.profile_photo_url} name={sellerName} size="md" />
            <div>
              <p className="font-medium text-nu-text">{sellerName}</p>
              <p className="text-xs text-nu-muted">
                ⭐ {listing.seller?.trust_score ?? 0} · {listing.seller?.number_of_reviews ?? 0} reviews
              </p>
            </div>
          </Link>
        </div>

        {!isOwnListing && (
          <div className="space-y-3">
            {/* NearU is coordination-only: it never touches the money. Buyer and
                seller settle between themselves, off-platform. */}
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              href={`/messages/${listing.seller_id}`}
              disabled={listing.status !== 'active'}
            >
              {listing.status === 'active' ? 'Message Seller' : 'No longer available'}
            </Button>
            <p className="flex items-start gap-2 rounded-xl border border-nu-border bg-nu-elevated px-4 py-3 text-xs text-nu-muted">
              <Info className="mt-px h-4 w-4 shrink-0 text-nu-dim" aria-hidden="true" />
              <span>
                NearU is for discovery and coordination only. Confirm details
                directly with the seller, and meet somewhere public on campus.
              </span>
            </p>
          </div>
        )}

        {isOwnListing && (
          <p className="rounded-xl bg-nu-blue-light px-4 py-2.5 text-center text-sm text-nu-muted">
            This is your listing.
          </p>
        )}
      </div>
    </div>
  );
}
