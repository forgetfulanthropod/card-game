// Pure inspector. Returns plain data only. No process.exit, no side effects except writeReport.
import fs from 'fs';
import path from 'path';
import { STAGED_REL, FUNC_REL } from '../../scripts/vercel-public-path.mjs';
import manifest from '../vercel-public-manifest.json' with { type: 'json' };

export function findFuncRoot() {
  const candidates = [
    '.vercel/output/functions/api/index.func',
    '.vercel/output/functions/api/index.js.func',
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

export function inspectVercelFunc(funcRoot = null) {
  const root = funcRoot || findFuncRoot();
  if (!root || !fs.existsSync(root)) {
    return { funcRoot: null, error: 'no func dir' };
  }

  // leaks (guarded)
  const leaks = [];
  function walkLeaks(dir) {
    let entries;
    try { entries = fs.readdirSync(dir); } catch { return; }
    for (const f of entries) {
      const p = path.join(dir, f);
      let st;
      try { st = fs.statSync(p); } catch { continue; }
      if (st.isDirectory()) walkLeaks(p);
      else if (f.endsWith('.ldb') || f.endsWith('server.log')) leaks.push(p);
    }
  }
  walkLeaks(root);

  // vc-config map
  let filePathMap = {};
  const vcPath = path.join(root, '.vc-config.json');
  let filePathMapBundledCount = 0;
  try {
    if (fs.existsSync(vcPath)) {
      const vc = JSON.parse(fs.readFileSync(vcPath, 'utf8'));
      filePathMap = vc.filePathMap || {};
      filePathMapBundledCount = Object.keys(filePathMap).filter(k => k.includes(FUNC_REL + '/')).length;
    }
  } catch {}

  // manifest hits (authoritative via map)
  const manifestHits = {};
  for (const req of manifest.required) {
    const key = FUNC_REL + '/' + req;  // e.g. api/bundled-public/...
    const inMap = !!filePathMap[key] || Object.keys(filePathMap).some(k => k === key || k.endsWith('/' + req));
    manifestHits[req] = { inMap };
  }

  // physical bundled (guarded, may be partial due to extraction)
  const physDir = path.join(root, FUNC_REL);
  let physicalBundledFiles = [];
  if (fs.existsSync(physDir)) {
    function walkPhys(dir, base = '') {
      let entries;
      try { entries = fs.readdirSync(dir); } catch { return; }
      for (const f of entries) {
        const p = path.join(dir, f);
        let st;
        try { st = fs.statSync(p); } catch { continue; }
        const rel = path.join(base, f);
        if (st.isDirectory()) walkPhys(p, rel);
        else physicalBundledFiles.push(rel);
      }
    }
    walkPhys(physDir);
  }

  // top level of func
  let funcTopLevel = [];
  try { funcTopLevel = fs.readdirSync(root); } catch {}

  // static count (guarded)
  let staticCount = 0;
  const staticRoot = '.vercel/output/static';
  if (fs.existsSync(staticRoot)) {
    try {
      const all = fs.readdirSync(staticRoot, { recursive: true });
      staticCount = all.filter(f => {
        try { return fs.statSync(path.join(staticRoot, f)).isFile(); } catch { return false; }
      }).length;
    } catch {}
  }

  return {
    funcRoot: root,
    leaks,
    filePathMapBundledCount,
    manifestHits,
    physicalBundledFiles,
    funcTopLevel,
    staticCount,
  };
}

export function writeReport(scratchDir) {
  const scratch = scratchDir || process.env.SCRATCH || '/tmp/grok-goal-a44a4bf0c1f8/implementer';
  const data = inspectVercelFunc();
  const logPath = path.join(scratch, 'vercel-verify.log');
  const jsonPath = path.join(scratch, 'vercel-verify.json');

  // write json
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2) + '\n');

  // append human ls summary to log (append mode)
  const lines = [];
  lines.push('=== vercel-verify report ===');
  lines.push('funcRoot: ' + (data.funcRoot || 'none'));
  lines.push('leaks: ' + data.leaks.length);
  lines.push('filePathMapBundledCount: ' + data.filePathMapBundledCount);
  lines.push('physicalBundledFiles count: ' + data.physicalBundledFiles.length);
  lines.push('staticCount: ' + data.staticCount);
  if (data.funcRoot) {
    const bp = path.join(data.funcRoot, 'api/bundled-public');
    lines.push('ls func/api/bundled-public (if exists):');
    if (fs.existsSync(bp)) {
      try {
        lines.push(fs.readdirSync(bp).slice(0, 30).join('\n'));
      } catch (e) { lines.push('err: ' + e.message); }
    } else {
      lines.push('(absent on disk)');
    }
  }
  lines.push('manifest sample:');
  for (const [k, v] of Object.entries(data.manifestHits || {}).slice(0, 6)) {
    lines.push('  ' + k + ': inMap=' + v.inMap);
  }
  fs.appendFileSync(logPath, lines.join('\n') + '\n');

  console.log('wrote', jsonPath, 'and appended to', logPath);
  return { logPath, jsonPath, data };
}
