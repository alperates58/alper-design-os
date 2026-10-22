import {
  BehavioralContract,
  BehavioralContractSchema
} from './types.js';

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
    const aspnetMatches = content.matchAll(/\[Http(Get|Post|Put|Delete)\(["']?([^"'\)]*)["']?\)\]/gi);
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
    if (normPath.includes('migration') || normPath.includes('schema')) {
      const tableMatches = content.matchAll(/create_table\s*\(?['"]([^'"]+)['"]|CREATE TABLE (?:IF NOT EXISTS )?`?([a-zA-Z0-9_]+)`?/gi);
      for (const match of tableMatches) {
        const tbl = match[1] || match[2];
        if (tbl) {
          databaseBehaviors.push({
            table: tbl,
            invariants: ['Primary key preservation', 'Foreign key constraints intact']
          });
        }
      }
    }

    // 3. Permissions / Roles
    if (/role|permission|can\(|hasRole|authorize/i.test(content)) {
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
  breaks: string[];
  allowedUpdates: string[];
} {
  const breaks: string[] = [];
  const allowedUpdates: string[] = [];

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

  // 3. Note added routes
  for (const candRoute of candidate.routes) {
    const isNew = !baseline.routes.some(r => r.path === candRoute.path && r.method === candRoute.method);
    if (isNew) {
      allowedUpdates.push(`Non-breaking route addition: [${candRoute.method}] ${candRoute.path}`);
    }
  }

  return {
    preserved: breaks.length === 0,
    breaks,
    allowedUpdates
  };
}

// ============================================================================
// Phase 2: Comprehensive Functional Preservation Extension
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

export interface ComprehensivePreservationContract {
  routes: Array<{ method: string; path: string; expectedStatus?: number }>;
  apiEndpoints: ApiCallContract[];
  userActions: UserActionContract[];
  formIdentifiers: string[];
  authGuards: string[];
  databaseInvariants: string[];
}

export interface ComprehensivePreservationReport {
  preserved: boolean;
  score: number; // 0 - 100
  routePreservationRate: number;
  actionPreservationRate: number;
  apiPreservationRate: number;
  criticalViolations: string[];
  warnings: string[];
}

export function extractComprehensivePreservationContract(
  files: Array<{ path: string; content?: string }>
): ComprehensivePreservationContract {
  const baseContract = extractBehavioralContract(files);

  const apiEndpoints: ApiCallContract[] = [];
  const userActions: UserActionContract[] = [];
  const formIdentifiers = new Set<string>();
  const authGuards = new Set<string>();

  for (const file of files) {
    const content = file.content || '';

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

    // Extract API calls (fetch, axios, $.ajax)
    const fetchMatches = content.matchAll(/(?:fetch|\$\.(?:ajax|get|post)|axios\.(?:get|post|put|delete))\(\s*['"`]([^'"`]+)['"`]/g);
    for (const match of fetchMatches) {
      apiEndpoints.push({
        endpoint: match[1],
        method: 'ANY',
        sourceFile: file.path
      });
    }

    // Extract User Actions (form submit, click buttons, delete triggers)
    const formMatches = content.matchAll(/<form[^>]+(?:id|name)=['"]([^'"]+)['"]/gi);
    for (const match of formMatches) {
      formIdentifiers.add(match[1]);
      userActions.push({
        id: `ACT-FORM-${match[1]}`,
        type: 'SUBMIT',
        targetSelector: `form#${match[1]}`,
        sourceFile: file.path
      });
    }

    const actionMatches = content.matchAll(/(?:onclick|data-action)=['"]([^'"]+)['"]/gi);
    for (const match of actionMatches) {
      userActions.push({
        id: `ACT-EVT-${match[1]}`,
        type: match[1].toLowerCase().includes('delete') ? 'DELETE' : match[1].toLowerCase().includes('edit') ? 'EDIT' : 'CLICK',
        targetSelector: `[data-action="${match[1]}"]`,
        sourceFile: file.path
      });
    }

    // Extract Auth guards
    if (/isAuthenticated|requireAuth|checkSession|useAuth|ProtectedRoute/i.test(content)) {
      authGuards.add(`AuthGuard:${file.path}`);
    }
  }

  return {
    routes: baseContract.routes,
    apiEndpoints,
    userActions,
    formIdentifiers: Array.from(formIdentifiers),
    authGuards: Array.from(authGuards),
    databaseInvariants: baseContract.databaseBehaviors.flatMap((db) => db.invariants || [])
  };
}

export function verifyComprehensivePreservation(
  baseline: ComprehensivePreservationContract,
  candidate: ComprehensivePreservationContract
): ComprehensivePreservationReport {
  const criticalViolations: string[] = [];
  const warnings: string[] = [];

  // 1. Verify Routes
  let preservedRoutes = 0;
  for (const r of baseline.routes) {
    const exists = candidate.routes.some((c) => c.path === r.path && c.method === r.method);
    if (exists) {
      preservedRoutes++;
    } else {
      criticalViolations.push(`CRITICAL: Baseline route missing in modernized app: [${r.method}] ${r.path}`);
    }
  }
  const routeRate = baseline.routes.length > 0 ? (preservedRoutes / baseline.routes.length) * 100 : 100;

  // 2. Verify Actions
  let preservedActions = 0;
  for (const a of baseline.userActions) {
    const exists = candidate.userActions.some((c) => c.id === a.id || c.targetSelector === a.targetSelector);
    if (exists) {
      preservedActions++;
    } else {
      criticalViolations.push(`CRITICAL: User interaction action missing: ${a.type} on ${a.targetSelector}`);
    }
  }
  const actionRate = baseline.userActions.length > 0 ? (preservedActions / baseline.userActions.length) * 100 : 100;

  // 3. Verify API calls
  let preservedApis = 0;
  for (const api of baseline.apiEndpoints) {
    const exists = candidate.apiEndpoints.some((c) => c.endpoint === api.endpoint);
    if (exists) {
      preservedApis++;
    } else {
      warnings.push(`WARNING: Outbound API call not found in modernized source: ${api.endpoint}`);
    }
  }
  const apiRate = baseline.apiEndpoints.length > 0 ? (preservedApis / baseline.apiEndpoints.length) * 100 : 100;

  // 4. Verify Auth guards
  for (const guard of baseline.authGuards) {
    if (!candidate.authGuards.includes(guard)) {
      criticalViolations.push(`SECURITY: Authentication guard removed or bypassed: ${guard}`);
    }
  }

  const score = Math.round(routeRate * 0.4 + actionRate * 0.4 + apiRate * 0.2);

  return {
    preserved: criticalViolations.length === 0,
    score,
    routePreservationRate: Math.round(routeRate),
    actionPreservationRate: Math.round(actionRate),
    apiPreservationRate: Math.round(apiRate),
    criticalViolations,
    warnings
  };
}
