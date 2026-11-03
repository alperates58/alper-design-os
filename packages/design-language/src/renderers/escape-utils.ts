/**
 * Context-Sensitive Output Encoding & URL Sanitization Utilities (Phase 3 P0 Section 3)
 * Prevents XSS, attribute injection, template directive execution, and unsafe URL schemes
 * across HTML/CSS/JS, React/TSX, Laravel Blade, and ASP.NET Razor renderers.
 */

export function escapeHtmlText(value: unknown): string {
  const str = String(value ?? '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function escapeHtmlAttr(value: unknown): string {
  const str = String(value ?? '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/`/g, '&#96;')
    .replace(/\r/g, '&#13;')
    .replace(/\n/g, '&#10;');
}

export function escapeHtmlComment(value: unknown): string {
  const str = String(value ?? '');
  return str
    .replace(/-->/g, '--&gt;')
    .replace(/--!>/g, '--!&gt;')
    .replace(/<!--/g, '&lt;!--')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function escapeJsxText(value: unknown): string {
  const str = String(value ?? '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\{/g, '&#123;')
    .replace(/\}/g, '&#125;');
}

export function escapeJsString(value: unknown): string {
  const str = String(value ?? '');
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$')
    .replace(/</g, '\\x3c')
    .replace(/>/g, '\\x3e')
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

export function escapeBladeText(value: unknown): string {
  return escapeHtmlText(value)
    .replace(/@/g, '&#64;')
    .replace(/\{/g, '&#123;')
    .replace(/\}/g, '&#125;');
}

export function escapeBladeSingleQuoted(value: unknown): string {
  return escapeBladeText(value)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'");
}

export function escapeRazorText(value: unknown): string {
  return escapeHtmlText(value).replace(/@/g, '@@');
}

export function escapeRazorDoubleQuoted(value: unknown): string {
  return escapeHtmlText(value)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/@/g, '@@');
}

export function sanitizeCssClassToken(value: unknown): string {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-');
}

export function sanitizeSafeUrl(url: unknown): string {
  const raw = String(url ?? '').trim();
  if (!raw) return '#';
  // Decode control characters and whitespace tricks before checking protocol
  const normalized = raw.replace(/[\u0000-\u0020]+/g, '').toLowerCase();
  if (
    normalized.startsWith('javascript:') ||
    normalized.startsWith('vbscript:') ||
    normalized.startsWith('data:') ||
    normalized.startsWith('file:')
  ) {
    return '#';
  }
  return escapeHtmlAttr(raw);
}
