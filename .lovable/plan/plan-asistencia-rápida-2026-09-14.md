# Plan: Asistencia Rápida

## Experience
- Replace the blank first screen with a Spanish-language emergency and bureaucracy guide for foreigners in Brazil.
- Use a mobile-first, high-contrast interface with a white background, deep blue trust cues, and red emergency accents.
- Keep the home view focused on a two-column category menu: Salud, Policía/Denuncias, Registro Migratorio, and Bancos.

## Navigation and interactions
- Open each category in an in-app detail view while preserving a simple back action to the menu.
- Add a prominent category-specific button that opens the correct Google Maps search in a new tab.
- Present each process as a locally managed checklist; completed steps become subdued and struck through.
- Include clear focus, pressed, and completed states for touch and keyboard use.

## Content
- Create structured mock data for all four categories, including icon, color role, map search term, and realistic Portuguese/Spanish phrases.
- Provide at least three detailed steps per category, with Portuguese emphasized and Spanish supporting it.

## Technical details
- Build the interface in the existing TanStack Start index route with React local state.
- Use Lucide icons and semantic design tokens defined in the global stylesheet.
- Add route-specific page metadata and accessible labels.
- Verify the result at mobile and desktop sizes, including category navigation, checklist toggling, and the outbound Maps link.
