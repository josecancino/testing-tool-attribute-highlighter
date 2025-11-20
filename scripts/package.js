import fs from 'fs';
import { spawnSync } from 'child_process';

function main() {
  const manifestPath = 'manifest.json';
  if (!fs.existsSync(manifestPath)) {
    console.error('manifest.json not found');
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const version = manifest.version || '0.0.0';
  const outFile = `seo-extension-v${version}.zip`;

  // Remove existing zip if present
  try {
    if (fs.existsSync(outFile)) fs.unlinkSync(outFile);
  } catch {}

  const args = [
    '-r',
    outFile,
    'manifest.json',
    'content.js',
    'popup',
    'styles',
    'src',
    'icon16.png',
    'icon48.png',
    'icon128.png',
    '-x',
    '**/node_modules/**',
    '**/coverage/**',
    '**/*.test.js',
    '**/.DS_Store',
  ];

  const result = spawnSync('zip', args, { stdio: 'inherit' });
  if (result.status !== 0) {
    console.error('Failed to create zip package');
    process.exit(result.status || 1);
  }

  console.log(`\nPackage created: ${outFile}`);
}

main();