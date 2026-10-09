import { AuditFinding } from '../types.js';
import { runBuiltinStaticAudit } from './builtin-auditor.js';
import { ScanOptions, ScanResult, ScanTarget } from './contract.js';

export function isLocalOrSafeEnvironment(urlStr?: string, environment?: string): boolean {
  if (environment === 'PRODUCTION') return false;

  if (!urlStr) return true; // Local file audit is safe

  try {
    const parsed = new URL(urlStr);
    const host = parsed.hostname.toLowerCase();

    return (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '::1' ||
      host.endsWith('.local') ||
      host.endsWith('.internal') ||
      environment === 'DEVELOPMENT' ||
      environment === 'STAGING'
    );
  } catch {
    return false;
  }
}

export async function runSafeSecurityScan(
  target: ScanTarget,
  options: ScanOptions = {}
): Promise<ScanResult> {
  const startTime = Date.now();
  const mode = options.mode || 'PASSIVE';
  const environment = options.environment || 'DEVELOPMENT';

  // 1. Strict Active Scanning Safety Guardrail
  if (mode === 'ACTIVE') {
    const isSafe = isLocalOrSafeEnvironment(target.targetUrl, environment);

    if (!isSafe) {
      return {
        tool: 'safety-guardrail',
        category: 'DAST',
        executionMode: 'ACTIVE',
        success: false,
        durationMs: Date.now() - startTime,
        summary: 'Active security scan BLOCKED: Target is not a verified local/staging environment.',
        findings: [
          {
            id: 'safety-active-scan-blocked-remote',
            category: 'SECURITY',
            severity: 'CRITICAL',
            title: 'Active DAST Scanning Blocked Against Production/Remote Target',
            description: `Attempted active scan against ${target.targetUrl || 'unspecified remote target'} in ${environment} mode. Active scanning on production targets is prohibited by Alper Design OS safety policy.`,
            tool: 'safety-guardrail',
            remediation: 'Restrict active scans to localhost or staging environments with explicit user approval.'
          }
        ]
      };
    }

    if (!options.userExplicitApproval) {
      return {
        tool: 'safety-guardrail',
        category: 'DAST',
        executionMode: 'ACTIVE',
        success: false,
        durationMs: Date.now() - startTime,
        summary: 'Active security scan BLOCKED: Explicit user approval flag (userExplicitApproval: true) required.',
        findings: [
          {
            id: 'safety-active-scan-approval-missing',
            category: 'SECURITY',
            severity: 'HIGH',
            title: 'User Approval Missing for Active Security Scan',
            description: 'Active scanning performs potentially intrusive HTTP requests and requires explicit user consent.',
            tool: 'safety-guardrail',
            remediation: 'Re-run with userExplicitApproval: true after user confirmation.'
          }
        ]
      };
    }
  }

  // 2. Execute Passive Built-in Audit
  const findings: AuditFinding[] = runBuiltinStaticAudit(target);

  return {
    tool: 'builtin-safe-scanner',
    category: 'HYBRID_SECURITY',
    executionMode: mode,
    success: true,
    durationMs: Date.now() - startTime,
    summary: `Safe security scan completed in ${mode} mode. ${findings.length} finding(s) detected.`,
    findings
  };
}
