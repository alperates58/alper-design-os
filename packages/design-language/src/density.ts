import { DensityMode, DensityProfile } from './types.js';

export const compactDensityProfile: DensityProfile = {
  mode: 'COMPACT',
  baseSpacingUnit: 4,
  tableRowHeight: 36,
  inputHeight: 32,
  buttonHeight: 32,
  fontSizeScale: 'COMPACT'
};

export const comfortableDensityProfile: DensityProfile = {
  mode: 'COMFORTABLE',
  baseSpacingUnit: 8,
  tableRowHeight: 48,
  inputHeight: 40,
  buttonHeight: 40,
  fontSizeScale: 'STANDARD'
};

export const spaciousDensityProfile: DensityProfile = {
  mode: 'SPACIOUS',
  baseSpacingUnit: 12,
  tableRowHeight: 60,
  inputHeight: 48,
  buttonHeight: 48,
  fontSizeScale: 'PROMINENT'
};

export function resolveDensityProfile(mode: DensityMode): DensityProfile {
  switch (mode) {
    case 'COMPACT':
      return compactDensityProfile;
    case 'SPACIOUS':
      return spaciousDensityProfile;
    case 'COMFORTABLE':
    default:
      return comfortableDensityProfile;
  }
}
