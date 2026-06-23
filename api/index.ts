// @ts-nocheck
// Thin re-export shim for Vercel serverless function (per plan strategy).
// The prebuilt bundle is required; public assets are staged to api/bundled-public (non-'public' name avoids hoisting to static output)
// + includeFiles "api/bundled-public/**/*" + rename to avoid basename conflict; results in bundled-public/ inside func fs for express.static.
// Force fs reads at top to aid @vercel/nft tracing so files are packaged inside func (not just hoisted to static).
const fs = require('fs');
const p = require('path');
function forceInclude(dir) {
  try {
    const items = fs.readdirSync(dir);
    for (const it of items) {
      const full = p.join(dir, it);
      const st = fs.statSync(full);
      if (st.isDirectory()) forceInclude(full);
      else { try { fs.readFileSync(full); } catch (e) {} }
    }
  } catch (e) {}
}
try {
  const bp = p.join(__dirname, 'bundled-public');
  if (fs.existsSync(bp)) {
    forceInclude(bp);
  }
  // extra explicit literal reads for top level SPA shell files (to force trace of html/css/fonts)
  const extras = ['index.html', 'dailyship.js', 'dailyship-styles.css', 'spin-triangle-smooth-styles.css', 'styles.css', 'favicon.ico', 'Aesthet Nova Medium-Z5XWLMGF.otf', 'Aesthet-Nova-W05-Black-SBREWQ66.ttf', 'site.webmanifest'];
  extras.forEach(n => {
    const f = p.join(bp, n);
    if (fs.existsSync(f)) { try { fs.readFileSync(f); } catch(e){} }
  });
} catch (e) {}
const mod = require('../vercel-server.js');
const app = mod && mod.default ? mod.default : mod;
export default app;
