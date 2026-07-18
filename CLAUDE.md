# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Environment

- **Node:** v24.15.0
- **npm:** 11.14.0

The installed frontend stack is Next.js 16.2.x, React 18.3.x, Tailwind CSS 3.4.x, TypeScript 5.x, and ESLint 9.x. Do not assume older Next.js middleware conventions.

## Current Product Boundary

NearU is a discovery and coordination product. It does not operate a platform payment system.

Do not build or document any wallet, checkout, payout, escrow, platform fee, card processing, payment webhook, connected account, top-up, send-funds, or payment-required workflow. Vertical features should be built as listings, profiles, search/browse, reports/blocks, trust/reviews, and messaging/coordination.

The database still has legacy profile columns named `wallet_balance`, `stripe_account_id`, and `stripe_customer_id`. They are dormant compatibility artifacts only. Do not select, display, write, or build from them. They appear in generated database types because they exist in the live schema.

Marketplace listings currently have `price_cents`. Treat it as a displayed listing field only, not as a transaction or requirement that NearU collects, moves, verifies, or enforces.

## Common Commands

Run commands from `frontend/`:

```bash
npm run dev
npm run build
npm run lint
```

No test script is configured.

## Next.js Rules

- This project runs **Next.js 16**. Before changing Next.js behavior, check `node_modules/next/dist/docs/`.
- Request interception uses **Proxy**, not `middleware.ts`. The file is `src/proxy.ts`, and it delegates to `src/lib/supabase/middleware.ts`.
- Auth gating in Proxy is an optimistic cookie/JWT check. Real data authorization belongs in Supabase RLS and Server Actions.
- Config file is `next.config.mjs`.
- Fonts are loaded in `src/app/layout.tsx`: Plus Jakarta Sans for headings and DM Sans for body.

## Design System

**Theme:** light background with trust-blue accent.

### Fonts

| Variable | Font | Weights | Usage |
|---|---|---|---|
| `--font-jakarta` | Plus Jakarta Sans | 600, 700, 800 | Headings via `font-display` |
| `--font-dm-sans` | DM Sans | 400, 500, 600, 700 | Body via `font-sans` |

### Color Tokens

| Token | Hex | Role |
|---|---|---|
| `nu-bg` | `#F8FAFC` | Page background |
| `nu-surface` | `#FFFFFF` | Card / panel background |
| `nu-elevated` | `#F1F5F9` | Input fill, hover state |
| `nu-border` | `#E2E8F0` | Borders |
| `nu-blue` | `#2563EB` | Primary CTA, links, active states |
| `nu-blue-dark` | `#1D4ED8` | Blue hover state |
| `nu-blue-light` | `#EFF6FF` | Blue tint backgrounds |
| `nu-coral` | `#EF4444` | Danger, alerts |
| `nu-mint` | `#059669` | Success |
| `nu-text` | `#0F172A` | Primary text |
| `nu-muted` | `#475569` | Secondary text |
| `nu-dim` | `#94A3B8` | Placeholders, timestamps |

### Component Conventions

- Cards: `rounded-2xl border border-nu-border bg-nu-surface shadow-card`.
- Primary button: `bg-nu-blue text-white hover:bg-nu-blue-dark`.
- Focus rings: `focus:ring-2 focus:ring-nu-blue/20 focus:border-nu-blue/60`.
- Page headers: `font-display text-2xl font-bold text-nu-text`.
- Section labels: `text-xs font-semibold uppercase tracking-widest text-nu-muted`.

Do not use dark page backgrounds, indigo accents, amber/orange accents, or `text-nu-bg` as button text.

## Project Structure

- `frontend/` is the active Next.js app. There is no separate backend service.
- `backend/` is empty.
- `supabase/migrations/` is local schema history. The live Supabase project also reports earlier remote migrations from May 2026 plus the local July migrations.
- `structure.md` is the current file/directory map.
- `backend_structure.md` is the current Supabase/backend status and roadmap.

## Auth Flow

Current flow:

```text
/signup -> /onboarding -> /feed
/login  -> /feed
```

Email confirmation is disabled in the current Supabase Auth configuration, so signup returns a session immediately. `/verify-email` still exists and keeps OTP logic, but it is not the active signup path until email confirmation and SMTP are configured.

CAPTCHA state:

- `/login` renders Cloudflare Turnstile and passes `captchaToken` to `signInWithPassword`.
- `/signup` renders Cloudflare Turnstile and passes `captchaToken` to `signUp`.
- `/verify-email` does not yet render Turnstile or pass a CAPTCHA token to `verifyOtp()` / `resend()`.

Known auth bug: Proxy writes `/login?next=...` for protected deep links, but login currently redirects to `/feed` after success instead of consuming `next`.

## Data Flow

- Server Components fetch initial data through `src/lib/supabase/server.ts`.
- Client Components handle interactive forms and browser APIs.
- Server Actions handle mutations.
- Supabase RLS is the source of authorization.
- Supabase Realtime is live for messaging via Postgres Changes on `public.messages` (`src/hooks/useMessages.ts`). The durable message table is the source of truth; realtime is only a live push layer. Notification-badge realtime is still not built.

## Current Supabase State

Verified against the live Supabase project on 2026-07-17:

- Public tables with RLS enabled: `profiles`, `profiles_public`, `allowed_email_domains`, `user_blocks`, `user_reports`, `listings`, `conversations`, `messages`.
- Row counts: `profiles` 2, `profiles_public` 2, `listings` 0, `conversations` 0, `messages` 0, `allowed_email_domains` 0.
- Realtime: `supabase_realtime` publication includes `public.messages`.
- Storage buckets: one live bucket, `avatars`.
- Edge Functions: none.
- Installed PostGIS extension lives in `extensions`.
- Security Advisor: leaked password protection disabled (warning); the SECURITY DEFINER messaging RPCs are `authenticated`-executable by design.

Production-backed verticals today are Marketplace (`public.listings`) and Messaging (`public.conversations` / `public.messages`).

## Current Feature State

| Feature | Route | State |
|---|---|---|
| Landing | `/` | Real static page |
| Auth | `/login`, `/signup`, `/verify-email`, `/onboarding` | Real Supabase Auth/onboarding, with verify-email not active in default signup flow |
| Feed | `/feed` | Mock data |
| Marketplace | `/marketplace`, `/marketplace/new`, `/marketplace/[id]` | Real Supabase listings; listing image upload not built |
| Borrow/Lend | `/borrow` | Mock data and placeholder submit |
| Gigs | `/gigs` | Mock data and placeholder submit |
| SafeDrop | `/safedrop` | Mock data and placeholder submit |
| Group Ride | `/group-ride` | Mock data and placeholder submit |
| Hangout | `/hangout` | Mock data and placeholder submit |
| Messages | `/messages`, `/messages/[userId]` | Real Supabase 1:1 messaging: inbox, chat history, send, unread badges, Supabase Realtime |
| Notifications | `/notifications` | Mock data |
| Profile | `/profile`, `/profile/[userId]` | Real own/public profile reads; own profile edit; real own marketplace listings; reviews still mock |
| Support Ticket | `/support-ticket`, `/api/support-ticket` | Existing API route exception |

## Key Files

| Path | Purpose |
|---|---|
| `src/proxy.ts` | Next.js Proxy entry |
| `src/lib/supabase/middleware.ts` | Route gating and session refresh |
| `src/lib/supabase/client.ts` | Browser Supabase client |
| `src/lib/supabase/server.ts` | Server Supabase client |
| `src/lib/supabase/config.ts` | Supabase env config |
| `src/app/(app)/marketplace/actions.ts` | Marketplace read/create actions |
| `src/app/(app)/profile/actions.ts` | Profile update action |
| `src/app/(app)/profile/ProfileForm.tsx` | Own profile edit UI |
| `src/app/(app)/messages/actions.ts` | Messaging read/send actions and conversation RPCs |
| `src/components/messages/ChatRoom.tsx` | Realtime chat UI for one conversation |
| `src/components/messages/ConversationListClient.tsx` | Inbox list with live unread updates |
| `src/components/profile/AvatarUpload.tsx` | Uploads avatars to Supabase Storage |
| `src/hooks/useUser.ts` | Client hook for signed-in user's own profile row |
| `src/hooks/useMessages.ts` | Realtime chat state + optimistic send for one conversation |
| `src/hooks/useLocation.ts` | Stub |
| `src/types/database.ts` | Generated Supabase types |
| `src/types/index.ts` | App-level types |

## Environment Variables

`frontend/.env.local` currently uses:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
SUPPORT_TICKET_TO_EMAIL=
```

There is no service-role key in the Next.js app.

## Known Open Bugs

- Login ignores `?next=` deep-link redirects.
- `components/ui/Button` does not make `href` buttons truly disabled.
- `updateProfile()` does not call `revalidatePath()`, so profile edits can look stale after navigation.
- Avatar uploads can leave unreferenced objects if the user selects a file and leaves before saving.
- `@tailwindcss/postcss@^4` is installed even though the app uses Tailwind CSS v3.
- Email confirmation and custom SMTP are not enabled, so `.edu` ownership is not proven yet.
