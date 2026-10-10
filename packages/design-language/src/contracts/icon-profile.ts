import { IconProfile, IconFamily } from '../types.js';

export const standardSemanticIcons = {
  search: 'search',
  settings: 'settings',
  delete: 'trash-2',
  edit: 'edit-3',
  warning: 'alert-triangle',
  filter: 'filter',
  check: 'check',
  close: 'x',
  chevronDown: 'chevron-down',
  chevronRight: 'chevron-right',
  menu: 'menu',
  user: 'user',
  download: 'download',
  upload: 'upload',
  refresh: 'rotate-cw'
};

export function createIconProfile(
  family: IconFamily = 'LUCIDE',
  customMap?: Record<string, string>
): IconProfile {
  return {
    primaryFamily: family,
    semanticMap: {
      ...standardSemanticIcons,
      ...customMap
    },
    enforceSingleFamily: true
  };
}

/**
 * Checks whether a given set of icon references mixes multiple distinct icon libraries.
 */
export function validateIconConsistency(iconNames: string[], selectedFamily: IconFamily): { isConsistent: boolean; violations: string[] } {
  const violations: string[] = [];
  for (const name of iconNames) {
    if (selectedFamily === 'LUCIDE' && name.startsWith('mat-')) {
      violations.push(`Found Material Symbol '${name}' in a Lucide-standard project.`);
    } else if (selectedFamily === 'TABLER' && name.startsWith('hero-')) {
      violations.push(`Found Heroicon '${name}' in a Tabler-standard project.`);
    }
  }

  return {
    isConsistent: violations.length === 0,
    violations
  };
}
