'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Profile } from '@/types';

// Explicit column list keeps sensitive and legacy private columns out of the
// client payload. RLS already scopes to the owner's row; this is defense-in-depth.
const PROFILE_COLUMNS =
  'id, display_name, first_name, last_name, full_name, bio, school_name, profile_photo_url, trust_score, number_of_reviews, completed_deals_count, is_onboarded, account_status, role, created_at, updated_at';

export function useUser(): { profile: Profile | null; loading: boolean } {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth.user;

      if (!user) {
        if (active) {
          setProfile(null);
          setLoading(false);
        }
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select(PROFILE_COLUMNS)
        .eq('id', user.id)
        .single();

      if (active) {
        setProfile((data as Profile | null) ?? null);
        setLoading(false);
      }
    }

    load();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      setLoading(true);
      load();
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { profile, loading };
}
