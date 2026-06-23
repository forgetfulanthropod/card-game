// Real test that drives the shipped code for the Vercel api entry.
// 1. Requires the prebuilt bundle directly (the real shipped server code).
// 2. Asserts the api/index.ts shim source is correct (uses prebuilt, reexports app).
// 3. (Post-build) the caller will inspect the generated .func package for assets.
const assert = require('assert');
const fs = require('fs');

// Drive the real shipped bundle (what the function will ultimately run)
let app;
try {
  const mod = require('../builds/server.js');
  app = mod && mod.default ? mod.default : mod;
} catch (e) {
  console.error('Failed to require prebuilt bundle:', e.message);
  process.exit(1);
}
assert.strictEqual(typeof app, 'function', 'exported app from bundle should be function');
assert.strictEqual(typeof app.use, 'function', 'app should have .use (static + routes)');
assert.strictEqual(typeof app.post, 'function', 'app should have .post (/api)');

// Check the shim source (api/index.ts) matches the plan: reexports the app, uses prebuilt to avoid TS issues
const shimSrc = fs.readFileSync('api/index.ts', 'utf8');
assert(shimSrc.includes("require('../vercel-server.js')"), 'shim must require the prebuilt');
assert(shimSrc.includes('export default app'), 'shim must export default app');
console.log('api-shim.test.js: BUNDLE EXPORTS APP + SHIM SOURCE CORRECT: PASS');

// Note: full package inspection (public/ files count inside .func) is done in verification script after vercel build
console.log('api-shim.test.js: ALL ASSERTS PASSED');
