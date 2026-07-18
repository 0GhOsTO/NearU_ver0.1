# Allowed Universities

This file is historical reference only. The app no longer uses hardcoded university or domain arrays.

The source of truth is Supabase `public.allowed_email_domains`. Signup and onboarding read allowed schools/domains from Supabase, and the live table is currently empty according to the 2026-07-14 Supabase check.

When adding schools, insert rows into `allowed_email_domains` with:

- `domain`: lowercase email domain.
- `school_name`: display name.
- `active`: `true` for currently accepted domains.
