/**
 * A5 Adjudicator Types
 *
 * Defines the interface for semantic comparison between A3 and A4 outputs.
 */

/**
 * Shared output format from A3/A4
 * This interface must match both A3 and A4 CodegenOutput
 */
export interface CodegenOutput {
  files: GeneratedFile[];
  metadata: GenerationMetadata;
  hash: string;
}

export interface GeneratedFile {
  path: string;
  content: string;
  hash: string;
}

export interface GenerationMetadata {
  timestamp: string;
  version: string;
  manifestHash: string;
  durationMs: number;
}

/**
 * Input for comparison
 */
export interface ComparisonInput {
  /** A3 codegen output */
  a3Output: CodegenOutput;

  /** A4 codegen output */
  a4Output: CodegenOutput;

  /** Comparison options */
  options?: ComparisonOptions;
}

export interface ComparisonOptions {
  /** Ignore whitespace differences */
  ignoreWhitespace?: boolean;

  /** Ignore comment differences */
  ignoreComments?: boolean;

  /** Semantic comparison mode */
  semanticMode?: 'strict' | 'relaxed';

  /** Maximum diff size before truncation */
  maxDiffSize?: number;
}

/**
 * Output from adjudication
 */
export interface AdjudicationVerdict {
  /** Overall verdict */
  verdict: VerdictType;

  /** Confidence score 0-1 */
  confidence: number;

  /** Semantic equivalence status */
  semanticallyEquivalent: boolean;

  /** Detailed diffs */
  diffs: SemanticDiff[];

  /** Summary message */
  summary: string;

  /** Timestamp */
  timestamp: string;
}

export type VerdictType =
  | 'MATCH'           // A3 and A4 produce semantically equivalent output
  | 'MISMATCH'        // A3 and A4 differ in meaningful ways
  | 'PARTIAL_MATCH'   // Some files match, some differ
  | 'ERROR'           // Could not complete comparison
  | 'INCONCLUSIVE';   // Cannot determine equivalence

/**
 * Semantic diff between outputs
 */
export interface SemanticDiff {
  /** File path */
  path: string;

  /** Diff type */
  type: DiffType;

  /** Severity */
  severity: DiffSeverity;

  /** Description of difference */
  description: string;

  /** A3 value (if applicable) */
  a3Value?: string;

  /** A4 value (if applicable) */
  a4Value?: string;

  /** Location in file */
  location?: DiffLocation;
}

export type DiffType =
  | 'MISSING_FILE'      // File exists in one output but not other
  | 'EXTRA_FILE'        // Unexpected file in output
  | 'CONTENT_DIFF'      // File content differs
  | 'SEMANTIC_DIFF'     // Semantically different
  | 'STYLE_DIFF'        // Style/formatting difference only
  | 'HASH_MISMATCH';    // Hash doesn't match content

export type DiffSeverity =
  | 'critical'   // Breaks equivalence
  | 'major'      // Significant difference
  | 'minor'      // Cosmetic difference
  | 'info';      // Informational only

export interface DiffLocation {
  startLine: number;
  endLine: number;
  startColumn?: number;
  endColumn?: number;
}
