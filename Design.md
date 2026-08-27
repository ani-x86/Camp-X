# Design.md
## Campus Marketplace — Visual Design System

This document defines the look, feel, and voice of the Campus Marketplace app so it reads as a product built by a serious frontend team — not a generic template. It covers color, type, layout, responsiveness, and writing tone. Every screen (Web + Android) should be built against these tokens, not one-off values.

---

## 1. Design Direction

**Concept:** *"Verified, not corporate."* The product's whole value is trust between real campus members — so the visual language should feel like a clean, modern student ID system crossed with a well-built fintech app: confident, legible, quietly official. Not playful/toy-like, not cold/enterprise-boring.

**Signature element:** A **verification stamp** motif — a small rounded-square "badge" treatment (used for trust score, PRN-verified tags, and the receipt QR block) that reappears consistently across the app. It's the one recurring visual idea that ties listings, profiles, and receipts together.

**What to avoid:**
- No generic "AI startup" cream-background + terracotta-orange combo
- No stock e-commerce look (rounded pill buttons everywhere, drop shadows on everything)
- No dense broadsheet/newspaper layout — this is a functional marketplace, not an editorial site

---

## 2. Color Palette

| Token | Hex | Usage |
| --- | --- | --- |
| `--color-primary` | `#26365B` (deep indigo-navy) | Headers, primary buttons, nav bar, footer |
| `--color-primary-light` | `#3C517E` | Hover states, secondary emphasis |
| `--color-accent` | `#E8A33D` (warm amber) | CTAs, price tags, highlights, active states |
| `--color-success` | `#2F8F6F` (muted teal-green) | "Verified," "Available," success states |
| `--color-danger` | `#C6493F` | Errors, "Sold," failed payment states |
| `--color-bg` | `#FAFAF9` (soft off-white, not cream) | Page background |
| `--color-surface` | `#FFFFFF` | Cards, modals, input fields |
| `--color-border` | `#E3E3E0` | Dividers, card borders, table lines |
| `--color-text-primary` | `#1B1E24` | Headings, body copy |
| `--color-text-secondary` | `#5D6270` | Captions, metadata, timestamps |

**Color ratio (60-30-10 rule):**
- **60%** — `--color-bg` / `--color-surface` (neutral backgrounds, cards)
- **30%** — `--color-primary` / `--color-text-primary` (navigation, headings, structure)
- **10%** — `--color-accent` (buttons, prices, badges — used sparingly so it stays meaningful)

Amber accent is reserved for things the user can *act on* (buy, sell, confirm) so it never competes with itself on a page.

---

## 3. Typography

| Role | Font | Notes |
| --- | --- | --- |
| **Display** (H1, hero text) | **Space Grotesk** (bold/semibold) | Technical, geometric, confident — used for page titles and dashboard headers only |
| **Body** | **Inter** (regular/medium) | Highly legible at small sizes, standard for modern product UIs, used for all paragraph/UI text |
| **Utility / Data** | **IBM Plex Mono** | PRNs, transaction IDs, receipt numbers, QR captions — gives listings and receipts a "verified record" feel |

### Type Scale (base 16px, 1.25 ratio)

| Level | Size | Weight | Use |
| --- | --- | --- | --- |
| H1 | 40px / 2.5rem | 700 (Space Grotesk) | Page hero headings |
| H2 | 32px / 2rem | 600 | Section headings |
| H3 | 24px / 1.5rem | 600 | Card/subsection titles |
| Body Large | 18px / 1.125rem | 400 | Intro/lead paragraphs |
| Body | 16px / 1rem | 400 | Default UI text |
| Caption | 14px / 0.875rem | 400/500 | Metadata, timestamps, helper text |
| Mono/Data | 14px / 0.875rem | 500 (IBM Plex Mono) | PRN, IDs, prices in receipts |

**Line height:** 1.5 for body text, 1.2 for headings.
**Rule:** Never use more than 3 font weights on one screen. Never center-align paragraphs longer than one line.

---

## 4. Layout & Spacing

- **Spacing scale:** 4px base unit → 4, 8, 12, 16, 24, 32, 48, 64px. All margins/padding pulled from this scale — no arbitrary values.
- **Grid:** 12-column layout on desktop, 4-column on mobile, 24px gutters.
- **Border radius:** 8px standard for cards/buttons, 4px for inputs, 12px only for the verification-badge motif (keeps it visually distinct, not reused everywhere).
- **Shadows:** one subtle elevation level only (`0 1px 3px rgba(0,0,0,0.08)`) for cards — avoid stacked/heavy drop shadows.

---

## 5. Responsive Behavior (Fully Optimized for All Devices)

| Breakpoint | Width | Layout Behavior |
| --- | --- | --- |
| Mobile | < 600px | Single column, bottom nav bar (Android-style), full-width cards, stacked forms |
| Tablet | 600–1024px | 2-column product grid, side nav collapses to icon rail |
| Desktop | > 1024px | 3–4 column product grid, persistent left nav, max content width 1280px centered |

**Rules for every screen:**
- Build **mobile-first**: base styles target the smallest screen, then scale up with `min-width` media queries.
- Touch targets minimum **44×44px** on mobile (buttons, cart icons, nav items).
- Product images use responsive `srcset` — never ship a single oversized image to mobile.
- Forms (login, sell item) never rely on hover-only interactions, since Android/touch has no hover state.
- Text never sets a fixed `px` line-height that breaks with system font-size scaling — use relative units (`rem`/`em`) so accessibility text-scaling works.
- Test every screen at 360px (small Android), 768px (tablet), and 1440px (desktop) minimum before calling a component done.

---

## 6. Components — Style Notes

- **Buttons:** Primary = filled amber (`--color-accent`) with dark navy text for contrast; Secondary = outlined navy; Destructive (e.g. "Cancel Listing") = outlined red. No gradient buttons.
- **Product Card:** White surface, 8px radius, subtle border, product image top, title/price/seller badge below. Price always in `--color-accent`, bold.
- **Verified Badge:** Small rounded-square chip (the signature element), navy background, white checkmark + "PRN Verified" label — appears next to seller name on listings and profiles.
- **Trust Score:** Simple numeric badge (e.g. `4.8`) next to a small filled star, never a 5-star row of empty/filled icons (keeps it clean, not "review site" styled).
- **Receipt/QR block:** Mono font for all IDs, QR code boxed with a thin border matching the verification-badge radius (12px) to visually tie it to the "verified" concept.
- **Empty states:** Never a bare "No items found" — always paired with a short, direct next step (e.g. "No listings yet — be the first to sell something").

---

## 7. Motion

Keep motion minimal and purposeful:
- **Page transitions:** simple fade/slide, 150–200ms — no bouncy/elastic easing.
- **Lottie success animation:** the one moment of real delight in the app (post-payment) — everywhere else, motion should be quiet.
- **Respect `prefers-reduced-motion`:** disable non-essential animation for users who request it, on both Web and Android.

---

## 8. Voice & Tone (Writing in the UI)

Keep copy plain, direct, and conversational — written from the student/teacher's point of view, not the system's.

- **Say what the user controls**, not how the backend works. "Your listing was sold" not "Transaction status updated to Success."
- **Use active voice and consistent verbs.** A button that says "Sell an item" should lead to a page titled the same way, not "Create Listing."
- **Errors are specific, never apologetic filler.** Instead of "Oops, something went wrong," say "We couldn't verify your PRN — check the number and try again."
- **Empty states invite action:** "Your cart is empty — browse listings to find something." not just "Cart empty."
- **No corporate/marketing tone.** Avoid words like "seamless," "revolutionary," "empower." This is a utility for students, not a pitch deck.

---

## 9. Accessibility Baseline

- Minimum contrast ratio **4.5:1** for body text against its background (verify `--color-text-secondary` on `--color-bg`).
- All interactive elements have a **visible focus state** (2px amber outline), not just a color change.
- Every image (product photos, badges) has meaningful `alt` text — product title at minimum.
- Form inputs always paired with a real `<label>`, never placeholder-only fields.

---

## 10. Quick Reference (Tokens Summary)

```css
:root {
  --color-primary: #26365B;
  --color-primary-light: #3C517E;
  --color-accent: #E8A33D;
  --color-success: #2F8F6F;
  --color-danger: #C6493F;
  --color-bg: #FAFAF9;
  --color-surface: #FFFFFF;
  --color-border: #E3E3E0;
  --color-text-primary: #1B1E24;
  --color-text-secondary: #5D6270;

  --font-display: 'Space Grotesk', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-badge: 12px;

  --space-1: 4px;  --space-2: 8px;  --space-3: 12px;
  --space-4: 16px; --space-5: 24px; --space-6: 32px;
  --space-7: 48px; --space-8: 64px;
}
```
