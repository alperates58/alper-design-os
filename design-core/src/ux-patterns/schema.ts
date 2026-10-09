import { z } from 'zod';

export const UXPatternCategorySchema = z.enum([
  'NAVIGATION',
  'DATA_DISPLAY',
  'FEEDBACK_ALERTS',
  'SCHEDULING_WORKBENCH',
  'INPUT_CONTROLS'
]);
export type UXPatternCategory = z.infer<typeof UXPatternCategorySchema>;

export const UXPatternSpecSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: UXPatternCategorySchema,
  description: z.string(),
  keyboardShortcuts: z.array(z.string()),
  accessibilityRole: z.string(),
  supportedDensities: z.array(z.enum(['EXTREME', 'HIGH', 'MEDIUM', 'SPACIOUS'])),
  propsSchema: z.record(z.unknown()).optional()
});
export type UXPatternSpec = z.infer<typeof UXPatternSpecSchema>;
