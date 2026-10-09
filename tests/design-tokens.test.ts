import { describe, it, expect } from 'vitest';
import {
  createDefaultTokenCompiler,
  defaultTokenFiles,
  DTCGTokenSchema,
  flattenDTCGTokens
} from '@alper-design-os/design-core';

describe('DTCG Design Tokens & Token Compiler', () => {
  it('validates all default tokens comply with DTCG specification', () => {
    for (const tokenFile of defaultTokenFiles) {
      const flattened = flattenDTCGTokens(tokenFile);
      expect(flattened.length).toBeGreaterThan(0);

      for (const token of flattened) {
        expect(token.name).toBeDefined();
        expect(token.value).toBeDefined();
        const validated = DTCGTokenSchema.safeParse({
          $value: token.value,
          $type: token.type,
          $description: token.description
        });
        expect(validated.success).toBe(true);
      }
    }
  });

  it('compiles tokens into CSS Custom Properties', () => {
    const compiler = createDefaultTokenCompiler();
    const css = compiler.compile('css');

    expect(css.format).toBe('css');
    expect(css.filename).toBe('tokens.css');
    expect(css.content).toContain(':root {');
    expect(css.content).toContain('--color-brand-primary:');
    expect(css.content).toContain('--spacing-base:');
    expect(css.content).toContain('--typography-fontFamily-sans:');
  });

  it('compiles tokens into SCSS variables', () => {
    const compiler = createDefaultTokenCompiler();
    const scss = compiler.compile('scss');

    expect(scss.format).toBe('scss');
    expect(scss.filename).toBe('_tokens.scss');
    expect(scss.content).toContain('$color-brand-primary:');
  });

  it('compiles tokens into TypeScript object constants', () => {
    const compiler = createDefaultTokenCompiler();
    const ts = compiler.compile('typescript');

    expect(ts.format).toBe('typescript');
    expect(ts.filename).toBe('tokens.ts');
    expect(ts.content).toContain('export const designTokens =');
    expect(ts.content).toContain('"primary": "#0284c7"');
  });

  it('compiles tokens into Tailwind theme extension format', () => {
    const compiler = createDefaultTokenCompiler();
    const tailwind = compiler.compile('tailwind-json');

    expect(tailwind.format).toBe('tailwind-json');
    const parsed = JSON.parse(tailwind.content);
    expect(parsed.theme.extend.colors['brand-primary']).toBeDefined();
  });
});
