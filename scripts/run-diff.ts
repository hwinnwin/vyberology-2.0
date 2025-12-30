/**
 * A5 Diff Runner Script
 *
 * Runs A3 and A4 codegen, then compares outputs using A5 adjudicator.
 * Produces diff.json in evidence bucket.
 */

import * as fs from 'fs';
import * as path from 'path';
import { generate as generateA3 } from '../packages/a3/src/codegen';
import { generate as generateA4 } from '../packages/a4/src/codegen';
import { buildDiff, generateDiffReport } from '../packages/adjudicator/src/diff';

const MANIFEST_PATH = path.resolve(__dirname, '../manifest.example.yaml');
const OUTPUT_DIR = path.resolve(__dirname, '../evidence/POC/w1');

async function runDiff() {
  console.log('🔍 Running A5 Diff Analysis...\n');

  try {
    const config = {
      manifestPath: MANIFEST_PATH,
      outputDir: './dist',
      options: {
        deterministic: true,
        target: 'typescript' as const
      }
    };

    // Generate A3 output
    console.log('📦 Generating A3 output...');
    const a3Output = await generateA3(config);
    console.log(`   Hash: ${a3Output.hash}`);

    // Generate A4 output
    console.log('📦 Generating A4 output...');
    const a4Output = await generateA4(config);
    console.log(`   Hash: ${a4Output.hash}\n`);

    // Build diff
    console.log('🔬 Building diff...');
    const diffResult = buildDiff(a3Output, a4Output);
    const report = generateDiffReport(diffResult);

    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Write diff report
    const diffPath = path.join(OUTPUT_DIR, 'diff.json');
    fs.writeFileSync(diffPath, JSON.stringify(report, null, 2));
    console.log(`💾 Diff report saved: ${diffPath}\n`);

    // Print summary
    console.log('📋 Diff Summary:');
    console.log('─'.repeat(50));
    console.log(`  A3 Hash: ${diffResult.a3Hash}`);
    console.log(`  A4 Hash: ${diffResult.a4Hash}`);
    console.log(`  Hash Match: ${diffResult.summary.hashMatch ? '✅' : '❌'}`);
    console.log(`  Files Match: ${diffResult.summary.filesMatch ? '✅' : '❌'}`);
    console.log(`  Total Diffs: ${diffResult.totalDiffs}`);
    console.log(`    - Critical: ${diffResult.summary.criticalCount}`);
    console.log(`    - Major: ${diffResult.summary.majorCount}`);
    console.log(`    - Minor: ${diffResult.summary.minorCount}`);
    console.log(`    - Info: ${diffResult.summary.infoCount}`);
    console.log('─'.repeat(50));

    // Verdict
    const verdict = (report as any).verdict;
    if (verdict === 'MATCH') {
      console.log('\n✅ VERDICT: MATCH - A3 and A4 outputs are equivalent\n');
    } else if (verdict === 'PARTIAL_MATCH') {
      console.log('\n⚠️  VERDICT: PARTIAL_MATCH - Some differences found\n');
    } else {
      console.log('\n❌ VERDICT: MISMATCH - Significant differences found\n');
    }

    // List mismatches if any
    if (diffResult.mismatches.length > 0) {
      console.log('📝 Mismatches:');
      for (const mismatch of diffResult.mismatches.slice(0, 10)) {
        console.log(`  [${mismatch.severity.toUpperCase()}] ${mismatch.path}: ${mismatch.description}`);
      }
      if (diffResult.mismatches.length > 10) {
        console.log(`  ... and ${diffResult.mismatches.length - 10} more`);
      }
    }

    return report;
  } catch (error) {
    console.error('❌ Diff Analysis FAILED');
    console.error(error);
    process.exit(1);
  }
}

runDiff();
