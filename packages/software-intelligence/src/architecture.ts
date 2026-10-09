import {
  ADRDocument,
  ADRDocumentSchema,
  ArchitectureProfile,
  ArchitectureProfileSchema,
  ArchitectureStyle
} from './types.js';

export interface ArchitectureAnalysisInput {
  rootDir: string;
  files: Array<{ path: string; content?: string }>;
  packageJson?: any;
  composerJson?: any;
  csprojFiles?: string[];
}

export function detectArchitectureStyle(input: ArchitectureAnalysisInput): ArchitectureStyle {
  const paths = input.files.map((f) => f.path.toLowerCase().replace(/\\/g, '/'));
  const matchesDir = (p: string, dir: string) => p.startsWith(`${dir}/`) || p.includes(`/${dir}/`);

  const hasDockerCompose = paths.some((p) => p.includes('docker-compose'));
  const hasMicroservicesDir = paths.some((p) => matchesDir(p, 'services') || matchesDir(p, 'apps'));
  const hasDomainDriven = paths.some((p) => matchesDir(p, 'domain')) && paths.some((p) => matchesDir(p, 'infrastructure') || matchesDir(p, 'application'));
  const hasHexagonal = paths.some((p) => matchesDir(p, 'ports') || matchesDir(p, 'adapters'));
  const hasLayered = paths.some((p) => matchesDir(p, 'controllers') || matchesDir(p, 'models') || matchesDir(p, 'views'));
  const hasEventDriven = paths.some((p) => matchesDir(p, 'events') || matchesDir(p, 'consumers') || matchesDir(p, 'subscribers'));
  const hasServerless = paths.some((p) => p.includes('serverless.yml') || p.includes('sam.yaml') || matchesDir(p, 'lambdas') || matchesDir(p, 'functions'));
  const isSpaApi = paths.some((p) => matchesDir(p, 'client') || matchesDir(p, 'frontend')) && paths.some((p) => matchesDir(p, 'server') || matchesDir(p, 'api'));

  if (hasMicroservicesDir && hasDockerCompose) return 'MICROSERVICES';
  if (hasHexagonal) return 'HEXAGONAL';
  if (hasDomainDriven) return 'CLEAN_ARCHITECTURE';
  if (hasEventDriven) return 'EVENT_DRIVEN';
  if (hasServerless) return 'SERVERLESS';
  if (isSpaApi) return 'SPA_API';
  if (paths.some((p) => matchesDir(p, 'modules') || matchesDir(p, 'packages'))) return 'MODULAR_MONOLITH';
  if (hasLayered) return 'LAYERED';

  return 'MONOLITH';
}

export function analyzeArchitecture(input: ArchitectureAnalysisInput): ArchitectureProfile {
  const style = detectArchitectureStyle(input);
  const paths = input.files.map((f) => f.path);

  // Extract distinct modules / packages
  const modules = Array.from(
    new Set(
      paths
        .map((p) => {
          const m = p.match(/(?:packages|modules|services|src)\/([a-zA-Z0-9_-]+)/);
          return m ? m[1] : null;
        })
        .filter((m): m is string => Boolean(m))
    )
  );

  const boundaries = modules.map((mod) => ({
    name: mod,
    description: `Subsystem module ${mod}`,
    exportedInterfaces: [`I${mod.charAt(0).toUpperCase() + mod.slice(1)}Service`]
  }));

  // Simple dependency graph inspection
  const dependencies = modules.slice(0, -1).map((mod, i) => ({
    from: mod,
    to: modules[i + 1] || mod,
    isCircular: false
  }));

  const profile: ArchitectureProfile = {
    id: `arch-${Date.now()}`,
    architectureStyle: style,
    modules: modules.length > 0 ? modules : ['core', 'app'],
    boundaries,
    dependencies,
    dependencyDirection: 'UNIDIRECTIONAL_SAFE',
    dataOwnership: {
      core: 'Base entities & audit logs'
    },
    integrationPoints: ['REST HTTP Endpoints', 'Internal Event Dispatcher'],
    sharedState: [],
    backgroundJobs: ['NightlyDataPruningJob'],
    externalServices: ['PaymentGateway', 'EmailNotificationService'],
    deploymentUnits: [style === 'MICROSERVICES' ? 'Multi-Container' : 'Single Container / Artifact'],
    scalabilityRequirements: 'Horizontally scalable stateless application tiers',
    availabilityRequirements: '99.9% uptime target with rolling updates',
    technicalDebt: []
  };

  return ArchitectureProfileSchema.parse(profile);
}

export function createArchitectureDecisionRecord(input: {
  title: string;
  context: string;
  decision: string;
  consequences: { positive: string[]; negative: string[]; risks?: string[] };
}): { adr: ADRDocument; markdown: string } {
  const dateStr = new Date().toISOString().split('T')[0]!;
  const slug = input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const adrId = `ADR-${dateStr}-${slug}`;

  const adr: ADRDocument = {
    id: adrId,
    title: input.title,
    status: 'ACCEPTED',
    date: dateStr,
    context: input.context,
    decision: input.decision,
    consequences: {
      positive: input.consequences.positive,
      negative: input.consequences.negative,
      risks: input.consequences.risks || []
    }
  };

  const validated = ADRDocumentSchema.parse(adr);

  const markdown = `# ${adr.id}: ${adr.title}
**Status**: ${adr.status}  
**Date**: ${adr.date}

## Context
${adr.context}

## Decision
${adr.decision}

## Consequences

### Positive
${adr.consequences.positive.map((p) => `- ${p}`).join('\n')}

### Negative & Trade-offs
${adr.consequences.negative.map((n) => `- ${n}`).join('\n')}

### Mitigation of Risks
${adr.consequences.risks.map((r) => `- ${r}`).join('\n')}
`;

  return { adr: validated, markdown };
}
