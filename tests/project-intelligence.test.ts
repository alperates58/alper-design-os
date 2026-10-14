import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import {
  redactSecrets,
  redactObjectSecrets,
  initializeProjectIntelligence,
  loadProjectIntelligence,
  recordProjectDecision,
  recordProjectMemory,
  recordBusinessRule,
  recordProjectInvariant,
  buildProjectArchitectureGraph,
  createProjectSnapshot,
  detectProjectDrift,
  analyzeChangeImpact,
  buildTaskContext,
  detectKnowledgeConflicts,
  recordLessonLearned,
  proposeImprovementCandidate,
  evaluateReusablePattern,
  evaluateProjectKnowledgeHealth,
  generateLivingDocuments,
  getProjectIntelligencePath
} from '../packages/agent-governance/src/project-intelligence-engine';
import * as MCPTools from '../packages/mcp-server/src/tools';

describe('ALPER DESIGN OS - FAZ 1H: Project Intelligence, Durable Memory & Continuous Improvement V1', () => {
  let testProjectDir: string;

  beforeEach(() => {
    testProjectDir = path.join(os.tmpdir(), `alper-test-faz1h-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`);
    fs.mkdirSync(testProjectDir, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(testProjectDir)) {
      fs.rmSync(testProjectDir, { recursive: true, force: true });
    }
  });

  // 1. Secret Detection and Redaction
  it('1. detects and redacts secrets, credentials, tokens, and private keys strictly', () => {
    const rawText = `
      DATABASE_URL=postgresql://postgres:SuperSecretP@ssw0rd123@db.example.com:5432/production_db
      API_KEY: "prod_apikey_mock_1234567890abcdef"
      Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.doNotLeakThisSignature
      -----BEGIN RSA PRIVATE KEY-----
      MIIEowIBAAKCAQEA0Y123456789fakekey...
      -----END RSA PRIVATE KEY-----
    `;

    const result = redactSecrets(rawText);
    expect(result.secretsFound).toBe(true);
    expect(result.redactedCount).toBeGreaterThanOrEqual(4);
    expect(result.redactedText).not.toContain('SuperSecretP@ssw0rd123');
    expect(result.redactedText).not.toContain('prod_apikey_mock_1234567890abcdef');
    expect(result.redactedText).not.toContain('doNotLeakThisSignature');
    expect(result.redactedText).toContain('[REDACTED: credential supplied via environment configuration]');

    const obj = {
      dbPassword: 'secretpassword',
      normalField: 'safeValue',
      nested: { apiKey: 'secretkey' }
    };
    const redactedObj = redactObjectSecrets(obj);
    expect(redactedObj.dbPassword).toContain('REDACTED');
    expect(redactedObj.nested.apiKey).toContain('REDACTED');
    expect(redactedObj.normalField).toBe('safeValue');
  });

  // 2. Project Intelligence Initialization (NEW mode)
  it('2. initializes durable project intelligence structure in NEW mode without absolute machine paths', () => {
    const init = initializeProjectIntelligence(testProjectDir, {
      mode: 'NEW',
      projectName: 'Industrial WMS Workbench',
      primaryStack: 'REACT_TYPESCRIPT',
      domains: ['Warehouse Management', 'Supply Chain']
    });

    expect(init.manifest).toBeDefined();
    expect(init.manifest.manifestVersion).toBe('1.0.0');
    expect(init.manifest.projectIdentity.projectName).toBe('Industrial WMS Workbench');
    expect(init.manifest.projectIdentity.projectMode).toBe('NEW');
    expect(init.manifest.projectIdentity.primaryStack).toBe('REACT_TYPESCRIPT');

    const intelDir = getProjectIntelligencePath(testProjectDir);
    expect(fs.existsSync(path.join(intelDir, 'manifest.json'))).toBe(true);
    expect(fs.existsSync(path.join(intelDir, 'project-profile.json'))).toBe(true);
    expect(fs.existsSync(path.join(intelDir, 'architecture.json'))).toBe(true);
    expect(fs.existsSync(path.join(intelDir, 'constraints.json'))).toBe(true);
    expect(fs.existsSync(path.join(intelDir, 'invariants.json'))).toBe(true);
    expect(fs.existsSync(path.join(intelDir, 'snapshots', 'SNAP-T0-INIT.json'))).toBe(true);

    // Verify manifest does not contain machine-specific absolute path
    const manifestContent = fs.readFileSync(path.join(intelDir, 'manifest.json'), 'utf-8');
    expect(manifestContent).not.toContain(testProjectDir);
  });

  // 3. Project Intelligence Initialization (EXISTING mode)
  it('3. initializes project intelligence in EXISTING mode preserving legacy context', () => {
    const init = initializeProjectIntelligence(testProjectDir, {
      mode: 'EXISTING',
      projectName: 'Legacy Blade Portal',
      primaryStack: 'LARAVEL_BLADE',
      domains: ['Manufacturing ERP']
    });

    expect(init.manifest.projectIdentity.projectMode).toBe('EXISTING');
    expect(init.manifest.projectIdentity.primaryStack).toBe('LARAVEL_BLADE');

    const loaded = loadProjectIntelligence(testProjectDir);
    expect(loaded.identity.projectName).toBe('Legacy Blade Portal');
    expect(loaded.importantConstraints.length).toBeGreaterThanOrEqual(1);
  });

  // 4. Decision Lifecycle & Bi-Directional Superseding
  it('4. records ADRs and manages bi-directional superseding history without overwriting', () => {
    // T0: Initial decision
    const d1 = recordProjectDecision(testProjectDir, {
      id: 'ADR-001',
      title: 'Database Engine Selection',
      context: 'Initial prototype requires embedded persistence',
      decision: 'Use SQLite with WAL mode for local zero-config operational storage',
      approvedBy: 'Alper Ates'
    });
    expect(d1.record.status).toBe('ACCEPTED');
    expect(d1.record.supersedes).toBeNull();

    // Verify ADR saved
    const adr1File = path.join(getProjectIntelligencePath(testProjectDir), 'decisions', 'ADR-001.json');
    expect(fs.existsSync(adr1File)).toBe(true);

    // T1: Superseding decision
    const d2 = recordProjectDecision(testProjectDir, {
      id: 'ADR-002',
      title: 'Database Engine Migration to PostgreSQL',
      context: 'Scale requirements increased to 5,000 concurrent operators',
      decision: 'Migrate persistence layer from SQLite to PostgreSQL with row-level locks',
      supersedes: 'ADR-001',
      approvedBy: 'Alper Ates'
    });

    expect(d2.record.status).toBe('ACCEPTED');
    expect(d2.record.supersedes).toBe('ADR-001');
    expect(d2.supersededRecord).toBeDefined();
    expect(d2.supersededRecord?.status).toBe('SUPERSEDED');
    expect(d2.supersededRecord?.supersededBy).toBe('ADR-002');

    // Verify old file status updated in place
    const updatedAdr1 = JSON.parse(fs.readFileSync(adr1File, 'utf-8'));
    expect(updatedAdr1.status).toBe('SUPERSEDED');
    expect(updatedAdr1.supersededBy).toBe('ADR-002');
  });

  // 5. User Decision vs AI Recommendation Distinction
  it('5. strictly distinguishes human user decisions from AI system recommendations', () => {
    initializeProjectIntelligence(testProjectDir, { mode: 'NEW', projectName: 'Test Project' });

    // User Decision
    const userDec = recordProjectDecision(testProjectDir, {
      id: 'ADR-USER-01',
      title: 'Cookie Session Security',
      context: 'Operator policy',
      decision: 'Enforce HttpOnly Strict Cookie',
      approvedBy: 'Alper Ates'
    });
    expect(userDec.record.approvedBy).toBe('Alper Ates');

    const loaded = loadProjectIntelligence(testProjectDir);
    expect(loaded.recentDecisions.some(d => d.id === 'ADR-USER-01')).toBe(true);

    // System Recommendation
    const sysRec = recordProjectDecision(testProjectDir, {
      id: 'ADR-SYS-01',
      title: 'Suggested Virtualized Grid',
      context: 'High row count',
      decision: 'Recommend TanStack Virtual for >1000 rows',
      approvedBy: 'SYSTEM_RECOMMENDATION'
    });
    expect(sysRec.record.approvedBy).toBe('SYSTEM_RECOMMENDATION');
  });

  // 6. Business Rule Provenance and Invariants
  it('6. enforces provenance on business rules and persists unbreakable invariants', () => {
    initializeProjectIntelligence(testProjectDir, { mode: 'NEW', projectName: 'Domain Rules Test' });

    // Verified rule from explicit spec with structured provenance + confirmation
    const verifiedRule = recordBusinessRule(testProjectDir, {
      ruleId: 'BR-OP-01',
      statement: 'Completed maintenance work orders cannot be rescheduled without supervisor approval',
      source: 'USER_SPECIFICATION: Section 4.2',
      sourceType: 'EXPLICIT_USER_SPECIFICATION',
      confirmedByUser: true,
      evidenceRefs: ['SPEC-4.2'],
      priority: 'CRITICAL',
      scope: 'WORKFLOW'
    });
    expect(verifiedRule.status).toBe('VERIFIED');
    expect(verifiedRule.verificationStatus).toBe('VERIFIED');

    // Unverified rule from LLM inference
    const unverifiedRule = recordBusinessRule(testProjectDir, {
      ruleId: 'BR-AI-01',
      statement: 'Operators might prefer dark mode automatically at 8 PM',
      source: 'LLM_INFERRED_HEURISTIC',
      sourceType: 'LLM_INFERRED_HEURISTIC',
      priority: 'LOW'
    });
    expect(unverifiedRule.status).toBe('UNVERIFIED');
    expect(unverifiedRule.verificationStatus).toBe('NOT_VERIFIED');

    // Invariant
    const inv = recordProjectInvariant(testProjectDir, {
      id: 'INV-DB-01',
      description: 'Audit logs table must be append-only with immutable timestamps',
      category: 'DATA_INTEGRITY',
      verificationMethod: 'DATABASE_TRIGGER_TEST',
      source: 'Corporate Compliance Standard'
    });
    expect(inv.category).toBe('DATA_INTEGRITY');
    expect(inv.severity).toBe('HIGH');
  });

  // 7. Architecture Graph Builder
  it('7. builds typed architecture graph from actual project artifacts without hallucinated dependencies', () => {
    const graph = buildProjectArchitectureGraph(testProjectDir, {
      modules: ['AppCore', 'DataModule', 'ApiGateway', 'UiLayer'],
      tables: ['users', 'work_orders', 'inventory_items'],
      apis: ['/api/v1/health', '/api/v1/orders'],
      pages: ['/dashboard', '/orders']
    });

    expect(graph.nodes.length).toBeGreaterThanOrEqual(8);
    expect(graph.edges.length).toBeGreaterThanOrEqual(6);
    expect(graph.nodes.some(n => n.name === 'work_orders')).toBe(true);
    expect(graph.edges.some(e => e.type === 'READS' || e.type === 'WRITES')).toBe(true);
  });

  // 8. Snapshot Creation & Drift Detection
  it('8. creates project snapshots and detects architectural and contract drift', () => {
    initializeProjectIntelligence(testProjectDir, { mode: 'NEW', projectName: 'Drift Test' });

    const snap1 = createProjectSnapshot(testProjectDir, 'SNAP-01', {
      architectureHash: 'arch-hash-111',
      requirementHash: 'req-hash-111',
      apiInventory: ['GET /api/v1/health', 'GET /api/v1/items', 'POST /api/v1/items'],
      databaseFingerprint: 'db-fp-111'
    });

    // Modified snapshot (deleted endpoint -> breaking drift)
    const snap2 = createProjectSnapshot(testProjectDir, 'SNAP-02', {
      architectureHash: 'arch-hash-222',
      requirementHash: 'req-hash-111',
      apiInventory: ['GET /api/v1/health', 'GET /api/v1/items'], // POST /items deleted!
      databaseFingerprint: 'db-fp-111'
    });

    const report = detectProjectDrift(snap1, snap2);
    expect(report.hasBreakingDrift).toBe(true);
    expect(report.status).toBe('BREAKING');
    expect(report.drifts.some(d => d.type === 'API_CONTRACT' && d.classification === 'BREAKING')).toBe(true);
    expect(report.drifts.some(d => d.type === 'ARCHITECTURE')).toBe(true);
  });

  // 9. Change Impact Analysis
  it('9. computes blast radius and risk assessment for proposed modifications from real architecture graph', () => {
    initializeProjectIntelligence(testProjectDir, { mode: 'NEW', projectName: 'Impact Test' });

    buildProjectArchitectureGraph(testProjectDir, {
      modules: ['auth_session_middleware', 'SessionStore'],
      apis: ['POST /api/v1/auth/login'],
      tables: ['user_sessions'],
      pages: ['/login']
    });

    const assessment = analyzeChangeImpact(
      testProjectDir,
      'auth_session_middleware',
      'Migrate from session cookie to stateless JWT tokens'
    );

    expect(assessment.risk).toBe('HIGH');
    expect(assessment.affectedModules).toContain('auth_session_middleware');
    expect(assessment.affectedModules).not.toContain('DataModule');
    expect(assessment.affectedApis).toContain('POST /api/v1/auth/login');
    expect(assessment.recommendedVerification.length).toBeGreaterThanOrEqual(2);
  });

  // 10. Task Context Builder & Relevance Filtering
  it('10. synthesizes token-efficient task context with explicit rationale', () => {
    initializeProjectIntelligence(testProjectDir, { mode: 'NEW', projectName: 'Context Test' });

    recordProjectDecision(testProjectDir, {
      id: 'ADR-DB-01',
      title: 'SQLite WAL Mode',
      context: 'Local storage',
      decision: 'Enable WAL mode for high concurrency reads',
      approvedBy: 'Alper Ates',
      confirmedByUser: true
    });

    recordBusinessRule(testProjectDir, {
      ruleId: 'BR-ORD-01',
      statement: 'Work orders in progress require locked inventory allocation',
      source: 'USER_SPECIFICATION',
      sourceType: 'EXPLICIT_USER_SPECIFICATION',
      confirmedByUser: true,
      priority: 'CRITICAL'
    });

    const context = buildTaskContext(testProjectDir, {
      task: 'Optimize work orders query performance',
      target: 'work orders',
      scope: 'DATABASE'
    });

    expect(context.relevantDecisions.length).toBeGreaterThanOrEqual(1);
    expect(context.relevantBusinessRules.length).toBeGreaterThanOrEqual(1);
    expect(context.overallRationale).toContain('work orders');
    expect(context.relevantBusinessRules[0].rationale).toBeDefined();
  });

  // 11. Knowledge Conflicts Detection
  it('11. detects knowledge conflicts between accepted ADRs and actual codebase configuration', () => {
    initializeProjectIntelligence(testProjectDir, { mode: 'NEW', projectName: 'Conflict Test' });

    recordProjectDecision(testProjectDir, {
      id: 'ADR-PG-01',
      title: 'Database Engine PostgreSQL',
      context: 'Scale',
      decision: 'We adopt PostgreSQL for all relational storage',
      approvedBy: 'Alper Ates',
      confirmedByUser: true
    });

    const result = detectKnowledgeConflicts(testProjectDir, {
      databaseEngine: 'SQLite3',
      authStrategy: 'SESSION'
    });

    expect(result.status).toBe('CONFLICTED');
    expect(result.conflicts.length).toBeGreaterThanOrEqual(1);
    expect(result.conflicts[0].conflictType).toBe('DECISION_VS_IMPLEMENTATION');
    expect(result.conflicts[0].recommendedResolution).toContain('PostgreSQL');
  });

  // 12. Lessons Learned & Continuous Improvement
  it('12. captures lessons learned and gates continuous improvement candidates with governance', () => {
    initializeProjectIntelligence(testProjectDir, { mode: 'NEW', projectName: 'Lesson Test' });

    const lesson = recordLessonLearned(testProjectDir, {
      id: 'LRN-001',
      problem: 'High memory usage in tabular virtual grid',
      context: '5000 records loaded simultaneously',
      attempt: 'Rendered DOM elements directly',
      result: 'Browser crashed on mobile kiosk',
      evidence: 'Lighthouse trace recorded 1.2GB heap spike',
      lesson: 'Always apply row virtualization with TanStack Virtual for datasets > 500 rows',
      applicability: 'All tabular views in Industrial domains'
    });
    expect(lesson.id).toBe('LRN-001');

    const improvement = proposeImprovementCandidate(testProjectDir, {
      id: 'IMP-001',
      observation: 'Virtualization improves scroll performance significantly',
      evidence: 'LRN-001 benchmark',
      proposedImprovement: 'Default to virtualized row windowing for all enterprise grids',
      scope: 'UI_COMPONENTS',
      expectedBenefit: '60fps smooth scrolling under 10k rows'
    });
    expect(improvement.requiresGovernanceApproval).toBe(true);
    expect(improvement.status).toBe('PROPOSED');
  });

  // 13. Cross-Project Knowledge Boundary & Anti-Accidental Global Learning
  it('13. enforces strict cross-project isolation and rejects unvetted global pattern promotion', () => {
    // Local finding without governance review -> REJECTED
    const localFinding = evaluateReusablePattern({
      patternId: 'PAT-LOCAL-01',
      name: 'Custom CSS hack for legacy kiosk',
      description: 'Hardcoded pixel heights for specific rugged terminal',
      generalizable: false,
      nonSensitive: true,
      evidenceBacked: true,
      domainScope: 'Rugged Terminals'
    });
    expect(localFinding.eligibleForGlobalPromotion).toBe(false);
    expect(localFinding.candidate.status).toBe('CANDIDATE');
    expect(localFinding.reason).toContain('project-specific');

    // Valid vetted global pattern -> PROMOTED
    const vettedPattern = evaluateReusablePattern({
      patternId: 'PAT-GLOBAL-01',
      name: 'Split Pane Workbench Pattern',
      description: 'Master list on left, detail drawer on right with ESC hotkey',
      generalizable: true,
      nonSensitive: true,
      evidenceBacked: true,
      domainScope: 'Industrial Workbenches',
      governanceReviewed: true
    });
    expect(vettedPattern.eligibleForGlobalPromotion).toBe(true);
    expect(vettedPattern.candidate.status).toBe('PROMOTED');
  });

  // 14. Living Document Generation & Drift
  it('14. generates living documentation markdown files and synchronizes with structured records', () => {
    initializeProjectIntelligence(testProjectDir, { mode: 'NEW', projectName: 'Docs Test' });

    recordProjectDecision(testProjectDir, {
      id: 'ADR-DOC-01',
      title: 'Strict TypeScript Policy',
      context: 'Type safety',
      decision: 'Enable strictNullChecks and noImplicitAny',
      approvedBy: 'Alper Ates',
      confirmedByUser: true
    });

    const docs = generateLivingDocuments(testProjectDir);
    expect(docs.generatedFiles['PROJECT.md']).toBeDefined();
    expect(docs.generatedFiles['DECISIONS.md']).toContain('ADR-DOC-01: Strict TypeScript Policy');
    expect(docs.generatedFiles['INVARIANTS.md']).toContain('CSRF protection');

    const projectMdPath = path.join(getProjectIntelligencePath(testProjectDir), 'PROJECT.md');
    expect(fs.existsSync(projectMdPath)).toBe(true);
  });

  // 15. Knowledge Health Audit
  it('15. evaluates overall project knowledge health across coverage, freshness, and invariants without hardcoded inflation', () => {
    // Uninitialized directory -> NOT_INITIALIZED (0%)
    const uninitHealth = evaluateProjectKnowledgeHealth(testProjectDir);
    expect(uninitHealth.healthStatus).toBe('NOT_INITIALIZED');
    expect(uninitHealth.coveragePercentage).toBe(0);

    // Initialized empty directory -> INSUFFICIENT_DATA (0%)
    initializeProjectIntelligence(testProjectDir, { mode: 'NEW', projectName: 'Health Test' });
    const emptyHealth = evaluateProjectKnowledgeHealth(testProjectDir);
    expect(emptyHealth.healthStatus).toBe('INSUFFICIENT_DATA');
    expect(emptyHealth.coveragePercentage).toBe(0);

    // Populate real repository artifacts and verified project intelligence records
    fs.writeFileSync(path.join(testProjectDir, 'package.json'), JSON.stringify({ name: 'health-test-app', version: '1.0.0' }));
    fs.mkdirSync(path.join(testProjectDir, 'src'), { recursive: true });
    fs.writeFileSync(path.join(testProjectDir, 'src', 'index.ts'), 'export const health = "ok";');

    recordProjectDecision(testProjectDir, {
      id: 'ADR-HEALTH-01',
      title: 'Core Runtime',
      context: 'Standard runtime',
      decision: 'Use TypeScript strict mode',
      approvedBy: 'Alper Ates',
      confirmedByUser: true
    });

    recordBusinessRule(testProjectDir, {
      ruleId: 'BR-HEALTH-01',
      statement: 'All state transitions must be audited',
      source: 'USER_SPECIFICATION: Sec 1',
      sourceType: 'EXPLICIT_USER_SPECIFICATION',
      confirmedByUser: true,
      evidenceRefs: ['SPEC-1.0']
    });

    recordProjectInvariant(testProjectDir, {
      id: 'INV-HEALTH-01',
      description: 'Strict CSRF and XSS protection',
      category: 'SECURITY',
      verificationMethod: 'VITEST',
      source: 'Security Standard'
    });

    buildProjectArchitectureGraph(testProjectDir, {
      modules: ['index'],
      apis: ['GET /api/v1/status'],
      tables: ['audit_events']
    });

    createProjectSnapshot(testProjectDir, 'SNAP-HEALTH-01');

    const health = evaluateProjectKnowledgeHealth(testProjectDir);
    expect(health.coveragePercentage).toBeGreaterThanOrEqual(80);
    expect(['GOOD', 'EXCELLENT']).toContain(health.healthStatus);
    expect(health.conflictCount).toBe(0);
  });

  // 16. SYNTHETIC LONGITUDINAL BENCHMARK (T0 -> T6 Time Simulation)
  it('16. executes synthetic longitudinal time benchmark (T0 -> T6) validating complete project memory lifecycle', () => {
    // T0: Initialize Project
    const t0 = initializeProjectIntelligence(testProjectDir, {
      mode: 'NEW',
      projectName: 'Longitudinal Synthetic Factory',
      primaryStack: 'REACT_TYPESCRIPT',
      domains: ['Industrial Automation']
    });
    expect(t0.manifest.projectIdentity.projectId).toBeDefined();

    // T1: Add Requirements & Business Rules
    recordBusinessRule(testProjectDir, {
      ruleId: 'BR-LONG-01',
      statement: 'Batch production must not start without raw materials validation',
      source: 'USER_SPECIFICATION: Section 3',
      sourceType: 'EXPLICIT_USER_SPECIFICATION',
      confirmedByUser: true,
      priority: 'CRITICAL'
    });

    // T2: Take Initial Architectural Decision (SQLite)
    recordProjectDecision(testProjectDir, {
      id: 'ADR-T2-DB',
      title: 'Initial Database Selection',
      context: 'Initial plant deployment',
      decision: 'Deploy SQLite for edge plant nodes',
      approvedBy: 'Alper Ates',
      confirmedByUser: true
    });

    const snapT2 = createProjectSnapshot(testProjectDir, 'SNAP-T2', {
      architectureHash: 'arch-hash-t2',
      apiInventory: ['GET /api/v1/plants', 'POST /api/v1/batches'],
      databaseFingerprint: 'sqlite-db-edge'
    });

    // T3: Change Implementation to High-Concurrency
    // T4: Supersede Decision (PostgreSQL Cluster)
    recordProjectDecision(testProjectDir, {
      id: 'ADR-T4-DB',
      title: 'Migrate to PostgreSQL Cluster',
      context: 'Centralized plant telemetry required',
      decision: 'Migrate from SQLite to PostgreSQL cluster',
      supersedes: 'ADR-T2-DB',
      approvedBy: 'Alper Ates',
      confirmedByUser: true
    });

    // T5: Intentional API Contract Modification (Delete legacy endpoint, add v2)
    const snapT5 = createProjectSnapshot(testProjectDir, 'SNAP-T5', {
      architectureHash: 'arch-hash-t5',
      apiInventory: ['GET /api/v1/plants', 'GET /api/v2/batches'], // POST /api/v1/batches replaced
      databaseFingerprint: 'postgres-db-cluster'
    });

    // Drift Detection between T2 and T5
    const driftT2T5 = detectProjectDrift(snapT2, snapT5);
    expect(driftT2T5.hasBreakingDrift).toBe(true);
    expect(driftT2T5.drifts.some(d => d.type === 'DATABASE')).toBe(true);
    expect(driftT2T5.drifts.some(d => d.type === 'ARCHITECTURE')).toBe(true);

    // T6: Leave Stale Code Fact & Detect Conflict
    const conflictCheck = detectKnowledgeConflicts(testProjectDir, {
      databaseEngine: 'SQLite3', // Stale code still running SQLite while ADR-T4 accepted PostgreSQL!
      authStrategy: 'SESSION'
    });
    expect(conflictCheck.status).toBe('CONFLICTED');
    expect(conflictCheck.conflicts.some(c => c.conflictType === 'DECISION_VS_IMPLEMENTATION')).toBe(true);

    // Verify Project Intelligence load retrieves accurate current truth
    const finalTruth = loadProjectIntelligence(testProjectDir);
    expect(finalTruth.recentDecisions.length).toBe(2);
    const adrT2 = finalTruth.recentDecisions.find(d => d.id === 'ADR-T2-DB');
    const adrT4 = finalTruth.recentDecisions.find(d => d.id === 'ADR-T4-DB');
    expect(adrT2?.status).toBe('SUPERSEDED');
    expect(adrT4?.status).toBe('ACCEPTED');
    expect(adrT4?.supersedes).toBe('ADR-T2-DB');
  });

  // 17. MCP Tools Verification across all 14 FAZ 1H capabilities
  it('17. invokes all 14 Project Intelligence MCP tools successfully through the canonical tool registry', () => {
    expect(MCPTools.toolRegistry.size).toBe(124);

    // 111. initialize_project_intelligence
    const initRes = MCPTools.handleInitializeProjectIntelligence({
      baseDir: testProjectDir,
      projectName: 'MCP Tested Project',
      mode: 'NEW'
    });
    expect(initRes.manifest).toBeDefined();

    // 112. load_project_intelligence
    const loadRes = MCPTools.handleLoadProjectIntelligence({ baseDir: testProjectDir });
    expect(loadRes.identity.projectName).toBe('MCP Tested Project');

    // 113. record_project_decision
    const decRes = MCPTools.handleRecordProjectDecision({
      baseDir: testProjectDir,
      id: 'ADR-MCP-01',
      title: 'MCP Decision Record',
      context: 'Test Context',
      decision: 'We choose MCP Standard',
      approvedBy: 'Alper Ates',
      confirmedByUser: true
    });
    expect(decRes.record.id).toBe('ADR-MCP-01');

    // 114. record_business_rule
    const ruleRes = MCPTools.handleRecordBusinessRule({
      baseDir: testProjectDir,
      ruleId: 'BR-MCP-01',
      statement: 'MCP tool calls must have typed schemas',
      source: 'USER_SPECIFICATION',
      sourceType: 'EXPLICIT_USER_SPECIFICATION',
      confirmedByUser: true,
      evidenceRefs: ['MCP-SPEC-1']
    });
    expect(ruleRes.status).toBe('VERIFIED');

    // 115. record_project_invariant
    const invRes = MCPTools.handleRecordProjectInvariant({
      baseDir: testProjectDir,
      id: 'INV-MCP-01',
      description: 'All 124 tools must be registered',
      category: 'API_CONTRACT',
      verificationMethod: 'VITEST',
      source: 'MCP Architecture Contract'
    });
    expect(invRes.id).toBe('INV-MCP-01');

    // 116. build_project_architecture_graph
    const graphRes = MCPTools.handleBuildProjectArchitectureGraph({
      baseDir: testProjectDir,
      codeArtifacts: {
        modules: ['InventoryModule'],
        tables: ['inventory_entity'],
        apis: ['GET /api/v1/inventory']
      }
    });
    expect(graphRes.nodes.length).toBeGreaterThan(0);

    // 117. create_project_snapshot
    const snap1 = MCPTools.handleCreateProjectSnapshot({
      baseDir: testProjectDir,
      snapshotId: 'SNAP-MCP-01'
    });
    expect(snap1.snapshotId).toBe('SNAP-MCP-01');

    const snap2 = MCPTools.handleCreateProjectSnapshot({
      baseDir: testProjectDir,
      snapshotId: 'SNAP-MCP-02',
      architectureHash: 'changed-hash'
    });

    // 118. detect_project_drift
    const driftRes = MCPTools.handleDetectProjectDrift({
      baseSnapshot: snap1,
      targetSnapshot: snap2
    });
    expect(driftRes.drifts.length).toBeGreaterThan(0);

    // 119. analyze_change_impact
    const impactRes = MCPTools.handleAnalyzeChangeImpact({
      baseDir: testProjectDir,
      target: 'inventory_entity',
      proposedChange: 'Add barcode column'
    });
    expect(impactRes.risk).toBeDefined();

    // 120. build_task_context
    const contextRes = MCPTools.handleBuildTaskContext({
      baseDir: testProjectDir,
      task: 'Check database speed',
      target: 'database',
      scope: 'DATABASE'
    });
    expect(contextRes.task).toBe('Check database speed');

    // 121. detect_knowledge_conflicts
    const conflictRes = MCPTools.handleDetectKnowledgeConflicts({ baseDir: testProjectDir });
    expect(conflictRes.status).toBeDefined();

    // 122. record_lesson_learned
    const lessonRes = MCPTools.handleRecordLessonLearned({
      baseDir: testProjectDir,
      id: 'LRN-MCP-01',
      problem: 'Memory leak in listener',
      context: 'MCP dispatch',
      attempt: 'Added unbind in cleanup',
      result: 'Resolved leak',
      evidence: 'Heap snapshot',
      lesson: 'Always unbind event listeners on destroy',
      applicability: 'Server tools'
    });
    expect(lessonRes.id).toBe('LRN-MCP-01');

    // 123. propose_improvement_candidate
    const impRes = MCPTools.handleProposeImprovementCandidate({
      baseDir: testProjectDir,
      id: 'IMP-MCP-01',
      observation: 'Cache misses',
      evidence: 'Trace metrics',
      proposedImprovement: 'Add LRU cache',
      scope: 'ROUTER',
      expectedBenefit: '50% latency drop'
    });
    expect(impRes.requiresGovernanceApproval).toBe(true);

    // 124. evaluate_project_knowledge_health
    const healthRes = MCPTools.handleEvaluateProjectKnowledgeHealth({ baseDir: testProjectDir });
    expect(healthRes.healthStatus).toBeDefined();
  });
});
