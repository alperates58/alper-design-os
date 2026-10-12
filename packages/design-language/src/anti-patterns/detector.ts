import {
  AntiPatternReport,
  AntiPatternIssue,
  PageBlueprint,
  ComponentBlueprint,
  DesignIntent
} from '../types.js';

export interface EvaluateAntiPatternsOptions {
  content?: string;
  blueprint?: PageBlueprint;
  intent?: DesignIntent;
}

/**
 * Design Anti-Pattern Critic Engine
 * Context-aware heuristic evaluation of UI blueprints, layouts, and stylesheets.
 */
export function evaluateDesignAntiPatterns(options: EvaluateAntiPatternsOptions): AntiPatternReport {
  const issues: AntiPatternIssue[] = [];
  const content = options.content || '';
  const bp = options.blueprint;
  const intent = options.intent || bp?.intent;

  // 1. Meaningless Gradients & Glassmorphism everywhere
  if (/backdrop-filter\s*:\s*blur/i.test(content) || /rgba\(255,\s*255,\s*255,\s*0\.[1-3]\)/i.test(content)) {
    if (intent?.productType === 'ENTERPRISE_INTERNAL' || intent?.informationDensity === 'COMPACT') {
      issues.push({
        id: 'AP-GLASSMORPHISM-01',
        code: 'GLASSMORPHISM_OVERUSE',
        category: 'GLASSMORPHISM_OVERUSE',
        severity: 'CRITICAL',
        location: 'Stylesheet / CSS properties',
        message: 'Glassmorphism and frosted blur layers reduce text contrast and readability in high-density data environments.',
        remediation: 'Replace frosted transparency with solid semantic surface tokens: var(--alper-surface-default) or var(--alper-surface-elevated).'
      });
    }
  }

  if (/background\s*:\s*linear-gradient/i.test(content) && (intent?.productType === 'DEVELOPER_TOOL' || intent?.productType === 'ENTERPRISE_INTERNAL')) {
    issues.push({
      id: 'AP-GRADIENT-01',
      code: 'MEANINGLESS_GRADIENTS',
      category: 'MEANINGLESS_GRADIENTS',
      severity: 'WARNING',
      location: 'Component backgrounds',
      message: 'Loud decorative linear gradients distract from dense technical data visualization.',
      remediation: 'Use subtle solid surface tokens and restrained border accents.'
    });
  }

  // 2. Excessive Cards ("Dashboard Card Soup")
  if (bp) {
    let cardCount = 0;
    for (const region of bp.regions) {
      cardCount += region.components.filter((c) => c.type === 'CARD').length;
    }
    if (cardCount > 8 && intent?.informationDensity === 'COMPACT') {
      issues.push({
        id: 'AP-CARD-SOUP-01',
        code: 'EXCESSIVE_CARDS',
        category: 'EXCESSIVE_CARDS',
        severity: 'WARNING',
        location: `Page Blueprint regions (${cardCount} cards found)`,
        message: `Dashboard Card Soup: Wrapping every piece of information in ${cardCount} isolated cards causes visual clutter.`,
        remediation: 'Group related metrics into a single unified summary panel or high-density tabular grid.'
      });
    }
  }

  // 3. Low Contrast Gray Text
  if (/#(?:888888|999999|aaaaaa|cccccc|777777)\b/i.test(content)) {
    issues.push({
      id: 'AP-CONTRAST-01',
      code: 'LOW_CONTRAST',
      category: 'LOW_CONTRAST',
      severity: 'CRITICAL',
      location: 'Text color definitions',
      message: 'Light gray body text violates WCAG 2.2 AA minimum contrast ratio (4.5:1).',
      remediation: 'Use var(--alper-text-primary) or var(--alper-text-secondary) semantic tokens.'
    });
  }

  // 4. Oversized Empty Whitespace in Data-Heavy Tools
  if (intent?.informationDensity === 'COMPACT') {
    if (/padding\s*:\s*(?:[6-9][0-9]|1[0-9]{2})px/i.test(content)) {
      issues.push({
        id: 'AP-WHITESPACE-01',
        code: 'OVERSIZED_WHITESPACE',
        category: 'OVERSIZED_WHITESPACE',
        severity: 'WARNING',
        location: 'Container padding',
        message: 'Excessive whitespace (>60px) in a compact data tool forces unnecessary scrolling and reduces scanability.',
        remediation: 'Enforce compact density spacing tokens (space.2 to space.4: 8px-16px).'
      });
    }
  }

  // 5. Tiny Touch Targets on Mobile
  if (intent?.devicePriority === 'MOBILE_FIRST' || /@media.*max-width.*768px/i.test(content)) {
    if (/(?:width|height)\s*:\s*(?:[1-2][0-9]|3[0-5])px/i.test(content)) {
      issues.push({
        id: 'AP-TOUCH-01',
        code: 'TINY_TOUCH_TARGET',
        category: 'TINY_TOUCH_TARGET',
        severity: 'CRITICAL',
        location: 'Interactive buttons/links on mobile',
        message: 'Interactive elements smaller than 44x44px fail WCAG 2.2 touch target criterion (2.5.8).',
        remediation: 'Enforce minimum 44px touch targets on mobile viewports via responsive contracts.'
      });
    }
  }

  // 6. Ambiguous Icon-Only Action without accessible label
  if (bp) {
    for (const region of bp.regions) {
      for (const comp of region.components) {
        if (comp.type === 'BUTTON') {
          const hasLabel = comp.contentModel.slots.some((s) => s.name === 'children');
          const hasAriaLabel = comp.accessibilityRequirements.ariaRequirements.some((a) => a.attribute === 'aria-label');
          if (!hasLabel && !hasAriaLabel) {
            issues.push({
              id: `AP-ICON-ACTION-${comp.id}`,
              code: 'AMBIGUOUS_ICON_ACTION',
              category: 'AMBIGUOUS_ICON_ACTION',
              severity: 'WARNING',
              location: `Component '${comp.id}'`,
              message: 'Icon-only action button lacks accessible text label or aria-label.',
              remediation: 'Provide visible text label or mandatory aria-label attribute for screen readers.'
            });
          }
        }
      }
    }
  }

  // 7. Excessive Modal Nesting
  if (bp) {
    let modalCount = 0;
    for (const region of bp.regions) {
      modalCount += region.components.filter((c) => c.type === 'MODAL_DIALOG').length;
    }
    if (modalCount > 2) {
      issues.push({
        id: 'AP-MODAL-NESTING-01',
        code: 'EXCESSIVE_MODAL_NESTING',
        category: 'EXCESSIVE_MODAL_NESTING',
        severity: 'CRITICAL',
        location: 'Page Blueprint dialog regions',
        message: 'Multiple modal dialogs present on a single page indicates potential nested modal anti-pattern.',
        remediation: 'Use a sliding drawer or sequential multi-step wizard rather than popping dialogs on top of dialogs.'
      });
    }
  }

  // 8. Mixed Icon Systems
  if (/\b(?:lucide-[a-z0-9-]+)\b/i.test(content) && /\b(?:mat-[a-z0-9-]+|material-symbols)\b/i.test(content)) {
    issues.push({
      id: 'AP-MIXED-ICONS-01',
      code: 'MIXED_ICON_SYSTEMS',
      category: 'MIXED_ICON_SYSTEMS',
      severity: 'WARNING',
      location: 'Icon references in stylesheet / markup',
      message: 'Mixed icon families detected (Lucide and Material Symbols co-existing).',
      remediation: 'Consolidate onto a single project-level IconProfile to ensure stroke and geometry consistency.'
    });
  }

  // 9. Deceptive Telemetry without Provenance or Endpoint Binding
  if (/missing-telemetry-endpoint/i.test(content) || /fake-telemetry/i.test(content)) {
    issues.push({
      id: 'AP-DECEPTIVE-TEL-01',
      code: 'DECEPTIVE_TELEMETRY',
      category: 'DECEPTIVE_TELEMETRY',
      severity: 'CRITICAL',
      location: 'Telemetry data binding',
      message: 'Ungrounded or fabricated telemetry endpoint referenced without authentic data provider.',
      remediation: 'Connect to verified live telemetry source or explicitly isolate as labeled test fixture.'
    });
  }

  // 10. Semantic Color Inversion / Mismatch (e.g. Failure colored green)
  if (/(?:error|failure|offline|critical).*color\s*:\s*(?:green|#00ff00|#0f0)/i.test(content)) {
    issues.push({
      id: 'AP-SEMANTIC-MISMATCH-01',
      code: 'UNGROUNDED_DATA',
      category: 'UNGROUNDED_DATA',
      severity: 'CRITICAL',
      location: 'Status indicator styles',
      message: 'Visual semantic mismatch: degraded or error state styled with success green token.',
      remediation: 'Use var(--alper-status-danger) semantic tokens for negative or error conditions.'
    });
  }

  const criticalCount = issues.filter((i) => i.severity === 'CRITICAL').length;
  const warningCount = issues.filter((i) => i.severity === 'WARNING').length;
  const criticScore = Math.max(0, 100 - criticalCount * 20 - warningCount * 5);

  return {
    timestamp: new Date().toISOString(),
    totalIssues: issues.length,
    passed: criticalCount === 0,
    issues,
    criticScore
  };
}
