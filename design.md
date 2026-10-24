# Lūana Kai Resort & Villas — Design

Luxury beach resort website (web) for a fictional resort on Hanalei Bay, Kauaʻi. Dark, cinematic, editorial — inspired by boutique hotel studios: near-black canvas, full-bleed moody photography, refined serif display type, hairline structure, and restraint.

## Colors (CSS variables in packages/web/src/web/styles.css)
| Token | Value | Use |
|---|---|---|
| --ink | #050505 | page background |
| --ink-2 | #0d0f10 | raised surfaces, cards |
| --slate | #1d2830 | top of gradient panels (slate → black) |
| --sea | #12302f | deep teal tint used in gradients / chat |
| --bone | #f4efe7 | primary text, solid buttons |
| --mist | rgba(244,239,231,.62) | secondary text |
| --line | rgba(244,239,231,.14) | hairlines, outlined chips |
| --sand | #d8b98a | accent: small labels, active states, rates |

## Typography
- Display: **Fraunces** (opsz, soft serif) — headings, wordmark, large quotes. Weight 300–400. Section titles centered with a 48px underline rule.
- Body/UI: **Manrope** 400–600 — body 15–16px, line-height 1.65; eyebrow labels 11px uppercase tracking .22em.

## Components & patterns
- Glass pill nav (blurred, rgba white 8%) centered over hero; wordmark left; "Reserve" pill right.
- Buttons: solid bone with ink text (primary); glass/outline pill (secondary). Radius 10px (buttons), 14px (panels).
- Image cards: photo with bottom black fade, uppercase serif caption below, small body text.
- Outlined chips for amenities/treatments.
- Accordion rows: uppercase serif label, + / – icon, hairline dividers.
- Gradient panels: linear slate → ink, rounded 16px, inset into page width.
- Footer: giant Fraunces wordmark spanning the width.
- Chat: floating pill launcher bottom-right → glass panel (420×640) with slate→ink gradient, streaming bubbles, rich room/booking cards, quick-reply chips, human handoff.

## Motion
Motion library: hero text staggered fade-up on load; sections reveal on scroll (opacity + 24px y, 0.8s ease-out). Image hover: slow 1.04 scale.

## Pages
/, /rooms, /rooms/:slug, /dining, /spa, /experiences, /offers, /gallery, /contact, /book, /admin (staff inbox, bookings, enquiries).
