# Mobile Inquiry Scroll Fix

## ROOT CAUSE

The shared `<Dialog>` shell intentionally uses `max-h-[100dvh]` (and `sm:max-h-[92dvh]`) with `overflow-hidden` so modal content cannot spill outside the viewport.

The **Order** modal already solved this with an inner flex column and a dedicated `overflow-y-auto` region.

The **Inquiry** modal did not. It rendered a growing `<div className="w-full">` + form inside the clipped dialog shell. On mobile, contact fields below Full Name (Email, Country, Phone) and the Submit button were painted below the fold with **no scroll container that could receive touch scrolling**. Body scroll was correctly locked for the background page, which made the stuck state feel total.

## AFFECTED COMPONENT

- `features/inquiries/inquiry-form.tsx` (`InquiryDialog` / `InquiryComposeForm`)
- Shared primitive: `components/ui/dialog.tsx` (height clamp + `overflow-hidden`; now also `open:flex-col`)

## SCROLL CONTAINER

After the fix:

```
dialog (max-h / h-[100dvh], overflow hidden, flex-col)
  └─ shell (flex-1, flex-col, min-h-0)
       ├─ header (shrink-0) — title + close
       └─ form (flex-1, flex-col, min-h-0)
            ├─ scroll region (flex-1, min-h-0, overflow-y-auto, overscroll-contain)
            │    fabric · quantity · note · contact fields · errors
            └─ footer (shrink-0, safe-area padding) — Send Inquiry
```

## WHY SCROLL WAS BLOCKED

1. Dialog capped height and set `overflow: hidden`.
2. Inquiry content exceeded that height on typical phone viewports.
3. No descendant had `overflow-y: auto` / a bounded flex child (`min-h-0` + `flex-1`).
4. Background `body { overflow: hidden }` prevented the page behind from scrolling as a workaround.
5. Result: clipped, untouchable fields below the fold.

## FIX IMPLEMENTED

- Match Order modal mobile shell: `h-[100dvh]`, edge-to-edge on small screens, auto height on `sm+`.
- Flex column dialog (`open:flex-col`) so `flex-1` / `min-h-0` descendants participate correctly.
- Inquiry compose form uses an internal scroll region + sticky submit footer with safe-area inset.
- Larger close control (`size-11`), `lg` inputs, `scroll-mt-24` for keyboard focus.
- Validation / API errors call `scrollIntoView` / focus first invalid control.
- No fields removed or hidden; content remains complete.

## MOBILE TEST RESULTS

Executed: `SITE=http://127.0.0.1:3000 npm run qa:mobile-inquiry`

Viewports: 320, 375, 390, 430  
Fabrics (on 390): Egyptian Cotton Poplin, European Flax Linen, Mercerized Cotton Jersey, Cotton Poplin  

Checks: body lock while open, scroll container present and moves when content overflows, Email / Country / Phone / Submit reachable after scroll, no horizontal overflow, close restores body overflow, reopen still scrolls.

## DESKTOP TEST RESULTS

Same script: 1280×900 smoke — dialog opens, compose form reachable, dialog not forced full-bleed width, Escape closes.

## KEYBOARD TEST RESULTS

Inputs use `scroll-mt-24` and live inside the overflow-y-auto region so focus/`scrollIntoView` can bring fields above the sticky footer. On-device soft-keyboard coverage is mitigated by `100dvh` shell + internal scroll (same pattern as Order modal). Automated soft-keyboard geometry is not available in headless Chrome; layout matches the project’s proven order-modal approach.

## REGRESSION TEST RESULTS

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passed |
| ESLint (changed files) | Passed |
| Prettier (changed files) | Passed |
| `npm run build` | Passed |
| `npm run qa:mobile-inquiry` | Passed (`failures: []`) |

Script added: `scripts/qa/mobile-inquiry.mjs` (`npm run qa:mobile-inquiry`).
