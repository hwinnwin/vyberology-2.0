/**
 * A5 Adjudicator Behaviour Tests
 *
 * Canonical behaviour tests that validate output structure
 * from both A3 and A4 codegen packages.
 *
 * These tests should:
 * - Validate metadata shape
 * - Validate at least 3 core fields
 * - Provide predictable comparisons
 */

import * as path from 'path';
import { CodegenOutput } from '../../src/types';

// Import A3 and A4 generate functions
// Note: In production, these would be separate packages
import { generate as generateA3 } from '../../../a3/src/codegen';
import { generate as generateA4 } from '../../../a4/src/codegen';

const MANIFEST_PATH = path.resolve(__dirname, '../../../../manifest.example.yaml');

describe('A5 Behaviour Tests', () => {
  let a3Output: CodegenOutput;
  let a4Output: CodegenOutput;

  beforeAll(async () => {
    const config = {
      manifestPath: MANIFEST_PATH,
      outputDir: './dist',
      options: { deterministic: true, target: 'typescript' as const }
    };

    a3Output = await generateA3(config);
    a4Output = await generateA4(config);
  });

  // =========================================================================
  // BEHAVIOUR TEST 1: Metadata exists and has required fields
  // =========================================================================
  describe('BT-01: Metadata Structure', () => {
    it('A3 metadata exists', () => {
      expect(a3Output.metadata).toBeDefined();
    });

    it('A4 metadata exists', () => {
      expect(a4Output.metadata).toBeDefined();
    });

    it('A3 metadata has timestamp', () => {
      expect(a3Output.metadata.timestamp).toBeDefined();
      expect(typeof a3Output.metadata.timestamp).toBe('string');
      expect(new Date(a3Output.metadata.timestamp).getTime()).not.toBeNaN();
    });

    it('A4 metadata has timestamp', () => {
      expect(a4Output.metadata.timestamp).toBeDefined();
      expect(typeof a4Output.metadata.timestamp).toBe('string');
      expect(new Date(a4Output.metadata.timestamp).getTime()).not.toBeNaN();
    });

    it('A3 metadata has version', () => {
      expect(a3Output.metadata.version).toBeDefined();
      expect(typeof a3Output.metadata.version).toBe('string');
    });

    it('A4 metadata has version', () => {
      expect(a4Output.metadata.version).toBeDefined();
      expect(typeof a4Output.metadata.version).toBe('string');
    });

    it('A3 metadata has manifestHash', () => {
      expect(a3Output.metadata.manifestHash).toBeDefined();
      expect(a3Output.metadata.manifestHash.length).toBeGreaterThan(0);
    });

    it('A4 metadata has manifestHash', () => {
      expect(a4Output.metadata.manifestHash).toBeDefined();
      expect(a4Output.metadata.manifestHash.length).toBeGreaterThan(0);
    });
  });

  // =========================================================================
  // BEHAVIOUR TEST 2: Files array is non-empty and well-structured
  // =========================================================================
  describe('BT-02: Files Structure', () => {
    it('A3 files array exists and is non-empty', () => {
      expect(a3Output.files).toBeDefined();
      expect(Array.isArray(a3Output.files)).toBe(true);
      expect(a3Output.files.length).toBeGreaterThan(0);
    });

    it('A4 files array exists and is non-empty', () => {
      expect(a4Output.files).toBeDefined();
      expect(Array.isArray(a4Output.files)).toBe(true);
      expect(a4Output.files.length).toBeGreaterThan(0);
    });

    it('A3 files have required properties', () => {
      for (const file of a3Output.files) {
        expect(file.path).toBeDefined();
        expect(file.content).toBeDefined();
        expect(file.hash).toBeDefined();
        expect(typeof file.path).toBe('string');
        expect(typeof file.content).toBe('string');
        expect(typeof file.hash).toBe('string');
      }
    });

    it('A4 files have required properties', () => {
      for (const file of a4Output.files) {
        expect(file.path).toBeDefined();
        expect(file.content).toBeDefined();
        expect(file.hash).toBeDefined();
        expect(typeof file.path).toBe('string');
        expect(typeof file.content).toBe('string');
        expect(typeof file.hash).toBe('string');
      }
    });
  });

  // =========================================================================
  // BEHAVIOUR TEST 3: Output hash exists
  // =========================================================================
  describe('BT-03: Output Hash', () => {
    it('A3 has output hash', () => {
      expect(a3Output.hash).toBeDefined();
      expect(a3Output.hash.length).toBe(16);
    });

    it('A4 has output hash', () => {
      expect(a4Output.hash).toBeDefined();
      expect(a4Output.hash.length).toBe(16);
    });
  });

  // =========================================================================
  // BEHAVIOUR TEST 4: Expected file types generated
  // =========================================================================
  describe('BT-04: Expected Files', () => {
    const expectedFiles = ['types.ts', 'constants.ts', 'validators.ts', 'config.ts', 'index.ts'];

    it('A3 generates all expected files', () => {
      const a3Paths = a3Output.files.map(f => f.path);
      for (const expected of expectedFiles) {
        expect(a3Paths).toContain(expected);
      }
    });

    it('A4 generates all expected files', () => {
      const a4Paths = a4Output.files.map(f => f.path);
      for (const expected of expectedFiles) {
        expect(a4Paths).toContain(expected);
      }
    });
  });

  // =========================================================================
  // BEHAVIOUR TEST 5: Determinism check
  // =========================================================================
  describe('BT-05: Determinism', () => {
    it('A3 produces same hash on repeated runs', async () => {
      const config = {
        manifestPath: MANIFEST_PATH,
        outputDir: './dist',
        options: { deterministic: true, target: 'typescript' as const }
      };

      const output1 = await generateA3(config);
      const output2 = await generateA3(config);

      expect(output1.hash).toBe(output2.hash);
    });

    it('A4 produces same hash on repeated runs', async () => {
      const config = {
        manifestPath: MANIFEST_PATH,
        outputDir: './dist',
        options: { deterministic: true, target: 'typescript' as const }
      };

      const output1 = await generateA4(config);
      const output2 = await generateA4(config);

      expect(output1.hash).toBe(output2.hash);
    });
  });
});

// =========================================================================
// EXPORT BEHAVIOUR TEST RESULTS
// =========================================================================

export interface BehaviourTestResult {
  testId: string;
  testName: string;
  package: 'a3' | 'a4';
  passed: boolean;
  details?: string;
}

export function generateBehaviourReport(results: BehaviourTestResult[]): object {
  const a3Results = results.filter(r => r.package === 'a3');
  const a4Results = results.filter(r => r.package === 'a4');

  return {
    timestamp: new Date().toISOString(),
    summary: {
      total: results.length,
      passed: results.filter(r => r.passed).length,
      failed: results.filter(r => !r.passed).length
    },
    a3: {
      total: a3Results.length,
      passed: a3Results.filter(r => r.passed).length,
      failed: a3Results.filter(r => !r.passed).length,
      tests: a3Results
    },
    a4: {
      total: a4Results.length,
      passed: a4Results.filter(r => r.passed).length,
      failed: a4Results.filter(r => !r.passed).length,
      tests: a4Results
    }
  };
}
