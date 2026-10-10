import { TokenArchitectureV2, ThemeMode, DensityMode } from '../types.js';

/**
 * Converts a dotted token name into a CSS variable name.
 * e.g. "surface.default" -> "--alper-surface-default"
 */
export function tokenToCssVar(tokenName: string): string {
  return `--alper-${tokenName.replace(/\./g, '-')}`;
}

/**
 * Generates Cross-Stack CSS Variables with full Theme and Density support.
 */
export function generateCssVariables(tokens: TokenArchitectureV2): string {
  const lightVars: string[] = [];
  const darkVars: string[] = [];
  const highContrastVars: string[] = [];

  // 1. Primitive tokens
  for (const [name, token] of Object.entries(tokens.primitives)) {
    lightVars.push(`  ${tokenToCssVar(name)}: ${token.value};`);
  }

  // 2. Semantic tokens (Multi-theme)
  for (const [name, token] of Object.entries(tokens.semantics)) {
    const varName = tokenToCssVar(name);
    lightVars.push(`  ${varName}: ${token.lightValue};`);
    darkVars.push(`  ${varName}: ${token.darkValue};`);
    highContrastVars.push(`  ${varName}: ${token.highContrastValue};`);
  }

  // 3. Typography tokens
  const headingFonts = tokens.typography.familyHeading.join(', ');
  const bodyFonts = tokens.typography.familyBody.join(', ');
  const monoFonts = tokens.typography.familyMono.join(', ');
  lightVars.push(`  --alper-font-heading: ${headingFonts};`);
  lightVars.push(`  --alper-font-body: ${bodyFonts};`);
  lightVars.push(`  --alper-font-mono: ${monoFonts};`);
  lightVars.push(`  --alper-font-feature-settings: "tnum" 1, "cv02" 1;`);

  // 4. Motion tokens
  for (const [name, token] of Object.entries(tokens.motion)) {
    lightVars.push(`  ${tokenToCssVar(name)}-duration: ${token.durationMs}ms;`);
    lightVars.push(`  ${tokenToCssVar(name)}-easing: ${token.easing};`);
  }

  return `/**
 * Alper Design OS - Canonical Design Tokens V2
 * Technology-neutral compiled cross-stack stylesheet.
 */

/* 1. Base / Light Theme */
:root, [data-theme="light"] {
${lightVars.join('\n')}

  /* Default Density (Comfortable) */
  --alper-density-unit: 8px;
  --alper-input-height: 40px;
  --alper-button-height: 40px;
  --alper-table-row-height: 48px;
  --alper-font-size-base: 14px;
}

/* 2. Dark Theme */
[data-theme="dark"] {
${darkVars.join('\n')}
}

/* 3. High Contrast Accessibility Mode */
[data-theme="high-contrast"] {
${highContrastVars.join('\n')}
}

/* 4. Density Modes */
[data-density="compact"] {
  --alper-density-unit: 4px;
  --alper-input-height: 32px;
  --alper-button-height: 32px;
  --alper-table-row-height: 36px;
  --alper-font-size-base: 13px;
}

[data-density="comfortable"] {
  --alper-density-unit: 8px;
  --alper-input-height: 40px;
  --alper-button-height: 40px;
  --alper-table-row-height: 48px;
  --alper-font-size-base: 14px;
}

[data-density="spacious"] {
  --alper-density-unit: 12px;
  --alper-input-height: 48px;
  --alper-button-height: 48px;
  --alper-table-row-height: 60px;
  --alper-font-size-base: 16px;
}

/* 5. Reduced Motion Override */
@media (prefers-reduced-motion: reduce) {
  :root {
    --alper-motion-fast-duration: 0ms !important;
    --alper-motion-normal-duration: 0ms !important;
    --alper-motion-slow-duration: 0ms !important;
  }
}
`;
}

/**
 * Generates strict TypeScript constants from Canonical Tokens.
 */
export function generateTypeScriptConstants(tokens: TokenArchitectureV2): string {
  return `/**
 * Alper Design OS - Canonical Design Tokens V2 (TypeScript Export)
 */

export const AlperTokens = ${JSON.stringify(tokens, null, 2)} as const;

export type AlperTokensType = typeof AlperTokens;
`;
}

/**
 * Generates Tailwind CSS compatible theme extension mapping.
 */
export function generateTailwindTheme(tokens: TokenArchitectureV2): Record<string, unknown> {
  const colors: Record<string, string> = {};
  for (const name of Object.keys(tokens.semantics)) {
    const key = name.replace(/\./g, '-');
    colors[key] = `var(${tokenToCssVar(name)})`;
  }

  const spacing: Record<string, string> = {};
  for (const [name, token] of Object.entries(tokens.primitives)) {
    if (token.type === 'DIMENSION' && name.startsWith('space.')) {
      const key = name.replace('space.', '');
      spacing[key] = `var(${tokenToCssVar(name)})`;
    }
  }

  return {
    theme: {
      extend: {
        colors,
        spacing,
        borderRadius: {
          sm: 'var(--alper-radius-sm)',
          md: 'var(--alper-radius-md)',
          lg: 'var(--alper-radius-lg)',
          full: 'var(--alper-radius-full)'
        },
        fontFamily: {
          heading: ['var(--alper-font-heading)'],
          body: ['var(--alper-font-body)'],
          mono: ['var(--alper-font-mono)']
        }
      }
    }
  };
}

/**
 * Generates SCSS Variables mapping from Canonical Tokens.
 */
export function generateScssVariables(tokens: TokenArchitectureV2): string {
  const lines: string[] = ['// Alper Design OS - Canonical SCSS Variables'];
  for (const [name, token] of Object.entries(tokens.semantics)) {
    const scssVar = `$alper-${name.replace(/\./g, '-')}`;
    lines.push(`${scssVar}: var(${tokenToCssVar(name)});`);
  }
  return lines.join('\n') + '\n';
}

/**
 * Generates DTCG compliant JSON token file.
 */
export function generateDtcgJson(tokens: TokenArchitectureV2): Record<string, unknown> {
  const dtcg: Record<string, unknown> = {
    $description: 'Alper Design OS Canonical Tokens V2 - DTCG Compliant',
    color: {},
    space: {},
    radius: {}
  };

  for (const [name, token] of Object.entries(tokens.primitives)) {
    const parts = name.split('.');
    let cur: any = dtcg;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i]!;
      if (!cur[part]) cur[part] = {};
      cur = cur[part];
    }
    const last = parts[parts.length - 1]!;
    cur[last] = {
      $value: token.value,
      $type: token.type.toLowerCase()
    };
  }

  return dtcg;
}
