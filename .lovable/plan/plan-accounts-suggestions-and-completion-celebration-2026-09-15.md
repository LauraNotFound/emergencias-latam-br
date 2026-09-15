# Plan: Accounts, suggestions, and completion celebration

## Completion celebration
- Detect the first transition to a fully completed category checklist.
- Show a short, accessible celebratory badge with lightweight confetti, while respecting reduced-motion settings.
- Reset eligibility when an item is unchecked so completing the list again can be acknowledged.

## Accounts
- Add an ES/EN account dialog supporting email/password registration and sign-in, plus Google sign-in.
- Keep the header account control synchronized with session state and provide secure sign-out.
- Keep email confirmation enabled and clearly tell new users to confirm their email before signing in.
- Use email-only accounts; no profile table will be created.

## Suggestions
- Add an ES/EN “Suggest a phrase” entry point available from the main and category views.
- Require sign-in before showing the submission form, then collect category, Portuguese phrase, Spanish or English meaning, and optional context/phase notes.
- Validate field lengths and required values before saving, show success/error states, and retain the intended suggestion flow through sign-in.

## Lovable Cloud and security
- Create a user-owned suggestions table with explicit access grants and row-level policies permitting authenticated users to submit and read only their own suggestions.
- Link ownership to the authenticated account in the database rather than accepting a user ID from the form.
- Keep account and suggestion handling within Lovable Cloud’s generated integration.

## Verification
- Verify registration/sign-in presentation, signed-out gating, signed-in submission, stored ownership, sign-out, completion celebration, language switching, and both themes.
- Check phone and desktop layouts, preview errors, database policies, and accessibility behavior.
