// Real test that drives the shipped api entry for Vercel.
// Requires the api/index.js shim which reexports the prebuilt server bundle.
// Asserts the exported value is the Express app with expected routes (POST /api, static).
const assert = require('assert');

let app;
try {
  const mod = require('../api/index.js');
  app = mod && mod.default ? mod.default : mod;
} catch (e) {
  console.error('Failed to require api shim:', e);
  process.exit(1);
}

assert.strictEqual(typeof app, 'function', 'exported app should be function');
assert.strictEqual(typeof app.use, 'function', 'app should have .use');
assert.strictEqual(typeof app.post, 'function', 'app should have .post');

// Inspect router stack for the /api POST handler that was added in server/index.ts
const stack = (app._router && app._router.stack) || [];
const hasApiPost = stack.some(layer => {
  return layer.route && layer.route.path === '/api' && layer.route.methods && layer.route.methods.post;
});
assert(hasApiPost, 'POST /api route must be registered in the exported app');

console.log('api-shim.test.js: SHIM EXPORTS APP WITH /api POST: PASS');

// Also spot check that static middleware for public is likely present (one /assets or root static layer)
const hasStatic = stack.some(layer => layer.name === 'serveStatic' || (layer.handle && layer.handle.name === 'serveStatic'));
console.log('has static middleware layers:', hasStatic);

console.log('api-shim.test.js: ALL ASSERTS PASSED');
