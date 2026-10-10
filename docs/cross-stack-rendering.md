# Cross-Stack Rendering

## 1. Multi-Target Strategy
Alper Design OS targets four production stacks from a single canonical blueprint:

| Target Stack | Output Format | Interactivity Pattern |
|---|---|---|
| `html-css-js` | Semantic HTML5 + CSS Variables | Accessible Vanilla JS |
| `react-typescript` | Strict TypeScript React (.tsx) | Clean Functional Components + Hooks |
| `laravel-blade` | Blade Components (`<x-ui.*>`) | Blade + Optional Alpine.js |
| `aspnet-razor` | Razor Partials (`.cshtml`) + Tag Helpers | Razor ViewModels + Vanilla JS |

## 2. Rendering Quality Standards
1. Zero inline styles; all styling maps through CSS variables.
2. Zero random hex colors; all colors bind to canonical semantic tokens.
3. Every dialog and drawer implements keyboard focus trapping and `Escape` key dismissal.
4. Density modes (`COMPACT`, `COMFORTABLE`, `SPACIOUS`) adjust table rows, inputs, and font sizes without layout breakage.
