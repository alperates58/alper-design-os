import {
  OperatorDoctorReport,
  OperatorDoctorReportSchema,
  ExecutionMode
} from './types.js';
import { resolveBrowserRuntime, BrowserResolverOptions } from './browser-resolver.js';

export interface DoctorDiagnosticOptions extends BrowserResolverOptions {
  overrideDockerCapability?: 'AVAILABLE' | 'UNAVAILABLE';
  overrideDockerAgentExecution?: 'AVAILABLE' | 'RESTRICTED';
  overrideDockerHumanExecution?: 'AVAILABLE' | 'UNAVAILABLE';
  overrideBrowserCapability?: 'AVAILABLE' | 'UNAVAILABLE';
  overrideBrowserAgentExecution?: 'AVAILABLE' | 'RESTRICTED';
  overrideBrowserHumanExecution?: 'AVAILABLE' | 'UNAVAILABLE';
}

/**
 * Enhanced Doctor Diagnostic Engine:
 * Separates underlying system capability from agent execution authority.
 *
 * Distinguishes between:
 * - What the system is capable of (e.g. Docker installed, Edge installed)
 * - What an automated agent process can directly spawn (restricted by sandbox / Xcitium)
 * - What a human operator can execute directly in Windows PowerShell
 */
export function diagnoseOperatorExecutionEnvironment(options?: DoctorDiagnosticOptions): OperatorDoctorReport {
  const resolvedBrowser = resolveBrowserRuntime(options);

  // In the corporate environment:
  // Docker Engine is available on the machine, but child process execution by agent is restricted.
  // The human operator in Windows PowerShell can execute Docker.
  const dockerCapability = options?.overrideDockerCapability ?? 'AVAILABLE';
  const dockerAgentExecution = options?.overrideDockerAgentExecution ?? 'RESTRICTED';
  const dockerHumanExecution = options?.overrideDockerHumanExecution ?? 'AVAILABLE';

  // Browser Capability:
  // Microsoft Edge is available on Windows, but direct Playwright download of managed Chromium is blocked by security policy.
  // The human operator can launch Edge or run Playwright with channel: msedge.
  const browserCapability = options?.overrideBrowserCapability ?? (resolvedBrowser.isReady ? 'AVAILABLE' : 'UNAVAILABLE');
  const browserAgentExecution = options?.overrideBrowserAgentExecution ?? 'RESTRICTED';
  const browserHumanExecution = options?.overrideBrowserHumanExecution ?? (resolvedBrowser.isReady ? 'AVAILABLE' : 'UNAVAILABLE');

  // Determine recommended execution mode
  let recommendedMode: ExecutionMode = 'DIRECT_AGENT_EXECUTION';
  if (dockerAgentExecution === 'RESTRICTED' || browserAgentExecution === 'RESTRICTED') {
    recommendedMode = 'HUMAN_OPERATOR_EXECUTION';
  } else if (dockerCapability === 'UNAVAILABLE' && browserCapability === 'UNAVAILABLE') {
    recommendedMode = 'UNAVAILABLE';
  }

  const lines = [
    '========================================================',
    '  ALPER DESIGN OS - Execution & Capability Diagnostics',
    '========================================================',
    '',
    `Docker Capability ........ ${dockerCapability}`,
    `Docker Agent Execution ... ${dockerAgentExecution}`,
    `Docker Human Execution ... ${dockerHumanExecution}`,
    '',
    `Browser Capability ....... ${browserCapability}`,
    `Browser Agent Execution .. ${browserAgentExecution}`,
    `Browser Human Execution .. ${browserHumanExecution}`,
    '',
    `Browser Engine ........... ${resolvedBrowser.selectedBrowser} (${resolvedBrowser.version || 'unknown'})`,
    `Playwright Channel ....... ${resolvedBrowser.playwrightChannel || 'none'}`,
    '',
    `Recommended Mode ......... ${recommendedMode}`,
    '========================================================'
  ];

  const formattedReport = lines.join('\n');

  return OperatorDoctorReportSchema.parse({
    dockerCapability,
    dockerAgentExecution,
    dockerHumanExecution,
    browserCapability,
    browserAgentExecution,
    browserHumanExecution,
    resolvedBrowser,
    recommendedMode,
    formattedReport
  });
}
