'use client';

import { useState } from 'react';
import AvatarUpload from '@/components/profile/AvatarUpload';
import RatingStars from '@/components/profile/RatingStars';
import ReviewCard from '@/components/profile/ReviewCard';
import ListingCard from '@/components/marketplace/ListingCard';
import ListingGrid from '@/components/marketplace/ListingGrid';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { supabase } from '@/lib/supabase/client';
import { updateProfile } from './actions';
import type { ListingWithSeller, Profile } from '@/types';
import { LogOut } from 'lucide-react';

// TODO: wire up Supabase — replace with real reviews once reviews land (step 12).
const myReviews = [
  { reviewer: 'Jamie Park', rating: 5, comment: 'Alex was super quick with the grocery run! Highly recommend.', date: 'Apr 28, 2026' },
  { reviewer: 'Lena Zhou',  rating: 5, comment: 'Great help with moving. Strong and reliable!',                 date: 'Apr 27, 2026' },
  { reviewer: 'Nadia B.',   rating: 4, comment: 'Solid job on the IKEA run. Showed up on time.',               date: 'Apr 20, 2026' },
];

export default function ProfileForm({
  profile,
  listings,
}: {
  profile: Profile;
  listings: ListingWithSeller[];
}) {
  const [name, setName] = useState(profile.display_name ?? '');
  const [bio, setBio] = useState(profile.bio ?? '');
  const [photoUrl, setPhotoUrl] = useState(profile.profile_photo_url);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saved, setSaved] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    setSaved(false);

    try {
      const { error } = await updateProfile({ display_name: name, bio, profile_photo_url: photoUrl });
      if (error) {
        setSaveError(error);
        return;
      }
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    setLogoutError('');

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        setLogoutError(error.message);
        return;
      }

      window.location.href = '/login';
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Avatar + basic info */}
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-nu-border bg-nu-surface p-6">
        <AvatarUpload
          src={photoUrl}
          name={name || 'You'}
          onUploaded={(url) => {
            setPhotoUrl(url);
            setSaved(false);
          }}
        />
        <div className="w-full space-y-3">
          <Input
            label="Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setSaved(false);
            }}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-nu-muted">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => {
                setBio(e.target.value);
                setSaved(false);
              }}
              placeholder="Tell your neighbors a bit about yourself..."
              rows={2}
              className="w-full rounded-xl border border-nu-border bg-nu-elevated px-4 py-2.5 text-sm text-nu-text placeholder-nu-dim focus:border-nu-blue/60 focus:outline-none focus:ring-2 focus:ring-nu-blue/20 resize-none transition-all"
            />
          </div>
          <Button variant="secondary" size="md" onClick={handleSave} loading={saving} className="w-full">
            Save Changes
          </Button>
          {saved && (
            <p className="rounded-xl bg-green-50 px-4 py-2 text-sm text-green-700">
              Profile saved.
            </p>
          )}
          {saveError && (
            <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">
              {saveError}
            </p>
          )}
          {logoutError && (
            <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">
              {logoutError}
            </p>
          )}
          <Button
            variant="danger"
            size="md"
            onClick={handleLogout}
            loading={loggingOut}
            className="w-full gap-2"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Log out
          </Button>
        </div>
      </div>

      {/* Rating */}
      <div className="rounded-2xl border border-nu-border bg-nu-surface p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-nu-text">Community Rating</p>
            <p className="text-xs text-nu-dim mt-0.5">
              Based on {profile.number_of_reviews ?? 0} reviews
            </p>
          </div>
          <RatingStars rating={profile.trust_score ?? 0} showNumber />
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-nu-muted mb-3">My Listings</h3>
        {listings.length === 0 ? (
          <p className="rounded-2xl border border-nu-border bg-nu-surface p-6 text-center text-sm text-nu-muted">
            You haven&apos;t listed anything yet.
          </p>
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
                seller={name || 'You'}
              />
            ))}
          </ListingGrid>
        )}
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-nu-muted mb-3">Reviews</h3>
        <div className="space-y-3">
          {myReviews.map((r, i) => (
            <ReviewCard key={i} {...r} />
          ))}
        </div>
      </div>
    </div>
  );
}
