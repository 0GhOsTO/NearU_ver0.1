'use server';

import { createClient } from '@/lib/supabase/server';

export interface UpdateProfilePayload {
  display_name: string;
  bio: string;
  profile_photo_url: string | null;
}

export async function updateProfile(
  payload: UpdateProfilePayload,
): Promise<{ error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return { error: 'Not authenticated.' };

  // RLS "Own row update" enforces ownership; the eq() is defense-in-depth.
  const { error } = await supabase
    .from('profiles')
    .update({
      display_name: payload.display_name,
      bio: payload.bio,
      profile_photo_url: payload.profile_photo_url,
    })
    .eq('id', user.id);

  if (error) return { error: error.message };

  return { error: null };
}
