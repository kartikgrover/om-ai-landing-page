# Om.ai Landing Page — Claude Code Instructions

## Project
Static landing page for Om.ai (Vedic astrology app). Hosted via GitHub Pages with custom domain.

## Workspace Context
This is part of a multi-project VS Code workspace:
- **om-ai-landing-page** (this project) — Landing page website → `/Users/kartikgrover/Documents/Projects/om-ai-landing-page`
- **om/om1** — React Native frontend (Expo) → `/Users/kartikgrover/Documents/Projects/om/om1`
- **om.ai-backend** — Node.js API server, Heroku-deployed → `/Users/kartikgrover/Documents/Projects/om.ai-backend`
- **om-ai-ops** — Firebase config, Firestore rules/indexes, Cloud Functions → `/Users/kartikgrover/Documents/Projects/om-ai-ops`

## CRITICAL: Deployment Safety

**NEVER push to GitHub or deploy without explicit user permission.** This site is live and serves:
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
GA4 data is exported to BigQuery and accessible via the `bq` CLI (already authenticated via gcloud as `groverkartik25@gmail.com`).
- **GCP Project:** `omai-1ea53`
- **Dataset:** `analytics_498597496`
- **Tables:** `events_YYYYMMDD` (daily export, data from 2026-01-17 onward)
- **Key fields:** `event_name`, `event_date`, `user_pseudo_id`, `geo.country`, `traffic_source.{source,medium,name}`, `device`, `platform`, `event_value_in_usd`, `collected_traffic_source` (gclid for Google Ads)
- **Key events:** `first_open` (installs), `session_start`, `in_app_purchase`, `page_view`, `user_engagement`
- **Usage:** `bq query --use_legacy_sql=false --format=json 'SELECT ... FROM \`omai-1ea53.analytics_498597496.events_*\` WHERE _TABLE_SUFFIX BETWEEN "YYYYMMDD" AND "YYYYMMDD"'`
- **Landing page traffic:** Filter by `event_dimensions.hostname` or `traffic_source.source = 'website'` / `traffic_source.medium = 'landing'`

### Meta Ads API
Available via the backend project (`../om.ai-backend/server.js:3008`). Account `act_1704926593380350`, token in `META_ADS_ACCESS_TOKEN` env var. Read-only.

### P&L Dashboard Data
Daily P&L in Firestore `dailyPnlHistory` (keyed by `YYYY-MM-DD`). Access via `../om.ai-backend/firebase-config.js`.

## IMPORTANT: No Mention of Internal Tools/Vendors
- **NEVER mention Swiss Ephemeris** on any public-facing page (no license yet)
- **NEVER mention OpenAI** or any AI vendor/model names on public-facing pages
- Use generic terms like "AI-powered", "advanced calculations", "classical algorithms" instead
- This applies to landing pages, blog posts, meta tags, structured data, and any user-visible content
