/**
 * A4 Smoke Test
 *
 * Verifies basic dual codegen functionality.
 * Must pass before Week 1 completion.
 */

import { generate } from '../src/codegen';
import { CodegenConfig, CodegenOutput } from '../src/types';

describe('A4 Dual Codegen Smoke Test', () => {
  const testConfig: CodegenConfig = {
    manifestPath: '../../../manifest.example.yaml',
    outputDir: './dist',
    options: {
      deterministic: true,
      target: 'typescript'
    }
  };

  it('should generate output from manifest', async () => {
    const output = await generate(testConfig);

    expect(output).toBeDefined();
    expect(output.files).toBeInstanceOf(Array);
    expect(output.files.length).toBeGreaterThan(0);
    expect(output.hash).toBeDefined();
    expect(output.hash.length).toBe(16);
  });

  it('should produce deterministic output', async () => {
    const output1 = await generate(testConfig);
    const output2 = await generate(testConfig);

    // Same input should produce same hash
    expect(output1.hash).toBe(output2.hash);
  });

  it('should include valid metadata', async () => {
    const output = await generate(testConfig);

    expect(output.metadata).toBeDefined();
    expect(output.metadata.version).toBe('0.1.0');
    expect(output.metadata.timestamp).toBeDefined();
    expect(output.metadata.manifestHash).toBeDefined();
    expect(output.metadata.durationMs).toBeGreaterThanOrEqual(0);
  });

  it('should be independent from A3', async () => {
    const output = await generate(testConfig);

    // Verify A4 markers in output (different from A3)
    const indexFile = output.files.find(f => f.path === 'index.ts');
    expect(indexFile).toBeDefined();
    expect(indexFile?.content).toContain('A4 Dual Codegen');
    expect(indexFile?.content).toContain('Independent implementation');
  });
});
