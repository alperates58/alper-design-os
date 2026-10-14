import { UXPatternSpec } from './schema.js';

export const coreUXPatterns: UXPatternSpec[] = [
  {
    id: 'gantt-timeline',
    name: 'Interactive Multi-Track Timeline',
    category: 'SCHEDULING_WORKBENCH',
    description: 'Horizontal multi-track timeline representing temporal sequences, boundary constraints, and resource dependencies.',
    keyboardShortcuts: ['ArrowLeft/Right (Pan)', 'Ctrl+Wheel (Zoom)', 'Space (Inspect Item)', 'Alt+M (Reassign Track)'],
    accessibilityRole: 'grid',
    supportedDensities: ['EXTREME', 'HIGH']
  },
  {
    id: 'dense-datagrid',
    name: 'High-Density Operational DataGrid',
    category: 'DATA_DISPLAY',
    description: 'Virtual-scrolling table supporting 10,000+ rows, multi-sort, column reordering, and inline cell editing.',
    keyboardShortcuts: ['Arrow keys (Cell Focus)', 'Enter (Commit & Next Row)', 'F2 (Inline Edit)', 'Escape (Cancel Edit)'],
    accessibilityRole: 'grid',
    supportedDensities: ['EXTREME', 'HIGH', 'MEDIUM']
  },
  {
    id: 'split-pane-workbench',
    name: 'Resizable Multi-Pane Workbench',
    category: 'NAVIGATION',
    description: 'Dockable, resizable horizontal and vertical split panes with memory of user layout presets.',
    keyboardShortcuts: ['Ctrl+B (Toggle Left Pane)', 'Ctrl+J (Toggle Bottom Console)', 'Alt+1..3 (Focus Pane)'],
    accessibilityRole: 'region',
    supportedDensities: ['EXTREME', 'HIGH', 'MEDIUM']
  },
  {
    id: 'bottleneck-indicator',
    name: 'Capacity & Constraint Utilization Heatmap',
    category: 'FEEDBACK_ALERTS',
    description: 'Visual indicator of resource or channel utilization percentages with threshold warning highlights.',
    keyboardShortcuts: ['Alt+H (Jump to Highest Bottleneck)'],
    accessibilityRole: 'status',
    supportedDensities: ['EXTREME', 'HIGH', 'MEDIUM']
  },
  {
    id: 'filter-bar',
    name: 'Faceted Operational Filter Bar',
    category: 'INPUT_CONTROLS',
    description: 'Quick-filter toolbar for status codes, time windows, priority flags, and operational categories.',
    keyboardShortcuts: ['/', 'Ctrl+F (Focus Search)', 'Alt+C (Clear Filters)'],
    accessibilityRole: 'search',
    supportedDensities: ['HIGH', 'MEDIUM', 'SPACIOUS']
  },
  {
    id: 'context-menu',
    name: 'Radial / Hierarchical Context Menu',
    category: 'NAVIGATION',
    description: 'Instant contextual action menu triggered by right-click or Shift+F10 on any grid row or timeline item.',
    keyboardShortcuts: ['Shift+F10 (Open Menu)', 'ArrowDown/Up (Navigate)', 'Enter (Select)', 'Escape (Close)'],
    accessibilityRole: 'menu',
    supportedDensities: ['EXTREME', 'HIGH', 'MEDIUM']
  }
];

export function getUXPatternById(id: string): UXPatternSpec | undefined {
  return coreUXPatterns.find((p) => p.id === id);
}

export function searchUXPatterns(query: string): UXPatternSpec[] {
  const q = query.toLowerCase();
  return coreUXPatterns.filter(
    (p) =>
      p.id.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  );
}
