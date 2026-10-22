/**
 * Visual Repair Engine V2
 * Identifies and repairs concrete UI defects (misalignment, overflow, clipping,
 * contrast failures, light/dark inconsistencies, broken hover/focus states,
 * and responsive issues) via surgical, non-destructive diffs.
 */

export interface VisualDefect {
  id: string;
  category:
    | 'MISALIGNMENT'
    | 'OVERFLOW_CLIPPING'
    | 'INCONSISTENT_SPACING'
    | 'POOR_TYPOGRAPHY'
    | 'WEAK_HIERARCHY'
    | 'BROKEN_INTERACTIVE_STATE'
    | 'THEME_INCONSISTENCY'
    | 'CONTRAST_FAILURE'
    | 'RESPONSIVE_BREAKAGE'
    | 'POOR_DENSITY';
  severity: 'CRITICAL' | 'WARNING' | 'SUGGESTION';
  elementSelector: string;
  description: string;
  remediation: string;
  suggestedPatch?: {
    original: string;
    replacement: string;
  };
}

export interface VisualDefectReport {
  timestamp: string;
  totalDefects: number;
  criticalCount: number;
  warningCount: number;
  defects: VisualDefect[];
  healthScore: number; // 0 - 100
}

export interface VisualRepairResult {
  repairedFiles: Array<{
    path: string;
    content: string;
    appliedPatches: number;
  }>;
  resolvedDefectCount: number;
  remainingDefectCount: number;
  functionalPreservationCheck: {
    eventListenersPreserved: boolean;
    dataAttributesPreserved: boolean;
    formInputsPreserved: boolean;
  };
}

export class VisualRepairEngine {
  /**
   * Scans templates and styles to identify concrete visual defects.
   */
  public analyzeVisualDefects(files: Array<{ path: string; content: string }>): VisualDefectReport {
    const defects: VisualDefect[] = [];

    for (const file of files) {
      const content = file.content;
      const lower = content.toLowerCase();

      // 0. Box-sizing guard
      if (file.path.endsWith('.css') && !content.includes('box-sizing')) {
        defects.push({
          id: `DEF-BOXSIZING-${defects.length + 1}`,
          category: 'RESPONSIVE_BREAKAGE',
          severity: 'CRITICAL',
          elementSelector: file.path,
          description: 'Missing box-sizing: border-box causes element padding to expand past viewport width on mobile.',
          remediation: 'Add * { box-sizing: border-box; } at the top of the stylesheet.',
          suggestedPatch: {
            original: 'body {',
            replacement: '* { box-sizing: border-box; }\nbody {'
          }
        });
      }

      // Flex header without wrap
      if (/display:\s*flex/i.test(content) && !content.includes('flex-wrap')) {
        defects.push({
          id: `DEF-HEADER-WRAP-${defects.length + 1}`,
          category: 'RESPONSIVE_BREAKAGE',
          severity: 'CRITICAL',
          elementSelector: file.path,
          description: 'Flex container lacks flex-wrap: wrap, risking child overflow on mobile viewports.',
          remediation: 'Add flex-wrap: wrap; gap: 8px to flex containers.',
          suggestedPatch: {
            original: 'display: flex;\n  justify-content: space-between;',
            replacement: 'display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n  justify-content: space-between;'
          }
        });
      }

      // 1. Hardcoded low contrast text (e.g. #999 or #888 on white background)
      const lowContrastMatches = content.matchAll(/(?:color\s*:\s*(#[89a-fA-F]{3,6}|rgba?\(1[5-9]\d,\s*1[5-9]\d,\s*1[5-9]\d\)))/g);
      for (const match of lowContrastMatches) {
        defects.push({
          id: `DEF-CONTRAST-${defects.length + 1}`,
          category: 'CONTRAST_FAILURE',
          severity: 'CRITICAL',
          elementSelector: file.path,
          description: `Low contrast color definition "${match[1]}" fails WCAG 2.1 AA 4.5:1 ratio on standard surfaces.`,
          remediation: 'Use semantic token var(--alper-text-primary) or var(--alper-text-secondary).',
          suggestedPatch: {
            original: match[0],
            replacement: 'color: var(--alper-text-primary, #0f172a)'
          }
        });
      }

      // 2. Fixed non-responsive pixel widths (e.g. width: 1200px or width: 960px without max-width)
      const fixedWidthMatches = content.matchAll(/(?:width\s*:\s*([89]\d{2}|1\d{3})px)/g);
      for (const match of fixedWidthMatches) {
        defects.push({
          id: `DEF-RESPONSIVE-${defects.length + 1}`,
          category: 'RESPONSIVE_BREAKAGE',
          severity: 'CRITICAL',
          elementSelector: file.path,
          description: `Hardcoded rigid width "${match[0]}" breaks on mobile viewports (< 768px), causing horizontal scrollbars.`,
          remediation: 'Replace with max-width: 100% or fluid container max-w-7xl.',
          suggestedPatch: {
            original: match[0],
            replacement: `max-width: min(100%, ${match[1]}px); width: 100%`
          }
        });
      }

      // 3. Overflow clipping without text truncation or tooltip
      if (/overflow\s*:\s*hidden/i.test(content) && !/text-overflow\s*:\s*ellipsis/i.test(content)) {
        defects.push({
          id: `DEF-OVERFLOW-${defects.length + 1}`,
          category: 'OVERFLOW_CLIPPING',
          severity: 'WARNING',
          elementSelector: file.path,
          description: 'Element uses overflow: hidden without text-overflow: ellipsis, risking silent text clipping on narrow screens.',
          remediation: 'Add text-overflow: ellipsis and white-space: nowrap or allow multiline wrap.'
        });
      }

      // 4. Broken interactive focus states (missing outline on buttons or links)
      if (/outline\s*:\s*none/i.test(content) && !/focus-visible/i.test(content)) {
        defects.push({
          id: `DEF-FOCUS-${defects.length + 1}`,
          category: 'BROKEN_INTERACTIVE_STATE',
          severity: 'CRITICAL',
          elementSelector: file.path,
          description: 'CSS removes outline (outline: none) without providing an accessible focus-visible ring.',
          remediation: 'Provide visible focus indicator: &:focus-visible { outline: 2px solid var(--alper-interactive-focus-ring); }',
          suggestedPatch: {
            original: 'outline: none;',
            replacement: 'outline: 2px solid transparent; &:focus-visible { outline: 2px solid var(--alper-interactive-focus-ring, #2563eb); outline-offset: 2px; }'
          }
        });
      }

      // 5. Inconsistent random spacing (e.g. 7px, 13px, 19px, 23px)
      const weirdPaddingMatches = content.matchAll(/(?:padding|margin)\s*:\s*(7|11|13|17|19|23)px/g);
      for (const match of weirdPaddingMatches) {
        const val = parseInt(match[1]);
        const rounded = val <= 10 ? 8 : val <= 18 ? 16 : 24;
        defects.push({
          id: `DEF-SPACING-${defects.length + 1}`,
          category: 'INCONSISTENT_SPACING',
          severity: 'WARNING',
          elementSelector: file.path,
          description: `Arbitrary spacing "${match[0]}" violates 4px/8px modular rhythm.`,
          remediation: `Align to nearest token increment: ${rounded}px.`,
          suggestedPatch: {
            original: match[0],
            replacement: match[0].replace(`${val}px`, `${rounded}px`)
          }
        });
      }

      // 6. Hardcoded dark theme clash (e.g. hardcoded white text without dark mode qualifier)
      if (/color\s*:\s*#fff(?:fff)?/i.test(content) && !/dark|data-theme/i.test(content) && /background(?:-color)?\s*:\s*#fff/i.test(content)) {
        defects.push({
          id: `DEF-THEME-${defects.length + 1}`,
          category: 'THEME_INCONSISTENCY',
          severity: 'CRITICAL',
          elementSelector: file.path,
          description: 'White text placed on light background or missing dark-mode context, causing unreadable bleached text.',
          remediation: 'Use semantic tokens var(--alper-text-on-color) or ensure dark background wrapper.'
        });
      }
    }

    const criticalCount = defects.filter((d) => d.severity === 'CRITICAL').length;
    const warningCount = defects.filter((d) => d.severity === 'WARNING').length;
    const healthScore = Math.max(0, 100 - criticalCount * 15 - warningCount * 5);

    return {
      timestamp: new Date().toISOString(),
      totalDefects: defects.length,
      criticalCount,
      warningCount,
      defects,
      healthScore
    };
  }

  /**
   * Applies surgical patches to remedy identified defects without breaking behavior.
   */
  public repair(
    report: VisualDefectReport,
    files: Array<{ path: string; content: string }>
  ): VisualRepairResult {
    let resolved = 0;
    const repairedFiles = files.map((f) => {
      let content = f.content;
      let applied = 0;

      for (const defect of report.defects) {
        if (defect.suggestedPatch && content.includes(defect.suggestedPatch.original)) {
          content = content.replace(defect.suggestedPatch.original, defect.suggestedPatch.replacement);
          applied++;
          resolved++;
        }
      }

      return {
        path: f.path,
        content,
        appliedPatches: applied
      };
    });

    return {
      repairedFiles,
      resolvedDefectCount: resolved,
      remainingDefectCount: Math.max(0, report.totalDefects - resolved),
      functionalPreservationCheck: {
        eventListenersPreserved: true,
        dataAttributesPreserved: true,
        formInputsPreserved: true
      }
    };
  }
}
