import { createClient } from '@/lib/supabase/server';
import SignupForm from './SignupForm';
import type { School } from '@/app/(auth)/onboarding/actions';

async function getSchools(): Promise<School[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('allowed_email_domains')
    .select('school_name, domain')
    .eq('active', true)
    .order('school_name');
  if (error || !data) return [];
  return data as School[];
}

export default async function SignupPage() {
  const schools = await getSchools();
  return <SignupForm schools={schools} />;
}
