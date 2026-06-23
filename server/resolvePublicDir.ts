import path from 'path';
import fs from 'fs';

/**
 * Resolve public dir for express.static.
 * In Vercel packaged func (after stage to api/bundled-public + include),
 * try candidates so we find the included tree (may be at api/bundled-public or sibling).
 * Locally: process.cwd()/public .
 */
export function resolvePublicDir(): string {
  if (process.env.VERCEL) {
    const candidates = [
      path.join(__dirname, 'bundled-public'),
      path.join(__dirname, 'api', 'bundled-public'),
      path.join(__dirname, 'public'),
      path.join(__dirname, 'api', 'public'),
    ];
    for (const c of candidates) {
      if (fs.existsSync(path.join(c, 'index.html'))) return c;
    }
    return path.join(__dirname, 'bundled-public');
  }
  return path.join(process.cwd(), 'public');
}
