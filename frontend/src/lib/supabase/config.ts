const getSupabaseConfig = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return { supabasePublishableKey, supabaseUrl };
};

export const { supabasePublishableKey, supabaseUrl } = getSupabaseConfig();
