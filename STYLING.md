# Om.AI Web — UI/UX Styling Guide

**This repo = the consumer MVP** (`ask.html` on omai.app). The Pro console
(`om-ai-pro/index.html`, pro.omai.app) shares this exact design language — a
mirror of this file lives in that repo. Keep the two in sync.

The **mobile app** (`om/om1/src`) is the canonical UX reference for content,
flows, and vocabulary. The web surfaces add a few patterns the app doesn't have
(collapsible rail sidebar, logo mark in the rail) — those deviations are
intentional and documented here **with the reason**, so we don't re-litigate
them every session.

> Codified 2026-06-25 after a full ChatGPT/Claude-style pass across both web
> surfaces. If you're about to "fix" something below to match the app, read the
> rationale first.

---

## Principles

- **Seamless surfaces.** Header, chat content, drawer/rail, and composer all use
  the SAME background (`--bg`). No borders/dividers between header↔content or
  composer↔content. Only the input box is a distinct elevated field
  (`--input-bg` + a subtle border). Mirrors ChatGPT/Claude.
- **Flat, not boxy.** No boxes/borders around interactive rows where a flat row +
  hover suffices — New chat, starter suggestion chips, drawer items. Hover = a
  subtle background highlight, not a border.
- **Small icons.** Drawer/rail icons ~18px (not ~24). Outline style,
  accent-stroked (`stroke-width ~1.7`).
- **App = UX reference, not pixel reference.** Match the app's content/flows;
  deviate only where a web-specific pattern (the rail) demands it.

## Typography (shared type scale)

- Base: `html { font-size:15px }` — matched to Claude/GPT's compact chrome
  (dropped from 17px on 2026-06-25; 17px + hot tokens read oversized). All text
  uses the `--fs-*` token scale (rem, relative to the 15px base) — **don't
  hardcode one-off `rem`/`px` for text**:
  `--fs-xs:.8rem` (12px) · `--fs-sm:.87rem` (13px) · `--fs-md:1rem` (15px) ·
  `--fs-lg:1.13rem` (17px) · `--fs-xl:1.33rem` (20px) · `--fs-2xl:1.53rem`
  (23px) · `--fs-3xl:1.87rem` (28px).
- Role → token: **section labels** `--fs-xs` (12px, weight 600, .06em);
  **sidebar / nav / chat rows** `--fs-sm` (13px); **body / chat message +
  inputs/composer** `--fs-md` (15px — don't go lower: iOS zoom + readability);
  **buttons** `--fs-sm`/`--fs-md`; **table cell** `--fs-sm` / **header**
  `--fs-xs`; **modal title** `--fs-2xl`.
- Set **explicit** sizes on chrome (rows, labels, buttons) so they don't ride the
  root large — that inheritance was what made the old 17px feel big.
- **Mode toggle** (Personal/Relationship · Individual/Matching): ~30px tall,
  `--fs-sm` (13px), weight 600, padding `.3rem .8rem`, radius 8px; mobile
  (<560px) `--fs-xs` (12px), padding `.28rem .5rem`.
- Both surfaces run the SAME base + tokens (Claude/GPT-matched), so a role renders
  at the same px on MVP and Pro. Keep it that way.

## Sidebar / Drawer — rail-collapse

- The drawer is **always on screen on desktop**: **collapsed = a 56px icon rail**
  (still shows the actions as icons), **expanded = 260px** with labels. Never
  fully hidden on desktop. Mobile keeps a slide-in overlay + dim backdrop.
- **The toggle lives ON the drawer** (a panel/collapse icon at the top), not a
  header hamburger. The header hamburger is **hidden on desktop** and exists only
  on mobile to open the overlay. (Desktop breakpoint here: `min-width:900px`;
  Pro uses `min-width:761px`.)
- **Logo MARK** (the Om symbol) at the drawer's top-left — NOT the "Om.AI"
  wordmark. The mark stays recognizable in the 56px rail; a wordmark can't
  collapse. (The app uses the wordmark because it has no rail — that's fine.)
  Pro adds a "PRO" tag next to the mark.
- **Primary action top, utilities bottom.** New chat at the top; the
  account/utility rows (Birth Details, Edit Profile, Get Premium, Settings)
  pinned to the bottom (`margin-top:auto`). The **scrollable middle** (chat
  history) is the only scrolling region — top and bottom stay fixed.
- In the rail, labels + the scrollable list hide; icons center.
- **New chat = pencil/compose icon** (box-with-pencil), as a **flat row** (no
  border box).
- `:not(.open)` / `.open` carry the rail/expanded widths (higher specificity than
  the base `.drawer` width, so source order can't override them).

## Header

- Seamless: `background:var(--bg)`, `border-bottom:transparent`.
- The **mode toggle** (Personal/Relationship; Individual/Matching on Pro) is
  centered in the header.
- Sheet/overlay screens use a **centered title** + a top-right **✕ close** — a
  back-chevron `←` is only for genuine in-flow navigation (settings sub-pages,
  signup↔signin), never for dismissing an overlay.

## Composer / footer

- Seamless: the composer bar = content background, no top border. ONLY the
  textarea is the distinct elevated field. No "New chat"/extra controls under the
  input — those live in the drawer.

## Overlays — modals vs sheets

- **Centered modal popups** (`.modal-overlay` + `.modal-card.modal-lg`):
  Settings, Profile, Edit-birth, Paywall. Dismiss via top-right ✕, Esc, or
  backdrop click; the chat stays visible (dimmed) behind; card scrolls, capped
  ~86vh. They **replace** (not stack on) each other — e.g. opening the paywall
  closes settings/profile first, so there's never a true modal-in-modal.
- **Bottom sheets** (slide up from the bottom, `.view.sheet`): Birth Chart,
  Compatibility report — mirror the app's `forModalPresentationIOS`. Same ✕-close
  top-right for consistency.
- A drawer action taken while a sheet is open closes the sheet first (sheets are
  z-index 60, modals 50 — otherwise the modal opens hidden behind the sheet).

## Settings (shared layout on both surfaces)

- Centered modal, serif "Settings" header + ✕.
- **Uppercase section labels** (ACCOUNT, SUBSCRIPTION, APP/PREFERENCES,
  HELP & LEGAL).
- **Rows** = accent outline icon + main label + muted sub-label + right chevron
  (`›`), hover-highlighted.
- Theme + Language as **segmented controls** (Light/Dark/System; English/हिंदी).

## Paywall (mirrors the app's AdChoiceModal)

- Personalized **hero** at the top (dasha/transit window).
- **Uniform single-line plan rows** (title + price) — no per-plan subtext; equal
  height via flex (price strikethrough is inline, not block).
- **CTA**: "Get Unlimited" (subscription) / "Get Questions" (one-time pack — MVP
  only; Pro is subscription-only).
- **Contextual billing line**, centered, just above the trust footer:
  "Auto-renews. Cancel anytime." (sub) / "One-time purchase • No auto-renewal"
  (pack) — switches with the selected plan, like the app's RefundText.
- **Trust footer**: "Secure payment via Razorpay" + "Trusted by N+ seekers · 4.8★".

## Auth

- Google/Apple buttons carry icons: monochrome **Google** glyph (white on the
  terracotta button), white **Apple** glyph (on black). The label sits in a
  `<span>` so the i18n applier can't wipe the icon.

## Loading

- **One** loading state: a clean boot splash (logo + spinner, **no chrome**) that
  stays until the content (chart) is ready, then reveals the app in one go — no
  intermediate chrome/toggle flash. `<body>` starts `chrome-off`; `show('chat')`
  is called only after the chart loads.
- Bot response loader = the app's `InlineLoader` (a small accent spinner + a
  **typewriter** cycling the app's astrology messages — "Studying your Kundali…",
  "Analyzing the Grahas…", … — 18ms/char, 1.5s pause, shuffled).

## i18n

- EN + Hindi via a `t(key)` + dictionary; `data-i18n` / `data-i18n-ph` applied on
  load and on language change. The Language toggle changes the **whole UI** AND
  the reply language sent to the backend.
- **Brand astrology vocabulary stays identical in both languages** — do NOT
  translate/transliterate: Manglik, dasha, nakshatra, lagna, navamsa, Ashtakoot,
  Bhakoot, Rahu, Ketu, planet names. (The consumer "no-fly" jargon list —
  exalted/debilitated/malefic/benefic/bindus/dusthana/trikona/vargottama — is a
  separate concern; those are avoided in consumer copy but kept in Pro's
  astrologer copy.)

## Chart specifics

- North-Indian diamond kundali, square, fills the column.
- **Dignity legend** colors: Lagna = accent, Exalted = green, Friendly/Own = blue,
  Neutral = gray, Debilitated = red, Enemy = orange. Planets are colored by these.
- Houses are tappable → a "Tap any house…" hint + hover highlight signal it.

## Don't-revert list (web-specific deviations from the app, on purpose)

- Logo **mark** in the drawer (app uses the wordmark — app has no rail).
- **Rail-collapse** sidebar with the toggle on the drawer (app uses a plain
  slide drawer).
- Seamless header/composer (same as the app's intent; keep it).
