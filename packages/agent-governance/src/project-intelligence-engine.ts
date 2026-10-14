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
  BusinessRuleSourceType,
  ProjectInvariant,
  ProjectInvariantSchema,
  ProjectArchitectureGraph,
  ProjectArchitectureGraphSchema,
  GraphCompleteness,
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
} from './project-intelligence-types.js';

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

export interface DiscoveredRepositoryArtifacts {
  modules: string[];
  components: string[];
  services: string[];
  tables: string[];
  apis: string[];
  pages: string[];
  testFiles: string[];
  evidenceSources: string[];
  databaseFingerprint: string;
  dependencyFingerprint: string;
  designSystemFingerprint: string;
}

const IGNORED_SCAN_DIRS = new Set([
  'node_modules',
  '.git',
  '.alper-design-os',
  'dist',
  'build',
  'vendor',
  'bin',
  'obj',
  'coverage',
  '.next',
  '.turbo'
]);

function walkRepositoryFiles(baseDir: string, maxFiles: number = 400): string[] {
  if (!baseDir || !fs.existsSync(baseDir)) return [];
  const results: string[] = [];

  function walk(currentDir: string, depth: number) {
    if (depth > 5 || results.length >= maxFiles) return;
    let entries: fs.Dirent[] = [];
    try {
      entries = fs.readdirSync(currentDir, { withFileTypes: true });
    } catch (_) {
      return;
    }
    for (const entry of entries) {
      if (results.length >= maxFiles) break;
      if (IGNORED_SCAN_DIRS.has(entry.name)) continue;
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath, depth + 1);
      } else if (entry.isFile()) {
        results.push(path.relative(baseDir, fullPath).replace(/\\/g, '/'));
      }
    }
  }

  walk(baseDir, 0);
  return results;
}

export function discoverRepositoryArtifacts(baseDir: string): DiscoveredRepositoryArtifacts {
  const modules = new Set<string>();
  const components = new Set<string>();
  const services = new Set<string>();
  const tables = new Set<string>();
  const apis = new Set<string>();
  const pages = new Set<string>();
  const testFiles = new Set<string>();
  const evidenceSources = new Set<string>();

  const dbHashInputs: string[] = [];
  const depHashInputs: string[] = [];
  const designHashInputs: string[] = [];

  const relFiles = walkRepositoryFiles(baseDir);

  for (const relPath of relFiles) {
    const absPath = path.join(baseDir, relPath);
    const lowerPath = relPath.toLowerCase();
    const baseName = path.basename(relPath);
    const nameWithoutExt = baseName.replace(/\.[^.]+$/, '');

    // Test files
    if (/\.(test|spec)\.(ts|tsx|js|jsx|php|cs)$/i.test(baseName) || lowerPath.startsWith('tests/')) {
      testFiles.add(relPath);
      continue;
    }

    // Dependency manifests
    if (
      baseName === 'package.json' ||
      baseName === 'composer.json' ||
      baseName.endsWith('.csproj') ||
      baseName === 'requirements.txt'
    ) {
      try {
        const content = fs.readFileSync(absPath, 'utf-8');
        depHashInputs.push(`${relPath}:${content}`);
        evidenceSources.add(relPath);
        if (relPath.startsWith('packages/') && baseName === 'package.json') {
          const pkgDir = relPath.split('/')[1];
          if (pkgDir) modules.add(pkgDir);
        }
      } catch (_) {}
    }

    // Modules & Services from directory conventions
    if (/^(src\/modules|app\/modules|modules)\/([^/]+)/i.test(relPath)) {
      const m = relPath.match(/^(?:src\/modules|app\/modules|modules)\/([^/]+)/i);
      if (m && m[1]) {
        modules.add(m[1].replace(/\.[^.]+$/, ''));
        evidenceSources.add(relPath);
      }
    }
    if (/(service|controller|gateway|repository)\.(ts|js|php|cs)$/i.test(baseName)) {
      services.add(nameWithoutExt);
      modules.add(nameWithoutExt);
      evidenceSources.add(relPath);
    }

    // Components
    if (/^(src\/components|resources\/views\/components|components)\/([^/]+)/i.test(relPath)) {
      components.add(nameWithoutExt);
      evidenceSources.add(relPath);
    }

    // Database schemas, migrations, models, entities
    if (
      lowerPath.endsWith('.sql') ||
      lowerPath.includes('migration') ||
      lowerPath.includes('schema.prisma') ||
      /^(src\/models|src\/entities|app\/models|models|entities)\//i.test(relPath)
    ) {
      try {
        const content = fs.readFileSync(absPath, 'utf-8');
        dbHashInputs.push(`${relPath}:${content}`);
        evidenceSources.add(relPath);

        // SQL CREATE TABLE
        const sqlMatches = content.matchAll(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?["`']?([a-zA-Z0-9_]+)["`']?/gi);
        for (const match of sqlMatches) {
          if (match[1]) tables.add(match[1]);
        }

        // Laravel Schema::create
        const laravelMatches = content.matchAll(/Schema::create\(\s*['"]([a-zA-Z0-9_]+)['"]/g);
        for (const match of laravelMatches) {
          if (match[1]) tables.add(match[1]);
        }

        // Prisma model
        const prismaMatches = content.matchAll(/^\s*model\s+([A-Za-z0-9_]+)\s*\{/gm);
        for (const match of prismaMatches) {
          if (match[1]) tables.add(match[1]);
        }

        if (/^(src\/models|src\/entities|app\/models|models|entities)\//i.test(relPath)) {
          tables.add(nameWithoutExt.toLowerCase());
        }
      } catch (_) {}
    }

    // APIs / Routes / Controllers / OpenAPI
    if (
      /(route|controller|api|server|app)\.(ts|tsx|js|php|cs)$/i.test(baseName) ||
      /^routes\/(api|web)\.php$/i.test(relPath) ||
      /openapi\.(json|ya?ml)$/i.test(baseName)
    ) {
      try {
        const content = fs.readFileSync(absPath, 'utf-8');

        // Express / Fastify / Hono style
        const expressMatches = content.matchAll(/\b(?:app|router|server)\.(get|post|put|patch|delete)\s*\(\s*['"`]([^'"`]+)['"`]/gi);
        for (const match of expressMatches) {
          apis.add(`${match[1].toUpperCase()} ${match[2]}`);
          evidenceSources.add(relPath);
        }

        // Explicit /api/... string literals in route/controller files
        const apiPathMatches = content.matchAll(/['"`](\/api\/[a-zA-Z0-9_/\-:]+)['"`]/g);
        for (const match of apiPathMatches) {
          apis.add(`GET ${match[1]}`);
          evidenceSources.add(relPath);
        }

        // Laravel Route::
        const laravelRouteMatches = content.matchAll(/Route::(get|post|put|patch|delete|resource)\s*\(\s*['"]([^'"]+)['"]/gi);
        for (const match of laravelRouteMatches) {
          const verb = match[1].toUpperCase() === 'RESOURCE' ? 'RESOURCE' : match[1].toUpperCase();
          const routePath = match[2].startsWith('/') ? match[2] : `/${match[2]}`;
          if (lowerPath.includes('api')) {
            apis.add(`${verb} /api${routePath}`);
          } else {
            pages.add(routePath);
          }
          evidenceSources.add(relPath);
        }

        // ASP.NET [HttpGet("...")]
        const aspMatches = content.matchAll(/\[Http(Get|Post|Put|Delete|Patch)(?:\(\s*"([^"]*)"\s*\))?\]/gi);
        for (const match of aspMatches) {
          const verb = match[1].toUpperCase();
          const sub = match[2] ? (match[2].startsWith('/') ? match[2] : `/${match[2]}`) : `/${nameWithoutExt.replace(/Controller$/i, '').toLowerCase()}`;
          apis.add(`${verb} ${sub}`);
          evidenceSources.add(relPath);
        }
      } catch (_) {}
    }

    // Pages / Views
    if (
      /^(src\/pages|src\/views|pages|views)\/([^/]+)\.(tsx|jsx|ts|js|cshtml|html)$/i.test(relPath) ||
      /^resources\/views\/([^/]+)\.blade\.php$/i.test(relPath) ||
      relPath === 'index.html'
    ) {
      const cleanPage = nameWithoutExt.replace(/\.blade$/i, '').toLowerCase();
      const route = cleanPage === 'index' || cleanPage === 'home' ? '/' : `/${cleanPage}`;
      pages.add(route);
      evidenceSources.add(relPath);
    }

    // Design tokens & stylesheets
    if (
      /tokens?\.(json|ts|css)$/i.test(baseName) ||
      baseName.endsWith('.css') ||
      /^tailwind\.config\./i.test(baseName)
    ) {
      try {
        const content = fs.readFileSync(absPath, 'utf-8');
        designHashInputs.push(`${relPath}:${content}`);
        evidenceSources.add(relPath);
      } catch (_) {}
    }
  }

  return {
    modules: Array.from(modules),
    components: Array.from(components),
    services: Array.from(services),
    tables: Array.from(tables),
    apis: Array.from(apis),
    pages: Array.from(pages),
    testFiles: Array.from(testFiles),
    evidenceSources: Array.from(evidenceSources),
    databaseFingerprint: dbHashInputs.length > 0 ? `fp-db-${hashData(dbHashInputs.sort())}` : 'NOT_VERIFIED',
    dependencyFingerprint: depHashInputs.length > 0 ? `fp-dep-${hashData(depHashInputs.sort())}` : 'NOT_VERIFIED',
    designSystemFingerprint: designHashInputs.length > 0 ? `fp-ds-${hashData(designHashInputs.sort())}` : 'NOT_VERIFIED'
  };
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

  const discovered = discoverRepositoryArtifacts(baseDir);

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
    domains: options.domains || (options.profile?.domain ? [options.profile.domain] : ['General Software']),
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

  // Write invariants.json — only link relatedTests if those test files actually exist on disk
  const authTestExists = discovered.testFiles.some(t => t.toLowerCase().includes('auth'));
  const dbTestExists = discovered.testFiles.some(t => t.toLowerCase().includes('db'));

  const initialInvariants: ProjectInvariant[] = [
    {
      id: 'INV-SEC-01',
      description: 'CSRF protection and HttpOnly secure cookies must remain enabled.',
      category: 'SECURITY',
      scope: 'API',
      severity: 'CRITICAL',
      verificationMethod: 'SECURITY_SCAN',
      relatedTests: authTestExists ? discovered.testFiles.filter(t => t.toLowerCase().includes('auth')) : [],
      source: 'Default Security Baseline'
    },
    {
      id: 'INV-DATA-01',
      description: 'Foreign key integrity and audit timestamps must be maintained on all entity updates.',
      category: 'DATA_INTEGRITY',
      scope: 'DATABASE',
      severity: 'HIGH',
      verificationMethod: 'INTEGRATION_TEST',
      relatedTests: dbTestExists ? discovered.testFiles.filter(t => t.toLowerCase().includes('db')) : [],
      source: 'Domain Data Integrity Standard'
    }
  ];
  fs.writeFileSync(path.join(rootDir, 'invariants.json'), JSON.stringify(initialInvariants, null, 2), 'utf-8');
  createdFiles.push('invariants.json');

  // Write initial T0 snapshot — truthful inventories and fingerprints (never fake defaults)
  const blueprintRoutes: string[] = Array.isArray(options.blueprint?.pages?.pages)
    ? options.blueprint.pages.pages.map((p: any) => p.route).filter(Boolean)
    : discovered.pages;
  const blueprintApis: string[] = Array.isArray(options.blueprint?.api?.endpoints)
    ? options.blueprint.api.endpoints.map((e: any) => `${e.method} ${e.path}`).filter(Boolean)
    : discovered.apis;

  const initialSnapshot: ProjectSnapshot = {
    snapshotId: 'SNAP-T0-INIT',
    commitSha: 'UNVERIFIED_WORKING_TREE',
    timestamp: now,
    stack: identity.primaryStack,
    architectureHash: options.blueprint?.architecture ? hashData(options.blueprint.architecture) : 'NOT_VERIFIED',
    requirementHash: options.blueprint?.requirements ? hashData(options.blueprint.requirements) : 'NOT_VERIFIED',
    routeInventory: blueprintRoutes,
    apiInventory: blueprintApis,
    databaseFingerprint: options.blueprint?.database?.entities?.length > 0
      ? `fp-db-${hashData(options.blueprint.database.entities)}`
      : discovered.databaseFingerprint,
    dependencyFingerprint: discovered.dependencyFingerprint,
    designSystemFingerprint: discovered.designSystemFingerprint,
    uiTokenFingerprint: discovered.designSystemFingerprint,
    verificationStatus: 'NOT_VERIFIED'
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
// 3. Decision Records (ADR) & Superseding (Section 5, 6, 25, 26, 30)
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
    confirmedByUser?: boolean;
    authoritySource?: MemoryRecordSource;
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

  // Section 30: Do not elevate authority based on free-text substring matching like approvedBy.includes('alper').
  // Require explicit confirmedByUser === true or explicit authoritySource === 'USER_DECISION'.
  const confirmedByUser = decisionInput.confirmedByUser === true;
  const authoritySource: MemoryRecordSource =
    decisionInput.authoritySource ||
    (confirmedByUser ? 'USER_DECISION' : 'SYSTEM_RECOMMENDATION');

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
    status: decisionInput.status || (decisionInput.approvedBy === 'SYSTEM_RECOMMENDATION' ? 'PROPOSED' : 'ACCEPTED'),
    supersedes: decisionInput.supersedes || null,
    supersededBy: null,
    createdAt: new Date().toISOString(),
    approvedBy: decisionInput.approvedBy,
    confirmedByUser,
    authoritySource,
    verificationStatus: confirmedByUser || authoritySource === 'USER_DECISION' ? 'VERIFIED' : 'NOT_VERIFIED'
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
    source: authoritySource,
    sourceRefs: [`decisions/${record.id}.json`],
    status: record.status === 'ACCEPTED' ? 'ACTIVE' : (record.status === 'SUPERSEDED' ? 'SUPERSEDED' : 'UNVERIFIED'),
    confidence: confirmedByUser ? 1.0 : 0.75,
    freshness: 'CURRENT',
    scope: 'PROJECT',
    relatedEntities: record.affectedComponents,
    tags: ['ADR', record.status, authoritySource]
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
  record: {
    id: string;
    type: ProjectMemoryRecordType;
    title: string;
    summary: string;
    details: string;
    source: MemoryRecordSource;
    sourceRefs?: string[];
    createdAt?: string;
    updatedAt?: string;
    status?: 'ACTIVE' | 'UNVERIFIED' | 'DEPRECATED' | 'SUPERSEDED';
    confidence?: number;
    freshness?: Freshness;
    scope?: MemoryScope;
    relatedEntities?: string[];
    tags?: string[];
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
// 5. Business Rules & Invariants Registries (Sections 8, 9, 27–30)
// =========================================================================

const AUTHORITATIVE_RULE_SOURCE_TYPES = new Set<BusinessRuleSourceType>([
  'EXPLICIT_USER_SPECIFICATION',
  'VERIFIED_CODE_FACT',
  'APPROVED_REQUIREMENT',
  'REGULATORY_SOURCE',
  'AUTHORITATIVE_DOCUMENT'
]);

const NON_VERIFIABLE_RULE_SOURCE_TYPES = new Set<BusinessRuleSourceType>([
  'MODEL_INFERENCE',
  'SYSTEM_INFERENCE',
  'DOMAIN_RESEARCH',
  'UNKNOWN'
]);

export function recordBusinessRule(
  baseDir: string,
  ruleInput: {
    ruleId: string;
    statement: string;
    source: string;
    sourceType?: BusinessRuleSourceType;
    sourceRef?: string;
    evidenceRefs?: string[];
    confirmedByUser?: boolean;
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
  const knowledgeDir = path.join(rootDir, 'knowledge');
  fs.mkdirSync(knowledgeDir, { recursive: true });
  const rulesPath = path.join(knowledgeDir, 'business-rules.json');

  let existingRules: BusinessRuleRecord[] = [];
  if (fs.existsSync(rulesPath)) {
    try {
      existingRules = JSON.parse(fs.readFileSync(rulesPath, 'utf-8'));
    } catch (_) {}
  }

  // Sections 27-29: Free-text strings (e.g. "Alper", "User Brief", "Contract") are NEVER proof of authority.
  // Require explicit typed sourceType + supporting confirmation or evidence reference.
  let resolvedSourceType: BusinessRuleSourceType = ruleInput.sourceType || 'UNKNOWN';
  if (!ruleInput.sourceType) {
    const lowerSource = (ruleInput.source || '').toLowerCase();
    if (lowerSource.includes('infer') || lowerSource.includes('llm') || lowerSource.includes('heuristic') || lowerSource.includes('model')) {
      resolvedSourceType = 'MODEL_INFERENCE';
    } else if (lowerSource.includes('research')) {
      resolvedSourceType = 'DOMAIN_RESEARCH';
    } else {
      resolvedSourceType = 'UNKNOWN';
    }
  }

  const evidenceRefs = ruleInput.evidenceRefs || [];
  const confirmedByUser = ruleInput.confirmedByUser === true;
  const hasQualifyingEvidenceOrConfirmation =
    confirmedByUser ||
    Boolean(ruleInput.sourceRef && ruleInput.sourceRef.trim().length > 0) ||
    evidenceRefs.length > 0 ||
    (ruleInput.tests && ruleInput.tests.length > 0) ||
    (ruleInput.requirements && ruleInput.requirements.length > 0);

  const isVerified =
    !NON_VERIFIABLE_RULE_SOURCE_TYPES.has(resolvedSourceType) &&
    AUTHORITATIVE_RULE_SOURCE_TYPES.has(resolvedSourceType) &&
    hasQualifyingEvidenceOrConfirmation;

  const status = isVerified ? 'VERIFIED' : 'UNVERIFIED';

  const cleanStatement = redactSecrets(ruleInput.statement).redactedText;

  const newRule: BusinessRuleRecord = {
    ruleId: ruleInput.ruleId,
    statement: cleanStatement,
    source: ruleInput.source,
    sourceType: resolvedSourceType,
    sourceRef: ruleInput.sourceRef,
    evidenceRefs,
    confirmedByUser,
    priority: ruleInput.priority || 'HIGH',
    scope: ruleInput.scope || 'PROJECT',
    inputs: ruleInput.inputs || [],
    outputs: ruleInput.outputs || [],
    exceptions: ruleInput.exceptions || [],
    requirements: ruleInput.requirements || [],
    tests: ruleInput.tests || [],
    status,
    verificationStatus: isVerified ? 'VERIFIED' : 'NOT_VERIFIED'
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
  fs.mkdirSync(rootDir, { recursive: true });
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
// 6. Architecture Graph Builder (Sections 20, 21)
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

  const discovered = discoverRepositoryArtifacts(baseDir);
  const evidenceSources = [...discovered.evidenceSources];

  const hasExplicitArtifacts = Boolean(
    codeArtifacts &&
    (
      (codeArtifacts.modules && codeArtifacts.modules.length > 0) ||
      (codeArtifacts.components && codeArtifacts.components.length > 0) ||
      (codeArtifacts.services && codeArtifacts.services.length > 0) ||
      (codeArtifacts.tables && codeArtifacts.tables.length > 0) ||
      (codeArtifacts.apis && codeArtifacts.apis.length > 0) ||
      (codeArtifacts.pages && codeArtifacts.pages.length > 0)
    )
  );
  if (hasExplicitArtifacts) {
    evidenceSources.push('explicit_code_artifacts');
  }

  // Merge discovered repo artifacts with any explicitly provided codeArtifacts (NEVER fabricate defaults!)
  const moduleNames = Array.from(new Set([...(codeArtifacts?.modules || []), ...discovered.modules]));
  const componentNames = Array.from(new Set([...(codeArtifacts?.components || []), ...discovered.components]));
  const serviceNames = Array.from(new Set([...(codeArtifacts?.services || []), ...discovered.services]));
  const tables = Array.from(new Set([...(codeArtifacts?.tables || []), ...discovered.tables]));
  const apis = Array.from(new Set([...(codeArtifacts?.apis || []), ...discovered.apis]));
  const pages = Array.from(new Set([...(codeArtifacts?.pages || []), ...discovered.pages]));

  // Modules
  for (const mod of moduleNames) {
    const id = `mod-${mod.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    if (!nodes.some(n => n.id === id)) {
      nodes.push({ id, type: 'MODULE', name: mod, metadata: { layer: 'CORE' } });
    }
  }

  // Components
  for (const comp of componentNames) {
    const id = `comp-${comp.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    if (!nodes.some(n => n.id === id)) {
      nodes.push({ id, type: 'COMPONENT', name: comp, metadata: { layer: 'UI' } });
    }
  }

  // Services
  for (const svc of serviceNames) {
    const id = `svc-${svc.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    if (!nodes.some(n => n.id === id)) {
      nodes.push({ id, type: 'SERVICE', name: svc, metadata: { layer: 'APPLICATION' } });
    }
  }

  // Helper to locate best matching module/service node for wiring edges only between real nodes
  const findModuleNodeId = (keywords: string[]): string | undefined => {
    for (const kw of keywords) {
      const found = nodes.find(
        n => (n.type === 'MODULE' || n.type === 'SERVICE') && n.name.toLowerCase().includes(kw)
      );
      if (found) return found.id;
    }
    const firstMod = nodes.find(n => n.type === 'MODULE' || n.type === 'SERVICE');
    return firstMod?.id;
  };

  const dataModId = findModuleNodeId(['data', 'db', 'repo', 'store', 'model', 'core']);
  const apiModId = findModuleNodeId(['api', 'gateway', 'controller', 'route', 'server', 'core']);
  const uiModId = findModuleNodeId(['ui', 'view', 'page', 'web', 'client', 'app']);

  // Database tables / entities
  for (const tbl of tables) {
    const nodeId = `db-${tbl.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    if (!nodes.some(n => n.id === nodeId)) {
      nodes.push({ id: nodeId, type: 'TABLE_OR_ENTITY', name: tbl, metadata: { storage: 'RELATIONAL' } });
    }
    if (dataModId) {
      edges.push({ source: dataModId, target: nodeId, type: 'READS', metadata: {} });
      edges.push({ source: dataModId, target: nodeId, type: 'WRITES', metadata: {} });
    }
  }

  // APIs
  for (const api of apis) {
    const nodeId = `api-${api.replace(/[^a-zA-Z0-9]/g, '_')}`;
    if (!nodes.some(n => n.id === nodeId)) {
      nodes.push({ id: nodeId, type: 'API', name: api, metadata: { protocol: 'HTTP_REST' } });
    }
    if (apiModId) {
      edges.push({ source: apiModId, target: nodeId, type: 'ROUTES_TO', metadata: {} });
    }
    if (dataModId && dataModId !== apiModId) {
      edges.push({ source: nodeId, target: dataModId, type: 'CALLS', metadata: {} });
    } else if (tables.length > 0) {
      const firstTableId = `db-${tables[0].toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      edges.push({ source: nodeId, target: firstTableId, type: 'READS', metadata: {} });
    }
  }

  // Pages
  for (const page of pages) {
    const nodeId = `page-${page.replace(/[^a-zA-Z0-9]/g, '_')}`;
    if (!nodes.some(n => n.id === nodeId)) {
      nodes.push({ id: nodeId, type: 'PAGE', name: page, metadata: { route: page } });
    }
    if (uiModId) {
      edges.push({ source: uiModId, target: nodeId, type: 'IMPLEMENTS', metadata: {} });
    }
    if (apiModId) {
      edges.push({ source: nodeId, target: apiModId, type: 'CALLS', metadata: {} });
    } else if (apis.length > 0) {
      const firstApiId = `api-${apis[0].replace(/[^a-zA-Z0-9]/g, '_')}`;
      edges.push({ source: nodeId, target: firstApiId, type: 'CALLS', metadata: {} });
    }
  }

  const unknownAreas: string[] = [];
  if (moduleNames.length === 0 && serviceNames.length === 0) unknownAreas.push('modules_and_services');
  if (tables.length === 0) unknownAreas.push('database_entities');
  if (apis.length === 0) unknownAreas.push('apis');
  if (pages.length === 0 && componentNames.length === 0) unknownAreas.push('ui_pages_and_components');

  let completeness: GraphCompleteness = 'EMPTY';
  let verificationStatus: 'VERIFIED' | 'PARTIALLY_VERIFIED' | 'NOT_VERIFIED' = 'NOT_VERIFIED';

  if (nodes.length === 0 && !hasExplicitArtifacts) {
    const persistedArchPath = path.join(getProjectIntelligencePath(baseDir), 'architecture.json');
    if (fs.existsSync(persistedArchPath)) {
      try {
        const persisted = JSON.parse(fs.readFileSync(persistedArchPath, 'utf-8'));
        if (persisted && Array.isArray(persisted.nodes) && persisted.nodes.length > 0) {
          return ProjectArchitectureGraphSchema.parse(persisted);
        }
      } catch (_) {}
    }
    completeness = 'EMPTY';
    verificationStatus = 'NOT_VERIFIED';
  } else if (nodes.length === 0) {
    completeness = 'EMPTY';
    verificationStatus = 'NOT_VERIFIED';
  } else if (unknownAreas.length === 0) {
    completeness = 'COMPLETE';
    verificationStatus = evidenceSources.length > 0 ? 'VERIFIED' : 'PARTIALLY_VERIFIED';
  } else {
    completeness = 'PARTIAL';
    verificationStatus = 'PARTIALLY_VERIFIED';
  }

  const graphHash = hashData({ nodes, edges });
  const parsedGraph = ProjectArchitectureGraphSchema.parse({
    nodes,
    edges,
    graphHash,
    completeness,
    unknownAreas,
    evidenceSources: Array.from(new Set(evidenceSources)),
    verificationStatus
  });

  const rootDir = getProjectIntelligencePath(baseDir);
  if (nodes.length > 0 && fs.existsSync(rootDir)) {
    fs.writeFileSync(path.join(rootDir, 'architecture.json'), JSON.stringify(parsedGraph, null, 2), 'utf-8');
  }

  return parsedGraph;
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
  const discovered = discoverRepositoryArtifacts(baseDir);

  // Load manifest & arch to calculate hashes from real artifacts when available
  let archHash = 'NOT_VERIFIED';
  const archPath = path.join(rootDir, 'architecture.json');
  if (fs.existsSync(archPath)) {
    try {
      const archObj = JSON.parse(fs.readFileSync(archPath, 'utf-8'));
      if (archObj && Array.isArray(archObj.nodes) && archObj.nodes.length > 0 && archObj.verificationStatus !== 'NOT_VERIFIED') {
        archHash = hashData(archObj);
      }
    } catch (_) {}
  } else if (discovered.evidenceSources.length > 0) {
    archHash = hashData(discovered.evidenceSources);
  }

  let reqHash = 'NOT_VERIFIED';
  const reqPath = path.join(rootDir, 'knowledge', 'business-rules.json');
  if (fs.existsSync(reqPath)) {
    try {
      const rules = JSON.parse(fs.readFileSync(reqPath, 'utf-8'));
      if (Array.isArray(rules) && rules.length > 0 && rules.some((r: any) => r.status === 'VERIFIED' || r.verificationStatus === 'VERIFIED')) {
        reqHash = hashData(rules);
      }
    } catch (_) {}
  }

  const rawDesignFp = details?.designSystemFingerprint || discovered.designSystemFingerprint;
  const designFp = rawDesignFp && rawDesignFp.trim().length > 0 ? rawDesignFp : 'NOT_VERIFIED';
  const rawUiTokenFp = details?.uiTokenFingerprint;
  const uiTokenFp = rawUiTokenFp && rawUiTokenFp.trim().length > 0 ? rawUiTokenFp : designFp;
  const computedVerificationStatus: 'VERIFIED' | 'PARTIALLY_VERIFIED' | 'NOT_VERIFIED' =
    details?.verificationStatus ||
    (archHash !== 'NOT_VERIFIED' || reqHash !== 'NOT_VERIFIED' || discovered.evidenceSources.length > 0
      ? 'PARTIALLY_VERIFIED'
      : 'NOT_VERIFIED');

  const snapshot: ProjectSnapshot = {
    snapshotId,
    commitSha: details?.commitSha || 'UNVERIFIED_WORKING_TREE',
    timestamp: now,
    stack: details?.stack || 'REACT_TYPESCRIPT',
    architectureHash: details?.architectureHash || archHash,
    requirementHash: details?.requirementHash || reqHash,
    routeInventory: details?.routeInventory ?? discovered.pages,
    apiInventory: details?.apiInventory ?? discovered.apis,
    databaseFingerprint: details?.databaseFingerprint || discovered.databaseFingerprint,
    dependencyFingerprint: details?.dependencyFingerprint || discovered.dependencyFingerprint,
    designSystemFingerprint: designFp,
    uiTokenFingerprint: uiTokenFp,
    verificationStatus: computedVerificationStatus
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
  const removedApis = baseSnapshot.apiInventory.filter((api: string) => !targetSnapshot.apiInventory.includes(api));
  const addedApis = targetSnapshot.apiInventory.filter((api: string) => !baseSnapshot.apiInventory.includes(api));

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
// 8. Change Impact Analysis (Section 23 — Graph + Traceability Driven)
// =========================================================================

export function analyzeChangeImpact(
  baseDir: string,
  target: string,
  proposedChange: string,
  codeArtifacts?: {
    modules?: string[];
    components?: string[];
    services?: string[];
    tables?: string[];
    apis?: string[];
    pages?: string[];
  }
): ChangeImpactAssessment {
  const rootDir = getProjectIntelligencePath(baseDir);

  const affectedRequirements = new Set<string>();
  const affectedModules = new Set<string>();
  const affectedApis = new Set<string>();
  const affectedPages = new Set<string>();
  const affectedEntities = new Set<string>();
  const affectedTests = new Set<string>();
  const affectedDecisions = new Set<string>();
  const evidenceSources = new Set<string>();

  // Extract search tokens from target and proposedChange
  const rawTokens = `${target} ${proposedChange}`
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(t => t.length >= 3 && !['the', 'and', 'for', 'from', 'with', 'into', 'add', 'use'].includes(t));
  const targetLower = target.toLowerCase();

  // 1. Traverse real ProjectArchitectureGraph
  const graph = buildProjectArchitectureGraph(baseDir, codeArtifacts);
  for (const src of graph.evidenceSources || []) {
    evidenceSources.add(src);
  }

  const matchedNodeIds = new Set<string>();
  for (const node of graph.nodes) {
    const nodeNameLower = node.name.toLowerCase();
    const nodeIdLower = node.id.toLowerCase();
    const isMatched =
      nodeNameLower.includes(targetLower) ||
      targetLower.includes(nodeNameLower) ||
      rawTokens.some(tok => nodeNameLower.includes(tok) || nodeIdLower.includes(tok));
    if (isMatched) {
      matchedNodeIds.add(node.id);
    }
  }

  // Expand 1-hop and 2-hop neighbors in the architecture graph
  const impactedNodeIds = new Set<string>(matchedNodeIds);
  for (let hop = 0; hop < 2; hop++) {
    for (const edge of graph.edges) {
      if (impactedNodeIds.has(edge.source)) impactedNodeIds.add(edge.target);
      if (impactedNodeIds.has(edge.target)) impactedNodeIds.add(edge.source);
    }
  }

  for (const node of graph.nodes) {
    if (!impactedNodeIds.has(node.id)) continue;
    if (node.type === 'MODULE' || node.type === 'SERVICE' || node.type === 'COMPONENT') {
      affectedModules.add(node.name);
    } else if (node.type === 'API') {
      affectedApis.add(node.name);
    } else if (node.type === 'PAGE') {
      affectedPages.add(node.name);
    } else if (node.type === 'TABLE_OR_ENTITY' || node.type === 'DATABASE') {
      affectedEntities.add(node.name);
    }
  }

  // 2. Inspect recorded Decisions (ADRs)
  const decisionsDir = path.join(rootDir, 'decisions');
  if (fs.existsSync(decisionsDir)) {
    const files = fs.readdirSync(decisionsDir).filter(f => f.endsWith('.json'));
    for (const file of files) {
      try {
        const dec: DecisionRecord = JSON.parse(fs.readFileSync(path.join(decisionsDir, file), 'utf-8'));
        const decText = `${dec.id} ${dec.title} ${dec.context} ${dec.decision} ${(dec.affectedComponents || []).join(' ')}`.toLowerCase();
        if (rawTokens.some(tok => decText.includes(tok))) {
          affectedDecisions.add(dec.id);
          evidenceSources.add(`decisions/${file}`);
          for (const comp of dec.affectedComponents || []) {
            affectedModules.add(comp);
          }
          for (const req of dec.requirements || []) {
            affectedRequirements.add(req);
          }
        }
      } catch (_) {}
    }
  }

  // 3. Inspect recorded Business Rules
  const rulesPath = path.join(rootDir, 'knowledge', 'business-rules.json');
  if (fs.existsSync(rulesPath)) {
    try {
      const rules: BusinessRuleRecord[] = JSON.parse(fs.readFileSync(rulesPath, 'utf-8'));
      for (const rule of rules) {
        const ruleText = `${rule.ruleId} ${rule.statement} ${rule.scope} ${(rule.inputs || []).join(' ')} ${(rule.outputs || []).join(' ')}`.toLowerCase();
        if (rawTokens.some(tok => ruleText.includes(tok))) {
          evidenceSources.add('knowledge/business-rules.json');
          for (const req of rule.requirements || []) {
            affectedRequirements.add(req);
          }
          for (const test of rule.tests || []) {
            affectedTests.add(test);
          }
          affectedRequirements.add(rule.ruleId);
        }
      }
    } catch (_) {}
  }

  // 4. Inspect recorded Invariants
  let criticalInvariantImpacted = false;
  const invPath = path.join(rootDir, 'invariants.json');
  if (fs.existsSync(invPath)) {
    try {
      const invs: ProjectInvariant[] = JSON.parse(fs.readFileSync(invPath, 'utf-8'));
      for (const inv of invs) {
        const invText = `${inv.id} ${inv.description} ${inv.category} ${inv.scope}`.toLowerCase();
        const matchesSecurityOrData =
          (inv.category === 'SECURITY' && rawTokens.some(t => ['auth', 'session', 'token', 'jwt', 'cookie', 'csrf', 'security', 'login'].includes(t))) ||
          (inv.category === 'DATA_INTEGRITY' && rawTokens.some(t => ['db', 'database', 'table', 'schema', 'entity', 'migration', 'foreign'].includes(t))) ||
          rawTokens.some(tok => invText.includes(tok));
        if (matchesSecurityOrData) {
          evidenceSources.add('invariants.json');
          affectedRequirements.add(inv.id);
          if (inv.severity === 'CRITICAL') criticalInvariantImpacted = true;
          for (const test of inv.relatedTests || []) {
            affectedTests.add(test);
          }
        }
      }
    } catch (_) {}
  }

  // 5. Inspect discovered repository test files matching tokens
  const discovered = discoverRepositoryArtifacts(baseDir);
  for (const tf of discovered.testFiles) {
    const tfLower = tf.toLowerCase();
    if (rawTokens.some(tok => tfLower.includes(tok))) {
      affectedTests.add(tf);
      evidenceSources.add(tf);
    }
  }

  // 6. Determine risk & confidence truthfully (NEVER fabricate fake modules/APIs/entities)
  const totalGraphMatches =
    affectedModules.size +
    affectedApis.size +
    affectedPages.size +
    affectedEntities.size +
    affectedDecisions.size;

  const isSecurityOrAuthChange = rawTokens.some(t =>
    ['auth', 'session', 'jwt', 'token', 'cookie', 'password', 'credential', 'security', 'permission', 'rbac'].includes(t)
  );
  const isSchemaOrMigrationChange = rawTokens.some(t =>
    ['schema', 'migration', 'database', 'table', 'column', 'foreign'].includes(t)
  );

  let risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (criticalInvariantImpacted && affectedEntities.size > 2) {
    risk = 'CRITICAL';
  } else if (
    criticalInvariantImpacted ||
    isSecurityOrAuthChange ||
    affectedEntities.size > 2 ||
    affectedApis.size > 2
  ) {
    risk = 'HIGH';
  } else if (isSchemaOrMigrationChange || affectedModules.size > 0 || affectedDecisions.size > 0) {
    risk = 'MEDIUM';
  }

  const confidence =
    graph.completeness === 'COMPLETE' && totalGraphMatches > 0
      ? 0.9
      : totalGraphMatches > 0
        ? 0.7
        : evidenceSources.size > 0
          ? 0.45
          : 0.25;

  const recommendedVerification = [
    'Unit and integration tests for affected modules and business rules',
    'API contract and schema backward-compatibility verification'
  ];
  if (isSecurityOrAuthChange || criticalInvariantImpacted) {
    recommendedVerification.push('Security invariant verification and session/auth regression check');
  }
  if (affectedPages.size > 0) {
    recommendedVerification.push('WCAG 2.1 AA accessibility and UI regression scan');
  }

  const rationale =
    totalGraphMatches > 0
      ? `Graph and traceability analysis for '${target}' matched ${affectedModules.size} module(s), ${affectedApis.size} API(s), ${affectedPages.size} page(s), ${affectedEntities.size} entity(ies), and ${affectedDecisions.size} decision(s). Risk assessed as ${risk} (confidence: ${confidence}).`
      : `No matching architecture graph nodes found in repository for '${target}' (graph completeness: ${graph.completeness}). Risk assessed as ${risk} using invariant/keyword fallback with low confidence (${confidence}); no nonexistent modules, APIs, or tables were fabricated.`;

  return ChangeImpactAssessmentSchema.parse({
    target,
    proposedChange,
    affectedRequirements: Array.from(affectedRequirements),
    affectedModules: Array.from(affectedModules),
    affectedApis: Array.from(affectedApis),
    affectedPages: Array.from(affectedPages),
    affectedEntities: Array.from(affectedEntities),
    affectedTests: Array.from(affectedTests),
    affectedDecisions: Array.from(affectedDecisions),
    risk,
    confidence,
    evidenceSources: Array.from(evidenceSources),
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
// 10. Knowledge Synchronization & Conflicts (Sections 25, 26 — Generalized)
// =========================================================================

export function detectKnowledgeConflicts(
  baseDir: string,
  actualCodeFacts?: {
    databaseEngine?: string;
    authStrategy?: string;
    installedPackages?: string[];
    implementedRoutes?: string[];
    implementedApis?: string[];
    implementedEntities?: string[];
  }
): KnowledgeSyncResult {
  const rootDir = getProjectIntelligencePath(baseDir);
  const conflicts: KnowledgeConflict[] = [];
  const findings: string[] = [];

  const discovered = discoverRepositoryArtifacts(baseDir);

  // Discover package.json dependencies if present in baseDir
  let repoPackages: string[] = actualCodeFacts?.installedPackages ? [...actualCodeFacts.installedPackages] : [];
  let inferredDbEngineFromPkg: string | undefined;
  const pkgJsonPath = path.join(baseDir, 'package.json');
  if (fs.existsSync(pkgJsonPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
      const allDeps = Object.keys({ ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) });
      repoPackages = Array.from(new Set([...repoPackages, ...allDeps]));
      if (allDeps.some(d => d.includes('sqlite') || d === 'better-sqlite3')) inferredDbEngineFromPkg = 'SQLite';
      else if (allDeps.some(d => d === 'pg' || d.includes('postgres'))) inferredDbEngineFromPkg = 'PostgreSQL';
      else if (allDeps.some(d => d.includes('mysql'))) inferredDbEngineFromPkg = 'MySQL';
      else if (allDeps.some(d => d.includes('mongoose') || d.includes('mongodb'))) inferredDbEngineFromPkg = 'MongoDB';
    } catch (_) {}
  }

  const effectiveDbEngine = actualCodeFacts?.databaseEngine || inferredDbEngineFromPkg;

  // 1. Generalized Accepted ADR vs Actual Implementation (DB engine, Auth strategy, Packages, Stale Supersedes)
  const decisionsDir = path.join(rootDir, 'decisions');
  const loadedDecisions: DecisionRecord[] = [];
  if (fs.existsSync(decisionsDir)) {
    const files = fs.readdirSync(decisionsDir).filter(f => f.endsWith('.json'));
    for (const f of files) {
      try {
        const dec: DecisionRecord = JSON.parse(fs.readFileSync(path.join(decisionsDir, f), 'utf-8'));
        loadedDecisions.push(dec);
      } catch (_) {}
    }
  }

  const knownDecisionIds = new Set(loadedDecisions.map(d => d.id));
  const dbEngines = [
    { key: 'postgresql', canonical: 'PostgreSQL', aliases: ['postgresql', 'postgres'] },
    { key: 'sqlite', canonical: 'SQLite', aliases: ['sqlite', 'sqlite3', 'better-sqlite3'] },
    { key: 'mysql', canonical: 'MySQL', aliases: ['mysql', 'mariadb'] },
    { key: 'mongodb', canonical: 'MongoDB', aliases: ['mongodb', 'mongoose'] },
    { key: 'mssql', canonical: 'SQL Server', aliases: ['mssql', 'sqlserver'] }
  ];

  for (const dec of loadedDecisions) {
    if (dec.supersedes && !knownDecisionIds.has(dec.supersedes)) {
      conflicts.push({
        id: `CONF-STALE-ADR-${dec.id}`,
        recordA: { type: 'ADR', id: dec.id, supersedes: dec.supersedes },
        recordB: { type: 'MISSING_ADR', id: dec.supersedes },
        conflictType: 'STALE_REFERENCE',
        severity: 'MEDIUM',
        recommendedResolution: `Update or remove broken supersedes reference '${dec.supersedes}' in ADR '${dec.id}'.`
      });
      findings.push(`Stale Reference: ADR ${dec.id} supersedes '${dec.supersedes}', which does not exist.`);
    }

    if (dec.status !== 'ACCEPTED') continue;

    const decisionOnlyLower = dec.decision.toLowerCase();

    // Check database engine contradiction against effectiveDbEngine
    if (effectiveDbEngine) {
      const codeDbLower = effectiveDbEngine.toLowerCase();
      const codeDbEntry = dbEngines.find(e => e.aliases.some(a => codeDbLower.includes(a)));
      // Determine which DB engine the ADR decision adopts (looking for target adoption in dec.decision)
      // When migrating "from X to Y", Y is the adopted engine
      const migrateMatch = decisionOnlyLower.match(/to\s+(postgresql|postgres|sqlite|mysql|mongodb|mssql)/i);
      const adoptedEngine = migrateMatch
        ? dbEngines.find(e => e.aliases.includes(migrateMatch[1].toLowerCase()))
        : dbEngines.find(e => e.aliases.some(a => decisionOnlyLower.includes(a)));

      if (adoptedEngine && codeDbEntry && adoptedEngine.key !== codeDbEntry.key) {
        conflicts.push({
          id: `CONF-DB-${dec.id}`,
          recordA: { type: 'ADR', id: dec.id, value: adoptedEngine.canonical },
          recordB: { type: 'CODE', file: 'database.config', value: codeDbEntry.canonical },
          conflictType: 'DECISION_VS_IMPLEMENTATION',
          severity: 'HIGH',
          recommendedResolution: `Align code configuration (${codeDbEntry.canonical}) with accepted ADR ${dec.id} (${adoptedEngine.canonical}) or record an updated ADR superseding ${ adoptedEngine.canonical }.`
        });
        findings.push(`Conflict: ADR ${dec.id} accepted ${adoptedEngine.canonical}, but code implements ${codeDbEntry.canonical}.`);
      }
    }

    // Check auth strategy contradiction against ADR
    if (actualCodeFacts?.authStrategy) {
      const codeAuthLower = actualCodeFacts.authStrategy.toLowerCase();
      if (
        (decisionOnlyLower.includes('httponly') || decisionOnlyLower.includes('session cookie')) &&
        (codeAuthLower.includes('jwt') || codeAuthLower.includes('basic') || codeAuthLower.includes('none'))
      ) {
        conflicts.push({
          id: `CONF-AUTH-ADR-${dec.id}`,
          recordA: { type: 'ADR', id: dec.id, decision: dec.decision },
          recordB: { type: 'CODE', authStrategy: actualCodeFacts.authStrategy },
          conflictType: 'DECISION_VS_IMPLEMENTATION',
          severity: 'HIGH',
          recommendedResolution: `Align authentication implementation (${actualCodeFacts.authStrategy}) with accepted ADR ${dec.id}.`
        });
        findings.push(`Conflict: ADR ${dec.id} mandates cookie/session security, but code implements ${actualCodeFacts.authStrategy}.`);
      }
    }
  }

  // 2. Invariant vs Verification / Config State
  const invariantsPath = path.join(rootDir, 'invariants.json');
  let loadedInvariants: ProjectInvariant[] = [];
  if (fs.existsSync(invariantsPath)) {
    try {
      loadedInvariants = JSON.parse(fs.readFileSync(invariantsPath, 'utf-8'));
      for (const inv of loadedInvariants) {
        if (
          actualCodeFacts?.authStrategy &&
          (actualCodeFacts.authStrategy === 'UNPROTECTED_BASIC' || actualCodeFacts.authStrategy === 'NONE') &&
          inv.category === 'SECURITY'
        ) {
          conflicts.push({
            id: 'CONF-AUTH-INVARIANT',
            recordA: inv,
            recordB: { type: 'CODE', authStrategy: actualCodeFacts.authStrategy },
            conflictType: 'DECISION_VS_IMPLEMENTATION',
            severity: 'CRITICAL',
            recommendedResolution: 'Restore CSRF and secure cookie session protection to satisfy security invariant.'
          });
          findings.push(`Conflict: Implementation uses ${actualCodeFacts.authStrategy} violating security invariant ${inv.id}.`);
        }

        if (!inv.verificationMethod || inv.verificationMethod.trim().length === 0 || inv.verificationMethod === 'NONE') {
          conflicts.push({
            id: `CONF-INV-UNVERIFIED-${inv.id}`,
            recordA: inv,
            recordB: { type: 'VERIFICATION_CONFIG', verificationMethod: inv.verificationMethod || 'NONE' },
            conflictType: 'INVARIANT_VS_VERIFICATION',
            severity: 'HIGH',
            recommendedResolution: `Assign a valid verificationMethod and test suite to invariant '${inv.id}'.`
          });
          findings.push(`Conflict: Invariant ${inv.id} has no verification method.`);
        }
      }
    } catch (_) {}
  }

  // 3. Requirement vs Implementation
  const reqDir = path.join(rootDir, 'requirements');
  if (fs.existsSync(reqDir)) {
    const reqFiles = fs.readdirSync(reqDir).filter(f => f.endsWith('.json'));
    const effectiveApis = actualCodeFacts?.implementedApis || discovered.apis;
    const effectiveRoutes = actualCodeFacts?.implementedRoutes || discovered.pages;
    for (const rf of reqFiles) {
      try {
        const reqData = JSON.parse(fs.readFileSync(path.join(reqDir, rf), 'utf-8'));
        const reqList = Array.isArray(reqData) ? reqData : (reqData.functionalRequirements || [reqData]);
        for (const req of reqList) {
          if (req.requiredApi && effectiveApis.length > 0 && !effectiveApis.includes(req.requiredApi)) {
            conflicts.push({
              id: `CONF-REQ-API-${req.id}`,
              recordA: { type: 'REQUIREMENT', id: req.id, requiredApi: req.requiredApi },
              recordB: { type: 'CODE_APIS', implementedApis: effectiveApis },
              conflictType: 'REQUIREMENT_VS_IMPLEMENTATION',
              severity: 'HIGH',
              recommendedResolution: `Implement required API endpoint '${req.requiredApi}' for requirement '${req.id}'.`
            });
            findings.push(`Conflict: Requirement ${req.id} requires API '${req.requiredApi}', which is missing from implementation.`);
          }
          if (req.requiredRoute && effectiveRoutes.length > 0 && !effectiveRoutes.includes(req.requiredRoute)) {
            conflicts.push({
              id: `CONF-REQ-ROUTE-${req.id}`,
              recordA: { type: 'REQUIREMENT', id: req.id, requiredRoute: req.requiredRoute },
              recordB: { type: 'CODE_ROUTES', implementedRoutes: effectiveRoutes },
              conflictType: 'REQUIREMENT_VS_IMPLEMENTATION',
              severity: 'MEDIUM',
              recommendedResolution: `Implement required route '${req.requiredRoute}' for requirement '${req.id}'.`
            });
            findings.push(`Conflict: Requirement ${req.id} requires route '${req.requiredRoute}', which is missing from implementation.`);
          }
        }
      } catch (_) {}
    }
  }

  // 4. Business Rule vs Missing Test / Enforcement
  const rulesPath = path.join(rootDir, 'knowledge', 'business-rules.json');
  if (fs.existsSync(rulesPath)) {
    try {
      const rules: BusinessRuleRecord[] = JSON.parse(fs.readFileSync(rulesPath, 'utf-8'));
      for (const rule of rules) {
        if (rule.tests && rule.tests.length > 0) {
          for (const testRef of rule.tests) {
            const testAbs = path.join(baseDir, testRef);
            if (!fs.existsSync(testAbs)) {
              conflicts.push({
                id: `CONF-BR-TEST-${rule.ruleId}`,
                recordA: { type: 'BUSINESS_RULE', ruleId: rule.ruleId, test: testRef },
                recordB: { type: 'FILESYSTEM', exists: false },
                conflictType: 'BUSINESS_RULE_VS_IMPLEMENTATION',
                severity: 'MEDIUM',
                recommendedResolution: `Create missing test file '${testRef}' referenced by business rule '${rule.ruleId}'.`
              });
              findings.push(`Conflict: Business rule ${rule.ruleId} references nonexistent test '${testRef}'.`);
            }
          }
        }
      }
    } catch (_) {}
  }

  // 5. Living Docs vs Structured JSON Records (DOC_VS_DOC / CODE_VS_DOC)
  const decisionsMdPath = path.join(rootDir, 'DECISIONS.md');
  if (fs.existsSync(decisionsMdPath) && loadedDecisions.length > 0) {
    const mdContent = fs.readFileSync(decisionsMdPath, 'utf-8');
    for (const dec of loadedDecisions) {
      if (!mdContent.includes(dec.id)) {
        conflicts.push({
          id: `CONF-DOC-ADR-${dec.id}`,
          recordA: { type: 'ADR_JSON', id: dec.id, status: dec.status },
          recordB: { type: 'LIVING_DOC', file: 'DECISIONS.md', missingId: dec.id },
          conflictType: 'DOC_VS_DOC',
          severity: 'MEDIUM',
          recommendedResolution: `Regenerate DECISIONS.md using generateLivingDocuments so ADR '${dec.id}' is synchronized.`
        });
        findings.push(`Conflict: DECISIONS.md is out of sync (missing ${dec.id}).`);
      } else if (dec.status === 'SUPERSEDED' && mdContent.includes(`## ${dec.id}`) && !mdContent.includes('`SUPERSEDED`')) {
        conflicts.push({
          id: `CONF-DOC-STATUS-${dec.id}`,
          recordA: { type: 'ADR_JSON', id: dec.id, status: 'SUPERSEDED' },
          recordB: { type: 'LIVING_DOC', file: 'DECISIONS.md', status: 'STALE' },
          conflictType: 'DOC_VS_DOC',
          severity: 'MEDIUM',
          recommendedResolution: `Regenerate DECISIONS.md to reflect SUPERSEDED status for '${dec.id}'.`
        });
        findings.push(`Conflict: DECISIONS.md shows stale status for superseded ADR ${dec.id}.`);
      }
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
// 12. Knowledge Health & Living Documents (Section 24 — Real Calculation)
// =========================================================================

export function evaluateProjectKnowledgeHealth(baseDir: string): ProjectKnowledgeHealth {
  const rootDir = getProjectIntelligencePath(baseDir);
  const manifestPath = path.join(rootDir, 'manifest.json');

  const freshnessMap: Record<Freshness, number> = {
    CURRENT: 0,
    POSSIBLY_STALE: 0,
    STALE: 0,
    SUPERSEDED: 0,
    UNKNOWN: 0
  };

  // If project intelligence is not initialized at all -> NOT_INITIALIZED, 0% coverage
  if (!baseDir || !fs.existsSync(manifestPath)) {
    return ProjectKnowledgeHealthSchema.parse({
      coveragePercentage: 0,
      freshnessDistribution: freshnessMap,
      conflictCount: 0,
      verificationDebtCount: 0,
      orphanRequirements: [],
      orphanDecisions: [],
      staleDocs: [],
      unknownInvariants: [],
      healthStatus: 'NOT_INITIALIZED'
    });
  }

  const orphanRequirements: string[] = [];
  const orphanDecisions: string[] = [];
  const staleDocs: string[] = [];
  const unknownInvariants: string[] = [];

  let memoryRecordCount = 0;
  let decisionCount = 0;
  let acceptedDecisionCount = 0;
  let verifiedBusinessRuleCount = 0;
  let unverifiedBusinessRuleCount = 0;
  let requirementCount = 0;

  // 1. Inspect memory records
  const knowledgeDir = path.join(rootDir, 'knowledge');
  if (fs.existsSync(knowledgeDir)) {
    const files = fs
      .readdirSync(knowledgeDir)
      .filter(f => f.endsWith('.json') && !f.includes('business-rules') && !f.includes('improvement-candidates'));
    for (const f of files) {
      try {
        const item: ProjectMemoryRecord = JSON.parse(fs.readFileSync(path.join(knowledgeDir, f), 'utf-8'));
        memoryRecordCount++;
        const fKey = (item.freshness || 'CURRENT') as Freshness;
        freshnessMap[fKey] = (freshnessMap[fKey] || 0) + 1;
      } catch (_) {}
    }
  }

  // 2. Inspect business rules
  const rulesPath = path.join(knowledgeDir, 'business-rules.json');
  if (fs.existsSync(rulesPath)) {
    try {
      const rules: BusinessRuleRecord[] = JSON.parse(fs.readFileSync(rulesPath, 'utf-8'));
      for (const r of rules) {
        if (r.status === 'VERIFIED') verifiedBusinessRuleCount++;
        else if (r.status === 'UNVERIFIED') unverifiedBusinessRuleCount++;
      }
    } catch (_) {}
  }

  // 3. Inspect decisions
  const decisionsDir = path.join(rootDir, 'decisions');
  if (fs.existsSync(decisionsDir)) {
    const files = fs.readdirSync(decisionsDir).filter(f => f.endsWith('.json'));
    for (const f of files) {
      try {
        const dec: DecisionRecord = JSON.parse(fs.readFileSync(path.join(decisionsDir, f), 'utf-8'));
        decisionCount++;
        if (dec.status === 'SUPERSEDED') {
          freshnessMap.SUPERSEDED = (freshnessMap.SUPERSEDED || 0) + 1;
        } else {
          if (dec.status === 'ACCEPTED') acceptedDecisionCount++;
          freshnessMap.CURRENT = (freshnessMap.CURRENT || 0) + 1;
          const hasTrace =
            (dec.requirements && dec.requirements.length > 0) ||
            (dec.affectedComponents && dec.affectedComponents.length > 0) ||
            (dec.evidence && dec.evidence.length > 0) ||
            Boolean(dec.context && dec.decision);
          if (!hasTrace) {
            orphanDecisions.push(dec.id);
          }
        }
      } catch (_) {}
    }
  }

  // 4. Inspect requirements directory
  const reqDir = path.join(rootDir, 'requirements');
  if (fs.existsSync(reqDir)) {
    const reqFiles = fs.readdirSync(reqDir).filter(f => f.endsWith('.json'));
    requirementCount = reqFiles.length;
  }

  // 5. Inspect architecture graph
  const archGraph = buildProjectArchitectureGraph(baseDir);

  // If initialized on an empty project with zero recorded decisions, rules, memory records, requirements, or discovered repo nodes -> INSUFFICIENT_DATA, 0%
  const totalMeaningfulRecords =
    memoryRecordCount +
    decisionCount +
    verifiedBusinessRuleCount +
    unverifiedBusinessRuleCount +
    requirementCount +
    archGraph.nodes.length;

  if (totalMeaningfulRecords === 0) {
    return ProjectKnowledgeHealthSchema.parse({
      coveragePercentage: 0,
      freshnessDistribution: freshnessMap,
      conflictCount: 0,
      verificationDebtCount: 0,
      orphanRequirements,
      orphanDecisions,
      staleDocs,
      unknownInvariants,
      healthStatus: 'INSUFFICIENT_DATA'
    });
  }

  // 6. Check invariants and test file existence
  let totalInvariants = 0;
  let verifiedInvariants = 0;
  const invPath = path.join(rootDir, 'invariants.json');
  if (fs.existsSync(invPath)) {
    try {
      const invs: ProjectInvariant[] = JSON.parse(fs.readFileSync(invPath, 'utf-8'));
      totalInvariants = invs.length;
      for (const inv of invs) {
        const hasTests = Array.isArray(inv.relatedTests) && inv.relatedTests.length > 0;
        const hasVerificationMethod = Boolean(
          inv.verificationMethod &&
          inv.verificationMethod !== 'NONE' &&
          inv.verificationMethod.trim().length > 0
        );
        if (!hasTests && !hasVerificationMethod) {
          unknownInvariants.push(inv.id);
        } else {
          verifiedInvariants++;
        }
      }
    } catch (_) {}
  }

  // 7. Check conflicts & stale docs
  const conflictSync = detectKnowledgeConflicts(baseDir);
  const conflictCount = conflictSync.conflicts.length;
  for (const c of conflictSync.conflicts) {
    if (c.conflictType === 'DOC_VS_DOC' || c.conflictType === 'CODE_VS_DOC') {
      staleDocs.push(c.id);
    }
  }

  const verificationDebtCount = unverifiedBusinessRuleCount + unknownInvariants.length;

  // 8. Compute real coveragePercentage across project intelligence dimensions (0..100)
  let coverageScore = 15; // Base for valid manifest + profile + constraints
  if (acceptedDecisionCount > 0) coverageScore += 25;
  if (verifiedBusinessRuleCount > 0 || requirementCount > 0) coverageScore += 25;
  else if (unverifiedBusinessRuleCount > 0) coverageScore += 10;

  if (archGraph.completeness === 'COMPLETE') coverageScore += 20;
  else if (archGraph.completeness === 'PARTIAL') coverageScore += 12;

  if (totalInvariants > 0 && verifiedInvariants === totalInvariants) coverageScore += 15;
  else if (verifiedInvariants > 0) coverageScore += 8;

  // Deductions for conflicts, stale docs, and orphans
  coverageScore -= conflictCount * 15;
  coverageScore -= staleDocs.length * 10;
  coverageScore -= orphanDecisions.length * 5;

  const coveragePercentage = Math.max(0, Math.min(100, Math.round(coverageScore)));

  let healthStatus: ProjectKnowledgeHealth['healthStatus'] = 'NEEDS_ATTENTION';
  if (conflictSync.conflicts.some((c: KnowledgeConflict) => c.severity === 'CRITICAL') || coveragePercentage < 30) {
    healthStatus = 'CRITICAL';
  } else if (conflictCount > 0 || staleDocs.length > 0 || coveragePercentage < 60) {
    healthStatus = 'NEEDS_ATTENTION';
  } else if (coveragePercentage >= 80 && unknownInvariants.length === 0) {
    healthStatus = 'EXCELLENT';
  } else {
    healthStatus = 'GOOD';
  }

  return ProjectKnowledgeHealthSchema.parse({
    coveragePercentage,
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
