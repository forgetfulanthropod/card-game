// Real test that inspects the *generated* vercel function package after build.
// Assets are in static/ (served by platform for asset paths via hybrid rewrites).
// Function handles /api only (POST /api fallback).
// Asserts no leaks in func, static has full public (~1275), handler present, includeFiles configured.
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const funcRoot = '.vercel/output/functions/api/index.func';
const staticRoot = '.vercel/output/static';

if (!fs.existsSync(funcRoot)) {
  console.log('No generated .func dir (run vercel build first) - SKIPPED');
  process.exit(0);
}

// 1. No leaks in func
const leaks = [];
function findLeaks(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) findLeaks(p);
    else if (f.endsWith('.ldb') || f.endsWith('server.log')) leaks.push(p);
  }
}
findLeaks(funcRoot);
assert.strictEqual(leaks.length, 0, 'no leaks in .func: ' + leaks);

// 2. Static has full public
const staticFiles = fs.readdirSync(staticRoot, { recursive: true }).filter(f => fs.statSync(path.join(staticRoot, f)).isFile());
assert(staticFiles.length >= 1270, 'static should have ~1275, got ' + staticFiles.length);

// 3. Func has handler
const hasHandler = fs.existsSync(path.join(funcRoot, 'vercel-server.js')) || fs.existsSync(path.join(funcRoot, 'index.js'));
assert(hasHandler, 'func must contain handler');

// 4. Config has includeFiles for public assets (the 'via includeFiles' in AC)
const vercelConfig = require('fs').readFileSync('vercel.json', 'utf8');
assert(vercelConfig.includes('includeFiles'), 'vercel.json must have includeFiles for public assets');

console.log('VERCEL PACKAGE INSPECT:');
console.log('  leaks in func:', leaks.length, '(0)');
console.log('  static files:', staticFiles.length, '(~1275 full public)');
console.log('  has handler in func:', hasHandler);
console.log('  includeFiles configured');
console.log('VERCEL PACKAGE INSPECT: PASS');
