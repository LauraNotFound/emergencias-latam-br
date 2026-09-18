# Approved phrase sync

## Scope
- Keep the eight built-in guides visible immediately.
- Load approved Spanish/Portuguese phrases from the existing Google Apps Script after the page mounts.
- Preserve local checklist progress, completion celebration, and conditional reset behavior for both built-in and approved phrases.

## Implementation
1. Move the category collection into component state initialized from the existing static data.
2. Fetch the approved phrase array in a mount-only effect without adding a loading screen.
3. Validate and normalize each response entry, matching its category by ID, Spanish title, or Portuguese title after trimming, lowercasing, and removing accent differences.
4. Append valid, non-duplicate entries with stable generated IDs and “Comunidad” / “Comunidade” phase labels.
5. Ignore malformed, unknown, duplicate, aborted, or failed responses so the built-in experience remains fully usable.
6. Keep checklist storage keyed per category and calculate completion against the updated step list.
7. Remove regenerated account/backend integration remnants and verify the live page, persistence, completion, and reset flow with a mocked endpoint response.

## Technical details
- Use an `AbortController` during effect cleanup.
- Generate deterministic IDs from category and phrase content so checked approved phrases survive refresh when the endpoint order changes.
- Update category state once per successful response to avoid flicker and repeated appends.
