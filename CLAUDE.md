# Om.ai Landing Page — Claude Code Instructions

## Project
Static landing page for Om.ai (Vedic astrology app). Hosted via GitHub Pages with custom domain.

## Response Accuracy
**If you are not confident about a factual claim (pricing, industry norms, competitor data, best practices, etc.), do a web search BEFORE responding.** Do not guess or state things as fact when unsure — verify first. Getting it wrong wastes time and erodes trust.

## Workspace Context
This is part of a multi-project VS Code workspace:
- **om-ai-landing-page** (this project) — Landing page website → `/Users/kartikgrover/Documents/Projects/om-ai-landing-page`
- **om/om1** — React Native frontend (Expo) → `/Users/kartikgrover/Documents/Projects/om/om1`
- **om.ai-backend** — Node.js API server, Heroku-deployed → `/Users/kartikgrover/Documents/Projects/om.ai-backend`
- **om-ai-ops** — Firebase config, Firestore rules/indexes, Cloud Functions → `/Users/kartikgrover/Documents/Projects/om-ai-ops`

## CRITICAL: Deployment Safety

**Push = deploy.** GitHub Pages serves directly from the repo, so any `git push` to the default branch goes live immediately — there is no staging step and no Action gate. This means **`git commit` + `git push` is a production deploy** and needs explicit user permission every time. Local edits and `git commit` (without push) are fine.

This site is live and serves:
- App Store / Play Store listing links
- Privacy policy, terms of service
- Delete account page
- SEO landing pages (horoscope, panchang, etc.)

## Key Pages
- `index.html` — Main landing page
- `privacy-policy.html` — Privacy policy (linked from app stores)
- `delete-account.html` — Account deletion (required by app stores)
- `horoscope.html`, `panchang.html`, etc. — SEO content pages
- `blog/` — Blog posts
- `CNAME` — Custom domain config

## Notes
- Static HTML/CSS/JS — no build system
- Hosted on GitHub Pages
- Do not modify `CNAME`, `app-ads.txt`, or `docs/` without permission

## Analytics & Ad Data Access

### Google Analytics (GA4) via BigQuery
`bq` CLI is authed as `groverkartik25@gmail.com`. Tables: `` `omai-1ea53.analytics_498597496.events_YYYYMMDD` `` (daily export, data from 2026-01-17). Standard GA4 schema — `event_name`, `event_date`, `user_pseudo_id`, `geo.country`, `traffic_source.*`, `device`, `platform`, `event_value_in_usd`, plus `collected_traffic_source` (gclid for Google Ads). Common events: `first_open`, `session_start`, `in_app_purchase`, `page_view`, `user_engagement`. For landing-page-only traffic, filter by `event_dimensions.hostname` or `traffic_source.source = 'website'` / `medium = 'landing'`. Query with `bq query --use_legacy_sql=false --format=json 'SELECT … FROM \`omai-1ea53.analytics_498597496.events_*\` WHERE _TABLE_SUFFIX BETWEEN "YYYYMMDD" AND "YYYYMMDD"'`.

### Meta Ads API
Available via the backend project (`../om.ai-backend/server.js:3008`). Account `act_1704926593380350`, token in `META_ADS_ACCESS_TOKEN` env var. Read-only.

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
- **Pricing decisions**: canonical in `om/om1/docs/pricing/PRICING_TIMELINE.md` — reference, don't duplicate.

## Existing Analysis Docs
- `AUDIT_FINDINGS.md` — prior site audit.
