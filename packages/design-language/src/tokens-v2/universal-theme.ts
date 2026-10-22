/**
 * Universal Light / Dark / System Theming V2
 * Canonical semantic theme model with bidirectional contrast validation,
 * CSS variable generation, SSR hydration safety, and reduced-motion enforcement.
 */

export type UniversalThemeMode = 'LIGHT' | 'DARK' | 'SYSTEM';

export interface SemanticThemeTokens {
  mode: 'LIGHT' | 'DARK';
  // 1. Palettes
  colorPrimary: string;
  colorPrimaryForeground: string;
  colorSecondary: string;
  colorSecondaryForeground: string;
  colorAccent: string;
  colorAccentForeground: string;

  // 2. Surfaces
  surfaceBase: string;
  surfaceDefault: string;
  surfaceElevated: string;
  surfaceMuted: string;
  surfaceSubtle: string;

  // 3. Foreground & Typography
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textOnColor: string;

  // 4. Borders & Separators
  borderSubtle: string;
  borderDefault: string;
  borderStrong: string;
  borderFocus: string;

  // 5. Interactive States
  interactiveHover: string;
  interactiveActive: string;
  interactiveSelected: string;
  interactiveFocusRing: string;
  interactiveDisabledBg: string;
  interactiveDisabledText: string;

  // 6. Semantic Status
  statusSuccessBg: string;
  statusSuccessText: string;
  statusSuccessBorder: string;
  statusWarningBg: string;
  statusWarningText: string;
  statusWarningBorder: string;
  statusDestructiveBg: string;
  statusDestructiveText: string;
  statusDestructiveBorder: string;
  statusInfoBg: string;
  statusInfoText: string;
  statusInfoBorder: string;

  // 7. Form Controls
  inputBg: string;
  inputBorder: string;
  inputText: string;
  inputPlaceholder: string;
  inputFocusBorder: string;

  // 8. Navigation & Overlays
  navBg: string;
  navItemHover: string;
  navItemActive: string;
  overlayBackdrop: string;
  dialogBg: string;
  dialogBorder: string;

  // 9. Tables & DataGrid
  tableHeaderBg: string;
  tableRowHover: string;
  tableRowSelected: string;
  tableBorder: string;

  // 10. Code & Editors
  codeBg: string;
  codeText: string;
  codeBorder: string;

  // 11. Feedback & States
  stateLoadingSpinner: string;
  stateEmptyIcon: string;
}

export const CANONICAL_LIGHT_THEME: SemanticThemeTokens = {
  mode: 'LIGHT',
  colorPrimary: '#0f172a',
  colorPrimaryForeground: '#ffffff',
  colorSecondary: '#f1f5f9',
  colorSecondaryForeground: '#0f172a',
  colorAccent: '#2563eb',
  colorAccentForeground: '#ffffff',

  surfaceBase: '#f8fafc',
  surfaceDefault: '#ffffff',
  surfaceElevated: '#ffffff',
  surfaceMuted: '#f1f5f9',
  surfaceSubtle: '#f8fafc',

  textPrimary: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#64748b',
  textOnColor: '#ffffff',

  borderSubtle: '#f1f5f9',
  borderDefault: '#e2e8f0',
  borderStrong: '#cbd5e1',
  borderFocus: '#2563eb',

  interactiveHover: 'rgba(15, 23, 42, 0.04)',
  interactiveActive: 'rgba(15, 23, 42, 0.08)',
  interactiveSelected: '#eff6ff',
  interactiveFocusRing: '#2563eb',
  interactiveDisabledBg: '#f1f5f9',
  interactiveDisabledText: '#94a3b8',

  statusSuccessBg: '#ecfdf5',
  statusSuccessText: '#065f46',
  statusSuccessBorder: '#a7f3d0',
  statusWarningBg: '#fffbeb',
  statusWarningText: '#92400e',
  statusWarningBorder: '#fde68a',
  statusDestructiveBg: '#fef2f2',
  statusDestructiveText: '#991b1b',
  statusDestructiveBorder: '#fecaca',
  statusInfoBg: '#eff6ff',
  statusInfoText: '#1e40af',
  statusInfoBorder: '#bfdbfe',

  inputBg: '#ffffff',
  inputBorder: '#cbd5e1',
  inputText: '#0f172a',
  inputPlaceholder: '#94a3b8',
  inputFocusBorder: '#2563eb',

  navBg: '#ffffff',
  navItemHover: '#f8fafc',
  navItemActive: '#f1f5f9',
  overlayBackdrop: 'rgba(15, 23, 42, 0.4)',
  dialogBg: '#ffffff',
  dialogBorder: '#e2e8f0',

  tableHeaderBg: '#f8fafc',
  tableRowHover: '#f8fafc',
  tableRowSelected: '#eff6ff',
  tableBorder: '#e2e8f0',

  codeBg: '#0f172a',
  codeText: '#f8fafc',
  codeBorder: '#1e293b',

  stateLoadingSpinner: '#2563eb',
  stateEmptyIcon: '#94a3b8'
};

export const CANONICAL_DARK_THEME: SemanticThemeTokens = {
  mode: 'DARK',
  colorPrimary: '#f8fafc',
  colorPrimaryForeground: '#0f172a',
  colorSecondary: '#1e293b',
  colorSecondaryForeground: '#f8fafc',
  colorAccent: '#3b82f6',
  colorAccentForeground: '#ffffff',

  surfaceBase: '#09090b',
  surfaceDefault: '#121215',
  surfaceElevated: '#18181b',
  surfaceMuted: '#27272a',
  surfaceSubtle: '#18181b',

  textPrimary: '#f4f4f5',
  textSecondary: '#a1a1aa',
  textMuted: '#71717a',
  textOnColor: '#ffffff',

  borderSubtle: '#27272a',
  borderDefault: '#3f3f46',
  borderStrong: '#52525b',
  borderFocus: '#60a5fa',

  interactiveHover: 'rgba(255, 255, 255, 0.05)',
  interactiveActive: 'rgba(255, 255, 255, 0.1)',
  interactiveSelected: '#1e293b',
  interactiveFocusRing: '#60a5fa',
  interactiveDisabledBg: '#27272a',
  interactiveDisabledText: '#52525b',

  statusSuccessBg: '#064e3b',
  statusSuccessText: '#6ee7b7',
  statusSuccessBorder: '#047857',
  statusWarningBg: '#78350f',
  statusWarningText: '#fde68a',
  statusWarningBorder: '#b45309',
  statusDestructiveBg: '#7f1d1d',
  statusDestructiveText: '#fca5a5',
  statusDestructiveBorder: '#b91c1c',
  statusInfoBg: '#1e3a8a',
  statusInfoText: '#93c5fd',
  statusInfoBorder: '#1d4ed8',

  inputBg: '#18181b',
  inputBorder: '#3f3f46',
  inputText: '#f4f4f5',
  inputPlaceholder: '#71717a',
  inputFocusBorder: '#60a5fa',

  navBg: '#121215',
  navItemHover: '#18181b',
  navItemActive: '#27272a',
  overlayBackdrop: 'rgba(0, 0, 0, 0.7)',
  dialogBg: '#18181b',
  dialogBorder: '#3f3f46',

  tableHeaderBg: '#18181b',
  tableRowHover: '#1f1f23',
  tableRowSelected: '#1e293b',
  tableBorder: '#27272a',

  codeBg: '#09090b',
  codeText: '#e4e4e7',
  codeBorder: '#27272a',

  stateLoadingSpinner: '#60a5fa',
  stateEmptyIcon: '#52525b'
};

export class UniversalThemeEngine {
  /**
   * Generates complete CSS Variables stylesheet including root, dark, and reduced-motion rules.
   */
  public generateCssVariables(lightOverrides?: Partial<SemanticThemeTokens>, darkOverrides?: Partial<SemanticThemeTokens>): string {
    const light = { ...CANONICAL_LIGHT_THEME, ...lightOverrides };
    const dark = { ...CANONICAL_DARK_THEME, ...darkOverrides };

    const toKebab = (str: string) => str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();

    let css = `/* ALPER DESIGN OS - Universal Semantic Theme Tokens */\n:root {\n`;
    for (const [key, value] of Object.entries(light)) {
      if (key === 'mode') continue;
      css += `  --alper-${toKebab(key)}: ${value};\n`;
    }
    css += `  --alper-motion-duration-fast: 150ms;\n`;
    css += `  --alper-motion-duration-normal: 250ms;\n`;
    css += `  --alper-motion-easing: cubic-bezier(0.16, 1, 0.3, 1);\n`;
    css += `}\n\n`;

    css += `[data-theme="dark"], .dark {\n`;
    for (const [key, value] of Object.entries(dark)) {
      if (key === 'mode') continue;
      css += `  --alper-${toKebab(key)}: ${value};\n`;
    }
    css += `}\n\n`;

    css += `@media (prefers-color-scheme: dark) {\n  :root:not([data-theme="light"]) {\n`;
    for (const [key, value] of Object.entries(dark)) {
      if (key === 'mode') continue;
      css += `    --alper-${toKebab(key)}: ${value};\n`;
    }
    css += `  }\n}\n\n`;

    css += `@media (prefers-reduced-motion: reduce) {\n`;
    css += `  *, ::before, ::after {\n`;
    css += `    animation-duration: 0.01ms !important;\n`;
    css += `    animation-iteration-count: 1 !important;\n`;
    css += `    transition-duration: 0.01ms !important;\n`;
    css += `    scroll-behavior: auto !important;\n`;
    css += `  }\n`;
    css += `  :root {\n`;
    css += `    --alper-motion-duration-fast: 0ms;\n`;
    css += `    --alper-motion-duration-normal: 0ms;\n`;
    css += `  }\n`;
    css += `}\n`;

    return css;
  }

  /**
   * Calculates WCAG 2.1 contrast ratio between two hex colors.
   * Returns ratio (e.g. 7.12) and whether it passes WCAG AA (4.5:1) and AAA (7:1).
   */
  public evaluateContrast(foregroundHex: string, backgroundHex: string): {
    ratio: number;
    passesAA: boolean;
    passesAAA: boolean;
    passesLargeText: boolean;
  } {
    const l1 = this.calculateLuminance(foregroundHex);
    const l2 = this.calculateLuminance(backgroundHex);
    const brightest = Math.max(l1, l2);
    const darkest = Math.min(l1, l2);
    const ratio = Number(((brightest + 0.05) / (darkest + 0.05)).toFixed(2));

    return {
      ratio,
      passesAA: ratio >= 4.5,
      passesAAA: ratio >= 7.0,
      passesLargeText: ratio >= 3.0
    };
  }

  /**
   * Generates inline script tag for SSR head to eliminate theme hydration flicker (FOUC).
   */
  public renderSSRThemeScript(storageKey = 'alper-theme-preference'): string {
    return `<script>(function(){try{var m=localStorage.getItem('${storageKey}');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var t=m==='dark'||(m!=='light'&&d)?'dark':'light';document.documentElement.setAttribute('data-theme',t);if(t==='dark'){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){}})();</script>`;
  }

  private calculateLuminance(hex: string): number {
    const cleanHex = hex.replace('#', '').trim();
    if (cleanHex.length !== 6 && cleanHex.length !== 3) {
      return 0.5; // fallback
    }
    const fullHex = cleanHex.length === 3
      ? cleanHex.split('').map((c) => c + c).join('')
      : cleanHex;

    const r = parseInt(fullHex.substring(0, 2), 16) / 255;
    const g = parseInt(fullHex.substring(2, 4), 16) / 255;
    const b = parseInt(fullHex.substring(4, 6), 16) / 255;

    const adjust = (val: number) => (val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4));

    return 0.2126 * adjust(r) + 0.7152 * adjust(g) + 0.0722 * adjust(b);
  }
}
