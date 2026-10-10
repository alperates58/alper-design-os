---
name: alper-design-source-ranking
description: Ranks candidate design systems, component libraries, and specialized tools using multi-criteria weighted scoring and generates structured WHY explanations.
---

# Alper Design Source Ranking

This skill performs transparent multi-criteria evaluation to recommend optimal design systems, icon sets, chart libraries, and data grids.

## Workflow

1. **Context Extraction**:
   - Extract domain classification, information density, target framework, and license requirements from `ProductUXProfile`.
2. **Multi-Dimensional Scoring**:
   - Compute weighted scores across 7 dimensions: Trust (20%), Accessibility (20%), Stack Compatibility (15%), Maintenance (15%), Documentation (15%), Domain Alignment (10%), License (5%).
   - Adjust weights dynamically for high-density or industrial applications.
3. **Conflict Resolution**:
   - Resolve known design debates (static top labels vs floating labels; server pagination vs infinite scroll; color+shape status indicators).
4. **Structured Explanation Generation**:
   - Synthesize `RecommendationExplanation` containing primary reason, dimension breakdown, highlights, and caveats.
