import colorTokens from './defaults/color.json' with { type: 'json' };
import typographyTokens from './defaults/typography.json' with { type: 'json' };
import spacingTokens from './defaults/spacing.json' with { type: 'json' };
import elevationTokens from './defaults/elevation.json' with { type: 'json' };
import radiusTokens from './defaults/radius.json' with { type: 'json' };
import { TokenCompiler } from './compiler.js';
import { DTCGTokenFile } from './schema.js';

export * from './schema.js';
export * from './compiler.js';

export const defaultTokenFiles: DTCGTokenFile[] = [
  colorTokens as DTCGTokenFile,
  typographyTokens as DTCGTokenFile,
  spacingTokens as DTCGTokenFile,
  elevationTokens as DTCGTokenFile,
  radiusTokens as DTCGTokenFile
];

export function createDefaultTokenCompiler(): TokenCompiler {
  return new TokenCompiler(defaultTokenFiles);
}
