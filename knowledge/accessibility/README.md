# Knowledge Architecture: Accessibility Standards

Authoritative accessibility knowledge sources and guidelines referenced by Alper Design OS.

## Primary Standards

1. **W3C Web Content Accessibility Guidelines (WCAG 2.1 & 2.2)**:
   - Target baseline: Level AA. Level AAA for high-density government & clinical tools.
   - Text contrast ratio: Minimum 4.5:1 (normal text) and 3:1 (large text / graphical UI controls).
   - Target touch sizes: Minimum 24x24 CSS pixels with adequate spacing; 48x48 on touch surfaces.

2. **WAI-ARIA 1.2 Specification**:
   - Semantic roles: `grid`, `treegrid`, `toolbar`, `menu`, `region`, `status`.
   - Focus management: Roving tabindex (`tabindex="0"` for focused cell, `tabindex="-1"` for others).
   - Live regions: `aria-live="polite"` for non-critical recalculation notifications; `aria-live="assertive"` for critical constraint violations.

3. **Section 508 & EN 301 549**:
   - Universal accessibility procurement mandates for enterprise and public sector contracts.
