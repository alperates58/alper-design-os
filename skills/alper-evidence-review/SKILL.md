---
name: alper-evidence-review
description: Validates claims against 13 concrete evidence types; prohibits unbacked assertions like 'tamamen test edildi' or 'production ready'.
---

# Alper Evidence Review Skill

Audits completion assertions against structured verification artifacts.

## Core Directives
1. **13 Evidence Types**:
   - `BUILD_OUTPUT`, `TEST_RESULT`, `SCREENSHOT`, `VISUAL_DIFF`, `CONSOLE_LOG`, `NETWORK_TRACE`, `PERFORMANCE_TRACE`, `ACCESSIBILITY_REPORT`, `SECURITY_REPORT`, `DATABASE_ANALYSIS`, `API_CONTRACT_RESULT`, `STATIC_ANALYSIS`, `GIT_DIFF`.
2. **Claim Verification Policy**:
   - Prohibit unbacked phrases: "Tamamen test edildi", "Responsive çalışıyor", "Security sorunu yok", "Performance iyi", "Production ready".
   - Assign strict statuses: `VERIFIED`, `PARTIALLY_VERIFIED`, `NOT_VERIFIED`, `NOT_APPLICABLE`, `FAILED`.
3. **Viewport Matrix for Responsive**:
   - Responsive claims require verified runs at 390x844, 768x1024, 1440x900, 1920x1080.
