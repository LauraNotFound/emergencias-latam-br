# Plan: Portuguese audio and translation actions

## Phrase playback
- Add a speaker control beside every Portuguese phrase in the category checklists.
- Use the browser’s native speech engine with Brazilian Portuguese (`pt-BR`).
- Show a clear active state with animated sound bars while speaking, stop previous playback before starting another phrase, and reset when playback ends or errors.
- Keep checklist completion separate so audio controls do not toggle a step.

## Google Translate
- Add a compact external Translate action on every phrase card.
- Open Google Translate in a new tab with Portuguese as the source and the active interface language (Spanish or English) as the target.
- Encode phrase text safely in the URL.

## Suggestion form
- Add audio preview and Google Translate actions for the Portuguese phrase currently typed into the form.
- Disable both actions until enough phrase text has been entered.
- Preserve bilingual labels and light/dark styling.

## Verification
- Check playback state and generated Google Translate URLs in Spanish and English.
- Verify the checklist still toggles independently and controls fit on phone and desktop layouts.
