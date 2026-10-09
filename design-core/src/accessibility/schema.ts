import { z } from 'zod';

export const ContrastRatioRuleSchema = z.object({
  context: z.string(),
  minimumRatio: z.number(),
  wcagLevel: z.enum(['AA', 'AAA'])
});
export type ContrastRatioRule = z.infer<typeof ContrastRatioRuleSchema>;

export const AccessibilityAuditRuleSchema = z.object({
  id: z.string(),
  name: z.string(),
  severity: z.enum(['CRITICAL', 'WARNING', 'SUGGESTION']),
  description: z.string(),
  remediation: z.string()
});
export type AccessibilityAuditRule = z.infer<typeof AccessibilityAuditRuleSchema>;

export const coreAccessibilityRules: AccessibilityAuditRule[] = [
  {
    id: 'A11Y-001-CONTRAST',
    name: 'Text Contrast Ratio',
    severity: 'CRITICAL',
    description: 'Normal text must achieve at least 4.5:1 contrast against its background; large text 3:1.',
    remediation: 'Increase contrast using semantic surface tokens (--color-surface-base / --color-text-primary).'
  },
  {
    id: 'A11Y-002-KEYBOARD-NAV',
    name: 'Interactive Element Keyboard Focusability',
    severity: 'CRITICAL',
    description: 'Every actionable button, link, grid row, and Gantt node must be reachable and operable via keyboard.',
    remediation: 'Ensure tabindex="0" or native button/link tags; verify visible focus outline ring.'
  },
  {
    id: 'A11Y-003-ARIA-LIVE',
    name: 'Dynamic Constraint Alert Announcements',
    severity: 'WARNING',
    description: 'Asynchronous constraint violations and rescheduling recalculations must announce to assistive tech.',
    remediation: 'Use aria-live="assertive" for critical errors and aria-live="polite" for status confirmations.'
  },
  {
    id: 'A11Y-004-FORM-LABELS',
    name: 'Explicit Input Label Association',
    severity: 'CRITICAL',
    description: 'Every input in parameter panels and modals must have an associated <label> or aria-label.',
    remediation: 'Provide for="" attribute referencing input id, or add explicit aria-label.'
  }
];
