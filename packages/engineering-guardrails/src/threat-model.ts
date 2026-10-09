import { ThreatModel, ThreatModelSchema } from './types.js';

export interface ThreatModelInput {
  productName: string;
  domain: string;
  assets?: string[];
  entryPoints?: string[];
  isPublicFacing?: boolean;
}

export function createThreatModel(input: ThreatModelInput): ThreatModel {
  const assets = input.assets && input.assets.length > 0
    ? input.assets
    : ['User Credentials & Session Tokens', 'Customer PII Data', 'Core Business Operational Database', 'API Key & Secrets'];

  const entryPoints = input.entryPoints && input.entryPoints.length > 0
    ? input.entryPoints
    : ['Public Web Application UI', 'REST / GraphQL API Endpoints', 'Authentication & OAuth Callback Handlers', 'Third-Party Webhooks'];

  const threats = [
    {
      id: 'THREAT-STRIDE-SPOOF-01',
      category: 'SPOOFING' as const,
      description: 'Adversary uses stolen JWT or session cookie to impersonate an authorized operator.',
      impact: 'HIGH' as const,
      mitigation: 'Implement HttpOnly, SameSite=Strict cookies with cryptographic signature validation and token revocation checks.',
      status: 'MITIGATED' as const
    },
    {
      id: 'THREAT-STRIDE-TAMP-01',
      category: 'TAMPERING' as const,
      description: 'Adversary tampers with client-side state parameters to bypass validation rules.',
      impact: 'CRITICAL' as const,
      mitigation: 'Strict server-side validation; treat client payload as untrusted input.',
      status: 'MITIGATED' as const
    },
    {
      id: 'THREAT-STRIDE-REP-01',
      category: 'REPUDIATION' as const,
      description: 'Critical business transaction executed without non-repudiable audit logging.',
      impact: 'MEDIUM' as const,
      mitigation: 'Immutable append-only audit trail logging user identity, IP address, timestamp, and transaction diffs.',
      status: 'MITIGATED' as const
    },
    {
      id: 'THREAT-STRIDE-INFO-01',
      category: 'INFO_DISCLOSURE' as const,
      description: 'Detailed stack trace, environment variables, or database schema leaked in 500 error responses.',
      impact: 'HIGH' as const,
      mitigation: 'Generic user-facing error pages; detailed stack traces sent exclusively to internal telemetry streams.',
      status: 'MITIGATED' as const
    },
    {
      id: 'THREAT-STRIDE-DOS-01',
      category: 'DENIAL_OF_SERVICE' as const,
      description: 'Unauthenticated actor floods heavy query endpoint causing resource exhaustion.',
      impact: 'HIGH' as const,
      mitigation: 'IP and token-based rate limiting, pagination ceilings, and query timeout limits.',
      status: 'MITIGATED' as const
    },
    {
      id: 'THREAT-STRIDE-ELEV-01',
      category: 'ELEVATION_OF_PRIVILEGE' as const,
      description: 'Broken Object Level Authorization (BOLA) allows tenant A to read or alter tenant B resources.',
      impact: 'CRITICAL' as const,
      mitigation: 'Mandatory tenant-scoping middleware and attribute-based access control (ABAC) on every data fetch.',
      status: 'MITIGATED' as const
    }
  ];

  const recommendations = [
    'Enforce OWASP ASVS 5.0.0 Level 2 baseline verification across all API endpoints',
    'Activate automated secret scanning in pre-commit hooks and CI/CD pipelines',
    'Implement Content-Security-Policy (CSP) headers without unsafe-inline or unsafe-eval',
    'Ensure all dependency updates pass vulnerability audits and lockfile verification'
  ];

  const model: ThreatModel = {
    productName: input.productName,
    domain: input.domain,
    assessedAt: new Date().toISOString(),
    assets,
    entryPoints,
    threats,
    recommendations
  };

  return ThreatModelSchema.parse(model);
}
