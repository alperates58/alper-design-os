import {
  CodeQualityRule,
  EngineeringQualityProfile,
  EngineeringQualityProfileSchema,
  PerformanceBudgets,
  SecurityLevel,
  SecurityStandard
} from './types.js';

export interface PolicyGeneratorOptions {
  securityStandard?: SecurityStandard;
  securityLevel?: SecurityLevel;
  tighterPerformanceBudget?: boolean;
  isMissionCritical?: boolean;
}

export function generateEngineeringProfile(
  stackId: string,
  options: PolicyGeneratorOptions = {}
): EngineeringQualityProfile {
  const normStack = stackId.toLowerCase();
  const standard: SecurityStandard = options.securityStandard || 'OWASP_ASVS_5_0';
  const level: SecurityLevel = options.securityLevel || (options.isMissionCritical ? 'LEVEL_3' : 'LEVEL_2');

  const basePerformance: PerformanceBudgets = options.tighterPerformanceBudget
    ? {
        lcpMs: 1800,
        inpMs: 100,
        cls: 0.05,
        maxInitialJsBundleKb: 180,
        maxTotalPageWeightKb: 1000,
        maxApiLatencyMs: 250
      }
    : {
        lcpMs: 2500,
        inpMs: 200,
        cls: 0.1,
        maxInitialJsBundleKb: 300,
        maxTotalPageWeightKb: 1500,
        maxApiLatencyMs: 500
      };

  let codeQualityRules: CodeQualityRule[] = [];
  let enabledLinters: string[] = [];
  let securityRuleset = 'p/security-audit';

  // 1. Stack-aware policy rules
  if (normStack.includes('react') || normStack.includes('typescript') || normStack.includes('javascript') || normStack.includes('node')) {
    enabledLinters = ['eslint', 'typescript-eslint', 'semgrep'];
    codeQualityRules = [
      {
        id: 'ts-strict-null-checks',
        name: 'TypeScript Strict Null Checks',
        tool: 'tsc',
        severity: 'ERROR',
        description: 'Eliminates unexpected undefined/null runtime exceptions across codebase.',
        autofixable: false
      },
      {
        id: 'eslint-no-floating-promises',
        name: '@typescript-eslint/no-floating-promises',
        tool: 'typescript-eslint',
        severity: 'ERROR',
        description: 'Requires all async promises to be handled or awaited to prevent silent failures.',
        autofixable: false
      },
      {
        id: 'eslint-no-explicit-any',
        name: '@typescript-eslint/no-explicit-any',
        tool: 'typescript-eslint',
        severity: 'WARNING',
        description: 'Forbids untyped any variables to guarantee static type soundness.',
        autofixable: true
      },
      {
        id: 'semgrep-xss-react-dangerouslysetinnerhtml',
        name: 'React dangerouslySetInnerHTML Inspection',
        tool: 'semgrep',
        severity: 'ERROR',
        description: 'Detects unsanitized DOM HTML injection vulnerabilities.',
        autofixable: false
      }
    ];
  } else if (normStack.includes('laravel')) {
    enabledLinters = ['laravel-pint', 'phpstan', 'larastan', 'semgrep'];
    codeQualityRules = [
      {
        id: 'pint-psr-12',
        name: 'Laravel Pint PSR-12 & Opinionated Styling',
        tool: 'laravel-pint',
        severity: 'WARNING',
        description: 'Enforces strict PSR-12 and Laravel naming conventions across models and controllers.',
        autofixable: true
      },
      {
        id: 'larastan-level-8',
        name: 'Larastan Model & Scope Type Inference',
        tool: 'phpstan',
        severity: 'ERROR',
        description: 'Validates Eloquent relations, scopes, and query builder method signatures.',
        autofixable: false
      },
      {
        id: 'laravel-csrf-middleware',
        name: 'VerifyCsrfToken Middleware Enforcement',
        tool: 'semgrep',
        severity: 'ERROR',
        description: 'Ensures state-changing POST/PUT/DELETE routes are shielded by CSRF tokens.',
        autofixable: false
      },
      {
        id: 'laravel-blade-raw-output',
        name: 'Blade Raw Echo Unescaped Guard {!! !!}',
        tool: 'semgrep',
        severity: 'ERROR',
        description: 'Flags unescaped blade outputs to prevent persistent XSS vulnerabilities.',
        autofixable: false
      }
    ];
  } else if (normStack.includes('php')) {
    enabledLinters = ['phpcs', 'phpstan', 'semgrep'];
    codeQualityRules = [
      {
        id: 'php-psr-12',
        name: 'PHP-FIG PSR-12 Coding Standard',
        tool: 'phpcs',
        severity: 'WARNING',
        description: 'Standardizes method declarations, namespace declarations, and control structures.',
        autofixable: true
      },
      {
        id: 'phpstan-level-7',
        name: 'PHPStan Level 7 Static Type Check',
        tool: 'phpstan',
        severity: 'ERROR',
        description: 'Catches missing return types, invalid union operations, and non-existent methods.',
        autofixable: false
      },
      {
        id: 'php-sql-injection-pdo',
        name: 'PDO Prepared Statements Mandatory',
        tool: 'semgrep',
        severity: 'ERROR',
        description: 'Prevents SQL string concatenation in SQL queries.',
        autofixable: false
      }
    ];
  } else if (normStack.includes('aspnet') || normStack.includes('razor') || normStack.includes('csharp') || normStack.includes('dotnet')) {
    enabledLinters = ['roslyn-analyzers', 'security-code-scan', 'semgrep'];
    codeQualityRules = [
      {
        id: 'roslyn-ca2000-dispose-objects',
        name: 'CA2000: Dispose Objects Before Losing Scope',
        tool: 'roslyn',
        severity: 'WARNING',
        description: 'Prevents resource and file handle leaks in ASP.NET request lifecycles.',
        autofixable: false
      },
      {
        id: 'aspnet-antiforgery-token',
        name: 'AutoValidateAntiforgeryToken Attribute',
        tool: 'roslyn',
        severity: 'ERROR',
        description: 'Verifies global or controller anti-forgery filters for Razor form submissions.',
        autofixable: false
      },
      {
        id: 'roslyn-async-await-configureawait',
        name: 'Async Best Practices & Deadlock Prevention',
        tool: 'roslyn',
        severity: 'WARNING',
        description: 'Enforces asynchronous non-blocking I/O across controller endpoints.',
        autofixable: false
      }
    ];
  } else {
    // Generic Web Standards
    enabledLinters = ['htmlhint', 'stylelint', 'semgrep'];
    codeQualityRules = [
      {
        id: 'web-csp-header',
        name: 'Content-Security-Policy (CSP) Definition',
        tool: 'semgrep',
        severity: 'ERROR',
        description: 'Requires strict default-src, script-src, and object-src to eliminate inline script execution.',
        autofixable: false
      },
      {
        id: 'web-hsts-secure-cookies',
        name: 'HSTS & Secure / HttpOnly / SameSite Cookies',
        tool: 'semgrep',
        severity: 'ERROR',
        description: 'Enforces transport security and session cookie encapsulation against client-side theft.',
        autofixable: false
      },
      {
        id: 'web-input-sanitization',
        name: 'DOM XSS Input/Output Sanitization',
        tool: 'semgrep',
        severity: 'ERROR',
        description: 'Validates that user input is escaped before DOM insertion via innerHTML or document.write.',
        autofixable: false
      }
    ];
  }

  const profile: EngineeringQualityProfile = {
    profileId: `eng-profile-${normStack.replace(/[^a-z0-9]+/g, '-')}`,
    stackId,
    securityStandard: standard,
    securityLevel: level,
    codeQualityRules,
    performanceBudgets: basePerformance,
    testingRequirements: {
      minUnitCoveragePercent: options.isMissionCritical ? 90 : 80,
      requireIntegrationTests: true,
      requireE2eTests: true,
      requireAccessibilityTests: true,
      requireContractTests: normStack.includes('api') || normStack.includes('microservice'),
      requireVisualRegressionTests: true,
      testPyramidFocus: 'BALANCED'
    },
    dependencyPolicy: {
      blockKnownVulnerabilities: 'HIGH_AND_CRITICAL',
      allowedLicenses: ['MIT', 'Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause', 'ISC', 'CC0-1.0'],
      disallowGplInProprietary: true,
      maxDependencyAgeDays: 365,
      requireLockfileVerification: true,
      enforceAuditInCi: true
    },
    secretPolicy: {
      zeroToleranceSecrets: true,
      scanPatterns: ['AWS_KEY', 'OPENAI_API_KEY', 'JWT_SECRET', 'DATABASE_URL', 'PRIVATE_KEY', 'GENERIC_SECRET'],
      requireEnvExample: true,
      enforcePreCommitHook: true
    },
    staticAnalysis: {
      enabledLinters,
      semgrepEnabled: true,
      strictTypeChecking: true,
      securityRuleset,
      failOnWarning: false
    },
    dynamicAnalysis: {
      mode: 'PASSIVE_ONLY',
      allowedEnvironments: ['LOCALHOST', 'DEVELOPMENT', 'STAGING'],
      zapScanEnabled: false,
      requireExplicitApprovalForActive: true
    },
    accessibilityTargets: {
      standard: 'WCAG_2_1_AA',
      axeRuleset: 'wcag21aa',
      zeroViolationsAllowed: true,
      enforceKeyboardNavigationCheck: true
    },
    releaseGates: {
      blockOnCriticalSecurity: true,
      blockOnHighSecurity: true,
      blockOnSecretDetected: true,
      blockOnExploitableDependency: true,
      blockOnFailedCriticalTests: true,
      mediumSecurityAction: 'WARN',
      lowSecurityAction: 'WARN'
    }
  };

  return EngineeringQualityProfileSchema.parse(profile);
}
