# NearU 📍

> [!NOTE]
> **This is a public, read-only copy of the NearU repository for portfolio and showcase purposes.** Active development continues in a separate private repository. This copy may not reflect the latest changes.
> **Currently, the entire repo is under review line by line for deployment. Therefore, any additional changes will be made only after the review is complete. Converting .jsx to .tsx for scale**

NearU is a hyperlocal campus and community application designed for verified neighbors (e.g., students and university community members) to discover nearby listings, request and offer micro-help, coordinate package handoffs, share rides, and message each other in real-time. 

NearU centers around **trust and proximity**, converting classmates, dorm-mates, and nearby community members into a reliable local network.

> [!IMPORTANT]
> **Strict Product Boundary: NearU handles NO platform payments.**
> NearU is purely a discovery, coordination, and trust platform. There is no wallet, no checkout, no escrow, no card processing, and no payout flow. Users coordinate physical or external handoffs directly; the app contains no payment-required workflows.

---

## 🛠️ Technology Stack

- **Frontend:** Next.js 16.2 (App Router), React 18.3, TypeScript 5.x, Tailwind CSS 3.4.x
- **Backend & Database:** Supabase PostgreSQL with PostGIS extension (in the `extensions` schema), Row Level Security (RLS)
- **Authentication:** Supabase Auth with Cloudflare Turnstile CAPTCHA protection
- **Real-Time Integration:** Supabase Realtime (configured for Postgres changes on `public.messages`)
- **File Storage:** Supabase Storage (active bucket: `avatars`)
- **Routing & Middleware:** Next.js Proxy routing delegate in `src/proxy.ts` (authenticating and onboarding gates)
- **Deployment Target:** Vercel

---

## 🚦 Feature State

Here is the current implementation status as of July 2026:

| Feature Area | Route | State / Backend Integration |
|:---|:---|:---|
| **Landing Page** | `/` | Real static landing page. |
| **Auth / Signup** | `/login`, `/signup` | Real Supabase Auth sessions protected by Cloudflare Turnstile. |
| **Email Verification** | `/verify-email` | OTP page exists. Email confirmation is disabled in current Supabase dev setup, allowing instant sessions on signup. |
| **Onboarding Gate** | `/onboarding` | Real onboarding form that writes profile data through Supabase RPC. |
| **Activity Feed** | `/feed` | Mock feed data. |
| **Marketplace** | `/marketplace` | Real database listings (browse, detail, listing creation, and personal listings). |
| **Messages (1:1 chat)** | `/messages`, `/messages/[userId]` | Real Supabase 1:1 direct messaging backed by Supabase Realtime for live updates. Inbox, chat history, unread badges. |
| **Profiles (Public/Own)** | `/profile`, `/profile/[userId]` | Real own/public profile reads. Own profile editing and avatar image upload to Supabase Storage. Reviews section is still mock. |
| **Trust / Moderation** | *N/A* | Real backend tables for `user_blocks` and `user_reports`, but UI integration is still mock. |
| **Borrow/Lend** | `/borrow` | Mock data and UI templates. |
| **Gigs (Micro-Help)** | `/gigs` | Mock data and UI templates. |
| **SafeDrop** | `/safedrop` | Mock package coordination and UI templates. |
| **Group Ride** | `/group-ride` | Mock ride coordination and UI templates. |
| **Hangout** | `/hangout` | Mock social plans and UI templates. |
| **Notifications** | `/notifications` | Mock notifications UI. |
| **Support Ticket** | `/support-ticket` | Real form posting to a support API route. |

---

## 📂 Project Structure

The project is split between the Next.js frontend code and Supabase migrations/configuration.

```text
NearU-main/
├── frontend/                  # Next.js 16 Active Application
│   ├── src/
│   │   ├── app/               # App Router (Next.js 16 conventions)
│   │   │   ├── (auth)/        # Login, signup, verify-email, onboarding
│   │   │   ├── (app)/         # Authenticated routes (marketplace, feed, messages, etc.)
│   │   │   ├── globals.css    # Core Tailwind and Design System definitions
│   │   │   └── layout.tsx     # Root Layout (loads Plus Jakarta Sans & DM Sans fonts)
│   │   ├── components/        # Reusable UI & feature components (ui/ contains primitives)
│   │   ├── hooks/             # Client hooks (useUser, useMessages, useInfiniteScroll)
│   │   ├── lib/
│   │   │   ├── supabase/      # Supabase server/client SDK instantiations & middleware
│   │   │   └── utils.ts       # Tailwind class mergers and UI helper functions
│   │   ├── types/             # Generated database and custom App-level types
│   │   └── proxy.ts           # Next.js Route Proxy protecting authenticated routes
│   ├── public/                # Static public assets
│   └── package.json
├── supabase/                  # Supabase Local Migrations & Config
└── *.md                       # Project guidelines and plans (GEMINI.md, AGENTS.md, etc.)
```

---

## 🎨 Design System

NearU utilizes a modern, trust-focused light theme built with Tailwind CSS.

### Fonts
- **Headings:** Plus Jakarta Sans (`--font-jakarta`)
- **Body & Controls:** DM Sans (`--font-dm-sans`)

### Color Tokens
- `nu-bg` (`#F8FAFC`): Page background
- `nu-surface` (`#FFFFFF`): Cards and panels
- `nu-elevated` (`#F1F5F9`): Inputs, fields, and hover states
- `nu-border` (`#E2E8F0`): Borders
- `nu-blue` (`#2563EB`): Primary action blue (CTA, active links)
- `nu-coral` (`#EF4444`): Danger alerts and block elements
- `nu-mint` (`#059669`): Success indicators

> [!WARNING]
> Do not use dark page backgrounds, indigo/amber/orange accents, or `text-nu-bg` for button labels. Stick to the curated palette above.

---

## 🚀 Setup & Local Development

### 1. Prerequisites
- **Node.js** v24.15.0 or later
- **npm** v11.14.0 or later

### 2. Environment Configuration
Create a `.env.local` file inside the `frontend/` directory with the following variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_cloudflare_turnstile_site_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
SUPPORT_TICKET_TO_EMAIL=recipient_email_for_support_tickets
```

### 3. Run Development Server
Navigate into `frontend/` and install dependencies, then start the Next.js server:

```bash
cd frontend
npm install
npm run dev
```

The application will run locally at [http://localhost:3000](http://localhost:3000).

---

## 🔄 Core Flows & Architecture

### Onboarding Gate
Unauthenticated users accessing protected `/feed` or `/marketplace` routes are redirected to `/login`. Upon successful sign-up or log-in, users who have not onboarded are routed through `/onboarding` (where school name, gender, date of birth, display name, and avatar are collected).

Authentication state is guarded by:
1. `src/proxy.ts` (interception layer via cookies).
2. Supabase RLS (database tables strictly enforce session validity and user matches).

### Data Access Strategy
- **Reads:** Server Components fetch initial data directly from Supabase via `src/lib/supabase/server.ts`.
- **Mutations:** Performed using React Server Actions (e.g., `createListing()`, `updateProfile()`, `sendMessage()`) to maintain security and avoid API endpoint overhead.
- **Real-Time Synchronisation:** Active on `/messages/[userId]` chat screens. New message inserts on `public.messages` trigger a PostgreSQL change event pushing updates to the browser `useMessages` hook client, while initial message history is read from the durable DB tables.

---

## ⚠️ Known Open Issues / Debug Checklist
- **Login Redirects:** The login flow does not currently consume the `?next=` deep-link parameter set by the proxy (users are redirected straight to `/feed`).
- **Profile Revalidation:** `updateProfile()` does not trigger `revalidatePath()`, meaning editing profile data can look stale until a manual refresh or navigation takes place.
- **Unreferenced Avatars:** Avatar uploads can leave abandoned objects in the `avatars` storage bucket if a user drops off onboarding or profile forms without saving.
- **Button Disabled State:** `components/ui/Button` components using a custom `href` do not visually disable correctly.
- **Email Ownership:** Email verification is currently bypassed to allow testing. Real campus restrictions (verifying `.edu` domain ownership in `allowed_email_domains`) must be seeded and enabled for launch.
