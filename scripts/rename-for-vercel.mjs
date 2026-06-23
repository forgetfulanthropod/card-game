import { copyFileSync, renameSync, readFileSync, writeFileSync, unlinkSync, existsSync, readdirSync } from 'fs';
import path from 'path';

const pub = 'public';
const html = path.join(pub, 'index.html');

// generalize: for any css that shares basename stem with a .js in public, use *-styles.css
function doRename() {
  const files = readdirSync(pub);
  const cssFiles = files.filter(f => f.endsWith('.css'));
  for (const css of cssFiles) {
    const base = css.replace(/\.css$/, '');
    const js = base + '.js';
    if (files.includes(js)) {
      const oldPath = path.join(pub, css);
      const newName = base + '-styles.css';
      const newPath = path.join(pub, newName);
      try {
        if (existsSync(oldPath) && !existsSync(newPath)) {
          copyFileSync(oldPath, oldPath + '.bak');
          renameSync(oldPath, newPath);
          console.log(`rename-for-vercel: ${css} -> ${newName}`);
        }
      } catch(e){}
    }
  }
  try {
    if (existsSync(html)) {
      let h = readFileSync(html, 'utf8').replace(/dailyship\.css/g, 'dailyship-styles.css');
      writeFileSync(html, h);
    }
  } catch(e){}
}

function doRestore() {
  const files = readdirSync(pub);
  for (const f of files) {
    if (f.endsWith('.css.bak')) {
      const bakPath = path.join(pub, f);
      const orig = f.replace(/\.css\.bak$/, '.css');
      const origPath = path.join(pub, orig);
      try {
        if (existsSync(bakPath)) {
          copyFileSync(bakPath, origPath);
          unlinkSync(bakPath);
          console.log(`rename-for-vercel: restored ${orig}`);
        }
      } catch(e){}
    }
    if (f.endsWith('-styles.css')) {
      // also remove the temp renamed if .bak not used? but prefer bak path
    }
  }
  try {
    if (existsSync(html)) {
      let h = readFileSync(html, 'utf8').replace(/dailyship-styles.css/g, 'dailyship.css');
      writeFileSync(html, h);
    }
  } catch(e){}
}

if (process.argv[2] === 'rename') {
  doRename();
  console.log('renamed for vercel package');
} else if (process.argv[2] === 'restore') {
  doRestore();
  console.log('restored');
}
