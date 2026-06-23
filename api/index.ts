// @ts-nocheck
// Thin re-export shim for Vercel serverless function.
// We require the prebuilt CJS bundle (produced by pnpm run build) so that
// @vercel/node does not attempt to compile the full TS source tree (which has
// alias/typing issues under vercel's tsc). This ensures clean packaging.
// The bundle contains the real Express app with /api handler + static public.

// Force nft tracing (at function entry) to include the *entire* public/ tree
// (index.html, dailyship.*, css, fonts, 1000+ images in assets/, etc.) inside
// the .func fs so express.static(process.cwd() + '/public') finds them at runtime.
import fs from 'fs';
import pth from 'path';
try {
  const pubDir = pth.join(__dirname, '..', 'public');
  if (fs.existsSync(pubDir)) {
    fs.readdirSync(pubDir, { recursive: true } as any);
    // Explicit reads to force key top-level assets into the function bundle
    fs.readFileSync(pth.join(pubDir, 'index.html'));
    fs.readFileSync(pth.join(pubDir, 'dailyship.css'));
    fs.readFileSync(pth.join(pubDir, 'Aesthet Nova Medium-Z5XWLMGF.otf'));
    fs.readFileSync(pth.join(pubDir, 'favicon.ico'));
  }
} catch {}

const mod = require('../vercel-server.js');
const app = mod && mod.default ? mod.default : mod;
export default app;
