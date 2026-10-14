import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import {
  PROJECT_INTELLIGENCE_ROOT,
  ProjectIdentity,
  ProjectIdentitySchema,
  ProjectManifest,
  ProjectManifestSchema,
  ProjectMemoryRecord,
  ProjectMemoryRecordSchema,
  ProjectMemoryRecordType,
  MemoryRecordSource,
  Freshness,
  MemoryScope,
  DecisionRecord,
  DecisionRecordSchema,
  DecisionStatus,
  RejectedAlternative,
  RejectedAlternativeSchema,
  GlossaryTerm,
  DomainGlossary,
  DomainGlossarySchema,
  BusinessRuleRecord,
  BusinessRuleRecordSchema,
  ProjectInvariant,
  ProjectInvariantSchema,
  ProjectArchitectureGraph,
  ProjectArchitectureGraphSchema,
  ArchitectureNode,
  ArchitectureEdge,
  KnowledgeAuthorityRank,
  KnowledgeConflict,
  KnowledgeConflictSchema,
  KnowledgeSyncResult,
  KnowledgeSyncResultSchema,
  ProjectSnapshot,
  ProjectSnapshotSchema,
  ProjectDriftReport,
  ProjectDriftReportSchema,
  ProjectDriftItem,
  DriftClassification,
  ChangeImpactAssessment,
  ChangeImpactAssessmentSchema,
  TaskContext,
  TaskContextSchema,
  TaskContextItem,
  LessonLearnedRecord,
  LessonLearnedRecordSchema,
  ImprovementCandidate,
  ImprovementCandidateSchema,
  ReusablePatternCandidate,
  ReusablePatternCandidateSchema,
  VerificationDebtItem,
  ProjectStatusSnapshot,
  ProjectStatusSnapshotSchema,
  ProjectKnowledgeHealth,
  ProjectKnowledgeHealthSchema
} from './project-intelligence-types';

// =========================================================================
// 1. Secret Detection & Redaction (Section 4)
// =========================================================================

export const SECRET_PATTERNS = [
  // Passwords and secrets in assignments or JSON
  /(?:password|passwd|pwd|secret|api_key|apikey|access_token|refresh_token|auth_token)\s*[:=]\s*["']?([^\s"',;}{]+)["']?/gi,
  // Bearer tokens
  /Bearer\s+([A-Za-z0-9_\-\.]{15,})/gi,
  // JWT tokens
  /ey[A-Za-z0-9_-]{10,}\.ey[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g,
  // Private keys
  /-----BEGIN [A-Z ]+PRIVATE KEY-----[\s\S]*?-----END [A-Z ]+PRIVATE KEY-----/g,
  // Database connection string credentials (e.g. postgresql://user:pass@host/db)
  /(?:postgres|postgresql|mysql|mssql|mongodb(?:\+srv)?):\/\/[^:\/\s]+:([^@\/\s]+)@[^:\/\s]+/gi,
  // Common cloud / SaaS API key prefixes
  /(?:sk_live_[0-9a-zA-Z]{16,}|ghp_[0-9a-zA-Z]{30,}|xox[baprs]-[0-9a-zA-Z]{10,})/g
];

export const REDACTION_REPLACEMENT = '[REDACTED: credential supplied via environment configuration]';

export function redactSecrets(text: string): {
  redactedText: string;
  secretsFound: boolean;
  redactedCount: number;
} {
  if (!text || typeof text !== 'string') {
    return { redactedText: text, secretsFound: false, redactedCount: 0 };
  }

  let redactedText = text;
  let redactedCount = 0;

  for (const pattern of SECRET_PATTERNS) {
    const matches = redactedText.match(pattern);
    if (matches) {
      redactedCount += matches.length;
      redactedText = redactedText.replace(pattern, (match, p1) => {
        if (p1 && match.includes(p1)) {
          return match.replace(p1, REDACTION_REPLACEMENT);
        }
        return REDACTION_REPLACEMENT;
      });
    }
  }

  return {
    redactedText,
    secretsFound: redactedCount > 0,
    redactedCount
  };
}

// Deep secret redaction on JSON objects
export function redactObjectSecrets<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') {
    return redactSecrets(obj).redactedText as unknown as T;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => redactObjectSecrets(item)) as unknown as T;
  }
  if (typeof obj === 'object') {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (/(password|secret|key|token|credential)/i.test(key) && typeof value === 'string') {
        result[key] = REDACTION_REPLACEMENT;
      } else {
        result[key] = redactObjectSecrets(value);
      }
    }
    return result as T;
  }
  return obj;
}

// Compute stable hash for fingerprinting
function hashData(data: any): string {
  const normalized = typeof data === 'string' ? data : JSON.stringify(data);
  return crypto.createHash('sha256').update(normalized).digest('hex').slice(0, 16);
}

// =========================================================================
// 2. Project Intelligence Initialization & Loading (Sections 1, 2, 27, 35)
// =========================================================================

export function getProjectIntelligencePath(baseDir: string, relativePath: string = ''): string {
  return path.join(baseDir, PROJECT_INTELLIGENCE_ROOT, relativePath);
}

export function initializeProjectIntelligence(
  baseDir: string,
  options: {
    mode: 'NEW' | 'EXISTING' | 'REPAIR' | 'MODERNIZE';
    projectName: string;
    projectId?: string;
    repositoryIdentity?: string;
    primaryStack?: string;
    domains?: string[];
    blueprint?: any;
    profile?: any;
  }
): { manifest: ProjectManifest; rootPath: string; createdFiles: string[] } {
  const rootDir = getProjectIntelligencePath(baseDir);
  const createdFiles: string[] = [];

  const subdirs = [
    'requirements',
    'decisions',
    'knowledge',
    'snapshots',
    'evidence',
    'lessons',
    'indexes'
  ];

  // Ensure root and subdirs exist
  fs.mkdirSync(rootDir, { recursive: true });
  for (const sub of subdirs) {
    fs.mkdirSync(path.join(rootDir, sub), { recursive: true });
  }

  const now = new Date().toISOString();
  const projectId = options.projectId || `proj-${options.projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString(36)}`;
  const repoIdentity = options.repositoryIdentity || `repo-${options.projectName.toLowerCase()}-${hashData(baseDir)}`;

  const identity: ProjectIdentity = {
    projectId,
    projectName: options.projectName,
    repositoryIdentity: repoIdentity,
    projectMode: options.mode,
    createdAt: now,
    schemaVersion: '1.0.0',
    designOsVersion: '0.1.0',
    primaryStack: options.primaryStack || options.blueprint?.stack?.primaryStack || 'REACT_TYPESCRIPT',
    domains: options.domains || (options.profile?.domain ? [options.profile.domain] : ['Enterprise Management']),
    environments: ['development', 'production']
  };

  const manifest: ProjectManifest = {
    manifestVersion: '1.0.0',
    projectIdentity: identity,
    initializedAt: now,
    lastUpdatedAt: now,
    activeProfileFile: 'project-profile.json',
    activeArchitectureFile: 'architecture.json',
    subdirectories: subdirs
  };

  // Write manifest.json
  const manifestPath = path.join(rootDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  createdFiles.push('manifest.json');

  // Write project-profile.json
  const profileData = options.profile || options.blueprint?.productProfile || {
    projectName: options.projectName,
    mode: options.mode,
    initializedAt: now
  };
  const profilePath = path.join(rootDir, 'project-profile.json');
  fs.writeFileSync(profilePath, JSON.stringify(profileData, null, 2), 'utf-8');
  createdFiles.push('project-profile.json');

  // Write architecture.json
  const archData = options.blueprint?.architecture || {
    selectedStyle: 'MONOLITH',
    primaryStack: identity.primaryStack,
    initializedAt: now
  };
  const archPath = path.join(rootDir, 'architecture.json');
  fs.writeFileSync(archPath, JSON.stringify(archData, null, 2), 'utf-8');
  createdFiles.push('architecture.json');

  // Write constraints.json
  const constraintsData = options.blueprint?.requirements?.constraints || [
    {
      id: 'CONST-001',
      type: 'TECHNICAL',
      description: 'Zero unvetted runtime dependencies. Strict type-checking enabled.',
      source: 'Default Enterprise Governance Policy',
      impact: 'All external packages must pass security vetting'
    }
  ];
  fs.writeFileSync(path.join(rootDir, 'constraints.json'), JSON.stringify(constraintsData, null, 2), 'utf-8');
  createdFiles.push('constraints.json');

  // Write invariants.json
  const initialInvariants: ProjectInvariant[] = [
    {
      id: 'INV-SEC-01',
      description: 'CSRF protection and HttpOnly secure cookies must remain enabled.',
      category: 'SECURITY',
      scope: 'API',
      severity: 'CRITICAL',
      verificationMethod: 'SECURITY_SCAN',
      relatedTests: ['tests/auth.test.ts'],
      source: 'Default Security Baseline'
    },
    {
      id: 'INV-DATA-01',
      description: 'Foreign key integrity and audit timestamps must be maintained on all entity updates.',
      category: 'DATA_INTEGRITY',
      scope: 'DATABASE',
      severity: 'HIGH',
      verificationMethod: 'INTEGRATION_TEST',
      relatedTests: ['tests/db.test.ts'],
      source: 'Domain Data Integrity Standard'
    }
  ];
  fs.writeFileSync(path.join(rootDir, 'invariants.json'), JSON.stringify(initialInvariants, null, 2), 'utf-8');
  createdFiles.push('invariants.json');

  // Write initial T0 snapshot
  const initialSnapshot: ProjectSnapshot = {
    snapshotId: 'SNAP-T0-INIT',
    commitSha: 'initial-commit-t0',
    timestamp: now,
    stack: identity.primaryStack,
    architectureHash: hashData(archData),
    requirementHash: hashData(options.blueprint?.requirements || {}),
    routeInventory: ['/health', '/dashboard'],
    apiInventory: ['GET /api/v1/health'],
    databaseFingerprint: hashData(options.blueprint?.database || 'initial-db'),
    dependencyFingerprint: hashData({ stack: identity.primaryStack }),
    designSystemFingerprint: hashData('dtcg-tokens-v1')
  };
  fs.writeFileSync(path.join(rootDir, 'snapshots', 'SNAP-T0-INIT.json'), JSON.stringify(initialSnapshot, null, 2), 'utf-8');
  createdFiles.push('snapshots/SNAP-T0-INIT.json');

  return {
    manifest: ProjectManifestSchema.parse(manifest),
    rootPath: rootDir,
    createdFiles
  };
}

export function loadProjectIntelligence(baseDir: string): {
  manifest: ProjectManifest;
  identity: ProjectIdentity;
  projectBrief: string;
  currentArchitecture: string;
  currentPhase: string;
  importantConstraints: string[];
  openRisks: string[];
  recentDecisions: DecisionRecord[];
  health: ProjectKnowledgeHealth;
} {
  const rootDir = getProjectIntelligencePath(baseDir);
  const manifestPath = path.join(rootDir, 'manifest.json');

  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Project Intelligence not found at ${rootDir}. Run initializeProjectIntelligence first.`);
  }

  const manifest: ProjectManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  const identity = manifest.projectIdentity;

  // Load constraints
  let importantConstraints: string[] = [];
  const constraintsPath = path.join(rootDir, 'constraints.json');
  if (fs.existsSync(constraintsPath)) {
    const rawConstraints = JSON.parse(fs.readFileSync(constraintsPath, 'utf-8'));
    importantConstraints = Array.isArray(rawConstraints)
      ? rawConstraints.map((c: any) => c.description || String(c))
      : [];
  }

  // Load decisions
  const recentDecisions: DecisionRecord[] = [];
  const decisionsDir = path.join(rootDir, 'decisions');
  if (fs.existsSync(decisionsDir)) {
    const files = fs.readdirSync(decisionsDir).filter(f => f.endsWith('.json'));
    for (const file of files) {
      try {
        const dec = JSON.parse(fs.readFileSync(path.join(decisionsDir, file), 'utf-8'));
        recentDecisions.push(dec);
      } catch (_) {}
    }
  }

  // Load architecture
  let currentArchitecture = 'Standard Architecture';
  const archPath = path.join(rootDir, 'architecture.json');
  if (fs.existsSync(archPath)) {
    const arch = JSON.parse(fs.readFileSync(archPath, 'utf-8'));
    currentArchitecture = arch.selectedStyle || arch.style || 'MONOLITH';
  }

  const projectBrief = `Project: ${identity.projectName} (${identity.projectId}) | Mode: ${identity.projectMode} | Primary Stack: ${identity.primaryStack} | Domains: ${identity.domains.join(', ')}`;
  const currentPhase = 'FAZ_1H_ACTIVE';
  const openRisks = ['Manual verification pending for browser runtime'];

  const health = evaluateProjectKnowledgeHealth(baseDir);

  return {
    manifest,
    identity,
    projectBrief,
    currentArchitecture,
    currentPhase,
    importantConstraints,
    openRisks,
    recentDecisions,
    health
  };
}

// =========================================================================
// 3. Decision Records (ADR) & Superseding (Section 5, 6, 25, 26)
// =========================================================================

export function recordProjectDecision(
  baseDir: string,
  decisionInput: {
    id: string;
    title: string;
    context: string;
    decision: string;
    alternatives?: string[];
    consequences?: string[];
    risks?: string[];
    evidence?: string[];
    requirements?: string[];
    affectedComponents?: string[];
    status?: DecisionStatus;
    supersedes?: string | null;
    approvedBy: string;
  }
): { record: DecisionRecord; supersededRecord?: DecisionRecord } {
  const rootDir = getProjectIntelligencePath(baseDir);
  const decisionsDir = path.join(rootDir, 'decisions');
  fs.mkdirSync(decisionsDir, { recursive: true });

  // Redact secrets in input text
  const cleanTitle = redactSecrets(decisionInput.title).redactedText;
  const cleanContext = redactSecrets(decisionInput.context).redactedText;
  const cleanDecision = redactSecrets(decisionInput.decision).redactedText;
  const cleanAlternatives = (decisionInput.alternatives || []).map(a => redactSecrets(a).redactedText);
  const cleanConsequences = (decisionInput.consequences || []).map(c => redactSecrets(c).redactedText);
  const cleanRisks = (decisionInput.risks || []).map(r => redactSecrets(r).redactedText);
  const cleanEvidence = (decisionInput.evidence || []).map(e => redactSecrets(e).redactedText);

  let supersededRecord: DecisionRecord | undefined;

  // Handle superseding: if this decision supersedes an older decision
  if (decisionInput.supersedes) {
    const oldPath = path.join(decisionsDir, `${decisionInput.supersedes}.json`);
    if (fs.existsSync(oldPath)) {
      const oldData: DecisionRecord = JSON.parse(fs.readFileSync(oldPath, 'utf-8'));
      oldData.status = 'SUPERSEDED';
      oldData.supersededBy = decisionInput.id;
      fs.writeFileSync(oldPath, JSON.stringify(oldData, null, 2), 'utf-8');
      supersededRecord = oldData;
    }
  }

  const record: DecisionRecord = {
    id: decisionInput.id,
    title: cleanTitle,
    context: cleanContext,
    decision: cleanDecision,
    alternatives: cleanAlternatives,
    consequences: cleanConsequences,
    risks: cleanRisks,
    evidence: cleanEvidence,
    requirements: decisionInput.requirements || [],
    affectedComponents: decisionInput.affectedComponents || [],
    status: decisionInput.status || 'ACCEPTED',
    supersedes: decisionInput.supersedes || null,
    supersededBy: null,
    createdAt: new Date().toISOString(),
    approvedBy: decisionInput.approvedBy
  };

  const newPath = path.join(decisionsDir, `${record.id}.json`);
  fs.writeFileSync(newPath, JSON.stringify(record, null, 2), 'utf-8');

  // Also register into durable project memory
  recordProjectMemory(baseDir, {
    id: `MEM-${record.id}`,
    type: 'TECHNICAL_DECISION',
    title: record.title,
    summary: record.decision,
    details: record.context,
    source: record.approvedBy.toLowerCase().includes('alper') || record.approvedBy.toLowerCase().includes('user')
      ? 'USER_DECISION'
      : 'SYSTEM_RECOMMENDATION',
    sourceRefs: [`decisions/${record.id}.json`],
    status: record.status === 'ACCEPTED' ? 'ACTIVE' : (record.status === 'SUPERSEDED' ? 'SUPERSEDED' : 'DEPRECATED'),
    confidence: 1.0,
    freshness: 'CURRENT',
    scope: 'PROJECT',
    relatedEntities: record.affectedComponents,
    tags: ['ADR', record.status]
  });

  return {
    record: DecisionRecordSchema.parse(record),
    supersededRecord
  };
}

// =========================================================================
// 4. Durable Memory Storage (Section 3, 4, 6)
// =========================================================================

export function recordProjectMemory(
  baseDir: string,
  record: Omit<ProjectMemoryRecord, 'createdAt' | 'updatedAt'> & {
    createdAt?: string;
    updatedAt?: string;
  }
): ProjectMemoryRecord {
  const rootDir = getProjectIntelligencePath(baseDir);
  const memoryDir = path.join(rootDir, 'knowledge');
  fs.mkdirSync(memoryDir, { recursive: true });

  const now = new Date().toISOString();
  const cleanSummary = redactSecrets(record.summary).redactedText;
  const cleanDetails = redactSecrets(record.details).redactedText;
  const cleanTitle = redactSecrets(record.title).redactedText;

  const item: ProjectMemoryRecord = {
    id: record.id,
    type: record.type,
    title: cleanTitle,
    summary: cleanSummary,
    details: cleanDetails,
    source: record.source,
    sourceRefs: record.sourceRefs || [],
    createdAt: record.createdAt || now,
    updatedAt: record.updatedAt || now,
    status: record.status || 'ACTIVE',
    confidence: record.confidence ?? 1.0,
    freshness: record.freshness || 'CURRENT',
    scope: record.scope || 'PROJECT',
    relatedEntities: record.relatedEntities || [],
    tags: record.tags || []
  };

  const parsed = ProjectMemoryRecordSchema.parse(item);
  const filePath = path.join(memoryDir, `${parsed.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2), 'utf-8');

  return parsed;
}

// =========================================================================
// 5. Business Rules & Invariants Registries (Section 8, 9)
// =========================================================================

export function recordBusinessRule(
  baseDir: string,
  ruleInput: {
    ruleId: string;
    statement: string;
    source: string;
    priority?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    scope?: string;
    inputs?: string[];
    outputs?: string[];
    exceptions?: string[];
    requirements?: string[];
    tests?: string[];
  }
): BusinessRuleRecord {
  const rootDir = getProjectIntelligencePath(baseDir);
  const rulesPath = path.join(rootDir, 'knowledge', 'business-rules.json');

  let existingRules: BusinessRuleRecord[] = [];
  if (fs.existsSync(rulesPath)) {
    try {
      existingRules = JSON.parse(fs.readFileSync(rulesPath, 'utf-8'));
    } catch (_) {}
  }

  // Authority check: If inferred or generated by LLM without authoritative source -> UNVERIFIED
  const isAuthoritative =
    ruleInput.source.includes('USER_SPECIFICATION') ||
    ruleInput.source.includes('REGULATORY') ||
    ruleInput.source.includes('DOCUMENTED_IN_CODE') ||
    ruleInput.source.includes('Alper') ||
    ruleInput.source.includes('Domain Data Integrity Specification');

  const status = isAuthoritative ? 'VERIFIED' : 'UNVERIFIED';

  const cleanStatement = redactSecrets(ruleInput.statement).redactedText;

  const newRule: BusinessRuleRecord = {
    ruleId: ruleInput.ruleId,
    statement: cleanStatement,
    source: ruleInput.source,
    priority: ruleInput.priority || 'HIGH',
    scope: ruleInput.scope || 'PROJECT',
    inputs: ruleInput.inputs || [],
    outputs: ruleInput.outputs || [],
    exceptions: ruleInput.exceptions || [],
    requirements: ruleInput.requirements || [],
    tests: ruleInput.tests || [],
    status
  };

  const parsed = BusinessRuleRecordSchema.parse(newRule);
  const updated = existingRules.filter(r => r.ruleId !== parsed.ruleId).concat(parsed);
  fs.writeFileSync(rulesPath, JSON.stringify(updated, null, 2), 'utf-8');

  return parsed;
}

export function recordProjectInvariant(
  baseDir: string,
  invariantInput: {
    id: string;
    description: string;
    category: 'SECURITY' | 'DATA_INTEGRITY' | 'API_CONTRACT' | 'BUSINESS_LOGIC' | 'UX_ERGONOMICS';
    scope?: string;
    severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM';
    verificationMethod: string;
    relatedTests?: string[];
    source: string;
  }
): ProjectInvariant {
  const rootDir = getProjectIntelligencePath(baseDir);
  const invariantsPath = path.join(rootDir, 'invariants.json');

  let existing: ProjectInvariant[] = [];
  if (fs.existsSync(invariantsPath)) {
    try {
      existing = JSON.parse(fs.readFileSync(invariantsPath, 'utf-8'));
    } catch (_) {}
  }

  const cleanDesc = redactSecrets(invariantInput.description).redactedText;

  const newInv: ProjectInvariant = {
    id: invariantInput.id,
    description: cleanDesc,
    category: invariantInput.category,
    scope: invariantInput.scope || 'PROJECT',
    severity: invariantInput.severity || 'HIGH',
    verificationMethod: invariantInput.verificationMethod,
    relatedTests: invariantInput.relatedTests || [],
    source: invariantInput.source
  };

  const parsed = ProjectInvariantSchema.parse(newInv);
  const updated = existing.filter(i => i.id !== parsed.id).concat(parsed);
  fs.writeFileSync(invariantsPath, JSON.stringify(updated, null, 2), 'utf-8');

  return parsed;
}

// =========================================================================
// 6. Architecture Graph Builder (Section 10)
// =========================================================================

export function buildProjectArchitectureGraph(
  baseDir: string,
  codeArtifacts?: {
    modules?: string[];
    components?: string[];
    services?: string[];
    tables?: string[];
    apis?: string[];
    pages?: string[];
  }
): ProjectArchitectureGraph {
  const nodes: ArchitectureNode[] = [];
  const edges: ArchitectureEdge[] = [];

  // Core system modules
  const moduleNames = codeArtifacts?.modules || ['AppCore', 'DataModule', 'ApiGateway', 'UiLayer'];
  for (const mod of moduleNames) {
    nodes.push({ id: `mod-${mod.toLowerCase()}`, type: 'MODULE', name: mod, metadata: { layer: 'CORE' } });
  }

  // Database tables / entities
  const tables = codeArtifacts?.tables || ['users', 'inventory_items', 'audit_logs'];
  for (const tbl of tables) {
    const nodeId = `db-${tbl}`;
    nodes.push({ id: nodeId, type: 'TABLE_OR_ENTITY', name: tbl, metadata: { storage: 'RELATIONAL' } });
    edges.push({ source: 'mod-datamodule', target: nodeId, type: 'READS', metadata: {} });
    edges.push({ source: 'mod-datamodule', target: nodeId, type: 'WRITES', metadata: {} });
  }

  // APIs
  const apis = codeArtifacts?.apis || ['/api/v1/health', '/api/v1/items', '/api/v1/auth/login'];
  for (const api of apis) {
    const nodeId = `api-${api.replace(/[^a-zA-Z0-9]/g, '_')}`;
    nodes.push({ id: nodeId, type: 'API', name: api, metadata: { protocol: 'HTTP_REST' } });
    edges.push({ source: 'mod-apigateway', target: nodeId, type: 'ROUTES_TO', metadata: {} });
    edges.push({ source: nodeId, target: 'mod-datamodule', type: 'CALLS', metadata: {} });
  }

  // Pages
  const pages = codeArtifacts?.pages || ['/dashboard', '/items', '/items/:id'];
  for (const page of pages) {
    const nodeId = `page-${page.replace(/[^a-zA-Z0-9]/g, '_')}`;
    nodes.push({ id: nodeId, type: 'PAGE', name: page, metadata: { route: page } });
    edges.push({ source: 'mod-uilayer', target: nodeId, type: 'IMPLEMENTS', metadata: {} });
    edges.push({ source: nodeId, target: 'mod-apigateway', type: 'CALLS', metadata: {} });
  }

  const graphHash = hashData({ nodes, edges });
  return ProjectArchitectureGraphSchema.parse({
    nodes,
    edges,
    graphHash
  });
}

// =========================================================================
// 7. Project Snapshot & Drift Detection (Section 14, 15)
// =========================================================================

export function createProjectSnapshot(
  baseDir: string,
  snapshotId: string,
  details?: Partial<ProjectSnapshot>
): ProjectSnapshot {
  const rootDir = getProjectIntelligencePath(baseDir);
  const snapshotsDir = path.join(rootDir, 'snapshots');
  fs.mkdirSync(snapshotsDir, { recursive: true });

  const now = new Date().toISOString();

  // Load manifest & arch to calculate hashes
  let archHash = 'arch-hash-default';
  const archPath = path.join(rootDir, 'architecture.json');
  if (fs.existsSync(archPath)) {
    archHash = hashData(fs.readFileSync(archPath, 'utf-8'));
  }

  let reqHash = 'req-hash-default';
  const reqPath = path.join(rootDir, 'knowledge', 'business-rules.json');
  if (fs.existsSync(reqPath)) {
    reqHash = hashData(fs.readFileSync(reqPath, 'utf-8'));
  }

  const snapshot: ProjectSnapshot = {
    snapshotId,
    commitSha: details?.commitSha || `sha-${hashData(now)}`,
    timestamp: now,
    stack: details?.stack || 'REACT_TYPESCRIPT',
    architectureHash: details?.architectureHash || archHash,
    requirementHash: details?.requirementHash || reqHash,
    routeInventory: details?.routeInventory || ['/dashboard', '/items', '/health'],
    apiInventory: details?.apiInventory || ['GET /api/v1/health', 'POST /api/v1/auth/login'],
    databaseFingerprint: details?.databaseFingerprint || 'fp-tables-users-items',
    dependencyFingerprint: details?.dependencyFingerprint || 'fp-pkg-prod',
    designSystemFingerprint: details?.designSystemFingerprint || 'fp-tokens-v1'
  };

  const parsed = ProjectSnapshotSchema.parse(snapshot);
  fs.writeFileSync(path.join(snapshotsDir, `${snapshotId}.json`), JSON.stringify(parsed, null, 2), 'utf-8');

  return parsed;
}

export function detectProjectDrift(
  baseSnapshot: ProjectSnapshot,
  targetSnapshot: ProjectSnapshot
): ProjectDriftReport {
  const drifts: ProjectDriftItem[] = [];

  // 1. Architecture Drift
  if (baseSnapshot.architectureHash !== targetSnapshot.architectureHash) {
    drifts.push({
      type: 'ARCHITECTURE',
      classification: 'REVIEW_REQUIRED',
      description: 'System architectural blueprint hash has diverged between snapshots',
      diffSummary: `Base arch ${baseSnapshot.architectureHash} -> Target arch ${targetSnapshot.architectureHash}`
    });
  }

  // 2. Requirement Drift
  if (baseSnapshot.requirementHash !== targetSnapshot.requirementHash) {
    drifts.push({
      type: 'REQUIREMENT',
      classification: 'EXPECTED',
      description: 'Requirement or business rule registry modified',
      diffSummary: `Req hash changed: ${baseSnapshot.requirementHash} -> ${targetSnapshot.requirementHash}`
    });
  }

  // 3. API Contract Drift
  const removedApis = baseSnapshot.apiInventory.filter(api => !targetSnapshot.apiInventory.includes(api));
  const addedApis = targetSnapshot.apiInventory.filter(api => !baseSnapshot.apiInventory.includes(api));

  if (removedApis.length > 0) {
    drifts.push({
      type: 'API_CONTRACT',
      classification: 'BREAKING',
      description: `Previously available API endpoints were removed: ${removedApis.join(', ')}`,
      diffSummary: `Removed APIs: [${removedApis.join(', ')}]`
    });
  } else if (addedApis.length > 0) {
    drifts.push({
      type: 'API_CONTRACT',
      classification: 'EXPECTED',
      description: `New API endpoints added: ${addedApis.join(', ')}`,
      diffSummary: `Added APIs: [${addedApis.join(', ')}]`
    });
  }

  // 4. Database Drift
  if (baseSnapshot.databaseFingerprint !== targetSnapshot.databaseFingerprint) {
    drifts.push({
      type: 'DATABASE',
      classification: 'REVIEW_REQUIRED',
      description: 'Database schema or entity fingerprint changed',
      diffSummary: `DB Fingerprint: ${baseSnapshot.databaseFingerprint} -> ${targetSnapshot.databaseFingerprint}`
    });
  }

  // 5. Dependency Drift
  if (baseSnapshot.dependencyFingerprint !== targetSnapshot.dependencyFingerprint) {
    drifts.push({
      type: 'DEPENDENCY',
      classification: 'REVIEW_REQUIRED',
      description: 'Production or package dependencies modified',
      diffSummary: `Dependency Fingerprint altered`
    });
  }

  // 6. Design System Drift
  if (baseSnapshot.designSystemFingerprint !== targetSnapshot.designSystemFingerprint) {
    drifts.push({
      type: 'DESIGN_SYSTEM',
      classification: 'EXPECTED',
      description: 'Design token or style dictionary fingerprint updated',
      diffSummary: `Token fingerprint changed`
    });
  }

  const hasBreakingDrift = drifts.some(d => d.classification === 'BREAKING');
  const status = hasBreakingDrift ? 'BREAKING' : (drifts.length > 0 ? 'DRIFTED' : 'STABLE');

  return ProjectDriftReportSchema.parse({
    baseSnapshotId: baseSnapshot.snapshotId,
    targetSnapshotId: targetSnapshot.snapshotId,
    drifts,
    hasBreakingDrift,
    status
  });
}

// =========================================================================
// 8. Change Impact Analysis (Section 16)
// =========================================================================

export function analyzeChangeImpact(
  baseDir: string,
  target: string,
  proposedChange: string
): ChangeImpactAssessment {
  const rootDir = getProjectIntelligencePath(baseDir);

  const affectedRequirements: string[] = [];
  const affectedModules: string[] = [];
  const affectedApis: string[] = [];
  const affectedPages: string[] = [];
  const affectedEntities: string[] = [];
  const affectedTests: string[] = [];
  const affectedDecisions: string[] = [];

  const targetLower = target.toLowerCase();

  // If modifying auth or credentials
  if (targetLower.includes('auth') || targetLower.includes('session') || targetLower.includes('user')) {
    affectedRequirements.push('REQ-F-AUTH', 'REQ-NFR-SEC');
    affectedModules.push('DataModule', 'ApiGateway');
    affectedApis.push('POST /api/v1/auth/login', 'POST /api/v1/auth/logout');
    affectedPages.push('/login', '/dashboard');
    affectedEntities.push('users', 'sessions', 'audit_logs');
    affectedTests.push('tests/auth.test.ts', 'tests/security-scan.test.ts');
    affectedDecisions.push('ADR-001-AUTH-MODEL');
  } else if (targetLower.includes('item') || targetLower.includes('inventory') || targetLower.includes('data')) {
    affectedRequirements.push('REQ-F-CRUD-01', 'REQ-F-SEARCH');
    affectedModules.push('DataModule', 'UiLayer');
    affectedApis.push('GET /api/v1/items', 'POST /api/v1/items');
    affectedPages.push('/items', '/items/:id');
    affectedEntities.push('inventory_items');
    affectedTests.push('tests/items.test.ts', 'tests/grid-render.test.ts');
  } else {
    affectedModules.push('UiLayer');
    affectedPages.push('/dashboard');
    affectedTests.push('tests/ui-smoke.test.ts');
  }

  // Assess risk
  let risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (affectedEntities.length > 2 || affectedApis.some(a => a.includes('auth'))) {
    risk = 'HIGH';
  } else if (affectedModules.length > 1) {
    risk = 'MEDIUM';
  }

  const recommendedVerification = [
    'Unit tests for affected domain modules',
    'API contract backward-compatibility check',
    'WCAG 2.1 AA accessibility regression scan'
  ];

  const rationale = `Modifying '${target}' impacts ${affectedModules.length} module(s), ${affectedApis.length} endpoint(s), and ${affectedPages.length} UI page(s). Risk assessed as ${risk}.`;

  return ChangeImpactAssessmentSchema.parse({
    target,
    proposedChange,
    affectedRequirements,
    affectedModules,
    affectedApis,
    affectedPages,
    affectedEntities,
    affectedTests,
    affectedDecisions,
    risk,
    recommendedVerification,
    rationale
  });
}

// =========================================================================
// 9. Task Context Builder & Relevance (Section 17, 18)
// =========================================================================

export function buildTaskContext(
  baseDir: string,
  input: {
    task: string;
    target: string;
    scope: string;
  }
): TaskContext {
  const rootDir = getProjectIntelligencePath(baseDir);

  const relevantRequirements: TaskContextItem[] = [];
  const relevantDecisions: TaskContextItem[] = [];
  const relevantConstraints: TaskContextItem[] = [];
  const relevantArchitecture: TaskContextItem[] = [];
  const relevantBusinessRules: TaskContextItem[] = [];
  const relevantRisks: TaskContextItem[] = [];
  const relevantLessons: TaskContextItem[] = [];

  const taskTerms = `${input.task} ${input.target} ${input.scope}`.toLowerCase();

  // Load ADRs
  const decisionsDir = path.join(rootDir, 'decisions');
  if (fs.existsSync(decisionsDir)) {
    const files = fs.readdirSync(decisionsDir).filter(f => f.endsWith('.json'));
    for (const file of files) {
      try {
        const dec: DecisionRecord = JSON.parse(fs.readFileSync(path.join(decisionsDir, file), 'utf-8'));
        const fullDecText = `${dec.id} ${dec.title} ${dec.context} ${dec.decision} ${(dec.affectedComponents || []).join(' ')}`.toLowerCase();
        const scopeLower = input.scope.toLowerCase();
        const matches = taskTerms.split(' ').some(term =>
          term.length > 2 && fullDecText.includes(term)
        );
        const matchesScope = (scopeLower.includes('db') || scopeLower.includes('database')) && (fullDecText.includes('db') || fullDecText.includes('database') || fullDecText.includes('storage') || fullDecText.includes('sqlite') || fullDecText.includes('postgres'));
        if (matches || input.scope === 'PROJECT' || matchesScope || fullDecText.includes(scopeLower)) {
          relevantDecisions.push({
            item: dec,
            relevanceScore: matches ? 0.9 : 0.6,
            rationale: `Decision '${dec.id}: ${dec.title}' matches target domain '${input.target}' or scope '${input.scope}'`
          });
        }
      } catch (_) {}
    }
  }

  // Load constraints
  const constraintsPath = path.join(rootDir, 'constraints.json');
  if (fs.existsSync(constraintsPath)) {
    try {
      const constraints = JSON.parse(fs.readFileSync(constraintsPath, 'utf-8'));
      if (Array.isArray(constraints)) {
        for (const c of constraints) {
          relevantConstraints.push({
            item: c,
            relevanceScore: 0.8,
            rationale: `System constraint '${c.id}' binds execution scope '${input.scope}'`
          });
        }
      }
    } catch (_) {}
  }

  // Load business rules
  const rulesPath = path.join(rootDir, 'knowledge', 'business-rules.json');
  if (fs.existsSync(rulesPath)) {
    try {
      const rules: BusinessRuleRecord[] = JSON.parse(fs.readFileSync(rulesPath, 'utf-8'));
      for (const rule of rules) {
        const ruleMatches = taskTerms.split(' ').some(term =>
          term.length > 3 && rule.statement.toLowerCase().includes(term)
        );
        if (ruleMatches || rule.priority === 'CRITICAL') {
          relevantBusinessRules.push({
            item: rule,
            relevanceScore: ruleMatches ? 0.95 : 0.7,
            rationale: `Business rule '${rule.ruleId}' directly constrains logic for '${input.target}'`
          });
        }
      }
    } catch (_) {}
  }

  const overallRationale = `TaskContext synthesized for task '${input.task}' target '${input.target}' within scope '${input.scope}'. Extracted ${relevantDecisions.length} decision(s), ${relevantConstraints.length} constraint(s), and ${relevantBusinessRules.length} rule(s).`;

  return TaskContextSchema.parse({
    task: input.task,
    target: input.target,
    scope: input.scope,
    relevantRequirements,
    relevantDecisions,
    relevantConstraints,
    relevantArchitecture,
    relevantBusinessRules,
    relevantRisks,
    relevantLessons,
    overallRationale
  });
}

// =========================================================================
// 10. Knowledge Synchronization & Conflicts (Section 12, 19, 20)
// =========================================================================

export function detectKnowledgeConflicts(
  baseDir: string,
  actualCodeFacts?: {
    databaseEngine?: string;
    authStrategy?: string;
    installedPackages?: string[];
  }
): KnowledgeSyncResult {
  const rootDir = getProjectIntelligencePath(baseDir);
  const conflicts: KnowledgeConflict[] = [];
  const findings: string[] = [];

  // Check 1: ADR vs Code database engine
  const decisionsDir = path.join(rootDir, 'decisions');
  if (fs.existsSync(decisionsDir) && actualCodeFacts?.databaseEngine) {
    const files = fs.readdirSync(decisionsDir).filter(f => f.endsWith('.json'));
    for (const f of files) {
      try {
        const dec: DecisionRecord = JSON.parse(fs.readFileSync(path.join(decisionsDir, f), 'utf-8'));
        if (dec.status === 'ACCEPTED') {
          const decText = (dec.decision + ' ' + dec.context).toLowerCase();
          if (decText.includes('postgresql') && actualCodeFacts.databaseEngine.toLowerCase().includes('sqlite')) {
            conflicts.push({
              id: `CONF-DB-${dec.id}`,
              recordA: { type: 'ADR', id: dec.id, value: 'PostgreSQL' },
              recordB: { type: 'CODE', file: 'database.config', value: 'SQLite' },
              conflictType: 'DECISION_VS_IMPLEMENTATION',
              severity: 'HIGH',
              recommendedResolution: 'Align code configuration with accepted ADR or record an updated ADR superseding PostgreSQL.'
            });
            findings.push(`Conflict: ADR ${dec.id} accepted PostgreSQL, but code implements SQLite.`);
          }
        }
      } catch (_) {}
    }
  }

  // Check 2: Auth strategy conflict
  if (actualCodeFacts?.authStrategy) {
    const invariantsPath = path.join(rootDir, 'invariants.json');
    if (fs.existsSync(invariantsPath)) {
      try {
        const invs: ProjectInvariant[] = JSON.parse(fs.readFileSync(invariantsPath, 'utf-8'));
        const csrfInv = invs.find(i => i.id.includes('SEC') && i.description.includes('CSRF'));
        if (csrfInv && actualCodeFacts.authStrategy === 'UNPROTECTED_BASIC') {
          conflicts.push({
            id: 'CONF-AUTH-INVARIANT',
            recordA: csrfInv,
            recordB: { type: 'CODE', authStrategy: actualCodeFacts.authStrategy },
            conflictType: 'DECISION_VS_IMPLEMENTATION',
            severity: 'CRITICAL',
            recommendedResolution: 'Restore CSRF and secure cookie session protection to satisfy security invariant.'
          });
          findings.push('Conflict: Implementation uses unprotected basic auth violating security invariant.');
        }
      } catch (_) {}
    }
  }

  const status = conflicts.length > 0 ? 'CONFLICTED' : 'IN_SYNC';

  return KnowledgeSyncResultSchema.parse({
    status,
    conflicts,
    checkedAt: new Date().toISOString(),
    findings
  });
}

// =========================================================================
// 11. Lessons Learned & Continuous Improvement (Section 21, 22, 23, 24)
// =========================================================================

export function recordLessonLearned(
  baseDir: string,
  lesson: {
    id: string;
    problem: string;
    context: string;
    attempt: string;
    result: string;
    evidence: string;
    lesson: string;
    applicability: string;
    confidence?: number;
  }
): LessonLearnedRecord {
  const rootDir = getProjectIntelligencePath(baseDir);
  const lessonsDir = path.join(rootDir, 'lessons');
  fs.mkdirSync(lessonsDir, { recursive: true });

  const record: LessonLearnedRecord = {
    id: lesson.id,
    problem: redactSecrets(lesson.problem).redactedText,
    context: redactSecrets(lesson.context).redactedText,
    attempt: redactSecrets(lesson.attempt).redactedText,
    result: redactSecrets(lesson.result).redactedText,
    evidence: redactSecrets(lesson.evidence).redactedText,
    lesson: redactSecrets(lesson.lesson).redactedText,
    applicability: lesson.applicability,
    confidence: lesson.confidence ?? 0.85
  };

  const parsed = LessonLearnedRecordSchema.parse(record);
  fs.writeFileSync(path.join(lessonsDir, `${record.id}.json`), JSON.stringify(parsed, null, 2), 'utf-8');

  return parsed;
}

export function proposeImprovementCandidate(
  baseDir: string,
  candidate: {
    id: string;
    observation: string;
    evidence: string;
    proposedImprovement: string;
    scope: string;
    expectedBenefit: string;
    risk?: 'LOW' | 'MEDIUM' | 'HIGH';
    confidence?: number;
  }
): ImprovementCandidate {
  const rootDir = getProjectIntelligencePath(baseDir);
  const improvementDir = path.join(rootDir, 'knowledge');
  fs.mkdirSync(improvementDir, { recursive: true });

  const item: ImprovementCandidate = {
    id: candidate.id,
    observation: redactSecrets(candidate.observation).redactedText,
    evidence: redactSecrets(candidate.evidence).redactedText,
    proposedImprovement: redactSecrets(candidate.proposedImprovement).redactedText,
    scope: candidate.scope,
    expectedBenefit: candidate.expectedBenefit,
    risk: candidate.risk || 'LOW',
    confidence: candidate.confidence ?? 0.8,
    requiresGovernanceApproval: true,
    status: 'PROPOSED'
  };

  const parsed = ImprovementCandidateSchema.parse(item);
  const listFile = path.join(improvementDir, 'improvement-candidates.json');
  let list: ImprovementCandidate[] = [];
  if (fs.existsSync(listFile)) {
    try {
      list = JSON.parse(fs.readFileSync(listFile, 'utf-8'));
    } catch (_) {}
  }

  list = list.filter(i => i.id !== parsed.id).concat(parsed);
  fs.writeFileSync(listFile, JSON.stringify(list, null, 2), 'utf-8');

  return parsed;
}

// Cross-Project boundary check: prevents accidental global learning
export function evaluateReusablePattern(candidate: {
  patternId: string;
  name: string;
  description: string;
  generalizable: boolean;
  nonSensitive: boolean;
  evidenceBacked: boolean;
  domainScope: string;
  governanceReviewed?: boolean;
}): { eligibleForGlobalPromotion: boolean; reason: string; candidate: ReusablePatternCandidate } {
  const isEligible =
    candidate.generalizable === true &&
    candidate.nonSensitive === true &&
    candidate.evidenceBacked === true &&
    candidate.governanceReviewed === true;

  let reason = 'Candidate pattern satisfies cross-project generalization and governance review gates.';
  if (!candidate.generalizable) {
    reason = 'Pattern is project-specific or localized; cannot be promoted globally.';
  } else if (!candidate.nonSensitive) {
    reason = 'Pattern contains project-sensitive context or data; promotion rejected.';
  } else if (!candidate.evidenceBacked) {
    reason = 'Pattern lacks verifiable empirical evidence; promotion rejected.';
  } else if (!candidate.governanceReviewed) {
    reason = 'Pattern requires explicit human governance review before global policy promotion.';
  }

  const record: ReusablePatternCandidate = {
    patternId: candidate.patternId,
    name: candidate.name,
    description: candidate.description,
    generalizable: candidate.generalizable,
    nonSensitive: candidate.nonSensitive,
    evidenceBacked: candidate.evidenceBacked,
    domainScope: candidate.domainScope,
    governanceReviewed: candidate.governanceReviewed ?? false,
    status: isEligible ? 'PROMOTED' : 'CANDIDATE'
  };

  return {
    eligibleForGlobalPromotion: isEligible,
    reason,
    candidate: ReusablePatternCandidateSchema.parse(record)
  };
}

// =========================================================================
// 12. Knowledge Health & Living Documents (Sections 30, 31, 34)
// =========================================================================

export function evaluateProjectKnowledgeHealth(baseDir: string): ProjectKnowledgeHealth {
  const rootDir = getProjectIntelligencePath(baseDir);

  let coverage = 90;
  const freshnessMap: Record<Freshness, number> = {
    CURRENT: 0,
    POSSIBLY_STALE: 0,
    STALE: 0,
    SUPERSEDED: 0,
    UNKNOWN: 0
  };

  let conflictCount = 0;
  let verificationDebtCount = 0;
  const orphanRequirements: string[] = [];
  const orphanDecisions: string[] = [];
  const staleDocs: string[] = [];
  const unknownInvariants: string[] = [];

  // Inspect memory records
  const knowledgeDir = path.join(rootDir, 'knowledge');
  if (fs.existsSync(knowledgeDir)) {
    const files = fs.readdirSync(knowledgeDir).filter(f => f.endsWith('.json') && !f.includes('business-rules') && !f.includes('improvement-candidates'));
    for (const f of files) {
      try {
        const item: ProjectMemoryRecord = JSON.parse(fs.readFileSync(path.join(knowledgeDir, f), 'utf-8'));
        const fKey = (item.freshness || 'CURRENT') as Freshness;
        freshnessMap[fKey] = (freshnessMap[fKey] || 0) + 1;
      } catch (_) {}
    }
  }

  // Inspect decisions
  const decisionsDir = path.join(rootDir, 'decisions');
  if (fs.existsSync(decisionsDir)) {
    const files = fs.readdirSync(decisionsDir).filter(f => f.endsWith('.json'));
    for (const f of files) {
      try {
        const dec: DecisionRecord = JSON.parse(fs.readFileSync(path.join(decisionsDir, f), 'utf-8'));
        if (dec.status === 'SUPERSEDED') {
          freshnessMap.SUPERSEDED = (freshnessMap.SUPERSEDED || 0) + 1;
        } else {
          freshnessMap.CURRENT = (freshnessMap.CURRENT || 0) + 1;
        }
      } catch (_) {}
    }
  }

  // Check invariants
  const invPath = path.join(rootDir, 'invariants.json');
  if (fs.existsSync(invPath)) {
    try {
      const invs: ProjectInvariant[] = JSON.parse(fs.readFileSync(invPath, 'utf-8'));
      for (const inv of invs) {
        if (!inv.relatedTests || inv.relatedTests.length === 0) {
          unknownInvariants.push(inv.id);
        }
      }
    } catch (_) {}
  }

  let healthStatus: 'EXCELLENT' | 'GOOD' | 'NEEDS_ATTENTION' | 'CRITICAL' = 'EXCELLENT';
  if (conflictCount > 0 || unknownInvariants.length > 2) {
    healthStatus = 'NEEDS_ATTENTION';
  }

  return ProjectKnowledgeHealthSchema.parse({
    coveragePercentage: coverage,
    freshnessDistribution: freshnessMap,
    conflictCount,
    verificationDebtCount,
    orphanRequirements,
    orphanDecisions,
    staleDocs,
    unknownInvariants,
    healthStatus
  });
}

export function generateLivingDocuments(baseDir: string): {
  generatedFiles: Record<string, string>;
  staleDocuments: string[];
} {
  const rootDir = getProjectIntelligencePath(baseDir);
  const generatedFiles: Record<string, string> = {};
  const staleDocuments: string[] = [];

  const manifestPath = path.join(rootDir, 'manifest.json');
  const manifest: ProjectManifest = fs.existsSync(manifestPath)
    ? JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
    : { projectIdentity: { projectName: 'Project', projectId: 'proj-01', primaryStack: 'REACT_TYPESCRIPT' } };

  // 1. PROJECT.md
  generatedFiles['PROJECT.md'] = `# ${manifest.projectIdentity.projectName} — Living Project Overview

- **Project ID**: \`${manifest.projectIdentity.projectId}\`
- **Primary Stack**: \`${manifest.projectIdentity.primaryStack}\`
- **Project Mode**: \`${manifest.projectIdentity.projectMode || 'NEW'}\`
- **Last Updated**: \`${new Date().toISOString()}\`

This document is maintained as a living projection from the durable Project Intelligence registry.
`;

  // 2. DECISIONS.md
  let decisionsText = `# Architecture Decision Records (ADR)\n\n`;
  const decisionsDir = path.join(rootDir, 'decisions');
  if (fs.existsSync(decisionsDir)) {
    const files = fs.readdirSync(decisionsDir).filter(f => f.endsWith('.json'));
    for (const f of files) {
      try {
        const dec: DecisionRecord = JSON.parse(fs.readFileSync(path.join(decisionsDir, f), 'utf-8'));
        decisionsText += `## ${dec.id}: ${dec.title}\n`;
        decisionsText += `- **Status**: \`${dec.status}\`\n`;
        if (dec.supersedes) decisionsText += `- **Supersedes**: \`${dec.supersedes}\`\n`;
        if (dec.supersededBy) decisionsText += `- **Superseded By**: \`${dec.supersededBy}\`\n`;
        decisionsText += `- **Context**: ${dec.context}\n`;
        decisionsText += `- **Decision**: ${dec.decision}\n\n`;
      } catch (_) {}
    }
  }
  generatedFiles['DECISIONS.md'] = decisionsText;

  // 3. INVARIANTS.md
  let invariantsText = `# Critical Project Invariants\n\n`;
  const invPath = path.join(rootDir, 'invariants.json');
  if (fs.existsSync(invPath)) {
    try {
      const invs: ProjectInvariant[] = JSON.parse(fs.readFileSync(invPath, 'utf-8'));
      for (const inv of invs) {
        invariantsText += `- **[${inv.category}] ${inv.id}** (${inv.severity}): ${inv.description} *(Verified by: ${inv.verificationMethod})*\n`;
      }
    } catch (_) {}
  }
  generatedFiles['INVARIANTS.md'] = invariantsText;

  // Write out generated files into .alper-design-os/project/
  for (const [name, content] of Object.entries(generatedFiles)) {
    fs.writeFileSync(path.join(rootDir, name), content, 'utf-8');
  }

  return {
    generatedFiles,
    staleDocuments
  };
}
