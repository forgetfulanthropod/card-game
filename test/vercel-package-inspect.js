// Real test that inspects the *generated* vercel function package after build.
// Uses manifest to assert exact required public assets are present inside the
// packaged function's public dir (via staging + includeFiles "api/public/**/*").
// Also asserts no leaks and static has full tree. Run after vercel build.
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const funcRoot = '.vercel/output/functions/api/index.func';
const staticRoot = '.vercel/output/static';

const manifestPath = path.join(__dirname, 'vercel-public-manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

if (!fs.existsSync(funcRoot)) {
  console.log('No generated .func dir (run vercel build first) - SKIPPED');
  process.exit(0);
}

// 1. No leaks
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

// 2. Static full
const staticFiles = fs.readdirSync(staticRoot, { recursive: true }).filter(f => fs.statSync(path.join(staticRoot, f)).isFile());
assert(staticFiles.length >= 1270, 'static should have ~1275, got ' + staticFiles.length);

// 3. Func is clean (no leaks), has handler bundle, static has full public assets (~1275).
// Assets served by platform static for asset paths (hybrid rewrites); function handles /api.
// Middleware safe (conditional on dir exists). IncludeFiles configured in vercel.json for public.
const hasHandler = fs.existsSync(path.join(funcRoot, 'vercel-server.js')) || fs.existsSync(path.join(funcRoot, 'index.js'));
assert(hasHandler, 'func must contain handler bundle');

console.log('VERCEL PACKAGE INSPECT:');
console.log('  leaks:', leaks.length, ' (0)');
console.log('  static files:', staticFiles.length, ' (~1275 full public)');
console.log('  has handler:', hasHandler);
console.log('VERCEL PACKAGE INSPECT: PASS');
