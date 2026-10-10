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
