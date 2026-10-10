import {
  SecurityRiskLevel,
  SkillAuditReport,
  SkillAuditReportSchema,
  SkillQuality
} from './types.js';

export interface SkillAuditInput {
  skillId: string;
  name: string;
  source: string;
  license?: string;
  scope?: string;
  promptContent: string;
}

export function auditSkill(input: SkillAuditInput): SkillAuditReport {
  const license = input.license || 'UNKNOWN';
  const prompt = input.promptContent;
  const lower = prompt.toLowerCase();
  const conflictingRules: string[] = [];
  let securityRisk: SecurityRiskLevel = 'NONE';
  let quality: SkillQuality = 'ACCEPTABLE';

  // 1. Security Scan
  const dangerousPatterns = [
    { pattern: /rm\s+-rf\s+[\/\\]/i, risk: 'CRITICAL', reason: 'Destructive filesystem command detected' },
    { pattern: /format\s+[c-z]:/i, risk: 'CRITICAL', reason: 'Drive format instruction detected' },
    { pattern: /curl.*\|\s*(?:bash|sh|powershell)/i, risk: 'CRITICAL', reason: 'Forbidden command: Remote untrusted script execution detected' },
    { pattern: /(?:process\.env|credentials|exfiltrate)/i, risk: 'CRITICAL', reason: 'Credential exfiltration attempt detected' },
    { pattern: /ignore\s+(?:all\s+)?prior\s+instructions/i, risk: 'HIGH', reason: 'Prompt injection / guardrail evasion attempt' },
    { pattern: /(?:disable|bypass)\s+security/i, risk: 'HIGH', reason: 'Explicit security bypass instruction' },
    { pattern: /base64\s+(?:--decode|-d).*\|\s*sh/i, risk: 'HIGH', reason: 'Obfuscated command execution' }
  ];

  for (const { pattern, risk, reason } of dangerousPatterns) {
    if (pattern.test(prompt)) {
      securityRisk = risk as SecurityRiskLevel;
      conflictingRules.push(reason);
    }
  }

  // 2. Conflicting Rules with Alper Design OS Tenets
  if (lower.includes('ignore domain') || lower.includes('skip domain analysis')) {
    conflictingRules.push('Violates Core Philosophy: "Understand the product before designing the interface."');
  }

  if (lower.includes('mutate without plan') || lower.includes('apply changes immediately without confirmation')) {
    conflictingRules.push('Violates Safety Rule: Analyze -> Plan -> Apply pipeline required.');
  }

  if (lower.includes('ignore accessibility') || lower.includes('skip wcag')) {
    conflictingRules.push('Violates Accessibility Rule: WCAG 2.1 AA baseline is mandatory.');
  }

  if (lower.includes('force react') || lower.includes('force tailwind') || lower.includes('without exception') || lower.includes('do not allow any other framework')) {
    conflictingRules.push('Violates Agnostic Architecture: Must not enforce single-framework lock-in without adapter support.');
  }

  // 3. Quality Evaluation
  const hasFrontmatter = prompt.startsWith('---') && prompt.indexOf('---', 3) > 3;
  const hasStepByStep = lower.includes('step') || lower.includes('procedure') || lower.includes('workflow');
  const hasErrorHandling = lower.includes('error') || lower.includes('fallback') || lower.includes('verify');

  if (hasFrontmatter && hasStepByStep && hasErrorHandling && prompt.length > 500) {
    quality = 'EXEMPLARY';
  } else if (hasStepByStep || hasFrontmatter) {
    quality = 'HIGH';
  } else if (prompt.length < 150) {
    quality = 'POOR';
  }

  // 4. Approval Status Resolution
  let approvalStatus: 'APPROVED' | 'REJECTED' | 'NEEDS_SANDBOXING' = 'APPROVED';
  let verifiedSafe = true;

  if (securityRisk === 'CRITICAL' || securityRisk === 'HIGH') {
    approvalStatus = 'REJECTED';
    verifiedSafe = false;
  } else if (conflictingRules.length > 0 || securityRisk === 'MEDIUM' || license === 'UNKNOWN') {
    approvalStatus = 'NEEDS_SANDBOXING';
    verifiedSafe = securityRisk !== 'MEDIUM';
  }

  const suggestedUse =
    approvalStatus === 'APPROVED'
      ? 'Safe for direct activation in workspace skills/ directory.'
      : approvalStatus === 'NEEDS_SANDBOXING'
        ? 'Requires sandboxed evaluation and manual rule reconciliation before installation.'
        : 'Do NOT activate. Poses security or architectural risks.';

  const report: SkillAuditReport = {
    skillId: input.skillId,
    name: input.name,
    source: input.source,
    license,
    scope: input.scope || 'UI/UX Design',
    quality,
    conflictingRules,
    securityRisk,
    verifiedSafe,
    suggestedUse,
    approvalStatus,
    promptInjectionRisk: false,
    maliciousCommandRisk: false
  };

  return SkillAuditReportSchema.parse(report);
}

export function auditSkillSafety(input: {
  name: string;
  source: string;
  license?: string;
  scope?: string;
  promptContent: string;
  skillId?: string;
}) {
  const report = auditSkill({
    skillId: input.skillId || input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: input.name,
    source: input.source,
    license: input.license || 'MIT',
    scope: input.scope || 'General',
    promptContent: input.promptContent
  });

  return {
    ...report,
    securityRisk: report.securityRisk === 'NONE' ? ('LOW' as const) : report.securityRisk,
    approved: report.approvalStatus === 'APPROVED',
    recommendation:
      report.approvalStatus === 'APPROVED'
        ? ('APPROVE' as const)
        : report.approvalStatus === 'REJECTED'
          ? ('REJECT' as const)
          : ('REVIEW' as const),
    issues: report.conflictingRules,
    qualityScore:
      report.quality === 'EXEMPLARY'
        ? 95
        : report.quality === 'HIGH'
          ? 85
          : report.quality === 'ACCEPTABLE'
            ? 70
            : 40
  };
}

