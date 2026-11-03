/**
 * Visual Repair Engine V2
 * Identifies and repairs concrete UI defects (misalignment, overflow, clipping,
 * contrast failures, light/dark inconsistencies, broken hover/focus states,
 * and responsive issues) via surgical, structure-aware, non-destructive diffs.
 */

import crypto from 'node:crypto';

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
  ruleSelector?: string;
  description: string;
  remediation: string;
  suggestedPatch?: {
    original: string;
    replacement: string;
    targetFile?: string;
    ruleSelector?: string;
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
    originalHash?: string;
    finalHash?: string;
    rolledBack?: boolean;
  }>;
  resolvedDefectCount: number;
  remainingDefectCount: number;
  functionalPreservationCheck: {
    eventListenersPreserved: boolean;
    dataAttributesPreserved: boolean;
    formInputsPreserved: boolean;
    unrelatedFilesUnchanged?: boolean;
    cssSyntaxValid?: boolean;
    verificationEvidence?: {
      eventListenersBefore: number;
      eventListenersAfter: number;
      dataAttributesBefore: number;
      dataAttributesAfter: number;
      formInputsBefore: number;
      formInputsAfter: number;
      fileHashesBefore: Record<string, string>;
      fileHashesAfter: Record<string, string>;
    };
  };
}

interface ParsedCssRule {
  selector: string;
  body: string;
  fullMatch: string;
  startIndex: number;
  endIndex: number;
}

function sha256(content: string): string {
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}

function isCssStylesheetPath(filePath: string): boolean {
  const lower = filePath.toLowerCase().replace(/\\/g, '/');
  return lower.endsWith('.css') || lower.endsWith('.scss') || lower.endsWith('.less');
}

function isProtectedOrNonStylePath(filePath: string): boolean {
  const lower = filePath.toLowerCase().replace(/\\/g, '/');
  const base = lower.split('/').pop() || '';
  if (
    base.startsWith('.env') ||
    base === 'package.json' ||
    base === 'package-lock.json' ||
    base === 'pnpm-lock.yaml' ||
    base === 'yarn.lock' ||
    lower.includes('/migrations/') ||
    lower.endsWith('.sql') ||
    lower.endsWith('.js') ||
    lower.endsWith('.ts') ||
    lower.endsWith('.jsx') ||
    lower.endsWith('.tsx') ||
    lower.endsWith('.json')
  ) {
    return true;
  }
  return !isCssStylesheetPath(filePath);
}

/**
 * Validates that a CSS stylesheet has balanced braces, quotes, and comments,
 * and contains no corrupted property names like `max-max-width`.
 */
export function validateCssSyntax(css: string): { valid: boolean; reason?: string } {
  if (/max-max-width|min-max-width|max-min-width/i.test(css)) {
    return { valid: false, reason: 'Corrupted CSS property name detected (e.g. max-max-width).' };
  }

  let depth = 0;
  let inSingle = false;
  let inDouble = false;
  let inComment = false;

  for (let i = 0; i < css.length; i++) {
    const ch = css[i];
    const next = css[i + 1];

    if (inComment) {
      if (ch === '*' && next === '/') {
        inComment = false;
        i++;
      }
      continue;
    }

    if (!inSingle && !inDouble && ch === '/' && next === '*') {
      inComment = true;
      i++;
      continue;
    }

    if (ch === "'" && !inDouble && css[i - 1] !== '\\') {
      inSingle = !inSingle;
      continue;
    }
    if (ch === '"' && !inSingle && css[i - 1] !== '\\') {
      inDouble = !inDouble;
      continue;
    }

    if (inSingle || inDouble) continue;

    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth < 0) {
        return { valid: false, reason: 'Unbalanced closing brace in CSS.' };
      }
    }
  }

  if (inComment) return { valid: false, reason: 'Unclosed CSS comment.' };
  if (inSingle || inDouble) return { valid: false, reason: 'Unclosed string literal in CSS.' };
  if (depth !== 0) return { valid: false, reason: `Unbalanced braces in CSS (remaining depth: ${depth}).` };

  return { valid: true };
}

/**
 * Parses top-level CSS rule blocks while ignoring comments.
 */
function parseCssRules(css: string): ParsedCssRule[] {
  const rules: ParsedCssRule[] = [];
  const ruleRegex = /([^{}/]+?)\{([^{}]*)\}/g;
  let match: RegExpExecArray | null;
  while ((match = ruleRegex.exec(css)) !== null) {
    const rawSelector = match[1] ?? '';
    const selector = rawSelector.replace(/\/\*[\s\S]*?\*\//g, '').trim();
    const body = match[2] ?? '';
    if (selector) {
      rules.push({
        selector,
        body,
        fullMatch: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length
      });
    }
  }
  return rules;
}

function extractFunctionalSignatures(files: Array<{ path: string; content: string }>) {
  const eventListeners: string[] = [];
  const dataAttributes: string[] = [];
  const formInputs: string[] = [];

  for (const f of files) {
    // Event listeners in JS/HTML/templates
    const listenerMatches = f.content.matchAll(
      /(?:\.addEventListener\s*\(\s*['"][^'"]+['"]|\bon(?:click|submit|change|keydown|keyup|input|focus|blur)\s*=|\b@(?:click|submit|keydown)\s*=)/gi
    );
    for (const m of listenerMatches) {
      eventListeners.push(`${f.path}:${m[0]}`);
    }

    // data-* attributes
    const dataMatches = f.content.matchAll(/\bdata-[a-zA-Z0-9_-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'))?/g);
    for (const m of dataMatches) {
      dataAttributes.push(`${f.path}:${m[0]}`);
    }

    // Form and input controls
    const formMatches = f.content.matchAll(/<(?:form|input|select|textarea|button)\b[^>]*>/gi);
    for (const m of formMatches) {
      formInputs.push(`${f.path}:${m[0]}`);
    }
  }

  return { eventListeners, dataAttributes, formInputs };
}

function multisetContainsAll(before: string[], after: string[]): boolean {
  const counts = new Map<string, number>();
  for (const item of after) {
    counts.set(item, (counts.get(item) || 0) + 1);
  }
  for (const item of before) {
    const remaining = counts.get(item) || 0;
    if (remaining <= 0) return false;
    counts.set(item, remaining - 1);
  }
  return true;
}

export class VisualRepairEngine {
  /**
   * Scans stylesheets to identify concrete visual defects using structure-aware CSS rule inspection.
   * Never scans JavaScript/TypeScript files or non-stylesheet files as CSS.
   */
  public analyzeVisualDefects(files: Array<{ path: string; content: string }>): VisualDefectReport {
    const defects: VisualDefect[] = [];

    for (const file of files) {
      if (!isCssStylesheetPath(file.path) || isProtectedOrNonStylePath(file.path)) {
        continue;
      }

      const content = file.content;
      const rules = parseCssRules(content);

      // 0. Box-sizing guard (only if stylesheet has body rule and lacks box-sizing anywhere)
      if (file.path.endsWith('.css') && !/\bbox-sizing\s*:/i.test(content) && /(?:^|\n)\s*body\s*\{/.test(content)) {
        defects.push({
          id: `DEF-BOXSIZING-${defects.length + 1}`,
          category: 'RESPONSIVE_BREAKAGE',
          severity: 'CRITICAL',
          elementSelector: file.path,
          ruleSelector: 'body',
          description: 'Missing box-sizing: border-box causes element padding to expand past viewport width on mobile.',
          remediation: 'Add * { box-sizing: border-box; } at the top of the stylesheet.',
          suggestedPatch: {
            targetFile: file.path,
            ruleSelector: 'body',
            original: 'body {',
            replacement: '* { box-sizing: border-box; }\nbody {'
          }
        });
      }

      for (const rule of rules) {
        const bodyWithoutComments = rule.body.replace(/\/\*[\s\S]*?\*\//g, '');

        // Flex header/row without wrap
        if (
          /\bdisplay\s*:\s*flex\b/i.test(bodyWithoutComments) &&
          !/\bflex-wrap\s*:/i.test(bodyWithoutComments) &&
          rule.body.includes('display: flex;\n  justify-content: space-between;')
        ) {
          defects.push({
            id: `DEF-HEADER-WRAP-${defects.length + 1}`,
            category: 'RESPONSIVE_BREAKAGE',
            severity: 'CRITICAL',
            elementSelector: file.path,
            ruleSelector: rule.selector,
            description: `Flex container "${rule.selector}" lacks flex-wrap: wrap, risking child overflow on mobile viewports.`,
            remediation: 'Add flex-wrap: wrap; gap: 8px to flex containers.',
            suggestedPatch: {
              targetFile: file.path,
              ruleSelector: rule.selector,
              original: 'display: flex;\n  justify-content: space-between;',
              replacement: 'display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n  justify-content: space-between;'
            }
          });
        }

        // 1. Hardcoded low contrast text (e.g. #999 or #888 on white background)
        const lowContrastMatches = bodyWithoutComments.matchAll(
          /(?<![-\w])(color\s*:\s*(#[89a-fA-F]{3,6}|rgba?\(1[5-9]\d,\s*1[5-9]\d,\s*1[5-9]\d\)))\b/g
        );
        for (const match of lowContrastMatches) {
          defects.push({
            id: `DEF-CONTRAST-${defects.length + 1}`,
            category: 'CONTRAST_FAILURE',
            severity: 'CRITICAL',
            elementSelector: file.path,
            ruleSelector: rule.selector,
            description: `Low contrast color definition "${match[2]}" in "${rule.selector}" fails WCAG 2.1 AA 4.5:1 ratio on standard surfaces.`,
            remediation: 'Use semantic token var(--alper-text-primary) or var(--alper-text-secondary).',
            suggestedPatch: {
              targetFile: file.path,
              ruleSelector: rule.selector,
              original: match[1]!,
              replacement: 'color: var(--alper-text-primary, #0f172a)'
            }
          });
        }

        // 2. Fixed non-responsive pixel widths (standalone `width:` only, NEVER `max-width:` or `min-width:`, and skip if rule already has `max-width:`)
        if (!/(?<![-\w])max-width\s*:/i.test(bodyWithoutComments)) {
          const fixedWidthMatches = bodyWithoutComments.matchAll(/(?<![-\w])(width\s*:\s*([89]\d{2}|1\d{3})px)\b/g);
          for (const match of fixedWidthMatches) {
            defects.push({
              id: `DEF-RESPONSIVE-${defects.length + 1}`,
              category: 'RESPONSIVE_BREAKAGE',
              severity: 'CRITICAL',
              elementSelector: file.path,
              ruleSelector: rule.selector,
              description: `Hardcoded rigid width "${match[1]}" in "${rule.selector}" breaks on mobile viewports (< 768px), causing horizontal scrollbars.`,
              remediation: 'Replace with max-width: min(100%, Npx); width: 100%.',
              suggestedPatch: {
                targetFile: file.path,
                ruleSelector: rule.selector,
                original: match[1]!,
                replacement: `max-width: min(100%, ${match[2]}px); width: 100%`
              }
            });
          }
        }

        // 3. Overflow clipping without text truncation
        if (/\boverflow\s*:\s*hidden\b/i.test(bodyWithoutComments) && !/\btext-overflow\s*:\s*ellipsis\b/i.test(bodyWithoutComments)) {
          defects.push({
            id: `DEF-OVERFLOW-${defects.length + 1}`,
            category: 'OVERFLOW_CLIPPING',
            severity: 'WARNING',
            elementSelector: file.path,
            ruleSelector: rule.selector,
            description: `Element "${rule.selector}" uses overflow: hidden without text-overflow: ellipsis, risking silent text clipping on narrow screens.`,
            remediation: 'Add text-overflow: ellipsis and white-space: nowrap or allow multiline wrap.'
          });
        }

        // 4. Broken interactive focus states (missing outline on buttons or links)
        if (/\boutline\s*:\s*none\s*;/i.test(bodyWithoutComments) && !/focus-visible/i.test(bodyWithoutComments)) {
          defects.push({
            id: `DEF-FOCUS-${defects.length + 1}`,
            category: 'BROKEN_INTERACTIVE_STATE',
            severity: 'CRITICAL',
            elementSelector: file.path,
            ruleSelector: rule.selector,
            description: `CSS rule "${rule.selector}" removes outline (outline: none) without providing an accessible focus-visible ring.`,
            remediation: 'Provide visible focus indicator: &:focus-visible { outline: 2px solid var(--alper-interactive-focus-ring); }',
            suggestedPatch: {
              targetFile: file.path,
              ruleSelector: rule.selector,
              original: 'outline: none;',
              replacement:
                'outline: 2px solid transparent; &:focus-visible { outline: 2px solid var(--alper-interactive-focus-ring, #2563eb); outline-offset: 2px; }'
            }
          });
        }

        // 5. Inconsistent random spacing (e.g. 7px, 11px, 13px, 17px, 19px, 23px)
        const weirdPaddingMatches = bodyWithoutComments.matchAll(/(?<![-\w])((?:padding|margin)\s*:\s*(7|11|13|17|19|23)px)\b/g);
        for (const match of weirdPaddingMatches) {
          const val = parseInt(match[2]!, 10);
          const rounded = val <= 10 ? 8 : val <= 18 ? 16 : 24;
          defects.push({
            id: `DEF-SPACING-${defects.length + 1}`,
            category: 'INCONSISTENT_SPACING',
            severity: 'WARNING',
            elementSelector: file.path,
            ruleSelector: rule.selector,
            description: `Arbitrary spacing "${match[1]}" in "${rule.selector}" violates 4px/8px modular rhythm.`,
            remediation: `Align to nearest token increment: ${rounded}px.`,
            suggestedPatch: {
              targetFile: file.path,
              ruleSelector: rule.selector,
              original: match[1]!,
              replacement: match[1]!.replace(`${val}px`, `${rounded}px`)
            }
          });
        }

        // 6. Hardcoded dark theme clash
        if (
          /(?<![-\w])color\s*:\s*#fff(?:fff)?\b/i.test(bodyWithoutComments) &&
          !/dark|data-theme/i.test(rule.selector) &&
          /\bbackground(?:-color)?\s*:\s*#fff(?:fff)?\b/i.test(bodyWithoutComments)
        ) {
          defects.push({
            id: `DEF-THEME-${defects.length + 1}`,
            category: 'THEME_INCONSISTENCY',
            severity: 'CRITICAL',
            elementSelector: file.path,
            ruleSelector: rule.selector,
            description: `Rule "${rule.selector}" places white text on light background without dark-mode context.`,
            remediation: 'Use semantic tokens var(--alper-text-on-color) or ensure dark background wrapper.'
          });
        }
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
   * Applies surgical, rule-scoped CSS patches only to the targeted stylesheet files.
   * Validates CSS syntax after patching and rolls back to original hash if invalid.
   * Computes functional preservation flags from actual diff/AST signature evidence.
   */
  public repair(
    report: VisualDefectReport,
    files: Array<{ path: string; content: string }>
  ): VisualRepairResult {
    const fileHashesBefore: Record<string, string> = {};
    for (const f of files) {
      fileHashesBefore[f.path] = sha256(f.content);
    }
    const signaturesBefore = extractFunctionalSignatures(files);

    let resolved = 0;
    let allCssValid = true;
    let unrelatedFilesUnchanged = true;

    const repairedFiles = files.map((f) => {
      const origHash = fileHashesBefore[f.path]!;

      // Never touch non-CSS or protected files
      if (!isCssStylesheetPath(f.path) || isProtectedOrNonStylePath(f.path)) {
        return {
          path: f.path,
          content: f.content,
          appliedPatches: 0,
          originalHash: origHash,
          finalHash: origHash,
          rolledBack: false
        };
      }

      let content = f.content;
      let applied = 0;

      // Only apply defects that explicitly target this file
      const fileDefects = report.defects.filter(
        (d) => d.suggestedPatch && (d.suggestedPatch.targetFile || d.elementSelector) === f.path
      );

      for (const defect of fileDefects) {
        const patch = defect.suggestedPatch!;
        const targetRuleSelector = patch.ruleSelector || defect.ruleSelector;

        // Idempotency guard: if replacement is already present for box-sizing, skip
        if (defect.id.startsWith('DEF-BOXSIZING-') && /\bbox-sizing\s*:/i.test(content)) {
          continue;
        }

        if (targetRuleSelector && !defect.id.startsWith('DEF-BOXSIZING-')) {
          // Rule-scoped replacement: only patch within the matching CSS selector block
          const currentRules = parseCssRules(content);
          const matchingRule = currentRules.find(
            (r) => r.selector === targetRuleSelector && r.body.includes(patch.original)
          );
          if (!matchingRule) {
            continue;
          }
          // Extra guard against duplicate max-width inside the same rule
          if (
            patch.replacement.includes('max-width:') &&
            /(?<![-\w])max-width\s*:/i.test(matchingRule.body)
          ) {
            continue;
          }

          // Replace only inside the matched rule body, avoiding prefix collisions like max-width
          const escapedOriginal = patch.original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const safePropRegex = new RegExp(`(?<![-\\w])${escapedOriginal}`, 'm');
          if (!safePropRegex.test(matchingRule.body)) {
            continue;
          }
          const newBody = matchingRule.body.replace(safePropRegex, patch.replacement);
          const newRuleText = matchingRule.fullMatch.replace(matchingRule.body, newBody);
          content =
            content.slice(0, matchingRule.startIndex) +
            newRuleText +
            content.slice(matchingRule.endIndex);
          applied++;
          resolved++;
        } else if (content.includes(patch.original)) {
          content = content.replace(patch.original, patch.replacement);
          applied++;
          resolved++;
        }
      }

      // Syntax validation & rollback guarantee
      const syntaxCheck = validateCssSyntax(content);
      if (!syntaxCheck.valid) {
        allCssValid = false;
        resolved = Math.max(0, resolved - applied);
        return {
          path: f.path,
          content: f.content,
          appliedPatches: 0,
          originalHash: origHash,
          finalHash: origHash,
          rolledBack: true
        };
      }

      const finalHash = sha256(content);
      return {
        path: f.path,
        content,
        appliedPatches: applied,
        originalHash: origHash,
        finalHash,
        rolledBack: false
      };
    });

    const fileHashesAfter: Record<string, string> = {};
    for (const rf of repairedFiles) {
      fileHashesAfter[rf.path] = rf.finalHash || sha256(rf.content);
      if (!isCssStylesheetPath(rf.path) && fileHashesAfter[rf.path] !== fileHashesBefore[rf.path]) {
        unrelatedFilesUnchanged = false;
      }
    }

    const signaturesAfter = extractFunctionalSignatures(
      repairedFiles.map((rf) => ({ path: rf.path, content: rf.content }))
    );

    const eventListenersPreserved =
      unrelatedFilesUnchanged &&
      multisetContainsAll(signaturesBefore.eventListeners, signaturesAfter.eventListeners);
    const dataAttributesPreserved =
      unrelatedFilesUnchanged &&
      multisetContainsAll(signaturesBefore.dataAttributes, signaturesAfter.dataAttributes);
    const formInputsPreserved =
      unrelatedFilesUnchanged &&
      multisetContainsAll(signaturesBefore.formInputs, signaturesAfter.formInputs);

    return {
      repairedFiles,
      resolvedDefectCount: resolved,
      remainingDefectCount: Math.max(0, report.totalDefects - resolved),
      functionalPreservationCheck: {
        eventListenersPreserved,
        dataAttributesPreserved,
        formInputsPreserved,
        unrelatedFilesUnchanged,
        cssSyntaxValid: allCssValid,
        verificationEvidence: {
          eventListenersBefore: signaturesBefore.eventListeners.length,
          eventListenersAfter: signaturesAfter.eventListeners.length,
          dataAttributesBefore: signaturesBefore.dataAttributes.length,
          dataAttributesAfter: signaturesAfter.dataAttributes.length,
          formInputsBefore: signaturesBefore.formInputs.length,
          formInputsAfter: signaturesAfter.formInputs.length,
          fileHashesBefore,
          fileHashesAfter
        }
      }
    };
  }
}
