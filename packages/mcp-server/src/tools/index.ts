import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  createDefaultTokenCompiler,
  coreUXPatterns,
  inferProductUXProfile,
  searchUXPatterns,
  getUXPatternById
} from '@alper-design-os/design-core';
import { AdapterRegistry } from '@alper-design-os/registry';
import { auditAccessibility, auditExistingUI, auditResponsive, detectStack } from '@alper-design-os/analyzer';
import { ProjectFile } from '@alper-design-os/adapter-contract';
import * as T from '../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to safely collect files from a directory (shallow or limited depth)
function collectProjectFiles(targetDir: string, maxFiles: number = 60): ProjectFile[] {
  const result: ProjectFile[] = [];
  if (!fs.existsSync(targetDir)) return result;

  function traverse(current: string, depth: number = 0) {
    if (depth > 4 || result.length >= maxFiles) return;
    try {
      const entries = fs.readdirSync(current, { withFileTypes: true });
      for (const entry of entries) {
        if (result.length >= maxFiles) break;
        if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') continue;

        const fullPath = path.join(current, entry.name);
        if (entry.isDirectory()) {
          traverse(fullPath, depth + 1);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          const shouldReadContent = ['.json', '.html', '.css', '.js', '.jsx', '.tsx', '.ts', '.php', '.cs', '.cshtml'].includes(ext);
          let content: string | undefined = undefined;

          if (shouldReadContent) {
            try {
              const stat = fs.statSync(fullPath);
              if (stat.size < 250000) {
                content = fs.readFileSync(fullPath, 'utf-8');
              }
            } catch {
              // Ignore read errors
            }
          }

          result.push({
            path: path.relative(targetDir, fullPath).replace(/\\/g, '/'),
            extension: ext,
            content
          });
        }
      }
    } catch {
      // Permission or traversal errors
    }
  }

  traverse(targetDir, 0);
  return result;
}

// 1. analyze_project
export function handleAnalyzeProject(input: T.AnalyzeProjectInput) {
  const files = collectProjectFiles(input.projectPath);
  const profile = detectStack(files, input.projectPath);
  const uiAudit = auditExistingUI(files);
  const a11yAudit = auditAccessibility(files);
  const responsiveAudit = auditResponsive(files);

  return {
    projectProfile: profile,
    uiHealthScore: uiAudit.score,
    a11yPassRatio: a11yAudit.passedRatio,
    totalAuditedFiles: files.length,
    uiIssuesCount: uiAudit.totalIssues,
    a11yViolationsCount: a11yAudit.violations.length,
    summary: `Analyzed ${files.length} files. Primary stack: ${profile.primaryStack}. Recommended adapter: ${profile.recommendedAdapterId}.`
  };
}

// 2. detect_stack
export function handleDetectStack(input: T.DetectStackInput) {
  const files = collectProjectFiles(input.projectPath);
  return detectStack(files, input.projectPath);
}

// 3. understand_product
export function handleUnderstandProduct(input: T.UnderstandProductInput) {
  return inferProductUXProfile(input);
}

// 4. research_domain
export function handleResearchDomain(input: T.ResearchDomainInput) {
  const profile = inferProductUXProfile({
    name: input.domainQuery,
    description: `Domain investigation for ${input.domainQuery}`,
    domain: input.domainQuery
  });

  return {
    query: input.domainQuery,
    classification: profile.domainClassification,
    typicalPersonas: profile.personas,
    criticalJobs: profile.primaryJobsAndTasks,
    recommendedDensity: profile.informationDensity,
    recommendedInteraction: profile.interactionStyle,
    keyPatterns: profile.requiredVisualPatterns
  };
}

// 5. recommend_ux_patterns
export function handleRecommendUXPatterns(input: T.RecommendUXPatternsInput) {
  const targetDensity = input.density || input.profile?.informationDensity || 'HIGH';
  const patterns = coreUXPatterns.filter((p) => p.supportedDensities.includes(targetDensity));

  return {
    targetDensity,
    recommendedPatterns: patterns.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      description: p.description,
      accessibilityRole: p.accessibilityRole,
      keyboardShortcuts: p.keyboardShortcuts
    }))
  };
}

// 6. search_design_patterns
export function handleSearchDesignPatterns(input: T.SearchDesignPatternsInput) {
  const matches = searchUXPatterns(input.query);
  return {
    query: input.query,
    totalMatches: matches.length,
    patterns: matches
  };
}

// 7. search_components
export function handleSearchComponents(input: T.SearchComponentsInput) {
  const pattern = getUXPatternById(input.patternId);
  const registry = AdapterRegistry.getInstance();
  const adapters = input.adapterId
    ? [registry.get(input.adapterId)].filter(Boolean)
    : registry.getAll();

  return {
    patternId: input.patternId,
    patternName: pattern?.name || 'Unknown Pattern',
    availableInAdapters: adapters.map((a) => ({
      adapterId: a!.id,
      adapterName: a!.name,
      componentParadigm: a!.getCapabilities().componentParadigm
    }))
  };
}

// 8. get_design_tokens
export function handleGetDesignTokens(input: T.GetDesignTokensInput) {
  const compiler = createDefaultTokenCompiler();
  const output = compiler.compile(input.format);
  return {
    format: input.format,
    filename: output.filename,
    content: output.content
  };
}

// 9. create_design_plan
export function handleCreateDesignPlan(input: T.CreateDesignPlanInput) {
  const registry = AdapterRegistry.getInstance();
  const adapter = registry.get(input.adapterId);

  return {
    planTitle: `Design System Execution Plan (${input.mode}) for ${input.productName}`,
    targetAdapter: input.adapterId,
    adapterFound: !!adapter,
    mode: input.mode,
    safetyPolicy: 'READ_ONLY_DEFAULT: No files will be modified until user explicitly approves.',
    phases: [
      {
        phaseNumber: 1,
        title: 'Domain & Token Architecture',
        deliverables: ['ProductUXProfile confirmation', 'DTCG tokens compilation (tokens.css, tokens.ts)']
      },
      {
        phaseNumber: 2,
        title: 'Layout Shell & Workbench Scaffolding',
        deliverables: ['Master workbench layout', 'Header & status bar', 'Split pane structure']
      },
      {
        phaseNumber: 3,
        title: 'Core UX Pattern Integration',
        deliverables: ['Dense DataGrid', 'Timeline / Gantt', 'Shortcuts & Context Menu']
      },
      {
        phaseNumber: 4,
        title: 'Accessibility & Contrast Verification',
        deliverables: ['WCAG 2.1 AA audit', 'Screen reader live regions', 'Keyboard focus ring audit']
      }
    ]
  };
}

// 10. audit_existing_ui
export function handleAuditExistingUI(input: T.AuditExistingUIInput) {
  const files = collectProjectFiles(input.projectPath);
  return auditExistingUI(files);
}

// 11. audit_accessibility
export function handleAuditAccessibility(input: T.AuditAccessibilityInput) {
  const files = collectProjectFiles(input.projectPath);
  return auditAccessibility(files);
}

// 12. audit_responsive
export function handleAuditResponsive(input: T.AuditResponsiveInput) {
  const files = collectProjectFiles(input.projectPath);
  return auditResponsive(files);
}

// 13. recommend_modernization
export function handleRecommendModernization(input: T.RecommendModernizationInput) {
  const files = collectProjectFiles(input.projectPath);
  const profile = detectStack(files, input.projectPath);
  const registry = AdapterRegistry.getInstance();
  const targetId = input.targetAdapter || profile.recommendedAdapterId;
  const adapter = registry.get(targetId) || registry.get('generic-web')!;

  return adapter.recommendModernization(files);
}

// Helper to resolve catalog paths
function loadCatalog(catalogRelativePath: string) {
  try {
    const candidates = [
      path.resolve(process.cwd(), catalogRelativePath),
      path.resolve(process.env.ALPER_DESIGN_OS_HOME || '', catalogRelativePath),
      path.resolve(__dirname, '../../../', catalogRelativePath)
    ];

    for (const c of candidates) {
      if (fs.existsSync(c)) {
        return JSON.parse(fs.readFileSync(c, 'utf-8'));
      }
    }
  } catch {
    // Ignore fallback errors
  }
  return { items: [] };
}

// 14. search_public_apis
export function handleSearchPublicApis(input: T.SearchPublicApisInput) {
  const catalog = loadCatalog('sources/apis/catalog.json');
  const q = input.query.toLowerCase();
  const results = (catalog.items || []).filter((item: any) => {
    const matchesQuery =
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      (item.tags || []).some((t: string) => t.toLowerCase().includes(q));
    const matchesCategory = input.category ? item.category?.toLowerCase() === input.category.toLowerCase() : true;
    return matchesQuery && matchesCategory;
  });

  return {
    query: input.query,
    totalResults: results.length,
    results
  };
}

// 15. search_mcp_servers
export function handleSearchMcpServers(input: T.SearchMcpServersInput) {
  const catalog = loadCatalog('sources/mcp/catalog.json');
  const q = input.query.toLowerCase();
  const results = (catalog.items || []).filter((item: any) => {
    const matchesQuery =
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      (item.tags || []).some((t: string) => t.toLowerCase().includes(q));
    const matchesCategory = input.category ? item.category?.toLowerCase() === input.category.toLowerCase() : true;
    return matchesQuery && matchesCategory;
  });

  return {
    query: input.query,
    totalResults: results.length,
    results
  };
}
