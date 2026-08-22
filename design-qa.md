# Design QA — Busan Pocket Guide

## Evidence

- Source visual truth: `design-concepts/option-2-busan-pocket-guide.png`
- Source pixels: 853 × 1844 px
- Normalized source: `qa-screenshots/source-option-2-normalized-375x812.png`
- Final mobile implementation: `qa-screenshots/mobile-day3-itinerary-final-v5.png`
- Same-input comparison: `qa-screenshots/comparison-option-2-vs-mobile-final-v5.png`
- Final responsive captures:
  - Desktop: `qa-screenshots/desktop-1440-final.png` — 1425 × 5143 px full-page capture at a requested 1440 × 1024 CSS viewport
  - Tablet: `qa-screenshots/tablet-834-final.png` — 819 × 5305 px full-page capture at a requested 834 × 1194 CSS viewport
  - Mobile: `qa-screenshots/mobile-390-final-full.png` — 390 × 5046 px full-page capture at a requested 390 × 844 CSS viewport
  - Compact mobile: `qa-screenshots/mobile-320-final-viewport.png` — 305 × 804 px viewport capture at a requested 320 × 844 CSS viewport
- Density normalization: device scale factor 1. The 853 × 1844 source was downsampled to the browser content capture size of 375 × 812 px before comparison. Both sides of the final comparison are therefore 375 × 812 px.
- State: Mobile, Day 3 selected, first itinerary stop expanded, no dialog open. This matches the selected concept's Day 3 itinerary state.

## Full-view comparison evidence

The final side-by-side comparison confirms the selected direction is present across the complete mobile viewport: warm ivory canvas, forest-green brand and selected state, teal route accents, compact coastal hero, editorial serif display typography, five-day segmented navigation, vertical route line, expanded Hanwoo stop, rounded imagery, and large map actions. The implementation intentionally keeps the existing share and itinerary actions in the header instead of replacing them with a non-functional menu.

The full-page Desktop, Tablet, Mobile, and 320 px captures were checked for section order, card proportions, image crops, whitespace, navigation behavior, and footer consistency. No viewport produced document-level horizontal overflow: measured `scrollWidth` equaled the configured viewport width at 1440, 834, and 390 px; at the 320 px check, `scrollWidth` was 318 px against `innerWidth` 320 px.

## Focused-region comparison evidence

The Day 3 route header, day rail, first timeline node, expanded event copy, Hanwoo image, and map-action region were compared at equal pixel dimensions in `qa-screenshots/comparison-option-2-vs-mobile-final-v5.png`. This focused view was necessary because the selected source is a single mobile itinerary screen, while the production page also contains trip overview, stay, notes, credits, and footer sections.

## Required fidelity surfaces

- Fonts and typography: Noto Serif TC is used for editorial display copy and Geist for navigation/body content. Display scale, serif/sans hierarchy, letter spacing, wrapping, and small-label optical weight match the concept. Chinese and Korean text render without fallback gaps or clipping.
- Spacing and layout rhythm: Mobile hero, route header, five-day rail, timeline nodes, event copy, imagery, and controls follow the source's compact vertical rhythm. Desktop and tablet preserve larger editorial whitespace without broken gaps or overlaps.
- Colors and visual tokens: Warm canvas, deep forest, marine teal, lime focus/accent, white surfaces, and low-contrast dividers are consistently mapped through CSS variables. Contrast remains readable in navigation, timeline, notes, and footer regions.
- Image quality and asset fidelity: All visible photography uses real project assets with explicit alt text and controlled `object-fit` crops. No placeholder artwork, emoji, handcrafted SVG, or CSS illustration substitutes are present. Interface icons use Phosphor; Google Maps and Naver use official Simple Icons assets.
- Copy and content: All existing itinerary data, dates, times, places, navigation URLs, notes, captions, source credits, and travel guidance remain intact. The source mock's shorter display time is intentionally replaced by the existing full time range.
- Icons and controls: Share, arrows, caret, close, external-link, map-brand, and back-to-top icons use a consistent library treatment. All primary mobile controls meet or exceed 42–44 px tap targets; map actions are 52–54 px high.

## Interaction and accessibility checks

- Day tabs work by pointer and support Arrow Left, Arrow Right, Home, and End with roving `tabIndex`.
- Tabs expose `role="tab"`, `aria-selected`, `aria-controls`, and a labelled `tabpanel`.
- Event accordions expose `aria-expanded` and only render focusable detail links while expanded.
- Photo lightbox opens and closes correctly, moves focus to Close, traps focus, supports Escape, restores the prior trigger, and locks background scrolling.
- Share feedback uses an `aria-live` region.
- Visible `:focus-visible` treatment and reduced-motion styles are present.
- Browser inspection found 0 broken images and 0 visible framework error overlays. The local development terminal and production build completed without runtime errors.

## Comparison history

### Iteration 1 — blocked

- [P1] The first implementation capture opened directly on the route header and omitted the concept's compact coastal cover, materially changing the mobile first-screen composition.
- Fix: Added a responsive route cover using an existing licensed Busan photograph and aligned its aspect ratio, radius, caption placement, and spacing to the source.
- Post-fix evidence: `qa-screenshots/mobile-day3-itinerary-v3.png`.

### Iteration 2 — blocked

- [P2] The mobile day selector used wide horizontally scrolling cards, so only three days were visible instead of the concept's complete five-day rail.
- [P2] The oversized mobile route heading and padded white event-detail surface delayed the key event image and map actions, reducing the source's pocket-guide density.
- Fix: Converted mobile tabs to five equal visible segments, tightened route typography and section spacing, and removed the unnecessary nested event-detail surface on mobile while retaining clear grouping.
- Post-fix evidence: `qa-screenshots/mobile-day3-itinerary-final-v5.png` and `qa-screenshots/comparison-option-2-vs-mobile-final-v5.png`.

### Iteration 3 — passed

- No actionable P0, P1, or P2 differences remain.
- The remaining differences are intentional product constraints: the implementation keeps working Share/View Itinerary actions, real itinerary time ranges and copy, and the repository's licensed night-coast photography.

## Findings

No actionable P0, P1, or P2 findings remain.

## Follow-up polish

- [P3] A future image pass could replace the night-coast route cover with a purpose-shot blue-hour Busan skyline while retaining the current crop and art direction.

## Implementation checklist

- [x] Selected visual matched at normalized mobile dimensions
- [x] Desktop, tablet, 390 px mobile, and 320 px compact mobile inspected
- [x] Typography, palette, spacing, cards, navigation, hero, itinerary, imagery, buttons, and RWD checked
- [x] Core interactions and keyboard behavior tested
- [x] Overflow and broken-image checks passed
- [x] Production build and lint completed with zero errors

final result: passed
