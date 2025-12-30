/**
 * Canonical Manifest Loader
 *
 * Shared utility for deterministic YAML parsing.
 * Used by A3, A4, and A5 packages.
 *
 * Requirements:
 * - Deterministic parsing
 * - Reject malformed manifest
 * - Return strongly typed structure
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import {
  Manifest,
  ManifestLoadResult,
  ValidationResult,
  ValidationError,
  ValidationWarning
} from './types';

/**
 * Load and parse a manifest file
 *
 * @param manifestPath - Path to the YAML manifest file
 * @returns ManifestLoadResult with parsed manifest or error
 */
export function loadManifest(manifestPath: string): ManifestLoadResult {
  try {
    const resolvedPath = path.resolve(manifestPath);

    if (!fs.existsSync(resolvedPath)) {
      return {
        success: false,
        error: `Manifest file not found: ${resolvedPath}`
      };
    }

    const content = fs.readFileSync(resolvedPath, 'utf-8');
    const manifest = parseYaml(content);

    const validationResult = validateManifest(manifest);

    if (!validationResult.valid) {
      return {
        success: false,
        error: `Manifest validation failed: ${validationResult.errors.map(e => e.message).join(', ')}`,
        validationResult
      };
    }

    return {
      success: true,
      manifest,
      validationResult
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to load manifest: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Parse YAML content into Manifest structure
 * Uses a deterministic line-by-line parser
 */
function parseYaml(content: string): Manifest {
  const lines = content.split('\n');
  const result: any = {};

  let currentSection: string | null = null;
  let currentSubSection: string | null = null;
  let currentList: string[] | null = null;
  let currentListKey: string | null = null;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip comments and empty lines
    if (trimmed.startsWith('#') || trimmed === '') continue;

    // Top-level key (no indentation)
    if (!line.startsWith(' ') && !line.startsWith('\t') && trimmed.includes(':')) {
      const colonIndex = trimmed.indexOf(':');
      const key = trimmed.substring(0, colonIndex).trim();
      const value = trimmed.substring(colonIndex + 1).trim();

      if (value) {
        result[key] = parseValue(value);
      } else {
        result[key] = {};
        currentSection = key;
        currentSubSection = null;
      }
      currentList = null;
      currentListKey = null;
      continue;
    }

    // Nested content
    if (currentSection && (line.startsWith('  ') || line.startsWith('\t'))) {
      const indent = line.search(/\S/);

      // List item
      if (trimmed.startsWith('- ')) {
        const listValue = trimmed.substring(2).trim();
        if (currentListKey && currentList) {
          currentList.push(parseValue(listValue) as string);
        }
        continue;
      }

      // Key-value pair
      if (trimmed.includes(':')) {
        const colonIndex = trimmed.indexOf(':');
        const key = trimmed.substring(0, colonIndex).trim();
        const value = trimmed.substring(colonIndex + 1).trim();

        if (indent <= 2) {
          // Second-level key
          currentSubSection = key;
          if (value) {
            result[currentSection][key] = parseValue(value);
            currentList = null;
            currentListKey = null;
          } else {
            // Start of a new subsection or list
            result[currentSection][key] = [];
            currentList = result[currentSection][key];
            currentListKey = key;
          }
        } else if (currentSubSection && indent > 2) {
          // Third-level key
          if (typeof result[currentSection][currentSubSection] !== 'object' ||
              Array.isArray(result[currentSection][currentSubSection])) {
            result[currentSection][currentSubSection] = {};
          }
          if (value) {
            result[currentSection][currentSubSection][key] = parseValue(value);
          } else {
            result[currentSection][currentSubSection][key] = [];
            currentList = result[currentSection][currentSubSection][key];
            currentListKey = key;
          }
        }
      }
    }
  }

  return normalizeManifest(result);
}

/**
 * Parse a YAML value string into appropriate type
 */
function parseValue(value: string): string | number | boolean {
  // Remove inline comments (# comment at end of line)
  let cleanValue = value;
  const commentIndex = value.indexOf('#');
  if (commentIndex > 0) {
    cleanValue = value.substring(0, commentIndex).trim();
  }

  // Remove quotes
  if ((cleanValue.startsWith('"') && cleanValue.endsWith('"')) ||
      (cleanValue.startsWith("'") && cleanValue.endsWith("'"))) {
    return cleanValue.slice(1, -1);
  }

  // Boolean
  if (cleanValue === 'true') return true;
  if (cleanValue === 'false') return false;

  // Number
  const num = parseFloat(cleanValue);
  if (!isNaN(num) && cleanValue.match(/^-?\d*\.?\d+$/)) {
    return num;
  }

  return cleanValue;
}

/**
 * Normalize parsed YAML into strongly-typed Manifest
 */
function normalizeManifest(raw: any): Manifest {
  return {
    version: raw.version || '2.0.0',
    project: {
      name: raw.project?.name || 'Unknown',
      description: raw.project?.description || '',
      repository: raw.project?.repository || ''
    },
    thresholds: {
      critical: raw.thresholds?.critical || 0.3,
      low: raw.thresholds?.low || 0.5,
      nominal: raw.thresholds?.nominal || 0.7,
      optimal: raw.thresholds?.optimal || 0.9
    },
    weights: {
      A3_governance: raw.weights?.A3_governance || 0.3,
      A4_architecture: raw.weights?.A4_architecture || 0.25,
      A5_implementation: raw.weights?.A5_implementation || 0.25,
      validation: raw.weights?.validation || 0.2
    },
    diamond_hands: {
      threshold: raw.diamond_hands?.threshold || 0.7,
      required_validation_score: raw.diamond_hands?.required_validation_score || 0.8,
      approval_required: raw.diamond_hands?.approval_required ?? true,
      approvers: Array.isArray(raw.diamond_hands?.approvers) ? raw.diamond_hands.approvers : []
    },
    thunder_strike: {
      validation_levels: Array.isArray(raw.thunder_strike?.validation_levels)
        ? raw.thunder_strike.validation_levels
        : ['self_assessment', 'peer_review', 'external_validation', 'diamond_hands_final'],
      required_for_advancement: Array.isArray(raw.thunder_strike?.required_for_advancement)
        ? raw.thunder_strike.required_for_advancement
        : ['self_assessment', 'peer_review', 'external_validation']
    },
    metrics: normalizeMetrics(raw.metrics || {}),
    evidence: {
      output_directory: raw.evidence?.output_directory || 'evidence/A7-bundle',
      formats: Array.isArray(raw.evidence?.formats) ? raw.evidence.formats : ['json', 'yaml', 'markdown'],
      retention_days: raw.evidence?.retention_days || 90,
      required_artifacts: Array.isArray(raw.evidence?.required_artifacts)
        ? raw.evidence.required_artifacts
        : ['frequency_report', 'validation_logs', 'component_metrics', 'decision_record']
    },
    ci: {
      trigger_on: Array.isArray(raw.ci?.trigger_on) ? raw.ci.trigger_on : ['push', 'pull_request'],
      schedule: raw.ci?.schedule || '0 */6 * * *',
      jobs: raw.ci?.jobs || {}
    },
    notifications: raw.notifications,
    roles: raw.roles
  };
}

function normalizeMetrics(metrics: any): Record<string, any> {
  const normalized: Record<string, any> = {};

  for (const [key, value] of Object.entries(metrics)) {
    if (typeof value === 'object' && value !== null) {
      normalized[key] = {
        description: (value as any).description || '',
        weight: (value as any).weight || 0,
        sources: Array.isArray((value as any).sources) ? (value as any).sources : []
      };
    }
  }

  return normalized;
}

/**
 * Validate manifest structure
 */
function validateManifest(manifest: Manifest): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Required fields
  if (!manifest.version) {
    errors.push({ path: 'version', message: 'Version is required', code: 'MISSING_VERSION' });
  }

  if (!manifest.project?.name) {
    errors.push({ path: 'project.name', message: 'Project name is required', code: 'MISSING_PROJECT_NAME' });
  }

  // Threshold validation
  const { critical, low, nominal, optimal } = manifest.thresholds;
  if (critical >= low) {
    errors.push({ path: 'thresholds', message: 'Critical threshold must be less than low', code: 'INVALID_THRESHOLDS' });
  }
  if (low >= nominal) {
    errors.push({ path: 'thresholds', message: 'Low threshold must be less than nominal', code: 'INVALID_THRESHOLDS' });
  }
  if (nominal >= optimal) {
    errors.push({ path: 'thresholds', message: 'Nominal threshold must be less than optimal', code: 'INVALID_THRESHOLDS' });
  }

  // Weight validation
  const weightSum = manifest.weights.A3_governance +
                   manifest.weights.A4_architecture +
                   manifest.weights.A5_implementation +
                   manifest.weights.validation;

  if (Math.abs(weightSum - 1.0) > 0.01) {
    warnings.push({ path: 'weights', message: `Weights sum to ${weightSum}, expected 1.0`, code: 'WEIGHT_SUM' });
  }

  // Diamond hands validation
  if (manifest.diamond_hands.threshold < 0 || manifest.diamond_hands.threshold > 1) {
    errors.push({ path: 'diamond_hands.threshold', message: 'Threshold must be between 0 and 1', code: 'INVALID_THRESHOLD' });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Generate hash for manifest content
 */
export function hashManifest(manifest: Manifest): string {
  const content = JSON.stringify(manifest, Object.keys(manifest).sort());
  return crypto.createHash('sha256').update(content).digest('hex').slice(0, 16);
}

/**
 * Generate hash for any content
 */
export function hashContent(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex').slice(0, 16);
}
