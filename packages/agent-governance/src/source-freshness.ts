import {
  SourceMetadata,
  SourceFreshnessStatus
} from '@alper-design-os/source-intelligence';

export interface FreshnessEvaluation {
  sourceId: string;
  sourceName: string;
  status: SourceFreshnessStatus;
  lastUpdated: string;
  daysSinceUpdate: number;
  recommendation: string;
}

export function evaluateSourceFreshness(
  source: SourceMetadata,
  options?: { isOffline?: boolean; currentDate?: string }
): FreshnessEvaluation {
  const now = options?.currentDate ? new Date(options.currentDate) : new Date();
  const updatedDate = new Date(source.lastUpdated || '2026-01-01');

  const diffMs = Math.max(0, now.getTime() - updatedDate.getTime());
  const daysSinceUpdate = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let status: SourceFreshnessStatus = source.updateStatus || 'CURRENT';
  let recommendation = 'Source is up to date with modern standards.';

  if (options?.isOffline) {
    if (daysSinceUpdate > 365) {
      status = 'STALE';
      recommendation = `Offline mode: Source cached metadata is ${daysSinceUpdate} days old. Verify upstream when network is restored.`;
    } else {
      status = 'CURRENT';
      recommendation = 'Offline mode: Operating from validated local source cache.';
    }
  } else {
    // Online heuristics
    if (source.version && source.latestKnownVersion && source.version !== source.latestKnownVersion) {
      status = 'UPDATE_AVAILABLE';
      recommendation = `New upstream version available: ${source.latestKnownVersion} (current: ${source.version}).`;
    } else if (daysSinceUpdate > 365) {
      status = 'STALE';
      recommendation = `Source has not been updated in ${daysSinceUpdate} days. Re-verify component patterns against current browser specs.`;
    } else if (daysSinceUpdate > 180) {
      status = 'CURRENT';
      recommendation = 'Source is mature and within acceptable revision cycle.';
    }
  }

  return {
    sourceId: source.id,
    sourceName: source.name,
    status,
    lastUpdated: source.lastUpdated,
    daysSinceUpdate,
    recommendation
  };
}

export function auditCatalogFreshness(
  sources: SourceMetadata[],
  options?: { isOffline?: boolean }
): {
  summary: string;
  totalAudited: number;
  staleCount: number;
  updateAvailableCount: number;
  evaluations: FreshnessEvaluation[];
} {
  const evaluations = sources.map(s => evaluateSourceFreshness(s, options));
  const staleCount = evaluations.filter(e => e.status === 'STALE').length;
  const updateAvailableCount = evaluations.filter(e => e.status === 'UPDATE_AVAILABLE').length;

  const summary = `Audited ${sources.length} sources: ${staleCount} STALE, ${updateAvailableCount} UPDATE_AVAILABLE, ${
    sources.length - staleCount - updateAvailableCount
  } CURRENT.`;

  return {
    summary,
    totalAudited: sources.length,
    staleCount,
    updateAvailableCount,
    evaluations
  };
}
