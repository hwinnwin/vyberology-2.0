/**
 * A3 Codegen Types
 *
 * Defines the interface for the primary codegen pipeline.
 * These types must be compatible with A4 for adjudication.
 */

/**
 * Input configuration for code generation
 */
export interface CodegenConfig {
  /** Path to manifest file */
  manifestPath: string;

  /** Output directory for generated code */
  outputDir: string;

  /** Generation options */
  options?: CodegenOptions;
}

export interface CodegenOptions {
  /** Enable deterministic mode (default: true) */
  deterministic?: boolean;

  /** Include source maps */
  sourceMaps?: boolean;

  /** Target language */
  target?: 'typescript' | 'javascript';

  /** Verbose logging */
  verbose?: boolean;
}

/**
 * Output from code generation
 */
export interface CodegenOutput {
  /** Generated files */
  files: GeneratedFile[];

  /** Generation metadata */
  metadata: GenerationMetadata;

  /** Hash of output for comparison */
  hash: string;
}

export interface GeneratedFile {
  /** Relative path from output directory */
  path: string;

  /** File content */
  content: string;

  /** Content hash */
  hash: string;
}

export interface GenerationMetadata {
  /** Timestamp of generation */
  timestamp: string;

  /** A3 version */
  version: string;

  /** Input manifest hash */
  manifestHash: string;

  /** Generation duration in ms */
  durationMs: number;
}

/**
 * Error from code generation
 */
export interface CodegenError {
  /** Error code */
  code: string;

  /** Human-readable message */
  message: string;

  /** Source location if applicable */
  location?: ErrorLocation;

  /** Stack trace */
  stack?: string;
}

export interface ErrorLocation {
  file: string;
  line: number;
  column: number;
}
