---
name: css-over-js
description: Replace JavaScript with modern CSS primitives — scroll-driven animation, popover and anchor positioning, container queries, view transitions, and UX details that need no runtime
---

# CSS Over JS

Reach for a CSS primitive before writing JavaScript. Modern CSS handles interaction, state, layout, and animation without runtime overhead. This skill catalogs what CSS replaces: JavaScript libraries, event handlers, and patterns that bloated codebases for years.

For cascade fundamentals, custom properties, and responsive layout strategy, see `css-best-practices`.

## Interaction & State

### `:has()` - parent and sibling state

Replace class-toggling logic. Style a parent or sibling when a child matches a condition.

```css
/* ❌ Requires .invalid class toggled by JS on form */
form.invalid button {
  opacity: 0.5;
}

/* ✅ CSS detects the state */
form:has(input:invalid) button {
  opacity: 0.5;
  pointer-events: none;
}
```

Avoids the observer pattern and manual class management.

### `<dialog>` and `::backdrop`

Replace modal libraries. Native dialogs with focus trapping and backdrop.

```css
/* ❌ Custom backdrop, focus management, Esc handler in JS */
.modal {
  position: fixed;
  z-index: 999;
}

/* ✅ Modal semantics, backdrop, focus containment */
dialog {
  border: 1px solid #ccc;
  border-radius: 8px;
}
dialog::backdrop {
  background: rgba(0, 0, 0, 0.5);
}
```

Use `showModal()` for focus trap; `close()` on button click. Esc key closes by default.

### `popover` attribute and `::backdrop`

Lightweight tooltips, popovers, menus without focus trapping. Replaces Popper.js, Floating UI for simple cases.

```css
/* ❌ Floating UI, click-outside detection, position sync */
.tooltip {
  position: absolute;
}

/* ✅ Declarative anchoring */
[popover] {
  inset: auto;
  border: 1px solid #ccc;
  padding: 0.5rem;
}
[popover]::backdrop {
  background: transparent;
}
```

Pair with `anchor-name` and `position-anchor` for positioning.

### `anchor-name` and `position-anchor`

Position popovers relative to another element. Replaces manual offset calculations.

```css
button {
  anchor-name: --my-button;
}

[popover] {
  position-anchor: --my-button;
  inset: auto;
  top: anchor(bottom);
  left: anchor(left);
  margin-top: 0.5rem;
}
```

Baseline 2026: Chrome 125+, Firefox 132+, Safari 18.2+. Without support, the popover falls back to its default position with no positioning applied - guard with `@supports (anchor-name: --x)` if you need an explicit fallback position instead.

### `<details>` and `<summary>` with animation

Accordions and toggles without JavaScript state.

`::details-content` targets the disclosure's content box directly (no wrapper `<div>` needed) and can be animated with `transition` on `height` or `content-visibility`:

```css
details::details-content {
  transition:
    content-visibility 0.3s allow-discrete,
    height 0.3s;
  height: 0;
  overflow: hidden;
}
details[open]::details-content {
  height: auto;
}
```

```css
/* ❌ .open class toggle, click handler */
.accordion-item.open .content {
  display: block;
}

/* ✅ Semantic HTML, CSS transition */
details {
  border: 1px solid #ddd;
}
details[open] summary {
  font-weight: bold;
}
summary {
  cursor: pointer;
  user-select: none;
}

/* Animate open/close */
summary::after {
  content: "▶";
  transition: transform 0.3s ease;
}
details[open] summary::after {
  transform: rotate(90deg);
}
```

`:user-valid` and `:user-invalid` for form states after user interaction.

### `:focus-within`

React to inner input state without class toggling on the container.

```css
/* ❌ JS listener on input, toggle .focused on form */
form.focused {
  border-color: blue;
}

/* ✅ CSS detects focus inside */
form:focus-within {
  border-color: blue;
  box-shadow: 0 0 0 3px rgba(0, 0, 255, 0.1);
}
```

## Scroll

### `scroll-behavior: smooth`

Replace scroll-event listeners and GSAP ScrollTrigger for basic smooth scroll.

```css
html {
  scroll-behavior: smooth;
}
```

Native and performant. Works with anchor links and `scrollTo()`.

### `position: sticky`

Pin headers, navigation, or sidebars while scrolling. Replaces scroll-event position tracking.

```css
thead {
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}
```

No scroll listeners needed; browser handles positioning.

### Scroll snap

Snap containers and slide carousels to aligned positions. Replaces custom scroll-sync libraries.

```css
.carousel {
  scroll-snap-type: x mandatory;
  overflow-x: scroll;
}
.carousel-item {
  scroll-snap-align: center;
  scroll-snap-stop: always;
  flex: 0 0 100%;
}
```

`mandatory` requires snapping; `proximity` snaps when close.

### `::scroll-button()` and `::scroll-marker`

Add prev/next arrows and dot indicators to scroll-snap carousels without JavaScript. Pseudo-elements auto-sync with scroll position. Combined with scroll-snap above, a full carousel needs no JS.

```css
@supports selector(::scroll-marker) {
  .carousel {
    scroll-snap-type: x mandatory;
    overflow-x: scroll;
    position: relative;
  }

  .carousel-item {
    scroll-snap-align: center;
    scroll-snap-stop: always;
  }

  .carousel::scroll-button(left) {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
  }

  .carousel::scroll-button(right) {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
  }

  .carousel::scroll-marker-group {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 0.5rem;
  }

  .carousel-item::scroll-marker {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
  }

  .carousel-item:target-current::scroll-marker {
    background: white;
  }
}
```

Without support, the carousel still works via scroll-snap; arrows and dots are absent but swipe/trackpad scrolling remains.

Respect motion preferences; see `prefers-reduced-motion` guard above. Chrome 135+ (2025), Chromium-only, not Baseline.

### `animation-timeline: scroll()` and `view()`

Drive animations from scroll position or element visibility. Replaces ScrollTrigger, Intersection Observer handlers in many cases.

Scroll progress indicator (no scroll listener):

```css
@supports (animation-timeline: scroll()) {
  .progress {
    animation: grow linear;
    animation-timeline: scroll();
  }

  @keyframes grow {
    from {
      width: 0;
    }
    to {
      width: 100%;
    }
  }
}
```

Element visibility animation (replace Intersection Observer):

```css
@supports (animation-timeline: view()) {
  .fade-in {
    animation: fadeIn ease-in-out;
    animation-timeline: view();
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
```

Firefox still catching up on scroll-driven animations. Use `@supports` guard.

### `scrollbar-gutter: stable`

Prevent layout shift when a scrollbar appears (common in modals).

```css
html {
  scrollbar-gutter: stable;
}
```

### `overscroll-behavior: contain`

Stop scroll momentum from propagating to parent (e.g., modal scrolling doesn't scroll body).

```css
.modal {
  overflow-y: auto;
  overscroll-behavior: contain;
}
```

## Layout & Sizing

### `@container` queries

Responsive component layout based on container width, not viewport. Replaces ResizeObserver patterns. Syntax in `css-best-practices`.

### `aspect-ratio`

Lock width-to-height ratio without padding-top hack.

```css
/* ❌ padding-top hack */
.image-container {
  padding-bottom: 56.25%;
}

/* ✅ Aspect ratio */
.image-container {
  aspect-ratio: 16 / 9;
}
img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

### `clamp()`, `min()`, `max()`

Fluid sizing without media queries or resize handlers. Mechanics in `css-best-practices`.

### `field-sizing: content`

Input and textarea grow/shrink with content. Replaces the auto-growing-textarea JavaScript snippet.

```css
textarea {
  field-sizing: content;
  resize: none;
}
```

Newly available - Baseline 2026.

### `interpolate-size: allow-keywords` and `calc-size()`

Animate from 0 to `auto` height or width. Replaces FLIP library patterns.

```css
.collapse {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.collapse.open {
  max-height: calc-size(auto);
}
```

`interpolate-size: allow-keywords` lets `auto` itself participate in a transition, no `calc-size()` needed:

```css
@supports (interpolate-size: allow-keywords) {
  html {
    interpolate-size: allow-keywords;
  }

  .collapse {
    height: 0;
    overflow: hidden;
    transition: height 0.3s ease;
  }

  .collapse.open {
    height: auto;
  }
}
```

Experimental; Chromium-based browsers only. Use `@supports (interpolate-size: allow-keywords)` guard.

### `text-wrap: balance` and `text-wrap: pretty`

Balance headlines across lines; prettier paragraph breaks without JavaScript reflow.

```css
h1 {
  text-wrap: balance;
}

p {
  text-wrap: pretty;
}
```

`balance` widely available. `pretty` no Firefox support, but unsupported values are ignored, so it degrades to normal wrapping with no guard needed.

## Transitions & View Transitions

### `@starting-style` and `transition-behavior: allow-discrete`

Animate properties from their initial state (e.g., fade-in on first render), including discrete properties like `display` that normally can't transition at all.

```css
@supports (transition-behavior: allow-discrete) {
  .card {
    opacity: 0;
    display: none;
    transition:
      opacity 0.3s ease,
      display 0.3s allow-discrete;
  }

  .card.open {
    opacity: 1;
    display: block;
  }

  @starting-style {
    .card.open {
      opacity: 0;
    }
  }
}
```

`allow-discrete` lets `display` participate in the transition instead of flipping instantly. `@starting-style` supplies the pre-open value (`opacity: 0`) so the browser has something to transition from when `.open` is added. Avoids needing a separate "entering" class or setTimeout hack.

### View transitions

Animate between page states or element swaps with automatic transitions. Two distinct mechanisms:

**Same-document** - triggered from JS with `document.startViewTransition()`, no at-rule involved. Style the transition with `view-transition-name` plus the generated pseudo-elements:

```css
.card {
  view-transition-name: card-transition;
}

::view-transition-old(card-transition) {
  animation: fade-out 0.3s ease;
}
::view-transition-new(card-transition) {
  animation: fade-in 0.3s ease;
}
```

This still needs one JS call to start the transition, so it reduces JS rather than eliminating it - but it replaces FLIP animation libraries entirely for the animation itself.

**Cross-document (MPA)** - opts a full-page navigation into a transition, no JS required:

```css
@view-transition {
  navigation: auto;
}
```

Not production-safe yet: Firefox support is still in development.

## Color & Theming

### `light-dark()`

Dark mode without class toggles. Respects `prefers-color-scheme`. Mechanics in `css-best-practices`.

### `color-mix()`

Compute hover, disabled, and focus states without a color library.

```css
--primary: oklch(0.6 0.15 240);

button:hover {
  background: color-mix(in oklch, var(--primary) 85%, white);
}

button:disabled {
  background: color-mix(in oklch, var(--primary) 50%, gray);
}
```

### `accent-color`

Style form controls (checkbox, radio, range) to match your theme.

```css
:root {
  accent-color: oklch(0.6 0.15 240);
}
```

Replaces custom styled inputs in most cases. Safari trails on rendering fidelity for some control types - check current Safari behavior before relying on it there.

## Performance

### `content-visibility: auto`

Skip rendering off-screen content. Replaces virtualization libraries like react-window and TanStack Virtual. Mechanics in `css-best-practices`.

## UX Details

### `100dvh` vs `100vh`

Dynamic viewport height on mobile. Accounts for address bar. Mechanics in `css-best-practices`.

### `prefers-reduced-motion`

Respect user motion preferences. Wrap scroll and motion animations.

```css
.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@media (prefers-reduced-motion: reduce) {
  .fade-in {
    animation: none;
  }
}
```

Always include when animating.

### `::selection` styling

Custom highlight color for user text selection.

```css
::selection {
  background: oklch(0.6 0.15 240);
  color: white;
}
```

### `user-select: none` on interactive UI

Prevent text selection on buttons, toggles, tabs (improves feel).

```css
button,
[role="tab"] {
  user-select: none;
}
```

### Reveal animations with `clip-path: inset()`

Image reveal, word reveal without extra elements.

```css
.reveal {
  animation: reveal 0.6s ease-out forwards;
}

@keyframes reveal {
  from {
    clip-path: inset(0 100% 0 0);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}
```

Wrap with the `prefers-reduced-motion` guard above.

### CSS typewriter effect

Typed text effect without JavaScript libraries.

```css
.typewriter {
  overflow: hidden;
  border-right: 3px solid;
  white-space: nowrap;
  animation:
    type 3s steps(25, end) forwards,
    blink 0.5s step-end infinite;
  width: 25ch;
}

@keyframes type {
  from {
    width: 0;
  }
}

/* Both rules share the 50% offset; the second one wins there, giving a hard
   cut instead of a blend. Don't "simplify" this to non-overlapping offsets. */
@keyframes blink {
  0%,
  50% {
    border-color: transparent;
  }
  50%,
  100% {
    border-color: currentColor;
  }
}
```

Use character count in `steps()` and set width in `ch` (character units). Wrap with the `prefers-reduced-motion` guard above.

### Animated stat counters

Transition numeric values with `@property` and `counter-set`.

```css
@property --counter {
  syntax: "<integer>";
  initial-value: 0;
  inherits: false;
}

.stat {
  --counter: 0;
  counter-set: num var(--counter);
  animation: count-up 2s ease-out forwards;
}

@keyframes count-up {
  to {
    --counter: 1000;
  }
}

.stat::after {
  content: counter(num);
}
```

`counter()` reads a counter name set by `counter-reset`/`counter-set`, not a custom property directly - `counter-set: num var(--counter)` bridges the registered `--counter` value into a real counter so `content: counter(num)` can render it. Not all browsers display the animated value; use as enhancement over static number. Wrap the animation with the `prefers-reduced-motion` guard above.

## Support Strategy

Modern CSS primitives ship staggered across browsers. Use `@supports()` queries to detect support and provide fallbacks.

**Pattern: feature detection with graceful degradation**

```css
/* Base, always works */
.modal {
  position: fixed;
  z-index: 999;
}

/* Enhanced with popover if available */
@supports selector([popover]) {
  [popover] {
    /* Popover code */
  }
}

/* Fallback for old browsers */
@supports not selector([popover]) {
  .modal {
    /* traditional styles */
  }
}
```

Guard scroll and motion features:

```css
@supports (animation-timeline: view()) {
  .fade-in {
    animation: fadeIn ease-in-out;
    animation-timeline: view();
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Principle:** Animate the happy path; degrade gracefully when unsupported. Never let an unsupported feature break core functionality.

## Common Mistakes

| Mistake                                                  | Fix                                                            |
| -------------------------------------------------------- | -------------------------------------------------------------- |
| Using `IntersectionObserver` for simple reveal-on-scroll | Use `animation-timeline: view()` with `@supports` guard        |
| Scroll event listeners for parallax or progress bars     | Use `animation-timeline: scroll()` with `@supports` guard      |
| Manual modal focus management                            | Use `<dialog>` with `showModal()`                              |
| Popper.js for simple popovers                            | Use `popover` attribute with `anchor-name` positioning         |
| JavaScript class toggles for form validation states      | Use `:user-invalid` / `:user-valid` / `:has()` selectors       |
| Custom textarea auto-grow snippet                        | Use `field-sizing: content`                                    |
| Media query breakpoints for component responsiveness     | Use `@container` queries                                       |
| Padding-top hack for aspect ratios                       | Use `aspect-ratio` property                                    |
| Hard-coded values in media queries                       | Use `clamp()` / `min()` / `max()` for fluid sizing             |
| Scroll listeners to track viewport position              | Use `position: sticky` or `scroll-snap-type`                   |
| Hand-rolled carousel JS for arrows and dots              | Use `::scroll-button()` and `::scroll-marker` with scroll-snap |
| AnimateOnScroll library for fade-ins                     | Use `animation-timeline: view()` or `scroll-behavior: smooth`  |
| Forgetting `prefers-reduced-motion` on animations        | Wrap all motion with `@media (prefers-reduced-motion: reduce)` |
| No fallback for unsupported CSS primitives               | Provide base styles; enhance with `@supports` queries          |
