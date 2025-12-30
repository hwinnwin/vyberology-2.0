/**
 * A4 Dual Codegen - AST-Based Implementation
 *
 * INDEPENDENT from A3 - Uses AST node construction instead of templates.
 * Same semantic output, completely different generation approach.
 *
 * A4 APPROACH:
 * - Build Abstract Syntax Tree nodes
 * - Serialize AST to TypeScript code
 * - Structured code generation vs A3's template strings
 *
 * Owner: B-02 (A4 Owner) - Limn Prime Code Master
 */

import {
  CodegenConfig,
  CodegenOutput,
  GeneratedFile,
  Manifest,
  ASTNode,
  TypeAliasNode,
  InterfaceNode,
  ConstantNode,
  FunctionNode,
  ExportNode,
  PropertyNode,
  ParamNode
} from './types';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

const VERSION = '1.0.0';
const GENERATOR = 'a4-dual-ast';

/**
 * Generate code from manifest using AST-based approach
 *
 * A4 DIFFERENTIATOR: Builds AST nodes then serializes
 * vs A3's direct string template approach
 */
export async function generate(config: CodegenConfig): Promise<CodegenOutput> {
  const startTime = Date.now();

  // Parse manifest using regex-based parser (different from A3's line-by-line)
  const manifest = parseManifestRegex(config.manifestPath);
  const manifestHash = generateHash(JSON.stringify(manifest));

  // Build AST for each file, then serialize
  const files: GeneratedFile[] = [];

  // 1. Generate types via AST
  files.push(buildTypesFile(manifest));

  // 2. Generate constants via AST
  files.push(buildConstantsFile(manifest));

  // 3. Generate validators via AST
  files.push(buildValidatorsFile(manifest));

  // 4. Generate config via AST
  files.push(buildConfigFile(manifest));

  // 5. Generate index via AST
  files.push(buildIndexFile(files));

  const output: CodegenOutput = {
    files,
    metadata: {
      timestamp: new Date().toISOString(),
      version: VERSION,
      manifestHash,
      durationMs: Date.now() - startTime,
      generator: GENERATOR,
      fileCount: files.length
    },
    hash: ''
  };

  output.hash = generateOutputHash(output);

  return output;
}

// ============================================================================
// A4 UNIQUE: REGEX-BASED YAML PARSER (Different from A3's line parser)
// ============================================================================

function parseManifestRegex(manifestPath: string): Manifest {
  const content = fs.readFileSync(path.resolve(manifestPath), 'utf-8');

  // A4 approach: Use regex patterns to extract sections
  const result: any = {};

  // Extract version
  const versionMatch = content.match(/^version:\s*["']?([^"'\n]+)["']?/m);
  result.version = versionMatch ? versionMatch[1] : '2.0.0';

  // Extract project section
  result.project = extractSection(content, 'project', {
    name: /name:\s*["']?([^"'\n]+)["']?/,
    description: /description:\s*["']?([^"'\n]+)["']?/,
    repository: /repository:\s*["']?([^"'\n]+)["']?/
  });

  // Extract thresholds
  result.thresholds = extractNumericSection(content, 'thresholds', ['critical', 'low', 'nominal', 'optimal']);

  // Extract weights
  result.weights = extractNumericSection(content, 'weights', ['A3_governance', 'A4_architecture', 'A5_implementation', 'validation']);

  // Extract diamond_hands
  result.diamond_hands = {
    threshold: extractNumber(content, /diamond_hands:[\s\S]*?threshold:\s*([\d.]+)/),
    required_validation_score: extractNumber(content, /diamond_hands:[\s\S]*?required_validation_score:\s*([\d.]+)/),
    approval_required: content.includes('approval_required: true'),
    approvers: extractList(content, /diamond_hands:[\s\S]*?approvers:([\s\S]*?)(?=\n\w|\n\n|$)/)
  };

  // Extract thunder_strike
  result.thunder_strike = {
    validation_levels: extractList(content, /validation_levels:([\s\S]*?)(?=\n\s*\w+:|$)/),
    required_for_advancement: extractList(content, /required_for_advancement:([\s\S]*?)(?=\n\w|\n\n|$)/)
  };

  // Extract metrics
  result.metrics = extractMetrics(content);

  // Extract evidence
  result.evidence = {
    output_directory: extractString(content, /evidence:[\s\S]*?output_directory:\s*["']?([^"'\n]+)["']?/),
    formats: extractList(content, /evidence:[\s\S]*?formats:([\s\S]*?)(?=\n\s*\w+:|$)/),
    retention_days: extractNumber(content, /retention_days:\s*(\d+)/),
    required_artifacts: extractList(content, /required_artifacts:([\s\S]*?)(?=\n\w|\n\n|$)/)
  };

  // Extract CI
  result.ci = {
    trigger_on: extractList(content, /trigger_on:([\s\S]*?)(?=\n\s*\w+:|$)/),
    schedule: extractString(content, /schedule:\s*["']?([^"'\n]+)["']?/) || '0 */6 * * *',
    jobs: {}
  };

  return result as Manifest;
}

function extractSection(content: string, section: string, patterns: Record<string, RegExp>): any {
  const sectionMatch = content.match(new RegExp(`${section}:[\\s\\S]*?(?=\\n\\w+:|$)`));
  if (!sectionMatch) return {};

  const sectionContent = sectionMatch[0];
  const result: any = {};

  for (const [key, pattern] of Object.entries(patterns)) {
    const match = sectionContent.match(pattern);
    result[key] = match ? match[1] : '';
  }

  return result;
}

function extractNumericSection(content: string, section: string, keys: string[]): any {
  const result: any = {};
  const sectionMatch = content.match(new RegExp(`${section}:[\\s\\S]*?(?=\\n\\w+:|$)`));
  if (!sectionMatch) return result;

  for (const key of keys) {
    const match = sectionMatch[0].match(new RegExp(`${key}:\\s*([\\d.]+)`));
    result[key] = match ? parseFloat(match[1]) : 0;
  }

  return result;
}

function extractNumber(content: string, pattern: RegExp): number {
  const match = content.match(pattern);
  return match ? parseFloat(match[1]) : 0;
}

function extractString(content: string, pattern: RegExp): string {
  const match = content.match(pattern);
  return match ? match[1] : '';
}

function extractList(content: string, pattern: RegExp): string[] {
  const match = content.match(pattern);
  if (!match) return [];

  const listContent = match[1];
  const items: string[] = [];
  const itemMatches = listContent.matchAll(/-\s*["']?([^"'\n]+)["']?/g);

  for (const item of itemMatches) {
    items.push(item[1].trim());
  }

  return items;
}

function extractMetrics(content: string): Record<string, any> {
  const metrics: Record<string, any> = {};
  const metricsSection = content.match(/metrics:([\s\S]*?)(?=\nevidence:|$)/);
  if (!metricsSection) return metrics;

  const metricNames = ['coherence', 'alignment', 'velocity', 'stability', 'evidence_score'];

  for (const name of metricNames) {
    const metricMatch = metricsSection[1].match(new RegExp(`${name}:[\\s\\S]*?(?=\\n\\s{2}\\w+:|$)`));
    if (metricMatch) {
      metrics[name] = {
        description: extractString(metricMatch[0], /description:\s*["']?([^"'\n]+)["']?/),
        weight: extractNumber(metricMatch[0], /weight:\s*([\d.]+)/),
        sources: extractList(metricMatch[0], /sources:([\s\S]*?)(?=\n\s{2}\w+:|$)/)
      };
    }
  }

  return metrics;
}

// ============================================================================
// A4 UNIQUE: AST BUILDERS
// ============================================================================

function buildTypesFile(manifest: Manifest): GeneratedFile {
  const ast: ASTNode[] = [];

  // Build type aliases
  ast.push(createTypeAlias('FrequencyBand', "'critical' | 'low' | 'nominal' | 'optimal' | 'peak'"));

  // Build interfaces
  ast.push(createInterface('FrequencyThresholds', [
    { name: 'critical', type: 'number', optional: false, readonly: false },
    { name: 'low', type: 'number', optional: false, readonly: false },
    { name: 'nominal', type: 'number', optional: false, readonly: false },
    { name: 'optimal', type: 'number', optional: false, readonly: false }
  ]));

  ast.push(createInterface('ComponentWeights', [
    { name: 'A3_governance', type: 'number', optional: false, readonly: false },
    { name: 'A4_architecture', type: 'number', optional: false, readonly: false },
    { name: 'A5_implementation', type: 'number', optional: false, readonly: false },
    { name: 'validation', type: 'number', optional: false, readonly: false }
  ]));

  // Validation levels type
  const validationLevels = manifest.thunder_strike?.validation_levels || ['self_assessment', 'peer_review', 'external_validation', 'diamond_hands_final'];
  ast.push(createTypeAlias('ValidationLevel', validationLevels.map(l => `'${l}'`).join(' | ')));

  // Metric names type
  const metricNames = Object.keys(manifest.metrics || {});
  const metricType = metricNames.length > 0 ? metricNames.map(k => `'${k}'`).join(' | ') : "'coherence' | 'alignment' | 'velocity' | 'stability' | 'evidence_score'";
  ast.push(createTypeAlias('MetricName', metricType));

  ast.push(createInterface('MetricDefinition', [
    { name: 'name', type: 'MetricName', optional: false, readonly: false },
    { name: 'description', type: 'string', optional: false, readonly: false },
    { name: 'weight', type: 'number', optional: false, readonly: false },
    { name: 'sources', type: 'string[]', optional: false, readonly: false }
  ]));

  ast.push(createTypeAlias('RoleCode', "'B-01' | 'B-02' | 'B-03' | 'B-04' | 'B-05' | 'B-06' | 'B-07'"));

  ast.push(createInterface('RoleAssignment', [
    { name: 'code', type: 'RoleCode', optional: false, readonly: false },
    { name: 'name', type: 'string', optional: false, readonly: false },
    { name: 'assignee', type: 'string', optional: false, readonly: false },
    { name: 'category', type: "'owner' | 'validator' | 'authority'", optional: false, readonly: false }
  ]));

  // Evidence types
  const formats = manifest.evidence?.formats || ['json', 'yaml', 'markdown'];
  ast.push(createTypeAlias('EvidenceFormat', formats.map(f => `'${f}'`).join(' | ')));

  const artifacts = manifest.evidence?.required_artifacts || ['frequency_report', 'validation_logs', 'component_metrics', 'decision_record'];
  ast.push(createTypeAlias('RequiredArtifact', artifacts.map(a => `'${a}'`).join(' | ')));

  ast.push(createInterface('ProjectConfig', [
    { name: 'name', type: 'string', optional: false, readonly: false },
    { name: 'description', type: 'string', optional: false, readonly: false },
    { name: 'repository', type: 'string', optional: false, readonly: false },
    { name: 'version', type: 'string', optional: false, readonly: false }
  ]));

  ast.push(createTypeAlias('NotificationEvent', "'band_change' | 'validation_failed' | 'diamond_hands_ready' | 'critical_frequency' | 'poc_advancement'"));
  ast.push(createTypeAlias('NotificationChannel', "'slack' | 'email'"));

  const content = serializeAST(ast, 'types', manifest.version);

  return {
    path: 'types.ts',
    content,
    hash: generateHash(content),
    type: 'types'
  };
}

function buildConstantsFile(manifest: Manifest): GeneratedFile {
  const ast: ASTNode[] = [];
  const thresholds = manifest.thresholds || { critical: 0.3, low: 0.5, nominal: 0.7, optimal: 0.9 };
  const weights = manifest.weights || { A3_governance: 0.3, A4_architecture: 0.25, A5_implementation: 0.25, validation: 0.2 };

  // PROJECT constant
  ast.push(createConstant('PROJECT', 'ProjectConfig', {
    name: manifest.project?.name || 'LUMEN OS',
    description: manifest.project?.description || 'Governance + Validation System',
    repository: manifest.project?.repository || '',
    version: manifest.version || '2.0.0'
  }));

  // THRESHOLDS constant
  ast.push(createConstant('THRESHOLDS', 'FrequencyThresholds', thresholds));

  // WEIGHTS constant
  ast.push(createConstant('WEIGHTS', 'ComponentWeights', weights));

  // VALIDATION_LEVELS
  const validationLevels = manifest.thunder_strike?.validation_levels || ['self_assessment', 'peer_review', 'external_validation', 'diamond_hands_final'];
  ast.push(createConstant('VALIDATION_LEVELS', 'readonly ValidationLevel[]', validationLevels));

  const requiredLevels = manifest.thunder_strike?.required_for_advancement || ['self_assessment', 'peer_review', 'external_validation'];
  ast.push(createConstant('REQUIRED_FOR_ADVANCEMENT', 'readonly ValidationLevel[]', requiredLevels));

  // DIAMOND_HANDS
  ast.push(createConstant('DIAMOND_HANDS', null, {
    threshold: manifest.diamond_hands?.threshold || 0.7,
    requiredValidationScore: manifest.diamond_hands?.required_validation_score || 0.8,
    approvalRequired: manifest.diamond_hands?.approval_required ?? true,
    approvers: manifest.diamond_hands?.approvers || []
  }));

  // METRICS
  const metricsObj: any = {};
  for (const [key, val] of Object.entries(manifest.metrics || {})) {
    metricsObj[key] = {
      name: key,
      description: (val as any).description || '',
      weight: (val as any).weight || 0,
      sources: (val as any).sources || []
    };
  }
  ast.push(createConstant('METRICS', 'Record<string, MetricDefinition>', metricsObj));

  // EVIDENCE
  ast.push(createConstant('EVIDENCE', null, {
    outputDirectory: manifest.evidence?.output_directory || 'evidence/A7-bundle',
    formats: manifest.evidence?.formats || ['json', 'yaml', 'markdown'],
    retentionDays: manifest.evidence?.retention_days || 90,
    requiredArtifacts: manifest.evidence?.required_artifacts || []
  }));

  // CI
  ast.push(createConstant('CI', null, {
    triggerOn: manifest.ci?.trigger_on || ['push', 'pull_request'],
    schedule: manifest.ci?.schedule || '0 */6 * * *'
  }));

  const content = serializeConstantsAST(ast, manifest);

  return {
    path: 'constants.ts',
    content,
    hash: generateHash(content),
    type: 'constants'
  };
}

function buildValidatorsFile(manifest: Manifest): GeneratedFile {
  const ast: ASTNode[] = [];
  const thresholds = manifest.thresholds || { critical: 0.3, low: 0.5, nominal: 0.7, optimal: 0.9 };

  // classifyFrequency function
  ast.push(createFunction('classifyFrequency', [{ name: 'fTotal', type: 'number', optional: false }], 'FrequencyBand',
    `if (fTotal < ${thresholds.critical}) return 'critical';
  if (fTotal < ${thresholds.low}) return 'low';
  if (fTotal < ${thresholds.nominal}) return 'nominal';
  if (fTotal < ${thresholds.optimal}) return 'optimal';
  return 'peak';`
  ));

  // isDiamondHandsReady function
  ast.push(createFunction('isDiamondHandsReady',
    [{ name: 'fTotal', type: 'number', optional: false }, { name: 'validationScore', type: 'number', optional: false }],
    'boolean',
    `return fTotal >= DIAMOND_HANDS.threshold &&
         validationScore >= DIAMOND_HANDS.requiredValidationScore;`
  ));

  // isValidationRequired
  ast.push(createFunction('isValidationRequired', [{ name: 'level', type: 'ValidationLevel', optional: false }], 'boolean',
    `return (VALIDATION_LEVELS as readonly string[]).includes(level);`
  ));

  // isValidMetricValue
  ast.push(createFunction('isValidMetricValue', [{ name: 'value', type: 'number', optional: false }], 'boolean',
    `return value >= 0 && value <= 1;`
  ));

  // validateWeights
  ast.push(createFunction('validateWeights', [], 'boolean',
    `const sum = WEIGHTS.A3_governance +
              WEIGHTS.A4_architecture +
              WEIGHTS.A5_implementation +
              WEIGHTS.validation;
  return Math.abs(sum - 1.0) < 0.001;`
  ));

  // ComponentMetrics interface
  ast.push(createInterface('ComponentMetrics', [
    { name: 'coherence', type: 'number', optional: false, readonly: false },
    { name: 'alignment', type: 'number', optional: false, readonly: false },
    { name: 'velocity', type: 'number', optional: false, readonly: false },
    { name: 'stability', type: 'number', optional: false, readonly: false },
    { name: 'evidenceScore', type: 'number', optional: false, readonly: false }
  ]));

  // calculateComponentFrequency
  ast.push(createFunction('calculateComponentFrequency', [{ name: 'metrics', type: 'ComponentMetrics', optional: false }], 'number',
    `return (
    metrics.coherence * 0.25 +
    metrics.alignment * 0.25 +
    metrics.velocity * 0.15 +
    metrics.stability * 0.20 +
    metrics.evidenceScore * 0.15
  );`
  ));

  // calculateFTotal
  ast.push(createFunction('calculateFTotal',
    [{ name: 'components', type: 'number[]', optional: false }, { name: 'validationPassRate', type: 'number', optional: false }],
    'number',
    `if (components.length === 0) return 0;

  const rawFTotal = components.reduce((a, b) => a + b, 0) / components.length;
  const validationMultiplier = 0.8 + (0.2 * validationPassRate);

  return rawFTotal * validationMultiplier;`
  ));

  // ActionRecommendation type
  ast.push(createTypeAlias('ActionRecommendation', "'HALT' | 'CAUTION' | 'PROCEED' | 'ADVANCE' | 'EXECUTE'"));

  // getRecommendation
  ast.push(createFunction('getRecommendation', [{ name: 'band', type: 'FrequencyBand', optional: false }], 'ActionRecommendation',
    `switch (band) {
    case 'critical': return 'HALT';
    case 'low': return 'CAUTION';
    case 'nominal': return 'PROCEED';
    case 'optimal': return 'ADVANCE';
    case 'peak': return 'EXECUTE';
  }`
  ));

  // getRecommendationMessage
  ast.push(createFunction('getRecommendationMessage', [{ name: 'band', type: 'FrequencyBand', optional: false }], 'string',
    `switch (band) {
    case 'critical':
      return 'HALT: System requires immediate attention. Do not proceed with POC.';
    case 'low':
      return 'CAUTION: Address deficiencies before Thunder Strike review.';
    case 'nominal':
      return 'PROCEED: System stable. Continue with validation pipeline.';
    case 'optimal':
      return 'ADVANCE: Ready for Diamond Hands review.';
    case 'peak':
      return 'EXECUTE: Maximum coherence achieved. Full speed ahead.';
  }`
  ));

  const content = serializeValidatorsAST(ast);

  return {
    path: 'validators.ts',
    content,
    hash: generateHash(content),
    type: 'validators'
  };
}

function buildConfigFile(manifest: Manifest): GeneratedFile {
  const content = `/**
 * Generated Runtime Config - Vyberology 2.0
 * Generated by: ${GENERATOR}
 *
 * DO NOT EDIT - This file is auto-generated
 */

import { PROJECT, THRESHOLDS, WEIGHTS, DIAMOND_HANDS, EVIDENCE, CI } from './constants';
import type { FrequencyBand, ValidationLevel } from './types';
import { classifyFrequency, isDiamondHandsReady, getRecommendation, getRecommendationMessage } from './validators';

// ============================================================================
// RUNTIME CONFIG OBJECT
// ============================================================================

export const config = {
  project: PROJECT,
  thresholds: THRESHOLDS,
  weights: WEIGHTS,
  diamondHands: DIAMOND_HANDS,
  evidence: EVIDENCE,
  ci: CI,

  // Utility methods
  classifyFrequency,
  isDiamondHandsReady,
  getRecommendation,
  getRecommendationMessage
} as const;

// ============================================================================
// FREQUENCY REPORT GENERATOR
// ============================================================================

export interface FrequencyReport {
  timestamp: string;
  fTotal: number;
  band: FrequencyBand;
  diamondHandsReady: boolean;
  recommendation: string;
}

export function generateFrequencyReport(
  fTotal: number,
  validationScore: number
): FrequencyReport {
  const band = classifyFrequency(fTotal);

  return {
    timestamp: new Date().toISOString(),
    fTotal,
    band,
    diamondHandsReady: isDiamondHandsReady(fTotal, validationScore),
    recommendation: getRecommendationMessage(band)
  };
}

// ============================================================================
// EXPORT DEFAULT
// ============================================================================

export default config;
`;

  return {
    path: 'config.ts',
    content,
    hash: generateHash(content),
    type: 'config'
  };
}

function buildIndexFile(files: GeneratedFile[]): GeneratedFile {
  const exports = files
    .filter(f => f.path !== 'index.ts')
    .map(f => `export * from './${f.path.replace('.ts', '')}';`)
    .join('\n');

  const content = `/**
 * Vyberology 2.0 Generated Code
 * Generated by: ${GENERATOR}
 *
 * DO NOT EDIT - This file is auto-generated
 */

${exports}

// Default export
export { default as config } from './config';
`;

  return {
    path: 'index.ts',
    content,
    hash: generateHash(content),
    type: 'index'
  };
}

// ============================================================================
// AST NODE CREATORS
// ============================================================================

function createTypeAlias(name: string, value: string): TypeAliasNode {
  return { kind: 'type-alias', name, value, exported: true };
}

function createInterface(name: string, properties: PropertyNode[]): InterfaceNode {
  return { kind: 'interface', name, properties, exported: true };
}

function createConstant(name: string, type: string | null, value: any): ConstantNode {
  return { kind: 'constant', name, type: type || '', value, exported: true, asConst: true };
}

function createFunction(name: string, params: ParamNode[], returnType: string, body: string): FunctionNode {
  return { kind: 'function', name, params, returnType, body, exported: true };
}

// ============================================================================
// AST SERIALIZERS
// ============================================================================

function serializeAST(ast: ASTNode[], fileType: string, version: string): string {
  let output = `/**
 * Generated Types - Vyberology 2.0
 * Generated by: ${GENERATOR}
 * Manifest version: ${version}
 *
 * DO NOT EDIT - This file is auto-generated
 */

`;

  for (const node of ast) {
    output += serializeNode(node) + '\n\n';
  }

  return output;
}

function serializeConstantsAST(ast: ASTNode[], manifest: Manifest): string {
  let output = `/**
 * Generated Constants - Vyberology 2.0
 * Generated by: ${GENERATOR}
 *
 * DO NOT EDIT - This file is auto-generated
 */

import type {
  FrequencyThresholds,
  ComponentWeights,
  ValidationLevel,
  MetricDefinition,
  ProjectConfig,
  EvidenceFormat,
  RequiredArtifact
} from './types';

`;

  for (const node of ast) {
    output += serializeNode(node) + '\n\n';
  }

  return output;
}

function serializeValidatorsAST(ast: ASTNode[]): string {
  let output = `/**
 * Generated Validators - Vyberology 2.0
 * Generated by: ${GENERATOR}
 *
 * DO NOT EDIT - This file is auto-generated
 */

import type { FrequencyBand, ValidationLevel, MetricName } from './types';
import { THRESHOLDS, WEIGHTS, DIAMOND_HANDS, VALIDATION_LEVELS } from './constants';

`;

  for (const node of ast) {
    output += serializeNode(node) + '\n\n';
  }

  return output;
}

function serializeNode(node: ASTNode): string {
  switch (node.kind) {
    case 'type-alias':
      return `export type ${node.name} = ${node.value};`;

    case 'interface':
      const props = node.properties.map(p =>
        `  ${p.name}${p.optional ? '?' : ''}: ${p.type};`
      ).join('\n');
      return `export interface ${node.name} {\n${props}\n}`;

    case 'constant':
      const valueStr = serializeValue(node.value);
      const typeAnnotation = node.type ? `: ${node.type}` : '';
      return `export const ${node.name}${typeAnnotation} = ${valueStr}${node.asConst ? ' as const' : ''};`;

    case 'function':
      const params = node.params.map(p =>
        `${p.name}${p.optional ? '?' : ''}: ${p.type}`
      ).join(', ');
      return `export function ${node.name}(${params}): ${node.returnType} {\n  ${node.body}\n}`;

    case 'export':
      if (node.isDefault) {
        return `export default ${node.names[0]};`;
      }
      return `export { ${node.names.join(', ')} }${node.from ? ` from '${node.from}'` : ''};`;

    default:
      return '';
  }
}

function serializeValue(value: any, indent: number = 0): string {
  const spaces = '  '.repeat(indent);

  if (value === null || value === undefined) return 'null';
  if (typeof value === 'string') return `'${value}'`;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    const items = value.map(v => serializeValue(v, indent + 1));
    return `[\n${spaces}  ${items.join(`,\n${spaces}  `)}\n${spaces}]`;
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.length === 0) return '{}';
    const props = entries.map(([k, v]) =>
      `${spaces}  ${k}: ${serializeValue(v, indent + 1)}`
    );
    return `{\n${props.join(',\n')}\n${spaces}}`;
  }

  return String(value);
}

// ============================================================================
// HASHING (Same as A3 for compatibility)
// ============================================================================

function generateHash(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex').slice(0, 16);
}

function generateOutputHash(output: Omit<CodegenOutput, 'hash'>): string {
  const content = JSON.stringify({
    files: output.files.map(f => ({ path: f.path, hash: f.hash })),
    manifestHash: output.metadata.manifestHash
  });
  return generateHash(content);
}
