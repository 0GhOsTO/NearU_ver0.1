# Repository Guidelines

## Project Structure & Module Organization
NearU is a planning repository plus a Next.js frontend app. Root documents such as `NearU_BusinessPlan.md`, `General_Stack.md`, `structure.md`, and `backend_structure.md` describe product and architecture direction; the runnable app lives in `frontend/`.

Inside `frontend/src`, Next.js App Router routes live under `app/`: `(auth)` contains login, signup, verify-email, and onboarding screens; `(app)` contains authenticated product areas such as feed, marketplace, gigs, SafeDrop, group rides, hangouts, messages, notifications, and profile. Reusable UI and feature components live in `components/`, hooks in `hooks/`, shared utilities in `lib/`, and shared types in `types/`. Static assets belong in `frontend/public/`.

**NearU handles no platform payments** (2026-07-13 scope decision). There is no wallet, no checkout, no payout flow, and no feature may require users to pay through NearU. Build verticals as listings, profiles, search/browse, trust, reports/blocks, and messaging/coordination only.

## Build, Test, and Development Commands
Run commands from `frontend/` unless noted otherwise.

```bash
npm install        # install dependencies from package-lock.json
npm run dev        # start the local Next.js dev server
npm run build      # create a production build
npm run start      # serve the production build locally
npm run lint       # run ESLint with Next.js TypeScript rules
```

Use `npm run build` and `npm run lint` before opening a pull request.

## Coding Style & Naming Conventions
Use TypeScript, React function components, and strict typing. Prefer path aliases like `@/components/ui/Button` over long relative imports. Components use `PascalCase.tsx`, hooks use `useName.ts`, and utility modules use short descriptive names such as `utils.ts`. Keep route files named according to Next.js conventions: `page.tsx`, `layout.tsx`, and dynamic segments like `[id]`.

Styling uses Tailwind CSS. Keep shared primitives in `components/ui/` free of business logic, and keep feature-specific logic in the relevant feature folder.

## Testing Guidelines
No test framework or test script is currently configured. For now, verify changes with `npm run lint`, `npm run build`, and manual checks in `npm run dev`. When adding tests, colocate them as `*.test.ts` or `*.test.tsx`, and document the new command in `frontend/package.json`.

## Commit & Pull Request Guidelines
Git history is minimal; use clear imperative commit messages such as `Add marketplace listing form` or `Fix profile cache refresh`. Keep commits focused on one logical change.

Pull requests should include a concise description, affected routes or components, verification steps, linked issues when applicable, and screenshots for UI changes. Note new environment variables or setup requirements.

## Agent-Specific Instructions
For edits inside `frontend/`, also follow `frontend/AGENTS.md`: this project uses Next.js 16 behavior that differs from older assumptions, so consult local Next.js docs in `node_modules/next/dist/docs/` when APIs are uncertain.
