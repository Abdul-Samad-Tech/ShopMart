# ShopMart design system

This file is the usage guide. **Normative values live in `DESIGN.md` frontmatter** (colors, type, radius, spacing, components) and in `.impeccable/design.json` (shadows and motion). Product facts live in `PRODUCT.md`. If a hex, font, or duration here differs from those files, those files win and this page must be corrected. Do not keep a second palette.

The first pass from the UI UX Pro Max generator recommended Liquid Glass and a gold CTA (`#D4AF37`). That was rejected. The brief asks for a warm, minimal, trustworthy market, with a green primary, and it forbids purple or gold luxury, neon, and glass as a default.

The running UI still uses the old purple and gold theme. That theme is not this system.

## Audience

Families in Karachi, Lahore, and Islamabad. Mostly phones. Careful with money, still looking for food and household goods they trust.

## Color

Light and dark share one green. Dark mode is the same stall after dusk, not a different brand.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| brand | `#146B45` | `#146B45` | Buttons and the mark. White labels. |
| brand-strong | `#0E5436` | `#0E5436` | Hover and pressed fill. White labels. |
| brand-text | `#146B45` | `#7DCEA0` | Links and icons on the page surface. |
| surface | `#F6F3EC` | `#121614` | Page background. |
| surface-raised | `#FFFCF7` | `#1C2420` | Cards, inputs, sheets. |
| ink | `#1C1917` | `#F4F1EA` | Headings and body. |
| ink-muted | `#5C564E` | `#A8A299` | Secondary text. Floor for muted type. |
| line | `#E4DDD2` | `#2C3832` | Borders. Not text. |
| accent | `#9A4E24` | `#9A4E24` | Small clay labels on light paper only. |
| success | `#146B45` | `#7DCEA0` | Same green as the brand. |
| warning | `#7A4E00` | `#F4F1EA` | Text. Not an orange panel. |
| danger | `#9F1C1C` | `#F4F1EA` | Errors. Pair with words, not color alone. |

Contrast checked at or above 4.5:1: white on `#146B45` (6.52) and on `#0E5436` (8.97); `#1C1917` on `#F6F3EC` (15.78); `#5C564E` on `#F6F3EC` (6.54); `#9A4E24` on `#F6F3EC` (5.43); `#7A4E00` on `#F6F3EC` (6.50); `#9F1C1C` on `#F6F3EC` (7.13); `#F4F1EA` on `#121614` (16.18); `#A8A299` on `#121614` (7.21); `#7DCEA0` on `#121614` (9.74).

On a dark page, warning and danger messages use Lamp text (`#F4F1EA`) plus an icon or the word, because a small brown or red on night green was not verified as body text.

## Type

### Pairing A, the default

| Role | Family | Notes |
| --- | --- | --- |
| Display | Rubik | Retail headings. Weights 500 and 600. |
| Body | Nunito Sans | UI, prices, forms. Weights 400 and 600. |

Both support Latin. This is the ecommerce pairing from the type search (Rubik with Nunito Sans). Rubik is the display face. Nunito Sans is the body face.

### Pairing B, alternate

| Role | Family | Notes |
| --- | --- | --- |
| Display | Varela Round | Rounder, softer headings. |
| Body | Nunito Sans | Same body as pairing A. |

Use pairing B only if a screen needs a friendlier display. Do not mix Rubik and Varela Round on one screen. Lexend with Source Sans 3 was considered and set aside: it reads corporate, which this shop is not.

### Urdu

Noto Nastaliq Urdu for Urdu UI. Line-height 2.1. It does not replace Rubik or Nunito Sans on English screens.

Self-host with `@fontsource` when tokens are implemented. `font-display: swap`. Preload the critical weights (Rubik 600, Nunito Sans 400 and 600). Do not add a Google Fonts `<link>` or `@import`.

### Scale

| Step | Size | Line | Weight | Use |
| --- | --- | --- | --- | --- |
| display | `clamp(2rem, 5vw, 3.25rem)` | 1.1 | 600 | One hero per page |
| headline | 1.75rem | 1.2 | 600 | Page title |
| title | 1.25rem | 1.3 | 600 | Product and section titles |
| body | 1rem | 1.5 | 400 | Reading and prices |
| label | 0.875rem | 1.4 | 600 | Buttons and meta |

UI text does not go below 14px. Prices use `Rs. 1,250` at body size or larger, with tabular figures.

## Spacing

4px base: 4, 8, 12, 16, 24, 32, 48, 64. Page padding is 16px at 360px, 24px at 768px, 32px at 1280px. Content max width is 72rem.

## Radius

| Token | Value | Use |
| --- | --- | --- |
| sm | 8px | Small controls |
| md | 12px | Buttons and inputs |
| lg | 16px | Cards |
| full | 999px | Badges only |

## Elevation

Subtle and neutral. No colored glow.

| Token | Value | Use |
| --- | --- | --- |
| rest | `0 1px 2px rgb(28 25 23 / 0.06)` | Optional card rest |
| raised | `0 8px 20px rgb(28 25 23 / 0.08)` | Drawer, menu, dialog |

Dark mode uses the surface step instead of a light shadow. Cards do not tilt or lift on hover.

## Motion

One curve for the whole shop: `cubic-bezier(0.22, 1, 0.36, 1)`.

| Token | Duration |
| --- | --- |
| fast | 150ms |
| base | 250ms |
| slow | 400ms |

Enter with ease-out using that curve. Exit can be slightly quicker (fast). No linear UI motion, no bounce, no overshoot spring. One or two moving elements per view. Infinite motion is for loaders only.

When `prefers-reduced-motion: reduce` is set, duration is 0 and transforms are removed. Opacity or an instant state change is enough. The hook will live at `frontend/src/hooks/usePrefersReducedMotion.js`.

## Components, in short

- Primary button: Market Green, white label, 44px tall, 12px radius. Hover is Leaf Shade. Focus ring is 2px green, 2px offset.
- Secondary: raised surface, ink text, 1px line.
- Ghost: transparent, green text.
- Card: 16px radius, 16px padding, 1px line, rest shadow or none.
- Input: 44px, 12px radius, green border on focus, no glow. Errors use danger text and a danger border.
- Badge: pill, green text on paper, not gray on green.

## Anti-patterns

- Purple gradients, gold luxury, neon, and the old `primary` / `gold` / `luxury` theme
- Glassmorphism, liquid glass, and blur as a default surface
- Dark glow shadows and bounce easing
- Nested cards and side-border accent stripes
- Gray text on green, clay, warning, or danger fills
- Emoji as icons
- Dollar prices
- Google Fonts links in the app
- Hover effects that move layout (scale on the card, jump, tilt)
- A second display font on the same screen
- Invented delivery times, testimonials, or a PKR threshold that is not in the product record
