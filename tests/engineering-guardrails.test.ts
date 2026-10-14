import { describe, it, expect } from 'vitest';
import {
  generateEngineeringProfile,
  evaluateReleaseGates,
  createThreatModel,
  runBuiltinStaticAudit,
  runSafeSecurityScan,
  detectAllToolCapabilities,
  getToolCapability,
  EngineeringQualityProfileSchema,
  AuditFinding
} from '@alper-design-os/engineering-guardrails';

describe('Engineering Guardrails Layer', () => {
  describe('Stack-Aware Policy Generation', () => {
    it('generates a compliant EngineeringQualityProfile for JavaScript / TypeScript', () => {
      const profile = generateEngineeringProfile('react-typescript');
      expect(EngineeringQualityProfileSchema.safeParse(profile).success).toBe(true);
      expect(profile.staticAnalysis.enabledLinters).toContain('typescript-eslint');
      expect(profile.codeQualityRules.some((r) => r.id === 'ts-strict-null-checks')).toBe(true);
      expect(profile.performanceBudgets.lcpMs).toBeLessThanOrEqual(2500);
      expect(profile.performanceBudgets.inpMs).toBeLessThanOrEqual(200);
      expect(profile.performanceBudgets.cls).toBeLessThanOrEqual(0.1);
    });

    it('generates stack-tailored policies for Laravel and PHP', () => {
      const laravelProfile = generateEngineeringProfile('laravel-blade');
      expect(laravelProfile.staticAnalysis.enabledLinters).toContain('laravel-pint');
      expect(laravelProfile.codeQualityRules.some((r) => r.id === 'laravel-csrf-middleware')).toBe(true);

      const phpProfile = generateEngineeringProfile('php');
      expect(phpProfile.staticAnalysis.enabledLinters).toContain('phpstan');
      expect(phpProfile.codeQualityRules.some((r) => r.id === 'php-psr-12')).toBe(true);
    });

    it('generates Roslyn and security analyzer policies for ASP.NET', () => {
      const aspnetProfile = generateEngineeringProfile('aspnet-razor');
      expect(aspnetProfile.staticAnalysis.enabledLinters).toContain('roslyn-analyzers');
      expect(aspnetProfile.codeQualityRules.some((r) => r.id === 'aspnet-antiforgery-token')).toBe(true);
    });

    it('supports tightened performance budgets for mission-critical apps', () => {
      const tightProfile = generateEngineeringProfile('react-typescript', {
        tighterPerformanceBudget: true,
        isMissionCritical: true
      });
      expect(tightProfile.performanceBudgets.lcpMs).toBeLessThanOrEqual(1800);
      expect(tightProfile.performanceBudgets.inpMs).toBeLessThanOrEqual(100);
      expect(tightProfile.securityLevel).toBe('LEVEL_3');
    });
  });

  describe('Release Gate Evaluation', () => {
    const defaultPolicy = {
      blockOnCriticalSecurity: true,
      blockOnHighSecurity: true,
      blockOnSecretDetected: true,
      blockOnExploitableDependency: true,
      blockOnFailedCriticalTests: true,
      mediumSecurityAction: 'WARN' as const,
      lowSecurityAction: 'WARN' as const
    };

    it('BLOCKS release when a secret is detected', () => {
      const findings: AuditFinding[] = [
        {
          id: 'test-secret',
          category: 'SECRET',
          severity: 'CRITICAL',
          title: 'AWS Secret Key in code',
          description: 'Cleartext secret exposed in code',
          tool: 'secret-scanner',
          remediation: 'Revoke and move to env'
        }
      ];

      const evaluation = evaluateReleaseGates(findings, defaultPolicy);
      expect(evaluation.passed).toBe(false);
      expect(evaluation.decision).toBe('BLOCK');
      expect(evaluation.failedGates).toContain('GATE_SECRET_SCAN');
      expect(evaluation.blockers.length).toBe(1);
    });

    it('BLOCKS release when a critical/high security issue is detected', () => {
      const findings: AuditFinding[] = [
        {
          id: 'test-rce',
          category: 'SECURITY',
          severity: 'CRITICAL',
          title: 'Remote Code Execution',
          description: 'Dynamic eval with user input',
          tool: 'semgrep',
          remediation: 'Remove eval'
        }
      ];

      const evaluation = evaluateReleaseGates(findings, defaultPolicy);
      expect(evaluation.passed).toBe(false);
      expect(evaluation.decision).toBe('BLOCK');
      expect(evaluation.failedGates).toContain('GATE_CRITICAL_SECURITY');
    });

    it('BLOCKS release when critical tests fail', () => {
      const evaluation = evaluateReleaseGates([], defaultPolicy, true);
      expect(evaluation.passed).toBe(false);
      expect(evaluation.decision).toBe('BLOCK');
      expect(evaluation.failedGates).toContain('GATE_CRITICAL_TESTS');
    });

    it('PASSES release when only warnings or no findings exist', () => {
      const findings: AuditFinding[] = [
        {
          id: 'test-low',
          category: 'CODE_QUALITY',
          severity: 'LOW',
          title: 'Minor formatting issue',
          description: 'Trailing whitespace',
          tool: 'linter',
          remediation: 'Run formatter'
        }
      ];

      const evaluation = evaluateReleaseGates(findings, defaultPolicy);
      expect(evaluation.passed).toBe(true);
      expect(evaluation.decision).toBe('WARN');
      expect(evaluation.blockers.length).toBe(0);
      expect(evaluation.warnings.length).toBe(1);
    });
  });

  describe('Threat Modeling Engine', () => {
    it('generates a STRIDE-aligned threat model for an operational system', () => {
      const threatModel = createThreatModel({
        productName: 'FactoryOS Core',
        domain: 'Industrial Scheduling'
      });

      expect(threatModel.threats.length).toBeGreaterThanOrEqual(5);
      const categories = threatModel.threats.map((t) => t.category);
      expect(categories).toContain('SPOOFING');
      expect(categories).toContain('TAMPERING');
      expect(categories).toContain('ELEVATION_OF_PRIVILEGE');
      expect(threatModel.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('Built-in Static and Secret Scanner', () => {
    it('detects live AWS keys, OpenAI keys, private keys, and eval patterns', () => {
      const target = {
        files: [
          {
            path: 'src/config.ts',
            content: `
              export const AWS_ACCESS_KEY = "AKIAIOSFODNN7EXAMPLE";
              export const OPENAI_KEY = "sk-abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUV";
              const r = eval("2 + 2");
            `
          }
        ]
      };

      const findings = runBuiltinStaticAudit(target);
      expect(findings.length).toBeGreaterThanOrEqual(3);
      expect(findings.some((f) => f.category === 'SECRET' && f.title.includes('AWS'))).toBe(true);
      expect(findings.some((f) => f.category === 'SECRET' && f.title.includes('OpenAI'))).toBe(true);
      expect(findings.some((f) => f.category === 'SECURITY' && f.title.includes('eval'))).toBe(true);
    });
  });

  describe('Safe Security Scanning Protocol', () => {
    it('executes passive audit safely by default without external side-effects', async () => {
      const result = await runSafeSecurityScan({
        files: [{ path: 'test.ts', content: 'console.log("safe");' }]
      });
      expect(result.success).toBe(true);
      expect(result.executionMode).toBe('PASSIVE');
      expect(result.findings.length).toBe(0);
    });

    it('BLOCKS active scanning against production or non-local targets', async () => {
      const result = await runSafeSecurityScan(
        { targetUrl: 'https://example.com' },
        { mode: 'ACTIVE', environment: 'PRODUCTION', userExplicitApproval: true }
      );
      expect(result.success).toBe(false);
      expect(result.findings.some((f) => f.id.includes('blocked-remote'))).toBe(true);
    });

    it('BLOCKS active scanning even on localhost if explicit approval is missing', async () => {
      const result = await runSafeSecurityScan(
        { targetUrl: 'http://localhost:3000' },
        { mode: 'ACTIVE', environment: 'DEVELOPMENT', userExplicitApproval: false }
      );
      expect(result.success).toBe(false);
      expect(result.findings.some((f) => f.id.includes('approval-missing'))).toBe(true);
    });

    it('permits active scanning on localhost with explicit user approval', async () => {
      const result = await runSafeSecurityScan(
        { targetUrl: 'http://localhost:3000', files: [] },
        { mode: 'ACTIVE', environment: 'DEVELOPMENT', userExplicitApproval: true }
      );
      expect(result.success).toBe(true);
      expect(result.executionMode).toBe('ACTIVE');
    });
  });

  describe('Tool Capability Detection', () => {
    it('detects capability status across recognized tools without crashing', () => {
      const capabilities = detectAllToolCapabilities();
      expect(capabilities.length).toBeGreaterThanOrEqual(10);
      for (const cap of capabilities) {
        expect(['AVAILABLE', 'OPTIONAL', 'MISSING', 'UNSUPPORTED']).toContain(cap.status);
        expect(cap.toolId).toBeTruthy();
        expect(cap.category).toBeTruthy();
      }
    }, 45000);

    it('inspects a single tool capability gracefully with recommendation if missing', () => {
      const chromeCap = getToolCapability('chrome');
      expect(['AVAILABLE', 'MISSING', 'OPTIONAL']).toContain(chromeCap.status);

      const fakeCap = getToolCapability('non-existent-tool');
      expect(fakeCap.status).toBe('UNSUPPORTED');
    });
  });
});
