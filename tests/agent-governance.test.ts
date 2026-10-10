import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  evaluateFileScope,
  auditActionScope,
  checkCommandDestructiveness,
  parseGitStatus,
  createCheckpointPlan,
  generateRollbackScript,
  evaluateChangeRisk,
  createActionPlan,
  validateActionPlan,
  performIndependentReview,
  ExternalToolOrchestrator,
  createEvidence,
  validateResponsiveVerification,
  normalizeEvidenceBatch,
  evaluateCompletionClaim,
  auditClaimsInText,
  DomainIntelligenceV2Engine,
  critiqueDesign,
  extractBehavioralContract,
  verifyBehavioralPreservation,
  detectRegressions,
  createEnvironmentProfile,
  redactText,
  redactObject,
  containsSecrets,
  evaluateSourceFreshness,
  auditCatalogFreshness,
  routeContext,
  routeTool,
  auditOfflineCapabilities,
  writeExecutionJournal,
  resolvePolicyConflict,
  createCompletionContract,
  planPipeline
} from '../packages/agent-governance/src/index.js';

describe('Phase 1B: Agent Governance, Orchestration & Safety Layer', () => {

  // ==========================================================
  // 1. Scope Guard & Boundary Protection
  // ==========================================================
  describe('Scope Guard', () => {
    it('detects in-scope files matching user request', () => {
      const result = evaluateFileScope('src/components/LoginScreen.tsx', ['LoginScreen.tsx']);
      expect(result.status).toBe('IN_SCOPE');
    });

    it('identifies required sub-dependencies for UI changes', () => {
      const result = evaluateFileScope('src/styles/login.module.css', ['login screen UI']);
      expect(result.status).toBe('REQUIRED_DEPENDENCY');
    });

    it('flags uninvited database or package manager changes as OUT_OF_SCOPE', () => {
      const dbResult = evaluateFileScope('database/migrations/2026_create_users.php', ['login screen']);
      expect(dbResult.status).toBe('OUT_OF_SCOPE');

      const pkgResult = evaluateFileScope('package.json', ['login screen']);
      expect(pkgResult.status).toBe('OUT_OF_SCOPE');
    });

    it('categorically blocks system-protected or explicitly forbidden files', () => {
      const envResult = evaluateFileScope('.env.production', ['login screen']);
      expect(envResult.status).toBe('FORBIDDEN');

      const explicitForbidden = evaluateFileScope(
        'src/services/billing.ts',
        ['login screen'],
        ['src/services/billing.ts']
      );
      expect(explicitForbidden.status).toBe('FORBIDDEN');
    });

    it('rejects changesets containing scope expansions or violations', () => {
      const audit = auditActionScope(
        ['src/login.tsx', 'src/billing.ts', '.env'],
        ['src/login.tsx']
      );
      expect(audit.isClean).toBe(false);
      expect(audit.violations.length).toBe(1); // .env
      expect(audit.expansions.length).toBe(1); // billing.ts
      expect(audit.allowedFiles).toEqual(['src/login.tsx']);
    });
  });

  // ==========================================================
  // 2. Destructive Git Protection & Working Tree Safety
  // ==========================================================
  describe('Git Safety Engine', () => {
    it('blocks destructive git commands without explicit user approval', () => {
      const checkReset = checkCommandDestructiveness('git reset --hard HEAD~1', false);
      expect(checkReset.isDestructive).toBe(true);
      expect(checkReset.blockedReason).toContain('Blocked destructive command');

      const checkClean = checkCommandDestructiveness('git clean -fd', false);
      expect(checkClean.isDestructive).toBe(true);

      const checkForcePush = checkCommandDestructiveness('git push origin main --force', false);
      expect(checkForcePush.isDestructive).toBe(true);
    });

    it('allows destructive operations ONLY with explicit user approval', () => {
      const checkReset = checkCommandDestructiveness('git reset --hard HEAD', true);
      expect(checkReset.isDestructive).toBe(true);
      expect(checkReset.blockedReason).toBeUndefined();
    });

    it('permits non-destructive git commands freely', () => {
      const checkStatus = checkCommandDestructiveness('git status');
      expect(checkStatus.isDestructive).toBe(false);
      expect(checkStatus.requiresExplicitApproval).toBe(false);
    });

    it('accurately parses dirty git status and detects modified/untracked files', () => {
      const sampleStatus = `
On branch main
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
	new file:   src/new-feature.ts

Changes not staged for commit:
	modified:   src/app.ts
	deleted:    src/old.ts

Untracked files:
	scratch/temp.log
`;
      const status = parseGitStatus(sampleStatus, 'main');
      expect(status.isClean).toBe(false);
      expect(status.isMainOrMaster).toBe(true);
      expect(status.modifiedFiles).toContain('src/app.ts');
      expect(status.stagedFiles).toContain('src/new-feature.ts');
      expect(status.untrackedFiles).toContain('scratch/temp.log');
    });

    it('creates checkpoint plan and warns on dirty tree or main branch', () => {
      const status = parseGitStatus('On branch main\n modified: src/app.ts', 'main');
      const plan = createCheckpointPlan(status, 'Refactor Login');

      expect(plan.safeToProceed).toBe(true);
      expect(plan.requiresApproval).toBe(true);
      expect(plan.warnings.some(w => w.includes('dirty'))).toBe(true);
      expect(plan.warnings.some(w => w.includes('temporary feature branch'))).toBe(true);
      expect(plan.rollbackScript.length).toBeGreaterThan(0);
    });

    it('generates deterministic rollback scripts for modified files', () => {
      const rollback = generateRollbackScript(['src/a.ts', 'src/b.ts'], 'checkpoint-123');
      expect(rollback).toContain('git checkout -- "src/a.ts"');
      expect(rollback).toContain('git checkout -- "src/b.ts"');
      expect(rollback).toContain('git status');
    });
  });

  // ==========================================================
  // 3. Change Risk / Blast Radius & Action Planner
  // ==========================================================
  describe('Risk Evaluator & Action Planner', () => {
    it('evaluates low risk for targeted cosmetic changes', () => {
      const risk = evaluateChangeRisk({ fileCount: 1 });
      expect(risk.overallRisk).toBe('LOW');
      expect(risk.mandatoryCheckpoint).toBe(false);
      expect(risk.requiresApproval).toBe(false);
    });

    it('evaluates HIGH or CRITICAL risk for database, auth, and data-loss changes', () => {
      const criticalRisk = evaluateChangeRisk({
        fileCount: 4,
        databaseImpact: true,
        authenticationImpact: true,
        dataLossPossibility: true
      });
      expect(criticalRisk.overallRisk).toBe('CRITICAL');
      expect(criticalRisk.mandatoryCheckpoint).toBe(true);
      expect(criticalRisk.requiresApproval).toBe(true);
      expect(criticalRisk.recommendedSafeguards.length).toBeGreaterThan(0);
    });

    it('generates a typed AgentActionPlan and rejects unauthorized scope', () => {
      const plan = createActionPlan({
        objective: 'Fix button hover styling on login',
        requestedScope: ['src/components/LoginButton.tsx'],
        filesExpectedToChange: ['src/components/LoginButton.tsx']
      });
      expect(plan.objective).toBeTruthy();
      expect(plan.estimatedBlastRadius).toBe('LOW');
      expect(plan.verificationPlan.length).toBeGreaterThan(0);
      expect(plan.rollbackPlan.steps.length).toBeGreaterThan(0);
      expect(validateActionPlan(plan).valid).toBe(true);

      // Rejects action plan with forbidden or out-of-scope files
      expect(() => {
        createActionPlan({
          objective: 'Sneak database migration into styling task',
          requestedScope: ['src/components/LoginButton.tsx'],
          filesExpectedToChange: ['src/components/LoginButton.tsx', 'database/migrations/drop_users.sql']
        });
      }).toThrow(/scope boundary violations/);
    });
  });

  // ==========================================================
  // 4. Independent Reviewer Engine
  // ==========================================================
  describe('Independent Reviewer', () => {
    it('REJECTS changes with critical security vulnerabilities (e.g. eval, unsanitized html)', () => {
      const result = performIndependentReview({
        taskObjective: 'Calculate dynamic price formula',
        diffContent: '+ const result = eval(userFormula);',
        filesChanged: ['src/calculator.ts'],
        testsPassed: true
      });
      expect(result.verdict).toBe('REJECT');
      expect(result.checks.security).toBe(false);
      expect(result.findings.some(f => f.category === 'SECURITY')).toBe(true);
    });

    it('REJECTS or requires repair when automated unit tests fail', () => {
      const result = performIndependentReview({
        taskObjective: 'Optimize query cache',
        diffContent: '+ return cached;',
        filesChanged: ['src/cache.ts'],
        testsPassed: false
      });
      expect(result.verdict).toBe('REJECT');
      expect(result.checks.regressionRisk).toBe(false);
    });

    it('flags unhandled browser console runtime errors and network 4xx/5xx', () => {
      const result = performIndependentReview({
        taskObjective: 'Add analytics tracker',
        diffContent: '+ tracker.init();',
        filesChanged: ['src/analytics.ts'],
        testsPassed: true,
        consoleErrors: ['Uncaught TypeError: tracker.init is not a function'],
        networkErrors: ['POST https://api.example.com/v1/metrics - 500 Internal Server Error']
      });
      expect(result.verdict).toBe('REPAIR_REQUIRED');
      expect(result.checks.errorHandling).toBe(false);
      expect(result.findings.some(f => f.category === 'RUNTIME_CONSOLE_ERROR')).toBe(true);
    });

    it('APPROVES cleanly verified changes with zero findings', () => {
      const result = performIndependentReview({
        taskObjective: 'Update accessible label for search input',
        diffContent: '+ <input aria-label="Search items" />',
        filesChanged: ['src/Search.tsx'],
        testsPassed: true,
        consoleErrors: [],
        networkErrors: []
      });
      expect(result.verdict).toBe('APPROVE');
      expect(result.checks.accessibility).toBe(true);
      expect(result.findings.length).toBe(0);
    });
  });

  // ==========================================================
  // 5. Tool Orchestration & Fake PASS Prevention
  // ==========================================================
  describe('Tool Orchestration & Verification Normalization', () => {
    it('returns UNVERIFIED when external MCP is missing and NEVER produces a fake PASS', () => {
      const orchestrator = new ExternalToolOrchestrator();
      orchestrator.setToolAvailable('playwright', false);

      const outcome = orchestrator.executeVerificationFlow(
        {
          targetUrl: 'http://localhost:3000/login',
          flows: [{ name: 'Login Flow', steps: [{ action: 'navigate' }] }]
        },
        'playwright'
      );

      expect(outcome.status).toBe('UNVERIFIED');
      expect(outcome.flowsExecuted).toBe(0);
      expect(outcome.evidenceGenerated.length).toBe(0);
      expect(outcome.notes).toContain('No fake PASS generated');
    });

    it('collects concrete verification evidence when external tool is available', () => {
      const orchestrator = new ExternalToolOrchestrator();
      const outcome = orchestrator.executeVerificationFlow(
        {
          targetUrl: 'http://localhost:3000/login',
          flows: [
            {
              name: 'Submit Credentials',
              steps: [{ action: 'navigate' }, { action: 'screenshot' }]
            }
          ],
          captureConsole: true,
          captureNetwork: true
        },
        'playwright'
      );

      expect(outcome.status).toBe('VERIFIED');
      expect(outcome.evidenceGenerated.length).toBeGreaterThanOrEqual(3);
      expect(outcome.evidenceGenerated.some(e => e.type === 'SCREENSHOT')).toBe(true);
      expect(outcome.evidenceGenerated.some(e => e.type === 'CONSOLE_LOG')).toBe(true);
      expect(outcome.evidenceGenerated.some(e => e.type === 'NETWORK_TRACE')).toBe(true);
    });
  });

  // ==========================================================
  // 6. Evidence-Based Verification & Responsive Matrix
  // ==========================================================
  describe('Evidence Engine & Viewport Matrix', () => {
    it('supports 13 typed evidence categories', () => {
      const ev = createEvidence('STATIC_ANALYSIS', 'ESLint', '0 lint violations found');
      expect(ev.type).toBe('STATIC_ANALYSIS');
      expect(ev.verified).toBe(true);
    });

    it('strictly requires all 4 viewports (390x844, 768x1024, 1440x900, 1920x1080) for Responsive PASS', () => {
      const partialEvidence = [createEvidence('SCREENSHOT', 'Playwright', 'Screenshot')];

      // Missing some viewports
      const partialCheck = validateResponsiveVerification(
        [
          { width: 390, height: 844 },
          { width: 768, height: 1024 }
        ],
        partialEvidence
      );
      expect(partialCheck.status).toBe('PARTIALLY_VERIFIED');
      expect(partialCheck.verified).toBe(false);
      expect(partialCheck.missingViewports).toContain('1440x900 (Desktop Standard)');

      // Full viewport matrix
      const fullCheck = validateResponsiveVerification(
        [
          { width: 390, height: 844 },
          { width: 768, height: 1024 },
          { width: 1440, height: 900 },
          { width: 1920, height: 1080 }
        ],
        partialEvidence
      );
      expect(fullCheck.status).toBe('VERIFIED');
      expect(fullCheck.verified).toBe(true);
      expect(fullCheck.missingViewports.length).toBe(0);
    });

    it('normalizes heterogeneous evidence objects into standard schema', () => {
      const raw = [{ type: 'BUILD_OUTPUT', source: 'tsc', summary: 'TypeScript build clean', verified: true }];
      const normalized = normalizeEvidenceBatch(raw);
      expect(normalized.length).toBe(1);
      expect(normalized[0]?.id).toContain('ev-build_output');
    });
  });

  // ==========================================================
  // 7. Claim Verification Policy
  // ==========================================================
  describe('Claim Verification Policy', () => {
    it('flags unbacked assertions like "Tamamen test edildi" or "Production ready"', () => {
      const audit = auditClaimsInText('Kod tamamlandı. Tamamen test edildi ve production ready.');
      expect(audit.passed).toBe(false);
      expect(audit.unverifiedPhrases.length).toBe(2);
      expect(audit.evaluatedClaims[0]?.status).toBe('NOT_VERIFIED');
    });

    it('marks claim VERIFIED only when requisite evidence types are present', () => {
      const evidences = [
        createEvidence('TEST_RESULT', 'Vitest', '145 tests passed', { verified: true }),
        createEvidence('BUILD_OUTPUT', 'tsc', 'Build ok', { verified: true }),
        createEvidence('SECURITY_REPORT', 'Audit', '0 vulnerabilities', { verified: true })
      ];

      const claimResult = evaluateCompletionClaim('production ready', evidences);
      expect(claimResult.status).toBe('VERIFIED');
      expect(claimResult.evidenceIds.length).toBe(3);
    });
  });

  // ==========================================================
  // 8. Domain Intelligence V2 & Fallback Baseline
  // ==========================================================
  describe('Domain Intelligence V2', () => {
    it('falls back to deterministic baseline for unknown or offline queries without crashing', async () => {
      const engine = new DomainIntelligenceV2Engine();
      const result = await engine.researchDomain({
        userBrief: 'Custom specialized acoustic wave telemetry analyzer',
        offlineMode: true
      });
      expect(result.classification).toBeTruthy();
      expect(result.isFallback).toBe(true);
      expect(result.productModel).toBeDefined();
    });

    it('augments known industrial domain with empirical source evidence', async () => {
      const engine = new DomainIntelligenceV2Engine();
      const result = await engine.researchDomain({
        userBrief: 'Manufacturing Finite Capacity Scheduler (APS) with high-density Gantt'
      });
      expect(result.classification).toBe('INDUSTRIAL_OPERATIONAL');
      expect(result.confidenceScore).toBeGreaterThanOrEqual(0.65);
      expect(result.workflows.length).toBeGreaterThan(0);
    });
  });

  // ==========================================================
  // 9. Design Critic
  // ==========================================================
  describe('Design Critic Engine', () => {
    it('detects generic AI aesthetic smell (purple neon gradients & diffuse card blur)', () => {
      const markup = `
        <div class="p-8 backdrop-blur shadow-2xl rounded-3xl" style="background: linear-gradient(to right, #8a2be2, #ff0080);">
          <p>AI Card</p>
        </div>
      `;
      const critique = critiqueDesign({ markupOrCss: markup, domain: 'B2B_ENTERPRISE' });
      expect(critique.aiGenericSmellDetected).toBe(true);
      expect(critique.passed).toBe(false);
      expect(critique.dimensions.some(d => d.category === 'AI_GENERIC_APPEARANCE' && d.rating === 'POOR')).toBe(true);
    });

    it('clearly marks subjective aesthetic opinions with isSubjective: true', () => {
      const critique = critiqueDesign({ markupOrCss: '<h1>Title</h1><div class="flex">Items</div>' });
      const subjectiveDim = critique.dimensions.find(d => d.category === 'VISUAL_HIERARCHY');
      expect(subjectiveDim?.isSubjective).toBe(true);
    });
  });

  // ==========================================================
  // 10. Behavioral Contract & Existing Project Preservation
  // ==========================================================
  describe('Behavioral Contract Preservation', () => {
    it('extracts route, database, and role contracts from existing files', () => {
      const files = [
        { path: 'routes/web.php', content: "Route::get('/dashboard', [DashboardController::class, 'index']);" },
        { path: 'src/auth.ts', content: "if (!hasRole('ADMIN')) throw new Error();" },
        { path: 'database/schema.sql', content: 'CREATE TABLE users (id INT PRIMARY KEY);' }
      ];
      const contract = extractBehavioralContract(files);
      expect(contract.routes.some(r => r.path === '/dashboard')).toBe(true);
      expect(contract.permissions.some(p => p.role === 'ADMIN')).toBe(true);
      expect(contract.databaseBehaviors.some(d => d.table === 'users')).toBe(true);
    });

    it('detects critical route deletions or auth drops during modernization', () => {
      const baseline = extractBehavioralContract([
        { path: 'app.js', content: "app.get('/api/v1/orders', handler); hasRole('OPERATOR');" }
      ]);
      const candidateBroken = extractBehavioralContract([
        { path: 'app.js', content: "app.get('/api/v2/orders', handler);" } // broke /api/v1/orders and dropped role
      ]);

      const preservation = verifyBehavioralPreservation(baseline, candidateBroken);
      expect(preservation.preserved).toBe(false);
      expect(preservation.breaks.length).toBeGreaterThanOrEqual(2);
    });
  });

  // ==========================================================
  // 11. Regression Guard
  // ==========================================================
  describe('Regression Guard', () => {
    it('flags REGRESSION_SUSPECTED when post-change values drift from baseline', () => {
      const baselines = [
        { id: 'orders-endpoint', type: 'API_ENDPOINT' as const, expectedValue: { status: 200, count: 50 } },
        { id: 'gantt-root', type: 'DOM_SELECTOR' as const, expectedValue: '.gantt-container' }
      ];
      const current = [
        { id: 'orders-endpoint', type: 'API_ENDPOINT' as const, actualValue: { status: 500, error: 'DB Timeout' } },
        { id: 'gantt-root', type: 'DOM_SELECTOR' as const, actualValue: '.gantt-container' }
      ];

      const check = detectRegressions(baselines, current);
      expect(check.status).toBe('REGRESSION_SUSPECTED');
      expect(check.regressionsDetected.length).toBe(1);
    });
  });

  // ==========================================================
  // 12. Environment Profile & Cross-Machine Portability
  // ==========================================================
  describe('Environment Profile & Reproducibility', () => {
    it('detects machine-specific absolute paths breaking Work PC -> Home PC portability', () => {
      const files = [
        { path: 'package.json', content: JSON.stringify({ name: 'test', engines: { node: '>=20' } }) },
        { path: 'pnpm-lock.yaml', content: 'lockfileVersion: 9' },
        { path: 'config.json', content: JSON.stringify({ tempDir: 'C:\\Users\\alper\\AppData\\Local\\Temp' }) }
      ];
      const envProfile = createEnvironmentProfile(files);
      expect(envProfile.machineIndependent).toBe(false);
      expect(envProfile.portabilityIssues.some(p => p.includes('Hardcoded Windows absolute path'))).toBe(true);
    });
  });

  // ==========================================================
  // 13. Config & Secret Redaction
  // ==========================================================
  describe('Secret Safety & Redaction', () => {
    it('sanitizes API keys, JWTs, bearer tokens, and connection strings', () => {
      const rawLog = `
        Connecting to postgres://admin:SuperSecret123@db.prod.internal:5432/main
        Using OpenAI key: sk-abcdef1234567890abcdef1234567890
        Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.abc123def456
      `;
      expect(containsSecrets(rawLog)).toBe(true);

      const redacted = redactText(rawLog);
      expect(redacted.count).toBeGreaterThanOrEqual(3);
      expect(redacted.sanitized).not.toContain('SuperSecret123');
      expect(redacted.sanitized).not.toContain('sk-abcdef');
      expect(redacted.sanitized).toContain('[REDACTED_PASSWORD]');
    });

    it('redacts secrets in deeply nested objects', () => {
      const config = {
        server: { port: 3000 },
        auth: { apiKey: 'ghp_abcdefghijklmnopqrstuvwxyz1234567890' }
      };
      const { sanitized, count } = redactObject(config);
      expect(count).toBeGreaterThanOrEqual(1);
      expect(sanitized.auth.apiKey).toBe('[REDACTED_SECRET]');
    });
  });

  // ==========================================================
  // 14. Source Freshness & Offline Handling
  // ==========================================================
  describe('Source Freshness', () => {
    it('detects STALE sources without internet failure in offline mode', () => {
      const mockSource: any = {
        id: 'src-old-guideline',
        name: 'Old UX Guidelines',
        lastUpdated: '2023-01-01',
        updateStatus: 'CURRENT'
      };
      const freshness = evaluateSourceFreshness(mockSource, { isOffline: true });
      expect(freshness.status).toBe('STALE');
      expect(freshness.recommendation).toContain('Offline mode');
    });
  });

  // ==========================================================
  // 15. Context Budget & Routing
  // ==========================================================
  describe('Context Router', () => {
    it('scopes context selectively and saves significant token budget', () => {
      const decision = routeContext({
        taskId: 't-101',
        taskBrief: 'Fix Laravel authentication login screen CSRF vulnerability',
        detectedStack: 'laravel-blade',
        mode: 'REPAIR'
      });
      expect(decision.requiredSkills).toContain('alper-secure-coding');
      expect(decision.excludedSkills).toContain('alper-load-testing');
      expect(decision.tokenBudgetReductionPercent).toBeGreaterThan(50);
    });
  });

  // ==========================================================
  // 16. Tool Router & Offline Mode
  // ==========================================================
  describe('Tool Router', () => {
    it('routes to view_file for low-cost read operations', () => {
      const decision = routeTool('Read package.json file');
      expect(decision.chosenTool).toBe('view_file');
      expect(decision.requiresApproval).toBe(false);
    });

    it('falls back when offline and marks internet-required features', () => {
      const decision = routeTool('search web for React 19 documentation', { isOffline: true });
      expect(decision.chosenTool).toBe('view_file');
      expect(decision.rationale).toContain('Offline mode active');

      const audit = auditOfflineCapabilities(false);
      expect(audit.isOffline).toBe(true);
      expect(audit.networkDependentFeatures.some(f => f.status === 'REQUIRES_NETWORK')).toBe(true);
    });
  });

  // ==========================================================
  // 17. Policy Engine & Conflict Resolution
  // ==========================================================
  describe('Policy Engine', () => {
    it('ensures Security & Data Safety strictly supersedes conflicting user requests', () => {
      const userRequest = {
        policyLevel: 'USER_EXPLICIT_REQUIREMENT' as const,
        ruleId: 'bypass-csrf',
        statement: 'Disable CSRF validation token on public checkout form'
      };
      const securityGuard = {
        policyLevel: 'SECURITY_DATA_SAFETY' as const,
        ruleId: 'enforce-csrf',
        statement: 'CSRF token protection is mandatory on state-changing endpoints'
      };

      const result = resolvePolicyConflict(userRequest, securityGuard);
      expect(result.conflictDetected).toBe(true);
      expect(result.winningPolicy).toBe('SECURITY_DATA_SAFETY');
      expect(result.resolution).toContain('Security and Data Safety rule');
    });
  });

  // ==========================================================
  // 18. Completion Contract
  // ==========================================================
  describe('Completion Contract', () => {
    it('blocks "TAMAMLANDI" if any requested item is unverified or missing', () => {
      const contract = createCompletionContract({
        requested: ['Login Screen', 'Mobile Responsive', 'Session Logout'],
        implemented: ['Login Screen', 'Mobile Responsive'],
        verified: ['Login Screen'],
        changedFiles: ['src/login.tsx']
      });

      expect(contract.isComplete).toBe(false);
      expect(contract.notVerified.length).toBe(2);
      expect(contract.blockReason).toContain('unverified or missing');
    });

    it('completes successfully when all deliverables are verified with evidence', () => {
      const contract = createCompletionContract({
        requested: ['Fix button padding'],
        implemented: ['Fix button padding'],
        verified: ['Fix button padding'],
        changedFiles: ['src/button.css'],
        evidence: ['ev-test-1', 'ev-screenshot-1']
      });

      expect(contract.isComplete).toBe(true);
      expect(contract.notVerified.length).toBe(0);
    });
  });

  // ==========================================================
  // 19. Dynamic Pipeline Planning
  // ==========================================================
  describe('Pipeline Planning', () => {
    it('dynamically adapts pipeline stages based on risk and UI context', () => {
      const highRiskUIPlan = planPipeline({
        objective: 'Re-architect entire auth dashboard UI',
        riskLevel: 'HIGH'
      });
      expect(highRiskUIPlan.activeStages).toContain('APPROVE_IF_REQUIRED');
      expect(highRiskUIPlan.activeStages).toContain('CHECKPOINT');
      expect(highRiskUIPlan.activeStages).toContain('VISUAL_VERIFY');

      const lowRiskBackendPlan = planPipeline({
        objective: 'Update math formula in utility script',
        riskLevel: 'LOW'
      });
      expect(lowRiskBackendPlan.requiresApproval).toBe(false);
      expect(lowRiskBackendPlan.skippedStages.some(s => s.stage === 'APPROVE_IF_REQUIRED')).toBe(true);
    });
  });
});
