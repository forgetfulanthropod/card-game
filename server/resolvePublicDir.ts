import path from 'path';

/**
 * Resolve public dir for express.static in the packaged func.
 * Matches the layout produced by stage (api/bundled-public) + includeFiles + vercel packaging.
 */
export function resolvePublicDir(): string {
  if (process.env.VERCEL) {
    return path.join(__dirname, 'api', 'bundled-public');
  }
  return path.join(process.cwd(), 'public');
}
