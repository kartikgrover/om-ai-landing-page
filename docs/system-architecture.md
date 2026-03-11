# Om.AI Landing Page — System Architecture

## Overview

Static marketing website for **Om.AI**, an AI-powered Vedic astrology mobile app. Hosted on **GitHub Pages** at [omai.app](https://omai.app). No backend, no build tools, no framework — pure HTML/CSS/JS with CDN dependencies.

---

## Technology Stack

| Layer        | Technology                        |
|-------------|-----------------------------------|
| Markup       | HTML5 (semantic)                  |
| Styling      | CSS3 + Bootstrap 5.3.0 (CDN)     |
| Scripts      | Vanilla JS (ES6+)                |
| Fonts        | Google Fonts (DM Serif Display, Source Sans 3) |
| Icons        | Font Awesome 6.4.0 (CDN)         |
| Video        | Video.js 8.17.3 (npm)            |
| Hosting      | GitHub Pages (custom domain)      |
| CI/CD        | GitHub Actions                    |
| Analytics    | Google Analytics 4 (G-EPT0NFE087)|

---

## Directory Structure

```
om-ai-landing-page/
├── index.html                  # Main landing page
├── horoscope.html              # Daily Moon sign Rashifal (free tool)
├── panchang.html               # Daily Panchang with Tithi/Nakshatra (free tool)
├── gita.html                   # Bhagavad Gita verse of the day (free tool)
├── rahu-kaal-today.html        # Daily Rahu Kaal timings (free tool)
├── rashifal-2026.html          # Yearly horoscope for all signs (SEO content)
├── ai-vedic-astrology.html     # AI astrology explainer (SEO content)
├── lal-kitab-remedies.html     # Lal Kitab remedies reference (SEO content)
├── support.html                # Help center
├── feedback.html               # Feedback form
├── privacy-policy.html         # Legal
├── terms-of-service.html       # Legal
├── refund-policy.html          # Legal
├── delete-account.html         # Account deletion (noindex)
├── unsubscribe.html            # Email unsubscribe (noindex)
├── 404.html                    # Custom error page (noindex)
│
├── blog/
│   ├── index.html              # Blog listing with ItemList schema
│   ├── feed.xml                # RSS feed
│   ├── *.html                  # Published articles (~14)
│   └── drafts/
│       ├── schedule.json       # Auto-publish schedule
│       └── *.html              # Queued articles (~54)
│
├── styles/
│   ├── styles.css              # Full source (~5,400 lines)
│   └── styles.min.css          # Minified production (versioned ?v=62)
│
├── scripts/
│   ├── main.js                 # Full source (~715 lines)
│   └── main.min.js             # Minified production
│
├── assets/
│   ├── logo.png / logo.webp    # Brand logos
│   ├── favicon/                # 5 sizes (32–512px) + favicon.ico
│   ├── om-ai-demo.mp4/.webm    # Hero video + poster + VTT captions
│   └── screenshots/            # App screenshots (PNG + WebP pairs)
│
├── .github/
│   ├── workflows/
│   │   └── scheduled-publish.yml   # Daily blog auto-publish
│   └── scripts/
│       └── publish-scheduled.sh    # Publish logic
│
├── robots.txt                  # Crawler rules
├── sitemap.xml                 # All pages with priority/changefreq
├── site.webmanifest            # PWA manifest
├── CNAME                       # GitHub Pages custom domain (omai.app)
├── app-ads.txt                 # Google Ad Manager IDs
└── package.json                # video.js dependency only
```

---

## Page Architecture

### Page Categories

1. **Landing Page** (`index.html`) — Hero video, features, AI chat demo, screenshots, testimonials, FAQ, download CTAs
2. **Free Tools** — Dynamic daily content pages (horoscope, panchang, gita, rahu-kaal) targeting high-volume search queries
3. **SEO Content** — Long-form reference pages (rashifal-2026, ai-vedic-astrology, lal-kitab-remedies) for organic traffic
4. **Blog** — Educational articles on Vedic astrology topics, auto-published on schedule
5. **Utility** — Support, feedback, legal policies, account management

### Common Page Template

Every page follows this structure:
```
<head>
  Meta tags (charset, viewport, title, description, keywords)
  Open Graph tags (title, description, url, type, image, image:alt, site_name)
  Robots directive + canonical URL
  Favicons (5 sizes) + apple-touch-icon + manifest
  Resource hints (preconnect, dns-prefetch)
  Bootstrap CSS (CDN)
  Custom styles (styles.min.css, versioned)
  Font Awesome (non-blocking, media="print" trick)
  Google Fonts (non-blocking, media="print" trick)
  JSON-LD structured data
  Google Analytics (async)
</head>
<body>
  Navbar (shared across all pages)
  Main content
  Footer with app store links + nav links
  Bootstrap JS (CDN, defer)
  main.min.js (defer)
</body>
```

---

## CSS Architecture

### Design System (CSS Custom Properties)

```
Brand:      #D97757 (coral/terracotta)
Background: #262624 (base) → #30302E (elevated) → #1F1E1D (subtle) → #141413 (footer)
Text:       #FFFFFF (primary) → #D4D2C8 (secondary) → #A8A599 (tertiary)
Typography: DM Serif Display (headings), Source Sans 3 (body)
Spacing:    4px–64px scale (--space-1 through --space-16)
Radius:     10–12px (matching mobile app)
Shadows:    None (flat design)
Borders:    0.5px, 30% opacity
```

### Responsive Strategy

- Mobile-first with fluid typography via `clamp()`
- Bootstrap 5 grid (lg/md/sm breakpoints)
- Fluid section padding: `clamp(2rem, 5vw, 4rem)`
- Hamburger navigation on mobile

---

## JavaScript Architecture

`scripts/main.js` (~715 lines) — No framework, no modules, vanilla ES6+.

### Modules

| Module | Purpose |
|--------|---------|
| Section Animations | IntersectionObserver scroll-triggered fade-ins with staggered card delays |
| Hero Video | Video.js initialization, autoplay with fallback, loading states |
| Mobile Carousel | Horizontal scroll with dot indicators for feature/how-it-works cards |
| Back-to-Top | Scroll-triggered button at 300px threshold |
| Navbar Effects | Add scrolled class at 50px for background change |
| Smart Downloads | Device detection (iOS/Android/Mac) → dynamic app store link routing |
| Word Animation | `data-animate-words` attribute for word-by-word text reveal |
| Accessibility | `prefers-reduced-motion` respected, keyboard navigation detection |

### App Store Links

- **Android**: `https://play.google.com/store/apps/details?id=com.omai.app`
- **iOS**: `https://apps.apple.com/us/app/om-ai/id6630366988`

---

## Blog & Content Pipeline

### Automated Publishing System

```
blog/drafts/schedule.json  →  GitHub Actions (daily cron at 00:00 UTC)
                                    ↓
                           publish-scheduled.sh
                                    ↓
                           ├── Moves draft → blog/
                           ├── Adds card to blog/index.html
                           ├── Updates sitemap.xml
                           ├── Updates blog/feed.xml (RSS)
                           ├── Updates ItemList JSON-LD schema
                           ├── Removes from schedule.json
                           └── Auto-commits via github-actions bot
```

### schedule.json Format

```json
{
  "article-slug.html": {
    "date": "2026-03-15",
    "title": "Article Title",
    "excerpt": "Short description for blog card",
    "tag": "Category Tag"
  }
}
```

### Blog Article Template

Each article includes:
- Article JSON-LD schema (headline, datePublished, author, publisher)
- BreadcrumbList schema (Home → Blog → Article)
- Internal links to related articles and free tools
- Consistent navbar/footer from main site
- RSS entry in `blog/feed.xml`

---

## SEO Architecture

### Structured Data (JSON-LD)

| Schema Type | Used On |
|------------|---------|
| MobileApplication | index.html (rating: 4.8/5, 2500 reviews) |
| Organization | index.html |
| WebSite | index.html (with SearchAction) |
| FAQPage | index.html |
| WebPage | All content & utility pages |
| BreadcrumbList | Tool pages, blog articles |
| Article | Blog articles |
| CollectionPage + ItemList | blog/index.html |

### Crawl Configuration

- `robots.txt`: Allow all except `/blog/drafts/`, `/delete-account.html`, `/unsubscribe.html`, PDFs, ZIPs
- `sitemap.xml`: All public pages with priority scaling (1.0 home → 0.8 blog → 0.3 account pages)
- Canonical URLs on every page
- `noindex` on delete-account, unsubscribe, 404

### Social Sharing

- Open Graph tags on all pages (title, description, url, type, image with alt, site_name)
- `og:locale` set to `en_IN` on homepage

---

## Performance Optimizations

| Technique | Implementation |
|-----------|---------------|
| Non-blocking fonts | Font Awesome & Google Fonts use `media="print" onload="this.media='all'"` |
| Image optimization | WebP with PNG fallback via `<picture>` elements |
| Lazy loading | `loading="lazy"` on all below-fold images |
| Resource hints | `preconnect` for CDNs, `dns-prefetch` for analytics |
| CSS versioning | `styles.min.css?v=62` for cache busting |
| Video optimization | Dual format (MP4 + WebM), poster image, VTT captions |
| Async analytics | Google Analytics loaded with `async` attribute |
| Minification | Separate `.min.css` and `.min.js` production files |

---

## Asset Pipeline

No automated build tool. Manual workflow:

1. Edit `styles/styles.css` → manually minify to `styles/styles.min.css`
2. Edit `scripts/main.js` → manually minify to `scripts/main.min.js`
3. Bump `?v=` query string on CSS link for cache busting
4. Images: Create WebP variants alongside PNG originals

### Image Sizes

| Asset | PNG | WebP | Savings |
|-------|-----|------|---------|
| Logo | 374 KB | 46 KB | 87% |
| AI Chat screenshot | 643 KB | 118 KB | 82% |
| Horoscope screenshot | 956 KB | 110 KB | 88% |
| Home screen screenshot | 896 KB | 97 KB | 89% |
| Birth chart screenshot | 363 KB | 47 KB | 87% |
| Hero video | 1.7 MB (MP4) | 1.4 MB (WebM) | 18% |

---

## PWA Support

`site.webmanifest` enables basic PWA capabilities:
- App name: "Om.AI - Vedic Astrology & Spiritual Wisdom"
- Display: standalone
- Theme color: `#D97757`
- Icons: 192x192, 512x512
- Linked from all pages via `<link rel="manifest">`

No service worker currently implemented.

---

## External Dependencies (CDN)

| Resource | CDN | Version |
|----------|-----|---------|
| Bootstrap CSS | jsdelivr.net | 5.3.0 |
| Bootstrap JS | jsdelivr.net | 5.3.0 |
| Font Awesome | cdnjs.cloudflare.com | 6.4.0 |
| DM Serif Display | fonts.googleapis.com | — |
| Source Sans 3 | fonts.googleapis.com | — |
| Google Analytics | googletagmanager.com | GA4 |

### npm Dependency

- `video.js@^8.17.3` — Used only for hero video on index.html

---

## Deployment

1. Push to `main` branch
2. GitHub Pages automatically deploys from root
3. Custom domain `omai.app` configured via `CNAME` file
4. Blog articles auto-published daily via GitHub Actions cron job
