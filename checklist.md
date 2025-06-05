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
