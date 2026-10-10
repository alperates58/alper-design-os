# Token Architecture V2

## 1. Three-Level Hierarchy
- **Level 1 (Primitive Tokens):** Raw values (`color.blue.600`, `space.4`, `radius.md`, `motion.normal`).
- **Level 2 (Semantic Tokens):** Intent-based references supporting `LIGHT`, `DARK`, and `HIGH_CONTRAST` (`surface.default`, `text.primary`, `action.primary`, `status.critical`, `focus.ring`).
- **Level 3 (Component Tokens):** Specific component bindings (`button.primary.background`, `table.header.background`).

## 2. DTCG Format Compliance
Tokens are exported in DTCG (Design Tokens Community Group) JSON format, compiled into:
- CSS Variables (`:root`, `[data-theme="dark"]`, `[data-theme="high-contrast"]`, `[data-density="compact"]`)
- Strict TypeScript constants (`AlperTokens`)
- Tailwind CSS theme extension
- SCSS variables

## 3. Drift Detection
The Token Drift Detector inspects stylesheets and components to identify:
- Hardcoded hex colors bypassing semantic tokens
- Magic pixel spacing values violating the 4px rhythmic scale
- Raw inline style attributes
