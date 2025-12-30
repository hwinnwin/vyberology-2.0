/**
 * Evidence Bundle Generator
 *
 * Generates complete Week 1 evidence bundle including:
 * - A3 output
 * - A4 output
 * - Behaviour test results
 * - Diff report
 *
 * No signing yet (Week 2)
 */

import * as fs from 'fs';
import * as path from 'path';
import { generate as generateA3 } from '../packages/a3/src/codegen';
import { generate as generateA4 } from '../packages/a4/src/codegen';
import { buildDiff, generateDiffReport } from '../packages/adjudicator/src/diff';
import { adjudicate } from '../packages/adjudicator/src/compare';

const MANIFEST_PATH = path.resolve(__dirname, '../manifest.example.yaml');
const OUTPUT_DIR = path.resolve(__dirname, '../evidence/POC/w1');

interface EvidenceBundle {
  version: string;
  timestamp: string;
  week: number;
  generator: string;
  manifest: {
    path: string;
    hash: string;
  };
  a3: {
    hash: string;
    fileCount: number;
    generator: string;
    durationMs: number;
  };
  a4: {
    hash: string;
    fileCount: number;
    generator: string;
    durationMs: number;
  };
  adjudication: {
    verdict: string;
    confidence: number;
    semanticallyEquivalent: boolean;
    diffCount: number;
  };
  artifacts: string[];
}

async function generateEvidence() {
  console.log('📦 Generating Week 1 Evidence Bundle...\n');
  console.log('═'.repeat(60));

  try {
    const config = {
      manifestPath: MANIFEST_PATH,
      outputDir: './dist',
      options: {
        deterministic: true,
        target: 'typescript' as const
      }
    };

    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // === A3 Generation ===
    console.log('\n🔧 [1/4] Generating A3 output...');
    const a3Output = await generateA3(config);
    const a3Path = path.join(OUTPUT_DIR, 'a3-output.json');
    fs.writeFileSync(a3Path, JSON.stringify(a3Output, null, 2));
    console.log(`   ✅ A3 Hash: ${a3Output.hash}`);
    console.log(`   📁 Files: ${a3Output.files.length}`);

    // === A4 Generation ===
    console.log('\n🔧 [2/4] Generating A4 output...');
    const a4Output = await generateA4(config);
    const a4Path = path.join(OUTPUT_DIR, 'a4-output.json');
    fs.writeFileSync(a4Path, JSON.stringify(a4Output, null, 2));
    console.log(`   ✅ A4 Hash: ${a4Output.hash}`);
    console.log(`   📁 Files: ${a4Output.files.length}`);

    // === Diff Generation ===
    console.log('\n🔍 [3/4] Running A5 Adjudication...');
    const diffResult = buildDiff(a3Output, a4Output);
    const diffReport = generateDiffReport(diffResult);
    const diffPath = path.join(OUTPUT_DIR, 'diff.json');
    fs.writeFileSync(diffPath, JSON.stringify(diffReport, null, 2));

    // Full adjudication
    const adjudicationResult = adjudicate({
      a3Output,
      a4Output
    });
    const adjudicationPath = path.join(OUTPUT_DIR, 'adjudication.json');
    fs.writeFileSync(adjudicationPath, JSON.stringify(adjudicationResult, null, 2));
    console.log(`   ✅ Verdict: ${adjudicationResult.verdict}`);
    console.log(`   📊 Confidence: ${(adjudicationResult.confidence * 100).toFixed(1)}%`);

    // === Bundle Generation ===
    console.log('\n📋 [4/4] Creating evidence bundle...');
    const bundle: EvidenceBundle = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      week: 1,
      generator: 'vyberology-evidence-generator',
      manifest: {
        path: MANIFEST_PATH,
        hash: a3Output.metadata.manifestHash
      },
      a3: {
        hash: a3Output.hash,
        fileCount: a3Output.files.length,
        generator: a3Output.metadata.generator || 'a3-primary',
        durationMs: a3Output.metadata.durationMs
      },
      a4: {
        hash: a4Output.hash,
        fileCount: a4Output.files.length,
        generator: a4Output.metadata.generator || 'a4-dual',
        durationMs: a4Output.metadata.durationMs
      },
      adjudication: {
        verdict: adjudicationResult.verdict,
        confidence: adjudicationResult.confidence,
        semanticallyEquivalent: adjudicationResult.semanticallyEquivalent,
        diffCount: adjudicationResult.diffs.length
      },
      artifacts: [
        'a3-output.json',
        'a4-output.json',
        'diff.json',
        'adjudication.json',
        'bundle.json'
      ]
    };

    const bundlePath = path.join(OUTPUT_DIR, 'bundle.json');
    fs.writeFileSync(bundlePath, JSON.stringify(bundle, null, 2));

    // === Summary ===
    console.log('\n' + '═'.repeat(60));
    console.log('📊 WEEK 1 EVIDENCE BUNDLE COMPLETE');
    console.log('═'.repeat(60));
    console.log(`\n📁 Output Directory: ${OUTPUT_DIR}\n`);
    console.log('📋 Artifacts:');
    for (const artifact of bundle.artifacts) {
      const artifactPath = path.join(OUTPUT_DIR, artifact);
      const stats = fs.statSync(artifactPath);
      console.log(`   • ${artifact} (${(stats.size / 1024).toFixed(1)} KB)`);
    }

    console.log('\n📊 Summary:');
    console.log('─'.repeat(40));
    console.log(`   Manifest Hash:   ${bundle.manifest.hash}`);
    console.log(`   A3 Output Hash:  ${bundle.a3.hash}`);
    console.log(`   A4 Output Hash:  ${bundle.a4.hash}`);
    console.log(`   Verdict:         ${bundle.adjudication.verdict}`);
    console.log(`   Confidence:      ${(bundle.adjudication.confidence * 100).toFixed(1)}%`);
    console.log(`   Equivalent:      ${bundle.adjudication.semanticallyEquivalent ? 'Yes' : 'No'}`);
    console.log('─'.repeat(40));

    if (bundle.adjudication.verdict === 'MATCH') {
      console.log('\n✅ Week 1 Exit Criteria: SATISFIED\n');
    } else {
      console.log('\n⚠️  Week 1 Exit Criteria: REVIEW REQUIRED\n');
    }

    return bundle;
  } catch (error) {
    console.error('\n❌ Evidence generation FAILED');
    console.error(error);
    process.exit(1);
  }
}

generateEvidence();
