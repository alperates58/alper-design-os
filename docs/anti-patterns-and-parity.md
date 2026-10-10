# Anti-Patterns and Parity Engine

## 1. Design Anti-Pattern Critic
The Anti-Pattern Critic identifies visual and interaction defects prior to production:
- **Excessive Cards ("Card Soup"):** Wrapping every piece of information in separate isolated cards.
- **Meaningless Gradients:** Distracting decorative gradients in high-density operational software.
- **Glassmorphism Overuse:** Frosted transparent overlays reducing contrast and data legibility.
- **Low Contrast Gray:** Text colors failing the WCAG 2.2 AA 4.5:1 contrast requirement.
- **Tiny Touch Targets:** Interactive elements smaller than 44x44px on mobile viewports.
- **Ambiguous Icon Actions:** Icon-only buttons lacking accessible names or labels.
- **Excessive Modal Nesting:** Stacking modals upon modals instead of using drawers or wizards.

## 2. Cross-Stack Parity Scoring
- **Visual Parity:** Confirms that spacing rhythm, typography, surface colors, and viewport responsiveness align across HTML, React, Blade, and Razor.
- **Behavioral Parity:** Verifies that keyboard shortcuts, focus trapping, dismissal keys, and selection states behave identically across stacks.
- **Accessibility Parity:** Validates that semantic HTML, WAI-ARIA roles, and aria-expanded attributes remain consistent.
