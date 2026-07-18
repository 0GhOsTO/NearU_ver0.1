'use client';

// Wrap with providers here (e.g. React Query, auth context, etc.)
// TODO: wire up Supabase provider

export default function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
