# Page Plan

This document outlines suggested content and improvements for each page in the admin panel.

## Dashboard (index.html)
- [x] Overview heading and short welcome message.
- [x] Data table of users with sorting and filtering tools.
- [x] Sorted column headers update `aria-sort` for accessibility.
- [x] Placeholder skeleton rows shown while data loads.
- [x] Loading logic removes the skeleton after data is fetched via a Promise.
- [x] Responsive grid layout using simple CSS grid.
- [x] Accessible color scheme with dark and light themes.
- [ ] Smooth sidebar animation using CSS transforms.
- [ ] Refine mobile sidebar so close button doesn't overlap items.
- [ ] Prevent zooming to keep layout stable on phones.

## Settings (settings.html)
- [x] Form fields for profile details with validation.
- [x] Toast notification when changes are saved.
- [x] Consistent spacing and margins across inputs.

## Reports (reports.html)
- [x] Chart.js graphs summarizing visitor data.
- [x] Options to switch between different report ranges.

## Users (users.html)
- [x] Dedicated page for adding, editing and deleting users.
- [x] Reuses table sorting and filtering from the dashboard.
- [x] Modal forms manage user details.

## Analytics (analytics.html)
- [x] Line and pie charts powered by Chart.js.
- [x] Date range picker updates both charts on apply.

## Loader Overlay
- The `page-loader` element shows a spinner during page transitions.
- Call `showLoader()` before navigation and `hideLoader()` once the new page has loaded.

## Future Pages
- **Profile** – personal account settings and password changes.

These plans build on the existing checklist and keep the overall dark theme while adding more robust features.
