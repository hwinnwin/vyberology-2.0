/**
 * Manifest Loader Tests
 */

import * as path from 'path';
import { loadManifest, hashManifest, hashContent } from '../src/manifest-loader';

const MANIFEST_PATH = path.resolve(__dirname, '../../../manifest.example.yaml');

describe('Manifest Loader', () => {
  describe('loadManifest', () => {
    it('should load and parse manifest successfully', () => {
      const result = loadManifest(MANIFEST_PATH);

      expect(result.success).toBe(true);
      expect(result.manifest).toBeDefined();
      expect(result.error).toBeUndefined();
    });

    it('should return error for non-existent file', () => {
      const result = loadManifest('/non/existent/path.yaml');

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });

    it('should parse version correctly', () => {
      const result = loadManifest(MANIFEST_PATH);

      expect(result.manifest?.version).toBeDefined();
      expect(typeof result.manifest?.version).toBe('string');
    });

    it('should parse project config correctly', () => {
      const result = loadManifest(MANIFEST_PATH);

      expect(result.manifest?.project).toBeDefined();
      expect(result.manifest?.project.name).toBeDefined();
    });

    it('should parse thresholds correctly', () => {
      const result = loadManifest(MANIFEST_PATH);
      const thresholds = result.manifest?.thresholds;

      expect(thresholds).toBeDefined();
      expect(thresholds?.critical).toBeLessThan(thresholds?.low || 1);
      expect(thresholds?.low).toBeLessThan(thresholds?.nominal || 1);
      expect(thresholds?.nominal).toBeLessThan(thresholds?.optimal || 1);
    });
  });

  describe('hashManifest', () => {
    it('should produce deterministic hash', () => {
      const result = loadManifest(MANIFEST_PATH);
      if (!result.manifest) throw new Error('Manifest not loaded');

      const hash1 = hashManifest(result.manifest);
      const hash2 = hashManifest(result.manifest);

      expect(hash1).toBe(hash2);
      expect(hash1.length).toBe(16);
    });
  });

  describe('hashContent', () => {
    it('should produce deterministic hash for same content', () => {
      const content = 'test content';
      const hash1 = hashContent(content);
      const hash2 = hashContent(content);

      expect(hash1).toBe(hash2);
    });

    it('should produce different hash for different content', () => {
      const hash1 = hashContent('content1');
      const hash2 = hashContent('content2');

      expect(hash1).not.toBe(hash2);
    });
  });
});
