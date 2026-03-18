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

## IMPORTANT: No Mention of Internal Tools/Vendors
- **NEVER mention Swiss Ephemeris** on any public-facing page (no license yet)
- **NEVER mention OpenAI** or any AI vendor/model names on public-facing pages
- Use generic terms like "AI-powered", "advanced calculations", "classical algorithms" instead
- This applies to landing pages, blog posts, meta tags, structured data, and any user-visible content
