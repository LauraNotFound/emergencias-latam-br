# System Audit & MVP Finalization

## Scope
- Keep the Pronto experience fully local, responsive, and free of accounts or backend dependencies.
- Preserve the eight required categories, per-category checklist persistence, completion celebration, and conditional reset.
- Upgrade the category suggestion dialog to collect Spanish, Portuguese, and English phrases and submit directly to the provided Google Script.

## Implementation
1. Remove regenerated account/backend integration files and confirm no account controls or code remain.
2. Audit the home and detail layouts for fluid desktop widths, the minimal three-control navbar, all eight categories, and safe Google Maps deep links.
3. Replace the suggestion form with a three-language source selector and controlled fields for the source phrase plus both translations.
4. Send category, source language, all three language values, source phrase, translation values, and an ISO timestamp using `fetch` with `mode: "no-cors"`.
5. Add a disabled loading state with spinner, an inline error state, and an in-modal success confirmation before automatically closing and resetting the form.
6. Verify mobile and desktop layout, checklist persistence/reset visibility, Maps links, modal behavior, and the submission payload using the running preview.

## Technical details
- Use existing design-system controls and semantic color tokens.
- Keep checklist data in `localStorage`; no database or authentication.
- Treat a resolved opaque `no-cors` request as submitted because the Google Script response cannot be read by the browser.
