import PageHeader from '@/components/layout/PageHeader';
import Avatar from '@/components/ui/Avatar';
import RatingStars from '@/components/profile/RatingStars';
import ReviewCard from '@/components/profile/ReviewCard';
import ListingCard from '@/components/marketplace/ListingCard';
import ListingGrid from '@/components/marketplace/ListingGrid';
import Button from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/server';
import { GraduationCap } from 'lucide-react';
import type { ProfilePublic } from '@/types';

// TODO: wire up Supabase — replace with the user's real listings (step 9/12).
const userListings = [
  { id: '10', title: 'Standing Desk',        price: 85, condition: 'good',     seller: 'Neighbor' },
  { id: '11', title: 'Air Fryer (like new)', price: 40, condition: 'like_new', seller: 'Neighbor' },
];

// TODO: wire up Supabase — replace with real reviews once reviews land (step 12).
const userReviews = [
  { reviewer: 'Alex Kim',    rating: 5, comment: 'Super responsive and easy to work with!',        date: 'Apr 25, 2026' },
  { reviewer: 'Sofia Reyes', rating: 5, comment: 'Organized the best boba run. Will join again.', date: 'Apr 15, 2026' },
];

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const supabase = await createClient();

  // profiles_public deliberately excludes every sensitive column, so reading it
  // for another user cannot leak private data (DOB, gender, exact location).
  const { data } = await supabase
    .from('profiles_public')
    .select('*')
    .eq('id', userId)
    .single();

  const profile = data as ProfilePublic | null;

  if (!profile) {
    return (
      <div>
        <PageHeader title="Profile" backHref="/messages" />
        <p className="rounded-2xl border border-nu-border bg-nu-surface p-6 text-center text-sm text-nu-muted">
          This profile could not be found.
        </p>
      </div>
    );
  }

  const displayName = profile.display_name ?? 'Neighbor';

  return (
    <div>
      <PageHeader title="Profile" backHref="/messages" />

      <div className="space-y-5">
        <div className="rounded-2xl border border-nu-border bg-nu-surface p-6 text-center">
          <div className="flex justify-center">
            <Avatar src={profile.profile_photo_url} name={displayName} size="lg" />
          </div>
          <h2 className="mt-3 font-display text-xl font-bold text-nu-text">{displayName}</h2>
          {profile.school_name && (
            <div className="mt-1 flex items-center justify-center gap-1.5 text-sm text-nu-muted">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>{profile.school_name}</span>
            </div>
          )}
          <div className="mt-2 flex items-center justify-center gap-2">
            <RatingStars rating={profile.trust_score ?? 0} showNumber />
            <span className="text-xs text-nu-dim">({profile.number_of_reviews ?? 0} reviews)</span>
          </div>
          {profile.bio && (
            <p className="mt-3 text-sm text-nu-muted max-w-xs mx-auto leading-relaxed">{profile.bio}</p>
          )}
          <Button variant="secondary" size="md" className="mt-4" href={`/messages/${userId}`}>
            Send Message
          </Button>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-nu-muted mb-3">Active Listings</h3>
          <ListingGrid>
            {userListings.map((l) => (
              <ListingCard key={l.id} {...l} />
            ))}
          </ListingGrid>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-nu-muted mb-3">Reviews</h3>
          <div className="space-y-3">
            {userReviews.map((r, i) => (
              <ReviewCard key={i} {...r} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
