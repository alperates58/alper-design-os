import {
  SkillAuditReport,
  SkillAuditReportSchema,
  SecurityRiskLevel
} from './types.js';

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
  /disregard\s+(all\s+)?(previous|prior)\s+(system\s+)?prompts?/i,
  /reveal\s+(your\s+)?system\s+(prompt|instructions?)/i,
  /print\s+(your\s+)?initial\s+prompt/i,
  /you\s+are\s+now\s+in\s+DAN\s+mode/i,
  /developer\s+override\s+mode\s+enabled/i,
  /exfiltrate\s+(tokens?|secrets?|keys?)/i,
  /send\s+(credentials?|passwords?)\s+to\s+https?:\/\//i,
  /execute\s+this\s+base64\s*:/i
];

const MALICIOUS_COMMAND_PATTERNS = [
  /curl\s+[^|\n]+\|\s*(ba|z)?sh/i,
  /wget\s+[^|\n]+\|\s*(ba|z)?sh/i,
  /rm\s+-rf\s+[\/\*]/i,
  /powershell(\.exe)?\s+(-enc|-encodedcommand)/i,
  /invoke-expression\s*\(\s*new-object\s+net\.webclient/i,
  /chmod\s+\+x\s+.*&&.*\.\//i,
  /eval\s*\(\s*Buffer\.from\s*\(/i
];

export interface SkillSecurityAuditInput {
  skillId: string;
  name: string;
  source: string;
  license: string;
  scope?: string;
  instructions: string;
  scripts?: string[];
}

export function auditSkillSecurity(input: SkillSecurityAuditInput): SkillAuditReport {
  const textToScan = `${input.name}\n${input.instructions}\n${(input.scripts || []).join('\n')}`;

  let promptInjectionRisk = false;
  let maliciousCommandRisk = false;
  const conflictingRules: string[] = [];

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(textToScan)) {
      promptInjectionRisk = true;
      conflictingRules.push(`Prompt Injection pattern detected: ${pattern.source}`);
    }
  }

  for (const pattern of MALICIOUS_COMMAND_PATTERNS) {
    if (pattern.test(textToScan)) {
      maliciousCommandRisk = true;
      conflictingRules.push(`Malicious execution command detected: ${pattern.source}`);
    }
  }

  // Assess security risk level
  let securityRisk: SecurityRiskLevel = 'NONE';
  let approvalStatus: SkillAuditReport['approvalStatus'] = 'APPROVED';

  if (maliciousCommandRisk) {
    securityRisk = 'CRITICAL';
    approvalStatus = 'REJECTED';
  } else if (promptInjectionRisk) {
    securityRisk = 'HIGH';
    approvalStatus = 'REJECTED';
  } else if (input.license.toLowerCase() === 'unknown' || input.license.toLowerCase() === 'unclear') {
    securityRisk = 'LOW';
    approvalStatus = 'NEEDS_SANDBOXING';
  }

  const quality = securityRisk === 'CRITICAL' || securityRisk === 'HIGH' ? 'POOR' : 'HIGH';

  const report: SkillAuditReport = {
    skillId: input.skillId,
    name: input.name,
    source: input.source,
    license: input.license,
    scope: input.scope || 'UI_ASSISTANCE',
    quality,
    conflictingRules,
    securityRisk,
    verifiedSafe: securityRisk === 'NONE' || securityRisk === 'LOW',
    suggestedUse: approvalStatus === 'APPROVED' ? 'Direct execution allowed' : 'Sandboxed or rejected',
    approvalStatus,
    promptInjectionRisk,
    maliciousCommandRisk
  };

  SkillAuditReportSchema.parse(report);
  return report;
}
