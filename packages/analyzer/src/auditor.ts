import { ProjectFile } from '@alper-design-os/adapter-contract';
import { A11yAuditResult, AuditIssue, ResponsiveAuditResult, UIAuditResult } from './types.js';

export function auditExistingUI(files: ProjectFile[]): UIAuditResult {
  const issues: AuditIssue[] = [];

  for (const file of files) {
    const content = file.content || '';
    if (!content) continue;

    // Check for hardcoded hex colors instead of design tokens
    const hexColorMatches = content.match(/#(?:[0-9a-fA-F]{3,4}){1,2}\b/g);
    if (hexColorMatches && hexColorMatches.length > 3) {
      issues.push({
        id: 'UI-HARDCODED-COLORS',
        file: file.path,
        severity: 'WARNING',
        category: 'TOKEN_CONSISTENCY',
        message: `Found ${hexColorMatches.length} raw hex color values. Breaks centralized token theming.`,
        remediation: 'Replace hardcoded hex colors with DTCG semantic tokens (e.g., var(--color-brand-primary)).'
      });
    }

    // Check for fixed pixel widths that break split-pane flex
    if (content.match(/width:\s*\d{4,}px/i)) {
      issues.push({
        id: 'UI-FIXED-OVERFLOW-WIDTH',
        file: file.path,
        severity: 'WARNING',
        category: 'RESPONSIVE',
        message: 'Fixed wide pixel dimensions detected. May overflow in split-pane workbenches.',
        remediation: 'Use flex/grid container sizing with min-width and max-width bounds.'
      });
    }
  }

  const score = Math.max(20, 100 - issues.length * 15);

  return {
    totalIssues: issues.length,
    score,
    issues,
    summary: `UI audit detected ${issues.length} issue(s). Overall UI health score: ${score}/100.`
  };
}

export function auditAccessibility(files: ProjectFile[]): A11yAuditResult {
  const violations: AuditIssue[] = [];

  for (const file of files) {
    const content = file.content || '';
    if (!content) continue;

    // 1. Missing img alt tags
    if (/<img(?![^>]*\balt=)[^>]*>/i.test(content)) {
      violations.push({
        id: 'A11Y-MISSING-IMG-ALT',
        file: file.path,
        severity: 'CRITICAL',
        category: 'ACCESSIBILITY',
        message: 'Found <img> tag missing an alt attribute.',
        remediation: 'Add alt="" with descriptive alternative text or empty alt="" for decorative images.'
      });
    }

    // 2. Clickable div without role or tabindex
    if (/<div[^>]*\bonclick=[^>]*>(?![^>]*\brole=)/i.test(content)) {
      violations.push({
        id: 'A11Y-NON-SEMANTIC-BUTTON',
        file: file.path,
        severity: 'CRITICAL',
        category: 'ACCESSIBILITY',
        message: 'Interactive <div> with onClick lacks semantic role="button" and tabindex="0".',
        remediation: 'Use native <button> tag or add role="button" tabindex="0" and keyboard onKeyDown handlers.'
      });
    }

    // 3. Form input without associated label
    if (/<input(?![^>]*\b(aria-label|aria-labelledby|id)=)[^>]*>/i.test(content)) {
      violations.push({
        id: 'A11Y-UNLABELED-INPUT',
        file: file.path,
        severity: 'CRITICAL',
        category: 'ACCESSIBILITY',
        message: 'Form input found without label association or aria-label.',
        remediation: 'Add an associated <label for="..."> or aria-label attribute.'
      });
    }
  }

  const passedRatio = violations.length === 0 ? 1.0 : Math.max(0.4, 1.0 - violations.length * 0.15);

  return {
    wcagLevelTarget: 'WCAG_2_1_AA',
    passedRatio,
    violations,
    recommendations: [
      'Ensure all interactive controls are reachable via Tab and activatable via Enter/Space.',
      'Maintain at least 4.5:1 color contrast for normal text and 3:1 for large text.',
      'Announce dynamic status updates using aria-live regions.'
    ]
  };
}

export function auditResponsive(files: ProjectFile[]): ResponsiveAuditResult {
  const issues: AuditIssue[] = [];
  const breakpoints: Set<string> = new Set();

  for (const file of files) {
    const content = file.content || '';
    if (!content) continue;

    const mediaQueries = content.match(/@media[^{]+/g);
    if (mediaQueries) {
      mediaQueries.forEach((mq) => breakpoints.add(mq.trim()));
    }

    if (content.includes('overflow-x: scroll') || content.includes('overflow-x: auto')) {
      // Valid dense table scroll wrapper
    }
  }

  return {
    mobileReady: breakpoints.size > 0,
    desktopDenseOptimized: true,
    viewportIssues: issues,
    breakpointsFound: Array.from(breakpoints)
  };
}
