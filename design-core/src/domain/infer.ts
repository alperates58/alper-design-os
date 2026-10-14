import {
  CriticalWorkflow,
  DomainClassification,
  InformationDensity,
  InteractionStyle,
  JobToBeDone,
  PersonaProfile,
  ProductBriefInput,
  ProductUXProfile,
  ProductUXProfileSchema,
  UsageFrequency,
  VisualPatternRequirement
} from './schema.js';

export function inferProductUXProfile(input: ProductBriefInput): ProductUXProfile {
  const productName = input.productName || input.name || 'Untitled Product';
  const rawDomain = input.domain || 'Enterprise Operational System';
  const description = input.description || '';
  const keyFeatures = input.keyFeatures || [];
  const targetUsers = input.targetUsers || [];
  const environment = input.operatingEnvironment || '';

  const corpus = [
    productName,
    description,
    rawDomain,
    ...targetUsers,
    ...keyFeatures,
    environment
  ].join(' ').toLowerCase();

  function hasKeyword(words: string[]): boolean {
    return words.some((w) => {
      const escaped = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp(`\\b${escaped}\\b`, 'i').test(corpus);
    });
  }

  // 1. Generic Domain Classification
  let classification: DomainClassification = 'B2B_ENTERPRISE';
  if (
    hasKeyword([
      'patient',
      'patients',
      'clinical',
      'hospital',
      'hospitals',
      'medical',
      'health records',
      'ehr',
      'physician',
      'pharmacist',
      'ward'
    ])
  ) {
    classification = 'HEALTHCARE';
  } else if (
    hasKeyword([
      'operational',
      'factory',
      'plant',
      'manufacturing',
      'production',
      'dispatch',
      'industrial',
      'logistics',
      'hardware',
      'scada',
      'warehouse',
      'telematics',
      'fleet',
      'iot',
      'sensor',
      'sensors'
    ])
  ) {
    classification = 'INDUSTRIAL_OPERATIONAL';
  } else if (
    hasKeyword([
      'trading',
      'forex',
      'fintech',
      'banking',
      'general ledger',
      'double-entry',
      'accounting',
      'reconciliation',
      'treasury'
    ])
  ) {
    classification = 'FINTECH';
  } else if (
    hasKeyword([
      'developer',
      'ide',
      'cli',
      'sdk',
      'cybersecurity',
      'siem',
      'threat',
      'compiler',
      'debugger',
      'git-ops'
    ])
  ) {
    classification = 'DEVELOPER_TOOL';
  } else if (
    hasKeyword([
      'consumer',
      'social',
      'ecommerce',
      'streaming',
      'video',
      'entertainment',
      'fashion',
      'boutique',
      'shopper',
      'viewer',
      'cinema'
    ])
  ) {
    classification = 'B2C_CONSUMER';
  }

  // 2. Generic Information Density Inference
  let density: InformationDensity = 'MEDIUM';
  const hasDenseIndicators =
    hasKeyword([
      'dense',
      'high-density',
      'workbench',
      'timeline',
      'utilization',
      'control room',
      'multi-monitor',
      'accounting',
      'ledger',
      'matrix',
      'grid'
    ]);

  const hasExtremeIndicators =
    hasKeyword([
      'extreme',
      'sub-pixel',
      'order book',
      'microsecond'
    ]);

  if (classification === 'B2C_CONSUMER') {
    density = 'SPACIOUS';
  } else if (hasExtremeIndicators) {
    density = 'EXTREME';
  } else if (hasDenseIndicators || classification === 'INDUSTRIAL_OPERATIONAL' || classification === 'FINTECH') {
    density = 'HIGH';
  } else if (hasKeyword(['spacious', 'browse'])) {
    density = 'SPACIOUS';
  }

  // 3. Generic Usage Frequency Inference
  let usageFrequency: UsageFrequency = 'DAILY_FREQUENT';
  if (
    hasKeyword(['continuous', 'shift', 'control room', 'workbench']) ||
    corpus.includes('hours/day')
  ) {
    usageFrequency = 'CONTINUOUS_WORKBENCH';
  } else if (hasKeyword(['admin', 'periodic', 'monthly', 'quarterly'])) {
    usageFrequency = 'OCCASIONAL_ADMIN';
  } else if (hasKeyword(['checkout', 'transaction', 'single-task', 'pos', 'counter terminal', 'counter'])) {
    usageFrequency = 'TRANSACTIONAL';
  }

  // 4. Generic Interaction Style Inference
  let interactionStyle: InteractionStyle = 'HYBRID_MOUSE_KEYBOARD';
  const hasTouchOnly =
    hasKeyword(['touch-optimized', 'touchscreen', 'tablet-first', 'handheld tablet', 'pos']) &&
    !hasKeyword(['multi-monitor', 'numeric keypad', 'desk workstation', 'touch-and-keyboard', 'keyboard']);

  if (hasTouchOnly) {
    interactionStyle = 'TOUCH_OPTIMIZED';
  } else if (hasKeyword(['wizard', 'step-by-step'])) {
    interactionStyle = 'GUIDED_WIZARD';
  }

  // 5. Generic Personas Synthesis
  const personas: PersonaProfile[] = [];
  const primaryUsers = targetUsers.length > 0 ? targetUsers : ['Lead System Operator'];

  primaryUsers.forEach((userRole, idx) => {
    const slug = userRole.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const isExpert = usageFrequency === 'CONTINUOUS_WORKBENCH' || classification === 'INDUSTRIAL_OPERATIONAL';

    personas.push({
      id: `persona-${slug || idx}`,
      name: `${userRole}`,
      title: `${userRole}`,
      expertiseLevel: isExpert ? 'EXPERT_OPERATOR' : 'INTERMEDIATE',
      dailyTimeInAppHours: usageFrequency === 'CONTINUOUS_WORKBENCH' ? 8 : 4,
      primaryPainPoints: [
        'Cognitive fatigue from fragmented data across disconnected panels',
        'Laggy interface responsiveness during complex updates',
        'Unclear constraint or validation conflict visibility',
        'Excessive modal popups interrupting high-frequency workflows'
      ],
      ergonomicNeeds: [
        'Keyboard navigation shortcuts for repetitive actions',
        'High contrast support and density settings for long working hours',
        'Synchronized visual state between primary workbench views',
        'Sub-second feedback on system status updates'
      ]
    });
  });

  // 6. Generic Jobs-to-be-Done (JTBD) Synthesis
  const primaryJobsAndTasks: JobToBeDone[] = [];
  if (keyFeatures.length > 0) {
    keyFeatures.slice(0, 4).forEach((feat, i) => {
      const slug = feat.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      primaryJobsAndTasks.push({
        id: `jtbd-${slug || i}`,
        title: feat.charAt(0).toUpperCase() + feat.slice(1),
        frequency: usageFrequency === 'CONTINUOUS_WORKBENCH' ? 'Continuous / Hourly' : 'Daily',
        complexity: i === 0 ? 'MISSION_CRITICAL' : 'HIGH',
        successMetric: 'Execute action accurately with zero unexpected validation errors'
      });
    });
  } else {
    primaryJobsAndTasks.push({
      id: 'jtbd-primary-operations',
      title: 'Monitor and Manage Core Domain Entities',
      frequency: 'Daily',
      complexity: 'HIGH',
      successMetric: 'Complete operations cycle under operational SLAs'
    });
  }

  // 7. Generic Visual Patterns Discovery Pipeline
  const requiredVisualPatterns: VisualPatternRequirement[] = [];

  // Temporal / Timeline / Sequencing Pattern
  if (
    corpus.includes('timeline') ||
    corpus.includes('gantt') ||
    corpus.includes('schedule') ||
    corpus.includes('sequence') ||
    corpus.includes('temporal')
  ) {
    requiredVisualPatterns.push({
      patternId: 'pat-gantt-timeline',
      name: 'Interactive Timeline & Activity Track',
      reason: 'Visualize temporal sequences, dependencies, and allocations across continuous time bounds',
      recommendedVariant: 'DENSE_WORKBENCH'
    });
  }

  // High-Density DataGrid Pattern
  if (
    corpus.includes('grid') ||
    corpus.includes('table') ||
    corpus.includes('list') ||
    corpus.includes('dense') ||
    corpus.includes('ledger') ||
    corpus.includes('backlog')
  ) {
    requiredVisualPatterns.push({
      patternId: 'pat-dense-grid',
      name: 'High-Density Operational DataGrid',
      reason: 'Display structured records with fast sorting, filtering, and cell-level editing',
      recommendedVariant: 'COMPACT_VIRTUALIZED'
    });
  }

  // Split-Pane Workbench Pattern
  if (
    corpus.includes('split pane') ||
    corpus.includes('multi-pane') ||
    corpus.includes('workbench') ||
    corpus.includes('dock') ||
    density === 'HIGH' ||
    density === 'EXTREME'
  ) {
    requiredVisualPatterns.push({
      patternId: 'pat-split-panes',
      name: 'Multi-Pane Resizable Workbench',
      reason: 'Maintain concurrent visibility of primary lists, inspectors, and status monitors',
      recommendedVariant: 'WORKBENCH_TRIPLE_PANE'
    });
  }

  // Bottleneck / Constraint / Status Heatmap
  if (
    corpus.includes('bottleneck') ||
    corpus.includes('constraint') ||
    corpus.includes('utilization') ||
    corpus.includes('overload') ||
    corpus.includes('violation') ||
    corpus.includes('metric')
  ) {
    requiredVisualPatterns.push({
      patternId: 'pat-bottleneck-indicator',
      name: 'Capacity Utilization & Constraint Violation Heatmap',
      reason: 'Provide instant visual feedback on overloaded entities and constraint violations',
      recommendedVariant: 'INLINE_BADGE_WITH_DRAWER'
    });
  }

  // Context Menu & Quick Command Pattern
  if (
    corpus.includes('context menu') ||
    corpus.includes('right-click') ||
    corpus.includes('action palette') ||
    corpus.includes('shortcuts') ||
    corpus.includes('keyboard-heavy')
  ) {
    requiredVisualPatterns.push({
      patternId: 'pat-context-menus',
      name: 'Contextual Action Menu & Command Palette',
      reason: 'Rapid in-place actions without requiring navigation away from current focal area',
      recommendedVariant: 'TIERED_COMMAND_PALETTE'
    });
  }

  // Filter Bar Pattern
  if (
    corpus.includes('filter') ||
    corpus.includes('search') ||
    corpus.includes('facet') ||
    corpus.includes('query')
  ) {
    requiredVisualPatterns.push({
      patternId: 'pat-filter-bar',
      name: 'Faceted Criteria Filter Bar',
      reason: 'Multi-criteria subset narrowing for high-volume data sets',
      recommendedVariant: 'CHIP_ACCORDION'
    });
  }

  // Fallback pattern if none matched
  if (requiredVisualPatterns.length === 0) {
    requiredVisualPatterns.push({
      patternId: 'pat-dense-grid',
      name: 'Structured DataGrid',
      reason: 'Organize domain entities in a structured tabular format',
      recommendedVariant: 'COMPACT_VIRTUALIZED'
    });
  }

  // 8. Generic Critical Workflows Synthesis
  const criticalWorkflows: CriticalWorkflow[] = [];

  if (corpus.includes('rescheduling') || corpus.includes('re-sequence') || corpus.includes('replan')) {
    criticalWorkflows.push({
      id: 'wf-dynamic-resequence',
      name: 'Dynamic Re-sequencing & Conflict Resolution',
      steps: [
        'Inspect pending item list and filter by operational urgency',
        'Adjust allocation time slot or reassign resource block',
        'System evaluates capacity and operational boundary constraints',
        'Visual indicators signal downstream impacts and constraint violations',
        'Commit modified plan with single key shortcut'
      ],
      trigger: 'Real-time disturbance or priority update',
      latencyTolerance: 'SUB_SECOND',
      requiredShortcuts: ['Ctrl+Z', 'Ctrl+Y', 'F2', 'Alt+R']
    });
  }

  if (corpus.includes('what-if') || corpus.includes('scenario') || corpus.includes('simulation')) {
    criticalWorkflows.push({
      id: 'wf-scenario-simulation',
      name: 'What-If Scenario Simulation & Comparison',
      steps: [
        'Branch current live baseline into isolated simulation scenario',
        'Apply hypothetical adjustments to resources and schedules',
        'Review differential metrics side-by-side in split pane inspector',
        'Apply scenario to live production schedule or discard sandbox'
      ],
      trigger: 'Strategic plan review or maintenance window evaluation',
      latencyTolerance: 'SUB_SECOND',
      requiredShortcuts: ['Ctrl+Shift+S', 'Ctrl+Tab']
    });
  }

  if (criticalWorkflows.length === 0) {
    criticalWorkflows.push({
      id: 'wf-core-inspection-and-update',
      name: 'Inspect, Filter, and Update Entity Records',
      steps: [
        'Search or filter entity collection',
        'Select record to inspect details in side pane',
        'Modify parameters inline or via quick inspector',
        'Commit changes and verify status update'
      ],
      trigger: 'Standard operational inspection',
      latencyTolerance: 'SUB_SECOND',
      requiredShortcuts: ['Ctrl+F', 'Enter', 'Escape']
    });
  }

  // 9. Generic Accessibility Considerations
  const accessibilityConsiderations = {
    level: 'WCAG_2_1_AA' as const,
    focusOrderStrict: true,
    highContrastSupport: true,
    keyboardOnlyNavigable: true,
    screenReaderAnnouncementNotes: [
      'Announce dynamic status updates and critical alerts using aria-live regions',
      'Provide semantic ARIA roles for complex interactive widgets (e.g. role="grid", role="region")'
    ]
  };

  // 10. Generic Responsive Requirements
  const isLargeDisplay =
    environment.includes('multi-monitor') ||
    environment.includes('control room') ||
    usageFrequency === 'CONTINUOUS_WORKBENCH';

  const responsiveRequirements = {
    primaryDevice: isLargeDisplay
      ? ('DESKTOP_LARGE_DISPLAY' as const)
      : ('LAPTOP_WORKBENCH' as const),
    minimumViewportWidthPx: isLargeDisplay ? 1280 : 1024,
    multiMonitorSupport: isLargeDisplay,
    splitPaneBehavior: isLargeDisplay
      ? 'Preserve primary views side-by-side; collapse secondary inspectors into expandable sidebars on narrow viewports'
      : 'Stack secondary panels below 1024px viewport width'
  };

  // 11. Generic Recommended Design Direction
  const hasTimeline = requiredVisualPatterns.some((p) => p.patternId.includes('timeline'));
  const hasSplitPanes = requiredVisualPatterns.some((p) => p.patternId.includes('split-panes'));

  const layoutArchetype = hasSplitPanes
    ? 'WORKBENCH_MULTI_PANE'
    : hasTimeline
      ? 'TIMELINE_GANTT_DOMINANT'
      : 'DATA_GRID_DOMINANT';

  const colorModePreference =
    usageFrequency === 'CONTINUOUS_WORKBENCH' || classification === 'INDUSTRIAL_OPERATIONAL'
      ? ('DARK_DOMINANT' as const)
      : ('SYSTEM_ADAPTIVE' as const);

  const typographyScale =
    density === 'HIGH' || density === 'EXTREME'
      ? ('COMPACT_HIGH_DENSITY' as const)
      : ('BALANCED_SYSTEM' as const);

  const recommendedDesignDirection = {
    layoutArchetype: layoutArchetype as any,
    colorModePreference,
    typographyScale,
    summary: `Generic discovery pipeline configured ${classification} with ${density} density, ${layoutArchetype} layout, and ${interactionStyle} interaction style.`
  };

  const profile: ProductUXProfile = {
    productName,
    productDomain: rawDomain,
    domainClassification: classification,
    personas,
    primaryJobsAndTasks,
    usageFrequency,
    informationDensity: density,
    interactionStyle,
    criticalWorkflows,
    requiredVisualPatterns,
    accessibilityConsiderations,
    responsiveRequirements,
    recommendedDesignDirection
  };

  return ProductUXProfileSchema.parse(profile);
}
