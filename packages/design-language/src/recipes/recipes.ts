import { UIRecipe, RecipeType, PageBlueprint } from '../types.js';
import { createDesignIntent } from '../design-intent.js';
import { computeDesignPersonality } from '../design-personality.js';
import { resolveDensityProfile } from '../density.js';
import { createAppShellBlueprint } from '../blueprints/app-shell-blueprint.js';
import {
  canonicalButton,
  canonicalInput,
  canonicalDataTable,
  canonicalFilterBar,
  canonicalBadge,
  canonicalCard,
  canonicalDrawer,
  canonicalModalDialog,
  canonicalAlert,
  canonicalSwitch
} from '../blueprints/canonical-components.js';

export function createRecipeBlueprint(type: RecipeType): PageBlueprint {
  const intent = createDesignIntent({
    productType: type === 'LOGIN_PAGE' ? 'B2C_CONSUMER' : 'B2B_SAAS',
    informationDensity: type === 'DATA_MANAGEMENT_PAGE' || type === 'LIST_DETAIL_PAGE' ? 'COMPACT' : 'COMFORTABLE'
  });
  const personality = computeDesignPersonality(intent);
  const density = resolveDensityProfile(intent.informationDensity);
  const shell = createAppShellBlueprint(`${type.toLowerCase()}-shell`, 'SAAS_STANDARD');

  let title = 'Page';
  const regions: PageBlueprint['regions'] = [];

  switch (type) {
    case 'LOGIN_PAGE':
      title = 'Sign In to Workspace';
      regions.push({
        id: 'region-auth-card',
        type: 'CONTENT_REGION',
        title: 'Authentication Container',
        components: [canonicalCard, canonicalInput, canonicalButton, canonicalAlert]
      });
      break;

    case 'SETTINGS_PAGE':
      title = 'Account & Workspace Settings';
      regions.push({
        id: 'region-settings-header',
        type: 'PAGE_HEADER',
        title: 'General Preferences',
        components: [canonicalBadge]
      });
      regions.push({
        id: 'region-settings-body',
        type: 'CONTENT_REGION',
        title: 'Configuration Form',
        components: [canonicalCard, canonicalInput, canonicalSwitch, canonicalButton]
      });
      break;

    case 'LIST_DETAIL_PAGE':
      title = 'Directory & Item Inspector';
      regions.push({
        id: 'region-filter',
        type: 'FILTER_BAR',
        title: 'Quick Search & Tags',
        components: [canonicalFilterBar]
      });
      regions.push({
        id: 'region-list',
        type: 'GRID_REGION',
        title: 'Master Items List',
        components: [canonicalDataTable]
      });
      regions.push({
        id: 'region-detail',
        type: 'DETAIL_PANEL',
        title: 'Selected Item Detail',
        components: [canonicalDrawer, canonicalButton]
      });
      break;

    case 'DATA_MANAGEMENT_PAGE':
      title = 'Data Management Workspace';
      regions.push({
        id: 'region-header',
        type: 'PAGE_HEADER',
        title: 'System Entities & Records',
        components: [canonicalBadge, canonicalButton]
      });
      regions.push({
        id: 'region-filter-bar',
        type: 'FILTER_BAR',
        title: 'Faceted Filters',
        components: [canonicalFilterBar, canonicalInput]
      });
      regions.push({
        id: 'region-grid',
        type: 'GRID_REGION',
        title: 'Dense Data Table',
        components: [canonicalDataTable]
      });
      regions.push({
        id: 'region-modal',
        type: 'ACTION_REGION',
        title: 'Bulk Confirmation Barrier',
        components: [canonicalModalDialog]
      });
      break;

    case 'DASHBOARD_PAGE':
      title = 'Executive Metrics & Pulse';
      regions.push({
        id: 'region-header',
        type: 'PAGE_HEADER',
        title: 'Key Performance Indicators',
        components: [canonicalBadge]
      });
      regions.push({
        id: 'region-metrics',
        type: 'CONTENT_REGION',
        title: 'KPI Cards & Trend Highlights',
        components: [canonicalCard, canonicalBadge]
      });
      regions.push({
        id: 'region-recent-activity',
        type: 'GRID_REGION',
        title: 'Recent Activity Feed',
        components: [canonicalDataTable]
      });
      break;

    case 'FORM_PAGE':
      title = 'New Record Submission Form';
      regions.push({
        id: 'region-header',
        type: 'PAGE_HEADER',
        title: 'Entity Attributes Entry',
        components: [canonicalBadge]
      });
      regions.push({
        id: 'region-form',
        type: 'CONTENT_REGION',
        title: 'Input Fields',
        components: [canonicalInput, canonicalSwitch, canonicalButton, canonicalAlert]
      });
      break;
  }

  return {
    id: `recipe-${type.toLowerCase()}`,
    title,
    description: `Standardized canonical UI recipe for ${type}`,
    intent,
    personality,
    density,
    shell,
    regions,
    responsiveRules: [
      {
        priority: 'HIGH',
        collapseOrder: 1,
        hidePolicy: 'NEVER',
        stackPolicy: 'STACK_ON_MOBILE',
        overflowPolicy: 'WRAP',
        drawerConversion: true,
        touchTarget: { minWidth: 44, minHeight: 44 }
      }
    ]
  };
}

export const canonicalRecipes: UIRecipe[] = [
  {
    id: 'recipe-login-page',
    name: 'Authentication Login Page',
    type: 'LOGIN_PAGE',
    description: 'Focused credential submission layout with accessible validation feedback.',
    blueprint: createRecipeBlueprint('LOGIN_PAGE'),
    supportedThemes: ['LIGHT', 'DARK', 'HIGH_CONTRAST'],
    supportedDensities: ['COMFORTABLE', 'SPACIOUS']
  },
  {
    id: 'recipe-settings-page',
    name: 'Settings & Preferences Page',
    type: 'SETTINGS_PAGE',
    description: 'Categorized configuration panels with immediate switch feedback and form controls.',
    blueprint: createRecipeBlueprint('SETTINGS_PAGE'),
    supportedThemes: ['LIGHT', 'DARK', 'HIGH_CONTRAST'],
    supportedDensities: ['COMFORTABLE', 'SPACIOUS']
  },
  {
    id: 'recipe-list-detail-page',
    name: 'Master-Detail List Page',
    type: 'LIST_DETAIL_PAGE',
    description: 'Split-view or drawer-backed master-detail navigation with search and filtering.',
    blueprint: createRecipeBlueprint('LIST_DETAIL_PAGE'),
    supportedThemes: ['LIGHT', 'DARK', 'HIGH_CONTRAST'],
    supportedDensities: ['COMPACT', 'COMFORTABLE']
  },
  {
    id: 'recipe-data-management-page',
    name: 'High-Density Data Management Page',
    type: 'DATA_MANAGEMENT_PAGE',
    description: 'Enterprise data workspace with faceted filters, dense table, and drawer inspector.',
    blueprint: createRecipeBlueprint('DATA_MANAGEMENT_PAGE'),
    supportedThemes: ['LIGHT', 'DARK', 'HIGH_CONTRAST'],
    supportedDensities: ['COMPACT', 'COMFORTABLE']
  },
  {
    id: 'recipe-dashboard-page',
    name: 'Executive Dashboard Page',
    type: 'DASHBOARD_PAGE',
    description: 'Structured metrics overview avoiding card soup and maintaining visual hierarchy.',
    blueprint: createRecipeBlueprint('DASHBOARD_PAGE'),
    supportedThemes: ['LIGHT', 'DARK', 'HIGH_CONTRAST'],
    supportedDensities: ['COMFORTABLE', 'SPACIOUS']
  },
  {
    id: 'recipe-form-page',
    name: 'Structured Multi-Field Form Page',
    type: 'FORM_PAGE',
    description: 'Clean single or multi-column form with keyboard accessibility and inline validation.',
    blueprint: createRecipeBlueprint('FORM_PAGE'),
    supportedThemes: ['LIGHT', 'DARK', 'HIGH_CONTRAST'],
    supportedDensities: ['COMPACT', 'COMFORTABLE', 'SPACIOUS']
  }
];

export function getRecipeByType(type: RecipeType): UIRecipe | undefined {
  return canonicalRecipes.find((r) => r.type === type);
}
