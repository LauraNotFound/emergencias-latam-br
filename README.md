# Pronto

Build a mobile-first web app to help Spanish-speaking foreigners navigate emergencies and bureaucracy in Brazil.

Design & UI:
- Minimalist, high contrast, clean white background, primary deep blue (blue-600) for trust and red-500 for emergencies.
- Mobile-first responsive layout with Lucide React icons.

Data structure (mock data):
- Categories: "Salud" (Medical), "Policía/Denuncias", "Registro Migratorio (Polícia Federal)", "Bancos".
- Each category has: id, title, icon name, color, mapSearchQuery (e.g., "hospital", "delegacia de policia", "policia federal", "banco"), and an array of steps.
- Each step has: id, phase (e.g., "Recepción", "Triaje"), phrasePT (Portuguese, bold and prominent), and phraseES (Spanish translation, smaller/subdued).
- Provide realistic steps for all categories, with at least 3 detailed steps for Salud (e.g., "Onde posso receber atendimento médico?", "Quais são os meus sintomas?", "Onde fica a farmácia?").

Views & Flows:
1. Home Screen (Menu):
   - Header "Asistencia Rápida".
   - 2-column grid of category cards with icons, titles, and emergency accents.
   - Tapping a card opens the Category Details Screen.
2. Category Details Screen:
   - Back button at top left to return to Home.
   - Prominent action button: "Buscar [Categoría] cercano" opening Google Maps search in a new tab: https://www.google.com/maps/search/?api=1&query=[mapSearchQuery]
   - Interactive checklist of steps: card for each step with phase badge, phrasePT in large bold text, phraseES below in smaller text, and a checkbox that toggles completed state (strikethrough and reduced opacity). Manage state locally.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://emergencias-latam-br.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/959a05f9-e4c8-4302-8772-6c032e729382).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
