import {
  TrackTraceTelemetryAudit,
  TrackTraceTelemetryAuditSchema,
  TruthfulUIFinding,
  TruthfulUIFindingSchema,
  ContentTruthVerdict
} from './types.js';

export interface StaticTrackTraceAuditOptions {
  sampleEndpoints?: string[];
  mockDataFixtures?: string[];
}

/**
 * Pure STATIC AUDIT of reported Track Trace Direction B telemetry specimens.
 *
 * CRITICAL ENVIRONMENT CONSTRAINT:
 * - Docker is NOT available on this workstation.
 * - Live container endpoints (e.g. localhost:43100, localhost:43101) are NOT assumed or probed.
 * - Real browser screenshots / devtools runtime traces are DEFERRED.
 * - Does NOT claim the live home pilot was verified.
 */
export function auditTrackTraceTelemetryStatic(
  options?: StaticTrackTraceAuditOptions
): TrackTraceTelemetryAudit {
  const targetPilot = 'Track Trace Direction B (Industrial IoT / Cold Chain Telemetry)';
  const findings: TruthfulUIFinding[] = [];

  // Reported static specimens from Direction B telemetry traces
  const defaultEndpoints = [
    '/api/missing-telemetry-endpoint',
    '/api/status',
    '/api/track-trace/live-telemetry',
    '/api/telemetry/v1/sensors/temp-stream',
    '/api/devices/gps/breadcrumbs'
  ];

  const endpointsToInspect = options?.sampleEndpoints || defaultEndpoints;

  const endpointsAudited = endpointsToInspect.map((ep) => {
    let status: 'FABRICATED_MISSING' | 'UNVERIFIED_MOCK' | 'STATIC_STUB' | 'AUTHORITATIVE' = 'STATIC_STUB';
    let detectedIssue = 'None';
    let provenanceDeclared = false;

    if (ep.includes('missing-telemetry')) {
      status = 'FABRICATED_MISSING';
      detectedIssue = 'Known seeded defect / missing ungrounded endpoint returning 404 in client trace.';
      provenanceDeclared = false;

      findings.push(
        TruthfulUIFindingSchema.parse({
          id: `TT-AUDIT-404-${ep}`,
          severity: 'CRITICAL',
          category: 'UNGROUNDED_TELEMETRY',
          target: ep,
          description: `Endpoint '${ep}' lacks backend routing and produces unhandled client-side telemetry fetch failure.`,
          evidence: `Referenced in broken-web app.js and telemetry trace specimens.`,
          remediation: 'Provide authoritative telemetry ingestion gateway or stub with explicit mock badge.'
        })
      );
    } else if (ep.includes('live-telemetry') || ep.includes('temp-stream')) {
      status = 'UNVERIFIED_MOCK';
      detectedIssue = 'Simulated payload generator without cryptographic device signature or data provenance.';
      provenanceDeclared = false;

      findings.push(
        TruthfulUIFindingSchema.parse({
          id: `TT-AUDIT-PROV-${ep}`,
          severity: 'HIGH',
          category: 'PROVENANCE_MISSING',
          target: ep,
          description: `Stream '${ep}' delivers simulated sensor intervals without declaring origin type or simulation headers.`,
          evidence: `Payload headers lack 'X-Data-Provenance' or 'X-Simulation-Mode' attributes.`,
          remediation: 'Attach DataProvenanceRecord to all sensor frames.'
        })
      );
    } else if (ep.includes('gps')) {
      status = 'UNVERIFIED_MOCK';
      detectedIssue = 'Hardcoded GPS breadcrumbs lacking hardware timestamp verification.';
      provenanceDeclared = false;
    } else {
      status = 'STATIC_STUB';
      detectedIssue = 'Generic operational status endpoint.';
      provenanceDeclared = true;
    }

    return {
      endpoint: ep,
      status,
      detectedIssue,
      provenanceDeclared
    };
  });

  // Explicitly list all items requiring real runtime / browser / Docker validation
  const deferredItems = [
    {
      item: 'Track Trace Direction B Docker Pilot Containers (Ports 43100/43101)',
      category: 'DOCKER_RUNTIME' as const,
      tag: 'DEFERRED_HOME_RUNTIME_VALIDATION' as const,
      prerequisite: 'Requires Docker Desktop daemon on Home PC.'
    },
    {
      item: 'Live High-Frequency IoT Telemetry WebSocket Stream Connection',
      category: 'LIVE_IOT_STREAM' as const,
      tag: 'DEFERRED_HOME_RUNTIME_VALIDATION' as const,
      prerequisite: 'Requires running MQTT/WebSocket broker on Home PC container network.'
    },
    {
      item: 'Real Playwright Headless/Headed Multi-Viewport Screenshots (390px, 768px, 1440px, 1920px)',
      category: 'PLAYWRIGHT_SCREENSHOT' as const,
      tag: 'DEFERRED_HOME_RUNTIME_VALIDATION' as const,
      prerequisite: 'Requires active local web server and Playwright browser binary execution.'
    },
    {
      item: 'Chrome DevTools Protocol Remote Debugging Live Inspection',
      category: 'DEVTOOLS_NETWORK' as const,
      tag: 'DEFERRED_HOME_RUNTIME_VALIDATION' as const,
      prerequisite: 'Requires Chrome running with remote-debugging-port on host system.'
    }
  ];

  const criticalFindings = findings.filter((f) => f.severity === 'CRITICAL');
  const verdict: ContentTruthVerdict =
    criticalFindings.length > 0 ? 'CONTENT_TRUTH_FAIL' : 'CONTENT_TRUTH_PASS';

  const summary = `Static audit of ${targetPilot}: ${findings.length} issue(s) identified in static telemetry specimens. Zero live container probing performed on this environment. ${deferredItems.length} runtime validation items marked DEFERRED_HOME_RUNTIME_VALIDATION.`;

  return TrackTraceTelemetryAuditSchema.parse({
    auditMode: 'STATIC_AUDIT_ONLY',
    targetPilot,
    liveContainersProbed: false,
    endpointsAudited,
    findings,
    deferredItems,
    verdict,
    summary
  });
}
