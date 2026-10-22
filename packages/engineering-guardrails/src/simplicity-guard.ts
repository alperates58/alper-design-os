/**
 * Simplicity & YAGNI Guardrail Engine V2 (Ponytail & Karpathy Inspired)
 * Evaluates code changes to prevent over-engineering, speculative abstractions,
 * dependency bloat, and gratuitous wrapper layers.
 */

export interface SimplicityIssue {
  id: string;
  rule: 'NO_SPECULATIVE_ABSTRACTION' | 'REUSE_BEFORE_DEPENDENCY' | 'SURGICAL_EDIT' | 'YAGNI_UNUSED_OPTION';
  severity: 'BLOCKING' | 'WARNING';
  file: string;
  line?: number;
  message: string;
  remediation: string;
}

export interface SimplicityAuditReport {
  passed: boolean;
  score: number; // 0 - 100
  issues: SimplicityIssue[];
  metrics: {
    linesAdded: number;
    linesRemoved: number;
    ratioAddDelete: number;
    speculativeWrappersFound: number;
    unneededDependenciesFound: number;
  };
}

export class SimplicityGuard {
  /**
   * Audits diff or changed code content against Ponytail & Karpathy simplicity guidelines.
   */
  public auditDiff(diffContent: string): SimplicityAuditReport {
    const issues: SimplicityIssue[] = [];
    const lines = diffContent.split(/\r?\n/);

    let linesAdded = 0;
    let linesRemoved = 0;
    let speculativeWrappers = 0;
    let unneededDependencies = 0;

    for (const line of lines) {
      if (line.startsWith('+') && !line.startsWith('+++')) {
        linesAdded++;
        const trimmed = line.substring(1).trim();

        // 1. Speculative wrapper classes (e.g. class SomethingWrapper { ... single trivial method })
        if (/class\s+[A-Za-z0-9]+(?:Wrapper|Helper|Manager|Proxy)\b/i.test(trimmed)) {
          speculativeWrappers++;
          issues.push({
            id: `SIMP-WRAPPER-${issues.length + 1}`,
            rule: 'NO_SPECULATIVE_ABSTRACTION',
            severity: 'WARNING',
            file: 'diff',
            message: `Potential speculative wrapper class detected: "${trimmed.substring(0, 40)}". Prefer direct functions or standard library.`,
            remediation: 'Eliminate wrapper class; invoke the underlying module directly.'
          });
        }

        // 2. Trivial external dependencies (lodash.get, is-even, etc.)
        if (/(?:import|require).*?['"](?:lodash(?:\.[a-z0-9_-]+)?|is-number|is-string|left-pad)['"]/i.test(trimmed)) {
          unneededDependencies++;
          issues.push({
            id: `SIMP-DEP-${issues.length + 1}`,
            rule: 'REUSE_BEFORE_DEPENDENCY',
            severity: 'BLOCKING',
            file: 'diff',
            message: `Unnecessary external utility dependency detected: "${trimmed}". Use standard optional chaining (?.) or typeof.`,
            remediation: 'Use native JavaScript/TypeScript syntax instead of adding single-purpose packages.'
          });
        }

        // 3. Speculative "for future use" flags or comments
        if (/(?:TODO:\s*for future|for later use|reserved for future|speculative)/i.test(trimmed)) {
          issues.push({
            id: `SIMP-YAGNI-${issues.length + 1}`,
            rule: 'YAGNI_UNUSED_OPTION',
            severity: 'WARNING',
            file: 'diff',
            message: `Speculative future-proofing code detected: "${trimmed}". Build only what is needed for the current task.`,
            remediation: 'Remove unused parameters or stub properties until genuinely needed.'
          });
        }
      } else if (line.startsWith('-') && !line.startsWith('---')) {
        linesRemoved++;
      }
    }

    const ratio = linesRemoved > 0 ? Number((linesAdded / linesRemoved).toFixed(2)) : linesAdded;
    const blockingCount = issues.filter((i) => i.severity === 'BLOCKING').length;
    const warningCount = issues.filter((i) => i.severity === 'WARNING').length;
    const score = Math.max(0, 100 - blockingCount * 25 - warningCount * 10);

    return {
      passed: blockingCount === 0,
      score,
      issues,
      metrics: {
        linesAdded,
        linesRemoved,
        ratioAddDelete: ratio,
        speculativeWrappersFound: speculativeWrappers,
        unneededDependenciesFound: unneededDependencies
      }
    };
  }
}
