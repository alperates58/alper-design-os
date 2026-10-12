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
  performIndependentReview,
  runSyntheticModernizationDrill,
  validateEvidenceLevelIntegrity,
  runReactModernizationDrill,
  runBladeModernizationDrill,
  runRazorModernizationDrill,
  runPlainWebModernizationDrill,
  runMultiStackModernizationDrill
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
  it('18. design direction workflow: generates distinct candidates across composition, hierarchy, and density with anonymized IDs', () => {
    const profile = profileExistingProject({ rootDir: '.', files: [] });
    const intentResult = createModernizationIntent({ why: 'Modernize operator dashboard with accessible hierarchy' }, profile);
    const workflow = generateDesignCandidates(profile, intentResult.intent!);

    expect(workflow.candidates.length).toBe(3);
    const candA = workflow.candidates.find(c => c.candidateId === 'CANDIDATE_A');
    const candB = workflow.candidates.find(c => c.candidateId === 'CANDIDATE_B');
    const candC = workflow.candidates.find(c => c.candidateId === 'CANDIDATE_C');

    expect(candA).toBeDefined();
    expect(candB).toBeDefined();
    expect(candC).toBeDefined();
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

describe('ALPER DESIGN OS - FAZ 1F.0.1: Modernization Guardrail Hotfix & Synthetic End-to-End Drill', () => {
  const profile = profileExistingProject({ rootDir: '.', files: [] });

  // 1. Big-bang requires explicit approval
  it('1. big bang requires explicit approval: blocked when explicitUserApproval is false or missing', () => {
    const unapproved = selectModernizationStrategy({
      requestedStrategy: 'BIG_BANG_REWRITE',
      projectProfile: profile,
      explicitUserApproval: false
    });

    expect(unapproved.blocked).toBe(true);
    expect(unapproved.strategy).toBe('BRIDGE');
    expect(unapproved.blockReason).toContain('explicitUserApproval = true');
  });

  // 2. Long rationale is not approval
  it('2. long rationale is not approval: 100+ character justification alone does not authorize rewrite', () => {
    const longRationale = 'We have extensively analyzed this legacy architecture and firmly believe that replacing every single component with modern functional abstractions is the only viable path forward for long term velocity.';
    expect(longRationale.length).toBeGreaterThan(100);

    const result = selectModernizationStrategy({
      requestedStrategy: 'BIG_BANG_REWRITE',
      projectProfile: profile,
      justification: longRationale,
      explicitUserApproval: false
    });

    expect(result.blocked).toBe(true);
    expect(result.strategy).toBe('BRIDGE');
    expect(result.rationale).toContain('A long text rationale is not authorization');
    expect(result.blockReason).toContain('explicitUserApproval = true');
  });

  // 3. Big bang blocked when checkpointPlan, rollbackPlan, or preservation impact is missing
  it('3. big bang blocked when checkpointPlan, rollbackPlan, or preservation review is missing', () => {
    // Has explicit approval, but missing checkpointPlan, rollbackPlan, and preservation review
    const partialAuth1 = selectModernizationStrategy({
      requestedStrategy: 'BIG_BANG_REWRITE',
      projectProfile: profile,
      explicitUserApproval: true,
      hasCheckpointPlan: false,
      hasRollbackPlan: false,
      preservationImpactReviewed: false
    });
    expect(partialAuth1.blocked).toBe(true);
    expect(partialAuth1.blockReason).toContain('checkpointPlan exists');
    expect(partialAuth1.blockReason).toContain('rollbackPlan exists');
    expect(partialAuth1.blockReason).toContain('preservation impact explicitly reviewed');

    // Has approval + checkpoint, but missing rollback and preservation
    const partialAuth2 = selectModernizationStrategy({
      requestedStrategy: 'BIG_BANG_REWRITE',
      projectProfile: profile,
      explicitUserApproval: true,
      hasCheckpointPlan: true,
      hasRollbackPlan: false,
      preservationImpactReviewed: false
    });
    expect(partialAuth2.blocked).toBe(true);
    expect(partialAuth2.blockReason).toContain('rollbackPlan exists');
    expect(partialAuth2.blockReason).toContain('preservation impact explicitly reviewed');
  });

  // 4. Big bang authorized only when all 5 strict criteria are satisfied
  it('4. big bang authorized only when all strict criteria are satisfied', () => {
    const authorized = selectModernizationStrategy({
      requestedStrategy: 'BIG_BANG_REWRITE',
      projectProfile: profile,
      explicitUserApproval: true,
      hasCheckpointPlan: true,
      hasRollbackPlan: true,
      preservationImpactReviewed: true,
      riskAssessmentCompleted: true,
      assessedRiskLevel: 'HIGH',
      justification: 'Approved migration plan following stage 0 risk audit'
    });

    expect(authorized.blocked).toBe(false);
    expect(authorized.strategy).toBe('REBUILD_SHELL');
    expect(authorized.riskAssessment).toBe('HIGH');
    expect(authorized.bridgeRequired).toBe(true);
    expect(authorized.bridgeMechanisms).toContain('Rollback Gate');
  });

  // 5. Application-wide shell rebuild requires same authorization
  it('5. application-wide shell rebuild requires same authorization', () => {
    const appWideUnapproved = selectModernizationStrategy({
      requestedStrategy: 'REBUILD_SHELL',
      scopeLevel: 'APPLICATION',
      projectProfile: profile,
      explicitUserApproval: false
    });
    expect(appWideUnapproved.blocked).toBe(true);
    expect(appWideUnapproved.blockReason).toContain('explicitUserApproval = true');

    const appWideApproved = selectModernizationStrategy({
      requestedStrategy: 'REBUILD_SHELL',
      scopeLevel: 'APPLICATION',
      projectProfile: profile,
      explicitUserApproval: true,
      hasCheckpointPlan: true,
      hasRollbackPlan: true,
      preservationImpactReviewed: true,
      riskAssessmentCompleted: true,
      assessedRiskLevel: 'HIGH'
    });
    expect(appWideApproved.blocked).toBe(false);
    expect(appWideApproved.strategy).toBe('REBUILD_SHELL');
  });

  // 6. Design candidate directions are dynamic and adapt to project profile
  it('6. design candidate directions are dynamic: adapts to stack, styling, debts, and intent', () => {
    const reactProfile = profileExistingProject({
      rootDir: 'tests/fixtures/legacy-react',
      files: [
        { path: 'src/App.jsx', content: '<table className="legacy-table">...</table>' },
        { path: 'src/styles/app.css', content: '.legacy-table { border: 1px solid #ccc; }' }
      ]
    });
    const intentRes = createModernizationIntent({
      why: 'Modernize legacy table layout to responsive grid',
      visualGoals: ['Modernize grid'],
      uxGoals: ['Accessible contrast'],
      technicalGoals: ['Zero regressions']
    }, reactProfile);

    const dynamicWorkflow = generateDesignCandidates(reactProfile, intentRes.intent!, {
      currentLayout: 'HTML table layout with fixed widths',
      designPersonality: 'Precision Engineering',
      productUXProfile: { archetype: 'High-Volume Operations Console' }
    });

    expect(dynamicWorkflow.candidates.length).toBe(3);
    const candA = dynamicWorkflow.candidates.find(c => c.candidateId === 'CANDIDATE_A');
    const candB = dynamicWorkflow.candidates.find(c => c.candidateId === 'CANDIDATE_B');
    const candC = dynamicWorkflow.candidates.find(c => c.candidateId === 'CANDIDATE_C');

    expect(candA?.title).toContain('Precision Engineering');
    expect(candA?.composition).toContain('HTML table layout with fixed widths');
    expect(candB?.composition).toContain('responsive modular sections');
    expect(candC?.density).toContain('COMFORTABLE');
  });

  // 7. Candidate IDs do not imply fixed visual solution
  it('7. candidate IDs do not imply fixed visual solution: uses anonymized CANDIDATE_A, B, C', () => {
    const intentRes = createModernizationIntent({ why: 'Replace monolithic view with modular sections' }, profile);
    const workflow = generateDesignCandidates(profile, intentRes.intent!);

    const candidateIds = workflow.candidates.map(c => c.candidateId);
    expect(candidateIds).toEqual(['CANDIDATE_A', 'CANDIDATE_B', 'CANDIDATE_C']);

    // Ensure candidate IDs are NOT fixed static layout strings
    expect(candidateIds.some(id => id.includes('HIGH_DENSITY'))).toBe(false);
    expect(candidateIds.some(id => id.includes('MODULAR_CARD'))).toBe(false);
    expect(candidateIds.some(id => id.includes('STREAMLINED'))).toBe(false);
  });

  // 8. Full synthetic modernization pipeline
  it('8. full synthetic modernization drill: executes end-to-end on isolated workspace copy', () => {
    const sourceFixtureDir = path.resolve('tests/fixtures/legacy-react');
    const workspaceDir = path.resolve('tests/workspaces/modernization-drill-react');

    const drill = runSyntheticModernizationDrill({
      sourceFixtureDir,
      workspaceDir
    });

    expect(drill.passed).toBe(true);
    expect(drill.completionContract.isComplete).toBe(true);
    expect(drill.completionContract.verdict).toBe('COMPLETE');
    expect(drill.completionContract.humanVisualApproval).toBe('NOT_APPLICABLE_SYNTHETIC_FIXTURE');

    // Verify original fixture was NOT mutated
    const originalAppJsx = fs.readFileSync(path.join(sourceFixtureDir, 'src/App.jsx'), 'utf-8');
    expect(originalAppJsx).toContain('legacy-table-layout');

    // Verify workspace copy WAS mutated with modern layout
    const workspaceAppJsx = fs.readFileSync(path.join(workspaceDir, 'src/App.jsx'), 'utf-8');
    expect(workspaceAppJsx).toContain('modern-layout-shell');
  });

  // 9. Behavior preservation after apply
  it('9. behavior preservation after apply: strictly preserves routes, auth token handling, and table data', () => {
    const sourceFixtureDir = path.resolve('tests/fixtures/legacy-react');
    const workspaceDir = path.resolve('tests/workspaces/modernization-drill-react');

    const drill = runSyntheticModernizationDrill({
      sourceFixtureDir,
      workspaceDir
    });

    expect(drill.behaviorComparison.passed).toBe(true);
    expect(drill.behaviorComparison.regressionsDetected.length).toBe(0);

    // Verify critical routes preserved
    const afterRoutes = drill.behavioralBaselineAfter.routes.map(r => r.path);
    expect(afterRoutes).toContain('/dashboard');
    expect(afterRoutes).toContain('/users');
    expect(afterRoutes).toContain('/settings');

    // Verify auth invariant preserved in workspace App.jsx
    const workspaceAppJsx = fs.readFileSync(path.join(workspaceDir, 'src/App.jsx'), 'utf-8');
    expect(workspaceAppJsx).toContain("sessionStorage.removeItem('auth_token')");
    expect(workspaceAppJsx).toContain("window.location.href = '/login'");

    // Verify user data preserved in UserGrid.jsx
    const workspaceUserGrid = fs.readFileSync(path.join(workspaceDir, 'src/components/UserGrid.jsx'), 'utf-8');
    expect(workspaceUserGrid).toContain('Alice Smith');
    expect(workspaceUserGrid).toContain('Bob Jones');
  });

  // 10. Stage rollback metadata
  it('10. stage rollback metadata: each stage records changedFiles, reason, scope, verification, and rollback', () => {
    const sourceFixtureDir = path.resolve('tests/fixtures/legacy-react');
    const workspaceDir = path.resolve('tests/workspaces/modernization-drill-react');

    const drill = runSyntheticModernizationDrill({
      sourceFixtureDir,
      workspaceDir
    });

    expect(drill.stageCheckpoints.length).toBe(3);

    for (const cp of drill.stageCheckpoints) {
      expect(cp.changedFiles.length).toBeGreaterThan(0);
      expect(cp.reason).toBeDefined();
      expect(cp.scope).toBeDefined();
      expect(cp.verification.passed).toBe(true);
      expect(cp.rollback.steps.length).toBeGreaterThan(0);
    }

    const stage1 = drill.stageCheckpoints.find(s => s.stageId === 'STAGE_1_FOUNDATION');
    expect(stage1?.changedFiles).toContain('src/styles/bridge.css');

    const stage2 = drill.stageCheckpoints.find(s => s.stageId === 'STAGE_2_SHELL');
    expect(stage2?.changedFiles).toContain('src/App.jsx');

    const stage3 = drill.stageCheckpoints.find(s => s.stageId === 'STAGE_3_TARGET');
    expect(stage3?.changedFiles).toContain('src/components/UserGrid.jsx');
  });

  // 11. Dependency creep prevention
  it('11. dependency creep prevention: verifies package.json dependencies remain identical without creep', () => {
    const sourceFixtureDir = path.resolve('tests/fixtures/legacy-react');
    const workspaceDir = path.resolve('tests/workspaces/modernization-drill-react');

    const drill = runSyntheticModernizationDrill({
      sourceFixtureDir,
      workspaceDir
    });

    expect(drill.dependencyAudit.hasCreep).toBe(false);
    expect(drill.dependencyAudit.addedDependencies.length).toBe(0);
    expect(drill.dependencyAudit.dependenciesBefore).toEqual(drill.dependencyAudit.dependenciesAfter);
  });

  // 12. Truthful UI verification
  it('12. truthful UI verification: ensures zero fake telemetry or metrics injected into fixture', () => {
    const sourceFixtureDir = path.resolve('tests/fixtures/legacy-react');
    const workspaceDir = path.resolve('tests/workspaces/modernization-drill-react');

    const drill = runSyntheticModernizationDrill({
      sourceFixtureDir,
      workspaceDir
    });

    expect(drill.truthfulUIAudit.passed).toBe(true);
    expect(drill.truthfulUIAudit.fabricatedTelemetryDetected).toBe(false);
  });
});

// =========================================================================
// FAZ 1F.0.2: Evidence Provenance Hardening & Multi-Stack Modernization Drill
// =========================================================================

describe('ALPER DESIGN OS - FAZ 1F.0.2: Evidence Provenance Hardening & Multi-Stack Modernization Drill', () => {
  const fixturesDir = path.resolve('tests/fixtures');
  const workspacesDir = path.resolve('tests/workspaces');

  const mockProfile = profileExistingProject({
    rootDir: 'tests/fixtures/legacy-react',
    files: [
      { path: 'package.json', content: JSON.stringify({ dependencies: { react: '17.0.2' } }) },
      { path: 'src/App.jsx', content: 'export default function App() { return <div>App</div>; }' }
    ]
  });

  // 1. Big bang requires completed risk assessment
  it('1. big bang requires completed risk assessment: blocks rewrite when risk assessment is missing', () => {
    const missingRisk = selectModernizationStrategy({
      requestedStrategy: 'BIG_BANG_REWRITE',
      projectProfile: mockProfile,
      explicitUserApproval: true,
      hasCheckpointPlan: true,
      hasRollbackPlan: true,
      preservationImpactReviewed: true,
      riskAssessmentCompleted: false
    });

    expect(missingRisk.blocked).toBe(true);
    expect(missingRisk.strategy).toBe('BRIDGE');
    expect(missingRisk.blockReason).toContain('riskAssessmentCompleted = true');
  });

  // 2. Application rewrite cannot be classified as LOW or MEDIUM risk
  it('2. application rewrite cannot be classified as LOW or MEDIUM risk', () => {
    const lowRiskRewrite = selectModernizationStrategy({
      requestedStrategy: 'BIG_BANG_REWRITE',
      projectProfile: mockProfile,
      explicitUserApproval: true,
      hasCheckpointPlan: true,
      hasRollbackPlan: true,
      preservationImpactReviewed: true,
      riskAssessmentCompleted: true,
      assessedRiskLevel: 'LOW'
    });

    expect(lowRiskRewrite.blocked).toBe(true);
    expect(lowRiskRewrite.blockReason).toContain("cannot be classified as 'LOW'");
    expect(lowRiskRewrite.blockReason).toContain('minimum risk level is HIGH or CRITICAL');

    const mediumRiskRewrite = selectModernizationStrategy({
      requestedStrategy: 'BIG_BANG_REWRITE',
      projectProfile: mockProfile,
      explicitUserApproval: true,
      hasCheckpointPlan: true,
      hasRollbackPlan: true,
      preservationImpactReviewed: true,
      riskAssessmentCompleted: true,
      assessedRiskLevel: 'MEDIUM'
    });

    expect(mediumRiskRewrite.blocked).toBe(true);
    expect(mediumRiskRewrite.blockReason).toContain("cannot be classified as 'MEDIUM'");

    const highRiskRewrite = selectModernizationStrategy({
      requestedStrategy: 'BIG_BANG_REWRITE',
      projectProfile: mockProfile,
      explicitUserApproval: true,
      hasCheckpointPlan: true,
      hasRollbackPlan: true,
      preservationImpactReviewed: true,
      riskAssessmentCompleted: true,
      assessedRiskLevel: 'HIGH'
    });

    expect(highRiskRewrite.blocked).toBe(false);
    expect(highRiskRewrite.riskAssessment).toBe('HIGH');
  });

  // 3. Static evidence cannot masquerade as runtime or browser execution
  it('3. static evidence cannot masquerade as runtime or browser execution', () => {
    const checkRuntime = validateEvidenceLevelIntegrity('accessibility', 'RUNTIME', {
      isStaticAnalysis: true,
      hasRealRuntimeOutput: false,
      hasBrowserExecution: false
    });

    expect(checkRuntime.valid).toBe(false);
    expect(checkRuntime.inflationDetected).toBe(true);
    expect(checkRuntime.reason).toContain('Static analysis cannot masquerade as runtime/browser');

    const checkBrowser = validateEvidenceLevelIntegrity('ux', 'BROWSER', {
      isStaticAnalysis: true,
      hasRealRuntimeOutput: false,
      hasBrowserExecution: false
    });

    expect(checkBrowser.valid).toBe(false);
    expect(checkBrowser.inflationDetected).toBe(true);
  });

  // 4. Heuristic evaluation cannot masquerade as human approval
  it('4. heuristic evaluation cannot masquerade as human approval', () => {
    const checkHuman = validateEvidenceLevelIntegrity('visualAI', 'HUMAN', {
      isHeuristicAI: true,
      hasHumanApprovalSignature: false
    });

    expect(checkHuman.valid).toBe(false);
    expect(checkHuman.inflationDetected).toBe(true);
    expect(checkHuman.reason).toContain('AI heuristics cannot masquerade as human approval');
  });

  // 5. Unit test cannot masquerade as browser verification
  it('5. unit test cannot masquerade as browser verification', () => {
    const checkUnitTest = validateEvidenceLevelIntegrity('regression', 'BROWSER', {
      isUnitTestOnly: true,
      hasBrowserExecution: false
    });

    expect(checkUnitTest.valid).toBe(false);
    expect(checkUnitTest.inflationDetected).toBe(true);
    expect(checkUnitTest.reason).toContain('Unit test cannot masquerade as live browser');
  });

  // 6. Completion evaluation rejects evidence inflation
  it('6. completion evaluation rejects evidence inflation in completion contract', () => {
    const inflatedContract = evaluateModernizationCompletion({
      technical: 'PASS',
      visualAI: 'PASS',
      ux: 'PASS',
      accessibility: 'PASS',
      security: 'PASS',
      regression: 'PASS',
      contentTruth: 'PASS',
      humanVisualApproval: 'NOT_APPLICABLE_SYNTHETIC_FIXTURE',
      evidenceLevels: {
        accessibility: 'BROWSER', // Inflated! Real is static
        visualAI: 'HUMAN'         // Inflated! Real is heuristic
      },
      evidenceAudits: {
        accessibility: { isStaticAnalysis: true, hasBrowserExecution: false },
        visualAI: { isHeuristicAI: true, hasHumanApprovalSignature: false }
      },
      isSyntheticDrill: true
    });

    expect(inflatedContract.isComplete).toBe(false);
    expect(inflatedContract.blockReasons.some(r => r.includes('Evidence Inflation'))).toBe(true);
  });

  // 7. React modernization native-stack preservation
  it('7. React modernization: verifies native-stack preservation and ADAPT strategy', () => {
    const drill = runReactModernizationDrill({
      sourceFixtureDir: path.join(fixturesDir, 'legacy-react'),
      workspaceDir: path.join(workspacesDir, 'modernization-drill-react')
    });

    expect(drill.passed).toBe(true);
    expect(drill.drillType).toBe('REACT');
    expect(drill.nativeStackPreserved).toBe(true);
    expect(drill.strategyDecision.strategy).toBe('ADAPT');
    expect(drill.behaviorComparison.authPreserved).toBe(true);
    expect(drill.behaviorComparison.routesPreserved).toBe(true);
    expect(drill.dependencyAudit.hasCreep).toBe(false);
  });

  // 8. Blade modernization preserves @csrf and prevents framework colonization
  it('8. Blade modernization: preserves @csrf and prevents framework colonization', () => {
    const drill = runBladeModernizationDrill({
      sourceFixtureDir: path.join(fixturesDir, 'legacy-blade'),
      workspaceDir: path.join(workspacesDir, 'modernization-drill-blade')
    });

    expect(drill.passed).toBe(true);
    expect(drill.drillType).toBe('BLADE');
    expect(drill.nativeStackPreserved).toBe(true);
    expect(drill.strategyDecision.strategy).toBe('BRIDGE');
    expect(drill.behaviorComparison.csrfPreserved).toBe(true);
    expect(drill.dependencyAudit.hasCreep).toBe(false);

    // Verify pristine baseline was NOT modified
    const originalMaster = fs.readFileSync(path.join(fixturesDir, 'legacy-blade/resources/views/layouts/master.blade.php'), 'utf-8');
    expect(originalMaster).toContain('bootstrap/4.5.2');
  });

  // 9. Razor modernization preserves anti-forgery token and ASP.NET MVC architecture
  it('9. Razor modernization: preserves anti-forgery token and ASP.NET architecture', () => {
    const drill = runRazorModernizationDrill({
      sourceFixtureDir: path.join(fixturesDir, 'legacy-razor'),
      workspaceDir: path.join(workspacesDir, 'modernization-drill-razor')
    });

    expect(drill.passed).toBe(true);
    expect(drill.drillType).toBe('RAZOR');
    expect(drill.nativeStackPreserved).toBe(true);
    expect(drill.strategyDecision.strategy).toBe('BRIDGE');
    expect(drill.behaviorComparison.antiforgeryPreserved).toBe(true);
    expect(drill.dependencyAudit.hasCreep).toBe(false);

    // Verify pristine baseline was NOT modified
    const originalLayout = fs.readFileSync(path.join(fixturesDir, 'legacy-razor/Views/Shared/_Layout.cshtml'), 'utf-8');
    expect(originalLayout).toContain('bootstrap.min.css');
  });

  // 10. Plain Web modernization preserves forms and adds zero npm packages
  it('10. Plain Web modernization: preserves forms and adds zero npm packages', () => {
    const drill = runPlainWebModernizationDrill({
      sourceFixtureDir: path.join(fixturesDir, 'legacy-plain-web'),
      workspaceDir: path.join(workspacesDir, 'modernization-drill-plain')
    });

    expect(drill.passed).toBe(true);
    expect(drill.drillType).toBe('PLAIN_WEB');
    expect(drill.nativeStackPreserved).toBe(true);
    expect(drill.strategyDecision.strategy).toBe('MIGRATE');
    expect(drill.behaviorComparison.formActionPreserved).toBe(true);
    expect(drill.dependencyAudit.hasCreep).toBe(false);

    // Verify pristine baseline was NOT modified
    const originalIndex = fs.readFileSync(path.join(fixturesDir, 'legacy-plain-web/index.html'), 'utf-8');
    expect(originalIndex).toContain('bootstrap.min.css');
  });

  // 11. Multi-stack end-to-end modernization orchestration passes across all 4 stacks
  it('11. multi-stack end-to-end modernization orchestration passes across all 4 stacks', () => {
    const multiDrill = runMultiStackModernizationDrill({
      baseFixturesDir: fixturesDir,
      baseWorkspacesDir: workspacesDir
    });

    expect(multiDrill.allPassed).toBe(true);
    expect(multiDrill.react.passed).toBe(true);
    expect(multiDrill.blade.passed).toBe(true);
    expect(multiDrill.razor.passed).toBe(true);
    expect(multiDrill.plain.passed).toBe(true);

    // Check cross-stack comparison matrix
    expect(multiDrill.comparisonMatrix.profile.react).toBe(true);
    expect(multiDrill.comparisonMatrix.profile.blade).toBe(true);
    expect(multiDrill.comparisonMatrix.profile.razor).toBe(true);
    expect(multiDrill.comparisonMatrix.profile.plain).toBe(true);

    expect(multiDrill.comparisonMatrix.preservation.react).toBe(true);
    expect(multiDrill.comparisonMatrix.preservation.blade).toBe(true);
    expect(multiDrill.comparisonMatrix.preservation.razor).toBe(true);
    expect(multiDrill.comparisonMatrix.preservation.plain).toBe(true);

    expect(multiDrill.comparisonMatrix.regression.react).toBe(true);
    expect(multiDrill.comparisonMatrix.regression.blade).toBe(true);
    expect(multiDrill.comparisonMatrix.regression.razor).toBe(true);
    expect(multiDrill.comparisonMatrix.regression.plain).toBe(true);

    expect(multiDrill.comparisonMatrix.nativeStackPreserved.react).toBe(true);
    expect(multiDrill.comparisonMatrix.nativeStackPreserved.blade).toBe(true);
    expect(multiDrill.comparisonMatrix.nativeStackPreserved.razor).toBe(true);
    expect(multiDrill.comparisonMatrix.nativeStackPreserved.plain).toBe(true);
  });

  // 12. Cross-stack dependency creep prevention confirms zero added dependencies across all 4 stacks
  it('12. cross-stack dependency creep prevention confirms zero added dependencies across all 4 stacks', () => {
    const multiDrill = runMultiStackModernizationDrill({
      baseFixturesDir: fixturesDir,
      baseWorkspacesDir: workspacesDir
    });

    expect(multiDrill.react.dependencyAudit.addedDependencies.length).toBe(0);
    expect(multiDrill.blade.dependencyAudit.addedDependencies.length).toBe(0);
    expect(multiDrill.razor.dependencyAudit.addedDependencies.length).toBe(0);
    expect(multiDrill.plain.dependencyAudit.hasCreep).toBe(false);
  });

  // 13. Dynamic candidate diversity across stacks
  it('13. dynamic candidate diversity across stacks ensures contextual specialization', () => {
    const multiDrill = runMultiStackModernizationDrill({
      baseFixturesDir: fixturesDir,
      baseWorkspacesDir: workspacesDir
    });

    const reactCandidates = multiDrill.react.designDirectionWorkflow.candidates;
    const bladeCandidates = multiDrill.blade.designDirectionWorkflow.candidates;
    const razorCandidates = multiDrill.razor.designDirectionWorkflow.candidates;
    const plainCandidates = multiDrill.plain.designDirectionWorkflow.candidates;

    expect(reactCandidates.length).toBe(3);
    expect(bladeCandidates.length).toBe(3);
    expect(razorCandidates.length).toBe(3);
    expect(plainCandidates.length).toBe(3);

    // Verify candidates are stack-aware and differ
    expect(reactCandidates[0].name).not.toBe(bladeCandidates[0].name);
    expect(razorCandidates[0].name).not.toBe(plainCandidates[0].name);
  });

  // 14. Truthful evidence levels in completion contract without inflation
  it('14. truthful evidence levels in completion contract without inflation', () => {
    const multiDrill = runMultiStackModernizationDrill({
      baseFixturesDir: fixturesDir,
      baseWorkspacesDir: workspacesDir
    });

    const completion = multiDrill.react.completionContract;
    expect(completion.isComplete).toBe(true);
    expect(completion.evidenceLevels).toBeDefined();
    expect(completion.evidenceLevels?.technical).toBe('STATIC');
    expect(completion.evidenceLevels?.visualAI).toBe('HEURISTIC');
    expect(completion.evidenceLevels?.regression).toBe('INTEGRATION');
    expect(completion.evidenceLevels?.humanVisualApproval).toBe('NOT_VERIFIED');
  });
});

