import { ResponsiveContract } from '../types.js';

export function createResponsiveContract(overrides?: Partial<ResponsiveContract>): ResponsiveContract {
  return {
    priority: 'MEDIUM',
    collapseOrder: 10,
    hidePolicy: 'NEVER',
    stackPolicy: 'STACK_ON_MOBILE',
    overflowPolicy: 'WRAP',
    drawerConversion: false,
    tableStrategy: 'FULL_GRID',
    touchTarget: {
      minWidth: 44,
      minHeight: 44
    },
    contentMinWidth: 320,
    ...overrides
  };
}

export function createDenseTableResponsiveContract(): ResponsiveContract {
  return {
    priority: 'CRITICAL',
    collapseOrder: 1,
    hidePolicy: 'NEVER',
    stackPolicy: 'INLINE',
    overflowPolicy: 'SCROLL',
    drawerConversion: false,
    tableStrategy: 'PRIORITY_COLUMNS',
    touchTarget: {
      minWidth: 40,
      minHeight: 40
    },
    contentMinWidth: 640
  };
}

export function createFilterBarResponsiveContract(): ResponsiveContract {
  return {
    priority: 'HIGH',
    collapseOrder: 2,
    hidePolicy: 'NEVER',
    stackPolicy: 'STACK_ON_MOBILE',
    overflowPolicy: 'DRAWER',
    drawerConversion: true, // Converts into a filter drawer on mobile
    touchTarget: {
      minWidth: 44,
      minHeight: 44
    }
  };
}
