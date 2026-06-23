// @ts-nocheck
// Thin re-export shim for Vercel serverless function.
// We require the prebuilt CJS bundle (produced by pnpm run build) so that
// @vercel/node does not attempt to compile the full TS source tree (which has
// alias/typing issues under vercel's tsc). This ensures clean packaging.
// The bundle contains the real Express app with /api handler + static public.
const mod = require('../vercel-server.js');
const app = mod && mod.default ? mod.default : mod;
export default app;
