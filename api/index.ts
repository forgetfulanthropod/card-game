// @ts-nocheck
// Thin re-export shim for Vercel serverless function.
// The prebuilt bundle (vercel-server.js) is required; assets staged to api/bundled-public and
// included via vercel.json functions.includeFiles so they are present inside the func at runtime.
const mod = require('../vercel-server.js');
const app = mod && mod.default ? mod.default : mod;
export default app;
