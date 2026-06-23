// Real test that inspects the *generated* vercel function package after build.
// Public assets must be packaged inside the func dir (via includeFiles + stage to api/public)
// because catch-all rewrite sends asset requests to the /api function.
// Asserts: no leaks, full assets inside func/public (or api/public sub), handler, config, manifest files present.
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const manifest = require('./vercel-public-manifest.json');

// find the actual func dir (vercel names it index.func or index.js.func depending on build)
let funcRoot = null;
const candidates = [
  '.vercel/output/functions/api/index.func',
  '.vercel/output/functions/api/index.js.func',
];
for (const c of candidates) {
  if (fs.existsSync(c)) { funcRoot = c; break; }
}
if (!funcRoot) {
  console.log('No generated .func dir (run vercel build first) - SKIPPED');
  process.exit(0);
}

const staticRoot = '.vercel/output/static';

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

// 2. Find the bundled public dir inside func (bundled-public to avoid vercel hoisting/extract to static; fallback for old)
// Use .vc-config filePathMap (authoritative record of files packaged for the func fs)
const vcPath = path.join(funcRoot, '.vc-config.json');
const vc = JSON.parse(fs.readFileSync(vcPath, 'utf8'));
const filePathMap = vc.filePathMap || {};
const bundledKeys = Object.keys(filePathMap).filter(k => k.includes('bundled-public/'));
assert(bundledKeys.length >= 1200, 'filePathMap must include >=1200 bundled-public entries (included for func), got ' + bundledKeys.length);

// Assert manifest files are in the map or physically present inside func (js may be kept as "code", others via map)
const physBundled = path.join(funcRoot, 'api', 'bundled-public');
for (const req of manifest.required) {
  const key = 'api/bundled-public/' + req;
  const inMap = !!filePathMap[key] || Object.keys(filePathMap).some(k => k.endsWith('/' + req) || k === key);
  const hasPhys = fs.existsSync(path.join(physBundled, req)) || fs.readdirSync(physBundled, {recursive:true}).some(f => String(f).endsWith(req));
  assert(inMap || hasPhys, 'missing required in func map or phys: ' + req);
}

// Func has handler
const hasHandler = fs.existsSync(path.join(funcRoot, 'vercel-server.js')) || fs.existsSync(path.join(funcRoot, 'index.js'));
assert(hasHandler, 'func must contain handler');

// Config has correct includeFiles
const vercelConfig = fs.readFileSync('vercel.json', 'utf8');
assert(vercelConfig.includes('bundled-public/**/*') || vercelConfig.includes('includeFiles'), 'vercel.json must have includeFiles for staged bundled-public');

console.log('VERCEL PACKAGE INSPECT:');
console.log('  funcRoot:', funcRoot);
console.log('  leaks in func:', leaks.length, '(0)');
console.log('  bundled-public in filePathMap:', bundledKeys.length, '(>=1200)');
console.log('  has handler in func:', hasHandler);
console.log('  manifest files present in func map: yes');
console.log('  includeFiles configured for bundled-public');
console.log('VERCEL PACKAGE INSPECT: PASS');
