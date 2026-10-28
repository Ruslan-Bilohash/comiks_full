'use strict';

const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

const expected = process.argv[2];
if (!expected) {
  console.error('Usage: node tools/deploy-guard.cjs <expected-live-version>');
  process.exit(2);
}

let source = '';
try {
  source = execFileSync('curl.exe', ['-s', '--max-time', '25', `https://bilohash.com/comiks/data/index.js?t=${Date.now()}`], { encoding:'utf8' });
} catch (error) {
  console.error('ABORT: could not read the live version');
  process.exit(3);
}
const live = (source.match(/["']?version["']?\s*:\s*["']([^"']+)["']/) || [])[1] || '?';
if (live !== expected) {
  console.error(`ABORT: live version changed from ${expected} to ${live}`);
  process.exit(4);
}
console.log(`Live version confirmed: ${live}`);
const deploy = spawnSync(process.execPath, [path.join(__dirname, 'deploy.js')], { stdio:'inherit' });
process.exit(deploy.status == null ? 1 : deploy.status);
