export interface TokenDriftFinding {
  type: 'HARDCODED_HEX_COLOR' | 'MAGIC_SPACING_UNIT' | 'UNREGISTERED_FONT' | 'RAW_INLINE_STYLE';
  severity: 'WARNING' | 'CRITICAL';
  location: string;
  detectedValue: string;
  recommendedToken: string;
  message: string;
}

export interface TokenDriftReport {
  timestamp: string;
  isClean: boolean;
  driftScore: number; // 0-100 (100 = completely clean)
  totalFindings: number;
  findings: TokenDriftFinding[];
}

/**
 * Scans code or stylesheet contents for design token drift and anti-patterns.
 */
export function detectTokenDrift(content: string, filePath = 'unknown-file'): TokenDriftReport {
  const findings: TokenDriftFinding[] = [];

  // 1. Detect hardcoded hex colors (e.g., #ffffff, #123456, #f00)
  const hexColorRegex = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b/g;
  let match: RegExpExecArray | null;
  while ((match = hexColorRegex.exec(content)) !== null) {
    const hex = match[0];
    // Ignore pure black/white if in high contrast or SVG definitions, otherwise flag
    findings.push({
      type: 'HARDCODED_HEX_COLOR',
      severity: 'WARNING',
      location: `${filePath} (offset ${match.index})`,
      detectedValue: hex,
      recommendedToken: 'var(--alper-surface-default) or semantic text/border token',
      message: `Hardcoded hex color '${hex}' detected. Use canonical semantic token CSS variable instead.`
    });
  }

  // 2. Detect magic spacing units that break the 4px rhythmic scale
  // e.g. 7px, 13px, 17px, 23px, 29px, 35px
  const magicSpacingRegex = /\b([1-9][0-9]*\s*px)\b/g;
  while ((match = magicSpacingRegex.exec(content)) !== null) {
    const rawVal = match[0].trim();
    const num = parseInt(rawVal, 10);
    // If not a multiple of 4 (except 1px and 2px borders)
    if (num > 2 && num % 4 !== 0) {
      findings.push({
        type: 'MAGIC_SPACING_UNIT',
        severity: 'WARNING',
        location: `${filePath} (offset ${match.index})`,
        detectedValue: rawVal,
        recommendedToken: `space.${Math.round(num / 4) * 4} (var(--alper-space-${Math.round(num / 4)}))`,
        message: `Magic spacing value '${rawVal}' breaks 4px rhythmic scale. Use canonical spacing tokens.`
      });
    }
  }

  // 3. Detect raw style="" inline attribute usage
  const inlineStyleRegex = /style\s*=\s*["'][^"']+["']/gi;
  while ((match = inlineStyleRegex.exec(content)) !== null) {
    findings.push({
      type: 'RAW_INLINE_STYLE',
      severity: 'WARNING',
      location: `${filePath} (offset ${match.index})`,
      detectedValue: match[0],
      recommendedToken: 'CSS classes with canonical token variables',
      message: 'Raw inline styles bypass centralized token cascading and multi-theme adaptability.'
    });
  }

  const totalFindings = findings.length;
  const driftScore = Math.max(0, 100 - totalFindings * 5);

  return {
    timestamp: new Date().toISOString(),
    isClean: totalFindings === 0,
    driftScore,
    totalFindings,
    findings
  };
}
