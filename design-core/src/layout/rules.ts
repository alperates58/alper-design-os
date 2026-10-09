import { LayoutSpecification } from './schema.js';
import { ProductUXProfile } from '../domain/schema.js';

export function resolveLayoutSpecification(profile: ProductUXProfile): LayoutSpecification {
  switch (profile.recommendedDesignDirection.layoutArchetype) {
    case 'WORKBENCH_MULTI_PANE':
    case 'TIMELINE_GANTT_DOMINANT':
      return {
        archetype: 'WORKBENCH_MULTI_PANE',
        panes: [
          {
            id: 'pane-order-backlog',
            title: 'Unscheduled Orders / Operations Pool',
            defaultWidthPercent: 25,
            minWidthPx: 280,
            collapsible: true,
            resizable: true
          },
          {
            id: 'pane-gantt-timeline',
            title: 'Finite Capacity Gantt Schedule',
            defaultWidthPercent: 55,
            minWidthPx: 480,
            collapsible: false,
            resizable: true
          },
          {
            id: 'pane-inspector-bottlenecks',
            title: 'Resource Inspector & Bottlenecks',
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
