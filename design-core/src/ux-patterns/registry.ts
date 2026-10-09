import { UXPatternSpec } from './schema.js';

export const coreUXPatterns: UXPatternSpec[] = [
  {
    id: 'gantt-timeline',
    name: 'Finite Capacity Gantt Timeline',
    category: 'SCHEDULING_WORKBENCH',
    description: 'Horizontal multi-track timeline representing machine schedules, frozen horizons, and setup matrix dependencies.',
    keyboardShortcuts: ['ArrowLeft/Right (Pan)', 'Ctrl+Wheel (Zoom)', 'Space (Inspect Operation)', 'Alt+M (Move to Machine)'],
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
    name: 'Resource Overload & Bottleneck Heatmap',
    category: 'FEEDBACK_ALERTS',
    description: 'Visual indicator of work center utilization percentages with warning threshold highlights.',
    keyboardShortcuts: ['Alt+H (Jump to Highest Bottleneck)'],
    accessibilityRole: 'status',
    supportedDensities: ['EXTREME', 'HIGH', 'MEDIUM']
  },
  {
    id: 'filter-bar',
    name: 'Faceted Operational Filter Bar',
    category: 'INPUT_CONTROLS',
    description: 'Quick-filter toolbar for routing codes, shift windows, priority flags, and work centers.',
    keyboardShortcuts: ['/', 'Ctrl+F (Focus Search)', 'Alt+C (Clear Filters)'],
    accessibilityRole: 'search',
    supportedDensities: ['HIGH', 'MEDIUM', 'SPACIOUS']
  },
  {
    id: 'context-menu',
    name: 'Radial / Hierarchical Context Menu',
    category: 'NAVIGATION',
    description: 'Instant contextual action menu triggered by right-click or Shift+F10 on any grid row or Gantt operation.',
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
