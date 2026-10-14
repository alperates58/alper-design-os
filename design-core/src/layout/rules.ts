import { LayoutSpecification } from './schema.js';
import { ProductUXProfile } from '../domain/schema.js';

export function resolveLayoutSpecification(profile: ProductUXProfile): LayoutSpecification {
  switch (profile.recommendedDesignDirection.layoutArchetype) {
    case 'WORKBENCH_MULTI_PANE':
      return {
        archetype: 'WORKBENCH_MULTI_PANE',
        panes: [
          {
            id: 'pane-primary-queue',
            title: 'Primary Queue & Filter Explorer',
            defaultWidthPercent: 25,
            minWidthPx: 280,
            collapsible: true,
            resizable: true
          },
          {
            id: 'pane-workspace-canvas',
            title: 'Primary Operational Workspace',
            defaultWidthPercent: 55,
            minWidthPx: 480,
            collapsible: false,
            resizable: true
          },
          {
            id: 'pane-context-inspector',
            title: 'Contextual Detail & Constraint Inspector',
            defaultWidthPercent: 20,
            minWidthPx: 240,
            collapsible: true,
            resizable: true
          }
        ],
        density: profile.informationDensity,
        headerHeightPx: 40,
        showCommandBar: true,
        statusBarHeightPx: 24
      };

    case 'TIMELINE_GANTT_DOMINANT':
      return {
        archetype: 'TIMELINE_GANTT_DOMINANT',
        panes: [
          {
            id: 'pane-activity-queue',
            title: 'Pending Activity Queue',
            defaultWidthPercent: 25,
            minWidthPx: 280,
            collapsible: true,
            resizable: true
          },
          {
            id: 'pane-timeline-canvas',
            title: 'Interactive Timeline & Sequence Canvas',
            defaultWidthPercent: 55,
            minWidthPx: 480,
            collapsible: false,
            resizable: true
          },
          {
            id: 'pane-context-inspector',
            title: 'Contextual Resource & Constraint Inspector',
            defaultWidthPercent: 20,
            minWidthPx: 240,
            collapsible: true,
            resizable: true
          }
        ],
        density: profile.informationDensity,
        headerHeightPx: 40,
        showCommandBar: true,
        statusBarHeightPx: 24
      };

    case 'DATA_GRID_DOMINANT':
    default:
      return {
        archetype: 'DATA_GRID_DOMINANT',
        panes: [
          {
            id: 'pane-main-grid',
            title: 'Primary Entity Ledger',
            defaultWidthPercent: 75,
            minWidthPx: 600,
            collapsible: false,
            resizable: true
          },
          {
            id: 'pane-detail-preview',
            title: 'Detail Inspector',
            defaultWidthPercent: 25,
            minWidthPx: 300,
            collapsible: true,
            resizable: true
          }
        ],
        density: profile.informationDensity,
        headerHeightPx: 48,
        showCommandBar: true,
        statusBarHeightPx: 28
      };
  }
}

export const generateLayoutGuidance = resolveLayoutSpecification;
