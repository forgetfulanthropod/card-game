import { build as esbuild } from 'esbuild'
import { makeBuildInfo } from './makeBuildInfo.mjs'
import { fileURLToPath } from 'url'
import { checkEnv  } from './makeBuildInfo.mjs'

/*
  Build hack notes:
  - Watch mode: esbuild watch API changed; here we log note and do single build only.
    For dev iteration: re-run `npm run dev` (full) or manually `bash run server:build` then restart server.
    (No persistent watch in this compat setup.)
  - checkEnv may skip if no .env (for clean local no-crypto setup).
  - Hardcoded externals to avoid bundling server-only pkgs.
  - Output to builds/server.js ; run via `bash run dev` or `node builds/server.js` with DEV_STATIC_ASSETS.
*/

const args = process.argv.slice(2)
const shouldWatchArgv = args.length === 1 && args[0] === 'watch'
const envObj = makeBuildInfo('SERVER_')
console.log('build environment:', envObj)

if (fileURLToPath(import.meta.url) === process.argv[1]) buildServer()

export function buildServer(shouldWatch = shouldWatchArgv) {
    console.log('building server!!')
    checkEnv('server')
    const opts = {
        entryPoints: ['server/index.ts'],
        bundle: true,
        platform: 'node',
        keepNames: true,
        outfile: 'builds/server.js',
        sourcemap: true,
        allowOverwrite: true,
        external: ['classic-level', 'express', 'lodash', 'immer', 'sbaobab', 'winston', 'cors', 'socket.io', 'bad-words'],
        define: makeBuildInfo('SERVER_'),
    }
    // watch API changed in newer esbuild; for local dev just build once (re-run command to rebuild)
    if (shouldWatch) console.log('(watch requested but using single build for esbuild compat)')
    esbuild(opts)
        .then(() => console.log(`${time()}: server build succeeded`))
        .catch(err => console.error('SERVER BUILD FAILED:', err))
}

function time() {
    return new Date().toLocaleTimeString()
}
