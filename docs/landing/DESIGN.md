# FabStitch Public Landing Design

> A tactile editorial journey through cloth: bold enough for fashion, precise enough for professional sourcing.

## 1. Visual Theme & Atmosphere

**Style:** Material editorial commerce  
**Keywords:** tactile, cinematic, graphic, layered, fashion-led, precise, international, credible  
**Tone:** confident and image-led, not ornamental or trend-chasing  
**Feel:** a textile campaign assembled with the discipline of a sourcing specification sheet

**Interaction tier:** L2 fluid interaction  
**Dependencies:** existing React and Next.js only; CSS transforms, IntersectionObserver, and requestAnimationFrame for the single pointer-responsive hero surface

The supplied reference is translated through these traits:

- dense visual storytelling instead of repetitive white sections
- bold left-aligned typography paired with asymmetric image fields
- varied section families: campaign hero, editorial mosaic, full-width statement, horizontal material rail, process index, story split, final media CTA
- compact graphic annotations used only when they communicate real product information
- warm editorial canvas balanced by FabStitch navy and gold, never the reference brand's palette or assets

## 2. Color Palette & Roles

```css
:root {
  --landing-canvas: #e9e4d8;
  --landing-paper: #f8f6f1;
  --landing-surface: #ffffff;
  --landing-surface-hover: #f1ede4;
  --landing-ink: #14161a;
  --landing-ink-secondary: #3b4048;
  --landing-ink-tertiary: #65686f;
  --landing-navy: #141f38;
  --landing-navy-raised: #1c2b4a;
  --landing-rule: #c6bfb1;
  --landing-rule-dark: #334367;
  --landing-accent: #b88840;
  --landing-accent-ink: #855c23;
  --landing-success: #1b6b4a;
  --landing-error: #a32a1e;
  --landing-warning: #8a5a12;
  --landing-canvas-rgb: 233, 228, 216;
  --landing-navy-rgb: 20, 31, 56;
  --landing-accent-rgb: 184, 136, 64;
}
```

Color rules:

- Existing FabStitch semantic tokens remain the implementation source of truth; landing aliases map to them.
- Navy carries campaign moments, paper carries reading, and gold is the only interface accent.
- Image color supplies variety. UI chrome does not introduce unrelated coral, lime, purple, or gradient accents.
- Text and controls meet WCAG AA against every surface.
- No text gradients, glow effects, or translucent text over uncontrolled image detail.

## 3. Typography Rules

**Font system:** IBM Plex Sans and IBM Plex Mono through the existing `next/font` integration. No external stylesheet import.

| Role               | Font          | Size                           | Weight  | Line height | Tracking |
| ------------------ | ------------- | ------------------------------ | ------- | ----------- | -------- |
| Hero H1            | IBM Plex Sans | clamp(2.7rem, 5.3vw, 5.35rem)  | 700     | 0.9         | -0.06em  |
| Campaign statement | IBM Plex Sans | clamp(3rem, 7.5vw, 7.2rem)     | 700     | 0.84        | -0.075em |
| Section H2         | IBM Plex Sans | clamp(2.05rem, 3.8vw, 4.25rem) | 650-700 | 0.95        | -0.05em  |
| H3                 | IBM Plex Sans | clamp(1.1rem, 1.6vw, 1.45rem)  | 600     | 1.12        | -0.025em |
| Body               | IBM Plex Sans | clamp(0.94rem, 1.1vw, 1.08rem) | 400     | 1.58        | 0        |
| Label              | IBM Plex Mono | 0.68rem                        | 500     | 1.2         | 0.1em    |
| Data               | IBM Plex Mono | 0.78rem                        | 500     | 1.35        | 0        |

Typography rules:

- Hero headline is a maximum of three lines on mobile and two lines from 1024px.
- Large type creates hierarchy; decorative font mixing does not.
- Section copy stays below 62 characters per line.
- Eyebrows appear in no more than one of every three sections.
- Never use Inter, script fonts, high-contrast fashion serifs, gradient text, or weak 300-weight display type.

Text decoration:

- Hero and campaign statements: no gradient and no shadow.
- Link emphasis: animated underline or arrow translation.
- Image captions: functional labels outside images, never faux editorial credits.

## 4. Component Stylings

### Buttons

```css
.landing-button {
  min-height: 44px;
  border: 1px solid var(--landing-navy);
  border-radius: 4px;
  background: var(--landing-navy);
  color: var(--landing-paper);
  transition:
    transform 220ms cubic-bezier(0.25, 1, 0.5, 1),
    background-color 180ms ease,
    border-color 180ms ease;
}
.landing-button:hover {
  transform: translateY(-2px);
  background: var(--landing-navy-raised);
}
.landing-button:active {
  transform: translateY(0) scale(0.985);
}
.landing-button:focus-visible {
  outline: 2px solid var(--landing-accent);
  outline-offset: 3px;
}
.landing-button:disabled {
  cursor: not-allowed;
  opacity: 0.52;
  transform: none;
}
```

Secondary buttons use a transparent background with the same border and focus treatment. On dark media they use paper-colored borders and text.

### Editorial tiles

```css
.landing-tile {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--landing-rule);
  border-radius: 6px;
  background: var(--landing-surface);
  transition:
    transform 420ms cubic-bezier(0.25, 1, 0.5, 1),
    border-color 180ms ease,
    box-shadow 420ms cubic-bezier(0.25, 1, 0.5, 1);
}
.landing-tile:hover {
  transform: translateY(-4px);
  border-color: var(--landing-navy);
  box-shadow: 0 18px 44px -30px rgba(var(--landing-navy-rgb), 0.55);
}
.landing-tile:focus-within {
  outline: 2px solid var(--landing-accent);
  outline-offset: 3px;
}
.landing-tile img {
  transition: transform 800ms cubic-bezier(0.25, 1, 0.5, 1);
}
.landing-tile:hover img {
  transform: scale(1.045);
}
```

### Navigation

```css
.landing-nav {
  height: 68px;
  border-bottom: 1px solid transparent;
  background: rgba(248, 246, 241, 0.94);
  transition:
    background-color 240ms ease,
    border-color 240ms ease;
}
.landing-nav[data-scrolled="true"] {
  border-bottom-color: var(--landing-rule);
  background: rgba(248, 246, 241, 0.98);
}
.landing-nav a {
  color: var(--landing-ink-secondary);
  transition: color 160ms ease;
}
.landing-nav a:hover,
.landing-nav a:focus-visible {
  color: var(--landing-navy);
}
```

### Links

```css
.landing-link {
  text-decoration-color: transparent;
  text-underline-offset: 0.28em;
  transition:
    color 180ms ease,
    text-decoration-color 180ms ease;
}
.landing-link:hover,
.landing-link:focus-visible {
  color: var(--landing-navy);
  text-decoration-color: var(--landing-accent);
}
```

### Labels and data tags

```css
.landing-label {
  font-family: var(--font-plex-mono), monospace;
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--landing-ink-tertiary);
}
```

Tags are rectangular and informational. They are not repeated as decorative pill clusters or placed over images.

## 5. Layout Principles

**Container**

- editorial maximum: 1280px
- standard content maximum: 1280px
- reading maximum: 680px
- gutters: 16px mobile, 24px tablet, 32px desktop

**Spacing**

- major sections: clamp(3rem, 6vw, 4.5rem)
- compact campaign transitions: clamp(2.5rem, 4vw, 4rem)
- tile gaps: 12px mobile, 16-24px desktop
- component padding: 16px mobile, 20-28px desktop

**Grid**

```css
.landing-editorial-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: clamp(12px, 1.5vw, 24px);
}
```

The page uses at least five distinct section families:

1. asymmetric hero with fabric film and small inset macro
2. post-hero manifesto with overlapping material mosaic
3. image-led collection rail with unequal spans
4. full-width campaign statement cut by textile imagery
5. indexed process with directional visual flow
6. story split with one dominant portrait-free material image
7. final full-bleed media CTA

No consecutive sections reuse the same card grid.

## 6. Depth & Elevation

| Level    | Treatment                                      | Use                           |
| -------- | ---------------------------------------------- | ----------------------------- |
| Flat     | hairline or tonal separation only              | page bands, process rows      |
| Material | 1px structural border                          | swatches, collection tiles    |
| Raised   | tinted low-spread shadow                       | hoverable fabric cards        |
| Campaign | image overlap plus one deep navy-tinted shadow | hero inset and final CTA only |

Shadows are sparse and tinted navy. Blur is never animated. Large areas do not use backdrop filters.

## 7. Animation & Interaction

**Motion philosophy:** cloth moves continuously; interface elements move once to establish hierarchy or briefly to acknowledge interaction.

**Tier:** L2

### Entrance

```css
@media (prefers-reduced-motion: no-preference) {
  .landing-hero-reveal {
    opacity: 0;
    clip-path: inset(0 0 100% 0);
    animation: landing-mask-in 900ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  @keyframes landing-mask-in {
    to {
      opacity: 1;
      clip-path: inset(0);
    }
  }
}
```

Hero order: label, headline, supporting copy, actions, media. Total choreography remains below 1.2 seconds.

### Scroll reveal

IntersectionObserver sets `data-reveal="visible"` once at threshold `0.12` with `rootMargin: 0px 0px -8%`. Base markup is visible without JavaScript.

```css
.landing-reveal {
  opacity: 1;
  transform: none;
}
@media (prefers-reduced-motion: no-preference) {
  .landing-reveal[data-reveal="pending"] {
    opacity: 0;
    transform: translateY(28px);
  }
  .landing-reveal[data-reveal="visible"] {
    opacity: 1;
    transform: none;
    transition:
      opacity 720ms cubic-bezier(0.25, 1, 0.5, 1),
      transform 720ms cubic-bezier(0.25, 1, 0.5, 1);
  }
}
```

### Pointer depth

- one pointer listener on the hero visual only
- requestAnimationFrame throttled
- maximum travel: 16px horizontal and 12px vertical
- disabled for touch, coarse pointers, widths below 768px, and reduced motion

### Image movement

- hero silk video loops continuously
- selected static textile images drift 2-4% over 12-16 seconds
- image hover zoom is capped at 1.045
- transforms and opacity only

### Special moments

1. hero silk film with mask reveal
2. first-scroll oversized material manifesto
3. asymmetric collection mosaic
4. large textile-masked statement
5. process line that progresses as rows enter view
6. final CTA image curtain

### Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  .landing-hero-reveal,
  .landing-reveal,
  .landing-drift,
  .landing-parallax {
    opacity: 1 !important;
    clip-path: none !important;
    transform: none !important;
    animation: none !important;
    transition: none !important;
  }
}
```

The silk video pauses on its first frame. Meaning and navigation remain complete.

## 8. Do's and Don'ts

### Do

- Use project-owned fabric images and the existing silk film as the visual source.
- Let photographs and textile crops provide color variation.
- Alternate dense and quiet compositions so whitespace remains deliberate.
- Keep specifications and commercial claims sourced from real data.
- Use FabStitch navy, gold, wordmark, and IBM Plex typography consistently.
- Keep the authenticated marketplace visually and structurally separate.
- Make every visual replaceable through a single media registry.

### Don't

- Do not copy the reference logo, words, illustrations, claims, metrics, or image crops.
- Do not turn the landing page into the complete catalogue.
- Do not invent brands, testimonials, customer logos, reviews, supplier facts, or performance numbers.
- Do not expose supplier identity, IDs, profile links, contacts, ratings, or counts.
- Do not use three equal generic feature cards.
- Do not use gradient blobs, glassmorphism, glow effects, rounded pill soup, or excessive shadows.
- Do not use more than one looping video or one pointer listener.
- Do not animate layout properties, filters, blur, or React state on pointer movement.
- Do not hide core information behind hover or motion.
- Do not use giant accidental white gaps or repeat the same section composition.
- Do not alter authentication, session, API, backend, or marketplace architecture.

## 9. Responsive Behavior

| Breakpoint | Width       | Key changes                                                                        |
| ---------- | ----------- | ---------------------------------------------------------------------------------- |
| Wide       | 1280px+     | 12-column editorial layouts, full hero layering, 1440px visual canvas              |
| Desktop    | 1024-1279px | reduced image overlap, four-column collection rhythm                               |
| Tablet     | 768-1023px  | two-column hero, horizontal collection rail, simplified process connector          |
| Mobile     | below 768px | single-column story, hero copy before media, strict image crops, no pointer motion |

**Touch targets:** minimum 44px  
**Mobile hero:** copy and primary action remain above the fold at 390px; video becomes a fixed-ratio media field below the actions.  
**Collapsing strategy:** asymmetric grids become ordered single-column compositions, while collection rows use accessible horizontal scroll snapping rather than tiny tiles.

```css
@media (max-width: 767px) {
  .landing-editorial-grid {
    grid-template-columns: 1fr;
  }
  .landing-pointer-layer {
    transform: none !important;
  }
  .landing-collection-rail {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(76vw, 19rem);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
  }
  .landing-collection-rail > * {
    scroll-snap-align: start;
  }
}
```
