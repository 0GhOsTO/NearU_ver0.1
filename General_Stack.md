Frontend: Next.js 16 App Router + TypeScript + Tailwind CSS v3
Backend: Supabase (Postgres, Auth, Storage, RLS) accessed from Next.js Server Components and Server Actions
Database: Supabase PostgreSQL with PostGIS in the extensions schema
Authentication: Supabase Auth with Cloudflare Turnstile on login and signup
File Storage: Supabase Storage; the live bucket is avatars
Realtime: Supabase Realtime is planned for messaging, but not wired yet
Deployment: Vercel

Product boundary: NearU is discovery and coordination only. There is no platform payment system, wallet, checkout, payout flow, or payment-required feature.
