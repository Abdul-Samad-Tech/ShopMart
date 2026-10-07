# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React 19, Vite, Redux Toolkit, Tailwind CSS 3.4, Express 5, MongoDB. Plain JavaScript. Frontend in `frontend/`, API in `backend/server/`.

## Users

Families in Karachi, Lahore, and Islamabad who shop mostly on a phone. They watch the price and still want food and household goods they trust.

## Product Purpose

ShopMart is a Pakistani online supermarket: groceries, fresh produce, household goods, fashion, and electronics in one shop. Success is a completed order with a clear PKR total, not a browsed homepage.

## Positioning

A neighborhood superstore on the phone: everyday prices, familiar aisles, and a warm shop rather than a luxury catalog or a cold corporate grocer.

## Operating Context

Shoppers browse aisles, search, add to cart, check out, and track orders. Staff use the admin area for products, orders, categories, promo codes, gift cards, loyalty, messages, and page content. The assistant, contact form, store locator, blog, careers, and supplier form are part of the same shop.

## Capabilities and Constraints

Confirmed in the repo: catalog, cart, checkout, guest and account orders, reviews, wishlist, promo codes, gift cards, loyalty, notifications, Google sign-in when configured, and an admin console.

Binding constraints: prices are PKR (Rs.), never dollars. Icons are lucide-react or SVG, never emoji. Colors, type, radius, and shadow come from the tokens in `DESIGN.md`. Motion uses one easing curve and respects reduced motion.

Open, not decided here: the PKR free-delivery threshold (seed copy still says "$50"), whether "60 minutes" is a real delivery promise, and when Urdu UI ships. Do not invent those.

## Brand Commitments

The name is ShopMart. Primary color is green. The shop should feel modern, minimal, premium, trustworthy, and warm. It is not corporate-cold, not purple or gold luxury, and not neon.

Visual rules live in `DESIGN.md`. This file does not duplicate the palette.

## Evidence on Hand

Product and category photos in `frontend/src/assets` and `frontend/public/assets`. Seed copy in `backend/server/seed/martData.js`. No approved customer quotes, press, or delivery-time proof. Do not invent testimonials or a delivery SLA.

## Product Principles

- Show the PKR price before the shopper has to guess.
- Trust and freshness matter more than decoration.
- A family should finish the shop on a phone, with one hand.
- One brand language. Light and dark change surfaces, not the personality.
- Motion explains a change. It never blocks the task.

## Accessibility & Inclusion

WCAG AA contrast. Keyboard focus on every control. Touch targets at least 44px on mobile. Reduced motion is honored. Urdu, when it ships, uses a Nastaliq face and RTL. Latin UI does not.
