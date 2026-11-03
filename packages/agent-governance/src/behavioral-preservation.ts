import {
  BehavioralContract,
  BehavioralContractSchema
} from './types.js';
import {
  TrustedHumanApprovalToken,
  verifyHostHumanApproval
} from './human-approval.js';

export type PreservationVerdictStatus =
  | 'PRESERVED'
  | 'REGRESSION_DETECTED'
  | 'INSUFFICIENT_EVIDENCE'
  | 'NOT_APPLICABLE';

export function extractBehavioralContract(files: Array<{ path: string; content?: string }>): BehavioralContract {
  const routes: BehavioralContract['routes'] = [];
  const apiContracts: BehavioralContract['apiContracts'] = [];
  const databaseBehaviors: BehavioralContract['databaseBehaviors'] = [];
  const permissions: BehavioralContract['permissions'] = [];
  const businessRules: BehavioralContract['businessRules'] = [];

  for (const file of files) {
    const content = file.content || '';
    const normPath = file.path.toLowerCase();

    // 1. Route detection (Express, Fastify, Next.js, Laravel routes, ASP.NET Controllers)
    const expressRouteMatches = content.matchAll(/(?:router|app)\.(get|post|put|delete|patch)\(\s*['"]([^'"]+)['"]/gi);
    for (const match of expressRouteMatches) {
      if (match[1] && match[2]) {
        routes.push({
          method: match[1].toUpperCase(),
          path: match[2],
          expectedStatus: 200
        });
      }
    }

    // Laravel Route::get('/path', ...)
    const laravelMatches = content.matchAll(/Route::(get|post|put|delete|patch)\(\s*['"]([^'"]+)['"]/gi);
    for (const match of laravelMatches) {
      if (match[1] && match[2]) {
        routes.push({
          method: match[1].toUpperCase(),
          path: match[2],
          expectedStatus: 200
        });
      }
    }

    // ASP.NET [HttpGet("path")] or [Route("path")]
    const aspnetMatches = content.matchAll(/\[Http(Get|Post|Put|Delete|Patch)\(["']?([^"'\)]*)["']?\)\]/gi);
    for (const match of aspnetMatches) {
      if (match[1] && match[2]) {
        routes.push({
          method: match[1].toUpperCase(),
          path: match[2] || '/',
          expectedStatus: 200
        });
      }
    }

    // 2. Database table / invariants
    if (normPath.includes('migration') || normPath.includes('schema') || normPath.endsWith('.sql') || /CREATE\s+TABLE|create_table/i.test(content)) {
      const tableMatches = content.matchAll(/create_table\s*\(?['"]([^'"]+)['"]|CREATE TABLE (?:IF NOT EXISTS )?`?([a-zA-Z0-9_]+)`?/gi);
      for (const match of tableMatches) {
        const tbl = match[1] || match[2];
        if (tbl) {
          const invariants = ['Primary key preservation', 'Foreign key constraints intact'];
          if (/UNIQUE/i.test(content)) invariants.push(`UNIQUE constraint on ${tbl}`);
          if (/NOT\s+NULL/i.test(content)) invariants.push(`NOT NULL constraint on ${tbl}`);
          databaseBehaviors.push({
            table: tbl,
            invariants
          });
        }
      }
    }

    // 3. Permissions / Roles / Tenant isolation
    if (/role|permission|can\(|hasRole|authorize|tenant_id|tenantId|organizationId/i.test(content)) {
      const roleMatches = content.matchAll(/(?:hasRole|can)\s*\(\s*['"]([^'"]+)['"]|Authorize\s*\(\s*Roles\s*=\s*['"]([^'"]+)['"]/gi);
      for (const match of roleMatches) {
        const role = match[1] || match[2];
        if (role) {
          permissions.push({
            role,
            allowed: [`Access to component/endpoint in ${file.path}`]
          });
        }
      }
      if (/tenant_id|tenantId|organization_id|organizationId/i.test(content)) {
        permissions.push({
          role: 'TENANT_ISOLATION_GUARD',
          allowed: [`Tenant isolation scope enforced in ${file.path}`]
        });
      }
    }
  }

  // Deduplicate routes
  const uniqueRoutes = routes.filter((r, idx, self) =>
    idx === self.findIndex(t => t.path === r.path && t.method === r.method)
  );

  return BehavioralContractSchema.parse({
    routes: uniqueRoutes,
    apiContracts,
    databaseBehaviors,
    permissions,
    businessRules
  });
}

export function verifyBehavioralPreservation(
  baseline: BehavioralContract,
  candidate: BehavioralContract
): {
  preserved: boolean;
  status: PreservationVerdictStatus;
  breaks: string[];
  allowedUpdates: string[];
} {
  const breaks: string[] = [];
  const allowedUpdates: string[] = [];

  const totalBaselineElements =
    baseline.routes.length +
    baseline.apiContracts.length +
    baseline.databaseBehaviors.length +
    baseline.permissions.length +
    baseline.businessRules.length;

  if (totalBaselineElements === 0) {
    return {
      preserved: false,
      status: 'INSUFFICIENT_EVIDENCE',
      breaks: ['INSUFFICIENT_EVIDENCE: Baseline behavioral contract is empty; preservation cannot be verified without baseline evidence.'],
      allowedUpdates: []
    };
  }

  // 1. Verify all baseline routes still exist in candidate
  for (const baseRoute of baseline.routes) {
    const stillExists = candidate.routes.some(
      r => r.path === baseRoute.path && r.method === baseRoute.method
    );
    if (!stillExists) {
      breaks.push(
        `Critical route broke or was removed: [${baseRoute.method}] ${baseRoute.path}. Business routing must be preserved.`
      );
    }
  }

  // 2. Verify candidate didn't drop required roles/permissions
  for (const basePerm of baseline.permissions) {
    const hasRole = candidate.permissions.some(p => p.role === basePerm.role);
    if (!hasRole) {
      breaks.push(`Security regression: Role authorization check '${basePerm.role}' missing in candidate.`);
    }
  }

  // 3. Verify database tables/invariants
  for (const baseDb of baseline.databaseBehaviors) {
    const candDb = candidate.databaseBehaviors.find(d => d.table === baseDb.table);
    if (!candDb) {
      breaks.push(`Database regression: Table '${baseDb.table}' and its invariants missing in candidate.`);
    } else {
      for (const inv of baseDb.invariants || []) {
        if (!candDb.invariants?.includes(inv)) {
          breaks.push(`Database invariant regression on '${baseDb.table}': missing '${inv}'.`);
        }
      }
    }
  }

  // 4. Verify business rules
  for (const rule of baseline.businessRules) {
    if (!candidate.businessRules.includes(rule)) {
      breaks.push(`Business rule regression: '${rule}' missing in candidate.`);
    }
  }

  // 5. Note added routes
  for (const candRoute of candidate.routes) {
    const isNew = !baseline.routes.some(r => r.path === candRoute.path && r.method === candRoute.method);
    if (isNew) {
      allowedUpdates.push(`Non-breaking route addition: [${candRoute.method}] ${candRoute.path}`);
    }
  }

  return {
    preserved: breaks.length === 0,
    status: breaks.length === 0 ? 'PRESERVED' : 'REGRESSION_DETECTED',
    breaks,
    allowedUpdates
  };
}

// ============================================================================
// Phase 2 & Phase 3: Evidence-Driven Comprehensive Functional Preservation
// ============================================================================

export interface UserActionContract {
  id: string;
  type: 'SUBMIT' | 'CLICK' | 'DELETE' | 'EDIT' | 'EXPORT' | 'FILTER';
  targetSelector: string;
  sourceFile: string;
}

export interface ApiCallContract {
  endpoint: string;
  method: string;
  sourceFile: string;
}

export type PreservationDimensionName =
  | 'api_routes_and_methods'
  | 'authentication'
  | 'authorization_and_tenant_isolation'
  | 'forms_and_submit_behavior'
  | 'database_constraints_and_invariants'
  | 'business_rules'
  | 'user_interactions'
  | 'external_integration_contracts'
  | 'data_integrity'
  | 'relevant_test_coverage';

export interface DimensionPreservationVerdict {
  dimension: PreservationDimensionName;
  status: PreservationVerdictStatus;
  baselineCount: number;
  preservedCount: number;
  approvedRemovalsCount: number;
  missingElements: string[];
}

export interface ComprehensivePreservationContract {
  routes: Array<{ method: string; path: string; expectedStatus?: number }>;
  apiEndpoints: ApiCallContract[];
  userActions: UserActionContract[];
  formIdentifiers: string[];
  formFields?: Array<{ formId: string; fieldName: string; required: boolean }>;
  authGuards: string[];
  authorizationRules?: string[];
  databaseInvariants: string[];
  businessRules?: string[];
  dataIntegrityRules?: string[];
  testCoverageRefs?: string[];
}

export interface VerifyPreservationOptions {
  /**
   * Optional verified host human approval token authorizing specific element removals.
   * Model-provided strings or booleans are ignored; only a cryptographically verified
   * TrustedHumanApprovalToken with action 'APPROVE_PRESERVATION_REMOVAL' is accepted.
   */
  hostApprovalToken?: TrustedHumanApprovalToken;
  targetProject?: string;
}

export interface ComprehensivePreservationReport {
  preserved: boolean;
  status: PreservationVerdictStatus;
  score: number; // 0 - 100 (informational only; never overrides criticalViolations or INSUFFICIENT_EVIDENCE)
  routePreservationRate: number;
  actionPreservationRate: number;
  apiPreservationRate: number;
  criticalViolations: string[];
  warnings: string[];
  approvedRemovals?: string[];
  dimensionVerdicts: Record<PreservationDimensionName, DimensionPreservationVerdict>;
}

export function extractComprehensivePreservationContract(
  files: Array<{ path: string; content?: string }>
): ComprehensivePreservationContract {
  const baseContract = extractBehavioralContract(files);

  const apiEndpoints: ApiCallContract[] = [];
  const userActions: UserActionContract[] = [];
  const formIdentifiers = new Set<string>();
  const formFields: Array<{ formId: string; fieldName: string; required: boolean }> = [];
  const authGuards = new Set<string>();
  const authorizationRules = new Set<string>(
    baseContract.permissions.map((p) => `Role:${p.role}`)
  );
  const businessRules = new Set<string>(
    baseContract.businessRules.map((r: any) =>
      typeof r === 'string' ? r : `${r.ruleId}:${r.description}`
    )
  );
  const dataIntegrityRules = new Set<string>();
  const testCoverageRefs = new Set<string>();

  for (const file of files) {
    const content = file.content || '';
    const lowerPath = file.path.toLowerCase();

    // Extract Client-side / HTML routes: <a data-route="/orders" ...>
    const dataRouteMatches = content.matchAll(/data-route=['"]([^'"]+)['"]/gi);
    for (const match of dataRouteMatches) {
      if (match[1]) {
        baseContract.routes.push({
          method: 'GET',
          path: match[1],
          expectedStatus: 200
        });
      }
    }

    // Extract API calls (fetch, axios, $.ajax) with method sensitivity
    const fetchMatches = content.matchAll(
      /fetch\(\s*['"`]([^'"`]+)['"`](?:\s*,\s*\{[^}]*?\bmethod\s*:\s*['"`]([A-Za-z]+)['"`][^}]*\})?/g
    );
    for (const match of fetchMatches) {
      apiEndpoints.push({
        endpoint: match[1]!,
        method: (match[2] || 'GET').toUpperCase(),
        sourceFile: file.path
      });
    }

    const axiosMatches = content.matchAll(
      /(?:\$\.(ajax|get|post)|axios\.(get|post|put|delete|patch))\(\s*['"`]([^'"`]+)['"`]/gi
    );
    for (const match of axiosMatches) {
      const rawMethod = (match[1] || match[2] || 'ANY').toUpperCase();
      apiEndpoints.push({
        endpoint: match[3]!,
        method: rawMethod === 'AJAX' ? 'ANY' : rawMethod,
        sourceFile: file.path
      });
    }

    // Extract Forms and form input fields
    const formBlockMatches = content.matchAll(/<form\b([^>]*)>([\s\S]*?)<\/form>/gi);
    for (const match of formBlockMatches) {
      const attrs = match[1] || '';
      const formBody = match[2] || '';
      const idMatch = attrs.match(/(?:id|name)=['"]([^'"]+)['"]/i);
      const formId = idMatch?.[1] || `form-${formIdentifiers.size + 1}`;
      formIdentifiers.add(formId);
      userActions.push({
        id: `ACT-FORM-${formId}`,
        type: 'SUBMIT',
        targetSelector: `form#${formId}`,
        sourceFile: file.path
      });

      const inputMatches = formBody.matchAll(/<(?:input|select|textarea)\b([^>]*)>/gi);
      for (const inp of inputMatches) {
        const inpAttrs = inp[1] || '';
        const nameMatch = inpAttrs.match(/\b(?:name|id)=['"]([^'"]+)['"]/i);
        if (nameMatch?.[1]) {
          formFields.push({
            formId,
            fieldName: nameMatch[1],
            required: /\brequired\b/i.test(inpAttrs)
          });
        }
      }
    }

    // Fallback for unclosed or single-tag <form id="...">
    const simpleFormMatches = content.matchAll(/<form[^>]+(?:id|name)=['"]([^'"]+)['"]/gi);
    for (const match of simpleFormMatches) {
      if (match[1] && !formIdentifiers.has(match[1])) {
        formIdentifiers.add(match[1]);
        userActions.push({
          id: `ACT-FORM-${match[1]}`,
          type: 'SUBMIT',
          targetSelector: `form#${match[1]}`,
          sourceFile: file.path
        });
      }
    }

    // Extract User Actions (onclick / data-action)
    const actionMatches = content.matchAll(/(?:onclick|data-action)=['"]([^'"]+)['"]/gi);
    for (const match of actionMatches) {
      if (match[1]) {
        userActions.push({
          id: `ACT-EVT-${match[1]}`,
          type: match[1].toLowerCase().includes('delete')
            ? 'DELETE'
            : match[1].toLowerCase().includes('edit')
              ? 'EDIT'
              : 'CLICK',
          targetSelector: `[data-action="${match[1]}"]`,
          sourceFile: file.path
        });
      }
    }

    // Extract Auth guards
    if (/isAuthenticated|requireAuth|checkSession|useAuth|ProtectedRoute|auth\.middleware/i.test(content)) {
      authGuards.add(`AuthGuard:${file.path}`);
    }

    // Extract role / tenant hints in UI or server code
    const uiRoleMatches = content.matchAll(/Role:\s*([A-Za-z0-9_-]+)/g);
    for (const m of uiRoleMatches) {
      if (m[1]) authorizationRules.add(`Role:${m[1]}`);
    }

    // Extract Data Integrity & Validation handlers
    if (/preventDefault\(\)|\.reset\(\)|transaction\(|BEGIN\s+TRANSACTION/i.test(content)) {
      if (/preventDefault\(\)/i.test(content)) dataIntegrityRules.add('FormSubmit:preventDefault');
      if (/\.reset\(\)/i.test(content)) dataIntegrityRules.add('FormSubmit:resetState');
      if (/transaction\(|BEGIN\s+TRANSACTION/i.test(content)) dataIntegrityRules.add('Database:TransactionalMutation');
    }

    // Relevant test coverage
    if (lowerPath.includes('.test.') || lowerPath.includes('.spec.')) {
      testCoverageRefs.add(file.path);
    }
  }

  return {
    routes: baseContract.routes,
    apiEndpoints,
    userActions,
    formIdentifiers: Array.from(formIdentifiers),
    formFields,
    authGuards: Array.from(authGuards),
    authorizationRules: Array.from(authorizationRules),
    databaseInvariants: baseContract.databaseBehaviors.flatMap((db) =>
      (db.invariants || []).map((inv) => `${db.table}:${inv}`)
    ),
    businessRules: Array.from(businessRules),
    dataIntegrityRules: Array.from(dataIntegrityRules),
    testCoverageRefs: Array.from(testCoverageRefs)
  };
}

function getApprovedRemovalSet(options?: VerifyPreservationOptions): Set<string> {
  const approved = new Set<string>();
  if (!options?.hostApprovalToken) return approved;

  const verification = verifyHostHumanApproval({
    token: options.hostApprovalToken,
    expectedAction: 'APPROVE_PRESERVATION_REMOVAL',
    expectedProject: options.targetProject || options.hostApprovalToken.targetProject,
    requiredScope: options.hostApprovalToken.requestedScope,
    consumeNonce: false
  });

  if (verification.verified) {
    const scopes = Array.isArray(options.hostApprovalToken.requestedScope)
      ? options.hostApprovalToken.requestedScope
      : [options.hostApprovalToken.requestedScope];
    for (const item of scopes) {
      approved.add(item);
    }
  }
  return approved;
}

function evaluateDimension(
  dimension: PreservationDimensionName,
  baselineItems: string[],
  candidateHasItem: (item: string) => boolean,
  approvedSet: Set<string>,
  violationPrefix: string,
  criticalViolations: string[],
  approvedRemovals: string[]
): DimensionPreservationVerdict {
  if (baselineItems.length === 0) {
    return {
      dimension,
      status: 'NOT_APPLICABLE',
      baselineCount: 0,
      preservedCount: 0,
      approvedRemovalsCount: 0,
      missingElements: []
    };
  }

  let preservedCount = 0;
  let approvedRemovalsCount = 0;
  const missingElements: string[] = [];

  for (const item of baselineItems) {
    if (candidateHasItem(item)) {
      preservedCount++;
    } else if (approvedSet.has(item) || approvedSet.has(`${dimension}:${item}`)) {
      approvedRemovalsCount++;
      approvedRemovals.push(`${dimension}:${item}`);
    } else {
      missingElements.push(item);
      criticalViolations.push(`CRITICAL [${dimension}]: ${violationPrefix}: ${item}`);
    }
  }

  return {
    dimension,
    status: missingElements.length === 0 ? 'PRESERVED' : 'REGRESSION_DETECTED',
    baselineCount: baselineItems.length,
    preservedCount,
    approvedRemovalsCount,
    missingElements
  };
}

export function verifyComprehensivePreservation(
  baseline: ComprehensivePreservationContract,
  candidate: ComprehensivePreservationContract,
  options?: VerifyPreservationOptions
): ComprehensivePreservationReport {
  const criticalViolations: string[] = [];
  const warnings: string[] = [];
  const approvedRemovals: string[] = [];
  const approvedSet = getApprovedRemovalSet(options);

  const baselineRoutes = baseline.routes || [];
  const baselineApis = baseline.apiEndpoints || [];
  const baselineActions = baseline.userActions || [];
  const baselineForms = baseline.formIdentifiers || [];
  const baselineFormFields = baseline.formFields || [];
  const baselineAuthGuards = baseline.authGuards || [];
  const baselineAuthz = baseline.authorizationRules || [];
  const baselineDb = baseline.databaseInvariants || [];
  const baselineRules = baseline.businessRules || [];
  const baselineIntegrity = baseline.dataIntegrityRules || [];
  const baselineTests = baseline.testCoverageRefs || [];

  const totalBaselineElements =
    baselineRoutes.length +
    baselineApis.length +
    baselineActions.length +
    baselineForms.length +
    baselineFormFields.length +
    baselineAuthGuards.length +
    baselineAuthz.length +
    baselineDb.length +
    baselineRules.length +
    baselineIntegrity.length +
    baselineTests.length;

  // Empty or incomplete baseline cannot automatically result in PRESERVED
  if (totalBaselineElements === 0) {
    const emptyVerdicts = {} as Record<PreservationDimensionName, DimensionPreservationVerdict>;
    const allDims: PreservationDimensionName[] = [
      'api_routes_and_methods',
      'authentication',
      'authorization_and_tenant_isolation',
      'forms_and_submit_behavior',
      'database_constraints_and_invariants',
      'business_rules',
      'user_interactions',
      'external_integration_contracts',
      'data_integrity',
      'relevant_test_coverage'
    ];
    for (const dim of allDims) {
      emptyVerdicts[dim] = {
        dimension: dim,
        status: 'INSUFFICIENT_EVIDENCE',
        baselineCount: 0,
        preservedCount: 0,
        approvedRemovalsCount: 0,
        missingElements: []
      };
    }

    return {
      preserved: false,
      status: 'INSUFFICIENT_EVIDENCE',
      score: 0,
      routePreservationRate: 0,
      actionPreservationRate: 0,
      apiPreservationRate: 0,
      criticalViolations: [
        'INSUFFICIENT_EVIDENCE: Baseline preservation contract contains zero verifiable elements. Modernization cannot claim PRESERVED on an empty baseline.'
      ],
      warnings: [],
      approvedRemovals: [],
      dimensionVerdicts: emptyVerdicts
    };
  }

  const candidateRoutes = candidate.routes || [];
  const candidateApis = candidate.apiEndpoints || [];
  const candidateActions = candidate.userActions || [];
  const candidateForms = candidate.formIdentifiers || [];
  const candidateFormFields = candidate.formFields || [];
  const candidateAuthGuards = candidate.authGuards || [];
  const candidateAuthz = candidate.authorizationRules || [];
  const candidateDb = candidate.databaseInvariants || [];
  const candidateRules = candidate.businessRules || [];
  const candidateIntegrity = candidate.dataIntegrityRules || [];
  const candidateTests = candidate.testCoverageRefs || [];

  // 1. API Routes & HTTP Methods
  const routeKeys = baselineRoutes.map((r) => `[${r.method}] ${r.path}`);
  const candRouteKeys = new Set(candidateRoutes.map((r) => `[${r.method}] ${r.path}`));
  const routesVerdict = evaluateDimension(
    'api_routes_and_methods',
    routeKeys,
    (k) => candRouteKeys.has(k),
    approvedSet,
    'Baseline route missing in modernized app',
    criticalViolations,
    approvedRemovals
  );

  // 2. Authentication
  const authVerdict = evaluateDimension(
    'authentication',
    baselineAuthGuards,
    (g) => candidateAuthGuards.includes(g),
    approvedSet,
    'Authentication guard removed or bypassed',
    criticalViolations,
    approvedRemovals
  );

  // 3. Authorization & Tenant Isolation
  const authzVerdict = evaluateDimension(
    'authorization_and_tenant_isolation',
    baselineAuthz,
    (r) => candidateAuthz.includes(r),
    approvedSet,
    'Authorization role or tenant isolation guard removed',
    criticalViolations,
    approvedRemovals
  );

  // 4. Forms & Submit Behavior
  const formItems = [
    ...baselineForms.map((f) => `form#${f}`),
    ...baselineFormFields.map((ff) => `form#${ff.formId}[field=${ff.fieldName},required=${ff.required}]`)
  ];
  const candFormSet = new Set([
    ...candidateForms.map((f) => `form#${f}`),
    ...candidateFormFields.map((ff) => `form#${ff.formId}[field=${ff.fieldName},required=${ff.required}]`)
  ]);
  const formsVerdict = evaluateDimension(
    'forms_and_submit_behavior',
    formItems,
    (f) => candFormSet.has(f),
    approvedSet,
    'Form identifier or required field contract broken',
    criticalViolations,
    approvedRemovals
  );

  // 5. Database Constraints & Invariants
  const dbVerdict = evaluateDimension(
    'database_constraints_and_invariants',
    baselineDb,
    (d) => candidateDb.includes(d),
    approvedSet,
    'Database constraint or invariant removed',
    criticalViolations,
    approvedRemovals
  );

  // 6. Business Rules
  const rulesVerdict = evaluateDimension(
    'business_rules',
    baselineRules,
    (r) => candidateRules.includes(r),
    approvedSet,
    'Business rule removed',
    criticalViolations,
    approvedRemovals
  );

  // 7. User Interactions
  const actionKeys = baselineActions.map((a) => `${a.type}:${a.id}:${a.targetSelector}`);
  const actionsVerdict = evaluateDimension(
    'user_interactions',
    actionKeys,
    (key) => {
      const [, id, selector] = key.split(':');
      return candidateActions.some((c) => c.id === id || c.targetSelector === selector);
    },
    approvedSet,
    'User interaction action missing',
    criticalViolations,
    approvedRemovals
  );

  // 8. External Integration Contracts & Outbound API Calls (Blocking!)
  const apiKeys = baselineApis.map((a) => `${a.method || 'ANY'} ${a.endpoint}`);
  const apisVerdict = evaluateDimension(
    'external_integration_contracts',
    apiKeys,
    (key) => {
      const spaceIdx = key.indexOf(' ');
      const method = key.slice(0, spaceIdx);
      const endpoint = key.slice(spaceIdx + 1);
      return candidateApis.some(
        (c) =>
          c.endpoint === endpoint &&
          (method === 'ANY' || !c.method || c.method === 'ANY' || c.method === method)
      );
    },
    approvedSet,
    'Outbound API / external integration contract removed without verified user approval',
    criticalViolations,
    approvedRemovals
  );

  // 9. Data Integrity
  const integrityVerdict = evaluateDimension(
    'data_integrity',
    baselineIntegrity,
    (i) => candidateIntegrity.includes(i),
    approvedSet,
    'Data integrity or state-reset behavior removed',
    criticalViolations,
    approvedRemovals
  );

  // 10. Relevant Test Coverage
  const testsVerdict = evaluateDimension(
    'relevant_test_coverage',
    baselineTests,
    (t) => candidateTests.includes(t),
    approvedSet,
    'Relevant test suite removed',
    criticalViolations,
    approvedRemovals
  );

  const dimensionVerdicts: Record<PreservationDimensionName, DimensionPreservationVerdict> = {
    api_routes_and_methods: routesVerdict,
    authentication: authVerdict,
    authorization_and_tenant_isolation: authzVerdict,
    forms_and_submit_behavior: formsVerdict,
    database_constraints_and_invariants: dbVerdict,
    business_rules: rulesVerdict,
    user_interactions: actionsVerdict,
    external_integration_contracts: apisVerdict,
    data_integrity: integrityVerdict,
    relevant_test_coverage: testsVerdict
  };

  const routeRate =
    routesVerdict.baselineCount > 0
      ? ((routesVerdict.preservedCount + routesVerdict.approvedRemovalsCount) / routesVerdict.baselineCount) * 100
      : 100;
  const actionRate =
    actionsVerdict.baselineCount > 0
      ? ((actionsVerdict.preservedCount + actionsVerdict.approvedRemovalsCount) / actionsVerdict.baselineCount) * 100
      : 100;
  const apiRate =
    apisVerdict.baselineCount > 0
      ? ((apisVerdict.preservedCount + apisVerdict.approvedRemovalsCount) / apisVerdict.baselineCount) * 100
      : 100;

  const rawScore = Math.round(routeRate * 0.4 + actionRate * 0.4 + apiRate * 0.2);
  const preserved = criticalViolations.length === 0;
  const status: PreservationVerdictStatus = preserved ? 'PRESERVED' : 'REGRESSION_DETECTED';

  return {
    preserved,
    status,
    score: preserved ? rawScore : Math.min(rawScore, 69),
    routePreservationRate: Math.round(routeRate),
    actionPreservationRate: Math.round(actionRate),
    apiPreservationRate: Math.round(apiRate),
    criticalViolations,
    warnings,
    approvedRemovals,
    dimensionVerdicts
  };
}
