import { ApplicationShellBlueprint, AppShellVariant, DesignIntent } from '../types.js';

export function inferAppShellVariant(intent: DesignIntent): AppShellVariant {
  // Driven strictly by contextual ProductUXProfile characteristics, never hardcoded domains
  if (intent.informationDensity === 'COMPACT' || intent.userExpertise === 'EXPERT' || intent.taskCriticality === 'MISSION_CRITICAL') {
    return 'ENTERPRISE_DENSE';
  }
  if (intent.visualEmphasis === 'CONTENT_FIRST' || intent.userExpertise === 'NOVICE') {
    return 'CONSUMER_CONTENT';
  }
  return 'SAAS_STANDARD';
}

export function createAppShellBlueprint(
  id: string,
  variant: AppShellVariant = 'SAAS_STANDARD',
  overrides?: Partial<ApplicationShellBlueprint>
): ApplicationShellBlueprint {
  const isDense = variant === 'ENTERPRISE_DENSE';

  return {
    id,
    variant,
    navigation: {
      sidebar: true,
      topNav: true,
      breadcrumbs: isDense,
      commandArea: isDense,
      navItems: [
        { label: 'Overview', href: '/overview', icon: 'dashboard', active: true },
        { label: 'Data Management', href: '/data', icon: 'table' },
        { label: 'Reports', href: '/reports', icon: 'chart' },
        { label: 'Settings', href: '/settings', icon: 'settings' }
      ]
    },
    userMenu: {
      location: 'TOP_RIGHT',
      items: ['Profile', 'Account Settings', 'Sign Out']
    },
    mobileDrawer: true,
    contentRegion: {
      fullWidth: isDense,
      maxWidth: isDense ? '100%' : '1440px',
      padding: isDense ? '16px' : '24px'
    },
    ...overrides
  };
}
