# Om.AI Landing Page Audit Findings

**Date:** 2026-03-31
**Scope:** SEO, Performance, Accessibility, Security, Responsiveness, Links, Content, Analytics, Legal/Compliance
**Domain:** omai.app (GitHub Pages, static HTML)

---

## 1. Legal / Compliance

### 1.1 No Cookie Consent Banner
- **Severity:** Critical
- **Files:** All pages (site-wide)
- **Description:** The site loads Google Analytics (`G-EPT0NFE087`), Google Ads conversion tracking (`AW-16691222744`), Meta Pixel (`819993440663760`), and Hotjar (`5152259`) -- all of which set non-essential tracking cookies. Under GDPR and ePrivacy regulations, these scripts must not fire until the user provides explicit opt-in consent. As of 2025, Google and Microsoft have begun disabling conversion tracking for non-compliant accounts. The site has no cookie consent banner, no consent management platform (CMP), and no mechanism to block these scripts before consent.
- **Suggested fix:** Implement a cookie consent banner (e.g., CookieYes, Osano, or a custom solution) that blocks GA, Meta Pixel, and Hotjar scripts until the user opts in. Use Google Consent Mode v2 for GA/Ads. For Meta, implement Meta Consent Mode. Maintain consent records for at least 5 years per GDPR requirements.

### 1.2 Google Apps Script Endpoints Exposed in Client-Side Code
- **Severity:** Medium
- **Files:** `feedback.html` (line ~437), `unsubscribe.html` (line ~321)
- **Description:** Form submissions POST directly to Google Apps Script endpoints with full URLs visible in the HTML source. These endpoints are publicly accessible and have no CSRF protection, no rate limiting, and no CAPTCHA. Anyone can submit arbitrary data or spam these endpoints.
- **Suggested fix:** Add reCAPTCHA or hCaptcha to both forms. Consider proxying submissions through a backend endpoint that can rate-limit and validate.

---

## 2. SEO

### 2.1 Missing Twitter/X Card Meta Tags
- **Severity:** Medium
- **Files:** All pages (site-wide)
- **Description:** No page on the site includes `twitter:card`, `twitter:title`, `twitter:description`, or `twitter:image` meta tags. When links are shared on X/Twitter, they will fall back to Open Graph tags but may not render optimally (e.g., no large image card).
- **Suggested fix:** Add at minimum to each page:
  ```html
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="...">
  <meta name="twitter:description" content="...">
  <meta name="twitter:image" content="...">
  ```

### 2.2 Inconsistent Rating Numbers (Structured Data vs. Visible Content)
- **Severity:** High
- **Files:** `index.html`
- **Description:** The JSON-LD structured data declares `"ratingValue": "4.8"` and `"reviewCount": "2500"` (line 85-86). The visible page content shows "4.5 / 5" (line 862) and "from 20,000+ reviews" (line 863). The hero section also shows "4.5 Rating" (line 440). The meta description says "4.8-star rated" (line 9). These inconsistencies can trigger Google's structured data spam policies and result in rich snippet removal.
- **Suggested fix:** Unify all rating and review count numbers across structured data, meta description, and visible page content to reflect actual current values.

### 2.3 Stale `softwareVersion` in Structured Data
- **Severity:** Low
- **Files:** `index.html` (line 81)
- **Description:** The MobileApplication schema has `"softwareVersion": "1.0"` which is likely outdated. Google may display this version in search results.
- **Suggested fix:** Update to the current app version, or remove the field if keeping it current is impractical.

### 2.4 Duplicate URLs in sitemap.xml
- **Severity:** Medium
- **Files:** `sitemap.xml`
- **Description:** Three URLs appear twice in the sitemap with different `<lastmod>` dates:
  - `solar-eclipse-august-2026.html` (lines ~324 and ~585)
  - `saturn-retrograde-july-2026.html` (lines ~310 and ~591)
  - `gana-matching-compatibility.html` (lines ~471 and ~597)
- **Suggested fix:** Remove the duplicate entries, keeping only the one with the most recent `<lastmod>`.

### 2.5 Missing `hreflang="x-default"` Tag
- **Severity:** Low
- **Files:** `index.html`, `ai-astrology-chat.html`, `free-kundli-online.html`, and their `/hi/` counterparts
- **Description:** Pages with `hreflang="en"` and `hreflang="hi"` alternates are missing the `hreflang="x-default"` tag. Google recommends including x-default to specify the fallback page for users whose language is not explicitly covered.
- **Suggested fix:** Add `<link rel="alternate" hreflang="x-default" href="https://omai.app/">` to pages that declare hreflang alternates.

### 2.6 Pages Missing from sitemap.xml
- **Severity:** Medium
- **Files:** `sitemap.xml`
- **Description:** Several indexable pages are not included in the sitemap:
  - `delete-account.html` (has `noindex` so this is correct)
  - `unsubscribe.html` (should be in sitemap if indexed)
  - `daily-horoscope/index.html` (redirect -- acceptable to omit)
  - Zodiac pages are included, but the Hindi pages (`/hi/ai-astrology-chat.html`, `/hi/free-kundli-online.html`) are included, which is good
- **Suggested fix:** Verify whether `unsubscribe.html` should be indexed (it has no `noindex` meta tag currently). If yes, add to sitemap. If no, add `<meta name="robots" content="noindex">`.

### 2.7 SearchAction Target URL Has No Matching Functionality
- **Severity:** Low
- **Files:** `index.html` (line 138)
- **Description:** The WebSite schema declares a SearchAction with target `https://omai.app/blog/?q={search_term_string}`, but the blog index page (`/blog/index.html`) does not have a search query parameter handler. The `?q=` parameter will be silently ignored.
- **Suggested fix:** Either implement client-side search filtering on the blog index page that reads the `q` parameter, or remove the SearchAction from the structured data to avoid misleading search engines.

---

## 3. Performance

### 3.1 Logo PNG Served Without `<picture>` WebP Fallback on Many Pages
- **Severity:** High
- **Files:** `feedback.html`, `unsubscribe.html`, `support.html`, `privacy-policy.html`, `terms-of-service.html`, `refund-policy.html`, `delete-account.html` (and most non-index feature pages like `horoscope.html`, `panchang.html`, `gita.html`, etc.)
- **Description:** The `index.html` correctly uses `<picture>` with a WebP source for the logo. However, most other pages serve `logo.png` (368 KB) directly without the `<picture><source srcset="/assets/logo.webp">` wrapper. The WebP version is only 48 KB -- an 87% savings per page load. The logo appears twice per page (navbar + footer), so each of these pages downloads ~736 KB of unnecessary PNG data.
- **Suggested fix:** Wrap all `<img src="/assets/logo.png">` elements in `<picture>` tags with a WebP source, matching the pattern already used in `index.html`.

### 3.2 Large Screenshot PNG Fallbacks
- **Severity:** Medium
- **Files:** `index.html` (lines 598-600), `assets/screenshots/`
- **Description:** Screenshot images have WebP versions (47-118 KB) but the PNG fallbacks are very large: `home-screen.png` (876 KB), `ai-chat.png` (632 KB), `birth-chart.png` (356 KB). While modern browsers will use WebP, older browsers or crawlers will download the full PNGs. The PNGs could be compressed further.
- **Suggested fix:** Compress the PNG fallbacks or consider only serving WebP (browser support is now >97%).

### 3.3 CSS Cache-Busting Version Mismatch Across Pages
- **Severity:** Medium
- **Files:** Multiple pages
- **Description:** `index.html` references `styles.min.css?v=65`, but most other pages reference `styles.min.css?v=64`. This means after a CSS update, most pages will serve stale cached CSS while the homepage gets the new version. Pages with `v=65`: `index.html`, `hi/index.html`, `compare.html`. All others: `v=64`.
- **Suggested fix:** Use a build script or find-and-replace to ensure all pages reference the same CSS version number when styles are updated.

### 3.4 Large index.html File Size (117 KB)
- **Severity:** Low
- **Files:** `index.html`
- **Description:** The homepage is 117 KB of HTML, largely due to inline demo chat data (long `data-a` attributes with full AI response text on lines 757-763), inline FAQ content, and 15 testimonial cards. This is above the 50-80 KB ideal for fast TTFB and parsing.
- **Suggested fix:** Consider moving demo chat Q&A data to a separate JSON file loaded asynchronously. The testimonials could be reduced to 6-8 with the rest loaded on scroll.

### 3.5 Favicon PNGs Not Optimized
- **Severity:** Low
- **Files:** `assets/favicon/`
- **Description:** The `favicon-512x512.png` is 167 KB and `favicon-192x192.png` is 30 KB. These are referenced by the manifest and every page. Favicon PNGs can typically be compressed to half their size without visible quality loss.
- **Suggested fix:** Run the favicon PNGs through an optimizer (e.g., `pngquant`, `optipng`, or Squoosh).

---

## 4. Accessibility

### 4.1 Skip-to-Content Link Missing on Non-Index Pages
- **Severity:** Medium
- **Files:** All pages except `index.html` and `hi/index.html`
- **Description:** The homepage has a "Skip to main content" link (`<a href="#main-content" class="skip-to-content">`), but no other page has this. Additionally, no page other than `index.html` wraps its content in a `<main>` landmark element. Screen reader users and keyboard navigators on feature pages, blog posts, legal pages, etc. cannot skip past the repeated navigation.
- **Suggested fix:** Add a skip-to-content link and a `<main>` element to all pages.

### 4.2 Footer Social Links Missing `aria-label` and `rel` on Non-Index Pages
- **Severity:** Medium
- **Files:** `feedback.html` (lines 289-293), `unsubscribe.html` (lines 224-228), `support.html`, `privacy-policy.html`, `terms-of-service.html`, `refund-policy.html`, `delete-account.html`
- **Description:** The footer social media links on the homepage have `aria-label="Follow us on Facebook"` and `rel="noopener noreferrer"`. On most other pages, these same links are missing both attributes. The icon-only links have no accessible name, making them invisible to screen readers.
- **Suggested fix:** Add `aria-label` and `rel="noopener noreferrer" target="_blank"` to all footer social links site-wide.

### 4.3 `target="_blank"` Links Missing `rel="noopener noreferrer"` on feedback.html
- **Severity:** Low
- **Files:** `feedback.html` (lines 266, 269)
- **Description:** The "Review on App Store" and "Review on Play Store" links in the success message use `target="_blank"` without `rel="noopener noreferrer"`. This is a minor security concern (reverse tabnapping) in older browsers.
- **Suggested fix:** Add `rel="noopener noreferrer"` to these links.

### 4.4 Color Contrast: `text-white-50` Footer Links on Dark Background
- **Severity:** Low
- **Files:** All pages with footer (Bootstrap's `text-white-50` = `rgba(255,255,255,0.5)`)
- **Description:** Footer links use Bootstrap's `text-white-50` class, which renders at 50% opacity white. Against the dark footer background (`--bg-emphasis: #141413`), this produces a contrast ratio of approximately 4.2:1 for normal text. WCAG AA requires 4.5:1 for normal-sized text. The links are small text (likely under 18px), so they fail AA.
- **Suggested fix:** Override `text-white-50` in the footer with a lighter color (e.g., `rgba(255,255,255,0.65)` or `#a8a8a8`) to meet the 4.5:1 threshold.

### 4.5 "From the Blog" Section Outside `<main>` Landmark
- **Severity:** Low
- **Files:** `index.html` (lines 1294-1338)
- **Description:** The `</main>` closing tag is at line 1294, but the "From the Blog" section (lines 1296-1338) sits between `</main>` and `<footer>`. This content is outside any landmark region, making it harder for screen reader users to discover.
- **Suggested fix:** Move `</main>` to after the "From the Blog" section (before the footer).

---

## 5. Security

### 5.1 No Content Security Policy (CSP) Headers
- **Severity:** Medium
- **Files:** Site-wide (GitHub Pages deployment)
- **Description:** No CSP meta tag or HTTP header is present on any page. The site loads scripts from multiple external origins (googleapis.com, cloudflare.com, cdn.jsdelivr.net, connect.facebook.net, static.hotjar.com, googletagmanager.com, script.google.com). Without a CSP, if any of these CDNs is compromised, malicious scripts could execute freely.
- **Suggested fix:** Add a `<meta http-equiv="Content-Security-Policy">` tag with a policy that whitelists only the required script/style origins. Since this is GitHub Pages and HTTP headers cannot be set, the meta tag approach is the only option.

### 5.2 `firebase-debug.log` Present in Repository Root
- **Severity:** Low
- **Files:** `firebase-debug.log` (90 KB)
- **Description:** A Firebase debug log file is present in the project root. While it is not tracked by git and the `.gitignore` covers `*.log`, the file exists in the working directory. If accidentally committed, it could expose internal infrastructure details. Additionally, since this is a static site served by GitHub Pages, if the file were committed it would be publicly accessible at `https://omai.app/firebase-debug.log`.
- **Suggested fix:** Delete the file and ensure `*.log` remains in `.gitignore` (it currently is).

### 5.3 innerHTML Usage With User-Facing Data
- **Severity:** Low
- **Files:** `panchang.html`, `rahu-kaal-today.html`, `horoscope.html`, `gita.html`
- **Description:** These pages use `innerHTML` to render dynamic content fetched from the backend API. However, they do implement an `esc()` sanitization function (`function esc(s) { ... d.textContent = s; return d.innerHTML; }`) that properly escapes HTML entities before insertion. The risk is low as long as the `esc()` function is consistently used for all user-controllable or API-sourced data.
- **Suggested fix:** No immediate action required. The existing `esc()` function is a sound approach. Just ensure it is used for all dynamic content, including any future additions.

---

## 6. Content / Data Consistency

### 6.1 Rating Mismatch Between Structured Data and Visible Content
- **Severity:** High
- **Description:** (Same as SEO finding 2.2.) Structured data claims 4.8 stars / 2,500 reviews. Page content shows 4.5 stars / 20,000+ reviews. The meta description says "4.8-star rated." This needs to be unified to one set of real numbers.

### 6.2 "From the Blog" Section Placed After `</main>` Close
- **Severity:** Low
- **Files:** `index.html` (line 1294 vs 1296)
- **Description:** (Same as Accessibility finding 4.5.) The blog section is semantically outside the main content area.

---

## 7. Links

### 7.1 App Store Links Are Functional and Properly Attributed
- **Severity:** N/A (No issue)
- **Description:** All Google Play and App Store links are valid, include UTM/attribution parameters for tracking, and use `target="_blank" rel="noopener noreferrer"` on the index page.

---

## 8. Analytics

### 8.1 Analytics Scripts Fire Before Cookie Consent
- **Severity:** Critical
- **Description:** (Same as Legal finding 1.1.) Google Analytics, Google Ads, Meta Pixel, and Hotjar all load without waiting for user consent. This is the primary analytics issue and is covered in the Legal/Compliance section.

### 8.2 Meta Pixel and Hotjar Deferred But Not Consent-Gated
- **Severity:** High
- **Files:** `index.html` (lines 276-310), `hi/index.html`
- **Description:** The Meta Pixel and Hotjar scripts are deferred by 2-3 seconds after page load (which is good for performance), but they are only present on the homepage and Hindi homepage -- not on other pages. More importantly, the deferral is purely for performance; there is no consent check before these scripts execute.
- **Suggested fix:** Wrap all tracking script initialization in a consent check. If consent is granted, fire immediately (or with the existing delay). If not, do not fire until consent is obtained.

---

## 9. Responsiveness

### 9.1 Hero Trust Badge Font Size Inflated on Mobile
- **Severity:** Low
- **Files:** `styles/styles.css` (lines 363-368)
- **Description:** The `.hero-trust` element has a mobile override at `@media (max-width: 576px)` that sets `font-size: 1.5rem`. On desktop, it is `0.85rem`. This makes the trust badges ("4.5 Rating | 20K+ Downloads | 100% Private") appear disproportionately large on small screens -- nearly twice the size of surrounding body text.
- **Suggested fix:** Reduce the mobile font-size to something like `0.8rem` or `0.85rem`, matching or slightly below the desktop size.

---

## Summary by Severity

| Severity | Count | Key Items |
|----------|-------|-----------|
| Critical | 2 | Missing cookie consent banner (1.1), Analytics firing before consent (8.1) |
| High | 4 | Rating data mismatch (2.2/6.1), Logo PNG without WebP on most pages (3.1), Meta Pixel not consent-gated (8.2) |
| Medium | 7 | No Twitter cards (2.1), Duplicate sitemap entries (2.4), Pages missing from sitemap (2.6), CSS version mismatch (3.3), Skip-to-content missing (4.1), Social links missing aria-label (4.2), No CSP (5.1), Form endpoints without protection (1.2) |
| Low | 8 | Missing x-default hreflang (2.5), SearchAction non-functional (2.7), Large index.html (3.4), Favicon optimization (3.5), Blog section outside main (4.5/6.2), text-white-50 contrast (4.4), target_blank missing rel (4.3), Hero trust font size (9.1), Stale softwareVersion (2.3) |

---

## What Is Already Done Well

- **Structured data:** MobileApplication, WebSite, FAQPage, BreadcrumbList, and Organization schemas are all present and well-formed on the homepage.
- **Performance optimization:** Non-blocking CSS loading via `preload`/`onload` pattern, preconnect hints, lazy-loaded video sources, deferred third-party scripts, `fetchpriority="high"` on LCP image.
- **Image optimization:** `<picture>` elements with WebP sources for screenshots on the homepage, `loading="lazy"` and `decoding="async"` on below-fold images.
- **Accessibility basics:** `aria-hidden="true"` on decorative icons throughout, keyboard focus styles defined in CSS, `prefers-reduced-motion` respected in JS animations, proper `aria-expanded` and `aria-controls` on FAQ toggles.
- **SEO fundamentals:** Canonical URLs on all pages, proper `hreflang` for Hindi versions, comprehensive sitemap, descriptive meta descriptions, proper heading hierarchy (single H1 per page).
- **Responsive design:** Fluid typography with `clamp()`, mobile-specific sticky CTA, platform-aware download buttons (iOS/Android detection).
- **Content:** Privacy policy, terms of service, refund policy, delete account, and unsubscribe pages all present.
