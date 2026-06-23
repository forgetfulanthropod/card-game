import { execSync } from 'child_process';
import { readFileSync, writeFileSync, renameSync, existsSync, readdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const src = path.join(__dirname, '..', 'public');
const dest = path.join(__dirname, '..', 'api', 'public');

execSync(`rm -rf "${dest}"`, { stdio: 'inherit' });
execSync(`mkdir -p "${dest}"`, { stdio: 'inherit' });
execSync(`cp -a "${src}/." "${dest}/"`, { stdio: 'inherit' });

console.log('copied public to api/public');

// remove .js files from staged api/public to prevent vercel basename conflict with their .css (dailyship, spin etc have same stem)
execSync(`rm -f "${dest}"/*.js "${dest}"/*.js.map 2>/dev/null || true`, { stdio: 'inherit' });

// rename any .css that has .js mate using node (safe in mjs)
const files = readdirSync(dest);
const cssFiles = files.filter(f => f.endsWith('.css'));
for (const css of cssFiles) {
  const base = css.replace(/\.css$/, '');
  const js = base + '.js';
  if (files.includes(js)) {
    const oldPath = path.join(dest, css);
    const newPath = path.join(dest, base + '-styles.css');
    renameSync(oldPath, newPath);
    console.log(`renamed ${css} -> ${base}-styles.css`);
  }
}

// update html
const htmlPath = path.join(dest, 'index.html');
if (existsSync(htmlPath)) {
  let html = readFileSync(htmlPath, 'utf8');
  html = html.replace(/dailyship\.css/g, 'dailyship-styles.css');
  writeFileSync(htmlPath, html);
  console.log('updated staged index.html');
}

console.log('staged public to api/public for vercel (conflict-free)');
