import { describe, it, expect } from 'vitest';
import {
  evaluateTruthfulUI,
  auditDataProvenance,
  createDataProvenanceRecord,
  createPageIntent,
  auditPageIntent,
  auditInformationRelevance,
  classifySourceAuthority,
  createVisualApprovalRecord,
  recordVisualReview,
  evaluateVisualApprovalGate,
  evaluateContentTruthGate,
  auditTrackTraceTelemetryStatic,
  planPipeline
} from '@alper-design-os/agent-governance';
import * as MCPTools from '../packages/mcp-server/src/tools/index.js';

describe('Phase 1E.7: Truthful UI, Content Integrity & Governance', () => {
  describe('1. Truthful UI Policy Evaluation', () => {
    it('passes clean UI with authentic data bindings and correct semantic colors', () => {
      const evaluation = evaluateTruthfulUI({
        components: [
          {
            id: 'kpi-1',
            name: 'Active Sensors',
            type: 'sensor-kpi',
            hasLiveDataSource: true,
            dataSourceUri: 'https://api.iot.factory.internal/v1/sensors/active',
            provenance: createDataProvenanceRecord({
              fieldOrComponentId: 'kpi-1',
              originType: 'AUTHORITATIVE_API',
              endpointOrSource: 'https://api.iot.factory.internal/v1/sensors/active'
            }),
            semanticColor: 'green',
            valueText: '1,420 Active'
          }
        ]
      });

      expect(evaluation.verdict).toBe('CONTENT_TRUTH_PASS');
      expect(evaluation.overallScore).toBe(100);
      expect(evaluation.ungroundedTelemetryCount).toBe(0);
      expect(evaluation.findings.length).toBe(0);
    });

    it('fails when ungrounded telemetry is presented without authentic stream or mock disclosure', () => {
      const evaluation = evaluateTruthfulUI({
        components: [
          {
            id: 'tel-card',
            name: 'Live Telemetry Rate',
            type: 'telemetry-stream',
            hasLiveDataSource: false,
            isSimulated: true,
            isLabeledMock: false,
            dataSourceUri: '/api/missing-telemetry-endpoint'
          }
        ]
      });

      expect(evaluation.verdict).toBe('CONTENT_TRUTH_FAIL');
      expect(evaluation.ungroundedTelemetryCount).toBeGreaterThanOrEqual(1);
      expect(evaluation.findings.some((f) => f.category === 'UNGROUNDED_TELEMETRY')).toBe(true);
    });

    it('flags semantic mismatch when critical errors are styled with success green tokens', () => {
      const evaluation = evaluateTruthfulUI({
        components: [
          {
            id: 'alarm-badge',
            name: 'System Anomaly Monitor',
            type: 'status-badge',
            statusBadge: 'Critical Failure Detected',
            semanticColor: 'green'
          }
        ]
      });

      expect(evaluation.verdict).toBe('CONTENT_TRUTH_FAIL');
      expect(evaluation.deceptiveElementsCount).toBeGreaterThanOrEqual(1);
      expect(evaluation.findings.some((f) => f.category === 'SEMANTIC_MISMATCH')).toBe(true);
    });

    it('warns when synthetic data is rendered without visible mock label', () => {
      const evaluation = evaluateTruthfulUI({
        components: [
          {
            id: 'mock-grid',
            name: 'Transactions Table',
            type: 'grid',
            isSimulated: true,
            isLabeledMock: false,
            dataSourceUri: '/fixtures/mock-transactions.json'
          }
        ]
      });

      expect(evaluation.verdict).toBe('CONTENT_TRUTH_WARN');
      expect(evaluation.unlabeledMockCount).toBe(1);
      expect(evaluation.findings.some((f) => f.category === 'UNLABELED_MOCK')).toBe(true);
    });
  });

  describe('2. Data Provenance Model', () => {
    it('creates and audits valid authoritative provenance records', () => {
      const record = createDataProvenanceRecord({
        fieldOrComponentId: 'temp-sensor-01',
        originType: 'AUTHORITATIVE_API',
        endpointOrSource: 'https://api.factory.com/sensors/temp'
      });

      expect(record.authorityTier).toBe('AUTHORITATIVE_SYSTEM');
      expect(record.confidenceScore).toBeGreaterThanOrEqual(0.9);

      const audit = auditDataProvenance([record]);
      expect(audit.isCompliant).toBe(true);
      expect(audit.authoritativeCount).toBe(1);
      expect(audit.violations.length).toBe(0);
    });

    it('blocks ungrounded or fabricated telemetry in provenance audits', () => {
      const record = createDataProvenanceRecord({
        fieldOrComponentId: 'unverified-telemetry-feed',
        originType: 'FABRICATED_UNGROUNDED',
        endpointOrSource: 'http://fake-telemetry.local/feed'
      });

      expect(record.authorityTier).toBe('HALLUCINATED_OR_FABRICATED');
      const audit = auditDataProvenance([record]);
      expect(audit.isCompliant).toBe(false);
      expect(audit.fabricatedCount).toBe(1);
      expect(audit.violations.some((v) => v.severity === 'CRITICAL')).toBe(true);
    });
  });

  describe('3. Page Intent Model', () => {
    it('validates OPERATIONAL_MONITORING intent against live components and flags forbidden gimmicks', () => {
      const intent = createPageIntent({
        intentType: 'OPERATIONAL_MONITORING',
        primaryGoal: 'Monitor distributed manufacturing sensors in real time',
        targetAudience: 'Reliability Engineers'
      });

      const auditPass = auditPageIntent(intent, [
        {
          id: 'sensor-grid',
          type: 'DATA_TABLE',
          role: 'sensor-stream-grid',
          originType: 'TELEMETRY_STREAM',
          isSimulated: false
        }
      ]);
      expect(auditPass.matchesIntent).toBe(true);
      expect(auditPass.alignmentScore).toBe(100);

      const auditFail = auditPageIntent(intent, [
        {
          id: 'decorative-gauge',
          type: 'GAUGE',
          role: 'marketing-hero',
          originType: 'FABRICATED_UNGROUNDED',
          isSimulated: true,
          visualGimmicks: ['UNCONNECTED_ANALOG_GAUGE']
        }
      ]);
      expect(auditFail.matchesIntent).toBe(false);
      expect(auditFail.forbiddenGimmicksFound.length).toBeGreaterThan(0);
    });
  });

  describe('4. Information Relevance Model', () => {
    it('scores primary metrics high and penalizes deceptive or noisy filler elements', () => {
      const intent = createPageIntent({
        intentType: 'OPERATIONAL_MONITORING',
        primaryGoal: 'Real-time incident response',
        targetAudience: 'Operations Center'
      });

      const audit = auditInformationRelevance(intent, [
        {
          id: 'core-telemetry',
          title: 'Reactor Core Temperature',
          role: 'telemetry-stream'
        },
        {
          id: 'noisy-filler',
          title: 'Motivational Quote of the Day',
          role: 'filler-card',
          isFiller: true
        },
        {
          id: 'fake-metric',
          title: 'Fabricated Global Happiness Index',
          role: 'fake-stat',
          isDeceptive: true
        }
      ]);

      expect(audit.passed).toBe(false);
      expect(audit.deceptiveCount).toBe(1);
      expect(audit.noiseCount).toBe(1);
      expect(audit.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('5. Source Authority Classification', () => {
    it('accurately categorizes sources into appropriate tiers', () => {
      const authoritative = classifySourceAuthority({
        sourceId: 'src-prod-db',
        isProductionEndpoint: true,
        hasAuthHeaders: true
      });
      expect(authoritative.authorityTier).toBe('AUTHORITATIVE_SYSTEM');
      expect(authoritative.isAuthoritative).toBe(true);
      expect(authoritative.allowedForProduction).toBe(true);

      const verifiedExt = classifySourceAuthority({
        sourceId: 'src-stripe-api',
        urlOrPath: 'https://api.stripe.com/v1/charges'
      });
      expect(verifiedExt.authorityTier).toBe('VERIFIED_EXTERNAL');
      expect(verifiedExt.isAuthoritative).toBe(true);

      const synthetic = classifySourceAuthority({
        sourceId: 'src-mock-benchmark',
        urlOrPath: '/benchmarks/fixtures/seeded.json',
        isMock: true
      });
      expect(synthetic.authorityTier).toBe('SYNTHETIC_MOCK');
      expect(synthetic.allowedForProduction).toBe(false);

      const fabricated = classifySourceAuthority({
        sourceId: 'fake-telemetry-stream',
        urlOrPath: '/api/missing-telemetry-endpoint'
      });
      expect(fabricated.authorityTier).toBe('HALLUCINATED_OR_FABRICATED');
      expect(fabricated.trustScore).toBe(0);
    });
  });

  describe('6. Human Visual Approval Gate', () => {
    it('defaults to NOT_REVIEWED and prevents unapproved release', () => {
      const record = createVisualApprovalRecord();
      expect(record.status).toBe('NOT_REVIEWED');
      expect(record.canRelease).toBe(false);

      const check = evaluateVisualApprovalGate(record, true);
      expect(check.gateStatus).toBe('PENDING');
      expect(check.status).toBe('NOT_REVIEWED');
    });

    it('strictly forbids automated bot from granting approval', () => {
      const record = createVisualApprovalRecord();

      expect(() => {
        recordVisualReview(record, {
          status: 'APPROVED',
          reviewedBy: 'CI-RUNNER-BOT'
        });
      }).toThrow(/Security Violation: Automated bot/i);
    });

    it('permits release only when authentic human reviewer verifies all quality criteria', () => {
      const record = createVisualApprovalRecord();

      const approvedRecord = recordVisualReview(record, {
        status: 'APPROVED',
        reviewedBy: 'Alper Ates (Lead Designer)',
        viewportsReviewed: ['390x844', '768x1024', '1440x900', '1920x1080'],
        notes: 'Verified typography scale, spacing rhythm, and data provenance.',
        criteriaChecked: {
          layoutStability: true,
          typographyHierarchy: true,
          colorContrast: true,
          responsiveFidelity: true,
          truthfulnessVisualAffordance: true
        }
      });

      expect(approvedRecord.status).toBe('APPROVED');
      expect(approvedRecord.canRelease).toBe(true);

      const check = evaluateVisualApprovalGate(approvedRecord, true);
      expect(check.gateStatus).toBe('PASSED');
    });
  });

  describe('7. CONTENT_TRUTH_PASS Governance Release Gate', () => {
    it('evaluates release gate and passes when all truthfulness criteria are satisfied', () => {
      const gateResult = evaluateContentTruthGate({
        components: [
          {
            id: 'status-card',
            name: 'Device Status',
            type: 'status-indicator',
            hasLiveDataSource: true,
            dataSourceUri: 'https://api.devices.internal/status',
            provenance: createDataProvenanceRecord({
              fieldOrComponentId: 'status-card',
              originType: 'AUTHORITATIVE_API',
              endpointOrSource: 'https://api.devices.internal/status'
            }),
            semanticColor: 'green',
            valueText: 'Operational'
          }
        ],
        requireVisualApproval: false
      });

      expect(gateResult.verdict).toBe('CONTENT_TRUTH_PASS');
      expect(gateResult.passed).toBe(true);
    });

    it('blocks gate release when ungrounded telemetry or provenance failure occurs', () => {
      const gateResult = evaluateContentTruthGate({
        components: [
          {
            id: 'bad-stream',
            name: 'Unconnected IoT Feed',
            type: 'telemetry-stream',
            hasLiveDataSource: false,
            dataSourceUri: '/api/missing-telemetry-endpoint'
          }
        ],
        requireVisualApproval: false
      });

      expect(gateResult.verdict).toBe('CONTENT_TRUTH_FAIL');
      expect(gateResult.passed).toBe(false);
    });
  });

  describe('8. Governance Pipeline Planning Integration', () => {
    it('includes CONTENT_TRUTH_VERIFY and HUMAN_VISUAL_APPROVAL in UI pipeline plan', () => {
      const plan = planPipeline({
        objective: 'Build High-density Industrial IoT UI Telemetry Dashboard',
        riskLevel: 'HIGH',
        uxProfile: { density: 'HIGH' },
        qualityProfile: { isMissionCritical: true }
      });

      expect(plan.activeStages).toContain('CONTENT_TRUTH_VERIFY');
      expect(plan.activeStages).toContain('HUMAN_VISUAL_APPROVAL');
    });
  });

  describe('9. Track Trace Direction B Static Telemetry Audit', () => {
    it('executes static audit on reported telemetry without probing live container network', () => {
      const audit = auditTrackTraceTelemetryStatic();

      expect(audit.auditMode).toBe('STATIC_AUDIT_ONLY');
      expect(audit.liveContainersProbed).toBe(false);
      expect(audit.findings.some((f) => f.target.includes('missing-telemetry'))).toBe(true);

      // Verify all runtime/docker items are properly tagged DEFERRED_HOME_RUNTIME_VALIDATION
      expect(audit.deferredItems.length).toBeGreaterThan(0);
      for (const item of audit.deferredItems) {
        expect(item.tag).toBe('DEFERRED_HOME_RUNTIME_VALIDATION');
      }
    });
  });

  describe('10. MCP Tool Integration Handlers', () => {
    it('invokes handleEvaluateTruthfulUi via MCP contract', () => {
      const result = MCPTools.handleEvaluateTruthfulUi({
        components: [
          {
            id: 'c1',
            name: 'Overview Metric',
            type: 'kpi',
            semanticColor: 'green',
            valueText: 'Healthy'
          }
        ]
      });
      expect(result.verdict).toBeDefined();
    });

    it('invokes handleAuditDataProvenance via MCP contract', () => {
      const result = MCPTools.handleAuditDataProvenance({
        records: [
          {
            fieldOrComponentId: 'field-1',
            originType: 'AUTHORITATIVE_API',
            endpointOrSource: 'https://api.example.com'
          }
        ]
      });
      expect(result.totalFieldsAudited).toBe(1);
    });

    it('invokes handleEvaluatePageIntent via MCP contract', () => {
      const result = MCPTools.handleEvaluatePageIntent({
        intentType: 'OPERATIONAL_MONITORING',
        primaryGoal: 'Track equipment telemetry',
        targetAudience: 'Technicians',
        components: [
          {
            id: 'stream-1',
            type: 'GRID',
            role: 'sensor-grid',
            originType: 'TELEMETRY_STREAM'
          }
        ]
      });
      expect(result.matchesIntent).toBe(true);
    });

    it('invokes handleAuditInformationRelevance via MCP contract', () => {
      const result = MCPTools.handleAuditInformationRelevance({
        intentType: 'OPERATIONAL_MONITORING',
        primaryGoal: 'Quick diagnostics',
        elements: [
          {
            id: 'el-1',
            title: 'Sensor Status',
            role: 'sensor'
          }
        ]
      });
      expect(result.passed).toBe(true);
    });

    it('invokes handleClassifySourceAuthority via MCP contract', () => {
      const result = MCPTools.handleClassifySourceAuthority({
        sourceId: 'src-iot-stream',
        isProductionEndpoint: true,
        hasAuthHeaders: true
      });
      expect(result.authorityTier).toBe('AUTHORITATIVE_SYSTEM');
    });

    it('invokes handleEvaluateContentTruthGate via MCP contract', () => {
      const result = MCPTools.handleEvaluateContentTruthGate({
        components: [],
        requireVisualApproval: false
      });
      expect(result.verdict).toBe('CONTENT_TRUTH_PASS');
      expect(result.passed).toBe(true);
    });

    it('invokes handleManageHumanVisualApproval via MCP contract', () => {
      const result = MCPTools.handleManageHumanVisualApproval({
        action: 'GET_STATUS'
      });
      expect(result.record.status).toBe('NOT_REVIEWED');
      expect(result.gateResult.gateStatus).toBe('PENDING');
    });

    it('invokes handleAuditTrackTraceTelemetry via MCP contract', () => {
      const result = MCPTools.handleAuditTrackTraceTelemetry({});
      expect(result.auditMode).toBe('STATIC_AUDIT_ONLY');
      expect(result.deferredItems.length).toBeGreaterThan(0);
    });
  });
});
