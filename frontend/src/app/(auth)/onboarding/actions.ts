'use server';

import { createClient } from '@/lib/supabase/server';

export interface School {
  school_name: string;
  domain: string;
}

export interface SaveOnboardingPayload {
  display_name: string;
  bio: string;
  school_name: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  profile_photo_url: string | null;
  lat: number;
  lng: number;
}

export async function getSchools(): Promise<School[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('allowed_email_domains')
    .select('school_name, domain')
    .eq('active', true)
    .order('school_name');
  if (error || !data) return [];
  return data as School[];
}

export async function saveOnboarding(
  payload: SaveOnboardingPayload,
): Promise<{ error: string | null }> {
  const supabase = await createClient();

  const { error: rpcError } = await supabase.rpc('set_profile_onboarding', {
    p_display_name: payload.display_name,
    p_bio: payload.bio,
    p_school_name: payload.school_name,
    p_date_of_birth: payload.date_of_birth,
    p_gender: payload.gender,
    p_photo_url: payload.profile_photo_url ?? '',
    p_lat: payload.lat,
    p_lng: payload.lng,
  });

  if (rpcError) return { error: rpcError.message };

  // Write is_onboarded into JWT metadata so middleware can gate without a DB query.
  const { error: metaError } = await supabase.auth.updateUser({
    data: { is_onboarded: true },
  });

  if (metaError) return { error: metaError.message };

  // Re-mint the access token so the middleware sees is_onboarded in the JWT.
  // updateUser persists the metadata but does not refresh the current token.
  const { error: refreshError } = await supabase.auth.refreshSession();

  if (refreshError) return { error: refreshError.message };

  return { error: null };
}
