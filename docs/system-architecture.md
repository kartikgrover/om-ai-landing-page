# Om.AI Landing Page — System Architecture

Living reference. Verified against the repo on **2026-09-17**.

## Overview

Two surfaces in one static repo, served by **GitHub Pages** at [omai.app](https://omai.app):

1. **Marketing / SEO site** — ~148 HTML pages: the landing page, topic pages, free tools, legal pages, a Hindi set under `/hi/`, and the blog.
2. **Consumer web MVP** — `ask.html`, a single-file interactive app (chat + charts) sharing the mobile app's Firebase account and Heroku backend. See `CLAUDE.md` for its scope; it is not covered in detail here.

No framework and no build step. Pages that need live data call the backend directly.

---

## Technology Stack

| Layer     | Technology |
|-----------|------------|
| Markup    | HTML5, hand-written per page |
| Styling   | `styles/styles.css` + a purged Bootstrap 5.3.0 subset, both self-hosted |
| Scripts   | Vanilla JS, inline per page; three shared files in `assets/js/` |
| Fonts     | Google Fonts (DM Serif Display, Source Sans 3) with metric-matched local fallbacks |
| Icons     | Font Awesome Free 6.4.0 class names rendered as self-hosted CSS masks |
| Hosting   | GitHub Pages (Jekyll), custom domain via `CNAME` |
| CI/CD     | GitHub Actions — blog auto-publish only |
| Analytics | GA4 `G-EPT0NFE087`, Google Ads, Meta Pixel |
| Backend   | `https://om-ai-backend-4f29d7469ff6.herokuapp.com` (public endpoints only) |

Nothing is loaded from jsdelivr or cdnjs any more. `ask.html` is the exception: it still pulls marked and dompurify from jsdelivr.

---

## Directory Structure

```
om-ai-landing-page/
├── index.html                  # Landing page
├── ask.html                    # Consumer web MVP (chat + charts)
├── compare.html                # Om.AI vs other apps
│
├── <topic>.html                # SEO topic pages — kundli, marriage-prediction,
│                               #   career-astrology, ai-vedic-astrology, health-,
│                               #   love-, wealth-, business-astrology, birth-chart,
│                               #   navamsa-chart, kundli-matching, free-kundli-online,
│                               #   ai-astrology-chat, lal-kitab-remedies, rashifal-2026
├── horoscope.html              # Free tools — live backend data
├── panchang.html
├── rahu-kaal-today.html
├── gita.html
├── dasha-calculator.html       # Client-side Meeus approximation, not the backend
├── shadi-kab-hogi.html         # English "kab" twin (see the kab-family playbook)
├── bacha-kab-hoga.html         # Redirect stub → /hi/ twin
├── naukri-kab-milegi.html      # Redirect stub → /career-astrology.html
├── zodiac/*.html               # 12 sign pages
├── daily-horoscope/index.html  # Redirect stub (as are privacy.html and the two
│                               #   retired English kab twins above)
├── r/index.html                # Universal-link landing (omai.app/r)
│
├── hi/                         # 16 Hindi pages, incl. the "kab" calculators
│   ├── index.html
│   ├── shadi-kab-hogi.html · naukri-kab-milegi.html · bacha-kab-hoga.html
│   ├── paisa-kab-aayega.html · ghar-kab-banega.html · college-kab-milega.html
│   ├── shadi-kisse-hogi.html
│   └── kundli.html · career-astrology.html · marriage-prediction.html · …
│
├── support.html · feedback.html · privacy-policy.html
├── terms-of-service.html · refund-policy.html
├── delete-account.html · unsubscribe.html · 404.html       # noindex
│
├── blog/
│   ├── index.html              # Listing with CollectionPage + ItemList schema
│   ├── feed.xml                # RSS
│   ├── *.html                  # ~84 published articles
│   └── drafts/                 # Queue + schedule.json
│
├── styles/
│   ├── styles.css              # Source (~4,500 lines)
│   ├── styles.min.css          # Hand-synced minified copy, ?v=69
│   ├── bootstrap-subset.min.css# PurgeCSS subset of Bootstrap 5.3.0, ?v=1
│   └── icons.min.css           # Icon shapes as CSS masks, ?v=1
│
├── assets/
│   ├── js/nav.js               # Navbar collapse + dropdowns
│   ├── js/ads-referrer.js      # Click id → Play install referrer
│   ├── js/hi-terms.js          # Devanagari names for backend English astro terms
│   ├── logo.png/.webp · og-image.jpg · favicon/ · screenshots/
│
├── tools/                      # Repo-only: build-icons.mjs, purgecss.config.cjs
├── docs/                       # Repo-only (this file)
├── .well-known/                # App-link association files
├── _config.yml                 # Jekyll exclude list — repo-only files
├── robots.txt · sitemap.xml · site.webmanifest · CNAME · app-ads.txt
└── package.json                # No dependencies
```

---

## Page Architecture

### Categories

1. **Landing page** (`index.html`) — features, screenshots, testimonials, FAQ, download CTAs. Carries its own inline navbar script and inline SVG icons, so it does not use `nav.js` or the icon CSS.
2. **Free tools** — `horoscope`, `panchang`, `rahu-kaal-today`, `gita` fetch daily data from the backend's public endpoints.
3. **"Kab" calculators** — the `/hi/` pages plus `shadi-kab-hogi.html` send birth details as a GET to `api/public/{marriage,career,children,wealth,property,education}-window` and render event windows. The backend ships labels, never scores.
4. **SEO topic pages** — long-form pages aimed at one query cluster each; see the page-intent map for the anti-cannibalization rule.
5. **Hindi set** (`/hi/`) — the Devanagari surface, linked by `hreflang`.
6. **Blog** — educational articles, auto-published on a schedule.
7. **Utility** — support, feedback, legal, account management.

### Common page template

```
<head>
  Meta tags, Open Graph (no Twitter cards — deliberate), robots, canonical
  Favicons + manifest + theme-color
  preconnect: fonts.googleapis.com, fonts.gstatic.com
  bootstrap-subset.min.css   (render-blocking)
  styles.min.css             (render-blocking, versioned)
  icons.min.css              (media="print" onload, + noscript)
  Google Fonts               (media="print" onload, + noscript)
  Page-specific <style> block
  JSON-LD graph
  GA4 + Ads (async), Meta Pixel (eager only on ?fbclid= URLs)
</head>
<body>
  Navbar → main → footer with store links
  nav.js (defer) + page-specific inline scripts
</body>
```

---

## CSS Architecture

### Design tokens

```
Brand:      #D97757 (coral/terracotta)
Background: #262624 (base) → #30302E (elevated) → #1F1E1D (subtle) → #141413 (footer)
Text:       #FFFFFF (primary) → #D4D2C8 (secondary) → #A8A599 (tertiary)
Typography: DM Serif Display (headings), Source Sans 3 (body)
Spacing:    4px–64px scale (--space-1 … --space-16)
Radius:     10–12px (matching the mobile app)
Borders:    0.5px, 30% opacity; no shadows
```

### Bootstrap subset

`styles/bootstrap-subset.min.css` is PurgeCSS run over the official minified Bootstrap 5.3.0 file (32 KB raw, 6.7 KB gzipped, from 233 KB / 31 KB). It is render-blocking on purpose: loaded async it caused 0.3–0.9 CLS. A page using a Bootstrap class no other page uses needs a rebuild and a `?v=` bump — the command is in `CLAUDE.md`.

Bootstrap's JavaScript is not loaded at all. `assets/js/nav.js` reimplements `data-bs-toggle="collapse"` and `"dropdown"` only, setting the same classes and attributes the CSS reads. Any other Bootstrap component would need its own code.

### Icons

Pages keep writing `<i class="fas fa-name">`, but there is no Font Awesome. `tools/build-icons.mjs` reads the icon metadata and generates:

- `styles/icons.min.css` — one rule per icon, the shape as an SVG data URI in `--fa-i`, painted with a CSS mask in `currentColor`. Loaded async.
- The sizing block between the `icons:start` / `icons:end` markers in both stylesheets, which is render-blocking so icons don't shift the layout when the shapes arrive.

Class names assembled in JavaScript can't be scanned, so they live in the script's `FROM_JS` list. Pro-only icons render blank.

### Fonts

Google Fonts still serves the two web fonts, but every stack carries metric-matched fallbacks (`@font-face` at the top of `styles/styles.css`) built with `size-adjust` and the ascent/descent overrides, so the swap doesn't reflow text. New pages must include the fallback names.

### Responsive strategy

Mobile-first, fluid type via `clamp()`, the Bootstrap grid for layout, fluid section padding, hamburger navigation.

---

## JavaScript Architecture

No framework, no modules, no bundler. Three shared files, everything else inline per page.

| File | Purpose |
|------|---------|
| `assets/js/nav.js` | Navbar collapse + dropdowns, replacing `bootstrap.bundle.js` |
| `assets/js/ads-referrer.js` | Carries the ad click id into the Play Store install referrer so paid installs attribute to their campaign |
| `assets/js/hi-terms.js` | Devanagari names for the astro vocabulary the backend returns in English |

Inline per page: the tool and calculator logic, the download-click GA delegation, and the analytics blocks.

### App store links

- **Android**: `https://play.google.com/store/apps/details?id=com.omai.app`
- **iOS**: `https://apps.apple.com/us/app/om-ai/id6630366988`

Both carry per-page campaign parameters.

---

## Blog & Content Pipeline

```
blog/drafts/schedule.json  →  GitHub Actions (daily cron, 00:00 UTC)
                                    ↓
                           publish-scheduled.sh
                                    ↓
                           ├── Moves draft → blog/
                           ├── Adds card to blog/index.html
                           ├── Updates sitemap.xml
                           ├── Updates blog/feed.xml (RSS)
                           ├── Updates ItemList JSON-LD
                           ├── Removes from schedule.json
                           └── Auto-commits via the github-actions bot
```

### schedule.json format

```json
{
  "article-slug.html": {
    "date": "2026-03-15",
    "title": "Article Title",
    "excerpt": "Short description for the blog card",
    "tag": "Category Tag"
  }
}
```

Each article carries Article + BreadcrumbList JSON-LD, internal links to related articles and tools, the shared navbar/footer, and an RSS entry.

---

## SEO Architecture

### Structured data (JSON-LD), by count across the site

| Schema type | Used on |
|-------------|---------|
| Organization | every page (publisher block) |
| WebPage | ~132 pages |
| BreadcrumbList | ~127 pages |
| Article | blog articles |
| FAQPage | ~45 pages |
| WebApplication | the calculator pages |
| WebSite | homepages (with SearchAction) |
| MobileApplication | `index.html` (4.8, ratingCount 2000) |
| SoftwareApplication | `navamsa-chart.html` |
| CollectionPage + ItemList | `blog/index.html` |

An `FAQPage` block and its visible FAQ must stay in sync — Search Console flags a mismatch.

### Crawl configuration

- `robots.txt`: allows everything except `/blog/drafts/`, `/node_modules/`, the backend API paths referenced from inline JS, and PDF/ZIP files. Query strings are deliberately crawlable — the comment in the file explains why.
- `sitemap.xml`: every public page with priority scaling and `lastmod`.
- `rel=canonical` on every page; `hreflang` pairs the English and Hindi twins.
- `noindex` on `delete-account`, `unsubscribe`, `404`.

### Social sharing

Open Graph on all pages. The English pages use `assets/og-image.jpg` at 1200×630 with alt text. Twitter Card tags are deliberately absent — there is no account.

---

## Performance

| Technique | Implementation |
|-----------|----------------|
| Self-hosted CSS | Bootstrap subset + icons replaced ~330 KB of CDN transfer with ~36 KB on our own domain |
| Render-blocking where it prevents shift | Bootstrap subset, `styles.min.css` and the icon sizing block block; icon shapes and fonts don't |
| Font fallbacks | Metric-matched `@font-face` so the web-font swap doesn't reflow |
| Image optimization | WebP with PNG fallback via `<picture>` |
| Lazy loading | `loading="lazy"` below the fold |
| Cache busting | `?v=` on every stylesheet |
| Analytics | GA4 and Ads async; the Meta Pixel is eager only on `?fbclid=` URLs, because deferring it breaks `_fbc` attribution |

Lab CLS after the 2026-09-17 changes is 0.00–0.06 on the pages measured, except `ai-vedic-astrology.html` on desktop at 0.11.

---

## Asset Pipeline

No bundler. Manual workflow:

1. Edit `styles/styles.css`, then hand-sync `styles/styles.min.css`.
2. Bump the `?v=` on the changed stylesheet.
3. New icon → `node tools/build-icons.mjs`, then bump both `?v=`.
4. New Bootstrap class → rebuild the subset (command in `CLAUDE.md`), then bump `?v=`.
5. Images: create WebP variants alongside the PNG originals.

---

## PWA Support

`site.webmanifest` gives basic install metadata: name "Om.AI - Vedic Astrology & Spiritual Wisdom", standalone display, theme `#D97757`, 192 and 512 px icons, linked from every page. No service worker.

---

## Deployment

1. Push to `main`. **There is no staging — a push is a production deploy.**
2. GitHub Pages builds the repo with Jekyll. There is no `.nojekyll` (removed 2026-09-17), so repo-only files must be listed under `exclude:` in `_config.yml` or they are published; `.well-known` is re-included because Jekyll drops dot-directories.
3. Pages builds are atomic — a failed build leaves the previous site up.
4. `CNAME` maps the custom domain; blog articles publish themselves daily via the Actions cron.
