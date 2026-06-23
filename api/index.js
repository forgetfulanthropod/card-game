// Thin adapter for Vercel serverless.
// pnpm run build (executed by vercel buildCommand) produces builds/server.js (the real bundled Express app).
// We re-export it so the api/ entry is recognized and public/** assets are included via config.
let mod = require('../builds/server.js');
if (mod && mod.default) mod = mod.default;
module.exports = mod;
