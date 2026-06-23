import { execSync } from 'child_process'
import { readFileSync, writeFileSync, copyFileSync, rmSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Backup and temporarily rename dailyship.css during the buildCommand execution
// so that when vercel packages the function (with api/public staged), there is
// no "same filename without extension" conflict between dailyship.js and .css.
// Restore afterwards so the git tree is untouched.
const cssPath = path.join(__dirname, '..', 'public', 'dailyship.css')
const cssBak = cssPath + '.bak'
const htmlPath = path.join(__dirname, '..', 'public', 'index.html')
const htmlBak = htmlPath + '.bak'

try { copyFileSync(cssPath, cssBak) } catch (e) {}
try { copyFileSync(htmlPath, htmlBak) } catch (e) {}
try {
  if (require('fs').existsSync(cssPath)) {
    execSync('mv public/dailyship.css public/dailyship-styles.css 2>/dev/null || true', { stdio: 'inherit' })
  }
} catch (e) {}
try {
  const html = readFileSync(htmlPath, 'utf8').replace(/dailyship\.css/g, 'dailyship-styles.css')
  writeFileSync(htmlPath, html)
} catch (e) {}

// Selective copy of assets (unique names) and needed top-level files to api/public
// so includeFiles "api/public/**/*" pulls a full tree next to the handler.
execSync('rm -rf api/public && mkdir -p api/public', { stdio: 'inherit' })

const assetDirs = ['assets', 'logos', 'fonts', 'core-ui', 'intents', 'music', 'scenes', 'spines', 'effects', 'events', 'fx sequences', 'hex map', 'root', 'character classes', 'character profiles', 'cards', 'tutorial']
for (const d of assetDirs) {
  try { execSync(`cp -a "public/${d}" api/public/ 2>/dev/null || true`, { stdio: 'inherit' }) } catch (e) {}
}

const topFiles = ['index.html', 'Aesthet Nova Medium-Z5XWLMGF.otf', 'Aesthet-Nova-W05-Black-SBREWQ66.ttf', 'android-chrome-192x192.png', 'android-chrome-512x512.png', 'apple-touch-icon.png', 'favicon.ico', 'favicon-16x16.png', 'favicon-32x32.png', 'mushroom-bg.jpg', 'site.webmanifest', 'dailyship-styles.css']
for (const f of topFiles) {
  try { execSync(`cp -a "public/${f}" api/public/ 2>/dev/null || true`, { stdio: 'inherit' }) } catch (e) {}
}

execSync('rm -f api/public/dailyship.js api/public/*.map 2>/dev/null || true', { stdio: 'inherit' })

// restore source tree
try { copyFileSync(cssBak, cssPath) } catch (e) {}
try { copyFileSync(htmlBak, htmlPath) } catch (e) {}
try { execSync(`rm -f "${cssBak}" "${htmlBak}" 2>/dev/null || true`, { stdio: 'inherit' }) } catch (e) {}

console.log('staged (conflict-free) public assets to api/public for vercel packaging')
