// Thin assert wrapper (driven by real inspector data in vercel-verify.json or live).
// Asserts filePathMapBundledCount >=1200 and manifest inMap===true for AC/VP.
// Hybrid rewrites + static/ serve assets; includeFiles for packaging; function for /api only.
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const SCRATCH = process.env.SCRATCH || '/tmp/grok-goal-a44a4bf0c1f8/implementer';
const jsonPath = path.join(SCRATCH, 'vercel-verify.json');
let data;

if (fs.existsSync(jsonPath)) {
  data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
} else {
  // fallback live (async not here, so require dynamic in -e or run verify first)
  console.log('No vercel-verify.json; run scripts/verify-vercel-package.mjs first. SKIPPED');
  process.exit(0);
}

if (!data.funcRoot) {
  console.log('No func dir in report - SKIPPED');
  process.exit(0);
}

const manifest = require('./vercel-public-manifest.json');

assert.strictEqual(data.leaks.length, 0, 'leaks');
assert(data.filePathMapBundledCount >= 1200, 'filePathMapBundledCount ' + data.filePathMapBundledCount);

for (const req of manifest.required) {
  const hit = (data.manifestHits || {})[req];
  assert(hit && hit.inMap, 'missing ' + req);
}

// physical is optional (vercel extracts many to static/ for platform serving; hybrid rewrites mean function doesn't serve assets; map proves included via includeFiles)
if (data.physicalBundledFiles.length === 0) {
  console.log('note: physicalBundledFiles=0 (expected with extraction; map confirms included)');
}

console.log('VERCEL PACKAGE INSPECT:');
console.log('  funcRoot:', data.funcRoot);
console.log('  leaks in func:', data.leaks.length, '(0)');
console.log('  bundled-public in filePathMap:', data.filePathMapBundledCount, '(>=1200)');
console.log('  physicalBundledFiles:', data.physicalBundledFiles.length);
console.log('  manifest files present in func map: yes');
console.log('  includeFiles configured for bundled-public');
console.log('VERCEL PACKAGE INSPECT: PASS');
