# NearU Backend Structure

Current as of 2026-07-17, verified against the live Supabase project.

NearU's backend is Supabase plus Next.js Server Actions. There is no separate backend service and no platform payment system.

## Product Boundary

NearU handles discovery and coordination only. Backend work must not add a wallet, checkout, payout flow, card processor, payment webhook, connected account flow, escrow, platform fee, or any feature that requires users to pay through NearU.

The live `profiles` table still contains dormant legacy columns related to an old payment idea. They are not part of the product and must not be selected, displayed, or written by app code.

## Live Supabase State

Verified with Supabase MCP on 2026-07-17:

| Area | State |
|---|---|
| Public tables | `profiles`, `profiles_public`, `allowed_email_domains`, `user_blocks`, `user_reports`, `listings`, `conversations`, `messages` |
| RLS | Enabled on all public app tables |
| Realtime | `supabase_realtime` publication includes `public.messages` |
| Storage | One bucket: `avatars` |
| Edge Functions | None |
| Extensions | PostGIS installed in `extensions` |
| Security Advisor | Leaked password protection disabled (warning); SECURITY DEFINER messaging RPCs are executable by `authenticated` by design |
| Row counts | `profiles`: 2, `profiles_public`: 2, `listings`: 0, `conversations`: 0, `messages`: 0, `allowed_email_domains`: 0 |

## Existing Tables

### `profiles`

Private own-user profile table keyed to `auth.users(id)`.

Important columns:

- `id`
- `display_name`
- `bio`
- `school_name`
- `profile_photo_url`
- `trust_score`
- `number_of_reviews`
- `completed_deals_count`
- `is_onboarded`
- `date_of_birth`
- `gender`
- `general_coordinate`
- moderation/status columns

Dormant legacy columns exist in the live schema but are not product fields:

- `wallet_balance`
- `stripe_account_id`
- `stripe_customer_id`

### `profiles_public`

Public projection table for safe profile reads by authenticated users.

Columns:

- `id`
- `display_name`
- `profile_photo_url`
- `trust_score`
- `number_of_reviews`
- `completed_deals_count`
- `bio`
- `school_name`
- `approximate_location`

It excludes exact location, DOB, gender, moderation internals, and dormant legacy payment columns.

### `allowed_email_domains`

Signup/onboarding reference table.

Columns:

- `id`
- `domain`
- `school_name`
- `active`
- `created_at`

Live row count is currently 0, so real school onboarding requires data seeding.

### `user_blocks`

Block relationship table.

Columns:

- `user_id`
- `blocked_user_id`
- `created_at`

### `user_reports`

Report relationship table.

Columns:

- `id`
- `reporter_id`
- `reported_user_id`
- `reason`
- `created_at`

### `listings`

Marketplace listings table.

Columns:

- `id`
- `seller_id`
- `title`
- `description`
- `price_cents`
- `category`
- `condition`
- `image_url`
- `status`
- `created_at`
- `updated_at`

`price_cents` is a displayed listing field only. It is not tied to a NearU transaction or collection flow.

Enums:

- `listing_category`: `textbooks`, `electronics`, `furniture`, `clothing`, `sports`, `other`
- `listing_condition`: `new`, `like_new`, `good`, `fair`
- `listing_status`: `active`, `sold`, `removed`

### `conversations`

One row per 1:1 direct-message pair. The pair is kept canonical by storing the
smaller uuid in `user_a` and the larger in `user_b` (`check (user_a < user_b)` plus
`unique (user_a, user_b)`), so `/messages/[userId]` resolves to exactly one row.

Columns:

- `id`
- `user_a`, `user_b` — participants, FK to `profiles(id)`
- `last_message_at` — denormalized latest-activity time, maintained by trigger; drives inbox ordering
- `user_a_last_read_at`, `user_b_last_read_at` — per-participant read cursors; unread = messages after my cursor sent by the other
- `created_at`

Writes go only through SECURITY DEFINER RPCs; RLS exposes SELECT to participants.

### `messages`

Immutable chat history and the durable source of truth. Supabase Realtime only
pushes live INSERTs on top of it.

Columns:

- `id`
- `conversation_id` — FK to `conversations(id)` on delete cascade
- `sender_id` — FK to `profiles(id)`
- `body` — 1–4000 chars
- `created_at`

RLS: participants can SELECT; a participant can INSERT only with their own
`sender_id`. No UPDATE/DELETE policies (history is immutable). Indexed on
`(conversation_id, created_at desc)` for pagination.

### Messaging functions

- `start_conversation(p_other uuid) returns uuid` — SECURITY DEFINER. Resolves the counterpart to a conversation, creating it once; rejects self-conversations and either-direction `user_blocks`. Idempotent on the pair.
- `mark_conversation_read(p_conversation uuid)` — SECURITY DEFINER. Advances only the caller's own read cursor.
- `list_my_conversations()` — SECURITY DEFINER. Newest-first inbox rows: `conversation_id`, `other_user_id`, `last_message_body`, `last_message_at`, `unread_count`. The server action stitches `profiles_public` for name/avatar.
- `is_conversation_participant(p_conversation uuid) returns boolean` — SECURITY DEFINER helper used by the `messages` RLS policies to avoid recursive RLS.
- `messages_bump_conversation()` — trigger function that keeps `conversations.last_message_at` current.

## Storage

### `avatars`

- Public-read bucket.
- 2 MiB file limit.
- Allowed MIME types: JPEG, PNG, WebP.
- Writes are scoped by RLS to the owner's own UID folder.

Listing images do not have a bucket or upload flow yet.

## Server Actions and Data Access

Current real actions:

- `app/(auth)/onboarding/actions.ts`
  - `saveOnboarding()`
  - `getSchools()`
- `app/(app)/marketplace/actions.ts`
  - `getListings()`
  - `getListing()`
  - `getMyListings()`
  - `createListing()`
- `app/(app)/profile/actions.ts`
  - `updateProfile()`
- `app/(app)/messages/actions.ts`
  - `getConversations()`
  - `getOrCreateConversation()`
  - `getMessages()`
  - `sendMessage()`
  - `markRead()`

Existing API route exception:

- `app/api/support-ticket/route.ts`

## Backend Roadmap

Highest-value next backend work:

1. ~~Messaging tables and realtime chat.~~ Done 2026-07-17 — `conversations`/`messages` with RLS, RPCs, and Realtime Postgres Changes on `public.messages`.
2. Listing image Storage bucket and upload flow.
3. Replace mock feed with real activity data.
4. Add backend tables for borrow/lend, gigs, SafeDrop, group rides, and hangouts as coordination listings.
5. Add reviews and notifications.
6. Seed `allowed_email_domains` and enable real email confirmation with custom SMTP before launch.

Every new vertical should follow the same pattern:

- Supabase table with RLS.
- Server Component reads.
- Server Action mutations.
- Public profile reads through `profiles_public`.
- Messaging as the coordination endpoint.
