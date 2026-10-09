import { AuditFinding, ToolCapability } from '../types.js';

export interface ScanTarget {
  projectDir?: string;
  targetUrl?: string;
  files?: Array<{ path: string; content: string }>;
}

export interface ScanOptions {
  mode?: 'PASSIVE' | 'ACTIVE';
  environment?: 'LOCALHOST' | 'DEVELOPMENT' | 'STAGING' | 'PRODUCTION';
  userExplicitApproval?: boolean;
  severityThreshold?: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface ScanResult {
  tool: string;
  category: string;
  executionMode: 'PASSIVE' | 'ACTIVE';
  success: boolean;
  summary: string;
  findings: AuditFinding[];
  durationMs: number;
}

export interface BaseScannerAdapter {
  readonly id: string;
  readonly name: string;
  readonly category: 'SAST' | 'SCA' | 'SECRET' | 'DAST' | 'PERFORMANCE';

  detectCapability(): Promise<ToolCapability>;
  runScan(target: ScanTarget, options?: ScanOptions): Promise<ScanResult>;
}
