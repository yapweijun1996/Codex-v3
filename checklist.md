## Improvement Checklist — Component: Top Bar Header
- [x] Reorder markup so the sidebar toggle button appears after the title. This keeps the toggle on the right side naturally for mobile users.
- [x] Add a small media query to confirm the button stays right aligned on narrow screens.
- [x] Ensure `aria-label` and `aria-expanded` attributes update when toggling to maintain accessibility.
- [x] Provide keyboard focus styles and ensure the toggle is reachable with `Tab`.
- [x] Use CSS `order` or layout utilities to keep spacing consistent when additional controls (e.g. theme toggle) are present.
- [x] Consider minifying JavaScript to speed up header load times on mobile.
- [x] Document header component usage in `README` to aid future maintenance.
