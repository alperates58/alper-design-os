import { seedSources } from './catalog.js';
import { rankSources, scoreSource, ScoreContext } from './ranking.js';
import {
  LicenseCheckResult,
  McpSelectionResult,
  RankedSource,
  RankingWeights,
  SourceDiscoveryFilter,
  SourceMetadata
} from './types.js';

export class SourceIntelligenceEngine {
  private static instance: SourceIntelligenceEngine;
  private sources: Map<string, SourceMetadata> = new Map();

  private constructor() {
    this.loadCatalog(seedSources);
  }

  public static getInstance(): SourceIntelligenceEngine {
    if (!SourceIntelligenceEngine.instance) {
      SourceIntelligenceEngine.instance = new SourceIntelligenceEngine();
    }
    return SourceIntelligenceEngine.instance;
  }

  public loadCatalog(sources: SourceMetadata[]): void {
    sources.forEach((s) => this.sources.set(s.id, s));
  }

  public getAllSources(): SourceMetadata[] {
    return Array.from(this.sources.values());
  }

  public inspectSource(sourceId: string): SourceMetadata | undefined {
    return (
      this.sources.get(sourceId) ||
      this.sources.get(`src-${sourceId}`) ||
      Array.from(this.sources.values()).find(
        (s) => s.id === sourceId || s.id === `src-${sourceId}` || s.id.includes(sourceId)
      )
    );
  }

  public discoverSources(filter: SourceDiscoveryFilter = {}): SourceMetadata[] {
    let result = Array.from(this.sources.values());

    if (filter.type) {
      result = result.filter((s) => s.type === filter.type);
    }

    if (filter.types && filter.types.length > 0) {
      result = result.filter((s) => filter.types!.includes(s.type));
    }

    if (filter.framework) {
      const fw = filter.framework.toLowerCase();
      result = result.filter(
        (s) =>
          s.frameworks.some((f) => f.toLowerCase().includes(fw) || f.toLowerCase().includes('agnostic'))
      );
    }

    if (filter.domain) {
      const dm = filter.domain.toUpperCase();
      result = result.filter((s) => s.domains.includes(dm) || s.domains.includes('GLOBAL_WEB'));
    }

    if (filter.accessibilityLevel) {
      result = result.filter((s) => s.accessibilityLevel === filter.accessibilityLevel);
    }

    if (filter.usageMode) {
      result = result.filter((s) => s.usageMode === filter.usageMode);
    }

    if (filter.minTrustScore) {
      result = result.filter((s) => s.trustScore >= filter.minTrustScore!);
    }

    if (filter.maxLicenseRisk === 'PERMISSIVE_ONLY') {
      result = result.filter((s) => s.codeReuseAllowed && s.modificationAllowed);
    }

    if (filter.searchQuery) {
      const q = filter.searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.strengths.some((st) => st.toLowerCase().includes(q))
      );
    }

    return result;
  }

  public searchSources(
    queryOrFilter: string | (SourceDiscoveryFilter & { query?: string }),
    maybeFilter: SourceDiscoveryFilter = {}
  ): SourceMetadata[] {
    let query: string | undefined;
    let filter: SourceDiscoveryFilter = {};

    if (typeof queryOrFilter === 'string') {
      query = queryOrFilter;
      filter = maybeFilter;
    } else if (typeof queryOrFilter === 'object' && queryOrFilter !== null) {
      query = (queryOrFilter as any).searchQuery || (queryOrFilter as any).query;
      filter = { ...queryOrFilter, searchQuery: query };
    }

    return this.discoverSources({ ...filter, searchQuery: query });
  }

  public rankSources(options: {
    framework?: string;
    domain?: string;
    requiredAccessibilityLevel?: string;
    commercialAllowedOnly?: boolean;
    weights?: Partial<RankingWeights>;
  } = {}): RankedSource[] {
    let sources = Array.from(this.sources.values());
    if (options.commercialAllowedOnly) {
      sources = sources.filter((s) => s.codeReuseAllowed && s.modificationAllowed);
    }
    return rankSources(sources, {
      targetFramework: options.framework,
      targetDomain: options.domain,
      weights: options.weights,
      requirePermissiveLicense: options.commercialAllowedOnly
    });
  }

  public recommendSourcesForProduct(profile: any): RankedSource[] {
    const isDenseOrIndustrial =
      profile.domainClassification === 'INDUSTRIAL_OPERATIONAL' ||
      profile.domainClassification === 'FINTECH' ||
      profile.informationDensity === 'HIGH' ||
      profile.informationDensity === 'EXTREME';

    const candidates = Array.from(this.sources.values());

    const context: ScoreContext = {
      targetDomain: profile.domainClassification || profile.domain,
      targetFramework: profile.framework,
      requirePermissiveLicense: profile.commercialUse ?? profile.commercialAllowedOnly,
      weights: isDenseOrIndustrial
        ? {
            trust: 0.25,
            accessibility: 0.25,
            domainCompatibility: 0.20,
            documentation: 0.15,
            maintenance: 0.15,
            stackCompatibility: 0.0,
            licenseCompatibility: 0.0
          }
        : undefined
    };

    return rankSources(candidates, context);
  }

  public recommendSourcesForStack(framework: string, domain?: string): RankedSource[] {
    const candidates = Array.from(this.sources.values());
    return rankSources(candidates, {
      targetFramework: framework,
      targetDomain: domain
    });
  }

  public checkSourceLicense(
    sourceOrLicense:
      | string
      | {
          license?: string;
          codeReuseAllowed?: boolean;
          modificationAllowed?: boolean;
          redistributionAllowed?: boolean;
          attributionRequired?: boolean;
        }
  ): LicenseCheckResult {
    let lic = '';
    let reuse = false;
    let mod = false;
    let redist = false;
    let attr = false;

    if (typeof sourceOrLicense === 'string') {
      lic = sourceOrLicense;
      reuse = true;
      mod = true;
      redist = true;
    } else {
      lic = sourceOrLicense.license || 'UNKNOWN';
      reuse = sourceOrLicense.codeReuseAllowed ?? false;
      mod = sourceOrLicense.modificationAllowed ?? false;
      redist = sourceOrLicense.redistributionAllowed ?? false;
      attr = sourceOrLicense.attributionRequired ?? false;
    }

    const lower = lic.toLowerCase();
    const isPermissive = ['mit', 'apache', 'bsd', 'isc', 'unlicense', 'cc0'].some((p) =>
      lower.includes(p)
    );
    const isCopyleft = ['gpl', 'agpl', 'lgpl', 'mpl', 'epl'].some((c) => lower.includes(c));
    const isProprietary = lower.includes('proprietary') || lower.includes('commercial-only');
    const commercialUseAllowed = isPermissive || (reuse && !isProprietary);

    return {
      license: lic,
      isPermissive,
      isCopyleft,
      codeReuseAllowed: reuse,
      allowsCodeReuse: reuse,
      commercialUseAllowed,
      allowsCommercialUse: commercialUseAllowed,
      attributionRequired: attr,
      compatibleWithCommercialEnterprise: isPermissive && commercialUseAllowed,
      notes: isPermissive
        ? 'Permissive open-source license allows commercial reuse and modification.'
        : isCopyleft
          ? 'Copyleft open-source license requires reciprocal distribution if modified.'
          : 'Proprietary or restricted license. Check license terms before usage.'
    };
  }

  public selectMcpServers(
    arg1: string | { need: string; catalog: any[]; minimumTrustScore?: number; allowedLicenses?: string[] },
    arg2?: any[]
  ): any {
    if (typeof arg1 === 'object' && arg1 !== null) {
      const needDescription = arg1.need;
      const catalog = arg1.catalog || [];
      const minTrust = arg1.minimumTrustScore ?? 70;
      const allowedLicenses = arg1.allowedLicenses;

      const scored = catalog.map((mcp) => {
        const lowerNeed = needDescription.toLowerCase();
        let relevanceScore = 40;
        let needJustification = `Evaluated against need: "${needDescription}"`;

        const mcpCorpus = [
          mcp.name || '',
          mcp.description || '',
          mcp.category || '',
          ...(mcp.tags || []),
          ...(mcp.capabilities || [])
        ].join(' ').toLowerCase();

        if (lowerNeed.includes('database') || lowerNeed.includes('sql') || lowerNeed.includes('postgres')) {
          if (mcpCorpus.includes('postgres') || mcpCorpus.includes('sql') || mcpCorpus.includes('database')) {
            relevanceScore = 95;
            needJustification = 'Direct match for database querying and schema inspection requirement.';
          }
        }
        if (lowerNeed.includes('git') || lowerNeed.includes('version') || lowerNeed.includes('pull request')) {
          if (mcpCorpus.includes('github') || mcpCorpus.includes('git') || mcpCorpus.includes('pull-requests')) {
            relevanceScore = Math.max(relevanceScore, 95);
            needJustification = 'Direct match for GitHub repository and PR synchronization requirement.';
          }
        }
        if (lowerNeed.includes('file') || lowerNeed.includes('disk') || lowerNeed.includes('directory')) {
          if (mcpCorpus.includes('filesystem') || mcpCorpus.includes('files')) {
            relevanceScore = Math.max(relevanceScore, 90);
            needJustification = 'Match for sandboxed local file operations.';
          }
        }

        const trustScore = typeof mcp.trustScore === 'number' ? mcp.trustScore : (mcp.license?.commercialUseAllowed ? 90 : 60);
        const lic = typeof mcp.license === 'string' ? mcp.license : (mcp.license?.type || 'MIT');
        const licenseAllowed = allowedLicenses ? allowedLicenses.includes(lic) : true;
        const pass = relevanceScore >= 70 && trustScore >= minTrust && licenseAllowed;

        return {
          id: mcp.id,
          mcpId: mcp.id || 'mcp-unknown',
          name: mcp.name || 'Unnamed MCP',
          needJustification,
          relevanceScore,
          trustScore,
          license: lic,
          maintenance: 'ACTIVE' as const,
          security: mcp.id?.includes('filesystem') ? ('LOCAL_SYSTEM' as const) : ('SANDBOXED' as const),
          recommended: pass
        };
      });

      return {
        selected: scored.filter((s) => s.recommended),
        rejected: scored.filter((s) => !s.recommended)
      };
    }

    const needDescription = arg1;
    const availableMcps = arg2 || [];
    const lowerNeed = needDescription.toLowerCase();

    return availableMcps.map((mcp) => {
      let relevanceScore = 40;
      let needJustification = `Evaluated against need: "${needDescription}"`;

      const mcpCorpus = [
        mcp.name || '',
        mcp.description || '',
        mcp.category || '',
        ...(mcp.tags || []),
        ...(mcp.capabilities || [])
      ].join(' ').toLowerCase();

      if (lowerNeed.includes('database') || lowerNeed.includes('sql') || lowerNeed.includes('postgres')) {
        if (mcpCorpus.includes('postgres') || mcpCorpus.includes('sql') || mcpCorpus.includes('database')) {
          relevanceScore = 95;
          needJustification = 'Direct match for database querying and schema inspection requirement.';
        }
      } else if (lowerNeed.includes('git') || lowerNeed.includes('version') || lowerNeed.includes('pull request')) {
        if (mcpCorpus.includes('github') || mcpCorpus.includes('git')) {
          relevanceScore = 95;
          needJustification = 'Direct match for GitHub repository and PR synchronization requirement.';
        }
      } else if (lowerNeed.includes('file') || lowerNeed.includes('disk') || lowerNeed.includes('directory')) {
        if (mcpCorpus.includes('filesystem') || mcpCorpus.includes('files')) {
          relevanceScore = 90;
          needJustification = 'Match for sandboxed local file operations.';
        }
      } else if ((mcp.tags || []).some((tag: string) => lowerNeed.includes(tag.toLowerCase()))) {
        relevanceScore = 75;
      }

      const trustScore = typeof mcp.trustScore === 'number' ? mcp.trustScore : (mcp.license?.commercialUseAllowed ? 90 : 60);
      const recommended = relevanceScore >= 70 && trustScore >= 70;

      return {
        id: mcp.id,
        mcpId: mcp.id || 'mcp-unknown',
        name: mcp.name || 'Unnamed MCP',
        needJustification,
        relevanceScore,
        trustScore,
        license: typeof mcp.license === 'string' ? mcp.license : (mcp.license?.type || 'MIT'),
        maintenance: 'ACTIVE' as const,
        security: mcp.id?.includes('filesystem') ? ('LOCAL_SYSTEM' as const) : ('SANDBOXED' as const),
        recommended
      };
    }).sort((a: any, b: any) => b.relevanceScore - a.relevanceScore);
  }
}

export const sourceIntelligenceEngine = SourceIntelligenceEngine.getInstance();
export const checkSourceLicense = (input: any) => sourceIntelligenceEngine.checkSourceLicense(input);

export default SourceIntelligenceEngine;

