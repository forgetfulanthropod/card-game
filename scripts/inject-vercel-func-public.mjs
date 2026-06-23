// Inject the staged bundled-public into the generated func dir so that physical files
// are present inside .vercel/output/functions/.../api/bundled-public for inspection and runtime in lambda.
// This runs at the end of buildCommand, after vercel has started populating .vercel/output.
import { existsSync, mkdirSync, cpSync, rmSync } from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const staged = 'api/bundled-public';
const candidates = [
  '.vercel/output/functions/api/index.func',
  '.vercel/output/functions/api/index.js.func',
];

function inject() {
  if (!existsSync(staged)) {
    console.log('inject: no staged dir, skip');
    return;
  }
  const maxWait = 30000; // ms, give vercel time to write .vercel/output during/after cmd (long poll to catch late write)
  const start = Date.now();
  let injected = false;
  while (Date.now() - start < maxWait && !injected) {
    for (const funcRoot of candidates) {
      if (!existsSync(funcRoot)) continue;
      const target = path.join(funcRoot, 'api', 'bundled-public');
      try {
        if (existsSync(target)) {
          rmSync(target, { recursive: true, force: true });
        }
        mkdirSync(path.dirname(target), { recursive: true });
        cpSync(staged, target, { recursive: true, force: true });
        console.log(`inject: copied ${staged} -> ${target}`);
        injected = true;
        return;
      } catch (e) {
        console.error('inject error:', e.message);
      }
    }
    // brief sleep
    try { execSync('sleep 0.2', { stdio: 'ignore' }); } catch {}
  }
  if (!injected) {
    console.log('inject: no func dir appeared in time; rely on includeFiles + map for packaging');
  }
}

inject();
