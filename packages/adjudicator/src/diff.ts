/**
 * A5 Diff Builder
 *
 * Basic diff builder for comparing A3 and A4 outputs.
 *
 * Requirements:
 * - Compare JSON keys
 * - Return mismatches
 * - No semantic depth yet (POC level)
 */

import { CodegenOutput, SemanticDiff, DiffType, DiffSeverity } from './types';

export interface DiffResult {
  timestamp: string;
  a3Hash: string;
  a4Hash: string;
  totalDiffs: number;
  mismatches: DiffMismatch[];
  summary: DiffSummary;
}

export interface DiffMismatch {
  type: DiffType;
  severity: DiffSeverity;
  path: string;
  description: string;
  a3Value?: string;
  a4Value?: string;
}

export interface DiffSummary {
  filesMatch: boolean;
  hashMatch: boolean;
  criticalCount: number;
  majorCount: number;
  minorCount: number;
  infoCount: number;
}

/**
 * Build diff between A3 and A4 outputs
 *
 * @param a3Output - Output from A3 codegen
 * @param a4Output - Output from A4 codegen
 * @returns DiffResult with all mismatches
 */
export function buildDiff(a3Output: CodegenOutput, a4Output: CodegenOutput): DiffResult {
  const mismatches: DiffMismatch[] = [];

  // Compare file sets
  const a3Paths = new Set(a3Output.files.map(f => f.path));
  const a4Paths = new Set(a4Output.files.map(f => f.path));

  // Check for missing files in A4
  for (const path of a3Paths) {
    if (!a4Paths.has(path)) {
      mismatches.push({
        type: 'MISSING_FILE',
        severity: 'critical',
        path,
        description: `File exists in A3 but missing in A4`,
        a3Value: 'present',
        a4Value: 'missing'
      });
    }
  }

  // Check for extra files in A4
  for (const path of a4Paths) {
    if (!a3Paths.has(path)) {
      mismatches.push({
        type: 'EXTRA_FILE',
        severity: 'critical',
        path,
        description: `File exists in A4 but missing in A3`,
        a3Value: 'missing',
        a4Value: 'present'
      });
    }
  }

  // Compare matching files
  for (const a3File of a3Output.files) {
    const a4File = a4Output.files.find(f => f.path === a3File.path);
    if (!a4File) continue;

    // Hash comparison
    if (a3File.hash !== a4File.hash) {
      mismatches.push({
        type: 'HASH_MISMATCH',
        severity: 'major',
        path: a3File.path,
        description: `File hashes differ`,
        a3Value: a3File.hash,
        a4Value: a4File.hash
      });

      // Content diff (basic)
      const contentDiffs = compareContent(a3File.content, a4File.content, a3File.path);
      mismatches.push(...contentDiffs);
    }
  }

  // Compare metadata
  const metaDiffs = compareMetadata(a3Output.metadata, a4Output.metadata);
  mismatches.push(...metaDiffs);

  // Build summary
  const summary: DiffSummary = {
    filesMatch: [...a3Paths].every(p => a4Paths.has(p)) && [...a4Paths].every(p => a3Paths.has(p)),
    hashMatch: a3Output.hash === a4Output.hash,
    criticalCount: mismatches.filter(m => m.severity === 'critical').length,
    majorCount: mismatches.filter(m => m.severity === 'major').length,
    minorCount: mismatches.filter(m => m.severity === 'minor').length,
    infoCount: mismatches.filter(m => m.severity === 'info').length
  };

  return {
    timestamp: new Date().toISOString(),
    a3Hash: a3Output.hash,
    a4Hash: a4Output.hash,
    totalDiffs: mismatches.length,
    mismatches,
    summary
  };
}

/**
 * Compare file content (basic line diff)
 */
function compareContent(a3Content: string, a4Content: string, path: string): DiffMismatch[] {
  const mismatches: DiffMismatch[] = [];

  const a3Lines = a3Content.split('\n');
  const a4Lines = a4Content.split('\n');

  // Line count diff
  if (a3Lines.length !== a4Lines.length) {
    mismatches.push({
      type: 'CONTENT_DIFF',
      severity: 'minor',
      path,
      description: `Line count differs`,
      a3Value: `${a3Lines.length} lines`,
      a4Value: `${a4Lines.length} lines`
    });
  }

  // Check for key structural differences
  const a3Exports = extractExports(a3Content);
  const a4Exports = extractExports(a4Content);

  for (const exp of a3Exports) {
    if (!a4Exports.includes(exp)) {
      mismatches.push({
        type: 'CONTENT_DIFF',
        severity: 'major',
        path,
        description: `Export "${exp}" exists in A3 but not in A4`
      });
    }
  }

  for (const exp of a4Exports) {
    if (!a3Exports.includes(exp)) {
      mismatches.push({
        type: 'CONTENT_DIFF',
        severity: 'major',
        path,
        description: `Export "${exp}" exists in A4 but not in A3`
      });
    }
  }

  return mismatches;
}

/**
 * Extract export names from TypeScript content
 */
function extractExports(content: string): string[] {
  const exports: string[] = [];

  // Match export const/function/type/interface
  const patterns = [
    /export\s+const\s+(\w+)/g,
    /export\s+function\s+(\w+)/g,
    /export\s+type\s+(\w+)/g,
    /export\s+interface\s+(\w+)/g
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      exports.push(match[1]);
    }
  }

  return exports.sort();
}

/**
 * Compare metadata objects
 */
function compareMetadata(a3Meta: any, a4Meta: any): DiffMismatch[] {
  const mismatches: DiffMismatch[] = [];

  // Version comparison
  if (a3Meta.version !== a4Meta.version) {
    mismatches.push({
      type: 'CONTENT_DIFF',
      severity: 'info',
      path: 'metadata.version',
      description: 'Generator versions differ',
      a3Value: a3Meta.version,
      a4Value: a4Meta.version
    });
  }

  // Generator comparison (expected to differ)
  if (a3Meta.generator !== a4Meta.generator) {
    mismatches.push({
      type: 'CONTENT_DIFF',
      severity: 'info',
      path: 'metadata.generator',
      description: 'Generators differ (expected)',
      a3Value: a3Meta.generator || 'a3-primary',
      a4Value: a4Meta.generator || 'a4-dual'
    });
  }

  // Manifest hash should match
  if (a3Meta.manifestHash !== a4Meta.manifestHash) {
    mismatches.push({
      type: 'HASH_MISMATCH',
      severity: 'major',
      path: 'metadata.manifestHash',
      description: 'Manifest hashes differ - inputs may be different',
      a3Value: a3Meta.manifestHash,
      a4Value: a4Meta.manifestHash
    });
  }

  return mismatches;
}

/**
 * Generate JSON-serializable diff report
 */
export function generateDiffReport(result: DiffResult): object {
  return {
    version: '1.0.0',
    generator: 'a5-adjudicator',
    ...result,
    verdict: result.summary.criticalCount === 0 && result.summary.majorCount === 0
      ? 'MATCH'
      : result.summary.criticalCount > 0
        ? 'MISMATCH'
        : 'PARTIAL_MATCH'
  };
}
