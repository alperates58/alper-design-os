import { DataDenseProfile } from '../types.js';

export function createDataDenseProfile(overrides?: Partial<DataDenseProfile>): DataDenseProfile {
  return {
    compactDensity: true,
    keyboardRowNavigation: true,
    rowSelection: 'MULTI',
    bulkActions: true,
    stickyHeaders: true,
    columnResizing: true,
    savedViews: true,
    filterPersistence: true,
    contextActions: true,
    masterDetail: true,
    splitPanes: true,
    ...overrides
  };
}
