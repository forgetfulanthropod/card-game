import { copyFileSync, renameSync, readFileSync, writeFileSync, unlinkSync, existsSync } from 'fs';
import path from 'path';

const pub = 'public';

const css = path.join(pub, 'dailyship.css');
const bak = css + '.bak';
const styled = path.join(pub, 'dailyship-styles.css');
const html = path.join(pub, 'index.html');

if (process.argv[2] === 'rename') {
  try { if (existsSync(css)) copyFileSync(css, bak); } catch(e){}
  try { if (existsSync(css)) renameSync(css, styled); } catch(e){}
  try {
    if (existsSync(html)) {
      let h = readFileSync(html, 'utf8').replace(/dailyship\.css/g, 'dailyship-styles.css');
      writeFileSync(html, h);
    }
  } catch(e){}
  console.log('renamed for vercel package');
} else if (process.argv[2] === 'restore') {
  try { if (existsSync(bak)) copyFileSync(bak, css); } catch(e){}
  try { if (existsSync(bak)) unlinkSync(bak); } catch(e){}
  try {
    if (existsSync(html)) {
      let h = readFileSync(html, 'utf8').replace(/dailyship-styles.css/g, 'dailyship.css');
      writeFileSync(html, h);
    }
  } catch(e){}
  console.log('restored');
}
