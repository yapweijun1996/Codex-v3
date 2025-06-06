## Improvement Checklist — Component: Top Bar Header
- [x] Reorder markup so the sidebar toggle button appears after the title. This keeps the toggle on the right side naturally for mobile users.
- [x] Add a small media query to confirm the button stays right aligned on narrow screens.
- [x] Ensure `aria-label` and `aria-expanded` attributes update when toggling to maintain accessibility.
- [x] Provide keyboard focus styles and ensure the toggle is reachable with `Tab`.
- [x] Use CSS `order` or layout utilities to keep spacing consistent when additional controls (e.g. theme toggle) are present.
- [x] Consider minifying JavaScript to speed up header load times on mobile.
- [x] Document header component usage in `README` to aid future maintenance.

## Improvement Checklist — Component: Dashboard Table Placeholder
- [x] Move `#table-skeleton` markup inside the `.dashboard-grid` so the placeholder appears in the same position as the table.
- [x] Replace the unique ID with a `.table-skeleton` class for reuse and easier styling.
- [x] Provide a proper `<label>` for the filter input and group it with the table to improve accessibility.
- [x] Consider wrapping the skeleton and table inside a region marked `aria-live="polite"` so screen reader users know when data loads.
- [x] Ensure the skeleton width adapts with the table on narrow screens for better responsiveness.
- [x] Trigger skeleton removal after real data is fetched rather than a fixed `setTimeout` to improve perceived performance.
- [x] Document the loading logic in `pages-plan.md` to assist future maintenance.

## Improvement Checklist — Component: Sidebar Link Loader
- [x] Extract loader markup into a dedicated overlay element and include it on all pages.
- [x] Provide showLoader() and hideLoader() functions in `script.js` to keep logic centralized.
- [x] Add `role="status"` and `aria-live="polite"` to the loader so screen readers announce loading state.
- [x] Ensure the loader overlay covers the viewport and centers the spinner responsively on mobile and desktop.
- [x] Fade the loader in/out to maintain consistent UX when navigating between pages.
- [x] Keep CSS animation lightweight to minimize layout thrashing and improve performance.
- [x] Document usage of the loader in `pages-plan.md` for maintainability.

## Improvement Checklist — Component: Theme Responsiveness
- [x] Replace hardcoded colors in the header, sidebar, and other sections with CSS variables so both themes stay consistent (e.g. lines 44 and 86 in `style.css`).
- [x] Remove `user-scalable=no` from the viewport meta tag to allow pinch‑zoom on mobile (see line 5 in `index.html`).
- [x] Use a consistent sidebar width variable to avoid the 200px/250px mismatch in the desktop breakpoint (lines 151‑160 of `style.css`).
- [x] Add `aria-pressed="true/false"` to the theme toggle button for better screen reader feedback (see `header.js` lines 11‑16).
- [x] Apply the saved theme class before the page renders to avoid flashes of incorrect colors (`applyTheme()` in `script.js`).
- [x] Document theming decisions in `README.md` so future updates remain maintainable.

## Improvement Checklist — Component: Settings Page
- [x] Remove `user-scalable=no` from the viewport meta tag to allow pinch-zoom.
- [x] Add `for` and `id` attributes on form labels and inputs for better accessibility.
- [x] Mark sidebar emoji icons with `aria-hidden="true"` to avoid screen reader noise.
- [x] Apply a responsive max-width to the form so fields scale nicely on phones.
- [x] Defer loading of `header.min.js` and `script.js` to improve initial render time.
- [x] Move the theme setup script into `script.js` for easier maintenance.
