# Truthful UI & Data Provenance Evaluation Guide

Enforcing the universal invariant: **NO CLAIM WITHOUT EVIDENCE** in user interfaces.

## 1. Data Provenance Verification
- Trace every KPI, chart series, and dashboard metric to an authentic database table or API source.
- Prohibit hardcoded mock statistics presented as real operational data.

## 2. Page Intent & Content Relevance
- Audit page layouts against declared user jobs-to-be-done.
- Eliminate visual bloat, irrelevant decorative metrics, and ungrounded placeholders.

## 3. Content Truth Gate
- If backend data is missing or empty, render an explicit, truthful empty state.
- Never fake high health scores (e.g. hardcoding 90% test coverage) without underlying telemetry evidence.
