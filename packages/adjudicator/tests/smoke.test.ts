/**
 * A5 Adjudicator Smoke Test
 *
 * Verifies basic adjudication functionality.
 * Must pass before Week 1 completion.
 */

import { compare, adjudicate } from '../src/compare';
import { ComparisonInput, CodegenOutput } from '../src/types';

describe('A5 Adjudicator Smoke Test', () => {
  // Mock A3 output
  const mockA3Output: CodegenOutput = {
    files: [
      {
        path: 'index.ts',
        content: 'export const foo = 1;',
        hash: 'abc123'
      }
    ],
    metadata: {
      timestamp: '2024-01-01T00:00:00Z',
      version: '0.1.0',
      manifestHash: 'manifest123',
      durationMs: 100
    },
    hash: 'a3hash'
  };

  // Mock A4 output (identical)
  const mockA4OutputIdentical: CodegenOutput = {
    files: [
      {
        path: 'index.ts',
        content: 'export const foo = 1;',
        hash: 'abc123'
      }
    ],
    metadata: {
      timestamp: '2024-01-01T00:00:01Z',
      version: '0.1.0',
      manifestHash: 'manifest123',
      durationMs: 150
    },
    hash: 'a4hash'
  };

  // Mock A4 output (different)
  const mockA4OutputDifferent: CodegenOutput = {
    files: [
      {
        path: 'index.ts',
        content: 'export const foo = 2;',
        hash: 'def456'
      }
    ],
    metadata: {
      timestamp: '2024-01-01T00:00:01Z',
      version: '0.1.0',
      manifestHash: 'manifest123',
      durationMs: 150
    },
    hash: 'a4hash-diff'
  };

  describe('compare', () => {
    it('should return no diffs for identical outputs', () => {
      const input: ComparisonInput = {
        a3Output: mockA3Output,
        a4Output: mockA4OutputIdentical
      };

      const diffs = compare(input);
      expect(diffs).toHaveLength(0);
    });

    it('should detect content differences', () => {
      const input: ComparisonInput = {
        a3Output: mockA3Output,
        a4Output: mockA4OutputDifferent
      };

      const diffs = compare(input);
      expect(diffs.length).toBeGreaterThan(0);
      expect(diffs[0].type).toBe('CONTENT_DIFF');
    });

    it('should detect missing files', () => {
      const a4Missing: CodegenOutput = {
        ...mockA4OutputIdentical,
        files: []
      };

      const input: ComparisonInput = {
        a3Output: mockA3Output,
        a4Output: a4Missing
      };

      const diffs = compare(input);
      expect(diffs.some(d => d.type === 'MISSING_FILE')).toBe(true);
    });
  });

  describe('adjudicate', () => {
    it('should return MATCH verdict for identical outputs', () => {
      const input: ComparisonInput = {
        a3Output: mockA3Output,
        a4Output: mockA4OutputIdentical
      };

      const verdict = adjudicate(input);
      expect(verdict.verdict).toBe('MATCH');
      expect(verdict.semanticallyEquivalent).toBe(true);
      expect(verdict.confidence).toBeGreaterThanOrEqual(0.9);
    });

    it('should return MISMATCH/PARTIAL_MATCH for different outputs', () => {
      const input: ComparisonInput = {
        a3Output: mockA3Output,
        a4Output: mockA4OutputDifferent
      };

      const verdict = adjudicate(input);
      expect(['MISMATCH', 'PARTIAL_MATCH']).toContain(verdict.verdict);
      expect(verdict.diffs.length).toBeGreaterThan(0);
    });

    it('should include timestamp in verdict', () => {
      const input: ComparisonInput = {
        a3Output: mockA3Output,
        a4Output: mockA4OutputIdentical
      };

      const verdict = adjudicate(input);
      expect(verdict.timestamp).toBeDefined();
      expect(new Date(verdict.timestamp).getTime()).not.toBeNaN();
    });

    it('should generate human-readable summary', () => {
      const input: ComparisonInput = {
        a3Output: mockA3Output,
        a4Output: mockA4OutputIdentical
      };

      const verdict = adjudicate(input);
      expect(verdict.summary).toBeDefined();
      expect(verdict.summary.length).toBeGreaterThan(0);
    });
  });
});
