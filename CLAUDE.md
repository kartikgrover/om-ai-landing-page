# Om.ai Landing Page — Claude Code Instructions

## Project
Om.ai (Vedic astrology app) website, hosted via GitHub Pages on `omai.app` (custom domain). Two surfaces in one repo: (1) the static landing/SEO/marketing + legal pages, and (2) the **consumer web MVP** `ask.html` — an interactive single-file web app (chat + charts) that shares the app's Firebase account and backend. See the "Web Consumer MVP" section below.

## Response Accuracy
**If you are not confident about a factual claim (pricing, industry norms, competitor data, best practices, etc.), do a web search BEFORE responding.** Do not guess or state things as fact when unsure — verify first. Getting it wrong wastes time and erodes trust.

## Workspace Context
This is part of a multi-project VS Code workspace (5 projects):
- **om-ai-landing-page** (this project) — Landing page website + consumer web MVP (`ask.html` on `omai.app`) → `/Users/kartikgrover/Documents/Projects/om-ai-landing-page`
- **om/om1** — React Native frontend (Expo) → `/Users/kartikgrover/Documents/Projects/om/om1`
- **om.ai-backend** — Node.js API server, Heroku-deployed → `/Users/kartikgrover/Documents/Projects/om.ai-backend`
- **om-ai-ops** — Firebase config, Firestore rules/indexes, Cloud Functions → `/Users/kartikgrover/Documents/Projects/om-ai-ops`
- **om-ai-pro** — Astrologer Pro console (B2B), static single-file site on Firebase Hosting → `pro.omai.app` → `/Users/kartikgrover/Documents/Projects/om-ai-pro`

## Skills & plugins to use
- **Building/reshaping any page UI** (index.html, the `ask.html` MVP, SEO/landing pages): use the **frontend-design** skill.
- **Any JS library / Razorpay web / Firebase web SDK**: pull current docs via **context7** (`mcp__plugin_context7_context7__*`).

## CRITICAL: Deployment Safety

**Push = deploy.** GitHub Pages serves directly from the repo, so any `git push` to the default branch goes live immediately — there is no staging step and no Action gate. This means **`git commit` + `git push` is a production deploy** and needs explicit user permission every time. Local edits and `git commit` (without push) are fine.

This site is live and serves:
- App Store / Play Store listing links
- Privacy policy, terms of service
- Delete account page
- SEO landing pages (horoscope, panchang, etc.)

## Key Pages
- `index.html` — Main landing page
- `ask.html` — **Consumer web MVP** (the interactive app on the web — see section below)
- `privacy-policy.html` — Privacy policy (linked from app stores)
- `delete-account.html` — Account deletion (required by app stores)
- `horoscope.html`, `panchang.html`, etc. — SEO content pages
- `blog/` — Blog posts
- `CNAME` — Custom domain config

## Web Consumer MVP (`ask.html`)
This repo also serves **the consumer web app** at `omai.app/ask.html` — a single-file interactive app (inline `<script type="module">`, no build) mirroring the mobile app's *paid* half.

- **Scope = chat + charts ONLY** (the astro-hub "Today" dashboard was built then removed 2026-06-23 — the SEO pages already cover the informational layer). Flow: onboarding → personal chat ↔ compatibility chat → Birth Chart (D1/D9 + dasha) → history → paywall.
- **Shares the app's account.** Same Firebase project (`omai-1ea53`) → same UID per provider; an app user signs in on web (Google/Apple/email-pass) and inherits their chart/history/subscription. Firestore under `users/{uid}/`: `astroData/chart`+`d9_chart`, `metadata/dob` (read `coordinates || birthCoordinates`; write both + `birthTimezone`), `premium/subscription`, `questions/purchased.remaining`, `astro_sessions`+`astro_chats`. Birth time REQUIRED.
- **Backend = live Heroku server** over WebSocket. Types: `astro`/`astroQuestion`, `compatibility`/`compatibilityQuestion` (need `convId`), `generateChart`. Web entitlement gate + Razorpay billing shipped to backend `main` in **v425**.
- **Billing = Razorpay:** ₹199/mo (`plan_T57Fhoh2RRjnX9`), ₹1,499/yr (`plan_T57FirTng7tqWC`), LIVE; backend `routes/web-payments.js`; enforces only when backend `ENTITLEMENT_GATE=enforce`.
- **Chart UI** ported from `../om-ai-pro/index.html` (canonical app-parity renderer) — copy from there when mirroring app UI.
- **Sanity-check JS:** extract the `<script type="module">` body, strip `import` lines, `node --check`.
- **Sibling B2B surface:** `../om-ai-pro` = astrologer Pro console (`pro.omai.app`), same backend, `audience:'pro'` brief. Don't confuse the two.

## Notes
- Static HTML/CSS/JS — no build system
- Hosted on GitHub Pages
- Do not modify `CNAME`, `app-ads.txt`, or `docs/` without permission

## Analytics & Ad Data Access

### Google Analytics (GA4) via BigQuery
`bq` CLI is authed as `groverkartik25@gmail.com`. Tables: `` `omai-1ea53.analytics_498597496.events_YYYYMMDD` `` (daily export, data from 2026-01-17). Standard GA4 schema — `event_name`, `event_date`, `user_pseudo_id`, `geo.country`, `traffic_source.*`, `device`, `platform`, `event_value_in_usd`, plus `collected_traffic_source` (gclid for Google Ads). Common events: `first_open`, `session_start`, `in_app_purchase`, `page_view`, `user_engagement`. For landing-page-only traffic, filter by `event_dimensions.hostname` or `traffic_source.source = 'website'` / `medium = 'landing'`. Query with `bq query --use_legacy_sql=false --format=json 'SELECT … FROM \`omai-1ea53.analytics_498597496.events_*\` WHERE _TABLE_SUFFIX BETWEEN "YYYYMMDD" AND "YYYYMMDD"'`.

### Meta Ads API
Available via the backend project (`../om.ai-backend/server.js:3008`). Current account `act_223330353092043` ("Om.AI Ad Account", live); legacy `act_1704926593380350` (USD) is paused — don't use. Token in `META_ADS_ACCESS_TOKEN` env var. Read-only.

## IMPORTANT: No Mention of Internal Tools/Vendors
- **NEVER mention Swiss Ephemeris** on any public-facing page (no license yet)
- **NEVER mention OpenAI** or any AI vendor/model names on public-facing pages
- Use generic terms like "AI-powered", "advanced calculations", "classical algorithms" instead
- This applies to landing pages, blog posts, meta tags, structured data, and any user-visible content

## FAQ Schema Sync
`index.html` has a JSON-LD `FAQPage` block at the top AND a visible FAQ section near the bottom. They must stay in sync — updating one without the other creates a mismatch Google Search Console flags. When adding / editing a Q&A, update both.

## SEO Context (Apr 2026 GSC snapshot)
Use these numbers to anchor SEO decisions rather than guessing:
- **Clicks: 11.7K (+43% YoY). Impressions: 333K (+59%).**
- Top pages: `/` (home) → `marriage-prediction.html` → `kundli.html` (+8,400% growth) → `ai-vedic-astrology.html` → `career-astrology.html`.
- Query clusters: `ai astrology` (5.2K), `ai kundali` (937), `free astrology chat` (915, **+445%** — fastest grower, "24/7" / "unlimited" phrasings), branded `om ai` (638), `ai astrology app` (150).
- Geo: 90% India, 2% US. 92% non-branded.
- Hindi queries appearing (`ऐ ज्योतिष`, `एआई कुंडली निःशुल्क`) — `/hi/` pages exist with `hreflang`.
- Topic landing pages that started at 0 clicks and are now top-5 (marriage-prediction, career-astrology) suggest the pattern works — worth building more (health-astrology, love-astrology, wealth-astrology).

## Doc Conventions (when creating a new doc)
- **Living reference** (updated over time): `<ALLCAPS_NAME>.md` at repo root (small project — no `docs/` folder yet), or kebab-case if you want.
- **Point-in-time snapshot** (frozen at write): `YYYY-MM-DD_TOPIC.md`. Don't edit after the date — write a new dated doc instead.
- **Stale docs**: `git mv` to an `archive/` folder (create if needed) with a one-liner explaining why. Don't delete.
- **Pricing decisions**: canonical in `om-ai-ops/docs/pricing/PRICING_TIMELINE.md` — reference, don't duplicate.

## Existing Analysis Docs
- `AUDIT_FINDINGS.md` — prior site audit.

## macOS Reminders
When adding a macOS Reminder (recheck/follow-up TODOs), always create it under the **Om.AI** list (create the list if missing) — never the default Reminders list.
