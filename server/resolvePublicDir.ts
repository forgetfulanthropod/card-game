import path from 'path';

/**
 * Resolve public dir for express.static.
 * When running under Vercel (the packaged function), use __dirname + '/public'
 * because we stage public contents to api/public before packaging and
 * includeFiles "api/public/**" + vercel layout results in public/ sibling
 * to the handler.
 * Locally: process.cwd()/public .
 */
export function resolvePublicDir(): string {
  if (process.env.VERCEL) {
    return path.join(__dirname, 'public');
  }
  return path.join(process.cwd(), 'public');
}
