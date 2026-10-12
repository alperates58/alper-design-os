import {
  TruthfulUIPolicy,
  TruthfulUIPolicySchema,
  TruthfulUIFinding,
  TruthfulUIFindingSchema,
  TruthfulUIEvaluation,
  TruthfulUIEvaluationSchema,
  ContentTruthVerdict,
  DataProvenanceRecord
} from './types.js';

export interface UIComponentSpec {
  id: string;
  name: string;
  type: string;
  statusBadge?: string;
  trendDirection?: 'UP' | 'DOWN' | 'FLAT';
  semanticColor?: string; // e.g. "green", "red", "yellow"
  valueText?: string;
  isSimulated?: boolean;
  isLabeledMock?: boolean;
  hasLiveDataSource?: boolean;
  dataSourceUri?: string;
  provenance?: DataProvenanceRecord;
  metrics?: Record<string, any>;
}

export interface EvaluateTruthfulUIInput {
  components: UIComponentSpec[];
  policy?: Partial<TruthfulUIPolicy>;
  pageTitle?: string;
  cognitiveClutterScore?: number;
}

/**
 * Core Truthful UI Policy Evaluation engine.
 * Ensures strict integrity between visual presentation and underlying data realities.
 */
export function evaluateTruthfulUI(input: EvaluateTruthfulUIInput): TruthfulUIEvaluation {
  const policy: TruthfulUIPolicy = TruthfulUIPolicySchema.parse(input.policy || {});
  const findings: TruthfulUIFinding[] = [];

  let ungroundedTelemetryCount = 0;
  let deceptiveElementsCount = 0;
  let unlabeledMockCount = 0;

  for (const comp of input.components) {
    const isTelemetry =
      comp.type.toLowerCase().includes('telemetry') ||
      comp.type.toLowerCase().includes('sensor') ||
      comp.name.toLowerCase().includes('telemetry') ||
      comp.name.toLowerCase().includes('live status');

    // 1. Ungrounded Telemetry Detection
    if (isTelemetry) {
      const hasRealDataSource = comp.hasLiveDataSource && comp.dataSourceUri && !comp.dataSourceUri.includes('missing-telemetry');
      const hasVerifiedProvenance =
        comp.provenance &&
        (comp.provenance.authorityTier === 'AUTHORITATIVE_SYSTEM' ||
          comp.provenance.authorityTier === 'VERIFIED_EXTERNAL');

      if (!hasRealDataSource && !hasVerifiedProvenance && !comp.isLabeledMock) {
        ungroundedTelemetryCount++;
        findings.push(
          TruthfulUIFindingSchema.parse({
            id: `FINDING-TEL-${comp.id}`,
            severity: 'CRITICAL',
            category: 'UNGROUNDED_TELEMETRY',
            target: comp.id,
            description: `Telemetry component '${comp.name}' presents ungrounded metrics without an authentic data stream or mock disclosure.`,
            evidence: `Component URI: '${comp.dataSourceUri || 'NONE'}', Live: ${comp.hasLiveDataSource}`,
            remediation: 'Bind to an authenticated telemetry endpoint or attach explicit MOCK/SIMULATION indicator.'
          })
        );
      }
    }

    // 2. Missing Provenance on Critical Data Display
    if (policy.requireDeclaredProvenance && !comp.provenance && (comp.type.includes('chart') || comp.type.includes('grid') || isTelemetry)) {
      findings.push(
        TruthfulUIFindingSchema.parse({
          id: `FINDING-PROV-${comp.id}`,
          severity: 'HIGH',
          category: 'PROVENANCE_MISSING',
          target: comp.id,
          description: `Component '${comp.name}' displays data without an attached Data Provenance record.`,
          evidence: `Component has 0 provenance descriptors.`,
          remediation: 'Attach DataProvenanceRecord declaring origin type, authority tier, and timestamp.'
        })
      );
    }

    // 3. Unlabeled Mock / Synthetic Data
    if (policy.disallowUnlabeledMocks && (comp.isSimulated || comp.dataSourceUri?.includes('mock') || comp.dataSourceUri?.includes('fake'))) {
      if (!comp.isLabeledMock) {
        unlabeledMockCount++;
        findings.push(
          TruthfulUIFindingSchema.parse({
            id: `FINDING-MOCK-${comp.id}`,
            severity: 'HIGH',
            category: 'UNLABELED_MOCK',
            target: comp.id,
            description: `Synthetic/simulated data in '${comp.name}' is displayed without visible mock warning.`,
            evidence: `isSimulated=true, isLabeledMock=false`,
            remediation: 'Add [MOCK DATA] badge or simulateBanner in the UI header.'
          })
        );
      }
    }

    // 4. Semantic Mismatch & Deceptive Visuals
    // Example: Negative degradation shown with green color, or critical error styled as normal
    if (policy.enforceVisualSemanticTruth) {
      const textLower = (comp.valueText || comp.statusBadge || '').toLowerCase();
      const colorLower = (comp.semanticColor || '').toLowerCase();

      const indicatesDegradation =
        textLower.includes('error') ||
        textLower.includes('failure') ||
        textLower.includes('critical') ||
        textLower.includes('offline') ||
        textLower.includes('anomaly');

      if (indicatesDegradation && (colorLower === 'green' || colorLower === '#00ff00' || colorLower === 'success')) {
        deceptiveElementsCount++;
        findings.push(
          TruthfulUIFindingSchema.parse({
            id: `FINDING-SEM-${comp.id}`,
            severity: 'CRITICAL',
            category: 'SEMANTIC_MISMATCH',
            target: comp.id,
            description: `Deceptive semantic color: Component '${comp.name}' indicates error state '${textLower}' but uses green/success styling.`,
            evidence: `Text: '${comp.valueText || comp.statusBadge}', Color: '${comp.semanticColor}'`,
            remediation: 'Use red/danger semantic color tokens for degraded or error states.'
          })
        );
      }

      // Check trend contradiction
      if (comp.trendDirection === 'UP' && colorLower === 'red' && textLower.includes('growth')) {
        findings.push(
          TruthfulUIFindingSchema.parse({
            id: `FINDING-TREND-${comp.id}`,
            severity: 'MEDIUM',
            category: 'DECEPTIVE_VISUAL',
            target: comp.id,
            description: `Positive growth metric in '${comp.name}' visually flagged with danger red indicator.`,
            evidence: `Trend: UP, Color: red`,
            remediation: 'Align trend glyph color with metric domain semantics.'
          })
        );
      }
    }
  }

  // 5. Cognitive Clutter check
  const clutterScore = input.cognitiveClutterScore ?? 15;
  if (clutterScore > policy.maxPermissibleCognitiveClutterScore) {
    findings.push(
      TruthfulUIFindingSchema.parse({
        id: `FINDING-CLUTTER`,
        severity: 'MEDIUM',
        category: 'COGNITIVE_CLUTTER',
        target: input.pageTitle || 'PAGE_SHELL',
        description: `High cognitive clutter score (${clutterScore}) exceeds policy threshold (${policy.maxPermissibleCognitiveClutterScore}).`,
        evidence: `Score: ${clutterScore}, Threshold: ${policy.maxPermissibleCognitiveClutterScore}`,
        remediation: 'Prune secondary cards, reduce visual noise, and increase whitespace rhythm.'
      })
    );
  }

  // Determine Verdict
  const criticalFindings = findings.filter((f) => f.severity === 'CRITICAL');
  const highFindings = findings.filter((f) => f.severity === 'HIGH');

  let verdict: ContentTruthVerdict = 'CONTENT_TRUTH_PASS';
  let overallScore = 100;

  if (criticalFindings.length > 0) {
    verdict = 'CONTENT_TRUTH_FAIL';
    overallScore = Math.max(0, 100 - criticalFindings.length * 35 - highFindings.length * 15);
  } else if (highFindings.length > 0) {
    verdict = 'CONTENT_TRUTH_WARN';
    overallScore = Math.max(50, 100 - highFindings.length * 15 - findings.length * 5);
  }

  const summary =
    verdict === 'CONTENT_TRUTH_PASS'
      ? `Truthful UI Policy PASSED: 0 deceptive elements, verified data bindings across ${input.components.length} components.`
      : verdict === 'CONTENT_TRUTH_WARN'
      ? `Truthful UI Policy WARN (${overallScore}/100): ${highFindings.length} non-blocking concern(s) require review.`
      : `Truthful UI Policy FAILED (${overallScore}/100): ${criticalFindings.length} critical violation(s) identified (ungrounded telemetry / deceptive semantics).`;

  return TruthfulUIEvaluationSchema.parse({
    verdict,
    overallScore,
    findings,
    ungroundedTelemetryCount,
    deceptiveElementsCount,
    unlabeledMockCount,
    summary
  });
}
