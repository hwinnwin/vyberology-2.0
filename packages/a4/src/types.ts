/**
 * A4 Codegen Types
 *
 * Defines the interface for the dual codegen pipeline.
 * MUST be compatible with A3 types for adjudication comparison.
 *
 * NOTE: Output types mirror A3 for adjudicator compatibility.
 * The IMPLEMENTATION approach is completely different (AST-based vs template-based).
 */

// ============================================================================
// MANIFEST SCHEMA - Same structure as A3 for compatibility
// ============================================================================

export interface Manifest {
  version: string;
  project: ProjectConfig;
  thresholds: ThresholdConfig;
  weights: WeightConfig;
  diamond_hands: DiamondHandsConfig;
  thunder_strike: ThunderStrikeConfig;
  metrics: Record<string, MetricConfig>;
  evidence: EvidenceConfig;
  ci: CIConfig;
  notifications: NotificationConfig;
  roles: RoleConfig;
}

export interface ProjectConfig {
  name: string;
  description: string;
  repository: string;
}

export interface ThresholdConfig {
  critical: number;
  low: number;
  nominal: number;
  optimal: number;
}

export interface WeightConfig {
  A3_governance: number;
  A4_architecture: number;
  A5_implementation: number;
  validation: number;
}

export interface DiamondHandsConfig {
  threshold: number;
  required_validation_score: number;
  approval_required: boolean;
  approvers: string[];
}

export interface ThunderStrikeConfig {
  validation_levels: string[];
  required_for_advancement: string[];
}

export interface MetricConfig {
  description: string;
  weight: number;
  sources: string[];
}

export interface EvidenceConfig {
  output_directory: string;
  formats: string[];
  retention_days: number;
  required_artifacts: string[];
}

export interface CIConfig {
  trigger_on: string[];
  schedule: string;
  jobs: Record<string, CIJobConfig>;
}

export interface CIJobConfig {
  runs_on: string;
  timeout_minutes?: number;
  needs?: string;
  condition?: string;
}

export interface NotificationConfig {
  channels: NotificationChannel[];
}

export interface NotificationChannel {
  type: string;
  webhook_env?: string;
  recipients_env?: string;
  events: string[];
}

export interface RoleConfig {
  A3_owner: string;
  A4_owner: string;
  A5_owner: string;
  A7_evidence_lead: string;
  ci_owner: string;
  thunder_strike_squad: string[];
  diamond_hands_authority: string[];
}

// ============================================================================
// CODEGEN CONFIGURATION - Compatible with A3
// ============================================================================

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

  /** Include runtime validation */
  includeValidation?: boolean;

  /** Generate barrel exports */
  barrelExports?: boolean;
}

// ============================================================================
// CODEGEN OUTPUT - Must match A3 for adjudication
// ============================================================================

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

  /** File type for categorization */
  type?: 'types' | 'constants' | 'validators' | 'index' | 'config';
}

export interface GenerationMetadata {
  /** Timestamp of generation */
  timestamp: string;

  /** A4 version */
  version: string;

  /** Input manifest hash */
  manifestHash: string;

  /** Generation duration in ms */
  durationMs: number;

  /** Generator identifier */
  generator?: string;

  /** Number of files generated */
  fileCount?: number;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

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

// ============================================================================
// A4-SPECIFIC: AST NODE TYPES (Different approach from A3)
// ============================================================================

export type ASTNode =
  | TypeAliasNode
  | InterfaceNode
  | ConstantNode
  | FunctionNode
  | ExportNode;

export interface TypeAliasNode {
  kind: 'type-alias';
  name: string;
  value: string;
  exported: boolean;
}

export interface InterfaceNode {
  kind: 'interface';
  name: string;
  properties: PropertyNode[];
  exported: boolean;
}

export interface PropertyNode {
  name: string;
  type: string;
  optional: boolean;
  readonly: boolean;
}

export interface ConstantNode {
  kind: 'constant';
  name: string;
  type: string;
  value: any;
  exported: boolean;
  asConst: boolean;
}

export interface FunctionNode {
  kind: 'function';
  name: string;
  params: ParamNode[];
  returnType: string;
  body: string;
  exported: boolean;
}

export interface ParamNode {
  name: string;
  type: string;
  optional: boolean;
}

export interface ExportNode {
  kind: 'export';
  names: string[];
  from?: string;
  isDefault: boolean;
}
