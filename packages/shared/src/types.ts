/**
 * Shared Types for Vyberology 2.0
 *
 * Canonical type definitions used across A3, A4, and A5 packages.
 */

// ============================================================================
// MANIFEST SCHEMA - Canonical structure
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
  notifications?: NotificationConfig;
  roles?: RoleConfig;
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
  jobs?: Record<string, CIJobConfig>;
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
// CODEGEN OUTPUT - Shared format for A3/A4/A5
// ============================================================================

export interface CodegenOutput {
  files: GeneratedFile[];
  metadata: GenerationMetadata;
  hash: string;
}

export interface GeneratedFile {
  path: string;
  content: string;
  hash: string;
  type?: 'types' | 'constants' | 'validators' | 'index' | 'config';
}

export interface GenerationMetadata {
  timestamp: string;
  version: string;
  manifestHash: string;
  durationMs: number;
  generator?: string;
  fileCount?: number;
}

// ============================================================================
// VALIDATION RESULTS
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  path: string;
  message: string;
  code: string;
}

export interface ValidationWarning {
  path: string;
  message: string;
  code: string;
}

// ============================================================================
// MANIFEST LOADER RESULT
// ============================================================================

export interface ManifestLoadResult {
  success: boolean;
  manifest?: Manifest;
  error?: string;
  validationResult?: ValidationResult;
}
