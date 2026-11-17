# Hindi tool pages: plan for the next ~10, 2026-11-16

**Owner:** planning approved 2026-11-16 (lever 1 of `om.ai-backend/docs/reads/2026-11-16_ORGANIC_INSTALLS.md`). Nothing built or pushed. Each build, backend deploy and landing push needs its own yes, plus a CHANGES.csv row at push.

## Verdict
- **Build first, landing only:**
  - a Manglik check (with one small backend route);
  - a Shani dhaiya check;
  - a working Mahadasha tool on the existing dasha page;
  - a rashi/nakshatra/lagna finder.
- **Engine and demand:** all four reuse code the app already runs, and each has measurable demand. Manglik and dhaiya are each about the size of "meri shadi kab hogi" or larger in Google Trends.
- **New "kab" timing pages (family, travel, remarriage, court):** the engine supports them, but search demand is near zero, so they come last.
- **Sizing (corrected 2026-11-16, main session):** the Jul 1-Nov 14 averages below undercount the newer tools. Current GSC clicks a day, Nov 1-14 (url table, WEB): shadi 153, ghar 94, bacha 46, naukri 31 (324 total, matching the organic read's 336).
  - Ten new tools at ~30-80 clicks a day each once ranked, with ~10% of web clicks becoming Android installs, is about **+30-80 installs a day after a ramp of months**: between the organic read's +80-150 and the first draft's +10-40.
  - First draft's figures, kept for the record: Jul 1-Nov 14 averages shadi 107, ghar 22, naukri 17, bacha 2.4 → +10-40.
  - The organic read and growth model should carry that figure.

## What exists (origin/main, landing 3ed1818)
- **Working Hindi tools:**

  | Page | Backend route |
  |---|---|
  | shadi-kab-hogi | `/api/public/marriage-window` |
  | shadi-kisse-hogi | `/api/public/marriage-window` |
  | naukri-kab-milegi | `/api/public/career-window` |
  | paisa-kab-aayega | `/api/public/wealth-window` |
  | ghar-kab-banega | `/api/public/property-window` |
  | bacha-kab-hoga | `/api/public/children-window` |
  | college-kab-milega | `/api/public/education-window` |
  | kundli-milan | `/api/public/kundli-milan` |
  | sade-sati | `/api/public/kundli` |
  | free-kundli-online and home | `kundli-tool.js` on `/api/public/kundli` |
  | your-2027 | `/api/public/year-forecast` |

- **Pitch pages with inputs but no on-page result:** hi/dasha-calculator forwards to ask.html.
- **Text only:** rahu-kaal-today and panchang (Delhi-only, never ranked).
- **Public routes, all on `makePublicWindowRoute`:**
  - marriage, career, wealth, property, children and education windows;
  - chart-preview (lagna, Moon rashi/nakshatra, Sun rashi);
  - kundli (lagna, planets, Moon rashi/nakshatra/pada, current maha + antardasha, sade sati or dhaiya and the next sade sati);
  - kundli-milan;
  - year-forecast.
- **Engine areas the app's picker already has** (`LIFE_AREA_CONFIG`):
  - 5-year search: in_laws, spouse_career, child_marriage, child_children, child_career, sibling_marriage, sibling_career, marriage, career, wealth, education, children, property, legal.
  - 2-year search: father, mother, siblings, health, travel, spirituality, obstacles.
  - A remarriage mode adds the 2nd house.
- **Dosha rulings:** `buildDoshaVerdicts` (`jobs/dosha-verdict-service.js`) covers Manglik (BPHS Ch.80 Sl.47, houses 1/4/7/8/12 with the benefic cancellation), Kaal Sarp, Pitru, Grahan, Guru-Chandal and Kemdrum. Never `remedy-service` (it carries Lal Kitab).

## Demand evidence
- **GSC** (site queries Jul 1-Nov 14, `om.ai-backend/docs/reads/queries/2026-11-16_kab_tools/gsc_intents.sql`): this only sees queries we already appear for.
  - shani cluster 28.8k impressions (position 7.2, mostly English transit queries);
  - lagna 11.8k (6.6);
  - government-job "kab lagegi" 11.6k, already landing on naukri at 2.9;
  - nakshatra 5.3k (6.3);
  - dasha 4.4k (7.9);
  - child's marriage 230 with no page;
  - remarriage 48, travel 6.
- **Google Trends India,** 12 months, exact phrase, as a multiple of "meri shadi kab hogi" (`trends.sh`):
  - **Hinglish:**
    - pitra dosh ~6x;
    - kaal sarp dosh ~4.7x;
    - manglik dosh ~2.3x;
    - shani ki dhaiya ~1.0x;
    - meri rashi kya hai ~0.5x;
    - mahadasha calculator ~0.2x ("mahadasha" alone ~28x, mostly "what is");
    - love marriage or arrange ~1.25x.
  - **Devanagari:** मांगलिक दोष ~0.2x and काल सर्प दोष ~0.1x of "मेरी शादी कब होगी".
  - **Near zero:** beti ki shadi kab hogi, dusri shadi kab hogi, videsh yatra kab hogi / videsh kab jaunga, pati ki naukri, promotion kab hoga, court case kab khatam hoga, sarkari naukri kab lagegi.
  - **Daily utilities dwarf all of it:** choghadiya, aaj ka panchang and rahu kaal today are each far above the anchor.
- Exact-phrase ratios understate phrase families: the shadi family spans 785 query variants in GSC. Read them as rank order, not volume.

## Ranked candidates

| # | Tool (Hindi page) | Target queries | Demand | Engine source | Build | Risk | Tag |
|---|---|---|---|---|---|---|---|
| 1 | क्या मैं मांगलिक हूं? (manglik-check) | manglik hu ya nahi, manglik dosh, मांगलिक दोष | Trends 2.3x Hinglish | `buildDoshaVerdicts` manglik, already run per side in kundli-milan | Backend: new `/api/public/dosha-check` on the factory (route + payload, no rule change) + landing page | AstroSage/Prokerala own the head terms; copy must not fear-sell. The honest "present but cancelled" verdict is the differentiator. Fits BRAND's "doshas only as a marriage angle" | NEW (SEO plan 10-26 listed doshas as ready to reuse, never built) |
| 2 | शनि की ढैय्या (shani-dhaiya) | shani ki dhaiya, shani dhaiya kab khatam hogi | Trends ~1x; Shani is our cheapest ad per purchase (BRAND) | `/api/public/kundli` already returns `dhaiya` | Landing only | Overlaps sade-sati; link both ways, don't duplicate text | NEW |
| 3 | मेरी महादशा कौन सी चल रही है (working tool on hi/dasha-calculator) | mahadasha calculator, current dasha, महादशा | GSC dasha 4.4k impressions at 7.9; head terms ~0 since Aug | `/api/public/kundli` current maha + antardasha with dates. A full sequence needs a payload field, no engine change | Landing only (v1) | Head terms never ranked (memory `project_dasha_calculator_seo_readout`); a real on-page result is what rivals have | SHIPPED page, NEW tool |
| 4 | मेरी राशि, नक्षत्र और लग्न (rashi-nakshatra) | meri rashi kya hai, mera nakshatra, lagna kaise jane | Trends 0.5x; GSC nakshatra 5.3k, lagna 11.8k | `/api/public/chart-preview` or kundli | Landing only | Rashi-by-name queries are a different intent (no birth time); answer by DOB only | NEW (SEO plan 10-26: "chart-preview clone, S") |
| 5 | काल सर्प दोष है या नहीं (kaal-sarp-check) | kaal sarp dosh, काल सर्प दोष | Trends 4.7x Hinglish, 0.1x Devanagari | `buildDoshaVerdicts` Kaal Sarp, same route as #1 | Landing (route from #1) | Not a marriage angle (BRAND), fear-heavy, and none of the classical books in `om.ai-backend/docs/research/books/` mentions Kaal Sarp (checked 11-16); the engine rules it but the classical claim is thin. **Owner decision** | NEW |
| 6 | पितृ दोष (pitra-dosh-check) | pitra dosh | Trends ~6x | `buildDoshaVerdicts` Pitru (Sun with Saturn/Rahu, or Saturn and Rahu in the 9th) | Landing (route from #1) | Highest fear and remedy-selling pull; the engine rule has no verse cite in code, so the classical basis must be checked before any copy. **Owner decision**; default skip | NEW |
| 7 | बेटी/बेटे की शादी कब होगी (bachche-ki-shadi) | beti ki shadi kab hogi, mere bete ki shadi kab hogi | GSC 230 with no page; Trends ~0 | `child_marriage` (11th + 5th, 5-year search) via `areaWindows` | Backend route + `test-window-app-parity.js` cases + landing | Low volume, but it's the kab long tail where we rank 2-3; parents are an older, paying audience | NEW |
| 8 | विदेश यात्रा कब होगी (videsh-yatra) | videsh yatra kab hogi, videsh kab jaunga | ~0 | `travel` (9th + 12th, 2-year search in the app) | Backend route + parity + landing | Must keep the app's 2-year horizon; low demand | NEW |
| 9 | दूसरी शादी कब होगी (dusri-shadi) | dusri shadi kab hogi | GSC 48, Trends ~0 | marriage window in remarriage mode | Backend route param + parity + landing | Sensitive; tiny | NEW |
| 10 | कोर्ट केस का फैसला कब (court-case) | court case kab khatam hoga | ~0 | `legal` (6th + 7th) | Backend route + parity + landing | Legal-outcome expectations; give dates only, never a verdict | NEW |

**Not building (tagged):**
- **sarkari naukri page:** REJECTED. Owner 10-12 says it "reads cringe" as a hook; government-job queries already land on naukri-kab-milegi at 2.9, so keep them there inside the page.
- **vivah kahan hoga:** REJECTED 10-26. No spouse-direction output exists, and building one is new astro logic.
- **love vs arranged:** NEW, but there is no engine ruling (only the answer-consistency check in `day-held.js`), so a tool would overclaim.
- **choghadiya / aaj ka panchang / rahu kaal:** a separate bet, not a kab tool. Demand is huge, but the pages are Delhi-only, never ranked (rahu kaal at 42), Drik Panchang owns them, and app intent is low. The day-timing path also carries the open Gulika bug. Revisit only as its own plan.

## Rules every page follows
- **Engine frozen** (`docs/ENGINE_FREEZE.md`): routes and payloads only, no rule or window change. New window routes reuse `areaWindows` with the app's `LIFE_AREA_CONFIG` houses and get `test-window-app-parity.js` cases, because public calculators must match the picker. The dosha route wraps the same `buildDoshaVerdicts` the chat uses, with a test pinning equality.
- **Crawlable result:** today results render client-side into a hidden div that crawlers can't read (SEO plan 10-26). Each page ships a static worked example (a fixed sample chart rendered at build time, like home's sample kundli) and a short classical explanation with its verse cite. No thin text pages; the March bulk pages were noindexed 10-26.
- **Copy:** read BRAND.md.
  - Hindi pages stay Hindi.
  - Honest, never fear-selling; no "blocked" hooks.
  - Remedies never name Lal Kitab unless labelled.
  - Manglik counts houses 1/4/7/8/12 from the lagna (owner 10-26).
  - Claims only what the engine computes; cite book and chapter.
- **Form-above-fold** on the Hindi kab pages waits for the hi_android_cta readout (11-20) and applies to new pages too.
- **Surface parity:** the public calculators are a surface. The release notes for the dosha route record astro, compat, Pro and horoscope as unaffected (read-only reuse).
- **At push:** CHANGES.csv row (guard metric `manual:GSC clicks on the new URL` + the page's Android installs), sitemap lastmod, IndexNow ping.

## Order and effort
1. **Wave A, landing only (~1.5 days):** dhaiya (#2), Mahadasha tool (#3), rashi/nakshatra/lagna (#4). No backend deploy.
2. **Wave B (~1 day backend + 0.5 day per page):** the `/api/public/dosha-check` route (one backend release), then Manglik (#1). Kaal Sarp (#5) and Pitru (#6) only on owner yes.
3. **Wave C (~0.5-1 day each):** family/travel kab routes (#7-#10). Start only if Wave A/B pages show GSC clicks after 4-6 weeks.

**Read after each wave:** GSC clicks and position per new URL at 2 and 6 weeks, Android installs from omai.app (GA4 web_referral), and whether Google indexes the new pages at all while the domain is still down (impressions ~5k a day vs ~30k before 10-19).

## Owner decision, 2026-11-16
Build plan = Manglik check, Shani dhaiya, Mahadasha tool, rashi/nakshatra/lagna finder, plus a **factual Kaal Sarp check**: present/absent straight from `dosha-verdict-service` (all seven planets on one side of the Rahu-Ketu axis), labelled popular tradition (not in BPHS), no fear copy, no remedy upsell. Pitra dosh: not built. Each build, deploy and landing push needs its own owner yes; read om-ai-brand/BRAND.md before copy; public routes must stay in parity with the app.
