import {
  ExistingProjectProfile,
  ExistingProjectProfileSchema,
  BehavioralBaseline,
  BehavioralBaselineSchema,
  ChangeClassification,
  ChangeClassificationSchema,
  ChangeDecision,
  ModernizationStrategyDecision,
  ModernizationStrategyDecisionSchema,
  ModernizationStrategyType,
  ModernizationScope,
  ModernizationScopeSchema,
  PreservationContract,
  PreservationContractSchema,
  ModernizationIntent,
  ModernizationIntentSchema,
  BaselineQualityProfile,
  BaselineQualityProfileSchema,
  ModernizationStage,
  ModernizationStageSchema,
  ModernizationPlan,
  ModernizationPlanSchema,
  DesignDirectionCandidate,
  DesignDirectionWorkflow,
  DesignDirectionWorkflowSchema,
  DependencyProposal,
  DependencyGovernanceResult,
  DependencyGovernanceResultSchema,
  LegacyFileCategory,
  LegacyProtectionResult,
  LegacyProtectionResultSchema,
  ModernizationCompletionContract,
  ModernizationCompletionContractSchema,
  ProjectMode,
  ProjectModeTransition,
  ProjectModeTransitionSchema,
  CheckpointPlan
} from './types.js';

// =========================================================================
// 1. Existing Project Profiler (Section 2)
// =========================================================================

export interface ProfileExistingProjectInput {
  rootDir: string;
  files: Array<{ path: string; content?: string }>;
  projectIdentity?: {
    name?: string;
    rootDir?: string;
    repositoryUrl?: string;
    owner?: string;
  };
}

export function profileExistingProject(input: ProfileExistingProjectInput): ExistingProjectProfile {
  const files = input.files || [];
  const rootDir = input.rootDir || '.';
  const paths = files.map(f => f.path.replace(/\\/g, '/').toLowerCase());

  // Stack & Language heuristics
  const languages = new Set<string>();
  const frameworks = new Set<string>();
  const packageManagers = new Set<string>();
  let primaryStack = 'Generic Web';
  let templateEngine = 'Standard HTML';

  // Package managers
  if (paths.some(p => p.endsWith('pnpm-lock.yaml'))) packageManagers.add('pnpm');
  if (paths.some(p => p.endsWith('package-lock.json'))) packageManagers.add('npm');
  if (paths.some(p => p.endsWith('yarn.lock'))) packageManagers.add('yarn');
  if (paths.some(p => p.endsWith('composer.json') || p.endsWith('composer.lock'))) packageManagers.add('composer');
  if (paths.some(p => p.endsWith('.csproj') || p.endsWith('.sln'))) packageManagers.add('nuget');

  // File extension checks
  for (const f of files) {
    const p = f.path.replace(/\\/g, '/').toLowerCase();
    if (p.endsWith('.ts') || p.endsWith('.tsx')) {
      languages.add('TypeScript');
    } else if (p.endsWith('.js') || p.endsWith('.jsx') || p.endsWith('.mjs')) {
      languages.add('JavaScript');
    } else if (p.endsWith('.php')) {
      languages.add('PHP');
    } else if (p.endsWith('.cs')) {
      languages.add('C#');
    } else if (p.endsWith('.html') || p.endsWith('.htm')) {
      languages.add('HTML');
    }

    if (p.endsWith('.blade.php')) {
      templateEngine = 'Blade';
      frameworks.add('Laravel');
    } else if (p.endsWith('.cshtml') || p.endsWith('.razor')) {
      templateEngine = 'Razor / Blazor';
      frameworks.add('ASP.NET Core');
    } else if (p.endsWith('.jsx') || p.endsWith('.tsx')) {
      frameworks.add('React');
      templateEngine = 'React JSX/TSX';
    }
  }

  // Scan package.json / composer.json if present
  const pkgFile = files.find(f => f.path.toLowerCase().endsWith('package.json'));
  if (pkgFile && pkgFile.content) {
    if (pkgFile.content.includes('"react"')) frameworks.add('React');
    if (pkgFile.content.includes('"vue"')) frameworks.add('Vue');
    if (pkgFile.content.includes('"next"')) frameworks.add('Next.js');
    if (pkgFile.content.includes('"express"')) frameworks.add('Express');
    if (pkgFile.content.includes('"tailwindcss"')) frameworks.add('Tailwind');
    if (pkgFile.content.includes('"bootstrap"')) frameworks.add('Bootstrap');
  }

  const composerFile = files.find(f => f.path.toLowerCase().endsWith('composer.json'));
  if (composerFile && composerFile.content) {
    languages.add('PHP');
    if (composerFile.content.includes('"laravel/framework"')) {
      frameworks.add('Laravel');
      templateEngine = 'Blade';
    }
  }

  if (frameworks.has('React')) {
    primaryStack = languages.has('TypeScript') ? 'React + TypeScript' : 'React (JavaScript)';
  } else if (frameworks.has('Laravel')) {
    primaryStack = 'Laravel (Blade)';
  } else if (frameworks.has('ASP.NET Core')) {
    primaryStack = 'ASP.NET Core (Razor)';
  } else if (languages.has('PHP')) {
    primaryStack = 'Native PHP';
  } else if (languages.has('TypeScript')) {
    primaryStack = 'Node.js + TypeScript';
  }

  // Architecture style
  let architectureStyle = 'MONOLITH';
  if (paths.some(p => p.includes('docker-compose')) && paths.some(p => p.includes('services/'))) {
    architectureStyle = 'MICROSERVICES';
  } else if (paths.some(p => p.includes('client/') || p.includes('frontend/')) && paths.some(p => p.includes('server/') || p.includes('api/'))) {
    architectureStyle = 'SPA_API';
  } else if (paths.some(p => p.includes('modules/') || p.includes('packages/'))) {
    architectureStyle = 'MODULAR_MONOLITH';
  } else if (paths.some(p => p.includes('controllers/') && (p.includes('views/') || p.includes('models/')))) {
    architectureStyle = 'LAYERED';
  }

  // Styling system
  const usesTailwind = paths.some(p => p.includes('tailwind')) || files.some(f => f.content?.includes('@tailwind'));
  const usesBootstrap = paths.some(p => p.includes('bootstrap')) || files.some(f => f.content?.includes('bootstrap') || f.content?.includes('container-fluid'));
  const usesScss = paths.some(p => p.endsWith('.scss') || p.endsWith('.sass'));
  const usesCssVars = files.some(f => f.content?.includes('--'));
  const customCssFiles = files.filter(f => f.path.toLowerCase().endsWith('.css')).length;

  let primaryStyling = 'CSS Custom Properties';
  const legacyFrameworks: string[] = [];
  if (usesBootstrap) {
    legacyFrameworks.push('Bootstrap');
    primaryStyling = 'Bootstrap';
  }
  if (usesTailwind) {
    primaryStyling = 'Tailwind CSS';
  }

  // Auth heuristics
  let authType = 'COOKIE_SESSION';
  let sessionStrategy = 'SERVER_STATE';
  let tokenStorage = 'HTTP_ONLY_COOKIE';
  let hasCsrf = false;

  for (const f of files) {
    const c = f.content || '';
    if (c.includes('jwt') || c.includes('Bearer ') || c.includes('jsonwebtoken')) {
      authType = 'JWT_BEARER';
      tokenStorage = 'LOCAL_STORAGE_OR_COOKIE';
    }
    if (c.includes('csrf') || c.includes('_token') || c.includes('csrf_token') || c.includes('ValidateAntiForgeryToken')) {
      hasCsrf = true;
    }
    if (c.includes('session(') || c.includes('req.session') || c.includes('HttpContext.Session')) {
      sessionStrategy = 'STATEFUL_SESSION';
    }
  }

  // Routing heuristics
  let routingType: 'FILE_BASED' | 'CODE_CONFIGURED' | 'SERVER_ROUTED' | 'CLIENT_ROUTED' = 'SERVER_ROUTED';
  if (paths.some(p => p.includes('pages/') || p.includes('app/page.'))) {
    routingType = 'FILE_BASED';
  } else if (paths.some(p => p.includes('router') || p.includes('routes/web.php') || p.includes('routes/api.php'))) {
    routingType = 'CODE_CONFIGURED';
  }

  // Critical routes & APIs
  const criticalRoutes: ExistingProjectProfile['criticalRoutes'] = [];
  const criticalApis: ExistingProjectProfile['criticalApis'] = [];
  const criticalDb: ExistingProjectProfile['criticalDatabaseBehaviors'] = [];

  for (const f of files) {
    const c = f.content || '';
    // Express / Controller routes
    const routeMatches = c.matchAll(/(?:router|app)\.(get|post|put|delete)\(['"]([^'"]+)['"]/gi);
    for (const m of routeMatches) {
      if (m[1] && m[2]) {
        criticalRoutes.push({
          method: m[1].toUpperCase(),
          path: m[2],
          purpose: `Endpoint handler defined in ${f.path}`,
          accessLevel: m[2].includes('admin') || m[2].includes('dashboard') ? 'AUTHENTICATED' : 'PUBLIC'
        });
      }
    }

    // Database tables
    const tableMatches = c.matchAll(/create_table\s*\(?['"]([^'"]+)['"]|CREATE TABLE (?:IF NOT EXISTS )?`?([a-zA-Z0-9_]+)`?/gi);
    for (const m of tableMatches) {
      const tbl = m[1] || m[2];
      if (tbl) {
        criticalDb.push({
          table: tbl,
          invariant: 'Primary key integrity and foreign relation constraints intact',
          dataIntegrityRule: 'Referential integrity must be preserved without orphan records'
        });
      }
    }
  }

  // Build / Test heuristics
  const hasUnitTests = paths.some(p => p.includes('.test.') || p.includes('.spec.') || p.includes('test_'));
  const hasDockerfile = paths.some(p => p.endsWith('dockerfile'));
  const hasCompose = paths.some(p => p.includes('docker-compose'));

  // Debt Heuristics (explicitly marked with heuristic scoring)
  const technicalDebt: ExistingProjectProfile['technicalDebt'] = [];
  const visualDebt: ExistingProjectProfile['visualDebt'] = [];
  const uxDebt: ExistingProjectProfile['uxDebt'] = [];
  const securityDebt: ExistingProjectProfile['securityDebt'] = [];
  const performanceDebt: ExistingProjectProfile['performanceDebt'] = [];

  if (usesBootstrap && usesTailwind) {
    technicalDebt.push({
      area: 'Styling Architecture',
      severity: 'HIGH',
      description: 'Conflicting CSS frameworks detected (Bootstrap + Tailwind). Introduces specificity conflicts.',
      remediationSuggestion: 'Establish a CSS Scoped Bridge adapter and systematically deprecate legacy Bootstrap.'
    });
  }

  if (customCssFiles > 5 && !usesCssVars) {
    visualDebt.push({
      issue: 'Inconsistent color and spacing definitions across loose CSS files',
      severity: 'MEDIUM',
      location: 'Stylesheets directory',
      heuristicScore: 42
    });
  }

  if (files.some(f => f.content?.includes('style="') || f.content?.includes("style='"))) {
    visualDebt.push({
      issue: 'Hardcoded inline styles scattered in templates/components',
      severity: 'MEDIUM',
      location: 'Template markup',
      heuristicScore: 35
    });
  }

  if (!hasCsrf && authType === 'COOKIE_SESSION') {
    securityDebt.push({
      issue: 'Missing explicit CSRF protection token mechanism in cookie-based session',
      severity: 'HIGH',
      cweId: 'CWE-352',
      remediationSuggestion: 'Implement Anti-CSRF token verification on all mutating endpoints.'
    });
  }

  const profile: ExistingProjectProfile = {
    projectIdentity: {
      name: input.projectIdentity?.name || 'LegacyProject',
      rootDir,
      repositoryUrl: input.projectIdentity?.repositoryUrl,
      owner: input.projectIdentity?.owner
    },
    detectedStack: {
      primaryStack,
      languages: Array.from(languages),
      frameworks: Array.from(frameworks),
      packageManagers: Array.from(packageManagers).length > 0 ? Array.from(packageManagers) : ['npm'],
      templateEngine
    },
    architectureStyle,
    frontendArchitecture: {
      framework: frameworks.has('React') ? 'React' : 'Server-Rendered Templates',
      routing: routingType,
      stateManagement: 'Component Local / Server Session',
      styling: primaryStyling,
      componentModel: templateEngine === 'Blade' ? 'Blade Components' : templateEngine.includes('Razor') ? 'Razor TagHelpers' : 'Templates'
    },
    backendArchitecture: {
      framework: frameworks.has('Laravel') ? 'Laravel' : frameworks.has('ASP.NET Core') ? 'ASP.NET Core' : 'Node.js/Express',
      apiPattern: 'RESTful Controllers',
      runtime: languages.has('PHP') ? 'PHP 8.x' : languages.has('C#') ? '.NET 8+' : 'Node.js 20+',
      serverless: false
    },
    databaseArchitecture: {
      engine: 'Relational (PostgreSQL/MySQL/SQL Server)',
      orm: templateEngine === 'Blade' ? 'Eloquent' : templateEngine.includes('Razor') ? 'Entity Framework Core' : 'Prisma/TypeORM',
      migrationTool: 'Framework Migrations',
      entityCount: criticalDb.length || 4
    },
    authenticationModel: {
      type: authType,
      provider: 'Local Auth / Identity Provider',
      sessionStrategy,
      tokenStorage,
      csrfProtection: hasCsrf
    },
    authorizationModel: {
      type: 'RBAC',
      roles: ['Admin', 'Manager', 'User', 'Guest'],
      permissionsEngine: 'Policy / Middleware Gate'
    },
    routingModel: {
      type: routingType,
      routesCount: criticalRoutes.length || 10
    },
    apiSurface: {
      protocols: ['HTTP/1.1 REST'],
      openApiSpecExists: paths.some(p => p.includes('openapi') || p.includes('swagger')),
      endpointCount: criticalRoutes.length || 10,
      breakingChangeRisk: 'LOW'
    },
    dataAccessModel: {
      pattern: templateEngine === 'Blade' ? 'ACTIVE_RECORD' : 'REPOSITORY',
      directQueriesUsed: files.some(f => f.content?.includes('DB::select') || f.content?.includes('SELECT * FROM'))
    },
    stateManagement: {
      approach: 'SERVER_MANAGED'
    },
    stylingSystem: {
      primary: primaryStyling,
      legacyFrameworks,
      usesUtilityClasses: usesTailwind,
      cssVariablesUsed: usesCssVars,
      scssUsed: usesScss,
      customCssFiles
    },
    componentSystem: {
      type: templateEngine === 'Blade' ? 'BLADE_COMPONENTS' : templateEngine.includes('Razor') ? 'RAZOR_TAGHELPERS' : 'MONOLITHIC_PAGES'
    },
    designTokens: {
      hasTokens: paths.some(p => p.includes('tokens')),
      tokenFormat: paths.some(p => p.includes('tokens.json')) ? 'DTCG JSON' : undefined
    },
    buildSystem: {
      bundler: paths.some(p => p.includes('vite')) ? 'Vite' : paths.some(p => p.includes('webpack')) ? 'Webpack' : 'Native Asset Pipeline',
      scripts: ['build', 'test'],
      outputDir: 'dist'
    },
    testSystem: {
      framework: hasUnitTests ? 'Vitest / Jest / PHPUnit' : 'None Detected',
      hasUnitTests,
      hasE2ETests: paths.some(p => p.includes('playwright') || p.includes('cypress')),
      testCoverageReported: false
    },
    deploymentModel: {
      target: hasDockerfile ? 'Docker Container' : 'Virtual Machine / PaaS',
      ciPipeline: paths.some(p => p.includes('.github/workflows')) ? 'GitHub Actions' : 'None',
      dockerized: hasDockerfile
    },
    dockerModel: {
      hasDockerfile,
      hasCompose,
      multiStage: false
    },
    legacyCharacteristics: [
      usesBootstrap ? 'Coupled to legacy Bootstrap class hierarchy' : 'Legacy CSS classes without design token abstraction',
      'Monolithic views combining business logic with layout markup'
    ],
    technicalDebt,
    visualDebt,
    uxDebt,
    securityDebt,
    performanceDebt,
    criticalBusinessFlows: [
      {
        flowId: 'FLOW_AUTH',
        name: 'Operator Authentication & Session Issuance',
        description: 'Login, credential verification, cookie issuance, and dashboard redirection',
        priority: 'CRITICAL'
      },
      {
        flowId: 'FLOW_CORE_OPERATIONS',
        name: 'Primary Business Entity Management',
        description: 'Read, filter, create, and update core operational records',
        priority: 'HIGH'
      }
    ],
    criticalRoutes: criticalRoutes.length > 0 ? criticalRoutes : [
      { method: 'GET', path: '/login', purpose: 'Authentication entry point', accessLevel: 'PUBLIC' },
      { method: 'POST', path: '/login', purpose: 'Authentication submission handler', accessLevel: 'PUBLIC' },
      { method: 'GET', path: '/dashboard', purpose: 'Primary operator overview', accessLevel: 'AUTHENTICATED' }
    ],
    criticalApis: criticalApis.length > 0 ? criticalApis : [
      { method: 'GET', path: '/api/v1/health', contractType: 'JSON Status Health Contract', schemaValidated: true },
      { method: 'GET', path: '/api/v1/items', contractType: 'JSON List Retrieval Contract', schemaValidated: true }
    ],
    criticalDatabaseBehaviors: criticalDb.length > 0 ? criticalDb : [
      {
        table: 'users',
        invariant: 'Unique email constraint and active status field',
        dataIntegrityRule: 'Password hashes must never be serialized or dropped'
      }
    ]
  };

  return ExistingProjectProfileSchema.parse(profile);
}

// =========================================================================
// 2. Behavioral Baseline Engine (Section 3)
// =========================================================================

export function createBehavioralBaseline(
  files: Array<{ path: string; content?: string }>,
  openApiSpec?: any
): BehavioralBaseline {
  const routes: BehavioralBaseline['routes'] = [];
  const apiContracts: BehavioralBaseline['apiContracts'] = [];
  const authFlows: BehavioralBaseline['authenticationFlows'] = [];
  const authzRules: BehavioralBaseline['authorizationRules'] = [];
  const databaseInvariants: BehavioralBaseline['databaseInvariants'] = [];
  const workflows: BehavioralBaseline['criticalWorkflows'] = [];
  const forms: BehavioralBaseline['forms'] = [];
  const navigationFlows: BehavioralBaseline['navigationFlows'] = [];
  const errorBehaviors: BehavioralBaseline['errorBehavior'] = [];
  const externalIntegrations: BehavioralBaseline['externalIntegrations'] = [];

  for (const file of files) {
    const content = file.content || '';
    const norm = file.path.replace(/\\/g, '/').toLowerCase();

    // 1. Routes (Express, Fastify, Laravel, ASP.NET)
    const expressMatches = content.matchAll(/(?:router|app)\.(get|post|put|delete|patch)\(\s*['"]([^'"]+)['"]/gi);
    for (const m of expressMatches) {
      if (m[1] && m[2]) {
        routes.push({
          method: m[1].toUpperCase(),
          path: m[2],
          handler: `Handler in ${file.path}`,
          authRequired: m[2].includes('admin') || m[2].includes('auth') || m[2].includes('dashboard'),
          parameters: []
        });
      }
    }

    const laravelMatches = content.matchAll(/Route::(get|post|put|delete|patch)\(\s*['"]([^'"]+)['"]/gi);
    for (const m of laravelMatches) {
      if (m[1] && m[2]) {
        routes.push({
          method: m[1].toUpperCase(),
          path: m[2],
          handler: `Laravel route in ${file.path}`,
          authRequired: content.includes('middleware') && content.includes('auth'),
          parameters: []
        });
      }
    }

    // 2. Auth Flow detection
    if (/login|authenticate|signin/i.test(content) && (/password/i.test(content) || /token/i.test(content))) {
      authFlows.push({
        flowId: `AUTH_FLOW_${authFlows.length + 1}`,
        type: content.includes('jwt') ? 'JWT_TOKEN' : 'SESSION_COOKIE',
        entryPoint: '/login',
        redirectTarget: '/dashboard',
        sessionMechanism: content.includes('jwt') ? 'BEARER_TOKEN' : 'HTTP_ONLY_COOKIE',
        csrfTokenRequired: content.includes('csrf') || content.includes('_token')
      });
    }

    // 3. Authorization Rules
    if (/hasRole|can\(|Authorize|permission/i.test(content)) {
      authzRules.push({
        resource: file.path,
        action: 'EXECUTE',
        allowedRoles: ['Admin', 'Manager'],
        condition: 'Must possess active authenticated session with appropriate role claims'
      });
    }

    // 4. Forms
    if (content.includes('<form') || content.includes('useForm') || content.includes('Form::')) {
      const fieldMatches = Array.from(content.matchAll(/name=['"]([a-zA-Z0-9_]+)['"]/gi)).map(m => m[1] || 'field');
      forms.push({
        formId: `FORM_${norm.split('/').pop()?.replace(/[^a-zA-Z0-9]/g, '_') || 'GENERIC'}`,
        routeOrAction: norm,
        fields: fieldMatches.length > 0 ? Array.from(new Set(fieldMatches)) : ['username', 'password'],
        validationRules: ['Required fields non-empty', 'Format validation before submission'],
        submissionMethod: content.includes('post') ? 'POST' : 'GET'
      });
    }

    // 5. Database invariants
    if (norm.includes('migration') || norm.includes('schema') || norm.includes('.sql')) {
      const tblMatches = content.matchAll(/create_table\s*\(?['"]([^'"]+)['"]|CREATE TABLE (?:IF NOT EXISTS )?`?([a-zA-Z0-9_]+)`?/gi);
      for (const m of tblMatches) {
        const tbl = m[1] || m[2];
        if (tbl) {
          databaseInvariants.push({
            table: tbl,
            invariant: 'Row uniqueness and column non-nullability constraints preserved',
            foreignKeyConstraints: ['Referential integrity to parent entity'],
            uniquenessConstraints: ['PRIMARY KEY (id)']
          });
        }
      }
    }

    // 6. External integrations
    if (/axios\.|fetch\(|Http::|HttpClient/i.test(content)) {
      const urlMatches = content.matchAll(/['"]https?:\/\/([a-zA-Z0-9.-]+)(\/[^'"]*)?['"]/gi);
      for (const m of urlMatches) {
        if (m[1]) {
          externalIntegrations.push({
            integrationId: `INT_${m[1].replace(/[^a-zA-Z0-9]/g, '_')}`,
            serviceName: m[1],
            endpoint: `https://${m[1]}${m[2] || ''}`,
            authMechanism: 'API_KEY_OR_BEARER',
            payloadFormat: 'APPLICATION_JSON'
          });
        }
      }
    }
  }

  // Fallbacks if files are minimal
  if (routes.length === 0) {
    routes.push({
      path: '/',
      method: 'GET',
      handler: 'Default Root Handler',
      authRequired: false
    });
  }

  if (authFlows.length === 0) {
    authFlows.push({
      flowId: 'DEFAULT_AUTH_FLOW',
      type: 'SESSION_COOKIE',
      entryPoint: '/login',
      redirectTarget: '/dashboard',
      sessionMechanism: 'HTTP_ONLY_COOKIE',
      csrfTokenRequired: true
    });
  }

  if (workflows.length === 0) {
    workflows.push({
      workflowId: 'WF_STANDARD_OPERATOR',
      name: 'Standard Operator Journey',
      steps: ['Authenticate', 'Inspect Overview', 'Execute Record Mutation', 'Confirm Outcome'],
      expectedOutcome: 'Record saved with audit log without regression'
    });
  }

  if (errorBehaviors.length === 0) {
    errorBehaviors.push({
      errorType: 'VALIDATION_ERROR',
      statusCode: 422,
      expectedUserMessage: 'Validation failed. Please correct highlighted inputs.',
      rollbackHandling: 'Retain entered form state, highlight invalid fields'
    });
    errorBehaviors.push({
      errorType: 'UNAUTHORIZED_ACCESS',
      statusCode: 401,
      expectedUserMessage: 'Session expired or invalid. Please re-authenticate.',
      rollbackHandling: 'Safe redirect to login preserving intended redirect URL'
    });
  }

  const baseline: BehavioralBaseline = {
    id: `base-${Date.now()}`,
    capturedAt: new Date().toISOString(),
    routes,
    apiContracts,
    authenticationFlows: authFlows,
    authorizationRules: authzRules,
    databaseInvariants,
    criticalWorkflows: workflows,
    forms,
    navigationFlows,
    errorBehavior: errorBehaviors,
    externalIntegrations
  };

  return BehavioralBaselineSchema.parse(baseline);
}

export function compareBehavioralBaselines(
  baseline: BehavioralBaseline,
  candidate: BehavioralBaseline
): {
  passed: boolean;
  regressionsDetected: Array<{ category: string; description: string; severity: 'HIGH' | 'CRITICAL' }>;
  preservedCount: number;
  additions: string[];
} {
  const regressions: Array<{ category: string; description: string; severity: 'HIGH' | 'CRITICAL' }> = [];
  const additions: string[] = [];
  let preservedCount = 0;

  // 1. Verify all baseline routes exist in candidate
  for (const baseRoute of baseline.routes) {
    const cand = candidate.routes.find(r => r.path === baseRoute.path && r.method === baseRoute.method);
    if (!cand) {
      regressions.push({
        category: 'ROUTING_REGRESSION',
        description: `Baseline route [${baseRoute.method}] ${baseRoute.path} missing from candidate.`,
        severity: 'CRITICAL'
      });
    } else {
      preservedCount++;
    }
  }

  // 2. Verify Auth Flows
  for (const baseAuth of baseline.authenticationFlows) {
    const candAuth = candidate.authenticationFlows.find(a => a.flowId === baseAuth.flowId || a.entryPoint === baseAuth.entryPoint);
    if (!candAuth) {
      regressions.push({
        category: 'AUTH_FLOW_REGRESSION',
        description: `Baseline authentication flow '${baseAuth.flowId}' entry point ${baseAuth.entryPoint} dropped.`,
        severity: 'CRITICAL'
      });
    } else if (baseAuth.csrfTokenRequired && !candAuth.csrfTokenRequired) {
      regressions.push({
        category: 'SECURITY_REGRESSION',
        description: `CSRF protection was disabled on candidate auth flow '${baseAuth.flowId}'.`,
        severity: 'CRITICAL'
      });
    } else {
      preservedCount++;
    }
  }

  // 3. Verify Database Invariants
  for (const baseDb of baseline.databaseInvariants) {
    const candDb = candidate.databaseInvariants.find(d => d.table === baseDb.table);
    if (!candDb) {
      regressions.push({
        category: 'DATABASE_INVARIANT_REGRESSION',
        description: `Database table invariant for '${baseDb.table}' missing in candidate.`,
        severity: 'CRITICAL'
      });
    } else {
      preservedCount++;
    }
  }

  // 4. Verify Forms fields preserved
  for (const baseForm of baseline.forms) {
    const candForm = candidate.forms.find(f => f.formId === baseForm.formId || f.routeOrAction === baseForm.routeOrAction);
    if (candForm) {
      for (const field of baseForm.fields) {
        if (!candForm.fields.includes(field)) {
          regressions.push({
            category: 'FORM_FIELD_REGRESSION',
            description: `Field '${field}' in form '${baseForm.formId}' missing after modernization.`,
            severity: 'HIGH'
          });
        }
      }
    }
  }

  return {
    passed: regressions.length === 0,
    regressionsDetected: regressions,
    preservedCount,
    additions
  };
}

// =========================================================================
// 3. Change Classifier Engine (Section 4)
// =========================================================================

export interface ElementClassificationInput {
  targetId: string;
  name: string;
  path: string;
  elementType: ChangeClassification['elementType'];
  proposedDecision?: ChangeDecision;
  reason?: string;
  expectedBenefit?: string;
  migrationCost?: ChangeClassification['migrationCost'];
  dependencies?: string[];
  verification?: string;
}

export function classifyExistingElements(
  elements: ElementClassificationInput[]
): ChangeClassification[] {
  return elements.map(el => {
    let decision = el.proposedDecision || 'KEEP';
    let risk: ChangeClassification['risk'] = 'LOW';
    let reason = el.reason || 'Component functions as designed within existing boundary.';
    let expectedBenefit = el.expectedBenefit || 'Preserves zero-drift stability.';
    let migrationCost = el.migrationCost || 'LOW';
    const dependencies = el.dependencies || [];
    let verification = el.verification || 'Run regression test suite to verify baseline integrity.';

    if (decision === 'REMOVE') {
      // RULE: REMOVE is ALWAYS high or critical risk!
      risk = 'HIGH';
      if (!el.reason) {
        reason = 'High-risk removal of legacy element; requires thorough dead-code proof and zero dependent flows.';
      }
      verification = 'Verify zero references across entire codebase and ensure all unit tests pass with element removed.';
    } else if (decision === 'REPLACE') {
      risk = 'MEDIUM';
      if (!el.reason) {
        reason = 'Replaced with canonical modernized counterpart to reduce technical and visual debt.';
      }
      expectedBenefit = 'Improved accessibility, responsive behavior, and design token integration.';
    } else if (decision === 'IMPROVE') {
      risk = 'LOW';
      if (!el.reason) {
        reason = 'In-place refinement: align colors and spacing with tokens without changing DOM semantics.';
      }
    } else if (decision === 'DEFER') {
      risk = 'LOW';
      if (!el.reason) {
        reason = 'Deferred to subsequent modernization phase to constrain current blast radius.';
      }
    }

    return ChangeClassificationSchema.parse({
      targetId: el.targetId,
      name: el.name,
      path: el.path,
      elementType: el.elementType,
      decision,
      reason,
      risk,
      expectedBenefit,
      migrationCost,
      dependencies,
      verification
    });
  });
}

// =========================================================================
// 4. Modernization Strategy Engine (Section 5)
// =========================================================================

export interface StrategySelectionInput {
  requestedStrategy: ModernizationStrategyType | 'BIG_BANG_REWRITE';
  projectProfile: ExistingProjectProfile;
  explicitUserRequest?: boolean;
  justification?: string;
}

export function selectModernizationStrategy(input: StrategySelectionInput): ModernizationStrategyDecision {
  // RULE: BIG_BANG_REWRITE is forbidden by default.
  // Full rewrite is ONLY possible with explicit user request AND high justification.
  if (input.requestedStrategy === 'BIG_BANG_REWRITE') {
    const hasExplicitRequest = input.explicitUserRequest === true;
    const hasHighJustification = Boolean(input.justification && input.justification.trim().length >= 40);

    if (!hasExplicitRequest || !hasHighJustification) {
      return ModernizationStrategyDecisionSchema.parse({
        strategy: 'BRIDGE',
        rationale: 'BIG_BANG_REWRITE is strictly prohibited by default. Request lacked explicit user authorization or sufficient technical justification (min 40 chars). Auto-falling back to safe BRIDGE strategy.',
        riskAssessment: 'EXTREME',
        bridgeRequired: true,
        bridgeMechanisms: ['Scoped CSS Bridge', 'Token Aliasing', 'Dual-Runtime Isolation'],
        blocked: true,
        blockReason: 'BIG_BANG_REWRITE is blocked by Alper Design OS safety policy. Explicit user authorization and high-severity justification required.'
      });
    }

    return ModernizationStrategyDecisionSchema.parse({
      strategy: 'REBUILD_SHELL',
      rationale: `User provided explicit authorization and justification: "${input.justification}". Approved for controlled shell rebuild under heightened regression surveillance.`,
      riskAssessment: 'HIGH',
      bridgeRequired: true,
      bridgeMechanisms: ['Comprehensive Checkpoint Safeguard', 'Dual-Run Verification'],
      blocked: false
    });
  }

  // Standard safe strategies
  const strategy = input.requestedStrategy as ModernizationStrategyType;
  let riskAssessment: ModernizationStrategyDecision['riskAssessment'] = 'LOW';
  let bridgeRequired = false;
  const bridgeMechanisms: string[] = [];
  let rationale = `Selected strategy '${strategy}' aligned with detected stack ${input.projectProfile.detectedStack.primaryStack}.`;

  if (strategy === 'BRIDGE') {
    bridgeRequired = true;
    bridgeMechanisms.push('CSS Custom Property Bridge', 'Token Compiler Adapter');
    rationale = 'Bridge mode maintains existing markup while injecting modern DTCG design tokens via scoped stylesheets.';
  } else if (strategy === 'ADAPT') {
    bridgeRequired = true;
    bridgeMechanisms.push('Component Adapter Wrappers');
    riskAssessment = 'MEDIUM';
    rationale = 'Adapt strategy wraps legacy elements with canonical interface adapters.';
  } else if (strategy === 'REBUILD_SHELL') {
    riskAssessment = 'HIGH';
    bridgeRequired = true;
    bridgeMechanisms.push('Legacy Content Slot Mount Point');
    rationale = 'Rebuilds the outer layout shell while encapsulating legacy pages within modern framing.';
  } else if (strategy === 'REBUILD_PAGE') {
    riskAssessment = 'MEDIUM';
    rationale = 'Isolates modernization to a single page, preserving global shell and shared backend intact.';
  }

  return ModernizationStrategyDecisionSchema.parse({
    strategy,
    rationale,
    riskAssessment,
    bridgeRequired,
    bridgeMechanisms,
    blocked: false
  });
}

// =========================================================================
// 5. Scope Guard & Boundary Model (Section 6)
// =========================================================================

export const SCOPE_HIERARCHY: Record<ModernizationScope['level'], number> = {
  COMPONENT: 1,
  PAGE: 2,
  FEATURE: 3,
  SHELL: 4,
  MODULE: 5,
  APPLICATION: 6
};

export function evaluateModernizationScopeBoundary(
  declaredScope: ModernizationScope,
  targetFiles: string[]
): {
  isWithinScope: boolean;
  allowedFiles: string[];
  rejectedFiles: string[];
  violations: Array<{ file: string; reason: string }>;
} {
  const allowedFiles: string[] = [];
  const rejectedFiles: string[] = [];
  const violations: Array<{ file: string; reason: string }> = [];

  for (const rawFile of targetFiles) {
    const file = rawFile.replace(/\\/g, '/').toLowerCase();

    // 1. Prohibited check
    const isExplicitlyProhibited = declaredScope.prohibitedPaths.some(p => file.includes(p.toLowerCase()));
    if (isExplicitlyProhibited) {
      rejectedFiles.push(rawFile);
      violations.push({
        file: rawFile,
        reason: `Explicitly listed in prohibited paths for scope level [${declaredScope.level}]`
      });
      continue;
    }

    // 2. Global Shell / Application boundary check
    const isGlobalShellFile =
      file.includes('layout') ||
      file.includes('app.tsx') ||
      file.includes('app.jsx') ||
      file.includes('globals.css') ||
      file.includes('_app.') ||
      file.includes('_layout.');

    if (isGlobalShellFile && !declaredScope.canModifyGlobalShell && declaredScope.level !== 'SHELL' && declaredScope.level !== 'APPLICATION') {
      rejectedFiles.push(rawFile);
      violations.push({
        file: rawFile,
        reason: `Page/Component level scope cannot silently modify global shell file '${rawFile}'. Upgrade scope explicitly.`
      });
      continue;
    }

    // 3. Backend / Database boundary check
    const isBackendOrDb =
      file.includes('migration') ||
      file.includes('schema.sql') ||
      file.includes('/controllers/') ||
      file.includes('/services/') ||
      file.includes('/models/');

    if (isBackendOrDb && !declaredScope.canModifyBackend && !declaredScope.canModifyDatabase) {
      rejectedFiles.push(rawFile);
      violations.push({
        file: rawFile,
        reason: `Backend or Database file '${rawFile}' modified without explicit backend/database permission.`
      });
      continue;
    }

    // 4. Allowed paths check
    const isExplicitlyAllowed = declaredScope.allowedPaths.some(p => file.includes(p.toLowerCase()) || p === '*');
    if (!isExplicitlyAllowed && declaredScope.allowedPaths.length > 0) {
      rejectedFiles.push(rawFile);
      violations.push({
        file: rawFile,
        reason: `File not matched by allowed paths for declared target '${declaredScope.targetName}'.`
      });
      continue;
    }

    allowedFiles.push(rawFile);
  }

  return {
    isWithinScope: violations.length === 0,
    allowedFiles,
    rejectedFiles,
    violations
  };
}

// =========================================================================
// 6. Preservation Contract Engine (Section 7)
// =========================================================================

export function createPreservationContract(input?: Partial<PreservationContract>): PreservationContract {
  const contract: PreservationContract = {
    contractId: input?.contractId || `preservation-${Date.now()}`,
    backendBusinessLogic: input?.backendBusinessLogic || 'MUST_PRESERVE',
    databaseSchema: input?.databaseSchema || 'MUST_PRESERVE',
    apiContract: input?.apiContract || 'MUST_PRESERVE',
    routeContract: input?.routeContract || 'MUST_PRESERVE',
    authentication: input?.authentication || 'MUST_PRESERVE',
    authorization: input?.authorization || 'MUST_PRESERVE',
    externalIntegrations: input?.externalIntegrations || 'MUST_PRESERVE',
    userWorkflows: input?.userWorkflows || 'MUST_PRESERVE',
    dataSemantics: input?.dataSemantics || 'MUST_PRESERVE',
    auditBehavior: input?.auditBehavior || 'MUST_PRESERVE',
    specificInvariants: input?.specificInvariants || {
      database: ['No tables dropped', 'No columns deleted', 'No nullability constraints tightened without default'],
      api: ['Endpoint HTTP methods and routes invariant', 'Request and response JSON payloads backward compatible'],
      auth: ['Session tokens and cookies preserved', 'CSRF mechanisms intact', 'Permission role checks intact']
    },
    allowedBreakingChanges: input?.allowedBreakingChanges || [],
    verificationMethod: input?.verificationMethod || {
      routing: 'compareBehavioralBaselines',
      database: 'detectMigrationRisk',
      api: 'analyzeApiContract'
    }
  };

  return PreservationContractSchema.parse(contract);
}

export function verifyPreservationCompliance(
  contract: PreservationContract,
  proposedChanges: Array<{ targetArea: keyof PreservationContract; changeType: string; isBreaking: boolean; description: string }>
): {
  compliant: boolean;
  violations: string[];
  warnings: string[];
} {
  const violations: string[] = [];
  const warnings: string[] = [];

  for (const change of proposedChanges) {
    const status = contract[change.targetArea];

    if (status === 'MUST_PRESERVE' && change.isBreaking) {
      violations.push(
        `Preservation Violation: Area '${String(change.targetArea)}' is marked MUST_PRESERVE, but proposed change is breaking: "${change.description}"`
      );
    } else if (status === 'SHOULD_PRESERVE' && change.isBreaking) {
      warnings.push(
        `Preservation Warning: Area '${String(change.targetArea)}' is SHOULD_PRESERVE with breaking change: "${change.description}". Review required.`
      );
    }
  }

  return {
    compliant: violations.length === 0,
    violations,
    warnings
  };
}

// =========================================================================
// 7. Modernization Intent Engine (Section 8)
// =========================================================================

export function createModernizationIntent(
  input: Partial<ModernizationIntent>,
  projectProfile?: ExistingProjectProfile
): {
  isValid: boolean;
  intent?: ModernizationIntent;
  rejectionReason?: string;
} {
  const why = input.why?.trim() || '';
  const targetOutcome = input.targetOutcome?.trim() || '';

  // RULE: "Make it modern" alone is NOT acceptable input!
  const isTrivial =
    /^(make it modern|modernize|make modern|make it look nice|ui modernleştir|güzelleştir)$/i.test(why) ||
    why.length < 10;

  if (isTrivial) {
    // If projectProfile is provided, can we supplement it?
    if (projectProfile && projectProfile.technicalDebt.length > 0) {
      // Auto-supplement with project analysis findings
      const supplementedIntent: ModernizationIntent = {
        why: `Modernize legacy presentation layer to resolve identified technical and visual debts in ${projectProfile.projectIdentity.name}.`,
        targetOutcome: `Refactor user interface to modern DTCG design tokens, responsive layout, and accessible interaction patterns while strictly preserving backend logic.`,
        primaryProblems: projectProfile.technicalDebt.map(d => d.description).slice(0, 3),
        userPainPoints: [
          'High cognitive load and inconsistent visual hierarchy',
          'Poor responsive adaptation on smaller viewports'
        ],
        visualGoals: [
          'Unify typography scale to 4px/8px modular rhythm',
          'Establish accessible WCAG 2.1 AA color contrast palette'
        ],
        uxGoals: [
          'Improve operator ergonomics and reduce click depth for primary tasks',
          'Ensure clear feedback for asynchronous operations'
        ],
        technicalGoals: [
          'Introduce DTCG tokens without breaking legacy CSS cascades',
          'Eliminate redundant inline styling'
        ],
        constraints: [
          'Backend business logic must remain 100% untouched',
          'Database schema and migrations must not be modified'
        ],
        forbiddenChanges: [
          'Do not introduce breaking changes to REST endpoints',
          'Do not modify authentication/cookie handling mechanics'
        ],
        successCriteria: [
          'Zero behavioral regressions in existing test suite',
          'WCAG 2.1 AA automated audit compliance'
        ]
      };
      return {
        isValid: true,
        intent: ModernizationIntentSchema.parse(supplementedIntent)
      };
    }

    return {
      isValid: false,
      rejectionReason: "Vague intent: 'Make it modern' alone is not acceptable input. Specific problems, pain points, and measurable success criteria are required."
    };
  }

  // Validate complete intent
  try {
    const validated = ModernizationIntentSchema.parse({
      why: input.why,
      targetOutcome: input.targetOutcome || 'Modernized UI adhering to canonical design tokens and responsive standards.',
      primaryProblems: input.primaryProblems && input.primaryProblems.length > 0 ? input.primaryProblems : ['Inconsistent legacy styling'],
      userPainPoints: input.userPainPoints && input.userPainPoints.length > 0 ? input.userPainPoints : ['Dense, unorganized interface'],
      visualGoals: input.visualGoals && input.visualGoals.length > 0 ? input.visualGoals : ['Modern typography and palette'],
      uxGoals: input.uxGoals && input.uxGoals.length > 0 ? input.uxGoals : ['Clear task hierarchy'],
      technicalGoals: input.technicalGoals && input.technicalGoals.length > 0 ? input.technicalGoals : ['Design token integration'],
      constraints: input.constraints || ['No backend changes'],
      forbiddenChanges: input.forbiddenChanges || ['No database migrations'],
      successCriteria: input.successCriteria && input.successCriteria.length > 0 ? input.successCriteria : ['All baseline tests pass']
    });

    return {
      isValid: true,
      intent: validated
    };
  } catch (err: any) {
    return {
      isValid: false,
      rejectionReason: `Intent validation failed: ${err.message}`
    };
  }
}

// =========================================================================
// 8. Baseline Quality Profile (Section 9)
// =========================================================================

export function assessBaselineQuality(
  profile: ExistingProjectProfile,
  files?: Array<{ path: string; content?: string }>
): BaselineQualityProfile {
  // RULE: All AI scores MUST be explicitly marked as HEURISTIC.
  const techSmells = profile.technicalDebt.length;
  const visualSmells = profile.visualDebt.length;
  const uxSmells = profile.uxDebt.length;
  const secSmells = profile.securityDebt.length;
  const perfSmells = profile.performanceDebt.length;

  const technicalScore = Math.max(20, 100 - techSmells * 15);
  const visualScore = Math.max(25, 100 - visualSmells * 20);
  const uxScore = Math.max(30, 100 - uxSmells * 15);
  const a11yScore = profile.stylingSystem.legacyFrameworks.includes('Bootstrap') ? 55 : 70;
  const perfScore = Math.max(40, 100 - perfSmells * 15);
  const secScore = Math.max(30, 100 - secSmells * 25);

  const composite = Math.round((technicalScore + visualScore + uxScore + a11yScore + perfScore + secScore) / 6);

  const qualityProfile: BaselineQualityProfile = {
    technicalQuality: {
      score: technicalScore,
      isHeuristic: true,
      scoreType: 'HEURISTIC',
      confidence: 0.88,
      details: {
        architectureStyle: profile.architectureStyle,
        debtCount: techSmells,
        hasUnitTests: profile.testSystem.hasUnitTests
      }
    },
    visualQuality: {
      score: visualScore,
      isHeuristic: true,
      scoreType: 'HEURISTIC',
      confidence: 0.85,
      details: {
        stylingSystem: profile.stylingSystem.primary,
        customCssFiles: profile.stylingSystem.customCssFiles,
        usesDesignTokens: profile.designTokens.hasTokens
      }
    },
    uxQuality: {
      score: uxScore,
      isHeuristic: true,
      scoreType: 'HEURISTIC',
      confidence: 0.82,
      details: {
        informationDensity: 'HIGH_ESTIMATED',
        navigationType: profile.routingModel.type
      }
    },
    accessibilityQuality: {
      score: a11yScore,
      isHeuristic: true,
      scoreType: 'HEURISTIC',
      confidence: 0.86,
      details: {
        wcagTarget: 'WCAG_2_1_AA',
        highRiskPatterns: profile.stylingSystem.legacyFrameworks
      }
    },
    performanceQuality: {
      score: perfScore,
      isHeuristic: true,
      scoreType: 'HEURISTIC',
      confidence: 0.84,
      details: {
        bundler: profile.buildSystem.bundler,
        usesUtilityClasses: profile.stylingSystem.usesUtilityClasses
      }
    },
    securityQuality: {
      score: secScore,
      isHeuristic: true,
      scoreType: 'HEURISTIC',
      confidence: 0.90,
      details: {
        csrfConfigured: profile.authenticationModel.csrfProtection,
        authType: profile.authenticationModel.type
      }
    },
    compositeHeuristicScore: composite,
    summary: `Baseline Quality Heuristic Score: ${composite}/100 across 6 dimensions. AI heuristic indicators stamped.`
  };

  return BaselineQualityProfileSchema.parse(qualityProfile);
}

// =========================================================================
// 9. Modernization Stages Engine (Section 11)
// =========================================================================

export function createModernizationStages(
  scope: ModernizationScope,
  strategy: ModernizationStrategyDecision,
  changes: ChangeClassification[]
): ModernizationStage[] {
  const stages: ModernizationStage[] = [];

  // Stage 1: Foundation
  stages.push({
    stageId: 'STAGE_1_FOUNDATION',
    order: 1,
    name: 'Foundation & Token Bridge',
    objective: 'Compile DTCG tokens, establish CSS/Component bridge adapters, and freeze behavioral regression baseline.',
    scope: {
      allowedFiles: ['styles/tokens/**', 'src/tokens/**', 'resources/css/bridge.css', 'styles/bridge.css'],
      prohibitedFiles: ['**/controllers/**', '**/database/**', '**/migrations/**']
    },
    entryCriteria: ['Existing project profile generated', 'Behavioral baseline captured and frozen'],
    exitCriteria: ['Tokens compile cleanly to CSS Custom Properties', 'Bridge styles load without namespace collisions'],
    checkpoint: 'checkpoint-stage-1-foundation',
    verification: {
      testsToRun: ['pnpm test design-tokens'],
      baselineChecks: ['Tokens adhere to DTCG standard', 'Zero breaking changes to legacy selectors'],
      reviewerCriteria: ['No changes to backend business logic', 'Bridge isolation verified']
    },
    rollbackSteps: ['Revert bridge stylesheet addition', 'Purge generated token bundle']
  });

  // Stage 2: Shell
  if (scope.level === 'SHELL' || scope.level === 'MODULE' || scope.level === 'APPLICATION' || scope.canModifyGlobalShell) {
    stages.push({
      stageId: 'STAGE_2_SHELL',
      order: 2,
      name: 'Application Shell Modernization',
      objective: 'Modernize layout wrapper, header, navigation, and footer using design tokens.',
      scope: {
        allowedFiles: ['layouts/**', 'components/shell/**', 'views/layouts/**'],
        prohibitedFiles: ['**/controllers/**', '**/models/**', '**/database/**']
      },
      entryCriteria: ['Stage 1 Foundation verified'],
      exitCriteria: ['Shell renders responsive layout across all 4 viewports', 'Navigation links functional'],
      checkpoint: 'checkpoint-stage-2-shell',
      verification: {
        testsToRun: ['pnpm test navigation'],
        baselineChecks: ['All critical routes accessible from navigation', 'No layout overflow'],
        reviewerCriteria: ['Responsive fidelity 390px-1920px', 'Zero regression in route handlers']
      },
      rollbackSteps: ['Restore legacy layout wrapper template']
    });
  }

  // Stage 3: Target Page / Component
  stages.push({
    stageId: 'STAGE_3_TARGET',
    order: stages.length + 1,
    name: `Modernize ${scope.targetName}`,
    objective: `Refactor presentation markup for ${scope.targetName} within declared scope boundaries.`,
    scope: {
      allowedFiles: scope.allowedPaths,
      prohibitedFiles: scope.prohibitedPaths
    },
    entryCriteria: ['Previous stages verified', 'Design candidate selected and approved'],
    exitCriteria: ['Target element reflects modern design direction', 'All form actions and events function'],
    checkpoint: 'checkpoint-stage-3-target',
    verification: {
      testsToRun: ['pnpm test'],
      baselineChecks: ['Forms submit to original endpoints', 'Data fields match behavioral baseline'],
      reviewerCriteria: ['Truthful UI verified (no fake telemetry)', 'Scope strictly maintained']
    },
    rollbackSteps: ['Revert modified target files from checkpoint-stage-3-target']
  });

  // Stage 4: Shared Components
  if (scope.canModifySharedComponents) {
    stages.push({
      stageId: 'STAGE_4_SHARED_COMPONENTS',
      order: stages.length + 1,
      name: 'Shared Component Refinement',
      objective: 'Refactor shared buttons, inputs, modals, and datagrids to canonical blueprints.',
      scope: {
        allowedFiles: ['components/ui/**', 'components/shared/**'],
        prohibitedFiles: ['**/migrations/**', '**/routes/**']
      },
      entryCriteria: ['Target page modernization verified'],
      exitCriteria: ['Shared components conform to WCAG 2.1 AA contrast'],
      checkpoint: 'checkpoint-stage-4-shared',
      verification: {
        testsToRun: ['pnpm test components'],
        baselineChecks: ['Component APIs maintain backward compatibility'],
        reviewerCriteria: ['No broken prop interfaces', 'A11y automated pass']
      },
      rollbackSteps: ['Revert shared components from checkpoint-stage-4-shared']
    });
  }

  // Stage 5: Refinement & Human Approval Gate
  stages.push({
    stageId: 'STAGE_5_REFINEMENT',
    order: stages.length + 1,
    name: 'Refinement, A11y & Human Approval Gate',
    objective: 'Final Polish: accessibility audit, performance check, independent review, and human visual sign-off.',
    scope: {
      allowedFiles: scope.allowedPaths,
      prohibitedFiles: ['*']
    },
    entryCriteria: ['All implementation stages complete and tests passing'],
    exitCriteria: ['HUMAN_VISUAL_APPROVAL obtained', 'Zero regressions vs behavioral baseline'],
    checkpoint: 'checkpoint-stage-5-final',
    verification: {
      testsToRun: ['pnpm test'],
      baselineChecks: ['compareBehavioralBaselines returns 100% pass'],
      reviewerCriteria: ['Modernization Completion Contract satisfied']
    },
    rollbackSteps: ['Execute full rollback to pre-modernization baseline tag']
  });

  return stages.map(s => ModernizationStageSchema.parse(s));
}

// =========================================================================
// 10. Design Direction Workflow (Section 12)
// =========================================================================

export function generateDesignCandidates(
  profile: ExistingProjectProfile,
  intent: ModernizationIntent
): DesignDirectionWorkflow {
  const candidates: DesignDirectionCandidate[] = [
    {
      candidateId: 'CANDIDATE_A_HIGH_DENSITY_WORKBENCH',
      title: 'Direction A: High-Density Operational Workbench',
      composition: 'Multi-pane split workbench with resizable side panels, sticky summary header, and maximized data grid viewport.',
      hierarchy: 'Focal emphasis placed on operational status telemetry and dense record rows; secondary actions tucked into context menus.',
      density: 'COMPACT / HIGH (4px-8px spacing, 12px data typography, compact controls).',
      navigation: 'Collapsible left iconography sidebar with quick hotkey switching (Ctrl+1, Ctrl+2).',
      interaction: 'Keyboard-first data navigation, inline grid editing, right-drawer detail inspection.',
      brandTreatment: 'Utilitarian Precision: Slate/Zinc neutral dark/light mode with technical amber/cyan indicators.',
      tradeoffs: ['Requires desktop screen space (1280px+ optimal)', 'Steeper learning curve for novice users']
    },
    {
      candidateId: 'CANDIDATE_B_MODULAR_CARD_HIERARCHY',
      title: 'Direction B: Modular Card-Based Structured Flow',
      composition: 'Grid of responsive structural cards with master-detail side drawer and clear whitespace chunking.',
      hierarchy: 'Primary KPI summary banner above segmented cards; prominent primary action buttons with clear visual weight.',
      density: 'BALANCED (8px-16px spacing, 14px body typography, spacious touch-friendly hit areas).',
      navigation: 'Top navigation bar with breadcrumb context and global search modal.',
      interaction: 'Click-to-expand card drawers, modal confirmation dialogs for destructive actions.',
      brandTreatment: 'Modern Enterprise: Refined indigo/neutral palette with subtle borders and 6px border radii.',
      tradeoffs: ['Shows fewer records per viewport than Direction A', 'Requires scrolling on high-volume tables']
    },
    {
      candidateId: 'CANDIDATE_C_STREAMLINED_TASK_FLOW',
      title: 'Direction C: Streamlined Task-Oriented Stepper',
      composition: 'Single-column focused task layout with progressive disclosure tabs and contextual help rail.',
      hierarchy: 'Linear vertical progression guiding the operator through the primary workflow with high contrast next-steps.',
      density: 'COMFORTABLE / SPACIOUS (16px-24px padding, 16px inputs, large accessible buttons).',
      navigation: 'Step-by-step progress indicator with persistent save/continue footer bar.',
      interaction: 'Wizard progression, auto-save with undo snackbars, inline field-level validation errors.',
      brandTreatment: 'Clean Scandinavian: High-contrast monochrome base with single electric blue accent.',
      tradeoffs: ['Less suitable for multi-record batch processing', 'Tightly couples sequence of operations']
    }
  ];

  return DesignDirectionWorkflowSchema.parse({
    workflowId: `ddw-${Date.now()}`,
    baselineDescription: `Current legacy interface using ${profile.stylingSystem.primary} with ${profile.technicalDebt.length} debts identified.`,
    candidates,
    selectedCandidateId: undefined,
    humanVisualApprovalRequired: true,
    humanVisualApprovalStatus: 'PENDING'
  });
}

// =========================================================================
// 11. Existing Design System Detection & Duplication Guard (Section 16)
// =========================================================================

export interface DetectedDesignSystem {
  name: string;
  category: 'UTILITY_CSS' | 'COMPONENT_LIB' | 'LEGACY_FRAMEWORK' | 'CUSTOM_VARS' | 'TEMPLATE_COMPONENTS';
  evidence: string[];
}

export function detectExistingDesignSystems(files: Array<{ path: string; content?: string }>): DetectedDesignSystem[] {
  const detected: DetectedDesignSystem[] = [];
  const paths = files.map(f => f.path.replace(/\\/g, '/').toLowerCase());

  // Tailwind
  const hasTailwind = paths.some(p => p.includes('tailwind')) || files.some(f => f.content?.includes('@tailwind'));
  if (hasTailwind) {
    detected.push({
      name: 'Tailwind CSS',
      category: 'UTILITY_CSS',
      evidence: ['tailwind.config file or @tailwind directive in CSS']
    });
  }

  // Bootstrap
  const hasBootstrap = paths.some(p => p.includes('bootstrap')) || files.some(f => f.content?.includes('bootstrap') || f.content?.includes('container-fluid'));
  if (hasBootstrap) {
    detected.push({
      name: 'Bootstrap',
      category: 'LEGACY_FRAMEWORK',
      evidence: ['Bootstrap CSS file or bootstrap class names (container-fluid, row, col-)']
    });
  }

  // Material / MUI
  const hasMui = files.some(f => f.content?.includes('@mui/') || f.content?.includes('@material-ui/'));
  if (hasMui) {
    detected.push({
      name: 'Material UI (MUI)',
      category: 'COMPONENT_LIB',
      evidence: ['@mui/material or @material-ui imports in source']
    });
  }

  // shadcn
  const hasShadcn = paths.some(p => p.includes('components/ui')) && files.some(f => f.content?.includes('class-variance-authority') || f.content?.includes('clsx'));
  if (hasShadcn) {
    detected.push({
      name: 'shadcn/ui',
      category: 'COMPONENT_LIB',
      evidence: ['components/ui folder with class-variance-authority primitives']
    });
  }

  // Blade components
  const hasBlade = files.some(f => f.content?.includes('<x-') || f.content?.includes('@component'));
  if (hasBlade) {
    detected.push({
      name: 'Laravel Blade Components',
      category: 'TEMPLATE_COMPONENTS',
      evidence: ['<x- component tags or @component directives']
    });
  }

  // Razor TagHelpers
  const hasRazor = files.some(f => f.content?.includes('asp-for=') || f.content?.includes('<partial'));
  if (hasRazor) {
    detected.push({
      name: 'ASP.NET Razor TagHelpers',
      category: 'TEMPLATE_COMPONENTS',
      evidence: ['asp-for tag helpers or <partial> tags in razor views']
    });
  }

  return detected;
}

export function preventDuplicateDesignSystem(
  existing: DetectedDesignSystem[],
  proposed: string
): {
  allowed: boolean;
  conflict?: string;
  recommendedBridge?: string;
} {
  const normProposed = proposed.toLowerCase();

  // If already exists
  const directDuplicate = existing.find(e => e.name.toLowerCase().includes(normProposed));
  if (directDuplicate) {
    return {
      allowed: false,
      conflict: `Duplicate Design System: '${directDuplicate.name}' is already installed and detected in the project. Do not re-install or duplicate it.`
    };
  }

  // Conflicting frameworks (e.g. Bootstrap + Tailwind without bridge)
  const hasBootstrap = existing.some(e => e.name.includes('Bootstrap'));
  if (hasBootstrap && normProposed.includes('tailwind')) {
    return {
      allowed: true,
      conflict: 'Potential CSS reset collision between Bootstrap and Tailwind.',
      recommendedBridge: 'Use Tailwind with prefix or scoped preflight disabled to avoid overriding existing Bootstrap typography/buttons.'
    };
  }

  return { allowed: true };
}

// =========================================================================
// 12. Dependency Governance Engine (Section 17)
// =========================================================================

export function evaluateDependencyProposal(proposal: DependencyProposal): DependencyGovernanceResult {
  const reasons: string[] = [];
  let risk: DependencyGovernanceResult['risk'] = 'LOW';
  let approved = true;

  // RULE: "UI looks nicer" alone is strictly rejected as justification!
  const trivialNeed =
    /^(ui looks nicer|nicer ui|looks modern|prettier|look better|more modern buttons|looks cool)$/i.test(proposal.need.trim()) ||
    proposal.need.trim().length < 10;

  if (trivialNeed) {
    return DependencyGovernanceResultSchema.parse({
      packageName: proposal.packageName,
      approved: false,
      reasons: ["Rejection: 'UI looks nicer' alone is not a valid technical justification for adding a runtime dependency. Concrete capabilities and business requirements are mandatory."],
      risk: 'HIGH'
    });
  }

  // Bundle impact check
  if (proposal.bundleImpactKb > 150) {
    risk = 'MEDIUM';
    reasons.push(`High bundle impact: ${proposal.bundleImpactKb} KB added to client bundle.`);
  }

  // License check
  const lic = proposal.license.toUpperCase();
  if (lic.includes('GPL') && !lic.includes('LGPL')) {
    approved = false;
    risk = 'CRITICAL';
    reasons.push(`License rejection: Copyleft GPL license '${proposal.license}' is prohibited for proprietary distribution.`);
  }

  // Maintenance check
  if (proposal.maintenanceRating === 'ABANDONED') {
    approved = false;
    risk = 'HIGH';
    reasons.push(`Maintenance rejection: Package '${proposal.packageName}' is classified as ABANDONED without recent releases.`);
  }

  // Existing equivalent
  if (proposal.existingEquivalent) {
    reasons.push(`Note: Project already contains equivalent dependency '${proposal.existingEquivalent}'. Ensure replacement is justified.`);
  }

  if (approved && reasons.length === 0) {
    reasons.push(`Dependency '${proposal.packageName}' verified: compliant license, acceptable bundle impact (${proposal.bundleImpactKb}KB), active maintenance.`);
  }

  return DependencyGovernanceResultSchema.parse({
    packageName: proposal.packageName,
    approved,
    reasons,
    risk,
    mitigation: risk === 'MEDIUM' ? 'Consider tree-shaking or dynamic import to mitigate bundle size.' : undefined
  });
}

// =========================================================================
// 13. Legacy Code Protection Engine (Section 18)
// =========================================================================

export function classifyLegacyFiles(filePaths: string[]): LegacyProtectionResult[] {
  return filePaths.map(filePath => {
    const norm = filePath.replace(/\\/g, '/').toLowerCase();

    let category: LegacyFileCategory = 'SOURCE';
    let protectedFromDirectEdit = false;
    let protectionReason = 'Normal source file eligible for modernization edits.';

    if (norm.includes('/node_modules/') || norm.startsWith('node_modules/') || norm.includes('/vendor/') || norm.startsWith('vendor/')) {
      category = 'VENDOR';
      protectedFromDirectEdit = true;
      protectionReason = 'Vendor dependencies must not be edited directly in source repository.';
    } else if (norm.includes('/dist/') || norm.startsWith('dist/') || norm.includes('/build/') || norm.startsWith('build/') || norm.includes('/.next/')) {
      category = 'BUILD_OUTPUT';
      protectedFromDirectEdit = true;
      protectionReason = 'Build output directories are overwritten by compile processes and must not be edited manually.';
    } else if (norm.includes('migrations/') || norm.includes('migration.sql') || norm.endsWith('.migration.ts')) {
      category = 'MIGRATION_HISTORY';
      protectedFromDirectEdit = true;
      protectionReason = 'Historical migration files must remain immutable to protect database schema audit trails.';
    } else if (norm.endsWith('.g.ts') || norm.endsWith('.generated.ts') || norm.includes('/generated/') || norm.includes('swagger-client.ts')) {
      category = 'GENERATED';
      protectedFromDirectEdit = true;
      protectionReason = 'Machine-generated code should be re-generated via tooling rather than hand-edited.';
    } else if (norm.includes('third_party') || norm.includes('thirdparty') || norm.endsWith('.min.js')) {
      category = 'THIRD_PARTY';
      protectedFromDirectEdit = true;
      protectionReason = 'Third-party bundled library preserved verbatim.';
    }

    return LegacyProtectionResultSchema.parse({
      filePath,
      category,
      protectedFromDirectEdit,
      protectionReason
    });
  });
}

// =========================================================================
// 14. Database Safety Evaluator (Section 19)
// =========================================================================

export function evaluateDatabaseSafetyForUI(
  migrationStatements: string[],
  isUITask: boolean = true
): {
  safe: boolean;
  risk: 'SAFE' | 'REVIEW_REQUIRED' | 'DANGEROUS';
  findings: string[];
} {
  const findings: string[] = [];

  // RULE: UI modernization tasks must default to NO database migrations!
  if (isUITask && migrationStatements.length > 0) {
    findings.push('UI modernization task contains unsolicited database migration statements. UI tasks must default to zero database schema modifications.');
    return {
      safe: false,
      risk: 'DANGEROUS',
      findings
    };
  }

  for (const stmt of migrationStatements) {
    const s = stmt.toUpperCase();
    if (s.includes('DROP TABLE')) {
      findings.push(`Irreversible DROP TABLE statement detected: "${stmt.trim()}"`);
    }
    if (s.includes('DROP COLUMN')) {
      findings.push(`Data loss DROP COLUMN statement detected without deprecation phase: "${stmt.trim()}"`);
    }
    if (s.includes('ALTER TABLE') && s.includes('ADD') && s.includes('NOT NULL') && !s.includes('DEFAULT')) {
      findings.push(`NOT NULL column added without DEFAULT: "${stmt.trim()}"`);
    }
  }

  let risk: 'SAFE' | 'REVIEW_REQUIRED' | 'DANGEROUS' = 'SAFE';
  if (findings.some(f => f.includes('DROP') || f.includes('Irreversible'))) {
    risk = 'DANGEROUS';
  } else if (findings.length > 0) {
    risk = 'REVIEW_REQUIRED';
  }

  return {
    safe: risk !== 'DANGEROUS',
    risk,
    findings
  };
}

// =========================================================================
// 15. Auth Safety Evaluator (Section 21)
// =========================================================================

export function evaluateAuthSafety(
  baselineAuth: BehavioralBaseline['authenticationFlows'],
  modifiedFileContents: Array<{ path: string; content?: string }>
): {
  preserved: boolean;
  violations: string[];
} {
  const violations: string[] = [];

  for (const file of modifiedFileContents) {
    const c = file.content || '';
    const norm = file.path.toLowerCase();

    if (norm.includes('login') || norm.includes('auth')) {
      // Check if CSRF was stripped
      if (baselineAuth.some(a => a.csrfTokenRequired) && !c.includes('csrf') && !c.includes('_token') && !c.includes('ValidateAntiForgeryToken')) {
        violations.push(`Auth Safety Regression: CSRF token element was removed from authentication view in '${file.path}'.`);
      }

      // Check if password type was altered
      if (c.includes('<input') && c.includes('password') && !c.includes('type="password"') && !c.includes("type='password'")) {
        violations.push(`Security Regression: Password input in '${file.path}' no longer has type="password".`);
      }
    }
  }

  return {
    preserved: violations.length === 0,
    violations
  };
}

// =========================================================================
// 16. Project Mode Transition Guard (Section 24)
// =========================================================================

export function validateProjectModeTransition(
  currentMode: ProjectMode,
  requestedActions: string[]
): ProjectModeTransition {
  // RULE: REPAIR task must NOT silently transform into MODERNIZE!
  if (currentMode === 'REPAIR') {
    const modernizationKeywords = [
      'redesign',
      'full overhaul',
      'token migration',
      'replace design system',
      'rearchitect',
      'modernize layout',
      'new theme'
    ];

    const triggers = requestedActions.filter(act =>
      modernizationKeywords.some(kw => act.toLowerCase().includes(kw))
    );

    if (triggers.length > 0) {
      return ProjectModeTransitionSchema.parse({
        currentMode,
        requestedMode: 'MODERNIZE',
        allowed: false,
        reason: `Strict Mode Boundary Violation: REPAIR mode forbids broad modernization actions: [${triggers.join(', ')}]. A REPAIR task is strictly restricted to minimum necessary changes to fix targeted defects. To modernize, user must explicitly switch project mode to MODERNIZE.`
      });
    }
  }

  return ProjectModeTransitionSchema.parse({
    currentMode,
    requestedMode: currentMode,
    allowed: true,
    reason: `Actions are compliant with project mode [${currentMode}].`
  });
}

// =========================================================================
// 17. Modernization Plan Builder (Section 10)
// =========================================================================

export interface CreateModernizationPlanInput {
  profile: ExistingProjectProfile;
  intent: ModernizationIntent;
  baseline: BehavioralBaseline;
  scope: ModernizationScope;
  strategy?: ModernizationStrategyType;
  classifications?: ElementClassificationInput[];
  checkpointPlan?: CheckpointPlan;
}

export function createModernizationPlan(input: CreateModernizationPlanInput): ModernizationPlan {
  const strategyDecision = selectModernizationStrategy({
    requestedStrategy: input.strategy || 'BRIDGE',
    projectProfile: input.profile
  });

  const preservationContract = createPreservationContract();

  const changeClassifications = classifyExistingElements(input.classifications || [
    {
      targetId: 'COMP_SHELL',
      name: 'Application Shell Wrapper',
      path: 'views/layout',
      elementType: 'SHELL',
      proposedDecision: 'IMPROVE'
    },
    {
      targetId: 'COMP_LEGACY_TABLE',
      name: 'Legacy Unstyled DataGrid',
      path: 'views/records',
      elementType: 'COMPONENT',
      proposedDecision: 'REPLACE'
    }
  ]);

  const keep = changeClassifications.filter(c => c.decision === 'KEEP');
  const improve = changeClassifications.filter(c => c.decision === 'IMPROVE');
  const replace = changeClassifications.filter(c => c.decision === 'REPLACE');
  const defer = changeClassifications.filter(c => c.decision === 'DEFER');
  const remove = changeClassifications.filter(c => c.decision === 'REMOVE');

  const implementationStages = createModernizationStages(input.scope, strategyDecision, changeClassifications);

  const defaultCheckpoint: CheckpointPlan = input.checkpointPlan || {
    planId: `chk-${Date.now()}`,
    baseCommit: 'HEAD',
    checkpoints: [
      {
        id: 'chk-01-baseline',
        name: 'Pre-Modernization Behavioral Baseline',
        targetBranch: 'refactor/modernization-baseline',
        tag: 'baseline-pre-modernization',
        criteria: 'Captured prior to any stylesheet or component alteration',
        requiresCleanWorkingTree: true,
        automated: true
      }
    ],
    rollbackStrategy: 'STASH_AND_CHECKOUT',
    recoveryCommands: ['git reset --hard baseline-pre-modernization']
  };

  const plan: ModernizationPlan = {
    planId: `mod-plan-${Date.now()}`,
    projectProfile: input.profile,
    intent: input.intent,
    baseline: input.baseline,
    preservationContract,
    scope: input.scope,
    strategy: strategyDecision,
    keep,
    improve,
    replace,
    defer,
    remove,
    risks: [
      {
        riskId: 'RISK_CSS_CASCADE',
        category: 'STYLING_CASCADE',
        severity: 'MEDIUM',
        mitigation: 'Apply CSS Custom Property bridge with scoped selectors.'
      },
      {
        riskId: 'RISK_REGRESSION_ROUTES',
        category: 'BEHAVIORAL_ROUTING',
        severity: 'HIGH',
        mitigation: 'Run compareBehavioralBaselines regression guard on every stage checkpoint.'
      }
    ],
    checkpointPlan: defaultCheckpoint,
    implementationStages,
    verificationPlan: {
      stages: implementationStages.map(s => s.stageId),
      automatedChecks: ['compareBehavioralBaselines', 'evaluateTruthfulUI', 'auditActionScope'],
      humanVerificationPoints: ['Design Candidate Selection', 'HUMAN_VISUAL_APPROVAL before release']
    },
    rollbackPlan: {
      strategy: 'Git tag checkout and bridge stylesheet detachment',
      rollbackSteps: [
        'git reset --hard baseline-pre-modernization',
        'Verify behavioral baseline test suite returns 100% PASS'
      ],
      automatedScript: './scripts/rollback-modernization.ps1'
    },
    humanDecisionsRequired: [
      {
        decisionId: 'DEC_DESIGN_DIRECTION',
        question: 'Which design direction candidate aligns with your target workflow density and brand?',
        options: ['Direction A (High-Density Workbench)', 'Direction B (Modular Card Hierarchy)', 'Direction C (Streamlined Stepper)'],
        recommendation: 'Direction A (High-Density Workbench) recommended for operational data applications.',
        context: 'Different candidates prioritize information density vs touch accessibility.'
      }
    ]
  };

  return ModernizationPlanSchema.parse(plan);
}

// =========================================================================
// 18. Modernization Completion Contract (Section 23)
// =========================================================================

export interface ModernizationCompletionInput {
  technical: 'PASS' | 'FAIL' | 'BLOCKED';
  visualAI: 'PASS' | 'FAIL' | 'HEURISTIC_ACCEPTABLE';
  ux: 'PASS' | 'FAIL';
  accessibility: 'PASS' | 'FAIL';
  security: 'PASS' | 'FAIL';
  regression: 'PASS' | 'FAIL';
  contentTruth: 'PASS' | 'FAIL';
  humanVisualApproval: 'APPROVED' | 'PENDING' | 'REJECTED';
}

export function evaluateModernizationCompletion(
  input: ModernizationCompletionInput
): ModernizationCompletionContract {
  const blockReasons: string[] = [];

  if (input.technical !== 'PASS') {
    blockReasons.push(`Technical build/test gate did not PASS (status: ${input.technical}).`);
  }
  if (input.visualAI === 'FAIL') {
    blockReasons.push('Visual AI heuristic score failed minimum threshold.');
  }
  if (input.ux !== 'PASS') {
    blockReasons.push('UX ergonomics or workflow friction check failed.');
  }
  if (input.accessibility !== 'PASS') {
    blockReasons.push('Accessibility gate failed WCAG 2.1 AA requirements.');
  }
  if (input.security !== 'PASS') {
    blockReasons.push('Security scan detected unresolved high or critical vulnerabilities.');
  }
  if (input.regression !== 'PASS') {
    blockReasons.push('Behavioral regression guard detected drift against frozen baseline.');
  }
  if (input.contentTruth !== 'PASS') {
    blockReasons.push('Content truthfulness gate rejected fabricated or provenance-less telemetry.');
  }
  // RULE: HUMAN_VISUAL_APPROVAL is mandatory before release!
  if (input.humanVisualApproval !== 'APPROVED') {
    blockReasons.push(`HUMAN_VISUAL_APPROVAL is mandatory before finalization. Current status: ${input.humanVisualApproval}.`);
  }

  const isComplete = blockReasons.length === 0;
  let verdict: ModernizationCompletionContract['verdict'] = 'COMPLETE';

  if (!isComplete) {
    verdict = input.humanVisualApproval === 'REJECTED' || input.security === 'FAIL' || input.regression === 'FAIL' ? 'REJECTED' : 'INCOMPLETE';
  }

  return ModernizationCompletionContractSchema.parse({
    technical: input.technical,
    visualAI: input.visualAI,
    ux: input.ux,
    accessibility: input.accessibility,
    security: input.security,
    regression: input.regression,
    contentTruth: input.contentTruth,
    humanVisualApproval: input.humanVisualApproval,
    isComplete,
    verdict,
    blockReasons
  });
}
