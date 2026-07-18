# NearU Backend Implementation Walkthrough

This is the backend learning and implementation roadmap for NearU as a discovery and coordination app.

NearU has no platform payment system. Do not add a wallet, checkout, payout flow, payment webhook, connected account flow, escrow, platform fee, or any feature that requires users to pay through NearU.

## Current Baseline

Verified on 2026-07-14:

- Supabase public tables: `profiles`, `profiles_public`, `allowed_email_domains`, `user_blocks`, `user_reports`, `listings`.
- Storage: `avatars` bucket.
- Edge Functions: none.
- Security Advisor: leaked-password-protection warning only.
- Real app areas: auth, onboarding, profiles, avatars, marketplace listings.
- Mock/stub areas: feed, gigs, borrow/lend, SafeDrop, group rides, hangouts, messages, notifications, reviews.

## Phase 1 - Supabase Basics

Learn:

- Supabase project structure.
- Postgres tables, RLS, policies, and migrations.
- Browser vs server Supabase clients.
- Generated TypeScript database types.
- Why service-role credentials must never be exposed to the browser.

Current files:

- `frontend/src/lib/supabase/client.ts`
- `frontend/src/lib/supabase/server.ts`
- `frontend/src/lib/supabase/config.ts`
- `frontend/src/types/database.ts`

## Phase 2 - Auth and Onboarding

Learn:

- Supabase Auth sessions and cookies.
- Next.js 16 Proxy.
- JWT user metadata and onboarding gates.
- Cloudflare Turnstile integration.
- Email confirmation and SMTP requirements.

Current state:

- `/signup` creates a session and routes to `/onboarding`.
- `/login` signs in and routes to `/feed`.
- `/verify-email` exists but is not the active signup path while email confirmation is disabled.
- `/onboarding` persists profile data through `set_profile_onboarding()`.
- `src/proxy.ts` protects app routes and onboarding state.

Open work:

- Enable real email confirmation before launch.
- Configure custom SMTP.
- Add Turnstile to `/verify-email`.
- Make login consume the `next` deep-link parameter.

## Phase 3 - Profiles and Trust

Learn:

- Private own-user profile reads.
- Public profile projection tables.
- Exact vs approximate location.
- Reports and blocks.
- Review aggregation.

Current state:

- `profiles` stores private profile data.
- `profiles_public` exposes safe public profile fields.
- `user_blocks` and `user_reports` exist.
- Avatar upload writes to the `avatars` Storage bucket.
- Reviews UI is still mock.

Open work:

- Build real reviews.
- Build report/block UI flows.
- Decide whether to add extra constraints for self-blocks and duplicate reports.
- Add cleanup for abandoned avatar uploads.

## Phase 4 - Marketplace

Learn:

- Server Component reads.
- Server Action validation and inserts.
- RLS owner checks.
- Public profile joins without exposing private columns.
- Storage for listing images.

Current state:

- `public.listings` exists with RLS.
- Browse, detail, create, and "My Listings" are backed by Supabase.
- Listing photos render when `image_url` exists.
- Listing image upload is not built.
- Edit/delete UI is not built.

Open work:

- Add listing image bucket and upload flow.
- Add edit/delete UI.
- Add browser E2E verification for create -> browse -> detail.

## Phase 5 - Messaging

Messaging is the highest-priority backend area because every vertical needs a coordination endpoint.

Learn:

- Conversation/thread schema design.
- Sender/receiver RLS.
- Realtime subscriptions for message inserts.
- Initial server-rendered history plus client realtime updates.
- Read receipts or read timestamps.

Build:

- Conversations table.
- Messages table.
- Send-message Server Action.
- Thread reads.
- Realtime thread updates.
- Inbox list.
- Replace mock `/messages` pages and `useRealtime` stub.

## Phase 6 - Feed and Notifications

Learn:

- Activity feed schema or query composition.
- Notification table design.
- Badge counts and read state.
- Realtime inserts for notifications.

Build:

- Feed backed by real rows from enabled verticals.
- Notifications table.
- Server Actions for marking notifications read.
- Realtime badge updates.

## Phase 7 - Remaining Verticals

Each vertical should be implemented as coordination/listing data plus messaging, not as a payment workflow.

Suggested order:

1. Borrow/lend.
2. Gigs.
3. SafeDrop.
4. Group rides.
5. Hangouts.

For each:

- Create table(s) with owner/participant RLS.
- Add Server Component reads.
- Add Server Action writes.
- Replace mock arrays and `alert()` placeholders.
- Route contact/coordination through messages.
- Add notifications where useful.

## Phase 8 - Launch Hardening

Before real users:

- Seed `allowed_email_domains`.
- Enable email confirmation with custom SMTP.
- Enable leaked password protection in Supabase Auth.
- Re-run Supabase Security Advisor and Performance Advisor.
- Run `npm run lint` and `npm run build`.
- Browser-test signup, onboarding, profile edit, avatar upload, marketplace create/detail, and protected-route redirects.
- Review public docs for stale implementation claims.

## Done-State Summary

NearU is ready for a limited pilot when:

- Auth proves ownership of school email domains.
- Profiles and trust basics work.
- Marketplace and at least one other vertical use real Supabase data.
- Messaging is real and reliable.
- Reports/blocks are usable.
- No UI or backend route suggests NearU operates platform payments.
