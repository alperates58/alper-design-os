# Modernization Behavioral Preservation Checklist

Prior to modifying any existing codebase during modernization:

## 1. Baseline Invariant Freezing
- [ ] Record all existing HTTP routes and verb mappings.
- [ ] Record public API response formats and error schemas.
- [ ] Record authentication mechanisms (cookies, session keys, JWT headers).
- [ ] Record database schema, table relations, and foreign keys.

## 2. Element Classification Matrix
Classify every candidate component/module into one of:
- **KEEP**: Unchanged core domain logic or stable UI.
- **IMPROVE**: Restyled or enhanced with design tokens, preserving markup semantics.
- **REPLACE**: Deprecated legacy component replaced with modern design system equivalent.
- **DEFER**: High-risk or low-traffic area postponed to subsequent modernization stages.
- **REMOVE**: Dead code or obsolete features with confirmed zero usage.

## 3. Scope Boundary Enforcement
- Strictly forbid uninvited database migrations or backend framework rewrites.
- Every modernization stage must deliver an incrementally buildable, runnable state.
