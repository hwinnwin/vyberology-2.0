/**
 * A5 Adjudicator Core
 *
 * Semantic comparison and adjudication logic.
 *
 * TODO: Implement full semantic comparison
 * Owner: B-03 (A5 Owner)
 */

import {
  ComparisonInput,
  AdjudicationVerdict,
  SemanticDiff,
  VerdictType,
  CodegenOutput
} from './types';

/**
 * Compare A3 and A4 outputs for semantic equivalence
 *
 * @param input - Comparison input with both outputs
 * @returns Array of semantic diffs
 */
export function compare(input: ComparisonInput): SemanticDiff[] {
  const diffs: SemanticDiff[] = [];
  const { a3Output, a4Output, options } = input;

  // Compare file counts
  const a3Paths = new Set(a3Output.files.map(f => f.path));
  const a4Paths = new Set(a4Output.files.map(f => f.path));

  // Check for missing files in A4
  for (const path of a3Paths) {
    if (!a4Paths.has(path)) {
      diffs.push({
        path,
        type: 'MISSING_FILE',
        severity: 'critical',
        description: `File exists in A3 but missing in A4`,
        a3Value: 'present',
        a4Value: 'missing'
      });
    }
  }

  // Check for extra files in A4
  for (const path of a4Paths) {
    if (!a3Paths.has(path)) {
      diffs.push({
        path,
        type: 'EXTRA_FILE',
        severity: 'critical',
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
      // Content differs - need semantic analysis
      const contentDiff = compareContent(
        a3File.content,
        a4File.content,
        a3File.path,
        options
      );
      diffs.push(...contentDiff);
    }
  }

  return diffs;
}

/**
 * Compare file content semantically
 */
function compareContent(
  a3Content: string,
  a4Content: string,
  path: string,
  options?: ComparisonInput['options']
): SemanticDiff[] {
  const diffs: SemanticDiff[] = [];

  let c1 = a3Content;
  let c2 = a4Content;

  // Apply normalization based on options
  if (options?.ignoreWhitespace) {
    c1 = normalizeWhitespace(c1);
    c2 = normalizeWhitespace(c2);
  }

  if (options?.ignoreComments) {
    c1 = removeComments(c1);
    c2 = removeComments(c2);
  }

  if (c1 !== c2) {
    // TODO: B-03 to implement proper semantic diff
    // For now, just report content difference
    diffs.push({
      path,
      type: 'CONTENT_DIFF',
      severity: 'major',
      description: 'File content differs between A3 and A4',
      a3Value: c1.slice(0, 100) + (c1.length > 100 ? '...' : ''),
      a4Value: c2.slice(0, 100) + (c2.length > 100 ? '...' : '')
    });
  }

  return diffs;
}

/**
 * Normalize whitespace for comparison
 */
function normalizeWhitespace(content: string): string {
  return content
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    .trim();
}

/**
 * Remove comments for comparison
 */
function removeComments(content: string): string {
  // Remove single-line comments
  let result = content.replace(/\/\/.*$/gm, '');
  // Remove multi-line comments
  result = result.replace(/\/\*[\s\S]*?\*\//g, '');
  return result;
}

/**
 * Full adjudication with verdict
 *
 * @param input - Comparison input
 * @returns Complete adjudication verdict
 */
export function adjudicate(input: ComparisonInput): AdjudicationVerdict {
  const diffs = compare(input);

  // Determine verdict based on diffs
  let verdict: VerdictType;
  let semanticallyEquivalent = false;
  let confidence = 1.0;

  const criticalDiffs = diffs.filter(d => d.severity === 'critical');
  const majorDiffs = diffs.filter(d => d.severity === 'major');
  const minorDiffs = diffs.filter(d => d.severity === 'minor');

  if (diffs.length === 0) {
    verdict = 'MATCH';
    semanticallyEquivalent = true;
    confidence = 1.0;
  } else if (criticalDiffs.length > 0) {
    verdict = 'MISMATCH';
    semanticallyEquivalent = false;
    confidence = 0.95;
  } else if (majorDiffs.length > 0) {
    verdict = 'PARTIAL_MATCH';
    semanticallyEquivalent = false;
    confidence = 0.8;
  } else {
    // Only minor diffs
    verdict = 'MATCH';
    semanticallyEquivalent = true;
    confidence = 0.9;
  }

  // Generate summary
  const summary = generateSummary(verdict, diffs);

  return {
    verdict,
    confidence,
    semanticallyEquivalent,
    diffs,
    summary,
    timestamp: new Date().toISOString()
  };
}

/**
 * Generate human-readable summary
 */
function generateSummary(verdict: VerdictType, diffs: SemanticDiff[]): string {
  switch (verdict) {
    case 'MATCH':
      return diffs.length === 0
        ? 'A3 and A4 outputs are identical.'
        : `A3 and A4 outputs are semantically equivalent (${diffs.length} minor differences).`;
    case 'MISMATCH':
      return `A3 and A4 outputs differ significantly. ${diffs.length} differences found.`;
    case 'PARTIAL_MATCH':
      return `A3 and A4 outputs partially match. ${diffs.length} differences require review.`;
    case 'ERROR':
      return 'Comparison could not be completed due to an error.';
    case 'INCONCLUSIVE':
      return 'Could not determine semantic equivalence.';
    default:
      return 'Unknown verdict.';
  }
}
