# NearU Supabase Security Status

Original report date: 2026-05-22.
Current doc status: refreshed on 2026-07-14 after Supabase MCP verification.

## Current Advisor Result

Supabase Security Advisor currently reports one warning:

- `auth_leaked_password_protection`: leaked password protection is disabled.

Recommended follow-up: enable leaked password protection in Supabase Auth before launch.

## Current Live Schema Summary

Verified on 2026-07-14:

- RLS-enabled public tables: `profiles`, `profiles_public`, `allowed_email_domains`, `user_blocks`, `user_reports`, `listings`.
- `profiles_public` is now a table, not a bypassing public view.
- `profiles` no longer has broad public read access.
- `allowed_email_domains` can be read for signup/onboarding flows.
- `listings` has owner-scoped write policies and active-or-own read policy.
- Storage has one bucket, `avatars`, with owner-scoped write policies.
- No Edge Functions are deployed.

## Original Audit Findings and Current Status

| Original finding | Current status |
|---|---|
| Unrestricted profile updates could touch sensitive columns | Partially mitigated in app code by explicit update payloads, but direct column grants/policies should still be reviewed before launch |
| SECURITY DEFINER functions lacked fixed search path | Hardened in later migrations for known onboarding/profile functions |
| `allowed_email_domains` denied reads | Fixed for signup/onboarding reads |
| Broad profile grants | Later hardening migrations reduced exposure; re-check before launch with Supabase advisors |
| Public profile projection bypass risk | Replaced by RLS-enabled `profiles_public` table |
| Missing `updated_at` behavior | Listings have `updated_at`; profile behavior should be checked if relied on |
| Missing spatial index | Still worth checking when nearby queries are implemented |
| Duplicate report spam | Still worth fixing with uniqueness/rate limiting |
| Self-block possible | Still worth fixing with a check constraint |
| User deletion workflow | Not implemented |

## Product Boundary

NearU does not operate a platform payment system. Security review should not recommend adding payment infrastructure. Dormant legacy profile columns related to the old payment idea still exist in the database but must remain unused by application code.

## Immediate Pre-Launch Security Checklist

1. Enable leaked password protection.
2. Seed and verify `allowed_email_domains`.
3. Enable email confirmation with custom SMTP.
4. Re-run Supabase Security Advisor and Performance Advisor.
5. Review profile column grants and policies directly.
6. Add constraints or rate limits for self-blocks and repeated reports.
7. Browser-test auth, onboarding, profile edit, avatar upload, marketplace, and protected redirects.
