# NearU Frontend

NearU is a Next.js 16 App Router app for verified campus/community discovery and coordination. The app currently uses Supabase for Auth, Postgres, RLS, and Storage.

NearU does not provide a platform payment system. Product surfaces must not add a wallet, checkout, payout flow, or any payment-required action.

## Commands

Run these from `frontend/`:

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Current Implementation

- Auth: signup, login, verify-email route, onboarding, logout.
- CAPTCHA: Cloudflare Turnstile on login and signup.
- Routing: `src/proxy.ts` gates authenticated routes and onboarding state.
- Profiles: own profile read/edit, public profile reads, avatar upload.
- Marketplace: real `public.listings` table for browse, detail, create, and own listings.
- Supabase Storage: `avatars` bucket only.

## Still Mock or Stubbed

- Feed.
- Gigs.
- Borrow/lend.
- SafeDrop.
- Group ride.
- Hangout.
- Messages and realtime chat.
- Notifications.
- Reviews.
- Listing image upload.

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
SUPPORT_TICKET_TO_EMAIL=
```

There is no service-role key in the Next.js app.
