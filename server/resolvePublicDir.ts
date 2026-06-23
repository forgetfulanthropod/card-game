import path from 'path';

/**
 * Resolve the directory Express should serve as static public assets.
 * In Vercel (lambda), we stage public contents to api/public before packaging,
 * so at runtime __dirname (next to handler) + /public gives the colocated tree.
 * Locally, use process.cwd()/public.
 */
export function resolvePublicDir(): string {
  if (process.env.VERCEL) {
    return path.join(__dirname, 'public');
  }
  return path.join(process.cwd(), 'public');
}
