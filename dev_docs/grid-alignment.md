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

### `class="show-snap"` (The Visual Logic)
Adding this class enables the **Blueprint Design** features:
- **Corner Brackets:** Bold L-shaped markers that hug the content corners.
- **Dimension Lines:** Dotted lines that measure the "gap" between the content and the horizontal grid lines.
- **Horizontal Lines:** Dashed lines that span the full width of the viewport.

## 3. Implementation Example

```html
<!-- A granular group that will occupy at least 4rem of vertical space -->
<div data-snap="block" class="show-snap">
    <h1>Project Title</h1>
</div>

<!-- A larger group that might occupy 8rem or 12rem depending on text length -->
<div data-snap="block" class="show-snap">
    <p>This long description will be measured by JS and padded to the grid.</p>
</div>
```

## 4. Horizontal Alignment (The Magic Nudge)
Horizontal alignment is handled automatically at the `<main>` level. 
- The JS script calculates the remainder of the centered margins and applies a `translateX` nudge.
- This ensures the left edge of your content always starts exactly on a vertical grid line.

## 5. Components (e.g., Chips)
Individual components like `Chip.astro` have their own "hugging" logic. 
- They use `border-radius: 0` and specific padding to fit the blocky aesthetic.
- They are typically placed *inside* a `data-snap="block"` group to handle their overall vertical rhythm.

---

**Note:** If you add new elements that aren't snapping, ensure they are wrapped in a `data-snap="block"` container. The `ResizeObserver` in `Layout.astro` will handle the rest automatically.
