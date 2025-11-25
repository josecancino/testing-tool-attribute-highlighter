#!/usr/bin/env node

/**
 * ---------------------------------------------------------------------------
 * PACKAGE TOOL — Documentation
 * ---------------------------------------------------------------------------
 * This script packages the extension into a ZIP file.
 *
 * HOW TO RUN (NPM SCRIPTS)
 * ------------------------
 * When running through npm scripts, you MUST prefix CLI options with `--`
 * so that npm forwards them to the script.
 *
 * Examples:
 *
 * 1) Default packaging:
 *    npm run package
 *
 * 2) Enable strict mode:
 *    npm run package -- --strict
 *
 * 3) Enable verbose mode:
 *    npm run package -- --verbose
 *
 * 4) Set a custom output filename:
 *    npm run package -- --output build.zip
 *
 * 5) Combine multiple options:
 *    npm run package -- --strict --verbose --output release.zip
 *
 *
 * HOW TO RUN (DIRECT NODE EXECUTION)
 * -----------------------------------
 * You can run the script with Node without the double-dash:
 *
 *    node scripts/package.js --output build.zip
 *    node scripts/package.js --strict
 *    node scripts/package.js --verbose
 *
 *
 * AVAILABLE OPTIONS
 * -----------------
 *  -s, --strict      → Abort on any critical error
 *  -o, --output      → Custom output ZIP filename
 *  -v, --verbose     → Enable detailed logging
 *
 * If no output is provided, the name will be:
 *     attribute-highlighter-v<version>.zip
 *
 * The version is automatically taken from manifest.json.
 *
 * ---------------------------------------------------------------------------
 */

import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import chalk from 'chalk';
import { Command } from 'commander';

const program = new Command();

// ----------------------------
// CLI configuration
// ----------------------------
program
  .name('pack-extension')
  .description('Packages a browser extension or project into a ZIP file')
  .option('-s, --strict', 'Abort the process on any critical failure', false)
  .option('-o, --output <file>', 'Output file name for the ZIP package')
  .option('-v, --verbose', 'Enable detailed logging', false)
  .parse();

const options = program.opts();

// ----------------------------
// Logging helpers
// ----------------------------
function logInfo(msg) {
  console.log(chalk.blue('[INFO]'), msg);
}

function logSuccess(msg) {
  console.log(chalk.green('[OK]'), msg);
}

function logWarn(msg) {
  console.log(chalk.yellow('[WARN]'), msg);
}

function logError(msg) {
  console.error(chalk.red('[ERROR]'), msg);
}

// Exit immediately if strict mode is enabled
function exitIfStrict() {
  if (options.strict) {
    logError('Strict mode is enabled → aborting.');
    process.exit(1);
  }
}

// ----------------------------
// Read & validate manifest.json
// ----------------------------
function readManifest() {
  const manifestPath = './manifest.json';

  // Check if manifest.json exists
  if (!fs.existsSync(manifestPath)) {
    logError('manifest.json not found.');
    process.exit(1);
  }

  // Attempt to read and parse manifest.json
  try {
    const content = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    return content;
  } catch (err) {
    logError(`Invalid manifest.json: ${err.message}`);
    process.exit(1);
  }
}

// ----------------------------
// ZIP creation logic
// ----------------------------
async function createZip(files, outFile) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outFile);
    const archive = archiver('zip', { zlib: { level: 9 } });

    // Event: ZIP successfully created
    output.on('close', () => {
      logSuccess(`ZIP created (${archive.pointer()} bytes): ${outFile}`);
      resolve();
    });

    // Event: Non-fatal warnings
    archive.on('warning', (err) => {
      logWarn(err.message);
      if (err.code !== 'ENOENT') reject(err);
    });

    // Event: Fatal errors
    archive.on('error', (err) => {
      reject(err);
    });

    // Pipe archive data to file output
    archive.pipe(output);

    // Add files/directories to the archive
    files.forEach((file) => {
      if (!fs.existsSync(file)) {
        logWarn(`Skipping: ${file} (does not exist)`);
        return;
      }

      const stats = fs.statSync(file);

      if (stats.isDirectory()) {
        archive.directory(file, file);
      } else {
        archive.file(file, { name: path.basename(file) });
      }
    });

    // Finalize the ZIP archive
    archive.finalize();
  });
}

// ----------------------------
// Main entry point
// ----------------------------
async function main() {
  const manifest = readManifest();
  const version = manifest.version || '0.0.0';
  const outFile = options.output || `attribute-highlighter-v${version}.zip`;

  // Remove existing ZIP file if present
  if (fs.existsSync(outFile)) {
    try {
      fs.unlinkSync(outFile);
      logInfo(`Previous ZIP removed: ${outFile}`);
    } catch (err) {
      logWarn(`Could not remove previous ZIP: ${err.message}`);
      exitIfStrict();
    }
  }

  // Files and folders to include in the ZIP
  const filesToInclude = [
    'manifest.json',
    'content.js',
    'popup',
    'styles',
    'src',
    'icon16.png',
    'icon48.png',
    'icon128.png',
  ];

  // Verbose mode: show included files
  if (options.verbose) {
    logInfo('Including files:');
    filesToInclude.forEach(f => console.log(' -', f));
  }

  // Attempt to create the ZIP package
  try {
    await createZip(filesToInclude, outFile);
  } catch (err) {
    logError(`Failed to create ZIP: ${err.message}`);
    exitIfStrict();
  }
}

main();
