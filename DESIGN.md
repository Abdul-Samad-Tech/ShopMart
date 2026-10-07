---
name: ShopMart
description: A warm neighborhood supermarket for Pakistani families, on the phone first.
colors:
  brand: "#146B45"
  brand-strong: "#0E5436"
  brand-text-dark: "#7DCEA0"
  surface: "#F6F3EC"
  surface-raised: "#FFFCF7"
  ink: "#1C1917"
  ink-muted: "#5C564E"
  line: "#E4DDD2"
  accent: "#9A4E24"
  success: "#146B45"
  warning: "#7A4E00"
  danger: "#9F1C1C"
  surface-dark: "#121614"
  surface-raised-dark: "#1C2420"
  ink-dark: "#F4F1EA"
  ink-muted-dark: "#A8A299"
  line-dark: "#2C3832"
typography:
  display:
    fontFamily: "Rubik, Nunito Sans, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.25rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Rubik, Nunito Sans, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Rubik, Nunito Sans, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "Nunito Sans, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Nunito Sans, Segoe UI, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.01em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  full: "999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "6": "24px"
  "8": "32px"
  "12": "48px"
  "16": "64px"
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "#FFFFFF"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.brand-strong}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
    height: "44px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.brand}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
    height: "44px"
  card:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "16px"
  input:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
    height: "44px"
  badge:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.brand-strong}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
---

# Design System: ShopMart

Normative color, type, radius, spacing, and component values are the frontmatter of this file. `DESIGN_SYSTEM.md` explains the same values. If the two disagree, this frontmatter wins and `DESIGN_SYSTEM.md` must be updated. Shadows and motion live in `.impeccable/design.json` because this format cannot store them.

The shop that is running today still uses an older purple and gold theme. Those values are not tokens. Do not copy them.

## Overview

**Creative North Star: "The Morning Market"**

ShopMart should feel like a well-kept market stall just after opening: fresh food, a clear price, and enough quiet to decide. The green is the awning. The paper is warm, not hospital white. Nothing shouts.

Density stays comfortable on a phone. One primary action per band. Product photos carry the color; the chrome stays calm. Light and dark are the same shop at different times of day.

**Key Characteristics:**

- Green brand, warm paper, near-black ink
- Rubik for headings, Nunito Sans for reading and UI
- Soft corners, hairline borders, shadows that barely lift
- One easing curve, short durations, still when reduced motion is on
- PKR prices and lucide icons, always

## Colors

A market green on warm paper. Clay is a small accent for food warmth, not a second brand.

Checked pairs, all at or above 4.5:1: white on `#146B45` (6.52), white on `#0E5436` (8.97), `#1C1917` on `#F6F3EC` (15.78), `#5C564E` on `#F6F3EC` (6.54), `#9A4E24` on `#F6F3EC` (5.43), `#7A4E00` on `#F6F3EC` (6.50), `#9F1C1C` on `#F6F3EC` (7.13), `#F4F1EA` on `#121614` (16.18), `#A8A299` on `#121614` (7.21), `#7DCEA0` on `#121614` (9.74).

### Primary

- **Market Green** (`#146B45`): Primary buttons, links, and the logo mark. White label text.
- **Leaf Shade** (`#0E5436`): Hover and pressed brand fill. White label text.
- **Morning Leaf** (`#7DCEA0`): Brand-colored text and icons on dark surfaces only. Do not use it as a button fill.

### Secondary

- **Clay** (`#9A4E24`): Small food accents, such as a "picked today" label on warm paper. Not a button color, not gold.

### Neutral

- **Warm Paper** (`#F6F3EC`): Page background in light mode.
- **Stall Card** (`#FFFCF7`): Raised cards, inputs, and sheets in light mode.
- **Ink** (`#1C1917`): Body and headings in light mode.
- **Ink Soft** (`#5C564E`): Secondary text in light mode. Do not go lighter.
- **Stall Line** (`#E4DDD2`): Borders and dividers in light mode. Not for text.
- **Night Stall** (`#121614`): Page background in dark mode.
- **Night Card** (`#1C2420`): Raised surfaces in dark mode.
- **Lamp** (`#F4F1EA`): Text in dark mode.
- **Lamp Soft** (`#A8A299`): Secondary text in dark mode.
- **Night Line** (`#2C3832`): Borders in dark mode.

### Status

- **Success** uses Market Green. Do not invent a second green.
- **Warning** (`#7A4E00`): Text on warm paper. Not orange boxes.
- **Danger** (`#9F1C1C`): Errors and destructive text on warm paper.

**The One Green Rule.** Brand green covers actions and identity. It does not flood backgrounds. A screen is mostly paper and photos.

**The No Gray-on-Green Rule.** Never put muted gray type on a green, clay, warning, or danger fill. Labels on those fills are white or Lamp (`#F4F1EA`).

## Typography

**Display Font:** Rubik (with Nunito Sans, then a system sans)
**Body Font:** Nunito Sans (with Segoe UI, then a system sans)
**Urdu Font:** Noto Nastaliq Urdu, only when the page language is Urdu

**Character:** Rubik is a retail display face: clear, a little soft, not a fashion serif. Nunito Sans stays readable in prices, filters, and forms. Both cover Latin.

Alternate pairing, not the default: Varela Round for display with the same Nunito Sans body, if a rounder heading is needed later. Do not mix both display faces on one screen.

Do not load these from a Google Fonts stylesheet. Self-host with `font-display: swap` when the theme is implemented.

### Hierarchy

- **Display** (600, `clamp(2rem, 5vw, 3.25rem)`, 1.1): Homepage hero only. One per page.
- **Headline** (600, 1.75rem, 1.2): Page titles.
- **Title** (600, 1.25rem, 1.3): Product names and section titles.
- **Body** (400, 1rem, 1.5): Descriptions and form text. Measure stays near 65ch.
- **Label** (600, 0.875rem, 1.4): Buttons, badges, meta. Do not set UI type below 14px. Prices stay at least body size.

Urdu body line-height is 2.1 so Nastaliq does not collide.

**The Price Rule.** A price is body or title size, tabular figures, prefixed `Rs.` with a thousands separator. Never `$`.

## Layout

Mobile first. Design at 360px, then 768px, then 1280px. Content width caps at 72rem. Page padding is 16px, then 24px, then 32px. The spacing scale is 4, 8, 12, 16, 24, 32, 48, 64. Gaps between cards use 16px on mobile and 24px from tablet up.

Fixed bars (announcement, nav, mobile tabs) reserve their height so content does not slide under them. Safe-area padding applies to the bottom tab bar.

## Elevation & Depth

Depth comes from warm paper versus a lighter card, plus a hairline. Shadows are rare and neutral. They are not colored and they do not glow.

### Shadow Vocabulary

- **Rest** (`0 1px 2px rgb(28 25 23 / 0.06)`): Cards at rest, if a border alone is not enough.
- **Raised** (`0 8px 20px rgb(28 25 23 / 0.08)`): Drawers, menus, and dialogs.

Dark mode prefers the surface step (`#121614` to `#1C2420`) and drops the light-mode shadow.

**The Flat-By-Default Rule.** Product cards do not float, tilt, or glow on hover.

## Shapes

Corners are 8px for small controls, 12px for buttons and inputs, 16px for cards, and a full pill only for badges and compact chips. One radius per component. Borders are 1px Stall Line or Night Line. No thick side stripe as decoration.

## Components

### Buttons

- **Shape:** 12px radius, 44px minimum height.
- **Primary:** Market Green fill, white label, 12px 20px padding.
- **Hover / Focus:** Leaf Shade fill. Focus is a 2px Market Green ring, 2px offset, visible on paper and on night surfaces.
- **Secondary:** Stall Card fill, Ink text, 1px Stall Line border.
- **Ghost:** Transparent fill, Market Green text.

### Chips

- **Style:** Warm Paper or Night Card, Ink or Lamp text, 1px line, full pill.
- **State:** Selected chip uses Market Green text on a pale green wash (`#E7F5EE`) in light mode, or Morning Leaf text on Night Card in dark mode. Not a gradient.

### Cards / Containers

- **Corner Style:** 16px.
- **Background:** Stall Card, or Night Card in dark mode.
- **Shadow Strategy:** Rest only, or none if the border is enough.
- **Border:** 1px line.
- **Internal Padding:** 16px.

### Inputs / Fields

- **Style:** 44px height, 12px radius, Stall Card fill, 1px line.
- **Focus:** Border becomes Market Green. No glow.
- **Error:** Danger text under the field, plus a Danger border. Color is not the only signal.

### Navigation

- **Style:** Ink wordmark, Nunito Sans labels, Market Green for the active item. Sticky, not glassy. Mobile uses a bottom tab bar with 44px targets, not a tiny hamburger as the only path.

## Do's and Don'ts

### Do:

- **Do** take every color, radius, and font from this frontmatter.
- **Do** keep white labels on Market Green and Leaf Shade.
- **Do** use one hover change on a product card: a second photo or a quiet border.
- **Do** respect `prefers-reduced-motion` by dropping movement and keeping opacity or instant state.

### Don't:

- **Don't** use purple gradients, gold (`#D4AF37` and kin), neon, or the current luxury theme tokens.
- **Don't** use glassmorphism, liquid glass, or blur as a default surface.
- **Don't** use bounce, overshoot, or glow shadows.
- **Don't** nest cards, put gray text on a colored fill, or use emoji as icons.
- **Don't** load fonts from a third-party stylesheet in the app.
