---
name: alper-design-personality
description: Quantitative 6-axis design personality engine preventing generic AI design clichés and tailoring UI to real UX profiles.
---

# Alper Design Personality Engine

## Purpose
Prevents superficial AI design aesthetics (such as wrapping everything in loud gradients, frosted glassmorphism, or oversized whitespace). It computes 6 continuous quantitative axes (-100 to +100) based on contextual product attributes.

## The 6 Quantitative Personality Axes
1. **Reserved (-100) ↔ Expressive (+100):** Utility-first neutral surfaces vs. expressive brand accents.
2. **Compact (-100) ↔ Spacious (+100):** High-density tabular layout vs. generous editorial breathing room.
3. **Technical (-100) ↔ Editorial (+100):** Raw technical scanability vs. narrative storytelling and media.
4. **Neutral (-100) ↔ Branded (+100):** Transparent system UI vs. distinct branded visual identity.
5. **Flat (-100) ↔ Layered (+100):** Crisp borders and flat surfaces vs. multi-level elevation and drop shadows.
6. **Static (-100) ↔ Animated (+100):** Instant static state transitions vs. rich choreographed motion.

## Anti-Pattern Detection
The Design Critic automatically scans outputs for:
- "Dashboard card soup" (excessive fragmented cards in dense data tools)
- Meaningless decorative linear gradients
- Low-contrast text failing WCAG 2.2 AA (4.5:1)
- Tiny touch targets on mobile viewports (<44px)
- Multiple nested modal dialogs
