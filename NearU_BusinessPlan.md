# NearU Business Plan

## Overview

NearU is a hyperlocal platform where verified campus/community members discover nearby listings, coordinate help, share resources, and meet safely.

NearU is not a platform payment product. It does not provide a wallet, checkout, payout flow, payment processing, or any feature that requires users to pay through NearU.

## Core Features

| Feature | Description |
|---|---|
| Marketplace | Post and browse local item listings |
| Borrow/Lend | Share or request items within the local community |
| Small Gigs | Post and discover nearby help requests |
| SafeDrop | Coordinate package holding with trusted nearby members |
| Group Ride | Coordinate shared trips to common destinations |
| Group Hangout | Organize local social plans |
| Messages | Coordinate details directly between users |
| Profiles and Trust | Verified school/community identity, public profile, reviews, reports, and blocks |

## Advertisement Strategy

The main advertising focus is student micro-help and trusted local coordination.

### Segment A - Students Who Need Help

Target audience:

- Freshmen.
- International students.
- Students without cars.
- Students living off-campus.
- Students in dorms or apartments.
- Busy students with classes or jobs.

Key message:

> "Need something done nearby? Ask a verified student."

### Segment B - Students Who Can Help

Target audience:

- Students who stay near campus.
- Students with flexible schedules.
- Students who want local experience or side opportunities.
- Club members, student workers, RAs, and commuters.

Key message:

> "Help verified students nearby."

## Technical Strategy

The app is built as a Next.js frontend backed by Supabase Auth, Postgres, RLS, and Storage. Messaging is the next critical backend layer because coordination is the conversion step for every vertical.

Current Supabase-backed areas:

- Auth and onboarding.
- Profiles and public profiles.
- Avatars.
- Marketplace listings.

Still to build:

- Real messaging.
- Real feed.
- Remaining vertical tables.
- Reviews.
- Notifications.
- Listing image upload.

## Vision

NearU is built on trust within proximity: turning classmates, neighbors, dorm-mates, and nearby community members into a reliable local network for help, goods, and coordination.
