// @ts-nocheck
// Thin re-export shim for Vercel serverless function (per plan strategy).
// The prebuilt bundle is required; public assets are staged to api/public
// before packaging and pulled via includeFiles "api/public/**/*".
const mod = require('../vercel-server.js');
const app = mod && mod.default ? mod.default : mod;
export default app;
