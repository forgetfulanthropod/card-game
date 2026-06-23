import { execSync } from 'child_process';
import { readFileSync, writeFileSync, renameSync, existsSync, readdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { STAGED_REL } from './vercel-public-path.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const src = path.join(__dirname, '..', 'public');
const dest = path.join(__dirname, '..', STAGED_REL);

execSync(`rm -rf "${dest}"`, { stdio: 'inherit' });
execSync(`mkdir -p "${dest}"`, { stdio: 'inherit' });
execSync(`cp -a "${src}/." "${dest}/"`, { stdio: 'inherit' });

console.log('copied public to ' + STAGED_REL + ' (non-public name prevents vercel static extraction)');

// rename any .css that has .js mate using node (safe in mjs)
// (do NOT rm *.js; renaming the .css to *-styles.css gives unique basenames and avoids conflict)
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

console.log('staged public to ' + STAGED_REL + ' for vercel (conflict-free)');
