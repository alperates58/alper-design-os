import * as T from '../types.js';

export interface McpToolDefinition<TInput = any, TOutput = any> {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
  parser: (rawArgs: unknown) => TInput;
  handler: (parsedInput: TInput) => TOutput | Promise<TOutput>;
}

export interface ToolHandlersMap {
  handleAnalyzeProject: (input: T.AnalyzeProjectInput) => any;
  handleDetectStack: (input: T.DetectStackInput) => any;
  handleUnderstandProduct: (input: T.UnderstandProductInput) => any;
  handleResearchDomain: (input: T.ResearchDomainInput) => any;
  handleRecommendUXPatterns: (input: T.RecommendUXPatternsInput) => any;
  handleSearchDesignPatterns: (input: T.SearchDesignPatternsInput) => any;
  handleSearchComponents: (input: T.SearchComponentsInput) => any;
  handleGetDesignTokens: (input: T.GetDesignTokensInput) => any;
  handleCreateDesignPlan: (input: T.CreateDesignPlanInput) => any;
  handleAuditExistingUI: (input: T.AuditExistingUIInput) => any;
  handleAuditAccessibility: (input: T.AuditAccessibilityInput) => any;
  handleAuditResponsive: (input: T.AuditResponsiveInput) => any;
  handleRecommendModernization: (input: T.RecommendModernizationInput) => any;
  handleSearchPublicApis: (input: T.SearchPublicApisInput) => any;
  handleSearchMcpServers: (input: T.SearchMcpServersInput) => any;
  handleDiscoverSources: (input: T.DiscoverSourcesInput) => any;
  handleSearchSources: (input: T.SearchSourcesInput) => any;
  handleRankSources: (input: T.RankSourcesInput) => any;
  handleInspectSource: (input: T.InspectSourceInput) => any;
  handleRecommendSourcesForProduct: (input: T.RecommendSourcesForProductInput) => any;
  handleRecommendSourcesForStack: (input: T.RecommendSourcesForStackInput) => any;
  handleCheckSourceLicense: (input: T.CheckSourceLicenseInput) => any;
  handleGenerateEngineeringPolicy: (input: T.GenerateEngineeringPolicyInput) => any;
  handleEvaluateReleaseGates: (input: T.EvaluateReleaseGatesInput) => any;
  handleGenerateThreatModel: (input: T.GenerateThreatModelInput) => any;
  handleDetectToolCapabilities: (input: T.DetectToolCapabilitiesInput) => Promise<any>;
  handleRunSafeSecurityScan: (input: T.RunSafeSecurityScanInput) => Promise<any>;
  handleGenerateUserJourneys: (input: T.GenerateUserJourneysInput) => any;
  handleGeneratePlaywrightTest: (input: T.GeneratePlaywrightTestInput) => any;
  handleGenerateQAReport: (input: T.GenerateQAReportInput) => any;
  handleGenerateTestPyramid: (input: T.GenerateTestPyramidInput) => any;
  handleAnalyzeArchitecture: (input: T.AnalyzeArchitectureInput) => any;
  handleGenerateADR: (input: T.GenerateADRInput) => any;
  handleAnalyzeDatabaseSchema: (input: T.AnalyzeDatabaseSchemaInput) => any;
  handleEvaluateAPICompatibility: (input: T.EvaluateAPICompatibilityInput) => any;
  handleClassifyCodePaths: (input: T.ClassifyCodePathsInput) => any;
  handleCreateActionPlan: (input: T.CreateActionPlanInput) => any;
  handleEvaluateScope: (input: T.EvaluateScopeInput) => any;
  handleEvaluateChangeRisk: (input: T.EvaluateChangeRiskInput) => any;
  handleCreateCheckpointPlan: (input: T.CreateCheckpointPlanInput) => any;
  handleCreateVerificationPlan: (input: T.CreateVerificationPlanInput) => any;
  handleNormalizeVerificationEvidence: (input: T.NormalizeVerificationEvidenceInput) => any;
  handleReviewChange: (input: T.ReviewChangeInput) => any;
  handleDetectRegression: (input: T.DetectRegressionInput) => any;
  handleCreateEnvironmentProfile: (input: T.CreateEnvironmentProfileInput) => any;
  handleRouteContext: (input: T.RouteContextInput) => any;
  handleRouteTool: (input: T.RouteToolInput) => any;
  handleCreateExecutionJournal: (input: T.CreateExecutionJournalInput) => any;
  handleEvaluateCompletionClaim: (input: T.EvaluateCompletionClaimInput) => any;
  handleDiscoverDesignSources: (input: T.DiscoverDesignSourcesInput) => any;
  handleSearchDesignSources: (input: T.SearchDesignSourcesInput) => any;
  handleInspectDesignSource: (input: T.InspectDesignSourceInput) => any;
  handleSyncDesignSources: (input: T.SyncDesignSourcesInput) => Promise<any>;
  handleRecommendDesignSources: (input: T.RecommendDesignSourcesInput) => any;
  handleSearchPatterns: (input: T.SearchPatternsInput) => any;
  handleInspectPattern: (input: T.InspectPatternInput) => any;
  handleSearchRegistries: (input: T.SearchRegistriesInput) => any;
  handleSearchRegistryComponents: (input: T.SearchRegistryComponentsInput) => any;
  handleInspectRegistryComponent: (input: T.InspectRegistryComponentInput) => any;
  handleDiscoverAiSkills: (input: T.DiscoverAiSkillsInput) => any;
  handleInspectAiSkill: (input: T.InspectAiSkillInput) => any;
  handleRecommendIconSystem: (input: T.RecommendIconSystemInput) => any;
  handleRecommendChartLibrary: (input: T.RecommendChartLibraryInput) => any;
  handleRecommendDataGrid: (input: T.RecommendDataGridInput) => any;
  handleExplainSourceRecommendation: (input: T.ExplainSourceRecommendationInput) => any;
  handleCreateDesignIntent: (input: T.CreateDesignIntentInput) => any;
  handleCreatePageBlueprint: (input: T.CreatePageBlueprintInput) => any;
  handleCreateComponentBlueprint: (input: T.CreateComponentBlueprintInput) => any;
  handleCreateAppShellBlueprint: (input: T.CreateAppShellBlueprintInput) => any;
  handleRenderBlueprint: (input: T.RenderBlueprintInput) => any;
  handleRenderComponent: (input: T.RenderComponentInput) => any;
  handleCreateUiRecipe: (input: T.CreateUiRecipeInput) => any;
  handleSelectDesignPersonality: (input: T.SelectDesignPersonalityInput) => any;
  handleEvaluateDesignAntipatterns: (input: T.EvaluateDesignAntipatternsInput) => any;
  handleCompareRendererParity: (input: T.CompareRendererParityInput) => any;
  handleInspectAlperRegistry: (input: T.InspectAlperRegistryInput) => any;
  handleEvaluateTruthfulUi: (input: T.EvaluateTruthfulUiInput) => any;
  handleAuditDataProvenance: (input: T.AuditDataProvenanceInput) => any;
  handleEvaluatePageIntent: (input: T.EvaluatePageIntentInput) => any;
  handleAuditInformationRelevance: (input: T.AuditInformationRelevanceInput) => any;
  handleClassifySourceAuthority: (input: T.ClassifySourceAuthorityInput) => any;
  handleEvaluateContentTruthGate: (input: T.EvaluateContentTruthGateInput) => any;
  handleManageHumanVisualApproval: (input: T.ManageHumanVisualApprovalInput) => any;
  handleAuditTrackTraceTelemetry: (input: T.AuditTrackTraceTelemetryInput) => any;
  handleCreateManualRunBundle: (input: T.CreateManualRunBundleInput) => any;
  handleVerifyManualRunEvidence: (input: T.VerifyManualRunEvidenceInput) => any;
  handleResolveBrowserRuntime: (input: T.ResolveBrowserRuntimeInput) => any;
  handleRunOperatorDoctor: (input: T.RunOperatorDoctorInput) => any;
  handleProfileExistingProject: (input: T.ProfileExistingProjectInput) => any;
  handleCreateBehavioralBaseline: (input: T.CreateBehavioralBaselineInput) => any;
  handleCreatePreservationContract: (input: T.CreatePreservationContractInput) => any;
  handleClassifyExistingElements: (input: T.ClassifyExistingElementsInput) => any;
  handleCreateModernizationIntent: (input: T.CreateModernizationIntentInput) => any;
  handleCreateModernizationPlan: (input: T.CreateModernizationPlanInput) => any;
  handleSelectModernizationStrategy: (input: T.SelectModernizationStrategyInput) => any;
  handleCreateModernizationStages: (input: T.CreateModernizationStagesInput) => any;
  handleEvaluateModernizationCompletion: (input: T.EvaluateModernizationCompletionInput) => any;
  handleCreateGreenfieldProjectProfile: (input: T.CreateGreenfieldProjectProfileInput) => any;
  handleDeriveRequirements: (input: T.DeriveRequirementsInput) => any;
  handleCreateRequirementTraceability: (input: T.CreateRequirementTraceabilityInput) => any;
  handleRecommendArchitecture: (input: T.RecommendArchitectureInput) => any;
  handleRecommendStack: (input: T.RecommendStackInput) => any;
  handleCreateDatabaseBlueprint: (input: T.CreateDatabaseBlueprintInput) => any;
  handleCreateApiBlueprint: (input: T.CreateApiBlueprintInput) => any;
  handleCreateAuthModel: (input: T.CreateAuthModelInput) => any;
  handleCreatePageInventory: (input: T.CreatePageInventoryInput) => any;
  handleCreateProjectBlueprint: (input: T.CreateProjectBlueprintInput) => any;
  handleCreateProjectImplementationPlan: (input: T.CreateProjectImplementationPlanInput) => any;
  handleScaffoldNewProject: (input: T.ScaffoldNewProjectInput) => any;
  handleEvaluateNewProjectCompletion: (input: T.EvaluateNewProjectCompletionInput) => any;
  handleInitializeProjectIntelligence: (input: T.InitializeProjectIntelligenceInput) => any;
  handleLoadProjectIntelligence: (input: T.LoadProjectIntelligenceInput) => any;
  handleRecordProjectDecision: (input: T.RecordProjectDecisionInput) => any;
  handleRecordBusinessRule: (input: T.RecordBusinessRuleInput) => any;
  handleRecordProjectInvariant: (input: T.RecordProjectInvariantInput) => any;
  handleBuildProjectArchitectureGraph: (input: T.BuildProjectArchitectureGraphInput) => any;
  handleCreateProjectSnapshot: (input: T.CreateProjectSnapshotInput) => any;
  handleDetectProjectDrift: (input: T.DetectProjectDriftInput) => any;
  handleAnalyzeChangeImpact: (input: T.AnalyzeChangeImpactInput) => any;
  handleBuildTaskContext: (input: T.BuildTaskContextInput) => any;
  handleDetectKnowledgeConflicts: (input: T.DetectKnowledgeConflictsInput) => any;
  handleRecordLessonLearned: (input: T.RecordLessonLearnedInput) => any;
  handleProposeImprovementCandidate: (input: T.ProposeImprovementCandidateInput) => any;
  handleEvaluateProjectKnowledgeHealth: (input: T.EvaluateProjectKnowledgeHealthInput) => any;
}

export function createCanonicalToolDefinitions(h: ToolHandlersMap): McpToolDefinition[] {
  return [
    {
      name: 'analyze_project',
      description: 'Performs read-only comprehensive stack, UI, and accessibility analysis on an existing project.',
      inputSchema: {
        type: 'object',
        properties: {
          projectPath: { type: 'string', description: 'Path to directory to inspect' }
        },
        required: ['projectPath']
      },
      parser: (args) => T.AnalyzeProjectInputSchema.parse(args),
      handler: h.handleAnalyzeProject
    },
    {
      name: 'detect_stack',
      description: 'Quickly detects project languages, frameworks, styling libraries, and package managers.',
      inputSchema: {
        type: 'object',
        properties: {
          projectPath: { type: 'string', description: 'Path to inspect' }
        },
        required: ['projectPath']
      },
      parser: (args) => T.DetectStackInputSchema.parse(args),
      handler: h.handleDetectStack
    },
    {
      name: 'understand_product',
      description: 'Infuses product brief with Domain Intelligence and outputs a structured ProductUXProfile.',
      inputSchema: {
        type: 'object',
        properties: {
          productName: { type: 'string' },
          description: { type: 'string' },
          domain: { type: 'string' },
          targetUsers: { type: 'array', items: { type: 'string' } },
          keyFeatures: { type: 'array', items: { type: 'string' } },
          operatingEnvironment: { type: 'string' }
        },
        required: ['productName', 'description']
      },
      parser: (args) => T.UnderstandProductInputSchema.parse(args),
      handler: h.handleUnderstandProduct
    },
    {
      name: 'research_domain',
      description: 'Extracts domain classification, mental models, typical personas, workflows, and DomainIntelligenceV2 empirical evidence.',
      inputSchema: {
        type: 'object',
        properties: {
          domainQuery: { type: 'string', description: 'Domain name or topic' }
        },
        required: ['domainQuery']
      },
      parser: (args) => T.ResearchDomainInputSchema.parse(args),
      handler: h.handleResearchDomain
    },
    {
      name: 'recommend_ux_patterns',
      description: 'Recommends core UX patterns matched to density and interaction style.',
      inputSchema: {
        type: 'object',
        properties: {
          density: { type: 'string', enum: ['EXTREME', 'HIGH', 'MEDIUM', 'SPACIOUS'] },
          interactionStyle: { type: 'string', enum: ['KEYBOARD_FIRST', 'HYBRID_MOUSE_KEYBOARD', 'TOUCH_OPTIMIZED', 'GUIDED_WIZARD'] }
        }
      },
      parser: (args) => T.RecommendUXPatternsInputSchema.parse(args),
      handler: h.handleRecommendUXPatterns
    },
    {
      name: 'search_design_patterns',
      description: 'Searches the core UX pattern catalog (High-density grids, Split panes, Timelines, etc.).',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string' }
        },
        required: ['query']
      },
      parser: (args) => T.SearchDesignPatternsInputSchema.parse(args),
      handler: h.handleSearchDesignPatterns
    },
    {
      name: 'search_components',
      description: 'Inspects available adapter components implementing a specific pattern.',
      inputSchema: {
        type: 'object',
        properties: {
          patternId: { type: 'string' },
          adapterId: { type: 'string' }
        },
        required: ['patternId']
      },
      parser: (args) => T.SearchComponentsInputSchema.parse(args),
      handler: h.handleSearchComponents
    },
    {
      name: 'get_design_tokens',
      description: 'Compiles technology-agnostic DTCG tokens into target format (css, scss, typescript, tailwind-json).',
      inputSchema: {
        type: 'object',
        properties: {
          format: { type: 'string', enum: ['css', 'scss', 'typescript', 'tailwind-json'], default: 'css' },
          density: { type: 'string', enum: ['EXTREME', 'HIGH', 'MEDIUM', 'SPACIOUS'], default: 'HIGH' }
        }
      },
      parser: (args) => T.GetDesignTokensInputSchema.parse(args),
      handler: h.handleGetDesignTokens
    },
    {
      name: 'create_design_plan',
      description: 'Generates a phased design execution plan for NEW, REPAIR, or MODERNIZE workflows.',
      inputSchema: {
        type: 'object',
        properties: {
          mode: { type: 'string', enum: ['NEW', 'REPAIR', 'MODERNIZE'] },
          productName: { type: 'string' },
          adapterId: { type: 'string' },
          briefOrProfile: { type: 'object' }
        },
        required: ['mode', 'productName', 'adapterId', 'briefOrProfile']
      },
      parser: (args) => T.CreateDesignPlanInputSchema.parse(args),
      handler: h.handleCreateDesignPlan
    },
    {
      name: 'audit_existing_ui',
      description: 'Audits existing stylesheets and markup for token violations and overflow bugs.',
      inputSchema: {
        type: 'object',
        properties: {
          projectPath: { type: 'string' }
        },
        required: ['projectPath']
      },
      parser: (args) => T.AuditExistingUIInputSchema.parse(args),
      handler: h.handleAuditExistingUI
    },
    {
      name: 'audit_accessibility',
      description: 'Checks markup for WCAG 2.2 AA/AAA (or 2.1 AA/AAA) compliance issues (contrast, labels, aria, target size).',
      inputSchema: {
        type: 'object',
        properties: {
          projectPath: { type: 'string' },
          targetLevel: { type: 'string', enum: ['WCAG_2_2_AA', 'WCAG_2_2_AAA', 'WCAG_2_1_AA', 'WCAG_2_1_AAA'], default: 'WCAG_2_2_AA' }
        },
        required: ['projectPath']
      },
      parser: (args) => T.AuditAccessibilityInputSchema.parse(args),
      handler: h.handleAuditAccessibility
    },
    {
      name: 'audit_responsive',
      description: 'Evaluates layout responsiveness and split pane flexibility.',
      inputSchema: {
        type: 'object',
        properties: {
          projectPath: { type: 'string' }
        },
        required: ['projectPath']
      },
      parser: (args) => T.AuditResponsiveInputSchema.parse(args),
      handler: h.handleAuditResponsive
    },
    {
      name: 'recommend_modernization',
      description: 'Generates an incremental 4-phase modernization strategy for legacy codebases.',
      inputSchema: {
        type: 'object',
        properties: {
          projectPath: { type: 'string' },
          targetAdapter: { type: 'string' }
        },
        required: ['projectPath']
      },
      parser: (args) => T.RecommendModernizationInputSchema.parse(args),
      handler: h.handleRecommendModernization
    },
    {
      name: 'search_public_apis',
      description: 'Discovers verified public APIs from the public-apis index for data modeling.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string' },
          category: { type: 'string' }
        },
        required: ['query']
      },
      parser: (args) => T.SearchPublicApisInputSchema.parse(args),
      handler: h.handleSearchPublicApis
    },
    {
      name: 'search_mcp_servers',
      description: 'Discovers verified MCP servers from the awesome-mcp-servers index.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string' },
          category: { type: 'string' }
        },
        required: ['query']
      },
      parser: (args) => T.SearchMcpServersInputSchema.parse(args),
      handler: h.handleSearchMcpServers
    },
    {
      name: 'discover_sources',
      description: 'Discovers world-class design systems, component libraries, and accessibility standards with filtering.',
      inputSchema: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          framework: { type: 'string' },
          domain: { type: 'string' },
          accessibilityLevel: { type: 'string' },
          minTrustScore: { type: 'number' },
          searchQuery: { type: 'string' }
        }
      },
      parser: (args) => T.DiscoverSourcesInputSchema.parse(args),
      handler: h.handleDiscoverSources
    },
    {
      name: 'search_sources',
      description: 'Full-text ranked search across the open-source design systems and knowledge catalog.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string' },
          framework: { type: 'string' },
          domain: { type: 'string' }
        },
        required: ['query']
      },
      parser: (args) => T.SearchSourcesInputSchema.parse(args),
      handler: h.handleSearchSources
    },
    {
      name: 'rank_sources',
      description: 'Scores and ranks design system sources using weighted multi-criteria algorithms.',
      inputSchema: {
        type: 'object',
        properties: {
          framework: { type: 'string' },
          domain: { type: 'string' },
          requirePermissiveLicense: { type: 'boolean' }
        }
      },
      parser: (args) => T.RankSourcesInputSchema.parse(args),
      handler: h.handleRankSources
    },
    {
      name: 'inspect_source',
      description: 'Inspects full normalized metadata for a specific design system, library, or standard.',
      inputSchema: {
        type: 'object',
        properties: {
          sourceId: { type: 'string' }
        },
        required: ['sourceId']
      },
      parser: (args) => T.InspectSourceInputSchema.parse(args),
      handler: h.handleInspectSource
    },
    {
      name: 'recommend_sources_for_product',
      description: 'Recommends matching design systems and guidelines based on a ProductUXProfile or product brief.',
      inputSchema: {
        type: 'object',
        properties: {
          profile: { type: 'object' },
          productName: { type: 'string' },
          description: { type: 'string' },
          domain: { type: 'string' }
        }
      },
      parser: (args) => T.RecommendSourcesForProductInputSchema.parse(args),
      handler: h.handleRecommendSourcesForProduct
    },
    {
      name: 'recommend_sources_for_stack',
      description: 'Recommends design systems and component libraries tailored to a specific tech stack (React, Blade, Razor, etc.).',
      inputSchema: {
        type: 'object',
        properties: {
          framework: { type: 'string' },
          domain: { type: 'string' }
        },
        required: ['framework']
      },
      parser: (args) => T.RecommendSourcesForStackInputSchema.parse(args),
      handler: h.handleRecommendSourcesForStack
    },
    {
      name: 'check_source_license',
      description: 'Checks software license compliance, commercial usage permissions, and attribution requirements.',
      inputSchema: {
        type: 'object',
        properties: {
          license: { type: 'string' }
        },
        required: ['license']
      },
      parser: (args) => T.CheckSourceLicenseInputSchema.parse(args),
      handler: h.handleCheckSourceLicense
    },
    {
      name: 'generate_engineering_policy',
      description: 'Generates stack-aware EngineeringQualityProfile (security, quality, performance budgets, release gates).',
      inputSchema: {
        type: 'object',
        properties: {
          stack: { type: 'string' },
          securityLevel: { type: 'string', enum: ['STANDARD', 'HIGH', 'CRITICAL'] },
          targetEnvironment: { type: 'string' }
        },
        required: ['stack']
      },
      parser: (args) => T.GenerateEngineeringPolicyInputSchema.parse(args),
      handler: h.handleGenerateEngineeringPolicy
    },
    {
      name: 'evaluate_release_gates',
      description: 'Evaluates security, code quality, dependency, secret findings, and critical test failures against release gates.',
      inputSchema: {
        type: 'object',
        properties: {
          profile: { type: 'object' },
          staticIssues: { type: 'array', items: { type: 'object' } },
          dynamicIssues: { type: 'array', items: { type: 'object' } },
          vulnerableDependencies: { type: 'array', items: { type: 'object' } },
          detectedSecrets: { type: 'array', items: { type: 'object' } },
          criticalTestsFailed: { type: ['boolean', 'number'] },
          a11yScore: { type: 'number' },
          visualRegressionDiffs: { type: 'number' },
          unresolvedConflicts: { type: 'number' }
        }
      },
      parser: (args) => T.EvaluateReleaseGatesInputSchema.parse(args),
      handler: h.handleEvaluateReleaseGates
    },
    {
      name: 'generate_threat_model',
      description: 'Generates STRIDE threat model with asset, boundary, and mitigation mapping.',
      inputSchema: {
        type: 'object',
        properties: {
          systemName: { type: 'string' },
          architecture: { type: 'string' },
          dataAssets: { type: 'array', items: { type: 'string' } },
          externalInterfaces: { type: 'array', items: { type: 'string' } }
        },
        required: ['systemName']
      },
      parser: (args) => T.GenerateThreatModelInputSchema.parse(args),
      handler: h.handleGenerateThreatModel
    },
    {
      name: 'detect_tool_capabilities',
      description: 'Detects available security, linting, testing, and profiling tools on host machine.',
      inputSchema: {
        type: 'object',
        properties: {
          targetTools: { type: 'array', items: { type: 'string' } }
        }
      },
      parser: (args) => T.DetectToolCapabilitiesInputSchema.parse(args),
      handler: h.handleDetectToolCapabilities
    },
    {
      name: 'run_safe_security_scan',
      description: 'Executes safe passive code security scan. Active DAST requires targetUrl and activeScanApproved=true.',
      inputSchema: {
        type: 'object',
        properties: {
          targetDir: { type: 'string' },
          activeScanApproved: { type: 'boolean' },
          targetUrl: { type: 'string' }
        },
        required: ['targetDir']
      },
      parser: (args) => T.RunSafeSecurityScanInputSchema.parse(args),
      handler: h.handleRunSafeSecurityScan
    },
    {
      name: 'generate_user_journeys',
      description: 'Synthesizes persona-driven user journeys from ProductUXProfile or product requirements.',
      inputSchema: {
        type: 'object',
        properties: {
          productName: { type: 'string' },
          description: { type: 'string' },
          domain: { type: 'string' }
        },
        required: ['productName', 'description']
      },
      parser: (args) => T.GenerateUserJourneysInputSchema.parse(args),
      handler: h.handleGenerateUserJourneys
    },
    {
      name: 'generate_playwright_test',
      description: 'Generates resilient Playwright test script using accessible role locators and viewport matrix.',
      inputSchema: {
        type: 'object',
        properties: {
          journeyTitle: { type: 'string' },
          targetUrl: { type: 'string' },
          steps: { type: 'array', items: { type: 'object' } }
        },
        required: ['journeyTitle', 'targetUrl', 'steps']
      },
      parser: (args) => T.GeneratePlaywrightTestInputSchema.parse(args),
      handler: h.handleGeneratePlaywrightTest
    },
    {
      name: 'generate_qa_report',
      description: 'Generates comprehensive QA verification report (markdown and JSON) with unverified areas prominently noted.',
      inputSchema: {
        type: 'object',
        properties: {
          targetApplication: { type: 'string' },
          testedFlows: { type: 'array', items: { type: 'string' } },
          consoleErrors: { type: 'array', items: { type: 'object' } },
          networkFailures: { type: 'array', items: { type: 'object' } },
          accessibilityFindings: { type: 'array', items: { type: 'string' } },
          visualDiffs: { type: 'array', items: { type: 'object' } },
          unverifiedAreas: { type: 'array', items: { type: 'string' } }
        },
        required: ['targetApplication']
      },
      parser: (args) => T.GenerateQAReportInputSchema.parse(args),
      handler: h.handleGenerateQAReport
    },
    {
      name: 'generate_test_pyramid',
      description: 'Generates context-aware testing strategy pyramid based on application archetype.',
      inputSchema: {
        type: 'object',
        properties: {
          projectName: { type: 'string' },
          projectType: { type: 'string', enum: ['LANDING_PAGE', 'ENTERPRISE_ERP_CRM', 'MICROSERVICE_API', 'STANDARD_WEB'] }
        },
        required: ['projectName', 'projectType']
      },
      parser: (args) => T.GenerateTestPyramidInputSchema.parse(args),
      handler: h.handleGenerateTestPyramid
    },
    {
      name: 'analyze_architecture',
      description: 'Detects architectural style, subsystem boundaries, coupling, and circular dependencies.',
      inputSchema: {
        type: 'object',
        properties: {
          projectPath: { type: 'string' }
        },
        required: ['projectPath']
      },
      parser: (args) => T.AnalyzeArchitectureInputSchema.parse(args),
      handler: h.handleAnalyzeArchitecture
    },
    {
      name: 'generate_adr',
      description: 'Generates Architecture Decision Record (ADR) document with number, context, decision, and trade-offs.',
      inputSchema: {
        type: 'object',
        properties: {
          number: { type: 'number' },
          title: { type: 'string' },
          context: { type: 'string' },
          decision: { type: 'string' },
          consequences: { type: 'object' }
        },
        required: ['number', 'title', 'context', 'decision', 'consequences']
      },
      parser: (args) => T.GenerateADRInputSchema.parse(args),
      handler: h.handleGenerateADR
    },
    {
      name: 'analyze_database_schema',
      description: 'Detects database engine, classifies migration safety (SAFE/REVIEW/DANGEROUS), and checks N+1 query hazards.',
      inputSchema: {
        type: 'object',
        properties: {
          projectPath: { type: 'string' },
          migrationContent: { type: 'string' },
          querySample: { type: 'string' }
        }
      },
      parser: (args) => T.AnalyzeDatabaseSchemaInputSchema.parse(args),
      handler: h.handleAnalyzeDatabaseSchema
    },
    {
      name: 'evaluate_api_compatibility',
      description: 'Evaluates OpenAPI/AsyncAPI specifications for breaking changes, removed endpoints, and altered payloads.',
      inputSchema: {
        type: 'object',
        properties: {
          oldSpec: { type: 'string' },
          newSpec: { type: 'string' },
          specType: { type: 'string', enum: ['OPENAPI', 'ASYNCAPI'], default: 'OPENAPI' }
        },
        required: ['oldSpec', 'newSpec']
      },
      parser: (args) => T.EvaluateAPICompatibilityInputSchema.parse(args),
      handler: h.handleEvaluateAPICompatibility
    },
    {
      name: 'classify_code_paths',
      description: 'Classifies repository file paths into SOURCE, GENERATED, VENDORED, BUILD_OUTPUT, MIGRATION, or CONFIGURATION.',
      inputSchema: {
        type: 'object',
        properties: {
          paths: { type: 'array', items: { type: 'string' } }
        },
        required: ['paths']
      },
      parser: (args) => T.ClassifyCodePathsInputSchema.parse(args),
      handler: h.handleClassifyCodePaths
    },
    {
      name: 'create_action_plan',
      description: 'Generates a validated AgentActionPlan with blast radius, forbidden files, rollback strategies, and mandatory verification.',
      inputSchema: {
        type: 'object',
        properties: {
          objective: { type: 'string' },
          requestedScope: { type: 'array', items: { type: 'string' } },
          filesExpectedToChange: { type: 'array', items: { type: 'string' } },
          filesForbiddenToChange: { type: 'array', items: { type: 'string' } },
          detectedProject: { type: 'object' }
        },
        required: ['objective', 'requestedScope', 'filesExpectedToChange']
      },
      parser: (args) => T.CreateActionPlanInputSchema.parse(args),
      handler: h.handleCreateActionPlan
    },
    {
      name: 'evaluate_scope',
      description: 'Audits proposed file modifications against requested scope boundaries to prevent uninvited silent expansion.',
      inputSchema: {
        type: 'object',
        properties: {
          filesToChange: { type: 'array', items: { type: 'string' } },
          requestedScope: { type: 'array', items: { type: 'string' } },
          forbiddenList: { type: 'array', items: { type: 'string' } }
        },
        required: ['filesToChange', 'requestedScope']
      },
      parser: (args) => T.EvaluateScopeInputSchema.parse(args),
      handler: h.handleEvaluateScope
    },
    {
      name: 'evaluate_change_risk',
      description: 'Evaluates change blast radius across 10 safety dimensions and triggers mandatory checkpoints for high/critical risks.',
      inputSchema: {
        type: 'object',
        properties: {
          fileCount: { type: 'number' },
          architectureImpact: { type: 'boolean' },
          databaseImpact: { type: 'boolean' },
          authenticationImpact: { type: 'boolean' },
          authorizationImpact: { type: 'boolean' },
          publicApiImpact: { type: 'boolean' },
          dependencyImpact: { type: 'boolean' },
          configurationImpact: { type: 'boolean' },
          deploymentImpact: { type: 'boolean' },
          dataLossPossibility: { type: 'boolean' }
        }
      },
      parser: (args) => T.EvaluateChangeRiskInputSchema.parse(args),
      handler: h.handleEvaluateChangeRisk
    },
    {
      name: 'create_checkpoint_plan',
      description: 'Inspects git status, guards uncommitted user work, and creates a safe pre-change checkpoint and rollback script.',
      inputSchema: {
        type: 'object',
        properties: {
          gitStatusText: { type: 'string' },
          taskName: { type: 'string' },
          currentBranch: { type: 'string' }
        },
        required: ['gitStatusText', 'taskName']
      },
      parser: (args) => T.CreateCheckpointPlanInputSchema.parse(args),
      handler: h.handleCreateCheckpointPlan
    },
    {
      name: 'create_verification_plan',
      description: 'Generates a dynamic verification pipeline scaled to project archetype, UI context, security sensitivity, and risk level.',
      inputSchema: {
        type: 'object',
        properties: {
          objective: { type: 'string' },
          isUI: { type: 'boolean' },
          isSecuritySensitive: { type: 'boolean' },
          riskLevel: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] }
        },
        required: ['objective']
      },
      parser: (args) => T.CreateVerificationPlanInputSchema.parse(args),
      handler: h.handleCreateVerificationPlan
    },
    {
      name: 'normalize_verification_evidence',
      description: 'Normalizes heterogeneous verification artifacts into typed VerificationEvidence supporting 13 evidence types.',
      inputSchema: {
        type: 'object',
        properties: {
          rawItems: { type: 'array', items: { type: 'object' } }
        },
        required: ['rawItems']
      },
      parser: (args) => T.NormalizeVerificationEvidenceInputSchema.parse(args),
      handler: h.handleNormalizeVerificationEvidence
    },
    {
      name: 'review_change',
      description: 'Conducts independent reviewer audit across 12 criteria (scope, security, tests, console, network) yielding a verdict.',
      inputSchema: {
        type: 'object',
        properties: {
          taskObjective: { type: 'string' },
          diffContent: { type: 'string' },
          filesChanged: { type: 'array', items: { type: 'string' } },
          testOutput: { type: 'string' },
          testsPassed: { type: 'boolean' },
          consoleErrors: { type: 'array', items: { type: 'string' } },
          networkErrors: { type: 'array', items: { type: 'string' } },
          securityFindings: { type: 'array', items: { type: 'object' } }
        },
        required: ['taskObjective', 'diffContent', 'filesChanged']
      },
      parser: (args) => T.ReviewChangeInputSchema.parse(args),
      handler: h.handleReviewChange
    },
    {
      name: 'detect_regression',
      description: 'Compares current routes, APIs, components, and database invariants against baseline snapshots to detect regression.',
      inputSchema: {
        type: 'object',
        properties: {
          baselines: { type: 'array', items: { type: 'object' } },
          currentStates: { type: 'array', items: { type: 'object' } }
        },
        required: ['baselines', 'currentStates']
      },
      parser: (args) => T.DetectRegressionInputSchema.parse(args),
      handler: h.handleDetectRegression
    },
    {
      name: 'create_environment_profile',
      description: 'Inspects project lockfiles, runtime versions, required env vars, and machine-specific path portability issues.',
      inputSchema: {
        type: 'object',
        properties: {
          projectPath: { type: 'string' }
        },
        required: ['projectPath']
      },
      parser: (args) => T.CreateEnvironmentProfileInputSchema.parse(args),
      handler: h.handleCreateEnvironmentProfile
    },
    {
      name: 'route_context',
      description: 'Filters and scopes agent context to load only required skills, rules, sources, and tools to conserve token budget.',
      inputSchema: {
        type: 'object',
        properties: {
          taskId: { type: 'string' },
          taskBrief: { type: 'string' },
          detectedStack: { type: 'string' },
          domain: { type: 'string' },
          mode: { type: 'string', enum: ['NEW', 'REPAIR', 'MODERNIZE'] }
        },
        required: ['taskId', 'taskBrief']
      },
      parser: (args) => T.RouteContextInputSchema.parse(args),
      handler: h.handleRouteContext
    },
    {
      name: 'route_tool',
      description: 'Intelligently selects the optimal tool based on capability, cost, latency, risk, offline status, and safety.',
      inputSchema: {
        type: 'object',
        properties: {
          taskDescription: { type: 'string' },
          isOffline: { type: 'boolean' },
          requireLiveBrowser: { type: 'boolean' }
        },
        required: ['taskDescription']
      },
      parser: (args) => T.RouteToolInputSchema.parse(args),
      handler: h.handleRouteTool
    },
    {
      name: 'create_execution_journal',
      description: 'Creates machine-readable execution journal in .alper-design-os/runs/<run-id>/ with sanitized secrets.',
      inputSchema: {
        type: 'object',
        properties: {
          baseDir: { type: 'string' },
          runId: { type: 'string' },
          plan: { type: 'object' },
          projectProfile: { type: 'object' },
          actions: { type: 'array', items: { type: 'object' } },
          verification: { type: 'object' },
          evidence: { type: 'array', items: { type: 'object' } },
          review: { type: 'object' },
          summaryMarkdown: { type: 'string' }
        },
        required: ['baseDir', 'runId', 'plan']
      },
      parser: (args) => T.CreateExecutionJournalInputSchema.parse(args),
      handler: h.handleCreateExecutionJournal
    },
    {
      name: 'evaluate_completion_claim',
      description: 'Validates completion assertion against verified evidence, preventing unbacked claims.',
      inputSchema: {
        type: 'object',
        properties: {
          claim: { type: 'string' },
          evidences: { type: 'array', items: { type: 'object' } }
        },
        required: ['claim']
      },
      parser: (args) => T.EvaluateCompletionClaimInputSchema.parse(args),
      handler: h.handleEvaluateCompletionClaim
    },
    {
      name: 'discover_design_sources',
      description: 'Discovers authoritative design systems, component libraries, registries, icon sets, charts, and data grids with multi-criteria filtering.',
      inputSchema: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          types: { type: 'array', items: { type: 'string' } },
          framework: { type: 'string' },
          domain: { type: 'string' },
          accessibilityLevel: { type: 'string' },
          minTrustScore: { type: 'number' },
          maxLicenseRisk: { type: 'string', enum: ['PERMISSIVE_ONLY', 'ANY'] },
          searchQuery: { type: 'string' }
        }
      },
      parser: (args) => T.DiscoverDesignSourcesInputSchema.parse(args),
      handler: h.handleDiscoverDesignSources
    },
    {
      name: 'search_design_sources',
      description: 'Performs token-indexed fast inverted search across 65+ design systems, libraries, and frameworks.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string' },
          framework: { type: 'string' },
          domain: { type: 'string' },
          limit: { type: 'number' }
        },
        required: ['query']
      },
      parser: (args) => T.SearchDesignSourcesInputSchema.parse(args),
      handler: h.handleSearchDesignSources
    },
    {
      name: 'inspect_design_source',
      description: 'Inspects full normalized metadata V2 for a design source including quality scores, suitability, and licenses.',
      inputSchema: {
        type: 'object',
        properties: {
          sourceId: { type: 'string' }
        },
        required: ['sourceId']
      },
      parser: (args) => T.InspectDesignSourceInputSchema.parse(args),
      handler: h.handleInspectDesignSource
    },
    {
      name: 'sync_design_sources',
      description: 'Syncs metadata with remote sources with rate-limit protection and offline cache resilience.',
      inputSchema: {
        type: 'object',
        properties: {
          sourceIds: { type: 'array', items: { type: 'string' } },
          force: { type: 'boolean' }
        }
      },
      parser: (args) => T.SyncDesignSourcesInputSchema.parse(args),
      handler: h.handleSyncDesignSources
    },
    {
      name: 'recommend_design_sources',
      description: 'Recommends design sources with multi-criteria weighted scoring and structured "WHY" explanations.',
      inputSchema: {
        type: 'object',
        properties: {
          framework: { type: 'string' },
          domain: { type: 'string' },
          density: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'EXTREME'] },
          commercialAllowedOnly: { type: 'boolean' },
          componentType: { type: 'string' }
        }
      },
      parser: (args) => T.RecommendDesignSourcesInputSchema.parse(args),
      handler: h.handleRecommendDesignSources
    },
    {
      name: 'search_patterns',
      description: 'Searches the 28-node Pattern Knowledge Graph (e.g. DATA_TABLE, DENSE_GRID, MASTER_DETAIL).',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string' },
          category: { type: 'string' },
          applicableDomain: { type: 'string' }
        }
      },
      parser: (args) => T.SearchPatternsInputSchema.parse(args),
      handler: h.handleSearchPatterns
    },
    {
      name: 'inspect_pattern',
      description: 'Inspects detailed pattern specifications including keyboard navigation, accessibility, and candidate sources.',
      inputSchema: {
        type: 'object',
        properties: {
          patternId: { type: 'string' }
        },
        required: ['patternId']
      },
      parser: (args) => T.InspectPatternInputSchema.parse(args),
      handler: h.handleInspectPattern
    },
    {
      name: 'search_registries',
      description: 'Searches community and official UI component registries (shadcn/ui, Magic UI, Aceternity, Kokonut).',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string' },
          framework: { type: 'string' },
          freeTierOnly: { type: 'boolean' }
        }
      },
      parser: (args) => T.SearchRegistriesInputSchema.parse(args),
      handler: h.handleSearchRegistries
    },
    {
      name: 'search_registry_components',
      description: 'Searches components and blocks across discovered registries with dependency and file mapping.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string' },
          registryId: { type: 'string' },
          type: { type: 'string' }
        },
        required: ['query']
      },
      parser: (args) => T.SearchRegistryComponentsInputSchema.parse(args),
      handler: h.handleSearchRegistryComponents
    },
    {
      name: 'inspect_registry_component',
      description: 'Inspects a specific registry component or block with full dependency manifests.',
      inputSchema: {
        type: 'object',
        properties: {
          registryId: { type: 'string' },
          componentId: { type: 'string' }
        },
        required: ['registryId', 'componentId']
      },
      parser: (args) => T.InspectRegistryComponentInputSchema.parse(args),
      handler: h.handleInspectRegistryComponent
    },
    {
      name: 'discover_ai_skills',
      description: 'Discovers verified AI prompt skills and templates.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string' },
          domain: { type: 'string' }
        }
      },
      parser: (args) => T.DiscoverAiSkillsInputSchema.parse(args),
      handler: h.handleDiscoverAiSkills
    },
    {
      name: 'inspect_ai_skill',
      description: 'Audits an AI skill or prompt for prompt injection and malicious shell command risks.',
      inputSchema: {
        type: 'object',
        properties: {
          skillId: { type: 'string' },
          promptContent: { type: 'string' }
        },
        required: ['skillId']
      },
      parser: (args) => T.InspectAiSkillInputSchema.parse(args),
      handler: h.handleInspectAiSkill
    },
    {
      name: 'recommend_icon_system',
      description: 'Recommends optimal icon library (Lucide, Heroicons, Material Symbols, Tabler, Phosphor, Radix) preventing mixed icon aesthetics.',
      inputSchema: {
        type: 'object',
        properties: {
          framework: { type: 'string' },
          useTailwind: { type: 'boolean' },
          useShadcn: { type: 'boolean' },
          density: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] },
          existingIconImports: { type: 'array', items: { type: 'string' } }
        }
      },
      parser: (args) => T.RecommendIconSystemInputSchema.parse(args),
      handler: h.handleRecommendIconSystem
    },
    {
      name: 'recommend_chart_library',
      description: 'Recommends chart library (ECharts, Recharts, Chart.js) based on data volume, interactivity, and rendering engine.',
      inputSchema: {
        type: 'object',
        properties: {
          framework: { type: 'string' },
          dataPoints: { type: 'number' },
          requireGanttOrTimeline: { type: 'boolean' },
          accessibleRequirement: { type: 'boolean' }
        }
      },
      parser: (args) => T.RecommendChartLibraryInputSchema.parse(args),
      handler: h.handleRecommendChartLibrary
    },
    {
      name: 'recommend_data_grid',
      description: 'Recommends data grid (AG Grid Community vs TanStack Table) with strict commercial paywall feature separation.',
      inputSchema: {
        type: 'object',
        properties: {
          estimatedRows: { type: 'number' },
          requiresVirtualization: { type: 'boolean' },
          requiresServerSide: { type: 'boolean' },
          requiresGroupingOrPivot: { type: 'boolean' },
          licensePreference: { type: 'string', enum: ['PERMISSIVE_MIT', 'COMMERCIAL_OK'] }
        }
      },
      parser: (args) => T.RecommendDataGridInputSchema.parse(args),
      handler: h.handleRecommendDataGrid
    },
    {
      name: 'explain_source_recommendation',
      description: 'Generates multi-dimensional "WHY" explanation for a design source recommendation.',
      inputSchema: {
        type: 'object',
        properties: {
          sourceId: { type: 'string' },
          targetFramework: { type: 'string' },
          targetDomain: { type: 'string' }
        },
        required: ['sourceId']
      },
      parser: (args) => T.ExplainSourceRecommendationInputSchema.parse(args),
      handler: h.handleExplainSourceRecommendation
    },
    {
      name: 'create_design_intent',
      description: 'Synthesizes canonical, technology-neutral DesignIntent from contextual ProductUXProfile characteristics.',
      inputSchema: {
        type: 'object',
        properties: {
          productType: { type: 'string', enum: ['ENTERPRISE_INTERNAL', 'B2B_SAAS', 'B2C_CONSUMER', 'ADMIN_OPERATIONAL', 'ANALYTICS_DATA', 'DEVELOPER_TOOL'] },
          userExpertise: { type: 'string', enum: ['NOVICE', 'INTERMEDIATE', 'EXPERT'] },
          informationDensity: { type: 'string', enum: ['COMPACT', 'COMFORTABLE', 'SPACIOUS'] },
          taskCriticality: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'MISSION_CRITICAL'] }
        }
      },
      parser: (args) => T.CreateDesignIntentInputSchema.parse(args),
      handler: h.handleCreateDesignIntent
    },
    {
      name: 'create_page_blueprint',
      description: 'Creates a technology-neutral PageBlueprint DSL structure with custom id, title, regions, layout, and component blueprints.',
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          preset: { type: 'string', enum: ['DATA_MANAGEMENT_WORKSPACE', 'LOGIN_PAGE', 'SETTINGS_PAGE', 'LIST_DETAIL_PAGE', 'DASHBOARD_PAGE', 'FORM_PAGE'] }
        }
      },
      parser: (args) => T.CreatePageBlueprintInputSchema.parse(args),
      handler: h.handleCreatePageBlueprint
    },
    {
      name: 'create_component_blueprint',
      description: 'Generates canonical ComponentBlueprint with token bindings, states, and accessibility contracts for one of 15 canonical components.',
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: { type: 'string', enum: ['BUTTON', 'INPUT', 'SELECT', 'CHECKBOX', 'RADIO', 'SWITCH', 'BADGE', 'ALERT', 'CARD', 'MODAL_DIALOG', 'DRAWER', 'TOOLTIP', 'DROPDOWN_MENU', 'DATA_TABLE', 'FILTER_BAR'] },
          density: { type: 'string', enum: ['COMPACT', 'COMFORTABLE', 'SPACIOUS'] }
        },
        required: ['type']
      },
      parser: (args) => T.CreateComponentBlueprintInputSchema.parse(args),
      handler: h.handleCreateComponentBlueprint
    },
    {
      name: 'create_app_shell_blueprint',
      description: 'Generates canonical ApplicationShellBlueprint (ENTERPRISE_DENSE, SAAS_STANDARD, CONSUMER_CONTENT) driven by UX profile.',
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          variant: { type: 'string', enum: ['ENTERPRISE_DENSE', 'SAAS_STANDARD', 'CONSUMER_CONTENT'] }
        }
      },
      parser: (args) => T.CreateAppShellBlueprintInputSchema.parse(args),
      handler: h.handleCreateAppShellBlueprint
    },
    {
      name: 'render_blueprint',
      description: 'Renders a canonical PageBlueprint resolved by blueprintId to a target production stack (html-css-js, react-typescript, laravel-blade, aspnet-razor).',
      inputSchema: {
        type: 'object',
        properties: {
          blueprintId: { type: 'string' },
          targetStack: { type: 'string', enum: ['html-css-js', 'react-typescript', 'laravel-blade', 'aspnet-razor'] },
          theme: { type: 'string', enum: ['LIGHT', 'DARK', 'HIGH_CONTRAST'] },
          density: { type: 'string', enum: ['COMPACT', 'COMFORTABLE', 'SPACIOUS'] }
        }
      },
      parser: (args) => T.RenderBlueprintInputSchema.parse(args),
      handler: h.handleRenderBlueprint
    },
    {
      name: 'render_component',
      description: 'Renders an individual canonical component blueprint to target stack code without framework colonization.',
      inputSchema: {
        type: 'object',
        properties: {
          componentType: { type: 'string', enum: ['BUTTON', 'INPUT', 'SELECT', 'CHECKBOX', 'RADIO', 'SWITCH', 'BADGE', 'ALERT', 'CARD', 'MODAL_DIALOG', 'DRAWER', 'TOOLTIP', 'DROPDOWN_MENU', 'DATA_TABLE', 'FILTER_BAR'] },
          targetStack: { type: 'string', enum: ['html-css-js', 'react-typescript', 'laravel-blade', 'aspnet-razor'] },
          theme: { type: 'string', enum: ['LIGHT', 'DARK', 'HIGH_CONTRAST'] },
          density: { type: 'string', enum: ['COMPACT', 'COMFORTABLE', 'SPACIOUS'] }
        },
        required: ['componentType']
      },
      parser: (args) => T.RenderComponentInputSchema.parse(args),
      handler: h.handleRenderComponent
    },
    {
      name: 'create_ui_recipe',
      description: 'Instantiates one of 6 canonical UI recipes (LOGIN_PAGE, SETTINGS_PAGE, LIST_DETAIL_PAGE, DATA_MANAGEMENT_PAGE, DASHBOARD_PAGE, FORM_PAGE).',
      inputSchema: {
        type: 'object',
        properties: {
          recipeType: { type: 'string', enum: ['LOGIN_PAGE', 'SETTINGS_PAGE', 'LIST_DETAIL_PAGE', 'DATA_MANAGEMENT_PAGE', 'DASHBOARD_PAGE', 'FORM_PAGE'] }
        },
        required: ['recipeType']
      },
      parser: (args) => T.CreateUiRecipeInputSchema.parse(args),
      handler: h.handleCreateUiRecipe
    },
    {
      name: 'select_design_personality',
      description: 'Calculates 6 quantitative personality axes (-100 to +100) from contextual attributes, preventing superficial AI design clichés.',
      inputSchema: {
        type: 'object',
        properties: {
          productType: { type: 'string', enum: ['ENTERPRISE_INTERNAL', 'B2B_SAAS', 'B2C_CONSUMER', 'ADMIN_OPERATIONAL', 'ANALYTICS_DATA', 'DEVELOPER_TOOL'] },
          informationDensity: { type: 'string', enum: ['COMPACT', 'COMFORTABLE', 'SPACIOUS'] },
          brandCharacter: { type: 'string', enum: ['UTILITY_NEUTRAL', 'AUTHORITATIVE', 'FRIENDLY', 'TECHNICAL'] }
        }
      },
      parser: (args) => T.SelectDesignPersonalityInputSchema.parse(args),
      handler: h.handleSelectDesignPersonality
    },
    {
      name: 'evaluate_design_antipatterns',
      description: 'Design Critic evaluation for UI anti-patterns: excessive cards (card soup), meaningless gradients, glassmorphism, low contrast, tiny touch targets.',
      inputSchema: {
        type: 'object',
        properties: {
          content: { type: 'string' },
          blueprintPreset: { type: 'string', enum: ['DATA_MANAGEMENT_WORKSPACE', 'LOGIN_PAGE', 'SETTINGS_PAGE', 'LIST_DETAIL_PAGE', 'DASHBOARD_PAGE', 'FORM_PAGE'] }
        }
      },
      parser: (args) => T.EvaluateDesignAntipatternsInputSchema.parse(args),
      handler: h.handleEvaluateDesignAntipatterns
    },
    {
      name: 'compare_renderer_parity',
      description: 'Evaluates visual, behavioral, and accessibility parity across HTML, React, Blade, and Razor renderers, outputting quantitative parity scores.',
      inputSchema: {
        type: 'object',
        properties: {
          blueprintPreset: { type: 'string', enum: ['DATA_MANAGEMENT_WORKSPACE', 'LOGIN_PAGE', 'SETTINGS_PAGE', 'LIST_DETAIL_PAGE', 'DASHBOARD_PAGE', 'FORM_PAGE'] }
        }
      },
      parser: (args) => T.CompareRendererParityInputSchema.parse(args),
      handler: h.handleCompareRendererParity
    },
    {
      name: 'inspect_alper_registry',
      description: 'Inspects Alper UI canonical registry contents (tokens, 15 component blueprints, 28 patterns, 6 recipes).',
      inputSchema: {
        type: 'object',
        properties: {
          section: { type: 'string', enum: ['ALL', 'TOKENS', 'BLUEPRINTS', 'PATTERNS', 'RECIPES'] }
        }
      },
      parser: (args) => T.InspectAlperRegistryInputSchema.parse(args),
      handler: h.handleInspectAlperRegistry
    },
    {
      name: 'evaluate_truthful_ui',
      description: 'Audits UI components and data bindings against Truthful UI Policy, detecting ungrounded telemetry, unlabeled mocks, and deceptive semantic colors.',
      inputSchema: {
        type: 'object',
        properties: {
          components: { type: 'array' },
          pageTitle: { type: 'string' },
          cognitiveClutterScore: { type: 'number' }
        },
        required: ['components']
      },
      parser: (args) => T.EvaluateTruthfulUiInputSchema.parse(args),
      handler: h.handleEvaluateTruthfulUi
    },
    {
      name: 'audit_data_provenance',
      description: 'Audits data provenance records across fields, classifying authority, verifying freshness, and flagging ungrounded or fabricated sources.',
      inputSchema: {
        type: 'object',
        properties: {
          records: { type: 'array' }
        },
        required: ['records']
      },
      parser: (args) => T.AuditDataProvenanceInputSchema.parse(args),
      handler: h.handleAuditDataProvenance
    },
    {
      name: 'evaluate_page_intent',
      description: 'Audits whether page regions and components align with stated Page Intent, rejecting forbidden visual gimmicks.',
      inputSchema: {
        type: 'object',
        properties: {
          intentType: { type: 'string', enum: ['OPERATIONAL_MONITORING', 'EXECUTIVE_DECISION', 'DATA_ENTRY_TRANSACTION', 'EXPLORATORY_ANALYTICS', 'CONFIGURATION_ADMIN', 'DIAGNOSTIC_INVESTIGATION', 'DEMO_SHOWCASE'] },
          primaryGoal: { type: 'string' },
          targetAudience: { type: 'string' },
          components: { type: 'array' }
        },
        required: ['intentType', 'primaryGoal', 'targetAudience', 'components']
      },
      parser: (args) => T.EvaluatePageIntentInputSchema.parse(args),
      handler: h.handleEvaluatePageIntent
    },
    {
      name: 'audit_information_relevance',
      description: 'Scores information relevance, signal-to-noise ratio, and cognitive load impact of elements on a page.',
      inputSchema: {
        type: 'object',
        properties: {
          intentType: { type: 'string' },
          primaryGoal: { type: 'string' },
          elements: { type: 'array' }
        },
        required: ['intentType', 'primaryGoal', 'elements']
      },
      parser: (args) => T.AuditInformationRelevanceInputSchema.parse(args),
      handler: h.handleAuditInformationRelevance
    },
    {
      name: 'classify_source_authority',
      description: 'Classifies data sources into formal Source Authority Tiers (AUTHORITATIVE_SYSTEM, VERIFIED_EXTERNAL, SYNTHETIC_MOCK, etc.).',
      inputSchema: {
        type: 'object',
        properties: {
          sourceId: { type: 'string' },
          urlOrPath: { type: 'string' },
          type: { type: 'string' },
          isProductionEndpoint: { type: 'boolean' },
          hasAuthHeaders: { type: 'boolean' },
          isMock: { type: 'boolean' }
        },
        required: ['sourceId']
      },
      parser: (args) => T.ClassifySourceAuthorityInputSchema.parse(args),
      handler: h.handleClassifySourceAuthority
    },
    {
      name: 'evaluate_content_truth_gate',
      description: 'Evaluates the CONTENT_TRUTH_PASS governance release gate synthesizing UI truthfulness, provenance, and visual approval.',
      inputSchema: {
        type: 'object',
        properties: {
          components: { type: 'array' },
          requireVisualApproval: { type: 'boolean' }
        }
      },
      parser: (args) => T.EvaluateContentTruthGateInputSchema.parse(args),
      handler: h.handleEvaluateContentTruthGate
    },
    {
      name: 'manage_human_visual_approval',
      description: 'Inspects or records human visual sign-off with anti-tamper bot protection.',
      inputSchema: {
        type: 'object',
        properties: {
          action: { type: 'string', enum: ['GET_STATUS', 'RECORD_REVIEW'] },
          reviewedBy: { type: 'string' },
          status: { type: 'string', enum: ['NOT_REVIEWED', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'CHANGES_REQUESTED'] },
          notes: { type: 'string' },
          viewports: { type: 'array', items: { type: 'string' } },
          criteriaChecked: { type: 'object' }
        },
        required: ['action']
      },
      parser: (args) => T.ManageHumanVisualApprovalInputSchema.parse(args),
      handler: h.handleManageHumanVisualApproval
    },
    {
      name: 'audit_track_trace_telemetry',
      description: 'Statically audits Track Trace Direction B telemetry specimens, detecting ungrounded endpoints and tagging deferred live validations.',
      inputSchema: {
        type: 'object',
        properties: {
          sampleEndpoints: { type: 'array', items: { type: 'string' } }
        }
      },
      parser: (args) => T.AuditTrackTraceTelemetryInputSchema.parse(args),
      handler: h.handleAuditTrackTraceTelemetry
    },
    {
      name: 'create_manual_run_bundle',
      description: 'Generates an Operator-Assisted Manual Run Bundle with RUN.ps1, README, and evidence collector for corporate workstations.',
      inputSchema: {
        type: 'object',
        properties: {
          runId: { type: 'string' },
          plannedObjective: { type: 'string' }
        }
      },
      parser: (args) => T.CreateManualRunBundleInputSchema.parse(args),
      handler: h.handleCreateManualRunBundle
    },
    {
      name: 'verify_manual_run_evidence',
      description: 'Verifies evidence artifacts generated by human operator execution in Windows PowerShell.',
      inputSchema: {
        type: 'object',
        properties: {
          runIdOrPath: { type: 'string' }
        },
        required: ['runIdOrPath']
      },
      parser: (args) => T.VerifyManualRunEvidenceInputSchema.parse(args),
      handler: h.handleVerifyManualRunEvidence
    },
    {
      name: 'resolve_browser_runtime',
      description: 'Resolves browser engine following the chain: managed Chromium -> system Edge -> system Chrome -> unavailable.',
      inputSchema: {
        type: 'object',
        properties: {
          forceChromiumBlocked: { type: 'boolean' }
        }
      },
      parser: (args) => T.ResolveBrowserRuntimeInputSchema.parse(args),
      handler: h.handleResolveBrowserRuntime
    },
    {
      name: 'run_operator_doctor',
      description: 'Runs doctor diagnostics separating system capability from agent execution authority.',
      inputSchema: {
        type: 'object',
        properties: {
          overrideDockerCapability: { type: 'string', enum: ['AVAILABLE', 'UNAVAILABLE'] },
          overrideBrowserCapability: { type: 'string', enum: ['AVAILABLE', 'UNAVAILABLE'] }
        }
      },
      parser: (args) => T.RunOperatorDoctorInputSchema.parse(args),
      handler: h.handleRunOperatorDoctor
    },
    {
      name: 'profile_existing_project',
      description: 'Profiles an existing legacy project: detects stack, styling, architecture, auth, database, routing, and debt heuristics.',
      inputSchema: {
        type: 'object',
        properties: {
          projectPath: { type: 'string', description: 'Path to project directory' },
          projectName: { type: 'string', description: 'Optional project name' }
        },
        required: ['projectPath']
      },
      parser: (args) => T.ProfileExistingProjectInputSchema.parse(args),
      handler: h.handleProfileExistingProject
    },
    {
      name: 'create_behavioral_baseline',
      description: 'Scans existing project files and captures behavioral baseline (routes, auth flows, db invariants, forms, external integrations).',
      inputSchema: {
        type: 'object',
        properties: {
          projectPath: { type: 'string', description: 'Path to project directory' },
          includeOpenApi: { type: 'boolean' }
        },
        required: ['projectPath']
      },
      parser: (args) => T.CreateBehavioralBaselineInputSchema.parse(args),
      handler: h.handleCreateBehavioralBaseline
    },
    {
      name: 'create_preservation_contract',
      description: 'Creates a strict PreservationContract establishing MUST_PRESERVE boundaries for backend, database, and auth.',
      inputSchema: {
        type: 'object',
        properties: {
          contractId: { type: 'string' },
          customInvariants: { type: 'object' }
        }
      },
      parser: (args) => T.CreatePreservationContractInputSchema.parse(args),
      handler: h.handleCreatePreservationContract
    },
    {
      name: 'classify_existing_elements',
      description: 'Classifies existing components, routes, and styles into KEEP, IMPROVE, REPLACE, DEFER, or high-risk REMOVE decisions.',
      inputSchema: {
        type: 'object',
        properties: {
          elements: { type: 'array' }
        },
        required: ['elements']
      },
      parser: (args) => T.ClassifyExistingElementsInputSchema.parse(args),
      handler: h.handleClassifyExistingElements
    },
    {
      name: 'create_modernization_intent',
      description: 'Validates and structures modernization goals, rejecting vague inputs like "make it modern" without concrete criteria.',
      inputSchema: {
        type: 'object',
        properties: {
          why: { type: 'string' },
          targetOutcome: { type: 'string' },
          primaryProblems: { type: 'array', items: { type: 'string' } },
          autoSupplementFromProjectPath: { type: 'string' }
        },
        required: ['why']
      },
      parser: (args) => T.CreateModernizationIntentInputSchema.parse(args),
      handler: h.handleCreateModernizationIntent
    },
    {
      name: 'create_modernization_plan',
      description: 'Creates a comprehensive staged modernization plan with preservation contracts, checkpoints, and rollback strategies.',
      inputSchema: {
        type: 'object',
        properties: {
          projectPath: { type: 'string' },
          why: { type: 'string' },
          strategy: { type: 'string', enum: ['ADOPT', 'ADAPT', 'BRIDGE', 'MIGRATE', 'REBUILD_COMPONENT', 'REBUILD_PAGE', 'REBUILD_SHELL'] },
          scopeTarget: { type: 'string' },
          scopeLevel: { type: 'string', enum: ['COMPONENT', 'PAGE', 'FEATURE', 'SHELL', 'MODULE', 'APPLICATION'] }
        },
        required: ['projectPath']
      },
      parser: (args) => T.CreateModernizationPlanInputSchema.parse(args),
      handler: h.handleCreateModernizationPlan
    },
    {
      name: 'select_modernization_strategy',
      description: 'Evaluates and selects an appropriate modernization strategy, strictly blocking unapproved Big Bang rewrites.',
      inputSchema: {
        type: 'object',
        properties: {
          requestedStrategy: { type: 'string' },
          projectPath: { type: 'string' },
          explicitUserApproval: { type: 'boolean' },
          explicitUserRequest: { type: 'boolean' },
          hasCheckpointPlan: { type: 'boolean' },
          hasRollbackPlan: { type: 'boolean' },
          preservationImpactReviewed: { type: 'boolean' },
          riskAssessmentCompleted: { type: 'boolean' },
          assessedRiskLevel: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'EXTREME'] },
          justification: { type: 'string' }
        },
        required: ['requestedStrategy']
      },
      parser: (args) => T.SelectModernizationStrategyInputSchema.parse(args),
      handler: h.handleSelectModernizationStrategy
    },
    {
      name: 'create_modernization_stages',
      description: 'Generates scope-tailored implementation stages (Foundation, Shell, Page, Shared Components, Refinement) with checkpoints.',
      inputSchema: {
        type: 'object',
        properties: {
          scopeLevel: { type: 'string', enum: ['COMPONENT', 'PAGE', 'FEATURE', 'SHELL', 'MODULE', 'APPLICATION'] },
          targetName: { type: 'string' },
          strategy: { type: 'string', enum: ['ADOPT', 'ADAPT', 'BRIDGE', 'MIGRATE', 'REBUILD_COMPONENT', 'REBUILD_PAGE', 'REBUILD_SHELL'] }
        }
      },
      parser: (args) => T.CreateModernizationStagesInputSchema.parse(args),
      handler: h.handleCreateModernizationStages
    },
    {
      name: 'evaluate_modernization_completion',
      description: 'Evaluates completion gates: technical, visual AI, UX, a11y, security, regression, content truth, and mandatory human visual approval.',
      inputSchema: {
        type: 'object',
        properties: {
          technical: { type: 'string', enum: ['PASS', 'FAIL', 'BLOCKED'] },
          visualAI: { type: 'string', enum: ['PASS', 'FAIL', 'HEURISTIC_ACCEPTABLE'] },
          ux: { type: 'string', enum: ['PASS', 'FAIL'] },
          accessibility: { type: 'string', enum: ['PASS', 'FAIL'] },
          security: { type: 'string', enum: ['PASS', 'FAIL'] },
          regression: { type: 'string', enum: ['PASS', 'FAIL'] },
          contentTruth: { type: 'string', enum: ['PASS', 'FAIL'] },
          humanVisualApproval: { type: 'string', enum: ['APPROVED', 'PENDING', 'REJECTED', 'NOT_APPLICABLE_SYNTHETIC_FIXTURE'] },
          evidenceLevels: { type: 'object' },
          gateEvidence: { type: 'object' },
          gatePolicies: { type: 'object' }
        },
        required: ['technical', 'visualAI', 'ux', 'accessibility', 'security', 'regression', 'contentTruth', 'humanVisualApproval']
      },
      parser: (args) => T.EvaluateModernizationCompletionInputSchema.parse(args),
      handler: h.handleEvaluateModernizationCompletion
    },
    // ==========================================
    // FAZ 1G: Greenfield Project Generation Tools (98 - 110)
    // ==========================================
    {
      name: 'create_greenfield_project_profile',
      description: 'Creates a validated GreenfieldProjectProfile with DiscoveryReadiness and complexity classification.',
      inputSchema: {
        type: 'object',
        properties: {
          productName: { type: 'string' },
          productPurpose: { type: 'string' },
          targetUsers: { type: 'array', items: { type: 'string' } },
          primaryJobs: { type: 'array', items: { type: 'string' } },
          secondaryJobs: { type: 'array', items: { type: 'string' } },
          domain: { type: 'string' },
          businessCriticality: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'MISSION_CRITICAL'] },
          dataSensitivity: { type: 'string', enum: ['PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'HIGHLY_SENSITIVE', 'REGULATED_PII_PHI'] },
          expectedScale: { type: 'string', enum: ['PROTOTYPE', 'SMALL_TEAM', 'SMALL_INTERNAL', 'DEPARTMENTAL', 'ENTERPRISE', 'ENTERPRISE_INTERNAL', 'PUBLIC_FACING_COMMERCIAL', 'INTERNET_SCALE'] },
          concurrency: { type: 'string', enum: ['SINGLE_USER', 'LOW', 'MODERATE', 'HIGH', 'EXTREME', 'MASSIVE'] },
          deviceTargets: { type: 'array', items: { type: 'string' } },
          offlineNeeds: { type: 'boolean' },
          realtimeNeeds: { type: 'boolean' },
          integrationNeeds: { type: 'array', items: { type: 'string' } },
          reportingNeeds: { type: 'array', items: { type: 'string' } },
          localizationNeeds: { type: 'array', items: { type: 'string' } },
          accessibilityNeeds: { type: 'array', items: { type: 'string' } },
          deploymentEnvironment: { type: 'string', enum: ['LOCAL_ONLY', 'SINGLE_SERVER', 'DOCKER', 'DOCKER_CONTAINER', 'STANDALONE_HOST', 'CLOUD_CONTAINER', 'CLOUD_MANAGED', 'HYBRID_ON_PREM', 'SERVERLESS'] },
          operationalConstraints: { type: 'array', items: { type: 'string' } },
          unknowns: { type: 'array', items: { type: 'string' } },
          assumptions: { type: 'array', items: { type: 'string' } },
          risks: { type: 'array', items: { type: 'string' } },
          explicitEntities: { type: 'array', items: { type: 'string' } },
          isDemoOrSyntheticFixture: { type: 'boolean' }
        },
        required: ['productName', 'productPurpose']
      },
      parser: (args) => T.CreateGreenfieldProjectProfileInputSchema.parse(args),
      handler: h.handleCreateGreenfieldProjectProfile
    },
    {
      name: 'derive_requirements',
      description: 'Derives functional, non-functional, business rule, and acceptance criteria requirements with unverified initial status.',
      inputSchema: {
        type: 'object',
        properties: {
          profile: { type: 'object' },
          explicitUserBrief: { type: 'string' }
        },
        required: ['profile']
      },
      parser: (args) => T.DeriveRequirementsInputSchema.parse(args),
      handler: h.handleDeriveRequirements
    },
    {
      name: 'create_requirement_traceability',
      description: 'Builds a bidirectional Requirement Traceability Matrix (RTM) and detects orphan requirements or unexpected features.',
      inputSchema: {
        type: 'object',
        properties: {
          requirements: { type: 'array', items: { type: 'object' } },
          architecturalDecisions: { type: 'array', items: { type: 'string' } },
          databaseEntities: { type: 'array', items: { type: 'string' } },
          apiEndpoints: { type: 'array', items: { type: 'string' } },
          pages: { type: 'array', items: { type: 'string' } },
          implementationFiles: { type: 'array', items: { type: 'string' } },
          verificationTests: { type: 'array', items: { type: 'string' } }
        },
        required: ['requirements']
      },
      parser: (args) => T.CreateRequirementTraceabilityInputSchema.parse(args),
      handler: h.handleCreateRequirementTraceability
    },
    {
      name: 'recommend_architecture',
      description: 'Recommends software architecture style with complexity budgets and anti-overengineering guardrails.',
      inputSchema: {
        type: 'object',
        properties: {
          profile: { type: 'object' },
          requirements: { type: 'object' }
        },
        required: ['profile']
      },
      parser: (args) => T.RecommendArchitectureInputSchema.parse(args),
      handler: h.handleRecommendArchitecture
    },
    {
      name: 'recommend_stack',
      description: 'Recommends production technology stack (React+TS, Laravel Blade, ASP.NET Razor, Plain Web) with decision provenance.',
      inputSchema: {
        type: 'object',
        properties: {
          profile: { type: 'object' },
          architecture: { type: 'object' },
          userPreferredStack: { type: 'string', enum: ['REACT_TYPESCRIPT', 'LARAVEL_BLADE', 'ASPNET_RAZOR', 'PLAIN_HTML_CSS_JS'] }
        },
        required: ['profile']
      },
      parser: (args) => T.RecommendStackInputSchema.parse(args),
      handler: h.handleRecommendStack
    },
    {
      name: 'create_database_blueprint',
      description: 'Creates a grounded DatabaseBlueprint from domain nouns without verb pluralization or generic entity fallbacks.',
      inputSchema: {
        type: 'object',
        properties: {
          profile: { type: 'object' },
          requirements: { type: 'object' },
          stack: { type: 'object' },
          architecture: { type: 'object' }
        },
        required: ['profile', 'requirements', 'stack']
      },
      parser: (args) => T.CreateDatabaseBlueprintInputSchema.parse(args),
      handler: h.handleCreateDatabaseBlueprint
    },
    {
      name: 'create_api_blueprint',
      description: 'Creates REST API Blueprint and OpenAPI 3.1.0 specification from grounded database entities.',
      inputSchema: {
        type: 'object',
        properties: {
          profile: { type: 'object' },
          requirements: { type: 'object' },
          database: { type: 'object' },
          architecture: { type: 'object' }
        },
        required: ['profile', 'requirements', 'database']
      },
      parser: (args) => T.CreateApiBlueprintInputSchema.parse(args),
      handler: h.handleCreateApiBlueprint
    },
    {
      name: 'create_auth_model',
      description: 'Creates separated authentication and role-based authorization model.',
      inputSchema: {
        type: 'object',
        properties: {
          profile: { type: 'object' },
          requirements: { type: 'object' }
        },
        required: ['profile', 'requirements']
      },
      parser: (args) => T.CreateAuthModelInputSchema.parse(args),
      handler: h.handleCreateAuthModel
    },
    {
      name: 'create_page_inventory',
      description: 'Creates grounded page inventory and navigation tree with 8 mandatory UX states per page.',
      inputSchema: {
        type: 'object',
        properties: {
          profile: { type: 'object' },
          requirements: { type: 'object' },
          database: { type: 'object' },
          api: { type: 'object' }
        },
        required: ['profile', 'requirements']
      },
      parser: (args) => T.CreatePageInventoryInputSchema.parse(args),
      handler: h.handleCreatePageInventory
    },
    {
      name: 'create_project_blueprint',
      description: 'Synthesizes master NewProjectBlueprint gated by DiscoveryReadiness.',
      inputSchema: {
        type: 'object',
        properties: {
          profile: { type: 'object' },
          requirementsBundle: { type: 'object' },
          userPreferredStack: { type: 'string', enum: ['REACT_TYPESCRIPT', 'LARAVEL_BLADE', 'ASPNET_RAZOR', 'PLAIN_HTML_CSS_JS'] }
        },
        required: ['profile']
      },
      parser: (args) => T.CreateProjectBlueprintInputSchema.parse(args),
      handler: h.handleCreateProjectBlueprint
    },
    {
      name: 'create_project_implementation_plan',
      description: 'Generates dynamic dependency-driven implementation plan with checkpoints and verification criteria.',
      inputSchema: {
        type: 'object',
        properties: {
          blueprint: { type: 'object' }
        },
        required: ['blueprint']
      },
      parser: (args) => T.CreateProjectImplementationPlanInputSchema.parse(args),
      handler: h.handleCreateProjectImplementationPlan
    },
    {
      name: 'scaffold_new_project',
      description: 'Scaffolds concrete project files for target stack with truthful buildStatus (NOT_VERIFIED until build evidence is supplied).',
      inputSchema: {
        type: 'object',
        properties: {
          blueprint: { type: 'object' },
          targetDirectory: { type: 'string' },
          verifiedBuildEvidence: { type: 'object' }
        },
        required: ['blueprint', 'targetDirectory']
      },
      parser: (args) => T.ScaffoldNewProjectInputSchema.parse(args),
      handler: h.handleScaffoldNewProject
    },
    {
      name: 'evaluate_new_project_completion',
      description: 'Evaluates new project completion gates strictly enforcing Gate-Specific Evidence Taxonomy (missing evidence -> NOT_VERIFIED).',
      inputSchema: {
        type: 'object',
        properties: {
          technical: { type: 'string', enum: ['PASS', 'FAIL'] },
          functional: { type: 'string', enum: ['PASS', 'FAIL'] },
          visualAI: { type: 'string', enum: ['PASS', 'FAIL'] },
          ux: { type: 'string', enum: ['PASS', 'FAIL'] },
          accessibility: { type: 'string', enum: ['PASS', 'FAIL'] },
          security: { type: 'string', enum: ['PASS', 'FAIL'] },
          truthfulUI: { type: 'string', enum: ['PASS', 'FAIL'] },
          traceability: { type: 'string', enum: ['PASS', 'FAIL'] },
          testCoverage: { type: 'string', enum: ['PASS', 'FAIL'] },
          boundaryCompliance: { type: 'string', enum: ['PASS', 'FAIL'] },
          evidence: { type: 'object' },
          evidenceRecords: { type: 'array', items: { type: 'object' } },
          gatePolicies: { type: 'object' },
          isSyntheticFixture: { type: 'boolean' }
        }
      },
      parser: (args) => T.EvaluateNewProjectCompletionInputSchema.parse(args),
      handler: h.handleEvaluateNewProjectCompletion
    },
    // ==========================================
    // FAZ 1H: Project Intelligence Tools (111 - 124)
    // ==========================================
    {
      name: 'initialize_project_intelligence',
      description: 'Initializes durable .alper-design-os/project-intelligence/ artifacts grounded in real repository files.',
      inputSchema: {
        type: 'object',
        properties: {
          baseDir: { type: 'string' },
          projectName: { type: 'string' },
          mode: { type: 'string', enum: ['NEW', 'EXISTING', 'REPAIR', 'MODERNIZE'] },
          projectId: { type: 'string' },
          primaryStack: { type: 'string' },
          domains: { type: 'array', items: { type: 'string' } },
          blueprint: { type: 'object' },
          profile: { type: 'object' }
        },
        required: ['baseDir', 'projectName']
      },
      parser: (args) => T.InitializeProjectIntelligenceInputSchema.parse(args),
      handler: h.handleInitializeProjectIntelligence
    },
    {
      name: 'load_project_intelligence',
      description: 'Loads durable project intelligence state, recent ADRs, business rules, invariants, and snapshots.',
      inputSchema: {
        type: 'object',
        properties: {
          baseDir: { type: 'string' }
        },
        required: ['baseDir']
      },
      parser: (args) => T.LoadProjectIntelligenceInputSchema.parse(args),
      handler: h.handleLoadProjectIntelligence
    },
    {
      name: 'record_project_decision',
      description: 'Records an Architecture Decision Record (ADR) with bi-directional superseding and explicit authority provenance.',
      inputSchema: {
        type: 'object',
        properties: {
          baseDir: { type: 'string' },
          id: { type: 'string' },
          title: { type: 'string' },
          context: { type: 'string' },
          decision: { type: 'string' },
          alternatives: { type: 'array', items: { type: 'string' } },
          consequences: { type: 'array', items: { type: 'string' } },
          risks: { type: 'array', items: { type: 'string' } },
          evidence: { type: 'array', items: { type: 'string' } },
          requirements: { type: 'array', items: { type: 'string' } },
          affectedComponents: { type: 'array', items: { type: 'string' } },
          status: { type: 'string', enum: ['PROPOSED', 'ACCEPTED', 'REJECTED', 'SUPERSEDED', 'DEPRECATED'] },
          supersedes: { type: 'string' },
          approvedBy: { type: 'string' },
          confirmedByUser: { type: 'boolean' },
          authoritySource: { type: 'string', enum: ['USER_DECISION', 'SYSTEM_RECOMMENDATION', 'RESEARCH_FINDING', 'IMPLEMENTATION_FACT'] }
        },
        required: ['baseDir', 'id', 'title', 'context', 'decision', 'approvedBy']
      },
      parser: (args) => T.RecordProjectDecisionInputSchema.parse(args),
      handler: h.handleRecordProjectDecision
    },
    {
      name: 'record_business_rule',
      description: 'Records a business rule enforcing structured provenance (sourceType, confirmedByUser, evidenceRefs) without substring heuristics.',
      inputSchema: {
        type: 'object',
        properties: {
          baseDir: { type: 'string' },
          ruleId: { type: 'string' },
          statement: { type: 'string' },
          source: { type: 'string' },
          sourceType: {
            type: 'string',
            enum: [
              'EXPLICIT_USER_SPECIFICATION',
              'VERIFIED_CODE_FACT',
              'APPROVED_REQUIREMENT',
              'REGULATORY_SOURCE',
              'AUTHORITATIVE_DOCUMENT',
              'DOMAIN_RESEARCH',
              'SYSTEM_INFERENCE',
              'MODEL_INFERENCE',
              'UNKNOWN'
            ]
          },
          sourceRef: { type: 'string' },
          evidenceRefs: { type: 'array', items: { type: 'string' } },
          confirmedByUser: { type: 'boolean' },
          priority: { type: 'string', enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] },
          scope: { type: 'string' },
          inputs: { type: 'array', items: { type: 'string' } },
          outputs: { type: 'array', items: { type: 'string' } },
          exceptions: { type: 'array', items: { type: 'string' } },
          requirements: { type: 'array', items: { type: 'string' } },
          tests: { type: 'array', items: { type: 'string' } }
        },
        required: ['baseDir', 'ruleId', 'statement', 'source']
      },
      parser: (args) => T.RecordBusinessRuleInputSchema.parse(args),
      handler: h.handleRecordBusinessRule
    },
    {
      name: 'record_project_invariant',
      description: 'Persists an unbreakable project invariant with category, severity, and verification method.',
      inputSchema: {
        type: 'object',
        properties: {
          baseDir: { type: 'string' },
          id: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'string', enum: ['SECURITY', 'DATA_INTEGRITY', 'API_CONTRACT', 'BUSINESS_LOGIC', 'UX_ERGONOMICS'] },
          scope: { type: 'string' },
          severity: { type: 'string', enum: ['CRITICAL', 'HIGH', 'MEDIUM'] },
          verificationMethod: { type: 'string' },
          relatedTests: { type: 'array', items: { type: 'string' } },
          source: { type: 'string' }
        },
        required: ['baseDir', 'id', 'description', 'category', 'verificationMethod', 'source']
      },
      parser: (args) => T.RecordProjectInvariantInputSchema.parse(args),
      handler: h.handleRecordProjectInvariant
    },
    {
      name: 'build_project_architecture_graph',
      description: 'Builds a truthful ProjectArchitectureGraph from actual repository files and explicit code artifacts.',
      inputSchema: {
        type: 'object',
        properties: {
          baseDir: { type: 'string' },
          codeArtifacts: { type: 'object' }
        },
        required: ['baseDir']
      },
      parser: (args) => T.BuildProjectArchitectureGraphInputSchema.parse(args),
      handler: h.handleBuildProjectArchitectureGraph
    },
    {
      name: 'create_project_snapshot',
      description: 'Creates a truthful ProjectSnapshot from real repository artifacts without fabricated routes or fingerprints.',
      inputSchema: {
        type: 'object',
        properties: {
          baseDir: { type: 'string' },
          snapshotId: { type: 'string' },
          commitSha: { type: 'string' },
          stack: { type: 'string' },
          architectureHash: { type: 'string' },
          requirementHash: { type: 'string' },
          routeInventory: { type: 'array', items: { type: 'string' } },
          apiInventory: { type: 'array', items: { type: 'string' } },
          databaseFingerprint: { type: 'string' },
          dependencyFingerprint: { type: 'string' },
          designSystemFingerprint: { type: 'string' }
        },
        required: ['baseDir', 'snapshotId']
      },
      parser: (args) => T.CreateProjectSnapshotInputSchema.parse(args),
      handler: h.handleCreateProjectSnapshot
    },
    {
      name: 'detect_project_drift',
      description: 'Compares two ProjectSnapshots and detects breaking or non-breaking architectural, API, or database drift.',
      inputSchema: {
        type: 'object',
        properties: {
          baseSnapshot: { type: 'object' },
          targetSnapshot: { type: 'object' }
        },
        required: ['baseSnapshot', 'targetSnapshot']
      },
      parser: (args) => T.DetectProjectDriftInputSchema.parse(args),
      handler: h.handleDetectProjectDrift
    },
    {
      name: 'analyze_change_impact',
      description: 'Computes change blast radius by traversing the real ProjectArchitectureGraph, ADRs, business rules, and invariants.',
      inputSchema: {
        type: 'object',
        properties: {
          baseDir: { type: 'string' },
          target: { type: 'string' },
          proposedChange: { type: 'string' }
        },
        required: ['baseDir', 'target', 'proposedChange']
      },
      parser: (args) => T.AnalyzeChangeImpactInputSchema.parse(args),
      handler: h.handleAnalyzeChangeImpact
    },
    {
      name: 'build_task_context',
      description: 'Synthesizes token-efficient task context filtering relevant ADRs, business rules, and invariants.',
      inputSchema: {
        type: 'object',
        properties: {
          baseDir: { type: 'string' },
          task: { type: 'string' },
          target: { type: 'string' },
          scope: { type: 'string' }
        },
        required: ['baseDir', 'task', 'target', 'scope']
      },
      parser: (args) => T.BuildTaskContextInputSchema.parse(args),
      handler: h.handleBuildTaskContext
    },
    {
      name: 'detect_knowledge_conflicts',
      description: 'Detects knowledge conflicts across 5 classes (ADR vs DB/Auth/Code, Invariant vs Config, Requirement vs Implementation, Business Rule vs Tests, Living Docs vs JSON).',
      inputSchema: {
        type: 'object',
        properties: {
          baseDir: { type: 'string' },
          actualCodeFacts: { type: 'object' }
        },
        required: ['baseDir']
      },
      parser: (args) => T.DetectKnowledgeConflictsInputSchema.parse(args),
      handler: h.handleDetectKnowledgeConflicts
    },
    {
      name: 'record_lesson_learned',
      description: 'Captures evidence-backed lessons learned in durable project memory.',
      inputSchema: {
        type: 'object',
        properties: {
          baseDir: { type: 'string' },
          id: { type: 'string' },
          problem: { type: 'string' },
          context: { type: 'string' },
          attempt: { type: 'string' },
          result: { type: 'string' },
          evidence: { type: 'string' },
          lesson: { type: 'string' },
          applicability: { type: 'string' },
          confidence: { type: 'number' }
        },
        required: ['baseDir', 'id', 'problem', 'context', 'attempt', 'result', 'evidence', 'lesson', 'applicability']
      },
      parser: (args) => T.RecordLessonLearnedInputSchema.parse(args),
      handler: h.handleRecordLessonLearned
    },
    {
      name: 'propose_improvement_candidate',
      description: 'Proposes an evidence-backed continuous improvement candidate gated by human governance approval.',
      inputSchema: {
        type: 'object',
        properties: {
          baseDir: { type: 'string' },
          id: { type: 'string' },
          observation: { type: 'string' },
          evidence: { type: 'string' },
          proposedImprovement: { type: 'string' },
          scope: { type: 'string' },
          expectedBenefit: { type: 'string' },
          risk: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] },
          confidence: { type: 'number' }
        },
        required: ['baseDir', 'id', 'observation', 'evidence', 'proposedImprovement', 'scope', 'expectedBenefit']
      },
      parser: (args) => T.ProposeImprovementCandidateInputSchema.parse(args),
      handler: h.handleProposeImprovementCandidate
    },
    {
      name: 'evaluate_project_knowledge_health',
      description: 'Computes real project knowledge health from actual artifacts (returning NOT_INITIALIZED or INSUFFICIENT_DATA when empty).',
      inputSchema: {
        type: 'object',
        properties: {
          baseDir: { type: 'string' }
        },
        required: ['baseDir']
      },
      parser: (args) => T.EvaluateProjectKnowledgeHealthInputSchema.parse(args),
      handler: h.handleEvaluateProjectKnowledgeHealth
    }
  ];
}
