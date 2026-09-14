# FabStitch design system

The visual language is set in `app/globals.css` and expressed through
`components/ui/`. Every screen is built from these. Do not create a
visually-similar component because one page needs it, and do not give a page
its own style.

Rationale for the direction is recorded as **R6** in `docs/DECISIONS.md`.

---

## The idea

**A technical instrument, not a marketing page.** The register is a mill
specification sheet: precise, dense where density helps, restrained everywhere
else. A sourcing manager should feel that the interface was built by people who
have read a test report.

Five commitments carry it, and they are what keep the site from reading as
AI-generated:

1. **Hairline rules, not floating cards.** Structure comes from the grid.
   Shadows are effectively absent; `Panel` and every card are square-ish and
   shadowless. Radius tops out at 4px.
2. **Every numeric is mono and tabular.** GSM, width, MOQ, price, lead time,
   yarn count. Two listings must compare digit-against-digit down a column.
3. **Ink and paper carry ~95% of the surface.** One brand colour, indigo. Status
   colour appears only in status contexts.
4. **Mono micro-labels, uppercase, wide tracking** for every field name and
   section eyebrow.
5. **Hand-authored icons at 1.25 stroke.** No icon library.

---

## Tokens

All tokens live in the `@theme` block of `app/globals.css` and generate Tailwind
utilities directly (`bg-paper`, `text-ink-3`, `border-rule`, `text-label`).
Never inline a hex value in a component.

### Surface

| Token           | Value     | Use                                                               |
| --------------- | --------- | ----------------------------------------------------------------- |
| `paper`         | `#fbfaf8` | Page canvas. Warm-neutral, not cream — cream is Anthropic's (R2). |
| `paper-sunk`    | `#f3f1ec` | Recessed bands, table headers, inactive tabs.                     |
| `paper-raised`  | `#ffffff` | Inputs, cards sitting on a sunk ground.                           |
| `ink-surface`   | `#14161a` | Dark bands: footer, supplier band.                                |
| `ink-surface-2` | `#1e2127` | Elevated regions inside a dark band.                              |

### Text

| Token                 | Value                 | Contrast on paper                 |
| --------------------- | --------------------- | --------------------------------- |
| `ink`                 | `#14161a`             | 16.0:1 — headings, primary text   |
| `ink-2`               | `#3b4048`             | 9.6:1 — running text              |
| `ink-3`               | `#65686f`             | 5.1:1 — meta, hints, field labels |
| `ink-4`               | `#9a9ca3`             | decorative and disabled **only**  |
| `on-ink` / `on-ink-2` | `#f4f2ed` / `#a7a9ae` | text on dark bands                |

### Lines

| Token         | Value     | Use                                             |
| ------------- | --------- | ----------------------------------------------- |
| `rule`        | `#e3dfd7` | decorative divider                              |
| `rule-2`      | `#cfc9be` | structural grid line, panel border              |
| `border`      | `#87847e` | **control** boundary — 3.4:1, meets WCAG 1.4.11 |
| `rule-on-ink` | `#33373f` | dividers inside dark bands                      |

Inputs and selects use `border`, not `rule`. That is deliberate: a control
boundary has a contrast requirement a divider does not, and the heavier line
reads as a technical form.

### Brand and status

`indigo` `#1e3563` · `indigo-hover` `#16264a` · `indigo-soft` `#eef1f8`
`verified` `#1b6b4a` · `caution` `#8a5a12` · `alert` `#a32a1e`, each with a
`-soft` tint.

Indigo is the dye that made the textile trade, and is deliberately not SaaS
blue. Use it for primary actions, active nav state, and links inside body copy.
Do not use it decoratively.

### Type

**IBM Plex Sans** (400/500/600/700) and **IBM Plex Mono** (400/500).
Engineering documentation heritage; not the Inter/Geist default. 700 exists for
the display headline alone — it is loaded as a real cut rather than left to the
browser, which synthesises bold by smearing the 600 and furs the stems at
display size.

| Token          | Size                                                  | Use                          |
| -------------- | ----------------------------------------------------- | ---------------------------- |
| `text-display` | `clamp(2.125rem → 3.25rem)`, 1.06, `-0.03em`, **700** | one per page, the h1         |
| `text-h2`      | `clamp(1.25rem → 1.4375rem)`                          | section headings             |
| `text-h3`      | `1.0625rem`                                           | card and block titles        |
| `text-lead`    | `clamp(0.9375rem → 1.0625rem)`                        | the sentence under an h1     |
| `text-body`    | `0.9375rem` / 1.6                                     | default running text         |
| `text-sm`      | `0.8125rem`                                           | dense values, secondary text |
| `text-xs`      | `0.75rem`                                             | hints, fine print            |
| `text-label`   | `0.6875rem`, `0.09em`, mono, uppercase                | **every field name**         |

15px body is intentional: B2B density without cramping. Display sizes carry
negative tracking; body does not.

`text-display` is the one size that sets its own **weight**, as a
`--text-display--font-weight` companion variable. Do not add a `font-*` utility
to a display headline: Tailwind emits
`font-weight: var(--tw-font-weight, var(--text-display--font-weight))`, so the
utility silently wins and the two display headlines drift apart — which is
exactly what had happened before the weight moved into the token.

Leading is the one value not free to move. 1.03 was set for a single line; both
display headlines wrap to two, and at that ratio the descender of "right"
struck the "what" beneath it. 1.06 is the floor that clears it.

### Shape and rhythm

Radius `xs 2 · sm 3 · md 4`. Nothing is a pill except nothing — there are no
pill containers in this system. Bands use `Band density="tight|default|loose"`;
the shared gutter is `.fs-gutter` and content caps at 1280px via `Container`.

---

## Primitives

`components/ui/` holds the system. **Nothing in here knows what a fabric is.**

| Module           | Exports                                                                            |
| ---------------- | ---------------------------------------------------------------------------------- |
| `typography.tsx` | `Heading` (level and size are separate props), `Label`, `Lead`, `Prose`, `Numeric` |
| `layout.tsx`     | `Container`, `Band`, `SectionHeader`, `Panel`                                      |
| `button.tsx`     | `Button`, `ButtonLink` — kept separate so navigation never renders as a `<button>` |
| `field.tsx`      | `Field` (owns the label/hint/error wiring), `Input`, `Select`                      |
| `badge.tsx`      | `Badge`, `VerificationMark`, `Chip`                                                |
| `table.tsx`      | `TableFrame`, `Th`, `Td`, `SpecGrid`, `SpecStrip`                                  |
| `state.tsx`      | `Skeleton`, `LoadingRegion`, `EmptyState`, `Alert`                                 |
| `icon.tsx`       | 14 hand-authored icons                                                             |

`components/marketplace/` holds domain-aware but reusable records:
`FabricCard`, `FabricCardGrid`, `FabricRowLink`, `SupplierCard`.

### Not yet built

Deferred until a screen genuinely needs them, rather than built speculatively:
combobox, tabs-as-navigation, drawer, dialog, tooltip, dropdown menu,
pagination, breadcrumbs, file upload, image gallery, toast. Each has a place in
this table when it lands; none should be invented inside a page.

---

## Rules

**Heading level ≠ heading size.** `<Heading level={2} size="h3">`. The document
outline stays logical for screen readers and for the programmatic-SEO
templates; the visual scale follows the layout.

**Field names are `Label`.** Uppercase mono at 11px. This is the single most
consistent signal across the product.

**Numbers go through `lib/units.ts`.** Never format a specification inline.
Every physical quantity carries its unit, and the display shows both readings —
GSM _and_ oz/yd², inches _and_ cm, price per kg _and_ per metre. Buyers in
different regions abandon a page that speaks the wrong unit.

**Status is never implied by absence.** An unverified supplier renders
`VerificationMark verified={false}` and says "Unverified". A missing badge means
the data was not loaded, not that the answer is no.

**Empty states relax a constraint and say so.** `EmptyState` takes
`alternatives` for exactly this: "no 180 GSM organic jersey in Portugal;
12 results in Türkiye, 8 at 190 GSM in Portugal". Search must never dead-end.

**Accessibility lives in the primitive.** `Field` wires `htmlFor`,
`aria-describedby` and `aria-invalid`; icons are `aria-hidden` unless given a
`title`; the header ships a skip link; every interactive element keeps the
2px indigo focus ring at 2px offset. Do not re-solve these per screen.

**No `backdrop-filter` on any ancestor of a fixed-position element.** It creates
a containing block and silently collapses the descendant — this already bit the
mobile navigation sheet once. Glassmorphism is not part of this language anyway.

**Do not pass `hidden sm:block` to `Button` / `ButtonLink`.** Their base class
already sets `inline-flex`, and Tailwind emits display utilities in a canonical
order, so `hidden` from a caller loses regardless of string position — the
element stays visible with no error. Wrap the component in a `<div>` that
carries the responsive display instead. `cn()` is a plain joiner, not a
conflict resolver (see `lib/cn.ts`); this is the one collision class to watch.

---

## Banned

Giant centred hero, repetitive rounded cards, pill soup, glassmorphism,
gradients, purple/blue SaaS palette, oversized decorative typography, template
three-card sections, fabricated metrics, generic "trusted by" strips, floating
decorative elements, heavy shadows, icon libraries, emoji, `h-screen` (use
`min-h-[100dvh]`), Inter as a display face.

### Enforced against `.agents/skills/design-taste-frontend`

The project's anti-slop skill names specific signatures. These are now house
rules, checked in the verification sweep:

| Rule                                                        | House position                                                                                                                                                     |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Zero em-dashes and en-dashes** in anything a user can see | Enforced. The sweep fails on a single `—` or `–` in rendered text. Use a comma, a period, parentheses, or a plain hyphen for ranges.                               |
| **Eyebrow budget: 1 per 3 sections**                        | `PageHeader.eyebrow` and `SectionHeader.eyebrow` are optional and default to absent. Omit unless the label carries information the heading and breadcrumbs do not. |
| **Middle dot rationed to 1 per line**                       | Comma-separate lists; keep the dot for the single most meaningful break.                                                                                           |
| **No numbered step labels**                                 | The step verb is the label. Sequence is shown by a connecting rule, not by `01 / 02 / 03`.                                                                         |
| **One label per CTA intent**                                | "Post an RFQ" everywhere. Never also "Start an RFQ" or "Send a requirement".                                                                                       |
| **No equal-card feature rows**                              | Process and feature sequences use a connected line or an asymmetric grid.                                                                                          |
| **Section-layout repetition ban**                           | A layout family appears once per page.                                                                                                                             |

Two of the skill's rules are **deliberately overridden**, because the brief and
the domain say otherwise:

- **Hand-authored icons.** The skill prefers an icon library. The brief names
  the hand-authored set as part of the design foundation to preserve, and 14
  glyphs do not justify a dependency.
- **Dense specification tables.** The skill treats long spec tables as a
  marketing-page tell. Here the specification _is_ the product, and the brief
  asks explicitly for professional density. Tables stay; they are grouped and
  the listing page leads with the four values that decide a shortlist.

---

## Responsive

Verified at 390 / 768 / 1280 with no horizontal overflow at any width.

| Breakpoint | Behaviour                                                                                                                                             |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `< 640`    | single column; nav collapses to a full-height sheet with search first and the primary action pinned low; console fields stack; application tiles 2-up |
| `640–1024` | tiles 3-up; masthead still single column; desktop nav still collapsed                                                                                 |
| `≥ 1024`   | 12-column masthead at 7/5; desktop nav with mega-panels; tiles 4-up                                                                                   |

Mobile is designed, not shrunk: the sheet is an accordion over the same four
doors, and tap targets stay at 44px.
