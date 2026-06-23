// Sole evidence gate. One atomic run that produces the canonical vercel-verify.* artifacts in SCRATCH.
// Chain: pnpm build + cp + stage + vercel build --yes ; then inspector writeReport(SCRATCH)
// All stdout tee'd to {SCRATCH}/vercel-verify.log
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const SCRATCH = process.env.SCRATCH || '/tmp/grok-goal-a44a4bf0c1f8/implementer';
fs.mkdirSync(SCRATCH, { recursive: true });

const logPath = path.join(SCRATCH, 'vercel-verify.log');
const jsonPath = path.join(SCRATCH, 'vercel-verify.json');

// helper to run and tee
function runAndTee(cmd, args, label) {
  console.log('===', label, '===');
  fs.appendFileSync(logPath, `\n=== ${label} ===\n`);
  const res = spawnSync(cmd, args, { stdio: ['inherit', 'pipe', 'pipe'], shell: true });
  const out = (res.stdout || '').toString() + (res.stderr || '').toString();
  fs.appendFileSync(logPath, out);
  process.stdout.write(out);
  if (res.status !== 0) {
    fs.appendFileSync(logPath, `\nSTEP FAILED: ${label} exit=${res.status}\n`);
    process.exit(res.status || 1);
  }
  return res;
}

// clean prior output for fresh
try { fs.rmSync('.vercel/output', { recursive: true, force: true }); } catch {}

runAndTee('pnpm', ['run', 'build'], 'pnpm run build');

runAndTee('cp', ['-f', 'builds/server.js', 'vercel-server.js'], 'cp server bundle');

runAndTee('node', ['scripts/stage-vercel-public.mjs'], 'stage to bundled-public');

runAndTee('npx', ['vercel', 'build', '--yes'], 'npx vercel build --yes');

runAndTee('node', ['scripts/rename-for-vercel.mjs', 'restore'], 'restore public names');

console.log('=== inspector writeReport ===');
fs.appendFileSync(logPath, '\n=== inspector writeReport ===\n');

// call the pure inspector to write canonical json + append to log
const { writeReport } = await import('../test/lib/vercel-func-inspect.mjs');
const report = writeReport(SCRATCH);

console.log('=== verify-vercel-package: DONE ===');
fs.appendFileSync(logPath, '\n=== verify-vercel-package: DONE ===\n');
console.log('log:', logPath);
console.log('json:', jsonPath);
