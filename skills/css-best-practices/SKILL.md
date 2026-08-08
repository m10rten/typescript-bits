---
name: css-best-practices
description: Vanilla CSS best practices — cascade, custom properties, layout decisions, modern selectors, responsive strategy, accessibility, and performance
---

# CSS Best Practices

Authored CSS for production. No frameworks, no utilities. Real cascade, real selectors, real performance.

## Cascade & Specificity

Never use `!important`. It breaks the cascade and makes overrides harder.

**Specificity tiers:**

- Element selectors: `p { }`
- Class selectors: `.heading { }`
- ID selectors: `#main { }` (rarely needed; prefer classes)

Stack specificity intentionally. Low specificity wins by loading order; high specificity wins always.

```css
/* ❌ Brittle override */
.button {
  color: blue !important;
}
.primary {
  color: red;
}

/* ✅ Layered intent */
@layer base {
  .button {
    color: blue;
  }
}

@layer theme {
  .button.primary {
    color: red;
  }
}
```

**Use `@layer` to organize intent:**

- `@layer base` - element defaults and resets
- `@layer utilities` - single-purpose rules
- `@layer components` - higher-level patterns
- Custom layers for your domain (theme, layout, state)

Later layers override earlier ones, regardless of file order. Declare layer names once at the top.

## Custom Properties (CSS Variables)

Scoped, inherited, accessible to JavaScript. No build step.

```css
:root {
  --color-primary: oklch(0.6 0.15 240);
  --spacing-unit: 1rem;
  --font-family-sans: system-ui, sans-serif;
}

.card {
  --card-padding: calc(var(--spacing-unit) * 1.5);
  padding: var(--card-padding);
}
```

**Defaults & fallbacks:**

```css
/* Fallback if variable undefined */
color: var(--text-color, #333);

/* Multiple fallbacks */
font-family: var(--font-family-serif, Georgia, serif);
```

**Theming without extra markup:**

```css
:root {
  --bg: white;
  --text: #222;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #1a1a1a;
    --text: #ddd;
  }
}

body {
  background: var(--bg);
  color: var(--text);
}
```

**Use `@property` for non-string values with transitions:**

```css
@property --rotation {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

.spinner {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  to {
    --rotation: 360deg;
  }
}
```

## Layout: Flexbox vs Grid

**Flexbox:** one dimension (row or column), content-driven, wrapping.

```css
.navbar {
  display: flex;
  gap: 1rem;
}
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
```

**Grid:** two dimensions, structure-first, explicit placement.

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

/* Auto-flow for responsive without media queries */
.grid-auto {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
```

**Subgrid** for nested alignment:

```css
.card {
  display: grid;
  grid-template-columns: auto 1fr;
}
.card-body {
  display: grid;
  grid-column: 1 / -1;
}
/* Aligns with parent's columns */
.card-body-inner {
  display: contents;
}
```

**Intrinsic sizing without breakpoints:**

```css
/* Scale content naturally */
.container {
  width: min(90vw, 1200px);
}

/* Flexible, responsive widths */
.sidebar {
  width: clamp(250px, 25vw, 400px);
}

/* Two-column that wraps at smaller sizes */
.columns {
  display: grid;
  grid-template-columns: minmax(300px, 1fr) minmax(300px, 1fr);
}
```

## Modern Selectors

**`:has()` - parent selector**

```css
/* Style label if checkbox inside is checked */
label:has(input:checked) {
  font-weight: bold;
}

/* Style section if it has a heading */
section:has(h2) {
  margin-top: 2rem;
}
```

**`:is()` and `:where()` - group selectors (`:where()` has 0 specificity)**

```css
/* Instead of: h1, h2, h3, h4, h5, h6 { } */
:is(h1, h2, h3, h4, h5, h6) {
  line-height: 1.2;
}

/* :where() for resets (doesn't increase specificity) */
:where(ul, ol) {
  list-style: none;
}
```

## Responsive Strategy

**Mobile-first:** base styles apply everywhere; larger screens get adjustments.

```css
.grid {
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

**Container queries** (not media queries) for component-level responsiveness:

```css
@container (min-width: 300px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
```

Use media queries for global viewport breakpoints; container queries for component behavior that should adapt to available space.

## Logical Properties

Replace physical directions with logical ones. They respond to writing direction (LTR, RTL).

```css
/* ❌ Physical */
.box {
  margin-left: 1rem;
  padding-right: 2rem;
}

/* ✅ Logical */
.box {
  margin-inline-start: 1rem;
  padding-inline-end: 2rem;
}
```

| Physical | Logical        | Use case               |
| -------- | -------------- | ---------------------- |
| `left`   | `inline-start` | Horizontal spacing     |
| `right`  | `inline-end`   | Horizontal spacing     |
| `top`    | `block-start`  | Vertical spacing       |
| `bottom` | `block-end`    | Vertical spacing       |
| `width`  | `inline-size`  | Width (respects flow)  |
| `height` | `block-size`   | Height (respects flow) |

## Modern Units & Color

**Relative units for scaling:**

```css
/* rem scales with root font-size */
.heading {
  font-size: 2rem;
}

/* em scales with element's font-size */
.box {
  padding: 1.5em;
}

/* dvh/svh avoid mobile address bar issues */
.hero {
  min-height: 100dvh;
}

/* Avoid px for font; use rem or em */
body {
  font-size: 1rem; /* 16px */
}
```

**Modern color with oklch:**

```css
/* oklch is perceptually uniform, works in dark mode */
--primary: oklch(0.6 0.15 240);

/* color-mix for computed tints/shades */
--primary-light: color-mix(in oklch, var(--primary) 70%, white);
--primary-dark: color-mix(in oklch, var(--primary) 70%, black);
```

## Dark Mode

**Prefer `light-dark()`:**

```css
:root {
  color-scheme: light dark;
  --bg: light-dark(white, #1a1a1a);
  --text: light-dark(#222, #ddd);
}

body {
  background: var(--bg);
  color: var(--text);
}
```

**Fallback if `light-dark()` not supported:**

```css
:root {
  --bg: white;
  --text: #222;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #1a1a1a;
    --text: #ddd;
  }
}
```

## Accessibility

**Focus visible:**

```css
button:focus-visible {
  outline: 3px solid var(--focus-color);
  outline-offset: 2px;
}

/* Hide focus for mouse users, show for keyboard */
button:focus:not(:focus-visible) {
  outline: none;
}
```

**Minimum touch target (48x48px):**

```css
button {
  min-width: 48px;
  min-height: 48px;
}
```

**Respect motion preferences:**

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Color contrast:** Ensure text-to-background contrast meets WCAG AA (4.5:1 for small text).

## Performance

**Animate only compositor-friendly properties:**

```css
/* ✅ GPU accelerated */
.slide {
  animation: slide 0.3s ease-out;
}
@keyframes slide {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

/* ❌ Triggers reflow */
.slide {
  animation: slide 0.3s ease-out;
}
@keyframes slide {
  from {
    left: -100px;
  }
  to {
    left: 0;
  }
}
```

Safe properties: `transform`, `opacity`, `filter`. Avoid: `width`, `height`, `top`, `left`, `margin`, `padding`.

**Reduce layout work:**

```css
/* Will-change: only on elements that actually animate */
.animated {
  will-change: transform;
}
```

**Content visibility for long pages:**

```css
/* Skip rendering off-screen content */
.section {
  content-visibility: auto;
  contain-intrinsic-size: auto 800px;
}
```

## Organization & Naming

Keep CSS close to usage. Use consistent naming conventions.

```css
/* BEM for clarity */
.card {
  /* block */
}
.card__header {
  /* element */
}
.card--featured {
  /* modifier */
}
```

Use `@layer` to separate concerns, not files.

```css
@layer base {
  /* resets */
}
@layer components {
  /* .card, .button */
}
@layer utilities {
  /* single-purpose */
}
```

## Common Mistakes

| Mistake                                          | Fix                                                     |
| ------------------------------------------------ | ------------------------------------------------------- |
| Using `!important` to override                   | Rely on cascade; use `@layer`                           |
| Hardcoded colors instead of variables            | Use custom properties for theming                       |
| Media queries for component responsiveness       | Use container queries                                   |
| Physical properties (left/right) globally        | Use logical properties for i18n support                 |
| Animating non-GPU properties                     | Transform and opacity only; avoid width/height/position |
| Forgetting focus-visible on interactive elements | Always include focus states                             |
| No fallbacks for custom properties               | Provide sensible defaults                               |
| Mixing px and rem inconsistently                 | Use rem for scaling; px sparingly                       |
| Assuming dark mode without `color-scheme`        | Set `color-scheme: light dark` at root                  |
