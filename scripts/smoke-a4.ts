/**
 * A4 Smoke Test Script
 *
 * Runs A4 codegen and dumps output to local folder.
 * No CI integration - dev-facing only.
 */

import * as fs from 'fs';
import * as path from 'path';
import { generate } from '../packages/a4/src/codegen';

const MANIFEST_PATH = path.resolve(__dirname, '../manifest.example.yaml');
const OUTPUT_DIR = path.resolve(__dirname, '../evidence/POC/w1');

async function runSmoke() {
  console.log('🔧 Running A4 Smoke Test...\n');

  try {
    const config = {
      manifestPath: MANIFEST_PATH,
      outputDir: './dist',
      options: {
        deterministic: true,
        target: 'typescript' as const
      }
    };

    console.log(`📄 Manifest: ${MANIFEST_PATH}`);
    console.log(`📁 Output: ${OUTPUT_DIR}\n`);

    const startTime = Date.now();
    const output = await generate(config);
    const duration = Date.now() - startTime;

    console.log(`✅ Generation complete in ${duration}ms`);
    console.log(`📊 Files generated: ${output.files.length}`);
    console.log(`🔑 Output hash: ${output.hash}`);
    console.log(`🔑 Manifest hash: ${output.metadata.manifestHash}\n`);

    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Write output to JSON
    const outputPath = path.join(OUTPUT_DIR, 'a4-output.json');
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log(`💾 Output saved: ${outputPath}`);

    // Write individual files (for inspection)
    const filesDir = path.join(OUTPUT_DIR, 'a4-files');
    if (!fs.existsSync(filesDir)) {
      fs.mkdirSync(filesDir, { recursive: true });
    }

    for (const file of output.files) {
      const filePath = path.join(filesDir, file.path);
      fs.writeFileSync(filePath, file.content);
    }
    console.log(`📂 Files written to: ${filesDir}`);

    // Summary
    console.log('\n📋 Summary:');
    console.log('─'.repeat(40));
    for (const file of output.files) {
      console.log(`  ${file.path} (${file.hash})`);
    }
    console.log('─'.repeat(40));
    console.log('\n✨ A4 Smoke Test PASSED\n');

    return output;
  } catch (error) {
    console.error('❌ A4 Smoke Test FAILED');
    console.error(error);
    process.exit(1);
  }
}

runSmoke();
