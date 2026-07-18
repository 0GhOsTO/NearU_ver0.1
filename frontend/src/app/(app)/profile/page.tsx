import PageHeader from '@/components/layout/PageHeader';
import ProfileForm from './ProfileForm';
import { createClient } from '@/lib/supabase/server';
import { getMyListings } from '../marketplace/actions';
import type { Profile } from '@/types';

// Legacy private columns are deliberately absent from the client payload.
const PROFILE_COLUMNS =
  'id, display_name, first_name, last_name, full_name, bio, school_name, profile_photo_url, trust_score, number_of_reviews, completed_deals_count, is_onboarded, account_status, role, created_at, updated_at';

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = user
    ? await supabase.from('profiles').select(PROFILE_COLUMNS).eq('id', user.id).single()
    : { data: null };

  const profile = data as Profile | null;

  if (!profile) {
    return (
      <div>
        <PageHeader title="My Profile" />
        <p className="rounded-2xl border border-nu-border bg-nu-surface p-6 text-sm text-nu-muted">
          We couldn&apos;t load your profile. Try refreshing the page.
        </p>
      </div>
    );
  }

  const myListings = await getMyListings();

  return (
    <div>
      <PageHeader title="My Profile" />
      <ProfileForm profile={profile} listings={myListings} />
    </div>
  );
}
