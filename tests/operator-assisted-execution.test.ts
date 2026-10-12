import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  createManualRunBundle,
  verifyManualRunEvidence,
  resolveBrowserRuntime,
  diagnoseOperatorExecutionEnvironment,
  redactText,
  MANDATORY_EVIDENCE_FILES
} from '@alper-design-os/agent-governance';
import * as MCPTools from '../packages/mcp-server/src/tools/index.js';

describe('Phase 1E.7.1: Operator-Assisted Execution Hotfix', () => {
  const testRunDir = path.resolve('.alper-design-os', 'test-manual-runs');

  beforeEach(() => {
    if (fs.existsSync(testRunDir)) {
      fs.rmSync(testRunDir, { recursive: true, force: true });
    }
  });

  afterEach(() => {
    if (fs.existsSync(testRunDir)) {
      fs.rmSync(testRunDir, { recursive: true, force: true });
    }
  });

  // 1. Direct Execution
  it('1. direct execution mode evaluates successfully when environment permits', () => {
    const report = diagnoseOperatorExecutionEnvironment({
      overrideDockerAgentExecution: 'AVAILABLE',
      overrideBrowserAgentExecution: 'AVAILABLE'
    });

    expect(report.dockerAgentExecution).toBe('AVAILABLE');
    expect(report.browserAgentExecution).toBe('AVAILABLE');
    expect(report.recommendedMode).toBe('DIRECT_AGENT_EXECUTION');
  });

  // 2. Human Operator Execution
  it('2. human operator execution is recommended when agent child-process execution is restricted', () => {
    const report = diagnoseOperatorExecutionEnvironment({
      overrideDockerAgentExecution: 'RESTRICTED',
      overrideBrowserAgentExecution: 'RESTRICTED'
    });

    expect(report.dockerCapability).toBe('AVAILABLE');
    expect(report.dockerAgentExecution).toBe('RESTRICTED');
    expect(report.dockerHumanExecution).toBe('AVAILABLE');
    expect(report.recommendedMode).toBe('HUMAN_OPERATOR_EXECUTION');
    expect(report.formattedReport).toContain('Recommended Mode ......... HUMAN_OPERATOR_EXECUTION');
  });

  // 3. Manual Run Pending
  it('3. manual run pending: creates bundle with RUN.ps1, README, expected-evidence and sets MANUAL_EXECUTION_REQUIRED', () => {
    const bundle = createManualRunBundle({
      runId: 'test-run-pending-01',
      baseDir: testRunDir
    });

    expect(bundle.status).toBe('MANUAL_EXECUTION_REQUIRED');
    expect(fs.existsSync(bundle.bundlePath)).toBe(true);
    expect(fs.existsSync(bundle.scriptPath)).toBe(true);
    expect(fs.existsSync(bundle.readmePath)).toBe(true);
    expect(fs.existsSync(path.join(bundle.bundlePath, 'evidence'))).toBe(true);

    // Initial verification check must indicate execution required
    const verifyResult = verifyManualRunEvidence(bundle.bundlePath);
    expect(verifyResult.status).toBe('MANUAL_EXECUTION_REQUIRED');
    expect(verifyResult.summary).toContain('Operator execution required');
  });

  // 4. Manual Evidence Verified
  it('4. manual evidence verified: authenticates human operator execution when valid evidence artifacts exist', () => {
    const bundle = createManualRunBundle({
      runId: 'test-run-verified-01',
      baseDir: testRunDir
    });

    const evidenceDir = path.join(bundle.bundlePath, 'evidence');

    // Populate valid simulated evidence artifacts
    fs.writeFileSync(path.join(evidenceDir, 'environment.json'), JSON.stringify({ nodeVersion: 'v24.19.0' }));
    fs.writeFileSync(path.join(evidenceDir, 'docker.json'), JSON.stringify({ dockerAvailable: true }));
    fs.writeFileSync(path.join(evidenceDir, 'build.log'), 'Build completed successfully. 0 errors.');
    fs.writeFileSync(path.join(evidenceDir, 'tests.log'), 'All 303 tests passed. 0 failures.');
    fs.writeFileSync(path.join(evidenceDir, 'benchmark.log'), 'Benchmark verification completed.');
    fs.writeFileSync(path.join(evidenceDir, 'mcp.json'), JSON.stringify({ status: 'AVAILABLE', totalTools: 88 }));
    fs.writeFileSync(path.join(evidenceDir, 'playwright.json'), JSON.stringify({ channel: 'msedge', status: 'VERIFIED' }));
    fs.writeFileSync(path.join(evidenceDir, 'browser.json'), JSON.stringify({ engine: 'SYSTEM_EDGE', version: '155.0.4283.45' }));
    fs.writeFileSync(path.join(evidenceDir, 'git-status.json'), JSON.stringify({ status: 'clean' }));

    const resultData = {
      executionMode: 'HUMAN_OPERATOR_EXECUTION',
      plannedBy: 'ANTIGRAVITY',
      executedBy: 'HUMAN_OPERATOR',
      verifiedBy: 'ALPER_DESIGN_OS',
      build: { status: 'PASS', exitCode: 0 },
      tests: { status: 'PASS', exitCode: 0 },
      mcp: { status: 'AVAILABLE' },
      docker: { status: 'AVAILABLE' },
      browser: { status: 'AVAILABLE', engine: 'SYSTEM_EDGE', version: '155.0.4283.45' },
      playwright: { status: 'VERIFIED', channel: 'msedge' },
      benchmark: { status: 'COMPLETED' },
      exitCode: 0,
      timestamp: new Date().toISOString()
    };
    fs.writeFileSync(path.join(evidenceDir, 'result.json'), JSON.stringify(resultData, null, 2));

    const verifyResult = verifyManualRunEvidence(bundle.bundlePath);
    expect(verifyResult.status).toBe('VERIFIED');
    expect(verifyResult.result?.verifiedBy).toBe('ALPER_DESIGN_OS');
    expect(verifyResult.result?.executedBy).toBe('HUMAN_OPERATOR');
    expect(verifyResult.missingFiles.length).toBe(0);
  });

  // 5. Missing Evidence
  it('5. missing evidence: detects incomplete evidence collection and flags missing files', () => {
    const bundle = createManualRunBundle({
      runId: 'test-run-missing-01',
      baseDir: testRunDir
    });

    const evidenceDir = path.join(bundle.bundlePath, 'evidence');

    // Only write a subset of evidence files (missing benchmark.log, playwright.json, result.json, etc.)
    fs.writeFileSync(path.join(evidenceDir, 'environment.json'), '{}');
    fs.writeFileSync(path.join(evidenceDir, 'build.log'), 'Build ok');

    const verifyResult = verifyManualRunEvidence(bundle.bundlePath);
    expect(verifyResult.status).toBe('MISSING_EVIDENCE');
    expect(verifyResult.missingFiles).toContain('benchmark.log');
    expect(verifyResult.missingFiles).toContain('result.json');
  });

  // 6. Failed Command
  it('6. failed command: flags non-zero exit code in result.json as FAILED', () => {
    const bundle = createManualRunBundle({
      runId: 'test-run-failed-01',
      baseDir: testRunDir
    });

    const evidenceDir = path.join(bundle.bundlePath, 'evidence');

    for (const f of MANDATORY_EVIDENCE_FILES) {
      if (f === 'result.json') {
        const failData = {
          executionMode: 'HUMAN_OPERATOR_EXECUTION',
          plannedBy: 'ANTIGRAVITY',
          executedBy: 'HUMAN_OPERATOR',
          verifiedBy: 'ALPER_DESIGN_OS',
          build: { status: 'FAIL' },
          tests: { status: 'FAIL' },
          docker: { status: 'AVAILABLE' },
          browser: { status: 'AVAILABLE' },
          playwright: { status: 'CONFIGURED' },
          benchmark: { status: 'FAILED' },
          exitCode: 1, // Non-zero exit code
          timestamp: new Date().toISOString()
        };
        fs.writeFileSync(path.join(evidenceDir, f), JSON.stringify(failData));
      } else {
        fs.writeFileSync(path.join(evidenceDir, f), 'sample log output');
      }
    }

    const verifyResult = verifyManualRunEvidence(bundle.bundlePath);
    expect(verifyResult.status).toBe('FAILED');
    expect(verifyResult.result?.exitCode).toBe(1);
    expect(verifyResult.summary).toContain('non-zero exit code');
  });

  // 7. Secret Redaction
  it('7. secret redaction: sanitizes sensitive keys and bearer tokens in logs', () => {
    const bundle = createManualRunBundle({
      runId: 'test-run-redact-01',
      baseDir: testRunDir
    });

    const dummyStripeKey = ['sk', 'test', 'dummysecretkey1234567890123'].join('_');
    const rawLog = `Connecting to Stripe ${dummyStripeKey} with Bearer secret_token_xyz_123456789`;
    const redacted = redactText(rawLog);

    expect(redacted.sanitized).not.toContain(dummyStripeKey);
    expect(redacted.sanitized).toContain('[REDACTED_STRIPE_KEY]');
    expect(redacted.sanitized).toContain('Bearer [REDACTED_TOKEN]');
    expect(redacted.count).toBeGreaterThanOrEqual(2);
  });

  // 8. Browser Edge Fallback
  it('8. browser Edge fallback: resolves system Edge when managed Chromium is blocked by security policy', () => {
    // Case A: Managed Chromium blocked by policy -> System Edge selected
    const edgeResolved = resolveBrowserRuntime({
      forceChromiumBlocked: true
    });

    expect(edgeResolved.resolutionChain[0].engine).toBe('MANAGED_CHROMIUM');
    expect(edgeResolved.resolutionChain[0].status).toBe('BLOCKED_BY_SECURITY_POLICY');

    // On Windows, system Edge is installed
    expect(edgeResolved.selectedBrowser).toBe('SYSTEM_EDGE');
    expect(edgeResolved.playwrightChannel).toBe('msedge');
    expect(edgeResolved.version).toBe('155.0.4283.45');
    expect(edgeResolved.isReady).toBe(true);

    // Case B: If Edge missing, falls back to Chrome
    const fakeChromePath = path.join(testRunDir, 'fake-chrome.exe');
    fs.mkdirSync(testRunDir, { recursive: true });
    fs.writeFileSync(fakeChromePath, 'dummy');

    const chromeResolved = resolveBrowserRuntime({
      forceChromiumBlocked: true,
      overrideEdgePath: 'C:\\non-existent\\edge.exe',
      overrideChromePath: fakeChromePath
    });

    expect(chromeResolved.selectedBrowser).toBe('SYSTEM_CHROME');
    expect(chromeResolved.playwrightChannel).toBe('chrome');

    // Case C: If all missing -> UNAVAILABLE
    const noneResolved = resolveBrowserRuntime({
      forceChromiumBlocked: true,
      overrideEdgePath: 'C:\\non-existent\\edge.exe',
      overrideChromePath: 'C:\\non-existent\\chrome.exe'
    });

    expect(noneResolved.selectedBrowser).toBe('UNAVAILABLE');
    expect(noneResolved.isReady).toBe(false);
  });

  // 9. MCP Tool Integration Handlers
  describe('MCP Tool Contracts for Operator Execution', () => {
    it('creates manual run bundle via handleCreateManualRunBundle', () => {
      const result = MCPTools.handleCreateManualRunBundle({
        runId: 'mcp-test-run-01',
        plannedObjective: 'Verify Track Trace Docker runtime'
      });
      expect(result.runId).toBe('mcp-test-run-01');
      expect(result.status).toBe('MANUAL_EXECUTION_REQUIRED');
    });

    it('verifies manual run evidence via handleVerifyManualRunEvidence', () => {
      const result = MCPTools.handleVerifyManualRunEvidence({
        runIdOrPath: 'mcp-test-run-01'
      });
      expect(result.status).toBeDefined();
    });

    it('resolves browser runtime via handleResolveBrowserRuntime', () => {
      const result = MCPTools.handleResolveBrowserRuntime({
        forceChromiumBlocked: true
      });
      expect(result.selectedBrowser).toBe('SYSTEM_EDGE');
      expect(result.playwrightChannel).toBe('msedge');
    });

    it('executes doctor diagnostics via handleRunOperatorDoctor', () => {
      const result = MCPTools.handleRunOperatorDoctor({
        overrideDockerCapability: 'AVAILABLE',
        overrideBrowserCapability: 'AVAILABLE'
      });
      expect(result.recommendedMode).toBe('HUMAN_OPERATOR_EXECUTION');
      expect(result.formattedReport).toContain('Docker Capability');
    });
  });

  // 10. Operator Execution Bug Fixes & Governance Regression Suite
  describe('Operator Execution Bug Fixes & Governance Regression Suite', () => {
    // 1. MCP runtime check import success
    it('1. MCP runtime check import success: canonical toolRegistry exported with 88 tools', () => {
      expect(MCPTools.toolRegistry).toBeDefined();
      expect(MCPTools.toolRegistry.size).toBe(88);
      expect(MCPTools.toolRegistry.has('run_operator_doctor')).toBe(true);
      expect(MCPTools.toolRegistry.has('create_manual_run_bundle')).toBe(true);
      expect(MCPTools.toolRegistry.has('verify_manual_run_evidence')).toBe(true);
    });

    // 2. Runtime child step fails -> final VERIFIED olamaz
    it('2. runtime child step fails: non-zero exit code or sub-step failure strictly prevents VERIFIED status', () => {
      const bundle = createManualRunBundle({
        runId: 'test-reg-fail-step',
        baseDir: testRunDir
      });
      const evidenceDir = path.join(bundle.bundlePath, 'evidence');

      for (const f of MANDATORY_EVIDENCE_FILES) {
        if (f !== 'result.json') {
          fs.writeFileSync(path.join(evidenceDir, f), 'sample-data');
        }
      }

      const failingResult = {
        executionMode: 'HUMAN_OPERATOR_EXECUTION',
        plannedBy: 'ANTIGRAVITY',
        executedBy: 'HUMAN_OPERATOR',
        verifiedBy: 'ALPER_DESIGN_OS',
        build: { status: 'PASS', exitCode: 0 },
        tests: { status: 'PASS', exitCode: 0 },
        runtimeCheck: { status: 'FAIL', exitCode: 1 },
        docker: { status: 'AVAILABLE' },
        mcp: { status: 'AVAILABLE' },
        browser: { status: 'AVAILABLE', engine: 'SYSTEM_EDGE', version: '155.0.4283.45' },
        playwright: { status: 'VERIFIED', channel: 'msedge' },
        benchmark: { status: 'FAILED' },
        exitCode: 1,
        timestamp: new Date().toISOString()
      };
      fs.writeFileSync(path.join(evidenceDir, 'result.json'), JSON.stringify(failingResult));

      const verification = verifyManualRunEvidence(bundle.bundlePath);
      expect(verification.status).toBe('FAILED');
      expect(verification.status).not.toBe('VERIFIED');
    });

    // 3. Mandatory evidence missing -> MISSING_EVIDENCE
    it('3. mandatory evidence missing: returns MISSING_EVIDENCE when any required artifact is absent', () => {
      const bundle = createManualRunBundle({
        runId: 'test-reg-missing-art',
        baseDir: testRunDir
      });
      const evidenceDir = path.join(bundle.bundlePath, 'evidence');
      fs.writeFileSync(path.join(evidenceDir, 'environment.json'), '{}');

      const verification = verifyManualRunEvidence(bundle.bundlePath);
      expect(verification.status).toBe('MISSING_EVIDENCE');
      expect(verification.missingFiles.length).toBeGreaterThan(0);
    });

    // 4. All mandatory evidence + exit codes OK -> VERIFIED
    it('4. all mandatory evidence + exit codes OK: returns VERIFIED', () => {
      const bundle = createManualRunBundle({
        runId: 'test-reg-all-ok',
        baseDir: testRunDir
      });
      const evidenceDir = path.join(bundle.bundlePath, 'evidence');

      for (const f of MANDATORY_EVIDENCE_FILES) {
        if (f !== 'result.json') {
          fs.writeFileSync(path.join(evidenceDir, f), JSON.stringify({ ok: true }));
        }
      }

      const validResult = {
        executionMode: 'HUMAN_OPERATOR_EXECUTION',
        plannedBy: 'ANTIGRAVITY',
        executedBy: 'HUMAN_OPERATOR',
        verifiedBy: 'ALPER_DESIGN_OS',
        build: { status: 'PASS', exitCode: 0 },
        tests: { status: 'PASS', exitCode: 0 },
        runtimeCheck: { status: 'PASS', exitCode: 0 },
        docker: { status: 'AVAILABLE' },
        mcp: { status: 'AVAILABLE' },
        browser: { status: 'AVAILABLE', engine: 'SYSTEM_EDGE', version: '155.0.4283.45' },
        playwright: { status: 'VERIFIED', channel: 'msedge' },
        benchmark: { status: 'COMPLETED' },
        exitCode: 0,
        timestamp: new Date().toISOString()
      };
      fs.writeFileSync(path.join(evidenceDir, 'result.json'), JSON.stringify(validResult));

      const verification = verifyManualRunEvidence(bundle.bundlePath);
      expect(verification.status).toBe('VERIFIED');
      expect(verification.missingFiles.length).toBe(0);
    });

    // 5. browser.json missing -> VERIFIED olamaz
    it('5. browser.json missing: strictly blocks VERIFIED status', () => {
      const bundle = createManualRunBundle({
        runId: 'test-reg-no-browser',
        baseDir: testRunDir
      });
      const evidenceDir = path.join(bundle.bundlePath, 'evidence');

      for (const f of MANDATORY_EVIDENCE_FILES) {
        if (f !== 'browser.json') {
          fs.writeFileSync(path.join(evidenceDir, f), JSON.stringify({ ok: true }));
        }
      }

      const verification = verifyManualRunEvidence(bundle.bundlePath);
      expect(verification.status).toBe('MISSING_EVIDENCE');
      expect(verification.missingFiles).toContain('browser.json');
      expect(verification.status).not.toBe('VERIFIED');
    });

    // 6. playwright.json missing -> VERIFIED olamaz
    it('6. playwright.json missing: strictly blocks VERIFIED status', () => {
      const bundle = createManualRunBundle({
        runId: 'test-reg-no-playwright',
        baseDir: testRunDir
      });
      const evidenceDir = path.join(bundle.bundlePath, 'evidence');

      for (const f of MANDATORY_EVIDENCE_FILES) {
        if (f !== 'playwright.json') {
          fs.writeFileSync(path.join(evidenceDir, f), JSON.stringify({ ok: true }));
        }
      }

      const verification = verifyManualRunEvidence(bundle.bundlePath);
      expect(verification.status).toBe('MISSING_EVIDENCE');
      expect(verification.missingFiles).toContain('playwright.json');
      expect(verification.status).not.toBe('VERIFIED');
    });

    // 7. mcp.json missing -> VERIFIED olamaz
    it('7. mcp.json missing: strictly blocks VERIFIED status', () => {
      const bundle = createManualRunBundle({
        runId: 'test-reg-no-mcp',
        baseDir: testRunDir
      });
      const evidenceDir = path.join(bundle.bundlePath, 'evidence');

      for (const f of MANDATORY_EVIDENCE_FILES) {
        if (f !== 'mcp.json') {
          fs.writeFileSync(path.join(evidenceDir, f), JSON.stringify({ ok: true }));
        }
      }

      const verification = verifyManualRunEvidence(bundle.bundlePath);
      expect(verification.status).toBe('MISSING_EVIDENCE');
      expect(verification.missingFiles).toContain('mcp.json');
      expect(verification.status).not.toBe('VERIFIED');
    });
  });
});
