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
import {
  SourceIntelligenceEngine,
  patternKnowledgeGraph,
  registryDiscoveryEngine,
  specializedIntelligenceEngine,
  auditSkillSecurity,
  explainRecommendation,
  sourceSyncEngine,
  SourceSearchIndex
} from '@alper-design-os/source-intelligence';
import {
  generateEngineeringProfile,
  evaluateReleaseGates,
  createThreatModel,
  detectAllToolCapabilities,
  runSafeSecurityScan,
  AuditFinding,
  ReleaseGatePolicy
} from '@alper-design-os/engineering-guardrails';
import {
  synthesizeUserJourneys,
  generatePlaywrightTestCode,
  createQAReport,
  createTestStrategy
} from '@alper-design-os/qa-engine';
import {
  analyzeArchitecture,
  createArchitectureDecisionRecord,
  analyzeDatabase,
  detectMigrationRisk,
  analyzeApiContract,
  classifyFileCodeType
} from '@alper-design-os/software-intelligence';
import {
  createActionPlan,
  auditActionScope,
  evaluateChangeRisk,
  parseGitStatus,
  createCheckpointPlan,
  planPipeline,
  normalizeEvidenceBatch,
  performIndependentReview,
  detectRegressions,
  createEnvironmentProfile,
  routeContext,
  routeTool,
  writeExecutionJournal,
  evaluateCompletionClaim,
  evaluateTruthfulUI,
  auditDataProvenance,
  createDataProvenanceRecord,
  auditPageIntent,
  createPageIntent,
  auditInformationRelevance,
  classifySourceAuthority,
  evaluateContentTruthGate,
  createVisualApprovalRecord,
  recordVisualReview,
  evaluateVisualApprovalGate,
  auditTrackTraceTelemetryStatic,
  createManualRunBundle,
  verifyManualRunEvidence,
  resolveBrowserRuntime,
  diagnoseOperatorExecutionEnvironment,
  profileExistingProject,
  createBehavioralBaseline,
  createPreservationContract,
  classifyExistingElements,
  createModernizationIntent,
  createModernizationPlan,
  selectModernizationStrategy,
  createModernizationStages,
  evaluateModernizationCompletion,
  createGreenfieldProjectProfile,
  deriveRequirements,
  createRequirementTraceability,
  recommendArchitecture,
  recommendStack,
  createDatabaseBlueprint,
  createApiBlueprint,
  createAuthModel,
  createPageInventory,
  createNewProjectBlueprint,
  createProjectImplementationPlan,
  scaffoldNewProject,
  evaluateNewProjectCompletion,
  initializeProjectIntelligence,
  loadProjectIntelligence,
  recordProjectDecision,
  recordBusinessRule,
  recordProjectInvariant,
  buildProjectArchitectureGraph,
  createProjectSnapshot,
  detectProjectDrift,
  analyzeChangeImpact,
  buildTaskContext,
  detectKnowledgeConflicts,
  recordLessonLearned,
  proposeImprovementCandidate,
  evaluateProjectKnowledgeHealth
} from '@alper-design-os/agent-governance';
import {
  createDesignIntent,
  computeDesignPersonality,
  createPageBlueprint,
  createDataManagementWorkspaceBlueprint,
  createComponentBlueprint,
  canonicalComponentSet,
  createAppShellBlueprint,
  createRecipeBlueprint,
  getRecipeByType,
  canonicalRecipes,
  evaluateDesignAntiPatterns,
  evaluateCrossStackParity,
  getAlperUiRegistrySummary,
  HtmlCssJsRenderer,
  ReactTypeScriptRenderer,
  LaravelBladeRenderer,
  AspNetRazorRenderer
} from '@alper-design-os/design-language';
import * as T from '../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to safely collect files from a directory (shallow or limited depth)
function collectProjectFiles(targetDir: string, maxFiles: number = 250): ProjectFile[] {
  const result: ProjectFile[] = [];
  if (!fs.existsSync(targetDir)) return result;

  function traverse(current: string, depth: number = 0) {
    if (depth > 4 || result.length >= maxFiles) return;
    try {
      const entries = fs.readdirSync(current, { withFileTypes: true });
      const fileEntries = entries.filter((e) => e.isFile());
      const dirEntries = entries.filter((e) => e.isDirectory());

      for (const entry of fileEntries) {
        if (result.length >= maxFiles) break;
        const fullPath = path.join(current, entry.name);
        const ext = path.extname(entry.name).toLowerCase();
        const shouldReadContent = ['.json', '.html', '.css', '.js', '.jsx', '.tsx', '.ts', '.php', '.cs', '.cshtml', '.yaml', '.yml', '.lock', '.example'].includes(ext) || entry.name.startsWith('.env');
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

      for (const entry of dirEntries) {
        if (result.length >= maxFiles) break;
        if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') continue;
        traverse(path.join(current, entry.name), depth + 1);
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

// 16. discover_sources
export function handleDiscoverSources(input: T.DiscoverSourcesInput) {
  const engine = SourceIntelligenceEngine.getInstance();
  const sources = engine.discoverSources({
    type: input.type,
    framework: input.framework,
    domain: input.domain,
    accessibilityLevel: input.accessibilityLevel,
    minTrustScore: input.minTrustScore,
    searchQuery: input.searchQuery
  });

  return {
    totalSourcesFound: sources.length,
    sources
  };
}

// 17. search_sources
export function handleSearchSources(input: T.SearchSourcesInput) {
  const engine = SourceIntelligenceEngine.getInstance();
  const results = engine.searchSources(input.query, {
    framework: input.framework,
    domain: input.domain
  });

  return {
    query: input.query,
    totalMatches: results.length,
    rankedResults: results
  };
}

// 18. rank_sources
export function handleRankSources(input: T.RankSourcesInput) {
  const engine = SourceIntelligenceEngine.getInstance();
  const ranked = engine.recommendSourcesForStack(input.framework || 'Framework Agnostic', input.domain);

  return {
    totalRanked: ranked.length,
    rankedSources: ranked
  };
}

// 19. inspect_source
export function handleInspectSource(input: T.InspectSourceInput) {
  const engine = SourceIntelligenceEngine.getInstance();
  const source = engine.inspectSource(input.sourceId);

  if (!source) {
    throw new Error(`Source with id '${input.sourceId}' was not found in catalog.`);
  }

  return source;
}

// 20. recommend_sources_for_product
export function handleRecommendSourcesForProduct(input: T.RecommendSourcesForProductInput) {
  const engine = SourceIntelligenceEngine.getInstance();
  const profile = input.profile || inferProductUXProfile({
    productName: input.productName || 'Target Product',
    description: input.description || 'Target product requirements',
    domain: input.domain
  });

  const recommendations = engine.recommendSourcesForProduct(profile);

  return {
    productName: profile.productName,
    domainClassification: profile.domainClassification,
    informationDensity: profile.informationDensity,
    totalRecommendations: recommendations.length,
    topRecommendations: recommendations.slice(0, 10)
  };
}

// 21. recommend_sources_for_stack
export function handleRecommendSourcesForStack(input: T.RecommendSourcesForStackInput) {
  const engine = SourceIntelligenceEngine.getInstance();
  const recommendations = engine.recommendSourcesForStack(input.framework, input.domain);

  return {
    framework: input.framework,
    domain: input.domain,
    totalRecommendations: recommendations.length,
    topRecommendations: recommendations.slice(0, 10)
  };
}

// 22. check_source_license
export function handleCheckSourceLicense(input: T.CheckSourceLicenseInput) {
  const engine = SourceIntelligenceEngine.getInstance();
  return engine.checkSourceLicense(input.license);
}

// 23. generate_engineering_policy
export function handleGenerateEngineeringPolicy(input: T.GenerateEngineeringPolicyInput) {
  return generateEngineeringProfile(input.stack, {
    securityLevel: input.securityLevel ? (`LEVEL_${input.securityLevel === 'CRITICAL' ? '3' : input.securityLevel === 'HIGH' ? '2' : '1'}` as any) : undefined
  });
}

// 24. evaluate_release_gates
export function handleEvaluateReleaseGates(input: T.EvaluateReleaseGatesInput) {
  const policy: ReleaseGatePolicy = {
    blockOnCriticalSecurity: true,
    blockOnHighSecurity: true,
    blockOnSecretDetected: true,
    blockOnExploitableDependency: true,
    blockOnFailedCriticalTests: true,
    mediumSecurityAction: 'WARN',
    lowSecurityAction: 'IGNORE'
  };

  const allFindings: AuditFinding[] = [
    ...(input.staticIssues || []),
    ...(input.dynamicIssues || []),
    ...(input.vulnerableDependencies || []),
    ...(input.detectedSecrets || [])
  ];

  return evaluateReleaseGates(allFindings, policy, false);
}

// 25. generate_threat_model
export function handleGenerateThreatModel(input: T.GenerateThreatModelInput) {
  return createThreatModel({
    productName: input.systemName,
    domain: input.architecture || 'GENERAL_WEB',
    assets: input.dataAssets,
    entryPoints: input.externalInterfaces
  });
}

// 26. detect_tool_capabilities
export async function handleDetectToolCapabilities(input: T.DetectToolCapabilitiesInput) {
  const all = await detectAllToolCapabilities();
  if (input.targetTools && input.targetTools.length > 0) {
    return all.filter((t) => input.targetTools!.includes(t.toolId));
  }
  return all;
}

// 27. run_safe_security_scan
export async function handleRunSafeSecurityScan(input: T.RunSafeSecurityScanInput) {
  return await runSafeSecurityScan(
    {
      projectDir: input.targetDir,
      targetUrl: input.targetUrl
    },
    {
      mode: input.activeScanApproved ? 'ACTIVE' : 'PASSIVE',
      userExplicitApproval: input.activeScanApproved
    }
  );
}

// 28. generate_user_journeys
export function handleGenerateUserJourneys(input: T.GenerateUserJourneysInput) {
  const profile = inferProductUXProfile({
    productName: input.productName,
    description: input.description,
    domain: input.domain
  });
  return synthesizeUserJourneys(profile);
}

// 29. generate_playwright_test
export function handleGeneratePlaywrightTest(input: T.GeneratePlaywrightTestInput) {
  return generatePlaywrightTestCode({
    id: `journey-${Date.now()}`,
    goal: input.journeyTitle,
    persona: 'Standard User',
    criticality: 'MISSION_CRITICAL',
    preconditions: ['User is on target page'],
    steps: input.steps.map((s) => `${s.action} on ${s.target} ${s.value ? `with ${s.value}` : ''}`),
    expectedOutcome: 'Action completes without console errors or accessibility violations',
    failureStates: ['ERROR_ALERT', 'CRASH'],
    performanceBudget: { maxFlowDurationMs: 5000, maxStepLatencyMs: 1500 },
    accessibilityRequirements: { keyboardOnlyNavigable: true, announceLiveRegions: true, minTouchTargetPx: 44 }
  }, {
    baseURL: input.targetUrl
  });
}

// 30. generate_qa_report
export function handleGenerateQAReport(input: T.GenerateQAReportInput) {
  return createQAReport({
    targetApplication: input.targetApplication,
    testedFlows: input.testedFlows,
    consoleErrors: input.consoleErrors,
    networkFailures: input.networkFailures,
    accessibilityFindings: input.accessibilityFindings,
    visualDiffs: input.visualDiffs,
    unverifiedAreas: input.unverifiedAreas
  });
}

// 31. generate_test_pyramid
export function handleGenerateTestPyramid(input: T.GenerateTestPyramidInput) {
  return createTestStrategy({
    name: input.projectName,
    projectType: input.projectType === 'ENTERPRISE_ERP_CRM'
      ? 'ENTERPRISE_ERP_CRM'
      : input.projectType === 'LANDING_PAGE'
        ? 'LANDING_PAGE'
        : input.projectType === 'MICROSERVICE_API'
          ? 'MICROSERVICE_API'
          : 'GENERIC_SPA'
  });
}

// 32. analyze_architecture
export function handleAnalyzeArchitecture(input: T.AnalyzeArchitectureInput) {
  const files = collectProjectFiles(input.projectPath, 150);
  return analyzeArchitecture({
    rootDir: input.projectPath,
    files
  });
}

// 33. generate_adr
export function handleGenerateADR(input: T.GenerateADRInput) {
  return createArchitectureDecisionRecord({
    title: input.title,
    context: input.context,
    decision: input.decision,
    consequences: input.consequences
  });
}

// 34. analyze_database_schema
export function handleAnalyzeDatabaseSchema(input: T.AnalyzeDatabaseSchemaInput) {
  const migrationEvaluation = input.migrationContent
    ? detectMigrationRisk(input.migrationContent.split('\n'))
    : null;

  const dbProfile = analyzeDatabase({
    sqlStatements: input.querySample ? [input.querySample] : [],
    migrationDdl: input.migrationContent ? input.migrationContent.split('\n') : []
  });

  return {
    databaseProfile: dbProfile,
    migrationEvaluation
  };
}

// 35. evaluate_api_compatibility
export function handleEvaluateAPICompatibility(input: T.EvaluateAPICompatibilityInput) {
  let prevSpec: any = {};
  let currSpec: any = {};
  try {
    prevSpec = JSON.parse(input.oldSpec);
    currSpec = JSON.parse(input.newSpec);
  } catch {
    // raw
  }
  return analyzeApiContract({
    hasOpenApi: input.specType === 'OPENAPI',
    hasAsyncApi: input.specType === 'ASYNCAPI',
    previousSpec: prevSpec,
    currentSpec: currSpec
  });
}

// 36. classify_code_paths
export function handleClassifyCodePaths(input: T.ClassifyCodePathsInput) {
  return input.paths.map((p) => ({
    path: p,
    classification: classifyFileCodeType(p)
  }));
}

// ==========================================
// Phase 1B: Agent Governance Handlers
// ==========================================

// 37. create_action_plan
export function handleCreateActionPlan(input: T.CreateActionPlanInput) {
  return createActionPlan({
    objective: input.objective,
    requestedScope: input.requestedScope,
    filesExpectedToChange: input.filesExpectedToChange,
    filesForbiddenToChange: input.filesForbiddenToChange,
    detectedProject: input.detectedProject
  });
}

// 38. evaluate_scope
export function handleEvaluateScope(input: T.EvaluateScopeInput) {
  return auditActionScope(input.filesToChange, input.requestedScope, input.forbiddenList);
}

// 39. evaluate_change_risk
export function handleEvaluateChangeRisk(input: T.EvaluateChangeRiskInput) {
  return evaluateChangeRisk(input);
}

// 40. create_checkpoint_plan
export function handleCreateCheckpointPlan(input: T.CreateCheckpointPlanInput) {
  const status = parseGitStatus(input.gitStatusText, input.currentBranch);
  return createCheckpointPlan(status, input.taskName);
}

// 41. create_verification_plan
export function handleCreateVerificationPlan(input: T.CreateVerificationPlanInput) {
  return planPipeline({
    objective: input.objective,
    riskLevel: input.riskLevel
  });
}

// 42. normalize_verification_evidence
export function handleNormalizeVerificationEvidence(input: T.NormalizeVerificationEvidenceInput) {
  return normalizeEvidenceBatch(input.rawItems);
}

// 43. review_change
export function handleReviewChange(input: T.ReviewChangeInput) {
  return performIndependentReview({
    taskObjective: input.taskObjective,
    diffContent: input.diffContent,
    filesChanged: input.filesChanged,
    testOutput: input.testOutput,
    testsPassed: input.testsPassed,
    consoleErrors: input.consoleErrors,
    networkErrors: input.networkErrors,
    securityFindings: input.securityFindings
  });
}

// 44. detect_regression
export function handleDetectRegression(input: T.DetectRegressionInput) {
  return detectRegressions(input.baselines, input.currentStates);
}

// 45. create_environment_profile
export function handleCreateEnvironmentProfile(input: T.CreateEnvironmentProfileInput) {
  const files = collectProjectFiles(input.projectPath);
  return createEnvironmentProfile(files);
}

// 46. route_context
export function handleRouteContext(input: T.RouteContextInput) {
  return routeContext({
    taskId: input.taskId,
    taskBrief: input.taskBrief,
    detectedStack: input.detectedStack,
    domain: input.domain,
    mode: input.mode
  });
}

// 47. route_tool
export function handleRouteTool(input: T.RouteToolInput) {
  return routeTool(input.taskDescription, {
    isOffline: input.isOffline,
    requireLiveBrowser: input.requireLiveBrowser
  });
}

// 48. create_execution_journal
export function handleCreateExecutionJournal(input: T.CreateExecutionJournalInput) {
  return writeExecutionJournal(input.baseDir, {
    runId: input.runId,
    plan: input.plan,
    projectProfile: input.projectProfile,
    actions: input.actions,
    verification: input.verification,
    evidence: input.evidence,
    review: input.review,
    summaryMarkdown: input.summaryMarkdown
  });
}

// 49. evaluate_completion_claim
export function handleEvaluateCompletionClaim(input: T.EvaluateCompletionClaimInput) {
  return evaluateCompletionClaim(input.claim, input.evidences);
}

// 50. discover_design_sources
export function handleDiscoverDesignSources(input: T.DiscoverDesignSourcesInput) {
  const engine = SourceIntelligenceEngine.getInstance();
  const sources = engine.discoverSources({
    type: input.type as any,
    types: input.types as any,
    framework: input.framework,
    domain: input.domain,
    accessibilityLevel: input.accessibilityLevel as any,
    minTrustScore: input.minTrustScore,
    maxLicenseRisk: input.maxLicenseRisk === 'PERMISSIVE_ONLY' ? 'PERMISSIVE_ONLY' : undefined,
    searchQuery: input.searchQuery
  });

  return {
    totalSourcesFound: sources.length,
    sources
  };
}

// 51. search_design_sources
export function handleSearchDesignSources(input: T.SearchDesignSourcesInput) {
  const engine = SourceIntelligenceEngine.getInstance();
  const searchIndex = new SourceSearchIndex(engine.getAllSources());
  const indexedResults = searchIndex.search(input.query, input.limit || 20);

  let filtered = indexedResults;
  if (input.framework) {
    const fw = input.framework.toLowerCase();
    filtered = filtered.filter((s) =>
      s.frameworks.some((f) => f.toLowerCase().includes(fw) || f.toLowerCase().includes('agnostic'))
    );
  }
  if (input.domain) {
    const dm = input.domain.toUpperCase();
    filtered = filtered.filter((s) => s.domains.includes(dm) || s.domains.includes('GLOBAL_WEB'));
  }

  return {
    query: input.query,
    totalMatches: filtered.length,
    rankedResults: filtered
  };
}

// 52. inspect_design_source
export function handleInspectDesignSource(input: T.InspectDesignSourceInput) {
  const engine = SourceIntelligenceEngine.getInstance();
  const source = engine.inspectSource(input.sourceId);

  if (!source) {
    throw new Error(`Design source with id '${input.sourceId}' was not found in catalog.`);
  }

  return source;
}

// 53. sync_design_sources
export async function handleSyncDesignSources(input: T.SyncDesignSourcesInput) {
  const engine = SourceIntelligenceEngine.getInstance();
  let sourcesToSync = engine.getAllSources();

  if (input.sourceIds && input.sourceIds.length > 0) {
    sourcesToSync = sourcesToSync.filter((s) => input.sourceIds!.includes(s.id));
  }

  const result = await sourceSyncEngine.syncAllSources(sourcesToSync);
  return {
    totalChecked: result.total,
    syncedCount: result.synced,
    results: result.results
  };
}

// 54. recommend_design_sources
export function handleRecommendDesignSources(input: T.RecommendDesignSourcesInput) {
  const engine = SourceIntelligenceEngine.getInstance();
  const ranked = engine.rankSources({
    framework: input.framework,
    domain: input.domain,
    commercialAllowedOnly: input.commercialAllowedOnly
  });

  const top = ranked.slice(0, 10);
  const explanations = top.map((r) => explainRecommendation(r, {
    framework: input.framework,
    domain: input.domain
  }));

  return {
    totalRanked: ranked.length,
    recommendedSources: top.map((r, i) => ({
      source: r.source,
      compositeScore: r.compositeScore,
      explanation: explanations[i]
    }))
  };
}

// 55. search_patterns
export function handleSearchPatterns(input: T.SearchPatternsInput) {
  const patterns = patternKnowledgeGraph.search(input.query || '');
  let filtered = patterns;

  if (input.category) {
    filtered = filtered.filter((p) => p.category.toLowerCase() === input.category!.toLowerCase());
  }

  return {
    query: input.query || '',
    totalPatterns: filtered.length,
    patterns: filtered
  };
}

// 56. inspect_pattern
export function handleInspectPattern(input: T.InspectPatternInput) {
  const pattern = patternKnowledgeGraph.get(input.patternId as any);
  if (!pattern) {
    throw new Error(`Pattern '${input.patternId}' was not found in pattern knowledge graph.`);
  }
  return pattern;
}

// 57. search_registries
export function handleSearchRegistries(input: T.SearchRegistriesInput) {
  const registries = registryDiscoveryEngine.searchRegistries(input.query || '');
  let filtered = registries;

  if (input.freeTierOnly) {
    filtered = filtered.filter((r) => r.freeTier);
  }

  return {
    query: input.query || '',
    totalRegistries: filtered.length,
    registries: filtered
  };
}

// 58. search_registry_components
export function handleSearchRegistryComponents(input: T.SearchRegistryComponentsInput) {
  const components = registryDiscoveryEngine.searchRegistryComponents(input.query, {
    registryId: input.registryId,
    type: input.type as any
  });

  return {
    query: input.query,
    totalComponents: components.length,
    components
  };
}

// 59. inspect_registry_component
export function handleInspectRegistryComponent(input: T.InspectRegistryComponentInput) {
  const component = registryDiscoveryEngine.inspectRegistryComponent(input.registryId, input.componentId);
  if (!component) {
    throw new Error(`Component '${input.componentId}' not found in registry '${input.registryId}'.`);
  }
  return component;
}

// 60. discover_ai_skills
export function handleDiscoverAiSkills(input: T.DiscoverAiSkillsInput) {
  const engine = SourceIntelligenceEngine.getInstance();
  const all = engine.discoverSources({
    type: 'AI_SKILL' as any,
    searchQuery: input.query,
    domain: input.domain
  });

  return {
    totalSkillsFound: all.length,
    skills: all
  };
}

// 61. inspect_ai_skill
export function handleInspectAiSkill(input: T.InspectAiSkillInput) {
  const engine = SourceIntelligenceEngine.getInstance();
  const source = engine.inspectSource(input.skillId);

  const report = auditSkillSecurity({
    skillId: input.skillId,
    name: source ? source.name : input.skillId,
    source: source ? source.homepage || source.repository || 'community' : 'user-submitted',
    license: source ? source.license : 'UNKNOWN',
    instructions: input.promptContent || (source ? source.description : '')
  });

  return {
    skillId: input.skillId,
    sourceMetadata: source,
    auditReport: report
  };
}

// 62. recommend_icon_system
export function handleRecommendIconSystem(input: T.RecommendIconSystemInput) {
  return specializedIntelligenceEngine.recommendIconSystem(input);
}

// 63. recommend_chart_library
export function handleRecommendChartLibrary(input: T.RecommendChartLibraryInput) {
  return specializedIntelligenceEngine.recommendChartLibrary(input);
}

// 64. recommend_data_grid
export function handleRecommendDataGrid(input: T.RecommendDataGridInput) {
  return specializedIntelligenceEngine.recommendDataGrid(input);
}

// 65. explain_source_recommendation
export function handleExplainSourceRecommendation(input: T.ExplainSourceRecommendationInput) {
  const engine = SourceIntelligenceEngine.getInstance();
  const source = engine.inspectSource(input.sourceId);
  if (!source) {
    throw new Error(`Source with id '${input.sourceId}' was not found in catalog.`);
  }

  const rankedList = engine.rankSources({
    framework: input.targetFramework,
    domain: input.targetDomain
  });
  const foundRanked = rankedList.find((r) => r.source.id === source.id);
  if (foundRanked) {
    return explainRecommendation(foundRanked, {
      framework: input.targetFramework,
      domain: input.targetDomain
    });
  }

  const defaultRanked = {
    source,
    compositeScore: source.trustScore || 80,
    scoreBreakdown: {
      trustScore: source.trustScore || 80,
      documentationScore: 80,
      accessibilityScore: 80,
      maintenanceScore: 80,
      stackCompatibilityScore: 80,
      domainCompatibilityScore: 80,
      licenseCompatibilityScore: 100,
      finalWeightedScore: source.trustScore || 80
    },
    breakdown: {
      trust: (source.trustScore || 80) / 100,
      maintenance: 0.8,
      documentation: 0.8,
      accessibility: 0.8,
      domainCompatibility: 0.8,
      stackCompatibility: 0.8,
      licenseCompatibility: 1.0
    },
    matchReasons: ['Default catalog profile match']
  };

  return explainRecommendation(defaultRanked as any, {
    framework: input.targetFramework,
    domain: input.targetDomain
  });
}

// 66. create_design_intent
export function handleCreateDesignIntent(input: T.CreateDesignIntentInput) {
  return createDesignIntent(input);
}

// 67. create_page_blueprint
export function handleCreatePageBlueprint(input: T.CreatePageBlueprintInput) {
  if (input.preset === 'DATA_MANAGEMENT_WORKSPACE') {
    return createDataManagementWorkspaceBlueprint();
  }
  return createRecipeBlueprint(input.preset as any);
}

// 68. create_component_blueprint
export function handleCreateComponentBlueprint(input: T.CreateComponentBlueprintInput) {
  const found = canonicalComponentSet.find((c: { type: string }) => c.type === input.type);
  if (found) {
    return {
      ...found,
      id: input.id || found.id,
      density: input.density || found.density
    };
  }
  return createComponentBlueprint(input.id || `custom-${input.type.toLowerCase()}`, input.type, {
    density: input.density || 'COMFORTABLE'
  });
}

// 69. create_app_shell_blueprint
export function handleCreateAppShellBlueprint(input: T.CreateAppShellBlueprintInput) {
  return createAppShellBlueprint(input.id, input.variant);
}

// 70. render_blueprint
export function handleRenderBlueprint(input: T.RenderBlueprintInput) {
  const blueprint = createDataManagementWorkspaceBlueprint();
  let renderer;
  switch (input.targetStack) {
    case 'react-typescript':
      renderer = new ReactTypeScriptRenderer();
      break;
    case 'laravel-blade':
      renderer = new LaravelBladeRenderer();
      break;
    case 'aspnet-razor':
      renderer = new AspNetRazorRenderer();
      break;
    case 'html-css-js':
    default:
      renderer = new HtmlCssJsRenderer();
      break;
  }

  return renderer.renderPageBlueprint(blueprint, {
    theme: input.theme,
    density: input.density
  });
}

// 71. render_component
export function handleRenderComponent(input: T.RenderComponentInput) {
  const found = canonicalComponentSet.find((c: { type: string }) => c.type === input.componentType) ||
    createComponentBlueprint(`comp-${input.componentType.toLowerCase()}`, input.componentType);

  let renderer;
  switch (input.targetStack) {
    case 'react-typescript':
      renderer = new ReactTypeScriptRenderer();
      break;
    case 'laravel-blade':
      renderer = new LaravelBladeRenderer();
      break;
    case 'aspnet-razor':
      renderer = new AspNetRazorRenderer();
      break;
    case 'html-css-js':
    default:
      renderer = new HtmlCssJsRenderer();
      break;
  }

  return renderer.renderComponentBlueprint(found, {
    theme: input.theme,
    density: input.density
  });
}

// 72. create_ui_recipe
export function handleCreateUiRecipe(input: T.CreateUiRecipeInput) {
  const recipe = getRecipeByType(input.recipeType);
  if (!recipe) {
    throw new Error(`Recipe with type '${input.recipeType}' not found.`);
  }
  return recipe;
}

// 73. select_design_personality
export function handleSelectDesignPersonality(input: T.SelectDesignPersonalityInput) {
  const intent = createDesignIntent(input);
  return computeDesignPersonality(intent);
}

// 74. evaluate_design_antipatterns
export function handleEvaluateDesignAntipatterns(input: T.EvaluateDesignAntipatternsInput) {
  let blueprint;
  if (input.blueprintPreset) {
    blueprint = input.blueprintPreset === 'DATA_MANAGEMENT_WORKSPACE'
      ? createDataManagementWorkspaceBlueprint()
      : createRecipeBlueprint(input.blueprintPreset as any);
  }

  return evaluateDesignAntiPatterns({
    content: input.content,
    blueprint
  });
}

// 75. compare_renderer_parity
export function handleCompareRendererParity(input: T.CompareRendererParityInput) {
  const blueprint = input.blueprintPreset === 'DATA_MANAGEMENT_WORKSPACE'
    ? createDataManagementWorkspaceBlueprint()
    : createRecipeBlueprint(input.blueprintPreset as any);

  return evaluateCrossStackParity(blueprint);
}

// 76. inspect_alper_registry
export function handleInspectAlperRegistry(input: T.InspectAlperRegistryInput) {
  const summary = getAlperUiRegistrySummary();
  if (input.section === 'TOKENS') {
    return { section: 'TOKENS', description: 'Canonical Tokens V2: Primitives, Semantics (Light/Dark/High-Contrast), Components, Typography, Motion' };
  }
  if (input.section === 'BLUEPRINTS') {
    return { section: 'BLUEPRINTS', componentsCount: summary.componentsCount, components: summary.components };
  }
  if (input.section === 'RECIPES') {
    return { section: 'RECIPES', recipesCount: summary.recipesCount, recipes: summary.recipes };
  }
  return summary;
}

// 77. evaluate_truthful_ui
export function handleEvaluateTruthfulUi(input: T.EvaluateTruthfulUiInput) {
  return evaluateTruthfulUI({
    components: input.components,
    pageTitle: input.pageTitle,
    cognitiveClutterScore: input.cognitiveClutterScore
  });
}

// 78. audit_data_provenance
export function handleAuditDataProvenance(input: T.AuditDataProvenanceInput) {
  const records = input.records.map((r) =>
    createDataProvenanceRecord({
      fieldOrComponentId: r.fieldOrComponentId,
      originType: r.originType,
      endpointOrSource: r.endpointOrSource,
      isSimulated: r.isSimulated,
      isLabeledMock: r.isLabeledMock
    })
  );
  return auditDataProvenance(records);
}

// 79. evaluate_page_intent
export function handleEvaluatePageIntent(input: T.EvaluatePageIntentInput) {
  const intent = createPageIntent({
    intentType: input.intentType,
    primaryGoal: input.primaryGoal,
    targetAudience: input.targetAudience
  });
  return auditPageIntent(intent, input.components as any);
}

// 80. audit_information_relevance
export function handleAuditInformationRelevance(input: T.AuditInformationRelevanceInput) {
  const intent = createPageIntent({
    intentType: input.intentType,
    primaryGoal: input.primaryGoal,
    targetAudience: 'General Users'
  });
  return auditInformationRelevance(intent, input.elements);
}

// 81. classify_source_authority
export function handleClassifySourceAuthority(input: T.ClassifySourceAuthorityInput) {
  return classifySourceAuthority(input);
}

// 82. evaluate_content_truth_gate
export function handleEvaluateContentTruthGate(input: T.EvaluateContentTruthGateInput) {
  return evaluateContentTruthGate({
    components: input.components || [],
    requireVisualApproval: input.requireVisualApproval
  });
}

// 83. manage_human_visual_approval
export function handleManageHumanVisualApproval(input: T.ManageHumanVisualApprovalInput) {
  let record = createVisualApprovalRecord();

  if (input.action === 'RECORD_REVIEW' && input.status) {
    record = recordVisualReview(record, {
      status: input.status,
      reviewedBy: input.reviewedBy || 'human-evaluator',
      notes: input.notes,
      viewportsReviewed: input.viewports,
      criteriaChecked: input.criteriaChecked
    });
  }

  const gateResult = evaluateVisualApprovalGate(record, true);
  return {
    record,
    gateResult
  };
}

// 84. audit_track_trace_telemetry
export function handleAuditTrackTraceTelemetry(input: T.AuditTrackTraceTelemetryInput) {
  return auditTrackTraceTelemetryStatic({
    sampleEndpoints: input.sampleEndpoints
  });
}

// 85. create_manual_run_bundle
export function handleCreateManualRunBundle(input: T.CreateManualRunBundleInput) {
  return createManualRunBundle({
    runId: input.runId,
    plannedObjective: input.plannedObjective
  });
}

// 86. verify_manual_run_evidence
export function handleVerifyManualRunEvidence(input: T.VerifyManualRunEvidenceInput) {
  return verifyManualRunEvidence(input.runIdOrPath);
}

// 87. resolve_browser_runtime
export function handleResolveBrowserRuntime(input: T.ResolveBrowserRuntimeInput) {
  return resolveBrowserRuntime({
    forceChromiumBlocked: input.forceChromiumBlocked
  });
}

// 88. run_operator_doctor
export function handleRunOperatorDoctor(input: T.RunOperatorDoctorInput) {
  return diagnoseOperatorExecutionEnvironment({
    overrideDockerCapability: input.overrideDockerCapability,
    overrideBrowserCapability: input.overrideBrowserCapability
  });
}

// 89. profile_existing_project
export function handleProfileExistingProject(input: T.ProfileExistingProjectInput) {
  const files = collectProjectFiles(input.projectPath);
  return profileExistingProject({
    rootDir: input.projectPath,
    files,
    projectIdentity: input.projectName ? { name: input.projectName, rootDir: input.projectPath } : undefined
  });
}

// 90. create_behavioral_baseline
export function handleCreateBehavioralBaseline(input: T.CreateBehavioralBaselineInput) {
  const files = collectProjectFiles(input.projectPath);
  return createBehavioralBaseline(files);
}

// 91. create_preservation_contract
export function handleCreatePreservationContract(input: T.CreatePreservationContractInput) {
  return createPreservationContract({
    contractId: input.contractId,
    specificInvariants: input.customInvariants
  });
}

// 92. classify_existing_elements
export function handleClassifyExistingElements(input: T.ClassifyExistingElementsInput) {
  return classifyExistingElements(input.elements);
}

// 93. create_modernization_intent
export function handleCreateModernizationIntent(input: T.CreateModernizationIntentInput) {
  let projectProfile: any;
  if (input.autoSupplementFromProjectPath) {
    const files = collectProjectFiles(input.autoSupplementFromProjectPath);
    projectProfile = profileExistingProject({ rootDir: input.autoSupplementFromProjectPath, files });
  }

  const result = createModernizationIntent(input, projectProfile);
  if (!result.isValid) {
    throw new Error(result.rejectionReason || "Invalid modernization intent: insufficient context.");
  }
  return result.intent;
}

// 94. create_modernization_plan
export function handleCreateModernizationPlan(input: T.CreateModernizationPlanInput) {
  const files = collectProjectFiles(input.projectPath);
  const profile = profileExistingProject({ rootDir: input.projectPath, files });
  const baseline = createBehavioralBaseline(files);
  const intentResult = createModernizationIntent({ why: input.why || 'Modernize legacy presentation layer' }, profile);
  const intent = intentResult.intent!;

  const scope = {
    level: input.scopeLevel,
    targetName: input.scopeTarget,
    allowedPaths: [input.scopeTarget.toLowerCase()],
    prohibitedPaths: ['**/migrations/**', '**/schema.sql'],
    canModifySharedComponents: input.scopeLevel === 'PAGE' || input.scopeLevel === 'MODULE' || input.scopeLevel === 'APPLICATION',
    canModifyGlobalShell: input.scopeLevel === 'SHELL' || input.scopeLevel === 'APPLICATION',
    canModifyBackend: false,
    canModifyDatabase: false
  };

  return createModernizationPlan({
    profile,
    intent,
    baseline,
    scope,
    strategy: input.strategy || 'BRIDGE'
  });
}

// 95. select_modernization_strategy
export function handleSelectModernizationStrategy(input: T.SelectModernizationStrategyInput) {
  let profile: any;
  if (input.projectPath) {
    const files = collectProjectFiles(input.projectPath);
    profile = profileExistingProject({ rootDir: input.projectPath, files });
  } else {
    profile = profileExistingProject({ rootDir: '.', files: [] });
  }

  return selectModernizationStrategy({
    requestedStrategy: input.requestedStrategy as any,
    projectProfile: profile,
    explicitUserApproval: input.explicitUserApproval,
    explicitUserRequest: input.explicitUserRequest,
    hasCheckpointPlan: input.hasCheckpointPlan,
    hasRollbackPlan: input.hasRollbackPlan,
    preservationImpactReviewed: input.preservationImpactReviewed,
    riskAssessmentCompleted: input.riskAssessmentCompleted,
    assessedRiskLevel: input.assessedRiskLevel,
    justification: input.justification
  });
}

// 96. create_modernization_stages
export function handleCreateModernizationStages(input: T.CreateModernizationStagesInput) {
  const scope = {
    level: input.scopeLevel,
    targetName: input.targetName,
    allowedPaths: [input.targetName.toLowerCase()],
    prohibitedPaths: ['**/migrations/**'],
    canModifySharedComponents: true,
    canModifyGlobalShell: input.scopeLevel === 'SHELL' || input.scopeLevel === 'APPLICATION',
    canModifyBackend: false,
    canModifyDatabase: false
  };

  const strategy = selectModernizationStrategy({
    requestedStrategy: input.strategy,
    projectProfile: profileExistingProject({ rootDir: '.', files: [] })
  });

  return createModernizationStages(scope, strategy, []);
}

// 97. evaluate_modernization_completion
export function handleEvaluateModernizationCompletion(input: T.EvaluateModernizationCompletionInput) {
  return evaluateModernizationCompletion(input);
}

// ==========================================
// FAZ 1G: Greenfield Project Generation MCP Handlers
// ==========================================

// 98. create_greenfield_project_profile
export function handleCreateGreenfieldProjectProfile(input: T.CreateGreenfieldProjectProfileInput) {
  return createGreenfieldProjectProfile(input);
}

// 99. derive_requirements
export function handleDeriveRequirements(input: T.DeriveRequirementsInput) {
  return deriveRequirements(input.profile, input.explicitUserBrief);
}

// 100. create_requirement_traceability
export function handleCreateRequirementTraceability(input: T.CreateRequirementTraceabilityInput) {
  return createRequirementTraceability(input.requirements, {
    architecturalDecisions: input.architecturalDecisions,
    databaseEntities: input.databaseEntities,
    apiEndpoints: input.apiEndpoints,
    pages: input.pages,
    implementationFiles: input.implementationFiles,
    verificationTests: input.verificationTests
  });
}

// 101. recommend_architecture
export function handleRecommendArchitecture(input: T.RecommendArchitectureInput) {
  return recommendArchitecture(input.profile, input.requirements);
}

// 102. recommend_stack
export function handleRecommendStack(input: T.RecommendStackInput) {
  return recommendStack(input.profile, input.architecture, input.userPreferredStack);
}

// 103. create_database_blueprint
export function handleCreateDatabaseBlueprint(input: T.CreateDatabaseBlueprintInput) {
  return createDatabaseBlueprint(input.profile, input.requirements, input.stack, input.architecture);
}

// 104. create_api_blueprint
export function handleCreateApiBlueprint(input: T.CreateApiBlueprintInput) {
  return createApiBlueprint(input.profile, input.requirements, input.database, input.architecture);
}

// 105. create_auth_model
export function handleCreateAuthModel(input: T.CreateAuthModelInput) {
  return createAuthModel(input.profile, input.requirements);
}

// 106. create_page_inventory
export function handleCreatePageInventory(input: T.CreatePageInventoryInput) {
  return createPageInventory(input.profile, input.requirements, input.database, input.api);
}

// 107. create_project_blueprint
export function handleCreateProjectBlueprint(input: T.CreateProjectBlueprintInput) {
  return createNewProjectBlueprint(input.profile, {
    requirementsBundle: input.requirementsBundle,
    userPreferredStack: input.userPreferredStack
  });
}

// 108. create_project_implementation_plan
export function handleCreateProjectImplementationPlan(input: T.CreateProjectImplementationPlanInput) {
  return createProjectImplementationPlan(input.blueprint);
}

// 109. scaffold_new_project
export function handleScaffoldNewProject(input: T.ScaffoldNewProjectInput) {
  return scaffoldNewProject(input.blueprint, input.targetDirectory);
}

// 110. evaluate_new_project_completion
export function handleEvaluateNewProjectCompletion(input: T.EvaluateNewProjectCompletionInput) {
  return evaluateNewProjectCompletion(input);
}

// 111. initialize_project_intelligence
export function handleInitializeProjectIntelligence(input: T.InitializeProjectIntelligenceInput) {
  return initializeProjectIntelligence(input.baseDir, input);
}

// 112. load_project_intelligence
export function handleLoadProjectIntelligence(input: T.LoadProjectIntelligenceInput) {
  return loadProjectIntelligence(input.baseDir);
}

// 113. record_project_decision
export function handleRecordProjectDecision(input: T.RecordProjectDecisionInput) {
  return recordProjectDecision(input.baseDir, input);
}

// 114. record_business_rule
export function handleRecordBusinessRule(input: T.RecordBusinessRuleInput) {
  return recordBusinessRule(input.baseDir, input);
}

// 115. record_project_invariant
export function handleRecordProjectInvariant(input: T.RecordProjectInvariantInput) {
  return recordProjectInvariant(input.baseDir, input);
}

// 116. build_project_architecture_graph
export function handleBuildProjectArchitectureGraph(input: T.BuildProjectArchitectureGraphInput) {
  return buildProjectArchitectureGraph(input.baseDir, input.codeArtifacts);
}

// 117. create_project_snapshot
export function handleCreateProjectSnapshot(input: T.CreateProjectSnapshotInput) {
  return createProjectSnapshot(input.baseDir, input.snapshotId, input);
}

// 118. detect_project_drift
export function handleDetectProjectDrift(input: T.DetectProjectDriftInput) {
  return detectProjectDrift(input.baseSnapshot, input.targetSnapshot);
}

// 119. analyze_change_impact
export function handleAnalyzeChangeImpact(input: T.AnalyzeChangeImpactInput) {
  return analyzeChangeImpact(input.baseDir, input.target, input.proposedChange);
}

// 120. build_task_context
export function handleBuildTaskContext(input: T.BuildTaskContextInput) {
  return buildTaskContext(input.baseDir, input);
}

// 121. detect_knowledge_conflicts
export function handleDetectKnowledgeConflicts(input: T.DetectKnowledgeConflictsInput) {
  return detectKnowledgeConflicts(input.baseDir, input.actualCodeFacts);
}

// 122. record_lesson_learned
export function handleRecordLessonLearned(input: T.RecordLessonLearnedInput) {
  return recordLessonLearned(input.baseDir, input);
}

// 123. propose_improvement_candidate
export function handleProposeImprovementCandidate(input: T.ProposeImprovementCandidateInput) {
  return proposeImprovementCandidate(input.baseDir, input);
}

// 124. evaluate_project_knowledge_health
export function handleEvaluateProjectKnowledgeHealth(input: T.EvaluateProjectKnowledgeHealthInput) {
  return evaluateProjectKnowledgeHealth(input.baseDir);
}

/**
 * Canonical Tool Registry Map:
 * Complete, typed mapping of all 124 registered Alper Design OS MCP tools to their handler functions.
 */
export const toolRegistry = new Map<string, Function>([
  ['analyze_project', handleAnalyzeProject],
  ['detect_stack', handleDetectStack],
  ['understand_product', handleUnderstandProduct],
  ['research_domain', handleResearchDomain],
  ['recommend_ux_patterns', handleRecommendUXPatterns],
  ['search_design_patterns', handleSearchDesignPatterns],
  ['search_components', handleSearchComponents],
  ['get_design_tokens', handleGetDesignTokens],
  ['create_design_plan', handleCreateDesignPlan],
  ['audit_existing_ui', handleAuditExistingUI],
  ['audit_accessibility', handleAuditAccessibility],
  ['audit_responsive', handleAuditResponsive],
  ['recommend_modernization', handleRecommendModernization],
  ['search_public_apis', handleSearchPublicApis],
  ['search_mcp_servers', handleSearchMcpServers],
  ['discover_sources', handleDiscoverSources],
  ['search_sources', handleSearchSources],
  ['rank_sources', handleRankSources],
  ['inspect_source', handleInspectSource],
  ['recommend_sources_for_product', handleRecommendSourcesForProduct],
  ['recommend_sources_for_stack', handleRecommendSourcesForStack],
  ['check_source_license', handleCheckSourceLicense],
  ['generate_engineering_policy', handleGenerateEngineeringPolicy],
  ['evaluate_release_gates', handleEvaluateReleaseGates],
  ['generate_threat_model', handleGenerateThreatModel],
  ['detect_tool_capabilities', handleDetectToolCapabilities],
  ['run_safe_security_scan', handleRunSafeSecurityScan],
  ['generate_user_journeys', handleGenerateUserJourneys],
  ['generate_playwright_test', handleGeneratePlaywrightTest],
  ['generate_qa_report', handleGenerateQAReport],
  ['generate_test_pyramid', handleGenerateTestPyramid],
  ['analyze_architecture', handleAnalyzeArchitecture],
  ['generate_adr', handleGenerateADR],
  ['analyze_database_schema', handleAnalyzeDatabaseSchema],
  ['evaluate_api_compatibility', handleEvaluateAPICompatibility],
  ['classify_code_paths', handleClassifyCodePaths],
  ['create_action_plan', handleCreateActionPlan],
  ['evaluate_scope', handleEvaluateScope],
  ['evaluate_change_risk', handleEvaluateChangeRisk],
  ['create_checkpoint_plan', handleCreateCheckpointPlan],
  ['create_verification_plan', handleCreateVerificationPlan],
  ['normalize_verification_evidence', handleNormalizeVerificationEvidence],
  ['review_change', handleReviewChange],
  ['detect_regression', handleDetectRegression],
  ['create_environment_profile', handleCreateEnvironmentProfile],
  ['route_context', handleRouteContext],
  ['route_tool', handleRouteTool],
  ['create_execution_journal', handleCreateExecutionJournal],
  ['evaluate_completion_claim', handleEvaluateCompletionClaim],
  ['discover_design_sources', handleDiscoverDesignSources],
  ['search_design_sources', handleSearchDesignSources],
  ['inspect_design_source', handleInspectDesignSource],
  ['sync_design_sources', handleSyncDesignSources],
  ['recommend_design_sources', handleRecommendDesignSources],
  ['search_patterns', handleSearchPatterns],
  ['inspect_pattern', handleInspectPattern],
  ['search_registries', handleSearchRegistries],
  ['search_registry_components', handleSearchRegistryComponents],
  ['inspect_registry_component', handleInspectRegistryComponent],
  ['discover_ai_skills', handleDiscoverAiSkills],
  ['inspect_ai_skill', handleInspectAiSkill],
  ['recommend_icon_system', handleRecommendIconSystem],
  ['recommend_chart_library', handleRecommendChartLibrary],
  ['recommend_data_grid', handleRecommendDataGrid],
  ['explain_source_recommendation', handleExplainSourceRecommendation],
  ['create_design_intent', handleCreateDesignIntent],
  ['create_page_blueprint', handleCreatePageBlueprint],
  ['create_component_blueprint', handleCreateComponentBlueprint],
  ['create_app_shell_blueprint', handleCreateAppShellBlueprint],
  ['render_blueprint', handleRenderBlueprint],
  ['render_component', handleRenderComponent],
  ['create_ui_recipe', handleCreateUiRecipe],
  ['select_design_personality', handleSelectDesignPersonality],
  ['evaluate_design_antipatterns', handleEvaluateDesignAntipatterns],
  ['compare_renderer_parity', handleCompareRendererParity],
  ['inspect_alper_registry', handleInspectAlperRegistry],
  ['evaluate_truthful_ui', handleEvaluateTruthfulUi],
  ['audit_data_provenance', handleAuditDataProvenance],
  ['evaluate_page_intent', handleEvaluatePageIntent],
  ['audit_information_relevance', handleAuditInformationRelevance],
  ['classify_source_authority', handleClassifySourceAuthority],
  ['evaluate_content_truth_gate', handleEvaluateContentTruthGate],
  ['manage_human_visual_approval', handleManageHumanVisualApproval],
  ['audit_track_trace_telemetry', handleAuditTrackTraceTelemetry],
  ['create_manual_run_bundle', handleCreateManualRunBundle],
  ['verify_manual_run_evidence', handleVerifyManualRunEvidence],
  ['resolve_browser_runtime', handleResolveBrowserRuntime],
  ['run_operator_doctor', handleRunOperatorDoctor],
  ['profile_existing_project', handleProfileExistingProject],
  ['create_behavioral_baseline', handleCreateBehavioralBaseline],
  ['create_preservation_contract', handleCreatePreservationContract],
  ['classify_existing_elements', handleClassifyExistingElements],
  ['create_modernization_intent', handleCreateModernizationIntent],
  ['create_modernization_plan', handleCreateModernizationPlan],
  ['select_modernization_strategy', handleSelectModernizationStrategy],
  ['create_modernization_stages', handleCreateModernizationStages],
  ['evaluate_modernization_completion', handleEvaluateModernizationCompletion],
  ['create_greenfield_project_profile', handleCreateGreenfieldProjectProfile],
  ['derive_requirements', handleDeriveRequirements],
  ['create_requirement_traceability', handleCreateRequirementTraceability],
  ['recommend_architecture', handleRecommendArchitecture],
  ['recommend_stack', handleRecommendStack],
  ['create_database_blueprint', handleCreateDatabaseBlueprint],
  ['create_api_blueprint', handleCreateApiBlueprint],
  ['create_auth_model', handleCreateAuthModel],
  ['create_page_inventory', handleCreatePageInventory],
  ['create_project_blueprint', handleCreateProjectBlueprint],
  ['create_project_implementation_plan', handleCreateProjectImplementationPlan],
  ['scaffold_new_project', handleScaffoldNewProject],
  ['evaluate_new_project_completion', handleEvaluateNewProjectCompletion],
  ['initialize_project_intelligence', handleInitializeProjectIntelligence],
  ['load_project_intelligence', handleLoadProjectIntelligence],
  ['record_project_decision', handleRecordProjectDecision],
  ['record_business_rule', handleRecordBusinessRule],
  ['record_project_invariant', handleRecordProjectInvariant],
  ['build_project_architecture_graph', handleBuildProjectArchitectureGraph],
  ['create_project_snapshot', handleCreateProjectSnapshot],
  ['detect_project_drift', handleDetectProjectDrift],
  ['analyze_change_impact', handleAnalyzeChangeImpact],
  ['build_task_context', handleBuildTaskContext],
  ['detect_knowledge_conflicts', handleDetectKnowledgeConflicts],
  ['record_lesson_learned', handleRecordLessonLearned],
  ['propose_improvement_candidate', handleProposeImprovementCandidate],
  ['evaluate_project_knowledge_health', handleEvaluateProjectKnowledgeHealth]
]);






