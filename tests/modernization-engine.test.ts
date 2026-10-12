import { describe, it, expect } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import {
  profileExistingProject,
  createBehavioralBaseline,
  compareBehavioralBaselines,
  classifyExistingElements,
  selectModernizationStrategy,
  evaluateModernizationScopeBoundary,
  createPreservationContract,
  verifyPreservationCompliance,
  createModernizationIntent,
  assessBaselineQuality,
  createModernizationStages,
  generateDesignCandidates,
  detectExistingDesignSystems,
  preventDuplicateDesignSystem,
  evaluateDependencyProposal,
  classifyLegacyFiles,
  evaluateDatabaseSafetyForUI,
  evaluateAuthSafety,
  validateProjectModeTransition,
  createModernizationPlan,
  evaluateModernizationCompletion,
  performIndependentReview
} from '@alper-design-os/agent-governance';

describe('ALPER DESIGN OS - FAZ 1F.0: Existing Project Modernization Engine Foundation', () => {
  const fixturesDir = path.resolve('tests/fixtures');

  // Helper to load fixture files
  function loadFixture(subDir: string): Array<{ path: string; content?: string }> {
    const dir = path.join(fixturesDir, subDir);
    const results: Array<{ path: string; content?: string }> = [];

    function walk(current: string) {
      if (!fs.existsSync(current)) return;
      const entries = fs.readdirSync(current, { withFileTypes: true });
      for (const entry of entries) {
        const full = path.join(current, entry.name);
        if (entry.isDirectory()) {
          walk(full);
        } else {
          const rel = path.relative(dir, full).replace(/\\/g, '/');
          const content = fs.readFileSync(full, 'utf-8');
          results.push({ path: rel, content });
        }
      }
    }

    walk(dir);
    return results;
  }

  // 1. REPAIR does not become MODERNIZE
  it('1. REPAIR does not become MODERNIZE: blocks silent mode escalation', () => {
    const check1 = validateProjectModeTransition('REPAIR', ['fix button click handler', 'update validation message']);
    expect(check1.allowed).toBe(true);
    expect(check1.requestedMode).toBe('REPAIR');

    const check2 = validateProjectModeTransition('REPAIR', ['full overhaul of layout', 'redesign navbar', 'token migration']);
    expect(check2.allowed).toBe(false);
    expect(check2.reason).toContain('Strict Mode Boundary Violation');
    expect(check2.reason).toContain('REPAIR');
    expect(check2.reason).toContain('MODERNIZE');
  });

  // 2. Scope expansion blocked
  it('2. scope expansion blocked: page-level task cannot silently modify global shell or database', () => {
    const pageScope = {
      level: 'PAGE' as const,
      targetName: 'UserDashboard',
      allowedPaths: ['views/dashboard.blade.php', 'controllers/DashboardController.php'],
      prohibitedPaths: ['**/migrations/**', '**/schema.sql'],
      canModifySharedComponents: false,
      canModifyGlobalShell: false,
      canModifyBackend: false,
      canModifyDatabase: false
    };

    const targetFiles = [
      'views/dashboard.blade.php',
      'views/layouts/app.blade.php', // Global shell!
      'database/migrations/2026_01_01_create_users.php' // Database!
    ];

    const audit = evaluateModernizationScopeBoundary(pageScope, targetFiles);
    expect(audit.isWithinScope).toBe(false);
    expect(audit.allowedFiles).toEqual(['views/dashboard.blade.php']);
    expect(audit.rejectedFiles).toContain('views/layouts/app.blade.php');
    expect(audit.rejectedFiles).toContain('database/migrations/2026_01_01_create_users.php');
    expect(audit.violations.some(v => v.reason.includes('global shell'))).toBe(true);
    expect(audit.violations.some(v => v.reason.includes('Database'))).toBe(true);
  });

  // 3. Backend preservation
  it('3. backend preservation: enforces MUST_PRESERVE invariant on backend business logic', () => {
    const contract = createPreservationContract();
    expect(contract.backendBusinessLogic).toBe('MUST_PRESERVE');

    const result = verifyPreservationCompliance(contract, [
      {
        targetArea: 'backendBusinessLogic',
        changeType: 'REFACTOR',
        isBreaking: true,
        description: 'Replaced business logic calculation formula in OrderProcessingService'
      }
    ]);

    expect(result.compliant).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
    expect(result.violations[0]).toContain('Preservation Violation: Area \'backendBusinessLogic\' is marked MUST_PRESERVE');
  });

  // 4. API preservation
  it('4. API preservation: flags breaking changes to API endpoints and contracts', () => {
    const contract = createPreservationContract();
    expect(contract.apiContract).toBe('MUST_PRESERVE');

    const result = verifyPreservationCompliance(contract, [
      {
        targetArea: 'apiContract',
        changeType: 'BREAKING_REMOVE',
        isBreaking: true,
        description: 'Removed query parameter ?format=json from /api/v1/records'
      }
    ]);

    expect(result.compliant).toBe(false);
    expect(result.violations.some(v => v.includes('apiContract'))).toBe(true);
  });

  // 5. DB preservation
  it('5. DB preservation: UI modernization defaults to zero database mutations and blocks destructive operations', () => {
    // UI task with migration statements must be blocked
    const uiAudit = evaluateDatabaseSafetyForUI(['ALTER TABLE users ADD COLUMN theme VARCHAR(50);'], true);
    expect(uiAudit.safe).toBe(false);
    expect(uiAudit.risk).toBe('DANGEROUS');
    expect(uiAudit.findings[0]).toContain('UI modernization task contains unsolicited database migration statements');

    // Destructive DROP TABLE check
    const destructiveAudit = evaluateDatabaseSafetyForUI(['DROP TABLE old_audit_logs;'], false);
    expect(destructiveAudit.safe).toBe(false);
    expect(destructiveAudit.risk).toBe('DANGEROUS');
    expect(destructiveAudit.findings.some(f => f.includes('DROP TABLE'))).toBe(true);
  });

  // 6. Auth preservation
  it('6. auth preservation: prevents removing CSRF tokens or degrading password inputs', () => {
    const baselineAuth = [
      {
        flowId: 'AUTH_01',
        type: 'SESSION_COOKIE',
        entryPoint: '/login',
        redirectTarget: '/dashboard',
        sessionMechanism: 'HTTP_ONLY_COOKIE',
        csrfTokenRequired: true
      }
    ];

    // Candidate file missing CSRF token
    const strippedCandidate = [
      {
        path: 'views/auth/login.blade.php',
        content: '<form method="POST" action="/login"><input type="text" name="email" /><input type="text" name="password" /><button>Login</button></form>'
      }
    ];

    const audit = evaluateAuthSafety(baselineAuth, strippedCandidate);
    expect(audit.preserved).toBe(false);
    expect(audit.violations.some(v => v.includes('CSRF token element was removed'))).toBe(true);
    expect(audit.violations.some(v => v.includes('no longer has type="password"'))).toBe(true);
  });

  // 7. Design system detection & duplicate rejection
  it('7. design system detection: identifies Tailwind, Bootstrap, and prevents duplicate design systems', () => {
    const bladeFiles = loadFixture('legacy-blade');
    const detectedSystems = detectExistingDesignSystems(bladeFiles);

    expect(detectedSystems.some(d => d.name === 'Bootstrap')).toBe(true);

    // Duplicate check: proposing Bootstrap when it is already installed
    const dupCheck = preventDuplicateDesignSystem(detectedSystems, 'Bootstrap');
    expect(dupCheck.allowed).toBe(false);
    expect(dupCheck.conflict).toContain('Duplicate Design System');

    // Conflicting check: proposing Tailwind on Bootstrap requires a scoped bridge
    const conflictCheck = preventDuplicateDesignSystem(detectedSystems, 'Tailwind');
    expect(conflictCheck.allowed).toBe(true);
    expect(conflictCheck.recommendedBridge).toBeDefined();
    expect(conflictCheck.recommendedBridge).toContain('scoped preflight');
  });

  // 8. Dependency creep rejection
  it('8. dependency creep rejection: rejects "UI looks nicer" as invalid justification and blocks copyleft licenses', () => {
    // Trivial justification rejection
    const trivialProposal = evaluateDependencyProposal({
      packageName: 'fancy-button-kit',
      version: '1.0.0',
      targetRole: 'PRODUCTION',
      need: 'UI looks nicer',
      alternativeConsidered: 'Native CSS',
      bundleImpactKb: 45,
      securityScore: 90,
      maintenanceRating: 'ACTIVE',
      license: 'MIT'
    });
    expect(trivialProposal.approved).toBe(false);
    expect(trivialProposal.risk).toBe('HIGH');
    expect(trivialProposal.reasons[0]).toContain("'UI looks nicer' alone is not a valid technical justification");

    // Copyleft GPL rejection
    const gplProposal = evaluateDependencyProposal({
      packageName: 'gpl-chart-widget',
      version: '2.1.0',
      targetRole: 'PRODUCTION',
      need: 'Display finite capacity schedule gantt in production workbench',
      alternativeConsidered: 'None',
      bundleImpactKb: 60,
      securityScore: 85,
      maintenanceRating: 'ACTIVE',
      license: 'GPL-3.0'
    });
    expect(gplProposal.approved).toBe(false);
    expect(gplProposal.risk).toBe('CRITICAL');
    expect(gplProposal.reasons.some(r => r.includes('Copyleft GPL license'))).toBe(true);
  });

  // 9. Bridge strategy & Big Bang rewrite restriction
  it('9. bridge strategy: defaults to safe BRIDGE and strictly blocks unapproved Big Bang rewrite', () => {
    const profile = profileExistingProject({ rootDir: '.', files: [] });

    // BIG_BANG_REWRITE without user request
    const unauthorizedRewrite = selectModernizationStrategy({
      requestedStrategy: 'BIG_BANG_REWRITE',
      projectProfile: profile,
      explicitUserRequest: false
    });
    expect(unauthorizedRewrite.blocked).toBe(true);
    expect(unauthorizedRewrite.strategy).toBe('BRIDGE');
    expect(unauthorizedRewrite.blockReason).toContain('BIG_BANG_REWRITE is blocked');

    // Safe BRIDGE selection
    const bridgeDecision = selectModernizationStrategy({
      requestedStrategy: 'BRIDGE',
      projectProfile: profile
    });
    expect(bridgeDecision.blocked).toBe(false);
    expect(bridgeDecision.strategy).toBe('BRIDGE');
    expect(bridgeDecision.bridgeRequired).toBe(true);
    expect(bridgeDecision.bridgeMechanisms.length).toBeGreaterThan(0);
  });

  // 10. Staged modernization
  it('10. staged modernization: dynamic multi-stage plan with checkpoints and verification', () => {
    const scope = {
      level: 'PAGE' as const,
      targetName: 'OrderManagementPage',
      allowedPaths: ['views/orders/**'],
      prohibitedPaths: ['**/migrations/**'],
      canModifySharedComponents: true,
      canModifyGlobalShell: false,
      canModifyBackend: false,
      canModifyDatabase: false
    };

    const strategy = selectModernizationStrategy({
      requestedStrategy: 'BRIDGE',
      projectProfile: profileExistingProject({ rootDir: '.', files: [] })
    });

    const stages = createModernizationStages(scope, strategy, []);
    expect(stages.length).toBeGreaterThanOrEqual(4);

    const foundationStage = stages.find(s => s.stageId === 'STAGE_1_FOUNDATION');
    expect(foundationStage).toBeDefined();
    expect(foundationStage?.checkpoint).toBe('checkpoint-stage-1-foundation');
    expect(foundationStage?.rollbackSteps.length).toBeGreaterThan(0);

    const targetStage = stages.find(s => s.stageId === 'STAGE_3_TARGET');
    expect(targetStage).toBeDefined();
    expect(targetStage?.name).toContain('OrderManagementPage');

    const refinementStage = stages.find(s => s.stageId === 'STAGE_5_REFINEMENT');
    expect(refinementStage).toBeDefined();
    expect(refinementStage?.exitCriteria).toContain('HUMAN_VISUAL_APPROVAL obtained');
  });

  // 11. Human Visual Approval required
  it('11. human visual approval required: blocks completion contract until approved', () => {
    const pendingContract = evaluateModernizationCompletion({
      technical: 'PASS',
      visualAI: 'PASS',
      ux: 'PASS',
      accessibility: 'PASS',
      security: 'PASS',
      regression: 'PASS',
      contentTruth: 'PASS',
      humanVisualApproval: 'PENDING'
    });

    expect(pendingContract.isComplete).toBe(false);
    expect(pendingContract.verdict).toBe('INCOMPLETE');
    expect(pendingContract.blockReasons.some(r => r.includes('HUMAN_VISUAL_APPROVAL'))).toBe(true);

    const approvedContract = evaluateModernizationCompletion({
      technical: 'PASS',
      visualAI: 'PASS',
      ux: 'PASS',
      accessibility: 'PASS',
      security: 'PASS',
      regression: 'PASS',
      contentTruth: 'PASS',
      humanVisualApproval: 'APPROVED'
    });

    expect(approvedContract.isComplete).toBe(true);
    expect(approvedContract.verdict).toBe('COMPLETE');
    expect(approvedContract.blockReasons.length).toBe(0);
  });

  // 12. Truthful UI enforcement
  it('12. truthful UI enforcement: blocks completion when content truthfulness fails', () => {
    const untruthfulContract = evaluateModernizationCompletion({
      technical: 'PASS',
      visualAI: 'PASS',
      ux: 'PASS',
      accessibility: 'PASS',
      security: 'PASS',
      regression: 'PASS',
      contentTruth: 'FAIL', // Failed FAZ 1E.7 Truthful UI gate!
      humanVisualApproval: 'APPROVED'
    });

    expect(untruthfulContract.isComplete).toBe(false);
    expect(untruthfulContract.blockReasons.some(r => r.includes('Content truthfulness gate rejected'))).toBe(true);
  });

  // 13. Rollback plan
  it('13. rollback plan: modernization plan contains explicit rollback strategy and recovery script', () => {
    const profile = profileExistingProject({ rootDir: '.', files: [] });
    const baseline = createBehavioralBaseline([]);
    const intentResult = createModernizationIntent({ why: 'Replace unstyled table with accessible modern grid' }, profile);

    const plan = createModernizationPlan({
      profile,
      intent: intentResult.intent!,
      baseline,
      scope: {
        level: 'PAGE',
        targetName: 'UserGrid',
        allowedPaths: ['src/components/UserGrid.jsx'],
        prohibitedPaths: ['**/migrations/**'],
        canModifySharedComponents: false,
        canModifyGlobalShell: false,
        canModifyBackend: false,
        canModifyDatabase: false
      }
    });

    expect(plan.rollbackPlan.strategy).toBeDefined();
    expect(plan.rollbackPlan.rollbackSteps.length).toBeGreaterThan(0);
    expect(plan.rollbackPlan.automatedScript).toContain('rollback');
    expect(plan.checkpointPlan.checkpoints.length).toBeGreaterThan(0);
  });

  // 14. Behavior baseline comparison
  it('14. behavior baseline comparison: detects dropped routes, missing CSRF, and broken invariants', () => {
    const baseline = createBehavioralBaseline([
      {
        path: 'routes/web.php',
        content: 'Route::get("/dashboard", ...);\nRoute::post("/login", ...)->middleware("csrf");'
      },
      {
        path: 'database/schema.sql',
        content: 'CREATE TABLE users (id INT PRIMARY KEY, email VARCHAR(255));'
      }
    ]);

    // Candidate missing /dashboard route and without users table invariant
    const candidate = createBehavioralBaseline([
      {
        path: 'routes/web.php',
        content: 'Route::get("/new-dashboard", ...);'
      }
    ]);

    const comparison = compareBehavioralBaselines(baseline, candidate);
    expect(comparison.passed).toBe(false);
    expect(comparison.regressionsDetected.some(r => r.description.includes('/dashboard'))).toBe(true);
    expect(comparison.regressionsDetected.some(r => r.category === 'DATABASE_INVARIANT_REGRESSION')).toBe(true);
  });

  // 15. Heuristic AI scores stamped
  it('15. heuristic AI scores stamped: all baseline quality dimensions stamped with isHeuristic: true', () => {
    const profile = profileExistingProject({ rootDir: '.', files: [] });
    const quality = assessBaselineQuality(profile);

    expect(quality.technicalQuality.isHeuristic).toBe(true);
    expect(quality.technicalQuality.scoreType).toBe('HEURISTIC');
    expect(quality.visualQuality.isHeuristic).toBe(true);
    expect(quality.uxQuality.isHeuristic).toBe(true);
    expect(quality.accessibilityQuality.isHeuristic).toBe(true);
    expect(quality.performanceQuality.isHeuristic).toBe(true);
    expect(quality.securityQuality.isHeuristic).toBe(true);
  });

  // 16. Legacy code protection
  it('16. legacy code protection: classifies vendor, migration history, and build output as protected', () => {
    const files = [
      'src/components/Header.jsx',
      'node_modules/react/index.js',
      'dist/bundle.js',
      'database/migrations/001_initial.sql',
      'src/generated/swagger-client.ts',
      'vendor/laravel/framework/src/Kernel.php'
    ];

    const classified = classifyLegacyFiles(files);
    const vendorFile = classified.find(c => c.filePath.includes('node_modules'));
    expect(vendorFile?.category).toBe('VENDOR');
    expect(vendorFile?.protectedFromDirectEdit).toBe(true);

    const buildFile = classified.find(c => c.filePath.includes('dist/bundle.js'));
    expect(buildFile?.category).toBe('BUILD_OUTPUT');
    expect(buildFile?.protectedFromDirectEdit).toBe(true);

    const migrationFile = classified.find(c => c.filePath.includes('database/migrations'));
    expect(migrationFile?.category).toBe('MIGRATION_HISTORY');
    expect(migrationFile?.protectedFromDirectEdit).toBe(true);

    const generatedFile = classified.find(c => c.filePath.includes('swagger-client.ts'));
    expect(generatedFile?.category).toBe('GENERATED');
    expect(generatedFile?.protectedFromDirectEdit).toBe(true);

    const sourceFile = classified.find(c => c.filePath.includes('Header.jsx'));
    expect(sourceFile?.category).toBe('SOURCE');
    expect(sourceFile?.protectedFromDirectEdit).toBe(false);
  });

  // 17. Change classification decisions (REMOVE is high risk)
  it('17. change classification: enforces REMOVE as high/critical risk with zero-dependent verification', () => {
    const classified = classifyExistingElements([
      {
        targetId: 'COMP_01',
        name: 'LegacyTable',
        path: 'views/table.blade.php',
        elementType: 'COMPONENT',
        proposedDecision: 'REMOVE'
      },
      {
        targetId: 'STYLE_01',
        name: 'LegacyButtonStyles',
        path: 'public/css/legacy.css',
        elementType: 'STYLE',
        proposedDecision: 'IMPROVE'
      }
    ]);

    const removeDecision = classified.find(c => c.targetId === 'COMP_01');
    expect(removeDecision?.decision).toBe('REMOVE');
    expect(removeDecision?.risk).toBe('HIGH');
    expect(removeDecision?.verification).toContain('zero references');

    const improveDecision = classified.find(c => c.targetId === 'STYLE_01');
    expect(improveDecision?.decision).toBe('IMPROVE');
    expect(improveDecision?.risk).toBe('LOW');
  });

  // 18. Design Direction Workflow (Candidate A, B, C)
  it('18. design direction workflow: generates distinct candidates across composition, hierarchy, and density', () => {
    const profile = profileExistingProject({ rootDir: '.', files: [] });
    const intentResult = createModernizationIntent({ why: 'Modernize operator dashboard with accessible hierarchy' }, profile);
    const workflow = generateDesignCandidates(profile, intentResult.intent!);

    expect(workflow.candidates.length).toBe(3);
    const candA = workflow.candidates.find(c => c.candidateId.includes('A_HIGH_DENSITY'));
    const candB = workflow.candidates.find(c => c.candidateId.includes('B_MODULAR_CARD'));
    const candC = workflow.candidates.find(c => c.candidateId.includes('C_STREAMLINED'));

    expect(candA?.density).toContain('COMPACT');
    expect(candB?.density).toContain('BALANCED');
    expect(candC?.density).toContain('COMFORTABLE');
    expect(workflow.humanVisualApprovalRequired).toBe(true);
    expect(workflow.humanVisualApprovalStatus).toBe('PENDING');
  });

  // 19. Independent Reviewer Modernization Criteria
  it('19. independent reviewer: rejects pull requests with behavioral regressions or unapproved visual gates', () => {
    const reviewResult = performIndependentReview({
      taskObjective: 'Modernize Legacy Dashboard Page',
      diffContent: '+ const x = 1;',
      filesChanged: ['views/dashboard.blade.php'],
      testsPassed: true,
      isModernizationTask: true,
      behavioralRegressionAudit: {
        passed: false,
        breaks: ['Route [POST] /records/update missing in candidate']
      },
      humanVisualApprovalStatus: 'PENDING'
    });

    expect(reviewResult.verdict).toBe('REJECT');
    expect(reviewResult.findings.some(f => f.category === 'BEHAVIORAL_REGRESSION')).toBe(true);
    expect(reviewResult.findings.some(f => f.category === 'HUMAN_VISUAL_APPROVAL_PENDING')).toBe(true);
  });

  // 20. Profiling legacy fixtures
  it('20. fixture profiling: successfully profiles legacy-react, legacy-blade, legacy-razor, legacy-plain-web', () => {
    const reactFiles = loadFixture('legacy-react');
    const reactProfile = profileExistingProject({ rootDir: 'tests/fixtures/legacy-react', files: reactFiles });
    expect(reactProfile.detectedStack.primaryStack).toContain('React');
    expect(reactProfile.criticalRoutes.length).toBeGreaterThan(0);

    const bladeFiles = loadFixture('legacy-blade');
    const bladeProfile = profileExistingProject({ rootDir: 'tests/fixtures/legacy-blade', files: bladeFiles });
    expect(bladeProfile.detectedStack.primaryStack).toContain('Laravel');
    expect(bladeProfile.detectedStack.templateEngine).toBe('Blade');

    const razorFiles = loadFixture('legacy-razor');
    const razorProfile = profileExistingProject({ rootDir: 'tests/fixtures/legacy-razor', files: razorFiles });
    expect(razorProfile.detectedStack.primaryStack).toContain('ASP.NET');
    expect(razorProfile.detectedStack.templateEngine).toContain('Razor');

    const plainWebFiles = loadFixture('legacy-plain-web');
    const plainProfile = profileExistingProject({ rootDir: 'tests/fixtures/legacy-plain-web', files: plainWebFiles });
    expect(plainProfile.detectedStack.languages).toContain('HTML');
  });
});
