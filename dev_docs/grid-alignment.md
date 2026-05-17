# Grid Alignment & Smart Snapping Guide

This project uses a custom **Smart Snapping** system designed to align all elements to a visual `4rem` (64px) grid. The system uses a combination of CSS variables, a global JavaScript "Snapper," and specific HTML data attributes.

## 1. The Core System
The grid is defined in `src/styles/global.css`:
- `--grid-size: 4rem;`: The primary grid unit.
- `--sub-grid: 1rem;`: The fractional unit for fine-tuned spacing.

## 2. Making an Element Align
To make any element or group of elements align to the grid, use the following attributes:

### `data-snap="block"` (The Vertical Logic)
Any element with this attribute is picked up by the **Smart Snapper** script in `Layout.astro`.
- **What it does:** It measures the natural height of the element and "inflates" it to the next multiple of `4rem`.
- **Centering:** It then uses Flexbox to perfectly center the content vertically within that grid space.
- **Usage:** Wrap any logical group (a header, a paragraph, or a list) in a `div` or `section` with this attribute.

### `data-snap-align="left | center | right | fill"` (The Horizontal Logic)
Controls how the snapped block behaves horizontally within the grid container:
- **`left`** (Default): Snaps to the content width and aligns to the **center left** (vertically centered on the grid cell, horizontally left-aligned). Brackets hug the content.
- **`center`**: Snaps to the content width and centers horizontally. Brackets hug the centered content.
- **`right`**: Snaps to the content width and aligns to the right. Brackets hug the content on the right.
- **`fill`**: Forces the block to stretch `100%` of the width. Brackets stretch edge-to-edge.

### `class="show-snap"` (The Visual Logic)
Adding this class enables the **Blueprint Design** features:
- **Corner Brackets:** Bold L-shaped markers that hug the content corners (with custom 4px offset).
- **Dimension Lines:** Dotted lines that measure the "gap" between the content and the horizontal grid lines.
- **Horizontal Lines:** Dashed lines that span the full width of the viewport.

## 3. Implementation Example

```html
<!-- Pinned to the top-left, content hugged -->
<div data-snap="block" data-snap-align="left" class="show-snap">
    <h1>Vincent Sanicolas</h1>
</div>

<!-- Centered content with brackets hugging only the centered text -->
<div data-snap="block" data-snap-align="center" class="show-snap">
    <p>This paragraph is centered on the blueprint.</p>
</div>

<!-- Full-width block with brackets reaching the layout edges -->
<div data-snap="block" data-snap-align="fill" class="show-snap">
    <h2>Full Width Section</h2>
</div>
```

## 4. Horizontal Alignment (The Magic Nudge)
Horizontal alignment is handled automatically at the `<main>` level. 
- The JS script calculates the remainder of the centered margins and applies a `translateX` nudge.
- It uses `document.documentElement.clientWidth` to account for scrollbars, ensuring the grid doesn't drift when the page gets long.

## 5. Scrolling Context
The background grid is set to `position: absolute` on the `body`. This ensures that as the user scrolls, the grid travels with the content, maintaining the "snapped" alignment for all elements, even those deep within the page.

## 6. Flash of Un-Snapped Content (FOUSC) Prevention
To prevent layout shifting or "jumps" during initial page loads and transitions:
- An inline script in the `<head>` of `Layout.astro` immediately marks the browser context as `js-active`.
- An inline, synchronous `<style is:inline>` block enforces `opacity: 0 !important` on `<main>` immediately during initial HTML parsing. This guarantees the content is hidden during the first paint, bypassing asynchronous stylesheet injection delays caused by Vite's dev server client.
- Once the Smart Snapper finishes measuring and padding blocks, it adds the `grid-snapped` class, smoothly fading the entire layout in at its **exact final snapped coordinate** in `150ms`.
- For users with JS disabled, a standard `<noscript>` style guarantees fallback visibility.

---

**Note:** If you add new elements that aren't snapping, ensure they are wrapped in a `data-snap="block"` container. The `ResizeObserver` in `Layout.astro` will handle the rest automatically.
