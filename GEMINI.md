# NearU Project Overview

NearU is a hyperlocal campus/community app for verified neighbors to discover listings, request help, coordinate handoffs, and message each other.

NearU is **not** a payment product. Do not add or recommend a wallet, checkout, payout flow, card processing, connected accounts, payment webhooks, or payment-required actions. Current and future verticals should be built as discovery, listings, trust, reports/blocks, and messaging/coordination.

## Technology Stack

- Frontend: Next.js 16 App Router, React 18, TypeScript, Tailwind CSS v3.
- Backend: Supabase Postgres, Auth, Storage, RLS, and Next.js Server Actions.
- Realtime: planned with Supabase Realtime, not wired yet.
- Deployment target: Vercel.

## Project Structure

- `frontend/`: active app.
- `backend/`: empty.
- `supabase/`: local config and migrations.

Inside `frontend/src/`:

- `app/`: App Router routes.
- `app/(auth)/`: login, signup, verify-email, onboarding.
- `app/(app)/`: authenticated app routes.
- `app/api/support-ticket/route.ts`: existing support-ticket API route exception.
- `components/`: reusable UI and feature components.
- `hooks/`: client hooks.
- `lib/supabase/`: Supabase clients and middleware helper.
- `types/`: generated and app-level TypeScript types.

## Current Feature State

| Feature | Route | State |
|---|---|---|
| Auth/onboarding | `/login`, `/signup`, `/verify-email`, `/onboarding` | Real Supabase auth; email verification not active in default signup flow |
| Feed | `/feed` | Mock |
| Marketplace | `/marketplace` | Real listings table for browse/detail/create/my listings |
| Borrow/Lend | `/borrow` | Mock |
| Gigs | `/gigs` | Mock |
| SafeDrop | `/safedrop` | Mock |
| Group Ride | `/group-ride` | Mock |
| Hangout | `/hangout` | Mock |
| Messages | `/messages` | Mock; planned next backend area |
| Notifications | `/notifications` | Mock |
| Profile | `/profile`, `/profile/[userId]` | Real own/public profile reads; reviews mock |

## Supabase State

Verified on 2026-07-14:

- Tables with RLS: `profiles`, `profiles_public`, `allowed_email_domains`, `user_blocks`, `user_reports`, `listings`.
- Storage: `avatars` bucket only.
- Edge Functions: none.
- Security Advisor: leaked-password-protection warning only.

## Development Commands

Run from `frontend/`:

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Important Rules

- Use Server Actions for mutations unless maintaining the existing support-ticket API route.
- Use Supabase RLS as the real authorization layer.
- Check local Next.js 16 docs in `node_modules/next/dist/docs/` before changing framework behavior.
- Do not use dormant legacy profile columns related to old payment ideas.
