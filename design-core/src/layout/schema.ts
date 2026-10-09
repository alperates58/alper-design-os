import { z } from 'zod';

export const LayoutArchetypeSchema = z.enum([
  'WORKBENCH_MULTI_PANE',
  'DATA_GRID_DOMINANT',
  'TIMELINE_GANTT_DOMINANT',
  'METRICS_DASHBOARD',
  'MASTER_DETAIL_INSPECTOR'
]);
export type LayoutArchetype = z.infer<typeof LayoutArchetypeSchema>;

export const PaneConfigSchema = z.object({
  id: z.string(),
  title: z.string(),
  defaultWidthPercent: z.number().min(5).max(95),
  minWidthPx: z.number().int().positive(),
  collapsible: z.boolean(),
  resizable: z.boolean()
});
export type PaneConfig = z.infer<typeof PaneConfigSchema>;

export const LayoutSpecificationSchema = z.object({
  archetype: LayoutArchetypeSchema,
  panes: z.array(PaneConfigSchema),
  density: z.enum(['EXTREME', 'HIGH', 'MEDIUM', 'SPACIOUS']),
  headerHeightPx: z.number().int().positive(),
  showCommandBar: z.boolean(),
  statusBarHeightPx: z.number().int().positive()
});
export type LayoutSpecification = z.infer<typeof LayoutSpecificationSchema>;
