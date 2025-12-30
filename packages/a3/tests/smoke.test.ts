/**
 * A3 Smoke Test
 *
 * Verifies basic codegen functionality.
 * Must pass before Week 1 completion.
 */

import * as path from 'path';
import { generate } from '../src/codegen';
import { CodegenConfig, CodegenOutput } from '../src/types';

describe('A3 Codegen Smoke Test', () => {
  const testConfig: CodegenConfig = {
    manifestPath: path.resolve(__dirname, '../../../manifest.example.yaml'),
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
    expect(output.metadata.version).toBe('1.0.0');
    expect(output.metadata.timestamp).toBeDefined();
    expect(output.metadata.manifestHash).toBeDefined();
    expect(output.metadata.durationMs).toBeGreaterThanOrEqual(0);
  });

  it('should generate files with hashes', async () => {
    const output = await generate(testConfig);

    for (const file of output.files) {
      expect(file.path).toBeDefined();
      expect(file.content).toBeDefined();
      expect(file.hash).toBeDefined();
      expect(file.hash.length).toBe(16);
    }
  });
});
