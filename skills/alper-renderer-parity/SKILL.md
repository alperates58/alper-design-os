---
name: alper-renderer-parity
description: Cross-stack parity verification engine comparing visual hierarchy, interaction behavior, accessibility contracts, and asset footprints.
---

# Alper Renderer Parity Engine

## Purpose
Ensures that the same canonical UI blueprint yields equivalent quality, visual rhythm, interaction contracts, and accessibility compliance regardless of target stack (HTML, React, Laravel Blade, ASP.NET Razor).

## Parity Metrics
1. **`VisualParityScore` (0-100):** Measures layout alignment, typographic scale, spacing rhythm, and responsive breakpoint behavior across stacks.
2. **`BehavioralParityScore` (0-100):** Verifies that button activations, modal focus traps, drawer slide-outs, and table selections function consistently.
3. **`AccessibilityParityScore` (0-100):** Validates that all renderers output identical WAI-ARIA roles, aria-expanded states, and keyboard navigation capabilities.
4. **`OverallParityScore` (0-100):** Weighted composite parity score.

## Asset Performance Inspection
Measures asset footprint across stacks:
- HTML / markup size (bytes)
- Compiled CSS size (bytes)
- Client-side JS footprint (bytes)
- External dependency count (flags unnecessary framework bloat)
