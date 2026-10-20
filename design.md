# ALU KICKS — Design System

**Tagline:** BUILT TO MOVE.  **Statement:** MORE THAN A SHOE. A STATEMENT.
Personality: minimalist, futuristic, confident, premium, athletic, unapologetically bold.
Reference blend: luxury sneaker campaign × futuristic product showroom × independent streetwear store.

## Color
| Token | Value | Use |
|---|---|---|
| `--vanta` | `#0A0A0A` | Dominant background (near-black) |
| `--carbon` | `#131313` | Raised surfaces, cards |
| `--graphite` | `#1E1E1E` | Inputs, hover surfaces |
| `--line` | `rgba(237,234,227,0.10)` | Hairline borders / grid lines |
| `--bone` | `#EDEAE3` | Primary text on dark; light inverted sections |
| `--ash` | `#8C8A85` | Secondary text, labels |
| `--infra` | `#FF4A1C` | The ONE accent — CTAs, live indicators, highlights. Never decorative fills. |

Per-product `accent` hex drives local glows (hero halo, product page backdrop).

## Typography
- **Display:** Archivo, variable width axis — headlines use `font-stretch: 125%` + weight 800–900, uppercase, tight tracking (-0.02em), line-height 0.85.
- **Body:** Manrope 400/500/600, line-height 1.6.
- **Technical / labels:** JetBrains Mono 400–500, 11–12px, uppercase, +0.12em tracking — spec sheets, SKUs, indices (`/01`, `SS—26`).
- Scale: hero `clamp(4rem, 16vw, 18rem)`; section `clamp(2.5rem, 7vw, 7rem)`; body 15–16px.

## Layout
- 12-col fluid grid, page gutter `clamp(1.25rem, 4vw, 3.5rem)`.
- Asymmetric compositions: oversized type behind/under floating product cutouts; products break grid lines.
- Hairline rules and index numbers frame sections (showroom / spec-sheet feel).
- Square corners everywhere (radius 0). Pills only for size chips' focus ring — no rounded cards.

## Surfaces & texture
- Film-grain noise overlay (fixed, 4% opacity) site-wide.
- Radial accent glow behind hero products; faint grid lines in showroom sections.
- Product cutouts (transparent webp) float with soft elliptical floor shadows.

## Motion (Motion for React + Lenis smooth scroll)
- Intro preloader: counter 000→100, ALU KICKS wordmark wipes, then hero stagger (letters rise from mask, shoe drops in with rotate + blur).
- Hero sneaker: idle float loop, pointer-driven 3D tilt (spring), colorway switch = exit right / enter left with blur.
- Scroll: masked line reveals for headings, fade-up for blocks, parallax on campaign images, pinned horizontal collection rail.
- Hover: product cards tilt + shoe lifts & rotates −8°; magnetic CTAs; custom cursor ring on pointer-fine devices showing "VIEW"/"DRAG".
- Product viewer: drag horizontally to rotate through angles.
- Easing: `[0.16, 1, 0.3, 1]` (expo-out). Durations 0.6–1.2s for reveals, 0.25s for UI.
- Respect `prefers-reduced-motion`: disable loops, parallax, smooth scroll.

## Components
Nav (blend-mode, cart count), CartDrawer, Preloader, Cursor, Marquee, Reveal/SplitHeading, MagneticButton, ProductCard, SneakerStage, AngleViewer, SizeGrid, Footer.

## UX patterns
- Cart persists in localStorage; drawer opens on add with toast-like feedback.
- Wishlist (heart) persists in localStorage.
- Shop filters: category, colorway family, size, price; sort. Instant (client-side) with URL-free state.
- Checkout posts an order to the API (stored in DB); payments are mocked — ready for Stripe/Autumn later.
