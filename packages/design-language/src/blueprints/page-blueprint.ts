import {
  PageBlueprint,
  DesignIntent,
  DesignPersonality,
  DensityProfile,
  PageRegion
} from '../types.js';
import { createAppShellBlueprint } from './app-shell-blueprint.js';
import {
  canonicalButton,
  canonicalInput,
  canonicalDataTable,
  canonicalFilterBar,
  canonicalBadge,
  canonicalDrawer,
  canonicalModalDialog,
  canonicalAlert
} from './canonical-components.js';

export function createPageBlueprint(
  id: string,
  title: string,
  options: {
    intent: DesignIntent;
    personality: DesignPersonality;
    density: DensityProfile;
    regions: PageRegion[];
  }
): PageBlueprint {
  const shell = createAppShellBlueprint(`${id}-shell`, 'ENTERPRISE_DENSE');

  return {
    id,
    title,
    description: `Canonical page blueprint for ${title}`,
    intent: options.intent,
    personality: options.personality,
    density: options.density,
    shell,
    regions: options.regions,
    responsiveRules: [
      {
        priority: 'HIGH',
        collapseOrder: 1,
        hidePolicy: 'NEVER',
        stackPolicy: 'STACK_ON_MOBILE',
        overflowPolicy: 'SCROLL',
        drawerConversion: true,
        touchTarget: { minWidth: 44, minHeight: 44 }
      }
    ]
  };
}

/**
 * Canonical Test Project: "Data Management Workspace"
 * Pure technology-neutral blueprint without business-domain-specific rules.
 * Contains:
 * - AppShell
 * - PageHeader
 * - FilterBar
 * - DataTable
 * - StatusBadge
 * - DetailDrawer
 * - ModalDialog
 * - Form inputs
 * - EmptyState / ErrorState
 */
export function createDataManagementWorkspaceBlueprint(): PageBlueprint {
  const defaultIntent: DesignIntent = {
    productType: 'ENTERPRISE_INTERNAL',
    userExpertise: 'EXPERT',
    usageFrequency: 'DAILY_FREQUENT',
    sessionDuration: 'LONG_EXTENDED',
    informationDensity: 'COMPACT',
    interactionIntensity: 'KEYBOARD_POWER',
    devicePriority: 'DESKTOP_FIRST',
    taskCriticality: 'MISSION_CRITICAL',
    errorCost: 'SIGNIFICANT',
    brandCharacter: 'TECHNICAL',
    visualEmphasis: 'DATA_FIRST',
    motionTolerance: 'SUBTLE',
    accessibilityNeeds: 'STANDARD_AA',
    decisionPrinciples: [
      'Prioritize data density, keyboard scanability, and deterministic navigation.',
      'Maintain strict 4px rhythm and tabular alignment for numerical records.',
      'Prevent destructive actions without explicit confirmation barrier.'
    ]
  };

  const defaultPersonality: DesignPersonality = {
    reservedToExpressive: -60,
    compactToSpacious: -75,
    technicalToEditorial: -80,
    neutralToBranded: -50,
    flatToLayered: -20,
    staticToAnimated: -60,
    rationale: 'High-density operational workspace requiring scannable data and zero gratuitous flair.'
  };

  const defaultDensity: DensityProfile = {
    mode: 'COMPACT',
    baseSpacingUnit: 4,
    tableRowHeight: 36,
    inputHeight: 32,
    buttonHeight: 32,
    fontSizeScale: 'COMPACT'
  };

  return createPageBlueprint('data-management-workspace', 'Data Management Workspace', {
    intent: defaultIntent,
    personality: defaultPersonality,
    density: defaultDensity,
    regions: [
      {
        id: 'region-header',
        type: 'PAGE_HEADER',
        title: 'Records & Inventory',
        components: [
          canonicalBadge,
          canonicalButton
        ]
      },
      {
        id: 'region-filter-bar',
        type: 'FILTER_BAR',
        title: 'Filter & Search Strip',
        components: [
          canonicalFilterBar,
          canonicalInput
        ]
      },
      {
        id: 'region-grid',
        type: 'GRID_REGION',
        title: 'Data Grid View',
        components: [
          canonicalDataTable
        ]
      },
      {
        id: 'region-status-alert',
        type: 'STATUS_REGION',
        title: 'System Feedback',
        components: [
          canonicalAlert
        ]
      },
      {
        id: 'region-inspector',
        type: 'DETAIL_PANEL',
        title: 'Record Inspector Drawer',
        components: [
          canonicalDrawer,
          canonicalModalDialog
        ]
      }
    ]
  });
}
