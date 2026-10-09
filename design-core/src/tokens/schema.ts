import { z } from 'zod';

export type DTCGTokenType =
  | 'color'
  | 'dimension'
  | 'fontFamily'
  | 'fontWeight'
  | 'duration'
  | 'cubicBezier'
  | 'number'
  | 'shadow'
  | 'border';

export interface DTCGToken {
  $value: string | number | Record<string, unknown>;
  $type?: DTCGTokenType;
  $description?: string;
  $extensions?: Record<string, unknown>;
}

export type DTCGTokenNode = DTCGToken | { [key: string]: DTCGTokenNode };

export interface DTCGTokenFile {
  [key: string]: DTCGTokenNode;
}

export const DTCGTokenSchema: z.ZodType<DTCGToken> = z.object({
  $value: z.union([z.string(), z.number(), z.record(z.unknown())]),
  $type: z.enum([
    'color',
    'dimension',
    'fontFamily',
    'fontWeight',
    'duration',
    'cubicBezier',
    'number',
    'shadow',
    'border'
  ]).optional(),
  $description: z.string().optional(),
  $extensions: z.record(z.unknown()).optional()
});

export type TokenOutputFormat = 'css' | 'scss' | 'typescript' | 'tailwind-json';

export interface CompiledTokenOutput {
  format: TokenOutputFormat;
  filename: string;
  content: string;
}
