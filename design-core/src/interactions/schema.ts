import { z } from 'zod';

export const ShortcutDefinitionSchema = z.object({
  keyCombo: z.string(),
  action: z.string(),
  scope: z.enum(['GLOBAL', 'DATA_GRID', 'GANTT', 'INSPECTOR']),
  description: z.string()
});
export type ShortcutDefinition = z.infer<typeof ShortcutDefinitionSchema>;

export const defaultKeyboardShortcuts: ShortcutDefinition[] = [
  { keyCombo: 'Ctrl+Z', action: 'undo_plan_action', scope: 'GLOBAL', description: 'Undo last scheduling move' },
  { keyCombo: 'Ctrl+Y', action: 'redo_plan_action', scope: 'GLOBAL', description: 'Redo last scheduling move' },
  { keyCombo: 'Space', action: 'quick_preview_inspector', scope: 'GLOBAL', description: 'Quick view entity details' },
  { keyCombo: 'F2', action: 'begin_inline_edit', scope: 'DATA_GRID', description: 'Edit selected cell in grid' },
  { keyCombo: 'Alt+R', action: 'trigger_reschedule_dialog', scope: 'GLOBAL', description: 'Open re-sequencing dialog' },
  { keyCombo: 'Alt+B', action: 'jump_to_bottlenecks', scope: 'GANTT', description: 'Focus first bottleneck warning' },
  { keyCombo: 'Escape', action: 'cancel_or_close_modal', scope: 'GLOBAL', description: 'Dismiss open flyout or cancel drag' }
];

export function getShortcutsForScope(scope: ShortcutDefinition['scope']): ShortcutDefinition[] {
  return defaultKeyboardShortcuts.filter((s) => s.scope === 'GLOBAL' || s.scope === scope);
}
