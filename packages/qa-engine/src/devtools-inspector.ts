import { ConsoleEvent, NetworkEvent } from './types.js';

export interface RuntimeDiagnostics {
  isClean: boolean;
  totalErrors: number;
  totalWarnings: number;
  failedRequestsCount: number;
  corsViolationsCount: number;
  cspViolationsCount: number;
  slowRequestsCount: number;
  duplicateRequestsCount: number;
  summary: string;
  insights: string[];
}

export function analyzeRuntimeDiagnostics(
  consoleEvents: ConsoleEvent[] = [],
  networkEvents: NetworkEvent[] = []
): RuntimeDiagnostics {
  const insights: string[] = [];

  // 1. Console Error Analysis
  const errors = consoleEvents.filter((e) => e.type === 'error' || e.type === 'exception');
  const warnings = consoleEvents.filter((e) => e.type === 'warning');

  for (const err of errors) {
    if (err.text.includes('Uncaught') || err.text.includes('TypeError') || err.text.includes('ReferenceError')) {
      insights.push(`[Console Exception] ${err.text} ${err.location ? `at ${err.location}` : ''}`);
    } else if (err.text.includes('Content Security Policy')) {
      insights.push(`[CSP Violation in Console] ${err.text}`);
    } else {
      insights.push(`[Console Error] ${err.text}`);
    }
  }

  // 2. Network Request Analysis
  const failedRequests = networkEvents.filter((n) => n.failed || n.status >= 400);
  const corsFailures = networkEvents.filter((n) => n.corsFailure);
  const cspViolations = networkEvents.filter((n) => n.cspViolation);
  const slowRequests = networkEvents.filter((n) => n.durationMs > 1000);

  for (const req of failedRequests) {
    insights.push(`[HTTP ${req.status}] Failed request: ${req.method} ${req.url} (${req.errorDescription || 'HTTP error'})`);
  }

  for (const cors of corsFailures) {
    insights.push(`[CORS Blocked] Cross-Origin request blocked by browser policy: ${cors.url}`);
  }

  for (const slow of slowRequests) {
    insights.push(`[Slow API Endpoint] ${slow.method} ${slow.url} took ${slow.durationMs}ms (> 1000ms threshold)`);
  }

  // Duplicate request detection
  const urlCounts = new Map<string, number>();
  for (const req of networkEvents) {
    if (req.method === 'GET') {
      urlCounts.set(req.url, (urlCounts.get(req.url) || 0) + 1);
    }
  }
  let duplicateCount = 0;
  for (const [url, count] of urlCounts.entries()) {
    if (count > 2) {
      duplicateCount += count - 1;
      insights.push(`[Duplicate Request Detected] GET ${url} was requested ${count} times simultaneously`);
    }
  }

  const isClean = errors.length === 0 && failedRequests.length === 0 && corsFailures.length === 0;

  const summary = isClean
    ? `Runtime inspection PASSED: Console is clean with 0 unhandled errors, and 0 failed network requests.`
    : `Runtime inspection FLAGGED issues: ${errors.length} console error(s) and ${failedRequests.length} failed HTTP request(s).`;

  return {
    isClean,
    totalErrors: errors.length,
    totalWarnings: warnings.length,
    failedRequestsCount: failedRequests.length,
    corsViolationsCount: corsFailures.length,
    cspViolationsCount: cspViolations.length,
    slowRequestsCount: slowRequests.length,
    duplicateRequestsCount: duplicateCount,
    summary,
    insights
  };
}
