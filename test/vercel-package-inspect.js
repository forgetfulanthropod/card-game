// Real test that inspects the *generated* vercel function package after build.
// Drives the packaged artifacts (not source) to prove public assets via includeFiles
// and no unwanted data leaks inside the .func fs.
// Run after `npx vercel build --yes` (the buildCommand + function packaging).
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const funcRoot = '.vercel/output/functions/api/index.func';
const staticRoot = '.vercel/output/static';

if (!fs.existsSync(funcRoot)) {
  console.log('No generated .func dir (run vercel build first in this env) - skipping strict package asserts');
  console.log('VERCEL PACKAGE INSPECT: SKIPPED (no build output)');
  process.exit(0);
}

// 1. No leaks: no leveldb or server.log in the function
const leaks = [];
function findLeaks(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      findLeaks(p);
    } else if (f.endsWith('.ldb') || f.endsWith('server.log')) {
      leaks.push(p);
    }
  }
}
findLeaks(funcRoot);
assert.strictEqual(leaks.length, 0, 'no .ldb or server.log should be in .func: ' + leaks.join(','));

// 2. Static has the full public (1275 files)
const staticCount = fs.readdirSync(staticRoot, { recursive: true }).filter(f => {
  const p = path.join(staticRoot, f);
  return fs.existsSync(p) && fs.statSync(p).isFile();
}).length;
assert(staticCount >= 1270, 'static should have ~1275 files, got ' + staticCount);

// 3. Func has public/ dir with assets (via include + trace)
const funcPublic = path.join(funcRoot, 'public');
assert(fs.existsSync(funcPublic), 'func must have public/ from includeFiles');
const funcPublicFiles = fs.readdirSync(funcPublic, { recursive: true }).filter(f => {
  const p = path.join(funcPublic, f);
  return fs.existsSync(p) && fs.statSync(p).isFile();
});
assert(funcPublicFiles.length > 0, 'func/public should have files from include (at least the built js + some assets)');

// Check key built asset is there (dailyship from client build + include)
const hasDailyship = fs.existsSync(path.join(funcPublic, 'dailyship.js'));
assert(hasDailyship, 'dailyship.js should be in func/public via include');

console.log('VERCEL PACKAGE INSPECT:');
console.log('  leaks in func:', leaks.length, '(expected 0)');
console.log('  static files:', staticCount, '(~1275 full public)');
console.log('  func/public files:', funcPublicFiles.length, '(>0 via include + trace)');
console.log('  has dailyship in func:', hasDailyship);
console.log('VERCEL PACKAGE INSPECT: PASS');
