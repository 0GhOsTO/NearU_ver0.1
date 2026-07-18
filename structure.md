# NearU Frontend Structure

Current as of 2026-07-17.

NearU has no platform payment routes or components. Build product areas as listings, profiles, trust, reports/blocks, search/browse, and messaging/coordination.

## Directory Layout

```text
frontend/src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── favicon.ico
│   ├── proxy.ts is at src/proxy.ts, not under app/
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── signup/SignupForm.tsx
│   │   ├── verify-email/page.tsx
│   │   └── onboarding/
│   │       ├── page.tsx
│   │       └── actions.ts
│   ├── (app)/
│   │   ├── layout.tsx
│   │   ├── feed/page.tsx
│   │   ├── marketplace/
│   │   │   ├── page.tsx
│   │   │   ├── actions.ts
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── borrow/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── gigs/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── safedrop/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── group-ride/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── hangout/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── messages/
│   │   │   ├── page.tsx
│   │   │   ├── actions.ts
│   │   │   └── [userId]/page.tsx
│   │   ├── notifications/page.tsx
│   │   └── profile/
│   │       ├── page.tsx
│   │       ├── ProfileForm.tsx
│   │       ├── actions.ts
│   │       └── [userId]/page.tsx
│   ├── support-ticket/page.tsx
│   └── api/support-ticket/route.ts
├── components/
│   ├── Providers.tsx
│   ├── feed/
│   ├── gigs/
│   ├── group/
│   ├── layout/
│   ├── marketplace/
│   ├── messages/
│   ├── profile/
│   ├── safedrop/
│   └── ui/
├── hooks/
│   ├── useInfiniteScroll.ts
│   ├── useLocation.ts
│   ├── useMessages.ts
│   └── useUser.ts
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── config.ts
│   │   ├── middleware.ts
│   │   └── server.ts
│   └── utils.ts
├── proxy.ts
└── types/
    ├── database.ts
    └── index.ts
```

## Route State

| Area | Route | State |
|---|---|---|
| Landing | `/` | Real static page |
| Login | `/login` | Real Supabase login with Turnstile |
| Signup | `/signup` | Real Supabase signup with Turnstile and allowed-domain fetch |
| Verify email | `/verify-email` | OTP page exists; not active in default signup flow while email confirmation is disabled |
| Onboarding | `/onboarding` | Real profile persistence through Supabase RPC |
| Feed | `/feed` | Mock data |
| Marketplace | `/marketplace` | Real Supabase listings |
| Marketplace create | `/marketplace/new` | Real create action; listing image upload not built |
| Marketplace detail | `/marketplace/[id]` | Real listing detail |
| Borrow/Lend | `/borrow` | Mock data and placeholder submit |
| Gigs | `/gigs` | Mock data and placeholder submit |
| SafeDrop | `/safedrop` | Mock data and placeholder submit |
| Group Ride | `/group-ride` | Mock data and placeholder submit |
| Hangout | `/hangout` | Mock data and placeholder submit |
| Messages | `/messages`, `/messages/[userId]` | Real Supabase 1:1 messaging with Realtime; inbox, chat history, send, unread badges |
| Notifications | `/notifications` | Mock data |
| Own Profile | `/profile` | Real profile read/edit and real own marketplace listings |
| Public Profile | `/profile/[userId]` | Real public profile read; reviews mock |
| Support Ticket | `/support-ticket` | Form posts to existing API route |

## Auth Flow

```text
/signup -> /onboarding -> /feed
/login  -> /feed
```

`src/proxy.ts` protects authenticated routes and redirects users who have not completed onboarding. It writes a `next` query parameter for protected deep links, but login does not consume it yet.

## Data Flow

- Server Components fetch initial Supabase data.
- Server Actions mutate Supabase data.
- Client Components handle forms, uploads, maps, and interactive state.
- Supabase RLS is required for authorization.
- Realtime messaging is live via Supabase Realtime Postgres Changes on `public.messages`; the durable message history is read from the table, so nothing is lost if a live event is missed.

## Current Supabase-Backed Areas

- Auth.
- Onboarding.
- Profiles and public profiles.
- Allowed email domains.
- Avatars Storage bucket.
- Marketplace listings.
- Messaging (1:1 conversations, messages, realtime).

## Stubbed or Mock Areas

- Feed backend.
- Borrow/lend backend.
- Gigs backend.
- SafeDrop backend.
- Group ride backend.
- Hangout backend.
- Notifications backend.
- Reviews backend.
- Listing image Storage bucket/upload.
